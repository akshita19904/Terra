export interface CandidateOfferRaw {
  offerId: string;
  driverId: string;
  driverName: string;
  driverTrustScore: number;
  vehicleMakeModel: string;
  availableCapacity: number;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  departureTime: Date;
  estimatedDurationSec: number;
  estimatedDistanceMtr: number;
  routeGeohashes: string[];
}

export interface RideRequestRaw {
  requestId: string;
  passengerId: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  desiredDepartureTime: Date;
  requestedSeats: number;
  maxDetourMinutes: number;
  timeFlexibilityMinutes: number;
}

export interface MatchEvaluationResult {
  offerId: string;
  matchScore: number;
  routeSimilarityScore: number;
  estimatedDetourSeconds: number;
  estimatedDetourMeters: number;
  estimatedPickupTime: Date;
  estimatedDropoffTime: Date;
  estimatedFare: number;
}

export interface IMatchingStrategy {
  name: string;
  evaluateCandidate(request: RideRequestRaw, candidate: CandidateOfferRaw): MatchEvaluationResult;
}
