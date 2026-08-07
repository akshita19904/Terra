# 14. Scaling & "What Would Break First"

This document presents a rigorous architectural scaling analysis for Terra and Waypoint under a **100x traffic increase** (e.g. scaling from 1,000 to 100,000 concurrent active users).

---

## 1. What Would Break First? (Root Bottleneck Analysis)

Under 100x load, systems fail at predictable architectural choke points. Here is the exact order of failures in our system:

```
[ 1st Bottleneck: Socket.IO Server Memory ] ➔ ~100k open WebSocket connections exhaust RAM
                    │
                    ▼
[ 2nd Bottleneck: PostgreSQL Write Connection Pool ] ➔ Max DB connections saturated
                    │
                    ▼
[ 3rd Bottleneck: PostGIS Spatial CPU Compute ] ➔ 100k concurrent polyline dot-products
```

### 1. Single Node Socket.IO Connection Limit (Break Point #1):
A single Node.js process can hold approximately $20,000$ to $30,000$ concurrent active WebSocket connections before running out of RAM (heap memory limits). At 100,000 concurrent riders and drivers, a single Socket.IO server node will crash with `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory`.

### 2. PostgreSQL Connection Pool Exhaustion (Break Point #2):
By default, PostgreSQL allows 100 concurrent client connections (`max_connections = 100`). At 100x traffic, hundreds of Fastify worker processes trying to acquire database connections simultaneously will cause Prisma to throw `PrismaClientInitializationError: Timed out fetching a new connection from the pool`.

---

## 2. Step-by-Step 3-Phase Scaling Plan

### 🛠️ Phase 1 (Immediate Fixes — Up to 25x Traffic):
1. **Add PgBouncer Connection Pooler**: Place **PgBouncer** in front of PostgreSQL. PgBouncer multiplexes thousands of incoming application connections into a lean pool of 50 active PostgreSQL database connections.
2. **PostgreSQL Read Replicas**: Separate database read queries from writes. Direct all matching candidate read queries (`ST_DWithin`) to 3 PostGIS Read Replicas, leaving the Primary database strictly for writes (creating offers/requests).

### 🛠️ Phase 2 (Medium Term — Up to 100x Traffic):
1. **Redis Pub/Sub Socket.IO Adapter**: Deploy 4 instances of the Node.js Fastify backend behind an NGINX load balancer. Use `@socket.io/redis-adapter` so that WebSockets connected to Server Node 1 can seamlessly broadcast messages to users connected to Server Node 4 via Redis Pub/Sub.
2. **Geohash Sharded Redis Cluster**: Partition driver location telemetry pings across regional Redis nodes (`redis-blr-north`, `redis-blr-south`) based on Geohash prefixes.

### 🛠️ Phase 3 (Long Term — 500x Traffic):
1. **Extract Matching Engine into Rust / C++ gRPC Service**: Extract the 7-stage candidate matching engine from Node.js into a dedicated compiled **Rust** gRPC service. Rust provides multi-threaded SIMD parallel matrix calculations, reducing candidate scoring time to $<1\text{ms}$.
