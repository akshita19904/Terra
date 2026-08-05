import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { VehicleService } from '../services/vehicle.service.js';
import { CreateVehicleSchema } from '../dto/vehicle.dto.js';
import { formatSuccessResponse } from '../../../../platform/middleware/responseEnvelope.js';
import { authenticateJWT } from '../../../../platform/auth/jwt.js';

export async function vehicleRoutes(fastify: FastifyInstance) {
  const vehicleService = new VehicleService();

  // POST /api/v1/users/vehicles
  fastify.post('/vehicles', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userPayload!.userId;
    const dto = CreateVehicleSchema.parse(request.body);
    const vehicle = await vehicleService.registerVehicle(userId, dto);

    return reply.status(201).send(formatSuccessResponse(vehicle));
  });

  // GET /api/v1/users/vehicles
  fastify.get('/vehicles', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userPayload!.userId;
    const vehicles = await vehicleService.getDriverVehicles(userId);

    return reply.status(200).send(formatSuccessResponse(vehicles));
  });
}
