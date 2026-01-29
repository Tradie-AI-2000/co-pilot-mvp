import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Client (Server-Side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET: Fetch the last 100 logs (Most recent first)
// This runs when the app loads to populate the "Activity Pulse"
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Supabase Fetch Error:', error);
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Add a new log entry
// This runs when you float a candidate, send an SMS, etc.
export async function POST(request) {
    try {
        const body = await request.json();

        // Prepare the data for Supabase
        const { type, title, description, meta_data, timestamp } = body;

        const { data, error } = await supabase
            .from('activity_logs')
            .insert([{
                type,
                title,
                description,
                meta_data, // Stores complex data like clientId, projectId
                created_at: timestamp || new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}