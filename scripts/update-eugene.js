
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local manually
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key for scripts to bypass RLS and avoid auth issues
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase Env Vars:", { supabaseUrl, hasKey: !!supabaseKey });
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateEugene() {
    console.log("Updating Eugene Dann...");

    // 1. Find a valid Project to assign (Union Square)
    const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('id, name, address')
        .ilike('name', '%Union%')
        .limit(1);

    if (projError || !projects || projects.length === 0) {
        console.error("Could not find Union Square project!", projError);
        return;
    }

    const project = projects[0];
    console.log(`Assigning to Project: ${project.name} (${project.id})`);

    // 2. Update Eugene
    const { error } = await supabase
        .from('candidates')
        .update({
            current_project: project.name,
            project_id: project.id,
            site_address: project.address,
            current_employer: 'Stellar Recruitment' // Assuming direct
        })
        .eq('last_name', 'Dann')
        .eq('first_name', 'Eugene');

    if (error) {
        console.error("Update Failed:", error);
    } else {
        console.log("✅ Eugene Dann updated successfully!");
    }
}

updateEugene();
