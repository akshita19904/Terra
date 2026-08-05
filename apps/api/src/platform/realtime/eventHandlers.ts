import { AuthenticatedSocket } from './socketAuth.js';
import { Server } from 'socket.io';
import { prisma } from '../database/prisma.js';
import { encodeGeohash } from '../spatial/geohash.js';

export function registerSocketEventHandlers(io: Server, socket: AuthenticatedSocket) {
  const userId = socket.user?.userId;
  const userRole = socket.user?.role;

  console.log(`🔌 WebSocket Client Connected: user ${userId} (${userRole}), socket ID: ${socket.id}`);

  // Join personal user notification room
  if (userId) {
    socket.join(`user:${userId}`);
  }

  // Event: Join Trip Room
  socket.on('ride:join_room', ({ matchId }: { matchId: string }) => {
    socket.join(`match:${matchId}`);
    console.log(`👤 User ${userId} joined room match:${matchId}`);
  });

  // Event: Driver Telemetry Location Ping
  socket.on(
    'driver:location_ping',
    async (data: {
      matchId?: string;
      lat: number;
      lng: number;
      heading?: number;
      speed?: number;
    }) => {
      if (userRole !== 'DRIVER') return;

      const geohash = encodeGeohash(data.lat, data.lng, 7);

      // Update driver profile last known location in database
      await prisma.$executeRawUnsafe(`
        UPDATE driver_profiles
        SET 
          last_known_location = ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326),
          last_location_time = NOW(),
          geohash = '${geohash}',
          current_status = 'IN_TRIP'
        WHERE user_id = '${userId}'::uuid
      `);

      // If driver is in an active trip match room, broadcast to passenger
      if (data.matchId) {
        io.to(`match:${data.matchId}`).emit('driver:location_update', {
          matchId: data.matchId,
          driverId: userId,
          location: { lat: data.lat, lng: data.lng },
          heading: data.heading || 0,
          speed: data.speed || 0,
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  // Event: Driver-Passenger Chat Message
  socket.on('chat:send_message', async (data: { matchId: string; text: string }) => {
    if (!data.text || !data.matchId) return;

    const chatEventPayload = {
      matchId: data.matchId,
      senderId: userId,
      text: data.text,
      timestamp: new Date().toISOString(),
    };

    // Broadcast message to room
    io.to(`match:${data.matchId}`).emit('chat:new_message', chatEventPayload);
  });

  // Event: Emergency SOS Trigger
  socket.on('emergency:sos_trigger', async (data: { matchId?: string; lat: number; lng: number; notes?: string }) => {
    const sosRecord = await prisma.emergencyEvent.create({
      data: {
        userId: userId!,
        rideMatchId: data.matchId || null,
        status: 'TRIGGERED',
        notes: data.notes || 'Emergency SOS triggered via real-time WebSocket connection',
      },
    });

    await prisma.$executeRawUnsafe(`
      UPDATE emergency_events
      SET location = ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326)
      WHERE id = '${sosRecord.id}'::uuid
    `);

    const sosAlertPayload = {
      sosId: sosRecord.id,
      userId,
      matchId: data.matchId,
      location: { lat: data.lat, lng: data.lng },
      timestamp: sosRecord.createdAt.toISOString(),
    };

    // High priority broadcast to emergency dispatchers and match room
    io.emit('emergency:alert', sosAlertPayload);
    console.log(`🚨 EMERGENCY SOS BROADCAST: ${sosRecord.id} for user ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
}
