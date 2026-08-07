# 01. Project Overview

## 1. Non-Technical Overview
**Terra** is a smart city urban operations platform built to optimize city transportation and civic emergency responses. Think of Terra as an operating system for modern cities, designed to host multiple urban management modules under one roof. Its primary flagship module, **Waypoint**, is an intelligent ride-sharing system that matches commuters traveling along similar routes so they can share rides, split costs, and reduce traffic congestion without forcing drivers to go far out of their way.

---

## 2. Concrete Example: How Waypoint Works
Imagine two daily commuters in Bengaluru:
1. **Aarav (The Driver)**: Drives his Tata Nexon EV every morning from **Yelahanka** (North Bengaluru) to his office in **Aerospace Park** via the Highway polyline. He has 3 empty seats in his car.
2. **Priya (The Passenger)**: Needs a ride from **Koramangala** to **Aerospace Park** leaving around 08:30 AM.

Instead of calling a dedicated Uber driver who travels empty from 10 km away to pick up Priya, **Waypoint's matching engine** analyzes Aarav's planned route polyline. It calculates that picking up Priya adds only a **4-minute detour** to Aarav's commute while matching **94% of their route direction**. 

The system matches Priya with Aarav, calculates a shared fare of **₹180**, displays Aarav's verified **4.92 Trust Rating**, and updates both riders in real-time via WebSockets.

```
       [ Aarav Origin: Yelahanka ]
                    │
                    ▼  (Route Polyline)
       [ Pickup Spot: Koramangala ] ◄── (Priya joins ride - 4 min detour)
                    │
                    ▼
   [ Shared Destination: Aerospace Park ]
```

---

## 3. The Business & Engineering Problem
Traditional ride-hailing platforms (e.g., Uber, Lyft) rely on **point-to-point dedicated taxis**. A vehicle is dispatched specifically for one rider, traveling empty during the pickup leg. This causes:
- **Urban Congestion**: Increasing single-occupancy vehicles on bottlenecks.
- **High Carbon Emissions**: Excess vehicle miles traveled (VMT).
- **High Cost**: Rider pays 100% of driver operating expenses.

**Why matching is non-trivial**:
Matching shared commutes in real-time is a high-dimensional spatial-temporal search problem. Given $N$ passengers and $M$ drivers, evaluating every pair naively takes $O(N \times M)$ time. Furthermore, comparing two complex polyline routes requires computing vector directional similarity, Haversine detour bounds, time flexibility windows, and driver trust scores. Waypoint solves this by executing a **7-stage optimization pipeline** that prunes search candidates to $<12\text{ms}$ using PostGIS spatial indexing.

---

## 4. Elevator Pitches (Verbatim Memorization)

### 💬 30-Second Elevator Pitch
> *"Terra is a modular urban operations platform, and Waypoint is its flagship commute-matching engine built in TypeScript, Fastify, and PostgreSQL/PostGIS. Instead of routing dedicated taxis, Waypoint uses a 7-stage spatial optimization pipeline to match riders with drivers already traveling along overlapping route polylines. It reduces pickup detours to under 5 minutes and evaluates spatial candidates in under 12 milliseconds using PostGIS GiST indexes and Redis telemetry."*

### 💬 2-Minute Deep Dive
> *"Terra is designed as a modular urban platform built to unify city transport, infrastructure reporting, and emergency response. Waypoint is our 100% production-ready flagship module focused on shared mobility.*
> 
> *Traditional ride-hailing services dispatch dedicated taxis, causing congestion and high fares. Waypoint solves this by matching commuters along overlapping route vectors. We built the backend as a Modular Monolith in Fastify and TypeScript, separating platform capabilities like Auth, Socket.IO WebSockets, and Redis telemetry from the Waypoint domain logic.*
> 
> *Our core technical innovation is a 7-stage multi-objective matching engine. When a rider requests a match, we don't scan all drivers. Instead, we use PostGIS ST_DWithin spatial queries and 5-character Geohashes to prune candidate drivers by 95% in under 12 milliseconds. Then, we score the remaining candidates using vector directional cosine similarity, Haversine detour math, and a multi-factor driver Trust Score ($T \in [1.0, 5.0]$).*
> 
> *The system streams live 3-second driver location pings using Redis GEOADD, enforces an 8-state deterministic ride lifecycle state machine, and renders a Slate/Royal Blue UI with developer mode telemetry controls for interview inspections."*
