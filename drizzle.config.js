import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

// Use absolute path to ensure .env.local is found regardless of execution context
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DIRECT_URL) {
  console.warn('🚨 [Drizzle Config] DIRECT_URL is missing in .env.local. Falling back to DATABASE_URL.');
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
});