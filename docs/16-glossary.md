# 16. Technical Glossary

This glossary defines technical terms used throughout the Terra and Waypoint documentation in plain, beginner-friendly language.

---

### 📖 Terms & Definitions

- **ACID Transactions**: A set of database guarantees (Atomicity, Consistency, Isolation, Durability) ensuring that database operations (like booking a ride) either succeed 100% or fail completely without leaving partial data.
- **AJV (Another JSON Schema Validator)**: An ultra-fast JavaScript library that checks whether incoming HTTP request bodies match pre-defined JSON format rules before processing.
- **Bipartite Graph Matching**: A mathematical problem where objects from group A (passengers) are paired with objects from group B (drivers) to maximize overall benefit.
- **B-Tree Index**: A standard database index structure that organizes text and number columns into a balanced tree, allowing database searches in $O(\log N)$ time.
- **Cosine Similarity**: A mathematical formula measuring the angle between two directional arrows (vectors). A cosine score of 1.0 means two routes are driving in the exact same direction.
- **Geohashing**: A spatial encoding system that converts latitude and longitude numbers into a short string of letters and digits (e.g. `tdr1v`). Nearby locations share common starting letters.
- **GiST (Generalized Search Tree)**: A spatial database index in PostgreSQL that organizes geographic shapes (like route lines and map boundaries) into hierarchical boxes for fast searching.
- **Greedy Heuristic**: A step-by-step problem-solving strategy that picks the best immediate choice at each step without waiting to evaluate every possible global combination.
- **Haversine Formula**: An equation used to calculate the shortest distance between two points on the surface of a sphere (Earth) given their latitudes and longitudes.
- **Hungarian Algorithm**: A mathematical optimization algorithm (also known as Kuhn-Munkres algorithm) that finds the global absolute best assignment between passengers and drivers.
- **Idempotency**: An API property guaranteeing that making the exact same request multiple times (e.g. double-clicking a "Book Ride" button) has the exact same effect as making it once.
- **Modular Monolith**: A software design pattern where an entire application runs as a single deployable server, but the source code is strictly divided into clean, independent modules.
- **ORM (Object-Relational Mapper)**: A tool (like Prisma) that translates database tables into TypeScript objects so developers don't have to write raw SQL strings by hand.
- **Polyline**: A continuous series of connected lines defined by a list of latitude/longitude coordinate points representing a road route.
- **PostGIS**: A spatial database extension for PostgreSQL that allows storing and querying geographic data (maps, distances, boundaries).
- **Pub/Sub (Publish/Subscribe)**: A messaging pattern where senders (publishers) push messages to channels without knowing who is listening, and receivers (subscribers) listen to channels.
- **RBAC (Role-Based Access Control)**: A security pattern that grants or restricts user permissions based on assigned roles (`PASSENGER`, `DRIVER`, `ADMIN`).
- **Redis `GEOADD`**: A specialized Redis command that stores geographic coordinates in memory and allows spatial distance queries in sub-milliseconds.
- **TTL (Time-To-Live)**: A timer set on cached data (like a Redis key) that automatically deletes the data after a specified number of seconds.
- **WebSocket**: A persistent, full-duplex communication channel between a web browser and a server that allows instantaneous real-time messaging in both directions.
