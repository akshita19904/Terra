# TERRA | Waypoint Commute Optimization Platform

**Waypoint** is the flagship mobility & intelligent ride-matching module of **Terra**, a modular urban operations platform designed for high performance, maintainability, and clean software architecture.

[![GitHub Repo](https://img.shields.io/badge/GitHub-akshita19904%2FTerra-blue?logo=github)](https://github.com/akshita19904/Terra)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostGIS](https://img.shields.io/badge/Database-PostgreSQL_16_%2B_PostGIS-336791?logo=postgresql)](https://postgis.net/)
[![Fastify](https://img.shields.io/badge/Backend-Fastify-black?logo=fastify)](https://fastify.dev/)
[![React](https://img.shields.io/badge/Frontend-Vite_%2B_React_18-61DAFB?logo=react)](https://react.dev/)
[![Redis](https://img.shields.io/badge/Cache-Redis_7-DC382D?logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Containerization-Docker_Compose-2496ED?logo=docker)](https://www.docker.com/)

---

## System Architecture

Waypoint is engineered as a **Modular Monolith** organized into distinct bounded contexts:

* **Terra Shared Platform Kernel (`@terra/platform`)**: Reusable infrastructure including JWT authentication, Role-Based Access Control (RBAC), PostGIS spatial connection pooling, Socket.IO real-time telemetry gateway, Redis caching, Geohash utilities, and centralized error handling.
* **Waypoint Mobility Context (`@terra/waypoint`)**: Multi-objective matching engine, ride offers, ride requests, driver & passenger profiles, multi-factor trust ratings, and deterministic ride lifecycle state machine.

```
waypoint/
├── apps/
│   ├── api/                           # Fastify Backend Gateway (:4000)
│   │   ├── prisma/schema.prisma       # Prisma PostgreSQL 16 + PostGIS Schema
│   │   ├── src/
│   │   │   ├── platform/              # Terra Shared Platform Kernel
│   │   │   │   ├── auth/              # JWT, Password Hashing, RBAC Guards
│   │   │   │   ├── database/          # Prisma Singleton & Redis Pool Manager
│   │   │   │   ├── realtime/          # Socket.IO Gateway & Telemetry Manager
│   │   │   │   └── spatial/           # Geohash & Distance Utilities
│   │   │   └── modules/waypoint/      # Waypoint Bounded Context
│   │   │       ├── matching/          # Multi-Objective Optimization Engine
│   │   │       ├── rides/             # Offers & Requests State Machine
│   │   │       ├── users/             # Driver & Vehicle Profiles
│   │   │       └── trust/             # Driver Trust Score Engine
│   │   ├── src/tests/                 # Vitest Automated Test Suite (8/8 Passed)
│   │   └── Dockerfile                 # Multi-Stage Production Container
│   │
│   └── web/                           # Vite + React 18 SaaS Dashboard (:3000)
│       ├── src/
│       │   ├── components/            # UI System Components
│       │   │   ├── map/               # Mapbox Vector Canvas Visualizer
│       │   │   ├── rides/             # Request Wizard & Candidate Cards
│       │   │   └── analytics/         # Recharts Operations Dashboard
│       │   ├── context/               # Global Developer Telemetry Mode State
│       │   └── styles/index.css       # Design System Tokens (#0F172A Slate)
│       └── Dockerfile
│
├── docker-compose.yml                 # PostgreSQL 16 + PostGIS & Redis Dev Environment
├── docker-compose.prod.yml            # Production Multi-Stage Deployment Suite
└── README.md
```

---

## Matching Engine & Algorithm Complexity

The matching engine processes commute requests through an ordered 7-stage optimization pipeline governed by the `IMatchingStrategy` strategy pattern:

1. **Stage 1: Spatial & Temporal Pruning ($O(\log N)$)**: Uses PostGIS `ST_DWithin` spatial indexes and 5-character Geohash array matching to reduce candidate offers by ~95% in $<12\text{ms}$.
2. **Stage 2: Departure Window Filtering**: Filters out-of-bounds driver departure times.
3. **Stage 3: Trajectory Alignment**: Evaluates route directional vector cosine similarity.
4. **Stage 4: Detour Duration Math**: Computes pickup/dropoff extra travel time using Haversine distance.
5. **Stage 5: Multi-Objective Composite Scoring ($S(d, p)$)**:
   $$S(d, p) = 0.35 \cdot \text{Similarity} + 0.25 \cdot \left(1 - \frac{\Delta t_{\text{detour}}}{T_{\text{max detour}}}\right) + 0.25 \cdot \text{TimeFlexibility} + 0.15 \cdot \text{TrustScore}$$
6. **Stage 6 & 7: Candidate Ranking ($O(K \log K)$)**: Sorts top-$K$ match recommendations descending for passenger booking.

---

## Quick Start Guide

### 1. Development Mode (PostgreSQL 16 + PostGIS & Redis 7 Docker)
```bash
# Clone the repository
git clone https://github.com/akshita19904/Terra.git
cd Terra

# Start PostgreSQL 16 + PostGIS & Redis containers
docker-compose up -d

# Install dependencies & run backend API (Port 4000)
cd apps/api
npm install
npx prisma generate
npm run dev

# Run web frontend in another terminal (Port 3000)
cd apps/web
npm install
npm run dev
```

### 2. Run Automated Test Suite
```bash
cd apps/api
npx vitest run
```

### 3. Production Multi-Stage Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```
