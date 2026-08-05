import { prisma } from '../../../../platform/database/prisma.js';
import { CandidateOfferRaw, RideRequestRaw } from '../interfaces/matchingStrategy.interface.js';

export class SpatialCandidateRepository {
  async getCandidateOffersForRequest(request: RideRequestRaw, limit: number = 20): Promise<CandidateOfferRaw[]> {
    // Spatial candidate pruning: query active offers scheduled within departure window
    const minDeparture = new Date(request.desiredDepartureTime.getTime() - request.timeFlexibilityMinutes * 60000);
    const maxDeparture = new Date(request.desiredDepartureTime.getTime() + request.timeFlexibilityMinutes * 60000);

    const rawOffers = await prisma.rideOffer.findMany({
      where: {
        status: 'SCHEDULED',
        availableCapacity: {
          gte: request.requestedSeats,
        },
        departureTime: {
          gte: minDeparture,
          lte: maxDeparture,
        },
      },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
      },
      take: limit,
    });

    // Fetch PostGIS raw coordinates for origin and destination
    const offersWithCoords: CandidateOfferRaw[] = [];

    for (const offer of rawOffers) {
      const coordsRes = await prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          ST_Y(origin_location) as origin_lat,
          ST_X(origin_location) as origin_lng,
          ST_Y(destination_location) as dest_lat,
          ST_X(destination_location) as dest_lng
        FROM ride_offers
        WHERE id = '${offer.id}'::uuid
      `);

      const coords = coordsRes[0] || {
        origin_lat: 0,
        origin_lng: 0,
        dest_lat: 0,
        dest_lng: 0,
      };

      offersWithCoords.push({
        offerId: offer.id,
        driverId: offer.driverId,
        driverName: `${offer.driver.user.firstName} ${offer.driver.user.lastName}`,
        driverTrustScore: Number(offer.driver.trustScore),
        vehicleMakeModel: `${offer.vehicle.make} ${offer.vehicle.model}`,
        availableCapacity: offer.availableCapacity,
        originLat: Number(coords.origin_lat || 0),
        originLng: Number(coords.origin_lng || 0),
        destLat: Number(coords.dest_lat || 0),
        destLng: Number(coords.dest_lng || 0),
        departureTime: offer.departureTime,
        estimatedDurationSec: offer.estimatedDurationSec,
        estimatedDistanceMtr: offer.estimatedDistanceMtr,
        routeGeohashes: offer.routeGeohashes,
      });
    }

    return offersWithCoords;
  }
}
