import { z } from 'zod';

export const CreateVehicleSchema = z.object({
  make: z.string().min(1, 'Vehicle make is required'),
  model: z.string().min(1, 'Vehicle model is required'),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Vehicle color is required'),
  plateNumber: z.string().min(2, 'License plate number is required'),
  totalCapacity: z.number().int().min(1).max(8).default(4),
  comfortClass: z.enum(['STANDARD', 'PREMIUM', 'ELECTRIC']).default('STANDARD'),
});

export type CreateVehicleDTO = z.infer<typeof CreateVehicleSchema>;
