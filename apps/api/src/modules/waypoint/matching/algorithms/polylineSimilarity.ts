export interface Coordinate {
  lat: number;
  lng: number;
}

export function haversineDistanceMeters(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function computeDirectionalCosineSimilarity(
  driverOrigin: Coordinate,
  driverDest: Coordinate,
  passengerPickup: Coordinate,
  passengerDropoff: Coordinate
): number {
  const driverVector = {
    x: driverDest.lng - driverOrigin.lng,
    y: driverDest.lat - driverOrigin.lat,
  };

  const passengerVector = {
    x: passengerDropoff.lng - passengerPickup.lng,
    y: passengerDropoff.lat - passengerPickup.lat,
  };

  const dotProduct = driverVector.x * passengerVector.x + driverVector.y * passengerVector.y;
  const magDriver = Math.sqrt(driverVector.x * driverVector.x + driverVector.y * driverVector.y);
  const magPassenger = Math.sqrt(passengerVector.x * passengerVector.x + passengerVector.y * passengerVector.y);

  if (magDriver === 0 || magPassenger === 0) return 0;

  const cosSim = dotProduct / (magDriver * magPassenger);
  return Math.max(-1, Math.min(1, cosSim)); // Clamp to [-1, 1]
}

export function computeRouteSimilarityScore(
  driverOrigin: Coordinate,
  driverDest: Coordinate,
  passengerPickup: Coordinate,
  passengerDropoff: Coordinate
): number {
  const cosSim = computeDirectionalCosineSimilarity(driverOrigin, driverDest, passengerPickup, passengerDropoff);
  const pickupDistanceMtr = haversineDistanceMeters(driverOrigin, passengerPickup);
  const dropoffDistanceMtr = haversineDistanceMeters(driverDest, passengerDropoff);

  // Normalize spatial proximity penalties (e.g. 5000m max radius)
  const pickupProximityScore = Math.max(0, 1 - pickupDistanceMtr / 5000);
  const dropoffProximityScore = Math.max(0, 1 - dropoffDistanceMtr / 5000);

  // Normalized directional cosine: mapped from [-1, 1] to [0, 1]
  const directionalScore = (cosSim + 1) / 2;

  // Composite similarity score
  return 0.5 * directionalScore + 0.25 * pickupProximityScore + 0.25 * dropoffProximityScore;
}
