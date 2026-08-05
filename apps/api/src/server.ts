import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { globalErrorHandler } from './platform/middleware/errorHandler.js';
import { registerRoutes } from './routes.js';
import { initializeRealtimeGateway } from './platform/realtime/socketServer.js';
import { initializeBackgroundJobs } from './platform/jobs/backgroundJobs.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'waypoint_super_secret_flowos_jwt_key_2026';

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Plugins
  await fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(fastifyCookie);

  await fastify.register(fastifyJwt, {
    secret: JWT_SECRET,
  });

  // Global Error Handler
  fastify.setErrorHandler(globalErrorHandler);

  // Register Routes
  await fastify.register(registerRoutes);

  return fastify;
}

async function startServer() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    
    // Attach Socket.IO Realtime Gateway to underlying Node.js HTTP server
    initializeRealtimeGateway(app.server);

    // Initialize Background Scheduled Jobs
    initializeBackgroundJobs();

    console.log(`🚀 Waypoint API & Terra Platform Kernel running on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
