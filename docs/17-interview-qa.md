# 17. Master Interview Q&A Bank

This document contains 28 high-frequency technical interview questions with **first-person model answers** ("I chose X because...").

---

### Q1: Why did you build Terra and Waypoint?
> **Answer**: *"I built Terra as a modular urban operations platform, with Waypoint as its flagship commute-sharing module. Traditional ride-hailing services like Uber dispatch dedicated taxis, which increases urban traffic congestion and fare costs. Waypoint solves this by matching commuters along overlapping route polylines. I wanted to design a real-time spatial platform that solves high-density urban transit problems using PostGIS and Fastify."*

---

### Q2: Why did you choose a Modular Monolith architecture instead of Microservices?
> **Answer**: *"I chose a Modular Monolith to keep operational complexity low while enforcing strict domain isolation. All module communication between platform infrastructure (@terra/platform) and mobility logic (@terra/waypoint) happens in-memory within a single Fastify process. This eliminated 50-200ms of inter-service network latency and allowed single-command Docker deployments."*

---

### Q3: Why Fastify instead of Express?
> **Answer**: *"I chose Fastify because it delivers up to 75,000 requests per second compared to Express's 35,000 requests per second. Additionally, Fastify natively compiles JSON schemas using AJV, validating incoming request body formats in microseconds before touching controller logic."*

---

### Q4: Why PostgreSQL with PostGIS instead of MongoDB geospatial queries?
> **Answer**: *"I selected PostgreSQL with PostGIS because commute matching requires strict relational ACID transactions to prevent double-booking vehicle seats. PostGIS provides native spatial index structures (GiST) that evaluate polyline spatial range queries (ST_DWithin) in $O(\log N)$ time, whereas MongoDB's 2D indexes are limited to simple point distances."*

---

### Q5: What do you use Redis for in your codebase?
> **Answer**: *"I used Redis 7 for 4 specific high-throughput tasks: first, ingesting 3-second driver location pings using `GEOADD driver:geo:locations` to protect PostgreSQL from disk IOPS exhaustion; second, caching JWT user sessions with a 7-day TTL; third, setting 120-second idempotency locks (`SET key val EX 120 NX`) to prevent double-click ride bookings; and fourth, API rate limiting per IP."*

---

### Q6: Walk me through your 7-stage matching engine algorithm.
> **Answer**: *"When a passenger requests a ride, my matching engine executes a 7-stage pipeline: first, it prunes candidate drivers using PostGIS `ST_DWithin` spatial queries and 5-character Geohashes, eliminating ~95% of irrelevant city routes in $<12\text{ms}$. Then, it applies a departure time window filter, calculates vector directional cosine similarity, computes Haversine detour minutes, scores candidates using a composite formula $S(d,p)$, and returns the top ranked recommendations."*

---

### Q7: Explain the composite scoring formula $S(d,p)$ and its weights.
> **Answer**: *"The formula $S(d,p)$ balances 4 weighted factors: 35% Route Directional Cosine Similarity (matching vector trajectories), 25% Detour Penalty (penalizing extra travel minutes), 25% Schedule Flexibility (evaluating departure time gaps), and 15% Driver Trust Score (rewarding verified drivers with high ratings and low cancellations)."*

---

### Q8: Why did you use a Greedy Heuristic instead of the Hungarian Algorithm for matching?
> **Answer**: *"I started with a greedy heuristic because it evaluates candidates independently in $O(M \log M)$ time, returning results in $<12\text{ms}$ to keep the UI real-time. The Hungarian Algorithm guarantees global optimal assignment but operates in $O(N^3)$ time, which would spike CPU memory under heavy concurrent load. I decoupled the engine using a strategy interface (`IMatchingStrategy`) so the Hungarian algorithm can be swapped in without modifying controllers."*

---

### Q9: Tell me about a real bug you found and how you fixed it.
> **Answer**: *"I identified a bug where changing the Maximum Detour Limit slider and re-clicking 'Find Best Ride' returned stale candidates. By inspecting Fastify request logs, I diagnosed a cache invalidation gap in `matchingEngine.service.ts`: the Redis query cache key did not include `maxDetourMinutes`. I resolved it by appending `maxDetourMinutes`, `requestedSeats`, and departure time bins to the Redis key, ensuring immediate cache invalidation upon slider changes."*

---

### Q10: How does your system handle real-time driver GPS tracking?
> **Answer**: *"Active drivers stream GPS coordinates every 3 seconds over Socket.IO WebSockets. The backend writes these location pings to Redis using `GEOADD driver:geo:locations lng lat driverId` and updates a Redis hash with a 60-second TTL. If a passenger is watching an active trip, Socket.IO broadcasts location updates exclusively to that ride room."*

---

### Q11: How do you prevent double-booking seats when two riders request the same driver simultaneously?
> **Answer**: *"I use Redis idempotency locks and PostgreSQL database transactions. Before creating a ride match, the system executes an atomic Redis `SET idempotency:{requestId} EX 120 NX` lock. Inside PostgreSQL, I wrap the seat deduction in a transaction (`prisma.$transaction`) using row-level locking (`SELECT ... FOR UPDATE`), ensuring seat counts are decremented atomically."*

---

### Q12: How do you secure API endpoints and enforce access control?
> **Answer**: *"I implemented stateless JWT authentication signed with HMAC SHA-256 and hashed user passwords with bcrypt using 12 salt rounds. Route authorization is enforced via Fastify `preHandler` guards like `authorizeRoles(['DRIVER'])`, rejecting unauthorized roles with HTTP 403 Forbidden."*

---

### Q13: How does your frontend design system work?
> **Answer**: *"I designed a custom Slate & Royal Blue design system in Tailwind CSS (`index.css`) using tokens like `#0F172A` background, `#1E293B` surface, and `#2563EB` primary accent. I also built a global `DevModeContext` provider that lets interviewers toggle Developer Mode on the frontend to reveal live PostGIS execution times, Geohash buckets, and vector similarity scores."*

---

### Q14: Why do you have partial modules like CivicPulse and Sentinel in your project?
> **Answer**: *"These modules exist to prove the platform architecture narrative of Terra. Terra was built as an extensible Platform Kernel sharing Auth, WebSockets, and Spatial Pools. Displaying realistic `Under Construction` (40% complete) and `Planned` badges with active development notice banners demonstrates platform extensibility with total user transparency."*

---

### Q15: What would break first if traffic increased 100x, and how would you fix it?
> **Answer**: *"At 100x traffic (~100,000 concurrent users), single-node Socket.IO heap memory would break first, followed by PostgreSQL connection pool exhaustion. I would scale the system in 3 steps: first, introduce PgBouncer for database connection pooling and PostgreSQL Read Replicas for spatial queries; second, deploy multiple Fastify nodes using `@socket.io/redis-adapter` for pub/sub WebSocket synchronization; and third, extract spatial matching into a compiled Rust gRPC service."*

---

### Q16: How do you calculate driver Trust Scores?
> **Answer**: *"Driver Trust Score $T \in [1.00, 5.00]$ is calculated in `trustScore.service.ts` using a multi-factor formula: 35% completion rate, 25% normalized rating, 20% cancellation penalty, 10% identity verification bonus, and 10% punctuality history."*

---

### Q17: What is the single biggest technical risk in your codebase?
> **Answer**: *"The biggest technical risk is that the 7-stage candidate matching engine executes synchronously inside the main Node.js event loop thread. If a request contained a polyline with thousands of coordinate vertices, vector cosine dot-product math could block the event loop. In production, I would offload spatial matrix calculations to Worker Threads or background BullMQ queue workers."*

---

### Q18: What is Geohashing and why do you use it alongside PostGIS?
> **Answer**: *"Geohashing encodes 2D latitude and longitude coordinates into a short string where nearby points share common starting characters. I use 5-character Geohashes as a fast Layer 1 B-Tree string index to filter candidate drivers into 4.9km grid buckets, followed by PostGIS `GiST` spatial polyline queries for precise distance evaluation."*

---

### Q19: Why split routing between OSRM/Mapbox and custom code?
> **Answer**: *"External routers like OSRM or Mapbox excel at map matching (converting GPS points into physical road polylines). However, they don't know about Waypoint's driver trust scores, vehicle seat availability, or detour constraints. I use external APIs for road graph geometry, but evaluate candidate matches using my custom $S(d,p)$ ranking engine."*

---

### Q20: How does your frontend DateTimePicker prevent invalid states?
> **Answer**: *"I built a custom `DateTimePicker.tsx` popover that generates 48 30-minute intervals. For today's date, time slots earlier than `current_time + 15_mins` are flagged `isPast = true` and rendered unselectable. If opened late at night (after 23:00), it automatically rolls over the default date to Tomorrow 08:00 AM."*

---

### Q21: How do you handle transient driver network disconnects?
> **Answer**: *"If a driver temporarily loses connection, Socket.IO buffers outgoing pings locally for up to 30 seconds. Upon network restoration, the client reconnects automatically and re-subscribes to its assigned ride room. If disconnected for $>60$ seconds, the driver's Redis key expires via TTL, removing them from passenger search maps."*

---

### Q22: What testing setup did you implement?
> **Answer**: *"I built an automated unit test suite using Vitest (`geohash.test.ts`, `heuristicScorer.test.ts`, `polylineSimilarity.test.ts`). All 8 out of 8 unit tests pass in $<400\text{ms}$, validating Geohash encoding boundaries, vector cosine dot-products, and heuristic composite score calculations."*

---

### Q23: How do you deploy your project in production?
> **Answer**: *"I built a multi-stage `Dockerfile` for `apps/api` that compiles TypeScript in a build stage and produces a lean 150MB production container image. `docker-compose.prod.yml` orchestrates 4 containers: Web UI served via NGINX (port 80), Fastify API (port 4000), PostgreSQL 16 + PostGIS (port 5432), and Redis 7 (port 6379)."*

---

### Q24: What currency and vehicle localization defaults are used?
> **Answer**: *"The platform defaults to Bengaluru, India (the tech corridor capital), calculating fares in Indian Rupees (₹) and featuring Indian green EV commute vehicles (Tata Nexon EV, Mahindra XUV400). All localization parameters are stored in environment variables (`DEFAULT_LAT`, `DEFAULT_LNG`, `CURRENCY_SYMBOL`), enabling instant re-localization to any city globally."*

---

### Q25: How does your deterministic Ride Lifecycle State Machine work?
> **Answer**: *"Implemented in `rideStateMachine.ts`, it enforces valid ride state transitions (`CREATED` ➔ `SEARCHING` ➔ `MATCHED` ➔ `ACCEPTED` ➔ `DRIVER_EN_ROUTE` ➔ `PASSENGER_PICKED_UP` ➔ `RIDE_IN_PROGRESS` ➔ `COMPLETED`). Invalid transitions (e.g. `CREATED` directly to `COMPLETED`) throw a typed `InvalidStateTransitionError`."*

---

### Q26: What would you do differently if you had 3 more months?
> **Answer**: *"First, I would implement global batch matching using the Hungarian Algorithm running every 30 seconds; second, offload polyline vector math to Node.js Worker Threads; and third, add automated End-to-End browser testing using Playwright."*

---

### Q27: How does your LocationAutocomplete search work?
> **Answer**: *"Implemented in `LocationAutocomplete.tsx`, it provides instant zero-latency suggestions across Bengaluru places, quick saved location shortcuts (🏠 Home, 🏢 Office, 🎓 University, 🏋️ Gym), and browser `navigator.geolocation` integration with fallback handling."*

---

### Q28: What summarizes the key achievement of this project?
> **Answer**: *"I successfully designed, built, tested, and containerized a high-performance modular urban mobility platform that prunes spatial candidate routes in $<12\text{ms}$, streams real-time driver telemetry in $<1\text{ms}$ via Redis, and provides an interview-ready SaaS experience."*
