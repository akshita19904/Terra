import { z } from 'zod';

export const CandidateOfferSchema = z.object({
  offerId: z.string().uuid(),
  driverId: z.string().uuid(),
  driverName: z.string(),
  driverTrustScore: z.number(),
  vehicleMakeModel: z.string(),
  availableCapacity: z.number(),
  matchScore: z.number(),
  routeSimilarityScore: z.number(),
  estimatedDetourSeconds: z.number(),
  estimatedDetourMeters: z.number(),
  estimatedPickupTime: z.string().datetime(),
  estimatedDropoffTime: z.string().datetime(),
  estimatedFare: z.number(),
});

export const RunMatchingQuerySchema = z.object({
  requestId: z.string().uuid(),
  limit: z.number().int().min(1).max(50).default(10),
});

export type CandidateOfferDTO = z.infer<typeof CandidateOfferSchema>;
export type RunMatchingQueryDTO = z.infer<typeof RunMatchingQuerySchema>;
