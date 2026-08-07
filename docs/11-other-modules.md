# 11. Platform Modules & Development Roadmap

This document details the modular architecture of the Terra platform, explaining the completion state of each module and the underlying product strategy.

---

## 1. Standardized Product-Development Badges

Software release jargon (such as *Alpha*, *Beta*, *Gamma*) has been **completely eliminated** from the platform UI to avoid misleading users. Instead, realistic product-development states are displayed:

| Module | Status Badge | Completion State | CTA Label |
| :--- | :--- | :--- | :--- |
| **Waypoint Mobility** | `Production Ready` | **100% Fully Built** | *"Open Commute Console"* |
| **CivicPulse Operations** | `Under Construction` | **40% Feature Complete** | *"View Roadmap"* |
| **Sentinel Emergency Response**| `Under Construction` | **25% Feature Complete** | *"Explore Concept"* |
| **Smart Parking** | `Planned` | **15% Concept Preview** | *"Explore Concept"* |
| **Transit Analytics** | `Planned` | **Roadmap Preview** | *"Explore Concept"* |

---

## 2. Incomplete Module Audits

### 2.1 CivicPulse Operations (`Under Construction` — 40% Complete)
- **Intended Purpose**: Crowdsourced municipal infrastructure reporting (potholes, broken streetlights, waterlogging) with automated municipal work-order dispatch.
- **What is REAL in codebase**: PostgreSQL database models (`CivicIssue`), REST API ingestion endpoints (`POST /api/v1/civic/issues`), and frontend preview page (`CivicPulsePage.tsx`).
- **What is STUBBED/MOCK**: External BBMP municipal API sync workers and automatic computer vision pothole detection.
- **Platform Kernel Integration**: Uses `@terra/platform` auth JWT validation and PostGIS `Point` geometry for issue geo-tagging.

### 2.2 Sentinel Emergency Response (`Under Construction` — 25% Complete)
- **Intended Purpose**: High-priority emergency SOS broadcasting, dispatcher telemetry console, and incident geo-fencing.
- **What is REAL in codebase**: Emergency SOS Socket.IO event handler (`emergency:sos_trigger` -> `emergency:alert`), `EmergencySosEvent` database model, and SOS button in header.
- **What is STUBBED/MOCK**: Integration with 112 national emergency dispatch lines.
- **Platform Kernel Integration**: Uses `@terra/platform` Socket.IO full-duplex WebSockets for instantaneous $<10\text{ms}$ emergency broadcasting.

### 2.3 Smart Parking (`Planned` — 15% Preview)
- **Intended Purpose**: Real-time urban parking slot reservation and EV charging station routing.
- **What is REAL in codebase**: Frontend preview concept card (`ParkingPage.tsx`) and database schema stubs.
- **Platform Kernel Integration**: Designed to share Waypoint destination coordinates to auto-reserve EV charging slots upon trip completion.

---

## 3. Platform Strategy: Why Include Incomplete Modules?

In technical interviews, interviewers often ask:  
*"Why show unfinished modules instead of only building Waypoint?"*

### Platform Narrative Rationale:
1. **Architectural Proof-of-Concept**: It demonstrates that Terra was built as an extensible **Platform Kernel**, not a one-off single-purpose app. It proves that new smart city services can be added without modifying core Auth, Database, or WebSocket infrastructure.
2. **Transparency over Deception**: Displaying clear `Under Construction` and `Planned` badges with active development notice banners (*"This module is currently under active development and will be available in a future Terra release"*) builds user trust.
