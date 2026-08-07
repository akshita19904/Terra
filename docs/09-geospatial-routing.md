# 09. Geospatial & Routing Layer

This document details spatial coordinate transformations, Geohashing, PostGIS indexes, and the division of responsibility between external road routers and Waypoint's custom ranking engine.

---

## 1. Indian Context Localization (Bengaluru Default)

### Why Localization Exists:
The application is pre-configured for **Bengaluru, India** (the tech capital of India), featuring heavy tech park commute corridors (Koramangala, Indiranagar, Whitefield ITPL, Yelahanka, Kempegowda Airport).

### Configurable vs Hardcoded Parameters:
- **Currency & Fares**: All calculations compute fares in **Indian Rupees (₹)** (`pricePerKm * distance`).
- **Vehicle Fleet**: Default vehicle profiles represent common Indian green commute vehicles (Tata Nexon EV, Mahindra XUV400, Hyundai Creta SX).
- **Default Map Center**: Coordinates default to `12.9716° N, 77.5946° E` (Bengaluru Central).
- **Configurability**: Default coordinates and currency symbols are stored as environment variables (`DEFAULT_LAT`, `DEFAULT_LNG`, `CURRENCY_SYMBOL="₹"`), allowing instant re-localization to Mumbai, Delhi, or San Francisco.

---

## 2. Geohashing vs PostGIS Spatial Indexes

```
  +-----------------------+-----------------------+
  |                       |                       |
  |   Geohash: tdr1v8a    |   Geohash: tdr1v8b    |
  |  (Manipal Academy)    |  (Yelahanka Station)  |
  |                       |                       |
  +-----------------------+-----------------------+
```

### What is Geohashing?
Geohashing is a hierarchical spatial encoding system that converts a 2D `latitude, longitude` coordinate pair into a short alphanumeric string. Nearby points share common prefix characters.

### Dual-Layer Spatial Indexing Strategy:
1. **Layer 1: Geohash Bucket Pruning**: We encode driver routes into 5-character Geohash buckets ($\approx 4.9\text{ km} \times 4.9\text{ km}$ grid boxes). B-Tree string indexes instantly filter candidates in PostgreSQL.
2. **Layer 2: PostGIS `ST_DWithin` Spatial Indexing**: Within the filtered Geohash bucket, PostGIS `GiST` bounding box trees evaluate exact spherical distances and polyline overlaps in $<10\text{ms}$.

---

## 3. Division of Responsibility: External Routers vs Custom Waypoint Engine

```
  +-------------------------------------+
  |   EXTERNAL ROUTER (OSRM / Mapbox)   |
  |  - Converts GPS points to road graph|
  |  - Generates turn-by-turn polyline  |
  +-------------------------------------+
                    │
                    ▼ (Route Polyline String)
  +-------------------------------------+
  |   WAYPOINT CUSTOM MATCHING ENGINE   |
  |  - Directional Cosine Similarity    |
  |  - Haversine Pickup Detour Math     |
  |  - Multi-Factor Trust Score Weighting|
  |  - Rupee Shared Fare Calculation    |
  +-------------------------------------+
```

- **External Road Routers (OSRM / Mapbox)**: Responsible strictly for **map matching** (turning raw GPS coordinates into road graph polylines).
- **Custom Waypoint Engine**: Responsible for **multi-factor candidate ranking**, evaluating vector route direction, detour minutes, schedule flexibility, and driver trust scores.
