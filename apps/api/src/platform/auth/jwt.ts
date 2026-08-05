import { FastifyRequest, FastifyReply } from 'fastify';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    userPayload?: TokenPayload;
  }
}

export async function authenticateJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    request.userPayload = request.user as TokenPayload;
  } catch (err) {
    reply.status(401).send({
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired authentication token',
      },
    });
  }
}
