
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearNudge() {
    const { error } = await supabase
        .from('nudges')
        .delete()
        .ilike('title', '%Start Reminder: Eugene Dann%');

    if (error) console.error("Error clearing nudge:", error);
    else console.log("✅ Cleared old nudge for Eugene Dann");
}

clearNudge();
