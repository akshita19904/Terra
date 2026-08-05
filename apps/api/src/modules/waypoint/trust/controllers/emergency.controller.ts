import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { EmergencyService, TriggerSosSchema } from '../services/emergency.service.js';
import { formatSuccessResponse } from '../../../../platform/middleware/responseEnvelope.js';
import { authenticateJWT } from '../../../../platform/auth/jwt.js';

export async function emergencyRoutes(fastify: FastifyInstance) {
  const emergencyService = new EmergencyService();

  // POST /api/v1/trust/emergency/sos - Trigger emergency signal
  fastify.post('/emergency/sos', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userPayload!.userId;
    const dto = TriggerSosSchema.parse(request.body);
    const sosEvent = await emergencyService.triggerSos(userId, dto);

    return reply.status(201).send(formatSuccessResponse(sosEvent));
  });

  // GET /api/v1/trust/emergency/active - List active emergency alerts (Admin / Dispatcher)
  fastify.get('/emergency/active', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const emergencies = await emergencyService.getActiveEmergencies();
    return reply.status(200).send(formatSuccessResponse(emergencies));
  });
}
