import { FastifyInstance } from 'fastify';
import { authRoutes } from './modules/waypoint/users/controllers/auth.controller.js';

export async function registerRoutes(fastify: FastifyInstance) {
  // FlowOS Platform & Waypoint API v1 registration
  fastify.register(authRoutes, { prefix: '/api/v1/auth' });

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  });
}
