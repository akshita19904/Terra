import { Pool, QueryResult, QueryResultRow } from 'pg';
import { env } from '../../../config/environment';
import { logger } from '../logging/logger';

export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: env.db.host,
      port: env.db.port,
      database: env.db.name,
      user: env.db.user,
      password: env.db.pass,
      max: env.db.poolMax,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle PostgreSQL client', { error: err });
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<R extends QueryResultRow = any, I extends any[] = any[]>(
    text: string,
    params?: I
  ): Promise<QueryResult<R>> {
    const start = Date.now();
    try {
      const res = await this.pool.query<R, I>(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed DB query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      logger.error('Database query failure', { text, params, error });
      throw error;
    }
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 AS alive');
      return result.rows[0]?.alive === 1;
    } catch (error) {
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export const db = Database.getInstance();
