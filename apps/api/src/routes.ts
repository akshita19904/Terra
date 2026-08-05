import { FastifyInstance } from 'fastify';
import { authRoutes } from './modules/waypoint/users/controllers/auth.controller.js';
import { vehicleRoutes } from './modules/waypoint/users/controllers/vehicle.controller.js';
import { rideRoutes } from './modules/waypoint/rides/controllers/ride.controller.js';
import { matchingRoutes } from './modules/waypoint/matching/controllers/matching.controller.js';
import { emergencyRoutes } from './modules/waypoint/trust/controllers/emergency.controller.js';

export async function registerRoutes(fastify: FastifyInstance) {
  // Terra Platform & Waypoint API v1 registration
  fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  fastify.register(vehicleRoutes, { prefix: '/api/v1/users' });
  fastify.register(rideRoutes, { prefix: '/api/v1/rides' });
  fastify.register(matchingRoutes, { prefix: '/api/v1/rides' });
  fastify.register(emergencyRoutes, { prefix: '/api/v1/trust' });

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  });
}
