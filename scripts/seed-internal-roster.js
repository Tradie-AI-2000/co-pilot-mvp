// scripts/seed-internal-roster.js
// Run with: node scripts/seed-internal-roster.js

require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { internalRoster } = require('../lib/db/schema');

// Using DIRECT_URL for the seed script as well
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DIRECT_URL or DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log('🌱 Seeding Internal Roster from .env.local...');

  const leads = [
    { name: 'Blair Stewart', role: 'Build Division Manager', division: 'Build' },
    { name: 'Joe Ward', role: 'Lead of Build Trades', division: 'Build Trades' },
    { name: 'Craig', role: 'Lead of HVAC/Plumbing/Fire', division: 'HVAC' },
    { name: 'Carlos', role: 'Lead of Engineering/Mech/Welding', division: 'Engineering' },
    { name: 'Janaye', role: 'Lead of Electrical', division: 'Electrical' },
    { name: 'Meadow', role: 'Recruitment Co-ordinator', division: 'Recruitment' },
    { name: 'Dylan', role: 'Recruitment Co-ordinator', division: 'Recruitment' },
    { name: 'Courtney', role: 'Recruitment Co-ordinator', division: 'Recruitment' },
  ];

  try {
    // Note: This requires the schema to have been pushed first
    for (const lead of leads) {
      await db.insert(internalRoster).values(lead);
      console.log(`✅ Seeded: ${lead.name} (${lead.role})`);
    }
    console.log('🚀 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed. Ensure you have run "npx drizzle-kit push" first.');
    console.error(error);
  } finally {
    await client.end();
  }
}

seed();