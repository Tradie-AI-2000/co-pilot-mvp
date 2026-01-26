// scripts/sync-and-pad.js
// Run with: node scripts/sync-and-pad.js

require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { internalRoster, candidates, projects, clients, stakeholders } = require('../lib/db/schema');
const { fetchSheetData } = require('../services/google-sheets');
const { eq } = require('drizzle-orm');

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DIRECT_URL or DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function run() {
  console.log('🚀 Initiating the Great Ingestion & Contextual Padding...');

  try {
    // 1. Get Internal Roster IDs
    const roster = await db.select().from(internalRoster);
    const leads = {
      blair: roster.find(r => r.name === 'Blair Stewart'),
      joe: roster.find(r => r.name === 'Joe Ward'),
      craig: roster.find(r => r.name === 'Craig'),
      carlos: roster.find(r => r.name === 'Carlos'),
      janaye: roster.find(r => r.name === 'Janaye'),
      rcs: roster.filter(r => r.division === 'Recruitment')
    };

    if (!leads.blair) {
      console.error('❌ Error: Internal roster not found. Run seed script first.');
      return;
    }

    // 2. Real Ingestion from Google Sheets
    console.log('📊 Fetching Real Data from Google Sheets...');
    const sheetClients = await fetchSheetData('Clients');
    const sheetProjects = await fetchSheetData('Projects');
    const sheetCandidates = await fetchSheetData('Candidates');

    console.log(`✅ Fetched: ${sheetClients.length} Clients, ${sheetProjects.length} Projects, ${sheetCandidates.length} Candidates`);

    // Mapping logic for sheet data would go here (omitted for brevity in this brief)
    // For now, we focus on the requested Padding and Package Mapping.

    // 3. Package Mapping & Stakeholder Linking
    console.log('🔗 Applying Package Mapping to Projects...');
    for (const projData of sheetProjects) {
        // Find existing project in DB or insert
        const [proj] = await db.insert(projects).values({
            name: projData.name || projData.Name,
            status: projData.status || projData.Status || 'Planning',
            location: projData.location || projData.Region || 'Auckland',
            packages: projData.packages || {}
        }).returning();

        // Check Packages for Tendering Status
        const pkgs = proj.packages || {};
        if (pkgs.Mechanical?.status === 'Tendering') {
            await db.insert(stakeholders).values({ projectId: proj.id, name: leads.craig.name, role: 'HVAC Lead', isInternal: true, internalUserId: leads.craig.id });
            console.log(`📌 Linked Craig (HVAC) to ${proj.name} (Mechanical Tendering)`);
        }
        if (pkgs.Electrical?.status === 'Tendering') {
            await db.insert(stakeholders).values({ projectId: proj.id, name: leads.janaye.name, role: 'Electrical Lead', isInternal: true, internalUserId: leads.janaye.id });
            console.log(`📌 Linked Janaye (Electrical) to ${proj.name} (Electrical Tendering)`);
        }
        if (pkgs.Engineering?.status === 'Tendering') {
            await db.insert(stakeholders).values({ projectId: proj.id, name: leads.carlos.name, role: 'Engineering Lead', isInternal: true, internalUserId: leads.carlos.id });
            console.log(`📌 Linked Carlos (Engineering) to ${proj.name} (Engineering Tendering)`);
        }
    }

    // 4. Synthetic Padding (5 Mock Candidates per Trade)
    console.log('🧪 Generating Synthetic Padding for Missing Trades...');

    const trades = [
        { name: 'HVAC Technician', div: 'HVAC', pay: 38, lead: leads.craig },
        { name: 'Electrician (NZ Reg)', div: 'Electrical', pay: 45, lead: leads.janaye },
        { name: 'Fabricator/Welder', div: 'Engineering', pay: 40, lead: leads.carlos }
    ];

    const nzNames = [
        'Hemi Walker', 'Wiremu Smith', 'Tane Miller', 'Manaia Brown', 'Rawiri Jones',
        'Sarah Jenkins', 'Emma Wilson', 'Chloe Davis', 'Grace Taylor', 'Sophie Anderson',
        'Kaleb Ngata', 'Nikau Rewi', 'Tamati Kingi', 'Ariki Pouri', 'Rangi Turoa'
    ];

    for (let i = 0; i < trades.length; i++) {
        const trade = trades[i];
        console.log(`🔨 Padding ${trade.div}...`);

        for (let j = 0; j < 5; j++) {
            const nameIdx = (i * 5) + j;
            const rc = leads.rcs[j % leads.rcs.length];

            await db.insert(candidates).values({
                firstName: nzNames[nameIdx].split(' ')[0],
                lastName: nzNames[nameIdx].split(' ')[1],
                email: `${nzNames[nameIdx].replace(' ', '.').toLowerCase()}@stellar.co.nz`,
                status: 'on_job',
                role: trade.name,
                trade: trade.div,
                payRate: trade.pay,
                chargeRate: trade.pay + 15,
                mobile: `021-${Math.floor(1000000 + Math.random() * 9000000)}`,
                internalRating: 5.0,
                notes: `Synthetic record. Welfare managed by ${rc.name}.`
            });
            
            // Note: In a full relational model, we'd link to the RC in a 'welfare' table
            // For now, it's stored in the notes/metadata for the Candidate Manager to see.
        }
    }

    console.log('🏁 The Great Ingestion is Complete!');

  } catch (error) {
    console.error('❌ Ingestion failed:', error);
  } finally {
    await client.end();
  }
}

run();