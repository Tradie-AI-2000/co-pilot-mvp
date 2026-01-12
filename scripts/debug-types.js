/**
 * DEBUG DATA TYPES
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

async function debug() {
    const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
    const email = env.match(/GOOGLE_SERVICE_ACCOUNT_EMAIL=(.*)/)[1];
    let key = env.match(/GOOGLE_PRIVATE_KEY="(.*)"/)[1].replace(/\\n/g, '\n');
    const sheetId = env.match(/GOOGLE_SHEET_ID=(.*)/)[1];

    const auth = new JWT({
        email,
        key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Projects'];
    const rows = await sheet.getRows();

    console.log("--- PROJECTS DATA ---");
    rows.forEach(r => {
        const obj = r.toObject();
        console.log(`Project: ${obj.name} (ID: ${obj.id})`);
        console.log(`  assignedCompanyIds type: ${typeof obj.assignedCompanyIds}`);
        console.log(`  assignedCompanyIds value: "${obj.assignedCompanyIds}"`);
    });
}

debug().catch(e => console.error(e));
