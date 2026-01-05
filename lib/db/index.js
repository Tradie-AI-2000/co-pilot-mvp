import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL || 'postgres://user:pass@localhost:5432/co-pilot';

if (!process.env.POSTGRES_URL) {
    console.warn('⚠️ POSTGRES_URL environment variable is not set. Using dummy connection for build compatibility.');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
