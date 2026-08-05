import { db } from '../../shared/infrastructure/database';

export interface HealthCheckResult {
  status: 'UP' | 'DOWN';
  timestamp: string;
  uptime: number;
  services: {
    database: {
      status: 'UP' | 'DOWN';
    };
  };
}

export class HealthService {
  public async getHealthStatus(): Promise<HealthCheckResult> {
    const isDbAlive = await db.checkHealth();

    const isSystemHealthy = isDbAlive;

    return {
      status: isSystemHealthy ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: {
          status: isDbAlive ? 'UP' : 'DOWN',
        },
      },
    };
  }
}
