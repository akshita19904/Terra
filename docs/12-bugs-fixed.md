# 12. Real Bugs Diagnosed & Fixed

This document details two critical production bugs identified and resolved during platform development. Walking through these bugs in technical interviews demonstrates strong debugging skills and deep system knowledge.

---

## 🐛 Bug 1: Matching Engine Returning Stale Results After Changing Detour Limit Slider

### 1. Symptom
Changing the **"Maximum Detour Limit"** slider (e.g. moving from 10 minutes to 25 minutes) and re-clicking **"Find Best Ride"** returned the exact same candidates, scores, and per-candidate detour values as the previous run—even when the relaxed detour limit should have included new driver candidates.

### 2. Diagnosis & Root Cause
By logging the incoming request payload in Fastify, we discovered that `maxDetourMinutes` was being captured correctly by the slider component in `RequestWizard.tsx`. However, the matching engine service (`matchingEngine.service.ts`) was using a cached query key (`matching:query:${pickup}:${dropoff}`) in Redis without appending `maxDetourMinutes` to the cache key string!

```typescript
// BROKEN CODE (Cache Invalidation Gap):
const cacheKey = `matching:query:${pickup.address}:${dropoff.address}`; 
// Changing maxDetourMinutes resulted in a Redis cache HIT, returning stale results!
```

### 3. Fix Applied
Updated the Redis cache key generation logic to include `maxDetourMinutes`, `requestedSeats`, and the binned departure timestamp:

```typescript
// FIXED CODE:
const cacheKey = `matching:query:${pickup.address}:${dropoff.address}:${maxDetourMinutes}:${requestedSeats}:${timeBin}`;
```

### 4. System Insight
This bug revealed a **cache key invalidation gap**. When adding input filters to a UI, the backend cache key must incorporate all state variables that affect query output.

---

## 🐛 Bug 2: Departure Time Picker Usability & Past Time Selection Bug

### 1. Symptom
The departure time dropdown allowed users to select past time slots (e.g., selecting 03:00 PM when current time was 11:00 PM IST), broke when scrolling on mobile touch screens, and arbitrarily cut off dropdown options at 15:00.

### 2. Diagnosis & Root Cause
The legacy native HTML `<select>` input lacked time boundary validation and rendered native OS pickers with inconsistent cross-browser scroll behaviors. It allowed setting invalid ISO string timestamps in the past, causing the backend time flexibility filter to reject requests with runtime exceptions.

### 3. Fix Applied
Completely redesigned the date/time selection experience by building a custom `DateTimePicker.tsx` popover component:
1. **Disabled Past Time Slots**: Generates 48 30-minute intervals (`00:00` to `23:30`). For today's date, slots earlier than `current_time + 15_mins` are flagged `isPast = true` and rendered unselectable (`disabled`).
2. **Smooth Touch & Scroll**: Replaced native select with a custom scrollable popover container featuring custom webkit scrollbar utilities.
3. **Smart Default Rollover**: If the user opens the picker late at night (e.g. after 23:00), the component automatically rolls over the default date to **Tomorrow 08:00 AM**.

```typescript
// Excerpt from DateTimePicker.tsx:
const isPastSlot = isToday && (slotHour < currentHour || (slotHour === currentHour && slotMinute < currentMinute));
```

### 4. System Insight
This bug highlighted the importance of **defensive UI validation**. Frontend inputs should prevent invalid states from ever reaching the network layer.
