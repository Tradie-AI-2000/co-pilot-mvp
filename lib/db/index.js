import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Hard-fix: Prioritize DIRECT_URL for Supabase server-side high-concurrency access
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error('🚨 [DB HANDSHAKE FAILED] No connection string found in environment variables.');
    throw new Error('Database connection string is missing.');
}

// Global singleton to prevent connection exhaustion in Dev (Hot Reloads)
const globalQueryClient = globalThis.postgresClient || postgres(connectionString, { 
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10
});

if (process.env.NODE_ENV !== 'production') {
    globalThis.postgresClient = globalQueryClient;
}

export const db = drizzle(globalQueryClient, { schema });