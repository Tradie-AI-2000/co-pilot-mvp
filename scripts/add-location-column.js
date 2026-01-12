
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
        const value = parts.slice(1).join('='); // Handle values with =
        
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

// 2. Service Logic
const getGoogleSheet = async () => {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !sheetId) {
        throw new Error('Missing Google Sheets configuration');
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

const runFix = async () => {
    try {
        console.log("Connecting to Google Sheets...");
        const doc = await getGoogleSheet();
        console.log(`✅ Connected to: ${doc.title}`);

        const sheet = doc.sheetsByTitle['Clients'];
        if (!sheet) {
            console.error("❌ 'Clients' tab not found!");
            return;
        }

        await sheet.loadHeaderRow();
        const headers = sheet.headerValues;
        console.log("Current Headers:", headers.join(" | "));

        if (headers.includes('Location')) {
            console.log("✅ 'Location' column already exists. No action needed.");
        } else {
            console.log("⚠️ 'Location' column missing. Adding it now...");
            
            // Append 'Location' to the headers
            const newHeaders = [...headers, 'Location'];
            await sheet.setHeaderRow(newHeaders);
            
            console.log("✅ Successfully added 'Location' column.");
            console.log("New Headers:", newHeaders.join(" | "));
        }

    } catch (error) {
        console.error("❌ Fix Failed:", error);
    }
};

runFix();
