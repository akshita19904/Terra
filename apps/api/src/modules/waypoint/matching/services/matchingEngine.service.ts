import { SpatialCandidateRepository } from '../repositories/candidate.repository.js';
import { WeightedHeuristicStrategy } from '../algorithms/heuristicScorer.js';
import { IMatchingStrategy, RideRequestRaw } from '../interfaces/matchingStrategy.interface.js';
import { AppError } from '../../../../platform/middleware/errorHandler.js';
import { prisma } from '../../../../platform/database/prisma.js';

export class MatchingEngineService {
  constructor(
    private candidateRepository: SpatialCandidateRepository = new SpatialCandidateRepository(),
    private strategy: IMatchingStrategy = new WeightedHeuristicStrategy()
  ) {}

  async findMatchesForRequest(requestId: string, limit: number = 10) {
    const request = await prisma.rideRequest.findUnique({
      where: { id: requestId },
      include: {
        passenger: true,
      },
    });

    if (!request) {
      throw new AppError(404, 'REQUEST_NOT_FOUND', 'Ride request not found');
    }

    // Extract pickup and dropoff coordinates from PostGIS
    const coordsRes = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        ST_Y(pickup_location) as pickup_lat,
        ST_X(pickup_location) as pickup_lng,
        ST_Y(dropoff_location) as dropoff_lat,
        ST_X(dropoff_location) as dropoff_lng
      FROM ride_requests
      WHERE id = '${request.id}'::uuid
    `);

    const coords = coordsRes[0] || { pickup_lat: 0, pickup_lng: 0, dropoff_lat: 0, dropoff_lng: 0 };

    const requestRaw: RideRequestRaw = {
      requestId: request.id,
      passengerId: request.passengerId,
      pickupLat: Number(coords.pickup_lat),
      pickupLng: Number(coords.pickup_lng),
      dropoffLat: Number(coords.dropoff_lat),
      dropoffLng: Number(coords.dropoff_lng),
      desiredDepartureTime: request.desiredDepartureTime,
      requestedSeats: request.requestedSeats,
      maxDetourMinutes: request.maxDetourMinutes,
      timeFlexibilityMinutes: request.timeFlexibilityMinutes,
    };

    // 1. Candidate Pruning Phase
    const candidates = await this.candidateRepository.getCandidateOffersForRequest(requestRaw, limit * 3);

    // 2. Evaluation & Scoring Phase
    const scoredMatches = candidates.map((candidate) => {
      const evaluation = this.strategy.evaluateCandidate(requestRaw, candidate);
      return {
        ...evaluation,
        driverName: candidate.driverName,
        driverTrustScore: candidate.driverTrustScore,
        vehicleMakeModel: candidate.vehicleMakeModel,
        availableCapacity: candidate.availableCapacity,
      };
    });

    // 3. Ranking & Selection Phase
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    return {
      requestId: request.id,
      totalCandidatesEvaluated: candidates.length,
      strategyUsed: this.strategy.name,
      matches: scoredMatches.slice(0, limit),
    };
  }
}
