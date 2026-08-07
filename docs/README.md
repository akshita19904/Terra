# TERRA & WAYPOINT — Complete Platform Documentation Suite

Welcome to the comprehensive engineering and architecture documentation for **Terra** and its flagship module **Waypoint**. This documentation suite is designed for engineers onboarding onto the codebase and candidates preparing for technical interviews at top technology companies (Google, Uber, Amazon, Microsoft, Stripe).

---

## 📚 Reading Order & Documentation Index

1. [**01. Project Overview**](01-overview.md)  
   *What Terra & Waypoint do, the urban mobility problem, elevator pitches (30s & 2-min).*

2. [**02. High-Level Architecture**](02-architecture.md)  
   *Modular Monolith architecture, shared platform kernel (`@terra/platform`), system diagrams, microservices migration path.*

3. [**03. Tech Stack & Decision Rationale**](03-tech-stack.md)  
   *Detailed breakdown of Fastify, Prisma, PostgreSQL + PostGIS, Redis, Socket.IO, OSRM/Maps split, React + Vite, and Docker.*

4. [**04. Database Design & Spatial Relations**](04-database.md)  
   *Full Prisma ER diagram, PostGIS spatial extension capabilities, indexing strategies (GiST & Geohashing), schema tradeoffs.*

5. [**05. The Matching Engine Deep Dive**](05-matching-engine.md)  
   *7-stage matching pipeline, composite scoring formula $S(d,p)$, greedy heuristic vs Hungarian algorithm, worked numeric example.*

6. [**06. Backend Architecture & API Routes**](06-backend-api.md)  
   *Backend folder walkthrough, full API route specifications, request lifecycle trace from HTTP intake to DB and back.*

7. [**07. Authentication & Security**](07-authentication.md)  
   *JWT token lifecycle, bcrypt password hashing, role-based access control (RBAC), login experience.*

8. [**08. Real-Time Telemetry & Socket.IO**](08-realtime-system.md)  
   *Socket.IO setup, event lifecycle, 3-second driver location pings, emergency SOS alerts, disconnect/reconnect handling.*

9. [**09. Geospatial & Routing Layer**](09-geospatial-routing.md)  
   *Bengaluru localization (INR, EV fleet), Geohashing vs PostGIS spatial indexes, OSRM routing boundary.*

10. [**10. Frontend Architecture & Design System**](10-frontend.md)  
    *Vite + React 18 layout, Slate & Royal Blue palette (`#0F172A`/`#2563EB`), Developer Telemetry Mode context.*

11. [**11. The Platform & Incomplete Modules**](11-other-modules.md)  
    *CivicPulse (40%), Sentinel (25%), Smart Parking (15%), Transit Analytics roadmap & platform narrative.*

12. [**12. Bugs Found & Fixed**](12-bugs-fixed.md)  
    *Detour slider candidate filtering bug and Departure time picker overhaul — root cause, diagnosis, and resolution.*

13. [**13. Deployment & Infrastructure**](13-deployment-infra.md)  
    *Multi-stage Docker containers, Docker Compose, environment variables, production deployment gaps.*

14. [**14. Scaling & Bottleneck Analysis**](14-scaling-bottlenecks.md)  
    *100x traffic bottleneck analysis, PostgreSQL read-replicas, regional Redis sharding.*

15. [**15. Technical Tradeoffs & Future Scope**](15-tradeoffs-future.md)  
    *Resume-timeline shortcuts vs production systems, single biggest technical risk, top 3 improvements.*

16. [**16. Technical Glossary**](16-glossary.md)  
    *First-principles definitions of every technical term used in this codebase.*

17. [**17. Master Interview Q&A Bank**](17-interview-qa.md)  
    *28 high-frequency interview questions with first-person model answers ready for placements.*

---
*Repository Link: [https://github.com/akshita19904/Terra](https://github.com/akshita19904/Terra)*
