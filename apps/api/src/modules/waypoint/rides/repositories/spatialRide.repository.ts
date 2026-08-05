import { prisma } from '../../../../platform/database/prisma.js';
import { createKyselyDb } from '../../../../platform/database/kysely.js';
import { CreateRideOfferDTO, CreateRideRequestDTO } from '../dto/ride.dto.js';
import { encodeGeohash } from '../../../../platform/spatial/geohash.js';

export class SpatialRideRepository {
  private kysely = createKyselyDb();

  async createRideOffer(driverId: string, dto: CreateRideOfferDTO) {
    const originGeohash = encodeGeohash(dto.origin.lat, dto.origin.lng, 7);
    const destGeohash = encodeGeohash(dto.destination.lat, dto.destination.lng, 7);

    // Compute route geohashes for candidate matching
    const routeGeohashes = Array.from(
      new Set(dto.routeCoordinates.map((coord) => encodeGeohash(coord.lat, coord.lng, 5)))
    );

    const offer = await prisma.rideOffer.create({
      data: {
        driverId,
        vehicleId: dto.vehicleId,
        originAddress: dto.origin.address || `${dto.origin.lat.toFixed(4)}, ${dto.origin.lng.toFixed(4)}`,
        destinationAddress: dto.destination.address || `${dto.destination.lat.toFixed(4)}, ${dto.destination.lng.toFixed(4)}`,
        routeGeohashes,
        departureTime: new Date(dto.departureTime),
        flexibleWindowMinutes: dto.flexibleWindowMinutes,
        totalCapacity: dto.totalCapacity,
        availableCapacity: dto.totalCapacity,
        status: 'SCHEDULED',
        estimatedDurationSec: dto.estimatedDurationSec,
        estimatedDistanceMtr: dto.estimatedDistanceMeters,
      },
    });

    // Populate PostGIS spatial geometry columns using raw SQL query
    const lineStringCoords = dto.routeCoordinates.map((c) => `${c.lng} ${c.lat}`).join(', ');

    await prisma.$executeRawUnsafe(`
      UPDATE ride_offers
      SET 
        origin_location = ST_SetSRID(ST_MakePoint(${dto.origin.lng}, ${dto.origin.lat}), 4326),
        destination_location = ST_SetSRID(ST_MakePoint(${dto.destination.lng}, ${dto.destination.lat}), 4326),
        route_polyline = ST_SetSRID(ST_GeomFromText('LINESTRING(${lineStringCoords})'), 4326)
      WHERE id = '${offer.id}'::uuid
    `);

    return offer;
  }

  async createRideRequest(passengerId: string, dto: CreateRideRequestDTO) {
    const pickupGeohash = encodeGeohash(dto.pickup.lat, dto.pickup.lng, 7);
    const dropoffGeohash = encodeGeohash(dto.dropoff.lat, dto.dropoff.lng, 7);

    const request = await prisma.rideRequest.create({
      data: {
        passengerId,
        pickupAddress: dto.pickup.address || `${dto.pickup.lat.toFixed(4)}, ${dto.pickup.lng.toFixed(4)}`,
        dropoffAddress: dto.dropoff.address || `${dto.dropoff.lat.toFixed(4)}, ${dto.dropoff.lng.toFixed(4)}`,
        desiredDepartureTime: new Date(dto.desiredDepartureTime),
        timeFlexibilityMinutes: dto.timeFlexibilityMinutes,
        requestedSeats: dto.requestedSeats,
        maxDetourMinutes: dto.maxDetourMinutes,
        status: 'SEARCHING',
        geohashPickup: pickupGeohash,
        geohashDropoff: dropoffGeohash,
      },
    });

    await prisma.$executeRawUnsafe(`
      UPDATE ride_requests
      SET 
        pickup_location = ST_SetSRID(ST_MakePoint(${dto.pickup.lng}, ${dto.pickup.lat}), 4326),
        dropoff_location = ST_SetSRID(ST_MakePoint(${dto.dropoff.lng}, ${dto.dropoff.lat}), 4326)
      WHERE id = '${request.id}'::uuid
    `);

    return request;
  }
}
