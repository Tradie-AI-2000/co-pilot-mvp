import { db } from '../../../lib/db';
import { candidates } from '../../../lib/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const results = await db.select().from(candidates);
        return NextResponse.json(results);
    } catch (error) {
        console.error('API Error (GET /api/candidates):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const toSafeDate = (val) => {
    if (!val || val === "") return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
};

const normalizeStatus = (s) => {
    if (!s) return s;
    // Map UI labels to Case-Sensitive Postgres Enum values
    const map = {
        'Available': 'available',
        'On Job': 'on_job',
        'Placed': 'placed',
        'Unavailable': 'unavailable',
        'Floated': 'Floated' // Capitalized in schema.ts
    };
    return map[s] || s;
};

export async function POST(request) {
    try {
        const body = await request.json();

        // Remove ID to allow DB to generate UUID
        const { id, ...data } = body;

        const sanitizedBody = {
            ...data,
            status: normalizeStatus(data.status),
            visaExpiry: toSafeDate(data.visaExpiry),
            startDate: toSafeDate(data.startDate),
            finishDate: toSafeDate(data.finishDate),
            createdAt: new Date()
        };

        const [result] = await db.insert(candidates).values(sanitizedBody).returning();
        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error (POST /api/candidates):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        // Sanitize Payload for Drizzle
        const sanitizedData = { ...data };

        // Remove tracking fields that shouldn't be patched as strings
        delete sanitizedData.createdAt;

        if (sanitizedData.status) sanitizedData.status = normalizeStatus(sanitizedData.status);
        if (sanitizedData.visaExpiry !== undefined) sanitizedData.visaExpiry = toSafeDate(sanitizedData.visaExpiry);
        if (sanitizedData.startDate !== undefined) sanitizedData.startDate = toSafeDate(sanitizedData.startDate);
        if (sanitizedData.finishDate !== undefined) sanitizedData.finishDate = toSafeDate(sanitizedData.finishDate);

        // Prevent "No values to set" error
        if (Object.keys(sanitizedData).length === 0) {
            return NextResponse.json({ message: "No changes detected" });
        }

        const [result] = await db.update(candidates)
            .set(sanitizedData)
            .where(eq(candidates.id, id))
            .returning();
        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error (PATCH /api/candidates):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}