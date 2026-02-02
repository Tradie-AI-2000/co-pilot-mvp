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

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        const sanitizedBody = {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : null,
            completionDate: data.completionDate ? new Date(data.completionDate) : null,
            ssaExpiry: data.ssaExpiry ? new Date(data.ssaExpiry) : null,
            systemReviewDate: data.systemReviewDate ? new Date(data.systemReviewDate) : null,
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

        // Sanitize Payload for Drizzle (Use Schema Property Names/CamelCase)
        const sanitizedData = { ...data };
        delete sanitizedData.createdAt;

        if (sanitizedData.startDate) sanitizedData.startDate = new Date(sanitizedData.startDate);
        if (sanitizedData.completionDate) sanitizedData.completionDate = new Date(sanitizedData.completionDate);
        if (sanitizedData.ssaExpiry) sanitizedData.ssaExpiry = new Date(sanitizedData.ssaExpiry);
        if (sanitizedData.systemReviewDate) sanitizedData.systemReviewDate = new Date(sanitizedData.systemReviewDate);

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