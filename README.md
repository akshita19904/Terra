# TERRA | Waypoint Commute Optimization Platform

**Waypoint** is the foundational mobility & intelligent ride-matching module of **Terra**, a modular urban operations platform designed for maintainability, scalability, and clean software architecture.

[![GitHub Repo](https://img.shields.io/badge/GitHub-akshita19904%2FTerra-mint?logo=github)](https://github.com/akshita19904/Terra)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostGIS](https://img.shields.io/badge/Database-PostgreSQL_16_%2B_PostGIS-336791?logo=postgresql)](https://postgis.net/)
[![Fastify](https://img.shields.io/badge/Backend-Fastify-black?logo=fastify)](https://fastify.dev/)
[![React](https://img.shields.io/badge/Frontend-Vite_%2B_React_18-61DAFB?logo=react)](https://react.dev/)

---

## 🏛️ System Architecture

Waypoint is engineered as a **Modular Monolith** organized into distinct bounded contexts:

* **Terra Shared Platform Kernel (`@terra/platform`)**: Reusable infrastructure including JWT/RBAC security, PostGIS spatial pool, Socket.IO real-time gateway, event bus, geohashing utilities, and centralized error handling.
* **Waypoint Mobility Context (`@terra/waypoint`)**: Ride matching engine, ride offers, ride requests, driver & passenger profiles, trust ratings, and emergency SOS handling.

```
waypoint/
├── apps/
│   ├── api/                           # Fastify Backend (Modular Monolith)
│   │   ├── prisma/schema.prisma       # Prisma PostGIS Schema
│   │   ├── src/
│   │   │   ├── platform/              # Terra Shared Platform Kernel
│   │   │   │   ├── auth/              # JWT, Password Hashing, RBAC
│   │   │   │   ├── database/          # Prisma Client & Kysely PostGIS Pool
│   │   │   │   ├── realtime/          # Socket.IO Gateway & Telemetry
│   │   │   │   └── spatial/           # Geohash & Distance Utilities
│   │   │   └── modules/waypoint/      # Waypoint Bounded Context
│   │   │       ├── matching/          # Multi-Objective Optimization Engine
│   │   │       ├── rides/             # Offers & Requests Management
│   │   │       ├── users/             # Driver & Vehicle Profiles
│   │   │       └── trust/             # Emergency SOS & Ratings
│   │   └── Dockerfile
│   │
│   └── web/                           # Vite + React 18 + Tailwind UI
│       ├── src/
│       │   ├── components/            # Dark Glassmorphism Components
│       │   │   ├── map/               # Mapbox Vector Canvas Visualizer
│       │   │   ├── rides/             # Matching Wizards & Scored Cards
│       │   │   └── analytics/         # Recharts Operations Dashboard
│       │   └── styles/index.css       # Design Tokens (#07111F Dark Navy)
│       └── Dockerfile
│
├── docker-compose.yml                 # PostGIS + Redis Dev Environment
├── docker-compose.prod.yml            # Production Multi-Stage Deployment
└── README.md
```

---

## 🧮 Matching Engine & Algorithm Complexity

The matching engine uses a 4-stage optimization pipeline governed by the `IMatchingStrategy` strategy pattern:

1. **Stage 1: Spatial & Temporal Pruning ($O(\log N)$)**: Uses PostGIS `ST_DWithin` spatial indexes and Geohash array matching to extract candidate offers.
2. **Stage 2: Polyline Similarity**: Evaluates trajectory alignment using vector directional cosine similarity and Haversine sphere distance.
3. **Stage 3: Multi-Objective Composite Scoring ($S(d, p)$)**:
   $$S(d, p) = w_{\text{sim}} \cdot \text{Similarity} + w_{\text{detour}} \cdot \text{DetourScore} + w_{\text{wait}} \cdot \text{TimeScore} + w_{\text{trust}} \cdot \text{TrustScore} + w_{\text{occ}} \cdot \text{Occupancy}$$
4. **Stage 4: Candidate Ranking ($O(K \log K)$)**: Ranks top-$K$ matches for passenger confirmation.

---

## 🚀 Quick Start Guide

### 1. Development Mode (PostgreSQL + Redis Docker)
```bash
# Clone the repository
git clone https://github.com/akshita19904/Terra.git
cd Terra

# Start PostgreSQL + PostGIS & Redis containers
docker-compose up -d

# Install dependencies & run backend
cd apps/api
npm install
npx prisma generate
npm run dev

# Run frontend in another terminal
cd apps/web
npm install
npm run dev
```

### 2. Run Automated Test Suite
```bash
cd apps/api
npm test
```

### 3. Production Multi-Stage Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## 📜 License
MIT License. Developed for Terra Platform Core.
