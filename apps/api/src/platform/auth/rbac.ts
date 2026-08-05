import { FastifyRequest, FastifyReply } from 'fastify';

export function authorizeRoles(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.userPayload?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      reply.status(403).send({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
        },
      });
    }
  };
}
