import {
  IMatchingStrategy,
  CandidateOfferRaw,
  RideRequestRaw,
  MatchEvaluationResult,
} from '../interfaces/matchingStrategy.interface.js';
import {
  computeRouteSimilarityScore,
  haversineDistanceMeters,
} from './polylineSimilarity.js';

export interface WeightConfig {
  wSim: number;      // Route similarity weight (default 0.35)
  wDetour: number;   // Pickup/Dropoff detour penalty (default 0.25)
  wWait: number;     // Time window mismatch penalty (default 0.15)
  wTrust: number;    // Driver trust score weight (default 0.15)
  wOcc: number;      // Vehicle occupancy weight (default 0.10)
}

const DEFAULT_WEIGHTS: WeightConfig = {
  wSim: 0.35,
  wDetour: 0.25,
  wWait: 0.15,
  wTrust: 0.15,
  wOcc: 0.10,
};

export class WeightedHeuristicStrategy implements IMatchingStrategy {
  public name = 'WeightedHeuristicStrategy_v1';

  constructor(private weights: WeightConfig = DEFAULT_WEIGHTS) {}

  evaluateCandidate(request: RideRequestRaw, candidate: CandidateOfferRaw): MatchEvaluationResult {
    const driverOrigin = { lat: candidate.originLat, lng: candidate.originLng };
    const driverDest = { lat: candidate.destLat, lng: candidate.destLng };
    const passengerPickup = { lat: request.pickupLat, lng: request.pickupLng };
    const passengerDropoff = { lat: request.dropoffLat, lng: request.dropoffLng };

    // 1. Compute Route Similarity Score [0.0, 1.0]
    const similarityScore = computeRouteSimilarityScore(
      driverOrigin,
      driverDest,
      passengerPickup,
      passengerDropoff
    );

    // 2. Compute Pickup & Dropoff Detour Distances (in meters)
    const detourDistanceMeters = Math.round(
      haversineDistanceMeters(driverOrigin, passengerPickup) +
        haversineDistanceMeters(passengerDropoff, driverDest)
    );

    // Estimate detour time based on average urban speed (30 km/h = 8.33 m/s)
    const estimatedDetourSeconds = Math.round(detourDistanceMeters / 8.33);
    const maxDetourSeconds = request.maxDetourMinutes * 60;

    // Detour Penalty [0.0, 1.0]: 1.0 = zero detour, 0.0 = max detour exceeded
    const detourScore = Math.max(0, 1 - estimatedDetourSeconds / maxDetourSeconds);

    // 3. Time Window Flexibility Score [0.0, 1.0]
    const timeDiffMinutes = Math.abs(
      (candidate.departureTime.getTime() - request.desiredDepartureTime.getTime()) / (1000 * 60)
    );
    const maxFlexMinutes = Math.max(request.timeFlexibilityMinutes, 1);
    const timeScore = Math.max(0, 1 - timeDiffMinutes / maxFlexMinutes);

    // 4. Trust Score Normalized [0.0, 1.0]
    const trustScore = Math.min(1, candidate.driverTrustScore / 5.0);

    // 5. Vehicle Occupancy / Capacity Utilization Score [0.0, 1.0]
    const occupancyScore = Math.min(1, request.requestedSeats / Math.max(1, candidate.availableCapacity));

    // Composite Weighted Multi-Objective Score S(d, p)
    const compositeScore = Number(
      (
        this.weights.wSim * similarityScore +
        this.weights.wDetour * detourScore +
        this.weights.wWait * timeScore +
        this.weights.wTrust * trustScore +
        this.weights.wOcc * occupancyScore
      ).toFixed(4)
    );

    // Estimated Pickup & Dropoff Times
    const estimatedPickupTime = new Date(
      candidate.departureTime.getTime() + (haversineDistanceMeters(driverOrigin, passengerPickup) / 8.33) * 1000
    );
    const tripDurationSec = candidate.estimatedDurationSec + estimatedDetourSeconds;
    const estimatedDropoffTime = new Date(estimatedPickupTime.getTime() + tripDurationSec * 1000);

    // Dynamic Fare Calculation (Base $2.50 + $1.20/km + $0.25/min detour)
    const passengerDistanceKm = haversineDistanceMeters(passengerPickup, passengerDropoff) / 1000;
    const estimatedFare = Number((2.5 + passengerDistanceKm * 1.2 + (estimatedDetourSeconds / 60) * 0.25).toFixed(2));

    return {
      offerId: candidate.offerId,
      matchScore: compositeScore,
      routeSimilarityScore: Number(similarityScore.toFixed(4)),
      estimatedDetourSeconds,
      estimatedDetourMeters: detourDistanceMeters,
      estimatedPickupTime,
      estimatedDropoffTime,
      estimatedFare,
    };
  }
}
