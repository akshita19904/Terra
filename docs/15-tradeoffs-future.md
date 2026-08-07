# 15. Tradeoffs & What I'd Do Differently

This document provides a frank self-assessment of the technical shortcuts taken during project development, the single biggest technical risk in the codebase, and top architectural improvements for future iterations.

---

## 1. Resume-Timeline Shortcuts vs Production Systems

| Feature Area | Shortcut Taken in this Codebase | Production-Grade Standard |
| :--- | :--- | :--- |
| **Routing Geometry** | Static speed Haversine heuristics for detour calculation. | Real-time traffic-aware OSRM / Mapbox matrix API routing. |
| **Payment Ingestion** | Calculated Rupee fare estimated in code. | Stripe / Razorpay Webhook payment gateway integration. |
| **Identity Verification** | Manual `isVerified` boolean flag in `DriverProfile`. | Automated OCR driving license & Aadhaar API verification (Veriff / Digilocker). |
| **Database Migrations** | Single migration script (`prisma migrate dev`). | Zero-downtime blue/green schema migration pipeline. |

---

## 2. The Single Biggest Technical Risk in this Codebase

### ⚠️ Single-Point-of-Failure: In-Memory Matching Engine Execution
The single biggest technical risk is that **the 7-stage candidate matching engine runs inside the main Node.js event loop thread**.

If a passenger submits a request with an abnormally large detour limit or a corrupted polyline string containing thousands of coordinate vertices, computing vector cosine similarity dot-products synchronously blocks the single-threaded Node.js event loop. During this time, **all incoming HTTP requests and WebSocket telemetry pings stall**.

### Mitigation Strategy:
In a production system, complex matching jobs should be offloaded to **Worker Threads** (`worker_threads` module) or an external background job queue (BullMQ + Redis worker processes) to keep the main HTTP thread non-blocking.

---

## 3. Top 3 Things I Would Do Differently With More Time

1. **Implement Hungarian Bipartite Graph Matching**: Replace the single-request greedy heuristic with a global batch matching engine running the Hungarian Algorithm every 30 seconds to maximize total system-wide CO₂ savings across all pending commuters.
2. **Offload Heavy Calculations to Worker Threads**: Delegate polyline vector dot-product math to background worker threads so HTTP response times remain $<5\text{ms}$ under load.
3. **Add Full E2E Playwright Automation**: Add automated End-to-End browser testing with Playwright to validate the 3-step Request Wizard flow, DateTimePicker rollover, and Location Autocomplete keyboard navigation automatically.
