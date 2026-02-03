
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMarioVisa() {
    const newExpiry = '2026-02-17';
    console.log(`Updating Mario's Visa to: ${newExpiry}`);

    const { error } = await supabase
        .from('candidates')
        .update({ visa_expiry: newExpiry }) // Snake case for DB
        .ilike('last_name', '%Concepcion%');

    if (error) {
        console.error("Update Failed:", error);
        return;
    }

    console.log("Update sent. Verifying...");

    const { data } = await supabase
        .from('candidates')
        .select('visa_expiry')
        .ilike('last_name', '%Concepcion%')
        .single();

    console.log("Fetched from DB:", data);

    // Clean comparison (DB might return full ISO)
    const dbDate = data.visa_expiry.split('T')[0];
    if (dbDate === newExpiry) {
        console.log("✅ SUCCESS: Data persisted correctly.");
    } else {
        console.log("❌ FAILURE: Data mismatch.");
    }
}

updateMarioVisa();
