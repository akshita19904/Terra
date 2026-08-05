import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.warn('⚠️ Redis Connection Warning:', err.message);
});

export class RedisCacheService {
  // Session Caching (7 Days TTL)
  static async setSession(userId: string, sessionData: any, ttlSeconds: number = 7 * 24 * 3600) {
    try {
      await redis.setex(`session:${userId}`, ttlSeconds, JSON.stringify(sessionData));
    } catch (e) {
      // Fallback silently if Redis is disconnected
    }
  }

  static async getSession(userId: string) {
    try {
      const data = await redis.get(`session:${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // Live Driver Location Telemetry (GEOADD)
  static async updateDriverGeoLocation(driverId: string, lat: number, lng: number) {
    try {
      await redis.geoadd('driver:geo:locations', lng, lat, driverId);
      await redis.hset(`driver:telemetry:${driverId}`, {
        lat,
        lng,
        updatedAt: Date.now(),
      });
      await redis.expire(`driver:telemetry:${driverId}`, 60); // 60s TTL fallback
    } catch (e) {
      // Silently handle
    }
  }

  // Idempotency Locking (120s TTL)
  static async checkAndSetIdempotency(key: string, ttlSeconds: number = 120): Promise<boolean> {
    try {
      const result = await redis.set(`idempotency:${key}`, '1', 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch (e) {
      return true; // Allow request if Redis is down
    }
  }
}
