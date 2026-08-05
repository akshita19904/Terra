import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import { RegisterUserSchema, LoginUserSchema } from '../dto/auth.dto.js';
import { formatSuccessResponse } from '../../../../platform/middleware/responseEnvelope.js';
import { authenticateJWT } from '../../../../platform/auth/jwt.js';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();

  // POST /api/v1/auth/register
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const dto = RegisterUserSchema.parse(request.body);
    const user = await authService.register(dto);

    const token = fastify.jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.status(201).send(
      formatSuccessResponse({
        user,
        accessToken: token,
      })
    );
  });

  // POST /api/v1/auth/login
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const dto = LoginUserSchema.parse(request.body);
    const user = await authService.login(dto);

    const token = fastify.jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.status(200).send(
      formatSuccessResponse({
        user,
        accessToken: token,
      })
    );
  });

  // GET /api/v1/auth/me
  fastify.get('/me', { preHandler: [authenticateJWT] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userPayload!.userId;
    const user = await authService.getUserById(userId);

    return reply.status(200).send(formatSuccessResponse({ user }));
  });
}
