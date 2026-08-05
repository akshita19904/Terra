export interface LocationPoint {
  lat: number;
  lng: number;
  address?: string;
}

export interface CandidateMatch {
  offerId: string;
  driverId: string;
  driverName: string;
  driverTrustScore: number;
  vehicleMakeModel: string;
  availableCapacity: number;
  matchScore: number;
  routeSimilarityScore: number;
  estimatedDetourSeconds: number;
  estimatedDetourMeters: number;
  estimatedPickupTime: string;
  estimatedDropoffTime: string;
  estimatedFare: number;
}

export interface RideOffer {
  id: string;
  driverId: string;
  originAddress: string;
  destinationAddress: string;
  departureTime: string;
  totalCapacity: number;
  availableCapacity: number;
  status: string;
  estimatedDurationSec: number;
  estimatedDistanceMtr: number;
}

export interface RideRequest {
  id: string;
  passengerId: string;
  pickupAddress: string;
  dropoffAddress: string;
  desiredDepartureTime: string;
  requestedSeats: number;
  maxDetourMinutes: number;
  status: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
}
