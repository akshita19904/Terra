# TERRA | Waypoint Platform — System Architecture & Engineering Blueprint

**Author**: Senior Software Engineering Review  
**Target Architecture**: Modular Monolith for Urban Operations & Commute Optimization  
**Platform**: Terra Kernel (`@terra/platform`) & Waypoint Bounded Context (`@terra/waypoint`)  
**Repository**: [https://github.com/akshita19904/Terra](https://github.com/akshita19904/Terra)  

---

## 1. System Vision & Modular Architecture

### 1.1 Platform Vision
**Terra** is a modular urban operations platform designed to power connected civic applications. **Waypoint** is Terra's flagship module—an intelligent commute optimization and ride-matching platform.

Future platform modules (such as **CivicPulse** for infrastructure reporting or **Sentinel** for emergency response) will reuse Terra's core platform capabilities (Authentication, WebSockets, PostGIS Spatial Pool, Event Bus, Notifications) without requiring structural refactoring of Waypoint.

```
+-----------------------------------------------------------------------+
|                            TERRA PLATFORM                             |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                     WAYPOINT MOBILITY MODULE                    |  |
|  |  [Matching Engine]  [Ride State Machine]  [Trust Score Engine] |  |
|  +-----------------------------------------------------------------+  |
|                                  |                                    |
|  +-----------------------------------------------------------------+  |
|  |                   TERRA SHARED PLATFORM KERNEL                  |  |
|  |  [Auth/RBAC]  [PostGIS Pool]  [Socket.IO]  [Redis Cache]  [Bus] |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

### 1.2 The Modular Monolith Pattern
Rather than starting with distributed microservices (which introduce network latency, distributed transactions, and complex deployment pipelines), Terra is built as a **Modular Monolith**:
- Single deployable backend application (Fastify + Node.js).
- Strictly isolated bounded contexts (`@terra/platform` vs `@terra/waypoint`).
- Independent domain layers: Controllers, Services, Repositories, DTOs, and Business Logic.
- Communication between modules happens through explicit internal interfaces and in-memory domain events.

---

## 2. Ride Lifecycle State Machine

A ride is governed by a strict deterministic state machine. State transitions validate prerequisites before executing database updates or emitting real-time events.

```
       [ Ride Created ] (Request submitted by passenger)
              |
              v
        [ Searching ] (Matching engine seeking driver offers)
              |
              v
         [ Matched ] (Driver offer paired with passenger request)
              |
              +-----------------------+
              |                       | (Accept match)
              v                       v
        [ Cancelled ]           [ Accepted ] (Both driver & passenger confirm)
                                      |
                                      v
                             [ Driver En Route ] (Driver navigating to pickup)
                                      |
                                      v
                           [ Passenger Picked Up ] (Trip begins)
                                      |
                                      v
                              [ Ride In Progress ] (En route to dropoff)
                                      |
                                      v
                                [ Completed ] (Passenger dropped off & billed)
```

### 2.1 State Definitions & Valid Transitions

| State | Description | Allowed Next States | Trigger / Prerequisite |
| :--- | :--- | :--- | :--- |
| **`CREATED`** | Passenger submits commute request | `SEARCHING`, `CANCELLED` | Validation of pickup & dropoff coordinates. |
| **`SEARCHING`** | Engine runs candidate search sweep | `MATCHED`, `EXPIRED`, `CANCELLED` | Candidate pool evaluated by matching engine. |
| **`MATCHED`** | Engine pairs offer & request | `ACCEPTED`, `CANCELLED` | Match score $S(d,p)$ satisfies minimum threshold. |
| **`ACCEPTED`** | Driver & passenger accept proposed match | `DRIVER_EN_ROUTE`, `CANCELLED` | Confirmation received from both parties. |
| **`DRIVER_EN_ROUTE`** | Driver navigating to pickup point | `PASSENGER_PICKED_UP`, `CANCELLED` | Real-time driver location within 500m of pickup. |
| **`PASSENGER_PICKED_UP`** | Passenger enters vehicle | `RIDE_IN_PROGRESS` | Driver confirms OTP / arrival at pickup point. |
| **`RIDE_IN_PROGRESS`** | Vehicle traveling to dropoff destination | `COMPLETED`, `EMERGENCY_ALERT` | Live telemetry pings broadcasting trip progress. |
| **`COMPLETED`** | Passenger safely dropped off | None (Terminal) | Arrival at destination; fare calculated & billed. |
| **`CANCELLED`** | Ride cancelled prior to pickup | None (Terminal) | Cancellation requested by passenger or driver. |

---

## 3. Matching Engine Pipeline

Instead of nearest-neighbor lookup, the Waypoint matching engine processes requests through an ordered, 7-stage pipeline. **Order matters**: expensive geometric and polyline calculations are executed only on candidates that pass lightweight spatial and temporal filters.

```
 [ Receive Request ]
        |
        v
 [ 1. PostGIS Spatial Pruning ] (ST_DWithin / Geohash bounding box -> reduces pool by ~95%)
        |
        v
 [ 2. Time Window Filtering ] (Departure window flexibility -> excludes out-of-bounds times)
        |
        v
 [ 3. Route Polyline Similarity ] (Directional vector cosine similarity & trajectory alignment)
        |
        v
 [ 4. Pickup & Dropoff Detour Math ] (Haversine detour duration calculation)
        |
        v
 [ 5. Weighted Multi-Objective Score ] (Compute S(d,p) = w1*Sim + w2*Detour + w3*Time + w4*Trust)
        |
        v
 [ 6. Rank Candidates ] (Sort candidates by final composite score)
        |
        v
 [ 7. Return Top Results ] (Return top K matches to passenger UI)
```

### 3.1 Why Pipeline Stage Order Matters

1. **Stage 1: PostGIS Spatial Pruning ($O(\log N)$)**: Uses spatial indexes (`GiST`) and 5-char Geohash array lookups to prune thousands of system ride offers down to a candidate subset ($K \approx 20$) in $<10\text{ms}$.
2. **Stage 2: Temporal Filtering**: Filters candidates whose departure times fall outside $|t_{\text{offer}} - t_{\text{request}}| \le \Delta t_{\text{flexibility}}$.
3. **Stage 3: Polyline Similarity**: Evaluates trajectory alignment using vector directional cosine similarity:
   $$\text{CosSim} = \frac{\vec{v}_{\text{driver}} \cdot \vec{v}_{\text{passenger}}}{\|\vec{v}_{\text{driver}}\| \|\vec{v}_{\text{passenger}}\|}$$
4. **Stage 4: Pickup & Dropoff Detour Calculation**: Calculates exact extra travel time $\Delta t_{\text{detour}}$ incurred by the driver to pick up and drop off the passenger.
5. **Stage 5: Weighted Multi-Objective Composite Scoring ($S(d, p)$)**:
   $$S(d, p) = 0.35 \cdot \text{Similarity} + 0.25 \cdot \left(1 - \frac{\Delta t_{\text{detour}}}{T_{\text{max detour}}}\right) + 0.25 \cdot \text{TimeFlexibility} + 0.15 \cdot \text{TrustScore}$$
6. **Stage 6 & 7: Ranking & Result Return**: Sorts valid candidates in descending score order and returns top matches.

---

## 4. Structured Trust Score Engine

Rather than relying on simple star averages, Waypoint calculates a multi-factor **Trust Score** $T \in [1.00, 5.00]$ to incentivize reliable behavior and prioritize trusted drivers in matching sweeps.

### 4.1 Trust Factors & Formula

$$T = 5.00 \cdot \left( 0.35 \cdot \text{CompRate} + 0.25 \cdot \text{RatingNorm} + 0.20 \cdot (1 - \text{CancelRate}) + 0.10 \cdot \text{VerifyBonus} + 0.10 \cdot (1 - \text{PunctualityPenalty}) \right)$$

| Factor | Weight | Description |
| :--- | :--- | :--- |
| **Completion Rate (`CompRate`)** | 35% | Ratio of completed trips vs total accepted rides ($\frac{\text{Completed}}{\text{Accepted}}$). |
| **Average Rating (`RatingNorm`)** | 25% | Normalized average passenger rating ($\frac{\text{Avg Stars}}{5.0}$). |
| **Cancellation Rate (`CancelRate`)** | 20% | Driver-initiated cancellations after accepting a match. |
| **Identity Verification (`VerifyBonus`)** | 10% | Binary bonus ($1.0$ if license, vehicle documents, and phone are verified; $0.0$ otherwise). |
| **Punctuality Penalty** | 10% | Frequency of arriving $>10$ minutes past promised pickup time window. |

### 4.2 Impact on Matching
A driver's Trust Score directly impacts their composite match score $S(d,p)$. Drivers with high trust scores ($>4.85$) receive priority in candidate ranking during peak commute hours.

---

## 5. Redis Strategy & Caching Layer

Redis 7 is used as an in-memory cache and real-time state backplane to protect PostgreSQL from high-frequency read/write bottlenecks.

| Redis Key Pattern | Data Structure | Purpose | TTL / Expiry |
| :--- | :--- | :--- | :--- |
| `session:{userId}` | String (JSON) | Active user JWT session & permissions | 7 days |
| `driver:geo:locations` | Redis GEO (`GEOADD`) | High-frequency 3s driver location pings | Live / Real-time |
| `driver:telemetry:{driverId}` | Hash | Last known speed, heading, and timestamp | 60 seconds |
| `cache:nearby_offers:{geohash}`| String (JSON) | Cached spatial candidate offer IDs | 30 seconds |
| `ratelimit:{ip}:{endpoint}` | String (Int) | API rate limiting counter | 1 minute |

---

## 6. Background Processing & Scheduled Jobs

Simple scheduled tasks handle background lifecycle cleanup and analytics aggregation without over-engineering with complex message brokers:

1. **Ride Expiry Job (Every 1 Minute)**: Automatically transitions `SEARCHING` ride requests past their departure window into `EXPIRED`.
2. **Trust Score Recalculation Job (Daily at 02:00 AM)**: Recalculates driver and passenger trust scores using aggregate trip history.
3. **Commute Analytics Aggregation (Hourly)**: Aggregates total passenger kilometers saved, CO₂ emissions reduced ($kg$), and vehicle detours prevented into the analytics cache.

---

## 7. API Design Principles

The API follows RESTful engineering standards:

- **Consistent JSON Envelope**:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null,
    "meta": { "timestamp": "2026-08-05T21:00:00Z" }
  }
  ```
- **Error Handling**: Centralized Fastify error handler catches Zod validation errors (400), Auth errors (401/403), and Domain exceptions (`AppError`), returning formatted error codes (`INVALID_INPUT`, `UNAUTHORIZED`, `OFFER_NOT_FOUND`).
- **Pagination & Filtering**: Endpoints returning lists accept standard query parameters: `?page=1&limit=20&status=ACTIVE&sort=desc`.
- **Authentication**: Secured via `Authorization: Bearer <JWT>` headers validated by Fastify preHandler hooks.

---

## 8. Technical Architecture Trade-offs (Interview Reference)

### 8.1 Why Fastify over Express?
Fastify provides higher throughput (up to 2x requests/sec compared to Express), low overhead, native async/await support, built-in schema validation hooks, and lower memory usage under load.

### 8.2 Why PostgreSQL over MongoDB?
Commute ride-matching requires strict relational integrity (foreign keys between Users, Vehicles, Offers, Requests, and Matches), ACID transactions for booking seats, and native PostGIS spatial extensions. MongoDB lacks native PostGIS spherical polyline indexing.

### 8.3 Why PostGIS?
PostGIS provides native geospatial types (`GEOMETRY(LineString, 4326)` and `GEOMETRY(Point, 4326)`), `GiST` spatial indexing, and spatial functions (`ST_DWithin`, `ST_DistanceSphere`, `ST_Intersects`) executing spatial queries in $O(\log N)$ time natively inside PostgreSQL.

### 8.4 Why Redis?
Writing 3-second GPS location updates directly to PostgreSQL destroys disk IOPS. Redis `GEOADD` and in-memory caching allow sub-10ms location updates and sub-millisecond session validation without touching PostgreSQL.

### 8.5 Why a Modular Monolith over Microservices?
For an early-stage platform, microservices introduce network latency, distributed transaction complexity (Sagas), and deployment overhead. A Modular Monolith provides strict code boundary separation while allowing zero-latency in-memory communication and single-command deployment.

---

## 9. System Reliability & Fault Tolerance

1. **Automatic WebSocket Reconnection**: The Socket.IO client automatically retries connections with exponential backoff if the network drops.
2. **GPS Ping Fallback**: If a driver's GPS ping fails, the system uses the last known Redis telemetry position for up to 60 seconds before flagging the driver as offline.
3. **Idempotency & Duplicate Prevention**: Ride request submission accepts an optional `idempotencyKey` stored in Redis for 120 seconds to prevent double bookings from repeated button clicks.
4. **Session Expiration**: Expired JWT tokens trigger a refresh token flow or clean redirect to `/login` without crashing app state.

---

## 10. Clean Folder Structure

```
waypoint/
├── apps/
│   ├── api/                           # Backend Fastify Service
│   │   ├── prisma/schema.prisma       # Database Schema
│   │   ├── src/
│   │   │   ├── platform/              # Shared Terra Kernel (@terra/platform)
│   │   │   │   ├── auth/              # JWT, Password Hashing, RBAC Guards
│   │   │   │   ├── database/          # Prisma Client & Kysely PostGIS Connection
│   │   │   │   ├── realtime/          # Socket.IO Gateway & Event Handlers
│   │   │   │   └── spatial/           # Geohash & Coordinate Utilities
│   │   │   └── modules/waypoint/      # Waypoint Mobility Module (@terra/waypoint)
│   │   │       ├── matching/          # Ride Optimization Engine
│   │   │       ├── rides/             # Offers & Requests State Machine
│   │   │       ├── users/             # Driver & Vehicle Management
│   │   │       └── trust/             # Emergency SOS & Trust Score Service
│   │   └── src/tests/                 # Vitest Unit & Integration Tests
│   │
│   └── web/                           # Frontend React Dashboard
│       ├── src/
│       │   ├── components/            # UI Components & Custom Modals
│       │   ├── pages/                 # LoginPage & Dashboard
│       │   └── styles/index.css       # Dark Glassmorphism CSS Tokens
│       └── vite.config.ts
│
├── docker-compose.yml                 # Local Development Setup
├── docker-compose.prod.yml            # Multi-Stage Production Deployment
└── README.md
```
