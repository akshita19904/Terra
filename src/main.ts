import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/environment';
import { logger } from './shared/infrastructure/logging/logger';
import { errorHandler } from './shared/infrastructure/http/middleware/errorHandler';
import { apiRateLimiter } from './shared/infrastructure/http/middleware/rateLimiter';
import { rootRouter } from './shared/infrastructure/http/routes';
import { db } from './shared/infrastructure/database';

async function bootstrap() {
  const app = express();

  // 1. Core Security & Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(apiRateLimiter);

  // 2. Request Logging Middleware
  app.use((req, _res, next) => {
    logger.info(`HTTP Request`, {
      method: req.method,
      url: req.url,
      ip: req.ip,
    });
    next();
  });

  // 3. API Routes
  app.use(env.apiPrefix, rootRouter);

  // 4. Centralized Error Handler
  app.use(errorHandler);

  // 5. Start Server
  const server = app.listen(env.port, () => {
    logger.info(`🚀 Waypoint Backend Service active on port ${env.port} [env=${env.nodeEnv}]`);
    logger.info(`API Base Path: http://localhost:${env.port}${env.apiPrefix}`);
  });

  // 6. Graceful Shutdown Handlers
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Gracefully shutting down Waypoint backend...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      await db.close();
      logger.info('Database pool connections closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.error('Fatal bootstrapping failure', { error });
  process.exit(1);
});
