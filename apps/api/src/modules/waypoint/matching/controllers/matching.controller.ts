import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { MatchingEngineService } from '../services/matchingEngine.service.js';
import { RunMatchingQuerySchema } from '../dto/matching.dto.js';
import { formatSuccessResponse } from '../../../../platform/middleware/responseEnvelope.js';
import { authenticateJWT } from '../../../../platform/auth/jwt.js';

export async function matchingRoutes(fastify: FastifyInstance) {
  const matchingEngineService = new MatchingEngineService();

  // GET /api/v1/rides/requests/:id/candidates - Trigger matching engine for a request
  fastify.get(
    '/requests/:id/candidates',
    { preHandler: [authenticateJWT] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const query = RunMatchingQuerySchema.parse({
        requestId: id,
        ...((request.query as object) || {}),
      });

      const result = await matchingEngineService.findMatchesForRequest(query.requestId, query.limit);

      return reply.status(200).send(formatSuccessResponse(result));
    }
  );
}
