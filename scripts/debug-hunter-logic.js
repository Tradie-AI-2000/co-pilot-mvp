const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config({ path: '.env.local' });

async function debugHunter() {
    console.log('🔍 Starting Hunter Deck Diagnostic...');

    const auth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
    await doc.loadInfo();

    // 1. INSPECT CANDIDATES (The Bleed)
    console.log('\n--- 1. CANDIDATES (Bleed Check) ---');
    const candSheet = doc.sheetsByTitle['Candidates'];
    await candSheet.loadHeaderRow();
    const cRows = await candSheet.getRows();
    
    // Check Columns (AA, AB, AC, AW)
    // Note: google-spreadsheet uses 0-based index. AA is index 26.
    const headers = candSheet.headerValues;
    console.log(`Column AA Header: "${headers[26]}" (Should be 'Pay Rate')`);
    console.log(`Column AB Header: "${headers[27]}" (Should be 'Charge Rate')`);
    console.log(`Column AW Header: "${headers[48]}" (Should be 'Finish Date')`);

    let bleedFound = 0;
    cRows.forEach((row, i) => {
        const name = row.get('First Name') + ' ' + row.get('Last Name');
        const finishRaw = row.get(headers[48]); // AW
        const pay = row.get(headers[26]); // AA
        const charge = row.get(headers[27]); // AB
        
        if (finishRaw) {
            console.log(`   > ${name}: Finish='${finishRaw}', Pay='${pay}', Charge='${charge}'`);
            
            // Test Date Parsing
            // Handle DD/MM/YYYY manually if needed
            let finishDate;
            if (finishRaw.includes('/')) {
                const [d, m, y] = finishRaw.split('/');
                finishDate = new Date(`${y}-${m}-${d}`);
            } else {
                finishDate = new Date(finishRaw);
            }

            const today = new Date();
            const diff = (finishDate - today) / (1000 * 60 * 60 * 24);
            console.log(`     -> Parsed Date: ${finishDate.toISOString().split('T')[0]} (Diff: ${diff.toFixed(1)} days)`);

            if (diff >= 0 && diff <= 14) {
                console.log(`     🚨 BLEED TRIGGERED!`);
                bleedFound++;
            }
        }
    });

    // 2. INSPECT PROJECTS (Matchmaker)
    console.log('\n--- 2. PROJECTS (Matchmaker Check) ---');
    const projSheet = doc.sheetsByTitle['Projects'];
    await projSheet.loadHeaderRow();
    const pHeaders = projSheet.headerValues;
    const pRows = await projSheet.getRows();

    // Check AF, AG, AH (Index 31, 32, 33)
    console.log(`Column AF Header: "${pHeaders[31]}" (Civil Start)`);
    console.log(`Column AG Header: "${pHeaders[32]}" (Structure Start)`);
    console.log(`Column AH Header: "${pHeaders[33]}" (Fitout Start)`);

    pRows.forEach(row => {
        const name = row.get('Name');
        const civil = row.get(pHeaders[31]);
        const structure = row.get(pHeaders[32]);
        const fitout = row.get(pHeaders[33]);

        if (civil || structure || fitout) {
            console.log(`   > ${name}: Civil='${civil}', Structure='${structure}', Fitout='${fitout}'`);
        }
    });

    console.log('\n✅ Diagnostic Complete.');
}

debugHunter();
