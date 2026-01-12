const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config({ path: '.env.local' }); // Load local env if running locally

// Hardcoded Test Data (Matches the "Intelligence Injection")
const HUNTER_DATA = {
    clients: [
        {
            id: '99',
            name: 'Alpha Auckland',
            tier: '1',
            lastContact: '2025-12-23', // 20 days ago
            status: 'Active',
            region: 'Auckland',
            industry: 'Construction'
        }
    ],
    candidates: [
        {
            id: '10',
            name: 'Luis Garcia',
            finishDate: '2026-01-15', // 3 days from now
            status: 'On Job',
            chargeRate: 58.00,
            payRate: 34.00,
            guaranteedHours: 40
        }
    ],
    projects: [
        {
            id: 'P099',
            name: 'Westfield Albany - Fit Out',
            phase: 'Fitout',
            startDate: '2026-01-22', // 10 days from now
            client: 'Alpha Auckland'
        }
    ]
};

async function calibrateSheet() {
    console.log('📡 Starting Hunter Deck Calibration...');

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
        console.error('❌ Missing Google Sheets Credentials in environment.');
        process.exit(1);
    }

    const auth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
    
    try {
        await doc.loadInfo();
        console.log(`✅ Connected to Sheet: ${doc.title}`);

        // --- 1. Clients Calibration ---
        const clientSheet = doc.sheetsByTitle['Clients'];
        if (clientSheet) {
            await clientSheet.loadHeaderRow();
            const headers = clientSheet.headerValues;
            
            // Check & Add Missing Columns
            const requiredHeaders = ['Tier', 'Last Contact', 'Account Manager', 'Region'];
            const newHeaders = [...headers];
            let needsUpdate = false;
            
            requiredHeaders.forEach(h => {
                if (!headers.includes(h)) {
                    newHeaders.push(h);
                    needsUpdate = true;
                    console.log(`   + Adding Missing Column: [${h}]`);
                }
            });

            if (needsUpdate) {
                await clientSheet.resize({ columnCount: newHeaders.length });
                await clientSheet.setHeaderRow(newHeaders);
            }

            // Inject "Alpha Auckland"
            const rows = await clientSheet.getRows();
            const alpha = rows.find(r => r.get('Name') === 'Alpha Auckland' || r.get('id') === '99');
            
            if (alpha) {
                alpha.assign({
                    'Tier': '1',
                    'Last Contact': '2025-12-23',
                    'Status': 'Active'
                });
                await alpha.save();
                console.log('   ✓ Updated Alpha Auckland (Tier 1 Risk)');
            } else {
                await clientSheet.addRow({
                    id: '99',
                    Name: 'Alpha Auckland',
                    Tier: '1',
                    'Last Contact': '2025-12-23',
                    Status: 'Active',
                    Region: 'Auckland',
                    Industry: 'Construction'
                });
                console.log('   ✓ Injected Alpha Auckland (Tier 1 Risk)');
            }
        }

        // --- 2. Candidates Calibration ---
        const candSheet = doc.sheetsByTitle['Candidates'];
        if (candSheet) {
            await candSheet.loadHeaderRow();
            const headers = candSheet.headerValues;
            const requiredHeaders = ['Finish Date', 'Charge Rate', 'Pay Rate', 'Guaranteed Hours'];
            const newHeaders = [...headers];
            let needsUpdate = false;

            requiredHeaders.forEach(h => {
                if (!headers.includes(h)) {
                    newHeaders.push(h);
                    needsUpdate = true;
                    console.log(`   + Adding Missing Column: [${h}]`);
                }
            });

            if (needsUpdate) {
                await candSheet.resize({ columnCount: newHeaders.length });
                await candSheet.setHeaderRow(newHeaders);
            }

            // Inject "Luis Garcia" Update
            const rows = await candSheet.getRows();
            // Try match by ID (10) or Name
            const luis = rows.find(r => r.get('id') === '10' || (r.get('First Name') === 'Luis' && r.get('Last Name') === 'Garcia'));

            if (luis) {
                luis.assign({
                    'Finish Date': '2026-01-15',
                    'Status': 'On Job',
                    'Charge Rate': 58.00,
                    'Pay Rate': 34.00,
                    'Guaranteed Hours': 40
                });
                await luis.save();
                console.log('   ✓ Updated Luis Garcia (The Bleed Test)');
            } else {
                console.warn('   ⚠️ Luis Garcia not found in sheet to update. Skipping injection.');
            }
        }

        // --- 3. Projects Calibration ---
        const projSheet = doc.sheetsByTitle['Projects'];
        if (projSheet) {
            await projSheet.loadHeaderRow();
            // Ensure Phase Columns exist
            const phases = ["Civil", "Structure", "Fitout"]; // Short labels
            const headers = projSheet.headerValues;
            const newHeaders = [...headers];
            let needsUpdate = false;

            phases.forEach(p => {
                const h = `${p} Start`;
                if (!headers.includes(h)) {
                    newHeaders.push(h);
                    needsUpdate = true;
                    console.log(`   + Adding Missing Column: [${h}]`);
                }
            });

            if (needsUpdate) {
                await projSheet.resize({ columnCount: newHeaders.length });
                await projSheet.setHeaderRow(newHeaders);
            }

            // Inject "Westfield Albany"
            const rows = await projSheet.getRows();
            const westfield = rows.find(r => r.get('Name') === 'Westfield Albany - Fit Out' || r.get('id') === 'P099');

            if (westfield) {
                westfield.assign({
                    'Fitout Start': '2026-01-22',
                    'Status': 'Construction',
                    'Client': 'Alpha Auckland'
                });
                await westfield.save();
                console.log('   ✓ Updated Westfield Albany (Matchmaker Test)');
            } else {
                await projSheet.addRow({
                    id: 'P099',
                    Name: 'Westfield Albany - Fit Out',
                    'Fitout Start': '2026-01-22',
                    Status: 'Construction',
                    Client: 'Alpha Auckland',
                    Value: '$15M'
                });
                console.log('   ✓ Injected Westfield Albany (Matchmaker Test)');
            }
        }

        console.log('🛡️  Hunter Deck Calibration Complete. Data Aligned.');

    } catch (error) {
        console.error('❌ Sync Failed:', error);
    }
}

calibrateSheet();
