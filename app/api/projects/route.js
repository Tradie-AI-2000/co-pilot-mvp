import { db } from '../../../lib/db';
import { projects } from '../../../lib/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const results = await db.select().from(projects);
        return NextResponse.json(results);
    } catch (error) {
        console.error('API Error (GET /api/projects):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper to map Frontend CamelCase -> DB SnakeCase
const mapPayloadToSchema = (data) => {
    const payload = { ...data };

    // Explicitly map complex fields if they exist
    if (payload.clientDemands) {
        payload.client_demands = payload.clientDemands;
        delete payload.clientDemands;
    }
    if (payload.phaseSettings) {
        payload.phase_settings = payload.phaseSettings;
        delete payload.phaseSettings;
    }
    if (payload.labourPrediction) {
        payload.labour_prediction = payload.labourPrediction;
        delete payload.labourPrediction;
    }
    // Add other mappings here as needed

    return payload;
};

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        // 1. Map Keys Correctly
        const dbPayload = mapPayloadToSchema(data);

        const sanitizedBody = {
            ...dbPayload,
            startDate: dbPayload.startDate ? new Date(dbPayload.startDate) : null,
            completionDate: dbPayload.completionDate ? new Date(dbPayload.completionDate) : null,
            createdAt: new Date()
        };

        const [result] = await db.insert(projects).values(sanitizedBody).returning();
        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error (POST /api/projects):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        // 1. Map Keys Correctly
        const dbPayload = mapPayloadToSchema(data);

        // Sanitize Payload for Drizzle
        const sanitizedData = { ...dbPayload };
        delete sanitizedData.createdAt;

        if (sanitizedData.startDate) sanitizedData.startDate = new Date(sanitizedData.startDate);
        if (sanitizedData.completionDate) sanitizedData.completionDate = new Date(sanitizedData.completionDate);

        if (Object.keys(sanitizedData).length === 0) {
            return NextResponse.json({ message: "No changes detected" });
        }

        const [result] = await db.update(projects)
            .set(sanitizedData)
            .where(eq(projects.id, id))
            .returning();
        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error (PATCH /api/projects):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}