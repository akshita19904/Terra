import { EmergencyRepository } from '../repositories/emergency.repository.js';
import { z } from 'zod';

export const TriggerSosSchema = z.object({
  rideMatchId: z.string().uuid().optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  notes: z.string().optional(),
});

export type TriggerSosDTO = z.infer<typeof TriggerSosSchema>;

export class EmergencyService {
  constructor(private emergencyRepository: EmergencyRepository = new EmergencyRepository()) {}

  async triggerSos(userId: string, dto: TriggerSosDTO) {
    return this.emergencyRepository.createEmergencyEvent({
      userId,
      rideMatchId: dto.rideMatchId,
      lat: dto.lat,
      lng: dto.lng,
      notes: dto.notes,
    });
  }

  async getActiveEmergencies() {
    return this.emergencyRepository.getActiveEmergencyEvents();
  }
}
