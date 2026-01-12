/**
 * GOOGLE SHEETS SYNC SERVICE
 * 
 * This service will handle fetching and updating data from the Google Sheets "Database".
 * It requires GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.
 */

// import { GoogleSpreadsheet } from 'google-spreadsheet'; // We will use the official SDK

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Server-side only
export const getGoogleSheet = async () => {
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

export const fetchSheetData = async (tabName) => {
    try {
        const doc = await getGoogleSheet();
        const sheet = doc.sheetsByTitle[tabName];

        if (!sheet) {
            console.error(`Sheet with title "${tabName}" not found`);
            return [];
        }

        const rows = await sheet.getRows();
        return rows.map(row => {
            const obj = row.toObject();
            // Post-process: Handle JSON-stringified fields and numbers
            Object.keys(obj).forEach(key => {
                const val = obj[key];
                if (typeof val === 'string') {
                    // Try to parse JSON if it looks like an array or object
                    if ((val.startsWith('[') && val.endsWith(']')) || (val.startsWith('{') && val.endsWith('}'))) {
                        try {
                            const parsed = JSON.parse(val);
                            // If it's an array with null like "[null]", treat as empty array
                            if (Array.isArray(parsed)) {
                                obj[key] = parsed.filter(i => i !== null);
                            } else {
                                obj[key] = parsed;
                            }
                        } catch (e) {
                            // Leave as string if parsing fails
                        }
                    } else if (val === '') {
                        // Return empty string to keep React controlled components happy
                        obj[key] = "";
                    } else if (val !== '' && !isNaN(val)) {
                        // Convert numeric strings to numbers
                        obj[key] = Number(val);
                    }
                }
            });
            return obj;
        });
    } catch (error) {
        console.error(`Error fetching data from sheet "${tabName}":`, error);
        throw error;
    }
};

export const updateSheetRow = async (tabName, id, data) => {
    try {
        const doc = await getGoogleSheet();
        const sheet = doc.sheetsByTitle[tabName];

        if (!sheet) {
            throw new Error(`Sheet with title "${tabName}" not found`);
        }

        // Prepare data: Stringify objects/arrays for flat sheet storage
        const preparedData = {};
        Object.keys(data).forEach(key => {
            const val = data[key];
            if (val !== null && typeof val === 'object') {
                preparedData[key] = JSON.stringify(val);
            } else {
                preparedData[key] = val;
            }
        });

        const rows = await sheet.getRows();
        const row = rows.find(r => r.get('id') === String(id));

        if (row) {
            // Use assign() for modern google-spreadsheet versions
            row.assign(preparedData);
            await row.save();
            return row.toObject();
        } else {
            const newRow = await sheet.addRow(preparedData);
            return newRow.toObject();
        }
    } catch (error) {
        console.error(`Error updating row ${id} in sheet "${tabName}":`, error);
        throw error;
    }
};
