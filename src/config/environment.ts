import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    pass: string;
    poolMax: number;
  };
  redis: {
    host: string;
    port: number;
    pass?: string;
  };
  routing: {
    provider: string;
    osrmBaseUrl: string;
  };
}

export const env: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'waypoint_db',
    user: process.env.DB_USER || 'waypoint_user',
    pass: process.env.DB_PASSWORD || 'waypoint_password',
    poolMax: parseInt(process.env.DB_POOL_MAX || '20', 10),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    pass: process.env.REDIS_PASSWORD || undefined,
  },
  routing: {
    provider: process.env.ROUTING_PROVIDER || 'mock',
    osrmBaseUrl: process.env.OSRM_BASE_URL || 'http://router.project-osrm.org',
  },
};
