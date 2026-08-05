import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RideService } from '../services/ride.service.js';
import { CreateRideOfferSchema, CreateRideRequestSchema } from '../dto/ride.dto.js';
import { formatSuccessResponse } from '../../../../platform/middleware/responseEnvelope.js';
import { authenticateJWT } from '../../../../platform/auth/jwt.js';

export async function rideRoutes(fastify: FastifyInstance) {
  const rideService = new RideService();

  // POST /api/v1/rides/offers - Driver publishes route offer
  fastify.post('/offers', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userPayload!.userId;
    const dto = CreateRideOfferSchema.parse(request.body);
    const offer = await rideService.createRideOffer(userId, dto);

    return reply.status(201).send(formatSuccessResponse(offer));
  });

  // GET /api/v1/rides/offers/:id
  fastify.get('/offers/:id', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const offer = await rideService.getOfferById(id);

    return reply.status(200).send(formatSuccessResponse(offer));
  });

  // POST /api/v1/rides/requests - Passenger submits commute request
  fastify.post('/requests', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userPayload!.userId;
    const dto = CreateRideRequestSchema.parse(request.body);
    const rideRequest = await rideService.createRideRequest(userId, dto);

    return reply.status(201).send(formatSuccessResponse(rideRequest));
  });

  // GET /api/v1/rides/requests/:id
  fastify.get('/requests/:id', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const rideRequest = await rideService.getRequestById(id);

    return reply.status(200).send(formatSuccessResponse(rideRequest));
  });
}
