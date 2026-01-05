import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { nudges } from '../../../lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
    try {
        const activeNudges = await db.select()
            .from(nudges)
            .where(eq(nudges.isActioned, false))
            .orderBy(desc(nudges.priority), desc(nudges.createdAt));

        return NextResponse.json(activeNudges);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch nudges' }, { status: 500 });
    }
}
