# 05. The Matching Engine Deep Dive

This document details the multi-objective commute-matching algorithm implemented in `apps/api/src/modules/waypoint/matching/services/matchingEngine.service.ts` and `heuristicScorer.ts`.

---

## 1. Step-by-Step Algorithm Walkthrough

When a passenger requests a commute match, the system executes an ordered 7-stage optimization pipeline:

```
 [ Stage 1: Intake Request ] ➔ Passenger enters pickup, dropoff, departure time & max detour
        │
        ▼
 [ Stage 2: Spatial Pruning ] ➔ PostGIS ST_DWithin() reduces candidate pool by ~95%
        │
        ▼
 [ Stage 3: Departure Window Filter ] ➔ Excludes drivers leaving outside time flexibility window
        │
        ▼
 [ Stage 4: Trajectory Alignment ] ➔ Calculates directional vector cosine similarity
        │
        ▼
 [ Stage 5: Detour Duration Math ] ➔ Calculates pickup/dropoff extra travel time via Haversine
        │
        ▼
 [ Stage 6: Calculate Score S(d,p) ] ➔ Applies composite weighted formula
        │
        ▼
 [ Stage 7: Rank & Return Matches ] ➔ Sorts candidates descending and returns top K recommendations
```

---

## 2. Weighted Scoring Factors Breakdown

The matching engine evaluates candidates using the composite score formula $S(d,p)$:

$$S(d, p) = 0.35 \cdot \text{Similarity} + 0.25 \cdot \left(1 - \frac{\Delta t_{\text{detour}}}{T_{\text{max detour}}}\right) + 0.25 \cdot \text{TimeFlexibility} + 0.15 \cdot \text{TrustScore}$$

| Factor | Weight | Formula / Source | Purpose |
| :--- | :--- | :--- | :--- |
| **Route Similarity** | **35%** | $\frac{\vec{V}_{\text{driver}} \cdot \vec{V}_{\text{passenger}}}{\|\vec{V}_{\text{driver}}\| \|\vec{V}_{\text{passenger}}\|}$ | Measures vector directional alignment. Prevents matching drivers heading in opposite directions. |
| **Detour Penalty** | **25%** | $1 - \frac{\Delta t_{\text{detour}}}{T_{\text{max detour}}}$ | Penalizes drivers having to drive out of their way. Maximum detour capped by passenger. |
| **Time Flexibility** | **25%** | $1 - \frac{\|T_{\text{driver}} - T_{\text{passenger}}\|}{30\text{ mins}}$ | Evaluates departure schedule alignment within a 30-minute window. |
| **Driver Trust Score** | **15%** | $T \in [0.20, 1.00]$ (Normalized) | Prefers verified drivers with high ratings, low cancellation rates, and zero safety reports. |

---

## 3. Greedy Heuristic vs Hungarian Algorithm

### Why we started with a Greedy Heuristic:
- **Computational Latency**: A greedy heuristic evaluates candidate offers independently in $O(M \log M)$ time, returning results in $<12\text{ms}$. The **Hungarian Algorithm** (Kuhn-Munkres algorithm for optimal bipartite matching) has a time complexity of $O(N^3)$, which spikes CPU memory under high load.
- **Real-Time Responsiveness**: Passengers expect instant matches. A greedy approach returns instant recommendations without blocking the event loop.

### Extensibility to Hungarian Algorithm in Codebase:
Is there a seam to swap it in? **YES.**  
The matching engine is decoupled using a strategy interface:
`IMatchingStrategy` in `apps/api/src/modules/waypoint/matching/interfaces/matchingStrategy.interface.ts`.  
Swapping from `GreedyMatchingStrategy` to `HungarianBipartiteStrategy` requires implementing the interface without modifying route controllers or PostGIS spatial queries.

---

## 4. Worked Numeric Example (By Hand)

Let's evaluate candidate Driver **Aarav** for Passenger **Priya**:

### Input Parameters:
- Max Detour Allowed ($T_{\text{max detour}}$): **10 minutes** (600 seconds)
- Aarav's Route Alignment ($\text{Similarity}$): **0.94** (94% parallel vector)
- Pickup Detour Duration ($\Delta t_{\text{detour}}$): **4 minutes** (240 seconds)
- Departure Time Gap ($\Delta T$): **5 minutes**
- Aarav's Normalized Trust Score: **0.98** (4.90 rating out of 5.0)

### Calculation Step-by-Step:
1. **Similarity Score**: $0.35 \times 0.94 = \mathbf{0.3290}$
2. **Detour Score**: $0.25 \times \left(1 - \frac{4}{10}\right) = 0.25 \times 0.60 = \mathbf{0.1500}$
3. **Time Flexibility**: $0.25 \times \left(1 - \frac{5}{30}\right) = 0.25 \times 0.8333 = \mathbf{0.2083}$
4. **Trust Score**: $0.15 \times 0.98 = \mathbf{0.1470}$

$$\text{Composite Score } S(d,p) = 0.3290 + 0.1500 + 0.2083 + 0.1470 = \mathbf{0.8343 \quad (83.4\% \text{ Match Score})}$$

---

## 5. Known Limitations
1. **Dynamic Traffic Variability**: Detour duration uses static Haversine speed heuristics. Sudden road closures or live traffic bottlenecks require dynamic OSRM matrix API updates.
2. **Multi-Hop Pooling**: Currently matches 1 passenger request per driver route polyline segment rather than multi-passenger chain pickups.
