import { db } from '../../../lib/db';
import { activityLogs } from '../../../lib/db/schema';
import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';

// GET: Fetch the last 100 logs (Most recent first)
export async function GET() {
    try {
        const results = await db.select()
            .from(activityLogs)
            .orderBy(desc(activityLogs.createdAt))
            .limit(100);
            
        return NextResponse.json(results);
    } catch (error) {
        console.error('API Error (GET /api/logs):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Add a new log entry
export async function POST(request) {
    try {
        const body = await request.json();

        // Prepare the data for Drizzle
        const { type, title, description, meta_data, timestamp } = body;

        const [result] = await db.insert(activityLogs).values({
            type,
            title,
            description,
            meta_data: meta_data || {},
            createdAt: timestamp ? new Date(timestamp) : new Date()
        }).returning();

        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error (POST /api/logs):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}