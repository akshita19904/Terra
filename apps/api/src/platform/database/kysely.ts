import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export interface DatabaseSchema {
  // DB table typing for spatial raw queries
  driver_profiles: {
    id: string;
    user_id: string;
    last_known_location: any;
    geohash: string | null;
    current_status: string;
  };
  ride_offers: {
    id: string;
    driver_id: string;
    origin_location: any;
    destination_location: any;
    route_polyline: any;
    route_geohashes: string[];
    departure_time: Date;
    available_capacity: number;
    status: string;
  };
}

export function createKyselyDb(connectionString?: string) {
  return new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: connectionString || process.env.DATABASE_URL || 'postgresql://waypoint:waypoint_password@localhost:5432/waypoint_db',
      }),
    }),
  });
}
