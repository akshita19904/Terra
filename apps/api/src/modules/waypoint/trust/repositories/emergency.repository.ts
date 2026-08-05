import { prisma } from '../../../../platform/database/prisma.js';
import { EmergencyEvent } from '@prisma/client';

export class EmergencyRepository {
  async createEmergencyEvent(data: {
    userId: string;
    rideMatchId?: string;
    notes?: string;
    lat: number;
    lng: number;
  }): Promise<EmergencyEvent> {
    const event = await prisma.emergencyEvent.create({
      data: {
        userId: data.userId,
        rideMatchId: data.rideMatchId || null,
        status: 'TRIGGERED',
        notes: data.notes || 'Emergency SOS triggered',
      },
    });

    await prisma.$executeRawUnsafe(`
      UPDATE emergency_events
      SET location = ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326)
      WHERE id = '${event.id}'::uuid
    `);

    return event;
  }

  async getActiveEmergencyEvents(): Promise<EmergencyEvent[]> {
    return prisma.emergencyEvent.findMany({
      where: {
        status: { in: ['TRIGGERED', 'ACKNOWLEDGED', 'DISPATCHED'] },
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
