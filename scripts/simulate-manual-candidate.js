/**
 * SIMULATE MANUAL CANDIDATE ADDITION
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

async function addCandidate() {
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
    const sheet = doc.sheetsByTitle['Candidates'];

    const newCandidate = {
        id: `C${Date.now()}`,
        name: "John Smith",
        trade: "Electrician",
        tier: 2,
        status: "Available",
        phone: "021 555 1234",
        email: "john.smith@example.com",
        location: "Auckland Central",
        skills: JSON.stringify(["Residential", "Commercial", "New Build"]),
        certificates: JSON.stringify(["EWRB License", "First Aid"])
    };

    console.log(`➕ Adding candidate: ${newCandidate.name}`);
    await sheet.addRow(newCandidate);
    console.log(`✅ Candidate added successfully.`);
}

addCandidate().catch(e => console.error(e));
