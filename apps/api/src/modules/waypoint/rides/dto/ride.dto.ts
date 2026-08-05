import { z } from 'zod';

export const LocationPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().optional(),
});

export const CreateRideOfferSchema = z.object({
  vehicleId: z.string().uuid(),
  origin: LocationPointSchema,
  destination: LocationPointSchema,
  routeCoordinates: z.array(LocationPointSchema).min(2, 'Route must have at least origin and destination'),
  departureTime: z.string().datetime(),
  flexibleWindowMinutes: z.number().int().min(0).max(60).default(15),
  totalCapacity: z.number().int().min(1).max(8).default(4),
  estimatedDurationSec: z.number().int().min(1),
  estimatedDistanceMeters: z.number().int().min(1),
});

export const CreateRideRequestSchema = z.object({
  pickup: LocationPointSchema,
  dropoff: LocationPointSchema,
  desiredDepartureTime: z.string().datetime(),
  timeFlexibilityMinutes: z.number().int().min(0).max(60).default(15),
  requestedSeats: z.number().int().min(1).max(4).default(1),
  maxDetourMinutes: z.number().int().min(1).max(30).default(10),
});

export type LocationPoint = z.infer<typeof LocationPointSchema>;
export type CreateRideOfferDTO = z.infer<typeof CreateRideOfferSchema>;
export type CreateRideRequestDTO = z.infer<typeof CreateRideRequestSchema>;
