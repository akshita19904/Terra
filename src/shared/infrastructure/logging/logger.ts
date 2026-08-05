import winston from 'winston';
import { env } from '../../../config/environment';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: env.nodeEnv === 'development' ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'waypoint-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack, service }) => {
          return `[${timestamp}] [${level}]: ${message}${stack ? `\nStack: ${stack}` : ''}`;
        })
      ),
    }),
  ],
});
