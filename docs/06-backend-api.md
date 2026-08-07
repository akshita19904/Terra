# 06. Backend Architecture & API Specifications

This document details the backend directory structure, API route endpoints, request lifecycle, and error handling mechanics implemented in `apps/api`.

---

## 1. Directory Walkthrough (`apps/api/src`)

```
apps/api/src/
├── platform/                          # Shared Kernel (@terra/platform)
│   ├── auth/                          # JWT Token Sign/Verify, bcrypt Hashing, RBAC Guards
│   ├── database/                      # Prisma ORM Singleton & Redis Connection Pool
│   ├── jobs/                          # Background Schedulers (Ride Request Expiry)
│   ├── middleware/                    # Global Error Envelope & AJV Schema Handlers
│   ├── realtime/                      # Socket.IO Gateway Server & Telemetry Manager
│   └── spatial/                       # Geohash Encoding & Haversine Distance Calculations
│
└── modules/waypoint/                  # Waypoint Bounded Context (@terra/waypoint)
    ├── matching/                      # 7-Stage Multi-Objective Match Engine Services
    ├── rides/                         # Ride Offers, Requests & Deterministic State Machine
    ├── trust/                         # Driver Trust Score Calculation Services
    └── users/                         # Driver Profiles & Vehicle Management
```

---

## 2. API Route Specifications & Protection Matrix

All endpoints return a standardized JSON response envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "timestamp": "2026-08-07T00:00:00Z" }
}
```

| Method | Endpoint | Description | Auth Required | Role Guard |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user account | ❌ No | Public |
| `POST` | `/api/v1/auth/login` | Authenticate & return JWT | ❌ No | Public |
| `POST` | `/api/v1/rides/requests` | Request commute ride match | ✅ Yes | `PASSENGER` |
| `GET` | `/api/v1/rides/matches/:id` | Fetch candidate match details | ✅ Yes | Any |
| `POST` | `/api/v1/rides/matches/accept` | Accept candidate match | ✅ Yes | `PASSENGER` |
| `POST` | `/api/v1/driver/offers` | Publish new commute offer | ✅ Yes | `DRIVER` |
| `PATCH` | `/api/v1/rides/:id/state` | Transition ride state | ✅ Yes | `DRIVER` / `ADMIN` |
| `POST` | `/api/v1/emergency/sos` | Trigger high-priority SOS | ✅ Yes | Any |

---

## 3. End-to-End Request Lifecycle Trace

Let's trace a passenger requesting a commute match (`POST /api/v1/rides/requests`):

```
1. Client UI (RequestWizard.tsx) 
   └── Sends HTTP POST payload with pickup, dropoff, seats, maxDetour

2. Fastify HTTP Router (server.ts / routes.ts)
   └── Matches route, triggers AJV schema validation

3. Auth Middleware (platform/auth/auth.service.ts)
   └── Validates 'Authorization: Bearer <jwt>', attaches req.user

4. Idempotency Check (platform/database/redis.ts)
   └── SET idempotency:{key} EX 120 NX ensures no duplicate submission

5. Match Service (modules/waypoint/matching/services/matchingEngine.service.ts)
   ├── PostGIS Spatial Pruning (ST_DWithin)
   ├── Haversine Detour Math
   └── Heuristic Scorer (computes composite S(d,p))

6. Database Layer (platform/database/prisma.ts)
   └── Saves RideRequest record to PostgreSQL 16

7. Controller Response (modules/waypoint/rides/controllers/ride.controller.ts)
   └── Wraps sorted candidate matches in standard JSON envelope and returns HTTP 200 OK
```

---

## 4. Error Handling & Validation Approach

- **Validation**: Fastify compiles JSON Schemas natively using **AJV**. Malformed requests (e.g. missing coordinates or invalid date strings) are rejected before reaching controller code with `HTTP 400 Bad Request`.
- **Global Error Handler**: Uncaught exceptions are caught by `platform/middleware/errorHandler.ts` and mapped to typed error codes (`INVALID_STATE_TRANSITION`, `INSUFFICIENT_SEATS`, `UNAUTHORIZED`) preventing stack traces from leaking to clients.
