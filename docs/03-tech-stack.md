# 03. Tech Stack & Decision Rationale

This document provides a decision-by-decision audit of every core technology used in Terra and Waypoint.

---

## 1. Fastify vs Express / NestJS

### What it is
Fastify is a modern, high-performance web framework for Node.js focused on low overhead and speed.

### Why chosen in this repo
- **Performance**: Fastify processes up to **75,000 requests/sec**, compared to Express which caps around **35,000 requests/sec**.
- **Native JSON Schema Validation**: Fastify compiles request schemas using **AJV** in milliseconds, validating incoming payload types before touching controller logic.

### Alternatives Considered & Rejected
- **Express.js**: Rejected due to high overhead, unmaintained codebase core, and lack of native JSON schema validation.
- **NestJS**: Rejected due to heavy boilerplate, forced dependency injection patterns, and excessive abstraction layers that add unnecessary cognitive overhead for a early-stage platform.

---

## 2. Prisma ORM vs Raw SQL / TypeORM

### What it is
Prisma is a type-safe Object-Relational Mapper (ORM) for Node.js and TypeScript that auto-generates TypeScript types from a schema definition (`schema.prisma`).

### Why chosen in this repo
- **100% Type Safety**: Querying `prisma.user.findUnique()` returns fully typed TypeScript objects, eliminating runtime `TypeError` crashes.
- **Migration Engine**: `prisma migrate dev` automatically tracks schema changes and applies database migrations deterministically.

### Alternatives Considered & Rejected
- **Raw SQL (`pg`)**: Rejected because string-based SQL queries lack compile-time type safety and require writing tedious manual SQL mappers.
- **TypeORM / Sequelize**: Rejected due to complex decorator syntax, fragile entity state mutation bugs, and poor PostGIS spatial type integration.

---

## 3. PostgreSQL + PostGIS vs MongoDB (NoSQL)

### What it is
PostgreSQL 16 is an advanced open-source relational database. **PostGIS 3.4** is a spatial database extension that adds native support for geographic objects (Points, LineStrings, Polygons) and spatial indexes (`GiST`).

### Why chosen in this repo
- **ACID Transaction Integrity**: Ride bookings require atomic updates across driver offers, passenger requests, and seat counts. Relational foreign key constraints prevent double-bookings.
- **GiST Spatial Indexing**: PostGIS provides native spatial index structures (`GiST`) that evaluate polyline distance queries (`ST_DWithin`) in $O(\log N)$ time.

### Alternatives Considered & Rejected
- **MongoDB 2D Spherical Indexes**: Rejected because MongoDB's 2D geospatial indexes are limited to simple point distances. MongoDB cannot natively index complex spherical polyline route vectors or evaluate directional trajectory cosine dot-products in SQL.

---

## 4. Redis 7 (Actual Usage in Codebase)

### What it is
Redis 7 is an ultra-fast in-memory key-value data store operating with sub-millisecond response times.

### Specific Codebase Use Cases:
1. **Driver GPS Telemetry (`GEOADD`)**: Ingests 3-second driver location pings into Redis spatial index `driver:geo:locations` (`apps/api/src/platform/database/redis.ts`), protecting PostgreSQL from disk IOPS saturation.
2. **Session Caching (`session:{userId}`)**: Caches JWT user sessions with a 7-day TTL for 0.5ms authentication validation.
3. **Idempotency Locking (`idempotency:{key}`)**: Sets 120-second atomic locks (`SET key val EX 120 NX`) to prevent double-click ride bookings.
4. **API Rate Limiting (`ratelimit:{ip}`)**: Increments counters per IP address to block DDoS attacks.

---

## 5. Socket.IO vs Raw WebSockets vs SSE

### What it is
Socket.IO is a real-time event-driven communication library built on top of WebSockets with automatic fallback protocols.

### Why chosen in this repo
- **Automatic Reconnection & Fallback**: Socket.IO handles network drops automatically, falling back to HTTP long-polling if WebSockets are blocked by corporate proxies.
- **Room & Event Multiplexing**: Built-in room management (`socket.join('ride_101')`) allows broadcasting location updates and SOS alerts exclusively to relevant riders and drivers.

### Alternatives Considered & Rejected
- **Raw WebSockets (`ws`)**: Rejected because raw WebSockets lack built-in heartbeats, reconnection logic, and room broadcasting utilities.
- **Server-Sent Events (SSE)**: Rejected because SSE is unidirectional (server-to-client only), while telemetry requires full-duplex client-and-server communication.

---

## 6. Routing Split: OSRM / Google Maps vs Custom Matching Engine

### Why routing is external, but ranking is custom:
- **External Routing (OSRM / Mapbox / Google Maps)**: Used solely for **road graph map matching** (turning raw GPS coordinates into road polylines and physical turn-by-turn geometry). Building a custom road graph routing engine from scratch requires terabytes of OpenStreetMap data and complex Dijkstra/A* road graph algorithms.
- **Custom Waypoint Matching Engine**: Used for **multi-factor candidate ranking**. External APIs (like Google Maps) do NOT know about Waypoint's driver trust scores, vehicle seat availability, passenger time flexibility, or custom $S(d,p)$ detour composite formulas.

---

## 7. React 18 + Vite + Tailwind CSS

### Why chosen
- **Vite**: Sub-second Instant HMR (Hot Module Replacement) and fast ES-build compilation compared to legacy Webpack.
- **React 18**: Component-driven state architecture with hooks (`useState`, `useEffect`, `useContext`) managing complex wizard steps and real-time map pings.
- **Tailwind CSS + Custom Slate Design System**: Utility-first CSS allowing custom color tokens (`#0F172A`, `#1E293B`, `#2563EB`) without CSS specificity conflicts.

---

## 8. Docker & Docker Compose Setup

### What is containerized and why:
- **`apps/api/Dockerfile`**: Multi-stage Node.js container compiling TypeScript in a build stage and running a lean 150MB production image.
- **`docker-compose.yml`**: Spins up PostgreSQL 16 + PostGIS and Redis 7 in single-command isolated containers so any developer can run the project locally without installing native database binaries.
- **`docker-compose.prod.yml`**: Orchestrates production deployment linking Web UI, Fastify API, PostgreSQL, and Redis behind NGINX.
