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
        const value = parts.slice(1).join('=');
        
        if (key && value) {
            let val = value.trim();
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1);
            }
            process.env[key.trim()] = val;
        }
    });
} catch (e) {
    console.error("❌ Failed to load .env.local");
    process.exit(1);
}

// 2. Service Logic
const getGoogleSheet = async () => {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    const auth = new JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    return doc;
};

const runVerify = async () => {
    try {
        console.log("Connecting...");
        const doc = await getGoogleSheet();
        const sheet = doc.sheetsByTitle['Clients'];
        const rows = await sheet.getRows();
        
        const formClient = rows.find(r => r.get('name').includes('Form Construction'));
        
        if (!formClient) {
            console.error("❌ Form Construction not found");
            return;
        }

        console.log("1. Current Location:", formClient.get('Location'));

        console.log("2. Updating Location to 'Waikato'...");
        formClient.assign({ Location: 'Waikato' });
        await formClient.save();

        console.log("3. Re-fetching to verify...");
        const rowsNew = await sheet.getRows();
        const formClientNew = rowsNew.find(r => r.get('name').includes('Form Construction'));
        
        const newLoc = formClientNew.get('Location');
        console.log("4. New Location:", newLoc);

        if (newLoc === 'Waikato') {
            console.log("✅ SUCCESS: Location persisted!");
        } else {
            console.error("❌ FAIL: Location did not persist.");
        }

    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
};

runVerify();
