const fs = require('fs');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// 1. Load Environment Variables from .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const parts = line.split('=');
        const key = parts[0];
        // Handle values that might contain '='
        const value = parts.slice(1).join('=');
        
        if (key && value) {
            let val = value.trim();
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1);
            }
            process.env[key.trim()] = val;
        }
    });
    console.log("✅ Loaded .env.local");
} catch (e) {
    console.error("❌ Failed to load .env.local:", e.message);
    process.exit(1);
}

// 2. Service Logic (Copied/Adapted from services/google-sheets.js to avoid import issues with ES modules in plain node script)
const getGoogleSheet = async () => {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !sheetId) {
        throw new Error('Missing Google Sheets configuration in environment variables');
    }

    const auth = new JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    return doc;
};

const runTest = async () => {
    try {
        console.log("Connecting to Google Sheets...");
        const doc = await getGoogleSheet();
        console.log(`✅ Connected to Sheet: ${doc.title}`);

        const sheet = doc.sheetsByTitle['Clients'];
        if (!sheet) {
            console.error("❌ 'Clients' tab not found!");
            return;
        }
        console.log("✅ Found 'Clients' tab");

        const rows = await sheet.getRows();
        console.log(`ℹ️  Found ${rows.length} rows.`);

        // Analyze Columns from Header Row
        console.log("\n--- COLUMN HEADERS ---");
        console.log(sheet.headerValues.join(' | '));

        // Find Form Construction
        const targetName = "Form Construction";
        const formClient = rows.find(r => {
            const name = r.get('name') || r.get('Name') || r.get('Client') || r.get('Company');
            return name && name.toLowerCase().includes('form');
        });

        if (formClient) {
            console.log(`\n✅ Found '${targetName}' (Row ${formClient.rowNumber})`);
            console.log("--- RAW DATA ---");
            const rawObj = formClient.toObject();
            console.log(JSON.stringify(rawObj, null, 2));
            
            // Check for new columns
            console.log("\n--- COLUMN CHECK ---");
            const checkCol = (col) => {
                const val = formClient.get(col);
                console.log(`${col}: ${val !== undefined ? `✅ Present ("${val}")` : '❌ Missing/Undefined'}`);
            };
            
            checkCol('Address');
            checkCol('Phone');
            checkCol('Email');
            checkCol('Website');
            checkCol('Location');
            checkCol('Tier');
            checkCol('ProjectIds');
            
        } else {
            console.warn(`\n⚠️  Could not find '${targetName}' in the sheet.`);
            console.log("Dumping first 3 rows names to help identify:");
            rows.slice(0, 3).forEach(r => console.log("- " + (r.get('name') || r.get('Name'))));
        }

    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
};

runTest();
