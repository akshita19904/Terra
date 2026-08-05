import { describe, test, expect } from 'vitest';
import { WeightedHeuristicStrategy } from '../modules/waypoint/matching/algorithms/heuristicScorer.js';
import { CandidateOfferRaw, RideRequestRaw } from '../modules/waypoint/matching/interfaces/matchingStrategy.interface.js';

describe('WeightedHeuristicStrategy Matching Engine', () => {
  const strategy = new WeightedHeuristicStrategy();
  const now = new Date();

  const mockRequest: RideRequestRaw = {
    requestId: 'req_123',
    passengerId: 'pas_123',
    pickupLat: 37.7700,
    pickupLng: -122.4100,
    dropoffLat: 37.3400,
    dropoffLng: -121.8900,
    desiredDepartureTime: now,
    requestedSeats: 1,
    maxDetourMinutes: 15,
    timeFlexibilityMinutes: 15,
  };

  const mockCandidatePerfect: CandidateOfferRaw = {
    offerId: 'off_1',
    driverId: 'drv_1',
    driverName: 'John Driver',
    driverTrustScore: 5.0,
    vehicleMakeModel: 'Tesla Model Y',
    availableCapacity: 3,
    originLat: 37.7749,
    originLng: -122.4194,
    destLat: 37.3382,
    destLng: -121.8863,
    departureTime: now,
    estimatedDurationSec: 3600,
    estimatedDistanceMtr: 68000,
    routeGeohashes: ['9q9bf'],
  };

  test('should compute high composite match score for optimal candidate', () => {
    const result = strategy.evaluateCandidate(mockRequest, mockCandidatePerfect);

    expect(result.matchScore).toBeGreaterThan(0.75);
    expect(result.matchScore).toBeLessThanOrEqual(1.0);
    expect(result.estimatedFare).toBeGreaterThan(0);
    expect(result.estimatedDetourSeconds).toBeGreaterThanOrEqual(0);
  });

  test('should penalize candidate with lower driver trust score', () => {
    const mockCandidateLowTrust: CandidateOfferRaw = {
      ...mockCandidatePerfect,
      driverTrustScore: 2.0,
    };

    const resultOptimal = strategy.evaluateCandidate(mockRequest, mockCandidatePerfect);
    const resultLowTrust = strategy.evaluateCandidate(mockRequest, mockCandidateLowTrust);

    expect(resultOptimal.matchScore).toBeGreaterThan(resultLowTrust.matchScore);
  });
});
