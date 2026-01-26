require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { count } = require('drizzle-orm');
// We need to import the schema file, but it's typescript.
// For this quick script, we will just use raw SQL to verify counts, aiming for simplicity.

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error('🚨 [DB HANDSHAKE FAILED] No connection string found.');
    process.exit(1);
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function runAudit() {
    console.log('🔍 Starting Database Audit...');

    const tables = ['clients', 'candidates', 'projects', 'users', 'leads'];
    const results = {};

    try {
        for (const table of tables) {
            // Using raw SQL for guaranteed execution without TS compilation
            const res = await client`SELECT count(*) FROM ${client(table)}`;
            results[table] = res[0].count;
            console.log(`✅ Table '${table}': ${results[table]} rows`);
        }

        console.log('\n📊 Audit Summary:');
        console.table(results);

    } catch (e) {
        console.error('❌ Audit Failed:', e);
    } finally {
        await client.end();
        process.exit(0);
    }
}

runAudit();
