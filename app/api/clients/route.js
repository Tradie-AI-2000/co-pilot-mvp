import { db } from '../../../lib/db';
import { clients } from '../../../lib/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const results = await db.select().from(clients);
        return NextResponse.json(results);
    } catch (error) {
        console.error('API Error (GET /api/clients):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("📝 [API] POST /api/clients received:", body);

        // Remove ID to allow DB to generate UUID
        const { id, ...data } = body;

        // Sanitize Dates for Drizzle/Postgres
        // The error "value.toISOString is not a function" often happens when Drizzle expects a Date object but gets a string, or vice versa depending on version.
        // Safest approach: Convert known date strings to Date objects before insertion.
        const sanitizedBody = {
            ...data,
            lastContact: data.lastContact ? new Date(data.lastContact) : new Date(),
            createdAt: new Date(), // Enforce calculated fields if missing
        };

        const [result] = await db.insert(clients).values(sanitizedBody).returning();
        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error (POST /api/clients):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        // Sanitize Payload for Drizzle (handle timestamp fields accurately)
        const sanitizedData = { ...data };

        // Remove fields that should not be updated or cause serialization issues
        delete sanitizedData.createdAt;

        // Whitelist allowed fields to prevent "column does not exist" errors (e.g. projectIds)
        const allowedFields = [
            'name', 'industry', 'status', 'tier', 'region', 'address', 'website', 'phone', 'email', 
            'activeJobs', 'lastContact', 'pipelineStage', 'contractStatus', 'financials', 
            'keyContacts', 'siteLogistics', 'hiringInsights', 'actionAlerts', 'network', 
            'accountManager', 'clientOwner', 'notes', 'tasks'
        ];

        Object.keys(sanitizedData).forEach(key => {
            if (!allowedFields.includes(key)) {
                delete sanitizedData[key];
            }
        });

        if (sanitizedData.lastContact) sanitizedData.lastContact = new Date(sanitizedData.lastContact);

        // Prevent "No values to set" error
        if (Object.keys(sanitizedData).length === 0) {
            return NextResponse.json({ message: "No changes detected" });
        }

        const [result] = await db.update(clients)
            .set(sanitizedData)
            .where(eq(clients.id, id))
            .returning();
        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error (PATCH /api/clients):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
