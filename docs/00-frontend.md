# 10. Frontend Architecture & Design System

This document details the frontend architecture, state management, and custom Slate design system implemented in `apps/web`.

---

## 1. Frontend Directory Structure

```
apps/web/src/
├── components/
│   ├── analytics/                     # AnalyticsDashboard.tsx (Recharts telemetry graphs)
│   ├── common/                        # Header, DateTimePicker, Toast, LocationAutocomplete, ConfirmationModal
│   ├── map/                           # MapboxView.tsx (Slate Mapbox Vector Canvas Visualizer)
│   └── rides/                         # RequestWizard.tsx, CandidatesList.tsx, RideLifecycleStepper.tsx
│
├── context/
│   └── DevModeContext.tsx             # Global Developer Telemetry Mode State Context
│
├── pages/
│   ├── Dashboard.tsx                  # Master Shell Layout & Tab Navigator
│   ├── TerraDashboard.tsx             # Platform Operations Overview & Module Architecture Cards
│   ├── WaypointModule.tsx             # Flagship Mobility Matching Console
│   ├── UserProfilePage.tsx            # User Profile, History & Saved Places Management
│   ├── LoginPage.tsx                  # Glassmorphic Login & Registration Page
│   ├── CivicPulsePage.tsx             # Civic Infrastructure Reporting Preview (Under Construction)
│   ├── SentinelPage.tsx               # Emergency Response SOS Preview (Under Construction)
│   └── ParkingPage.tsx                # Smart Parking Preview (Planned)
│
└── styles/
    └── index.css                      # Slate Palette Tokens, Utility Classes & Restrained Buttons
```

---

## 2. Design System Tokens & Aesthetics (`index.css`)

The UI is built on a mature **Slate & Royal Blue palette**, replacing generic AI neon dashboard aesthetics with a clean, calm design system inspired by **Stripe**, **Linear**, **Uber**, and **Google Maps**.

### Color Tokens (`index.css`):
- **Background**: `#0F172A` (Slate 900)
- **Surface**: `#1E293B` (Slate 800)
- **Elevated Surface**: `#273449`
- **Borders**: `#334155` (Slate 700)
- **Primary Accent**: `#2563EB` (Royal Blue)
- **Primary Hover**: `#3B82F6` (Blue 500)
- **Success**: `#16A34A` (Green 600)
- **Warning**: `#F59E0B` (Amber 500)
- **Danger**: `#DC2626` (Red 600)
- **Primary Text**: `#F8FAFC` (Slate 50)
- **Secondary Text**: `#94A3B8` (Slate 400)

### Restrained Button & Card Classes:
- `.card-slate`: Flat elevated card with 12px rounded corners (`rounded-xl`) and thin 1px border (`#334155`).
- `.btn-primary`: Sleek Royal Blue button (`#2563EB`) with active focus ring and smooth hover transition.

---

## 3. Developer Telemetry Mode (`DevModeContext.tsx`)

A unique feature built into the frontend is **Developer Telemetry Mode**:
- Toggling the **Developer Mode** switch in the top header toggles global state in `DevModeContext.tsx`.
- **Consumer Mode (OFF)**: Shows clean Uber-style human copy (*"Finding nearby rides...", "Driver accepted", "4 mins faster"*).
- **Developer Mode (ON)**: Exposes raw backend engineering telemetry directly on ride cards (PostGIS spatial query times, Geohash buckets, vector cosine similarity dot-products, and $S(d,p)$ score breakdowns) for live technical interview demonstrations.

---

## 4. Frontend-to-Backend Communication

- **HTTP REST APIs**: Uses `fetch` with `Authorization: Bearer <jwt>` headers to query `/api/v1/*` endpoints.
- **Real-Time WebSockets**: Connects via `socket.io-client` on port `4000`, listening to `ride:state_changed` and `emergency:alert` events.
