import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { nudges, projects, candidates } from '../../../../lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { ProjectSignal } from '../../../../services/nudge-logic/types';

export async function POST(request: Request) {
    try {
        const payload: ProjectSignal = await request.json();

        // 1. Validation
        if (!payload.externalId || !payload.title || !payload.lat || !payload.lng) {
            return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
        }

        console.log(`Received BCI Signal: ${payload.title} (${payload.stage})`);

        // 2. Insert/Update Project
        // In real app, upsert based on externalId (add externalId to schema first)
        // For MVP, we'll just insert a new project or find by name
        
        let projectId;
        const existing = await db.select().from(projects).where(eq(projects.name, payload.title)).limit(1);
        
        if (existing.length > 0) {
            projectId = existing[0].id;
            // Update stage if needed
        } else {
            const [newProject] = await db.insert(projects).values({
                name: payload.title,
                value: payload.value?.toString(),
                stage: 'Construction', // Mapping payload.stage
                status: 'Active',
                lat: payload.lat,
                lng: payload.lng,
                // clientId: ... (needs client resolution)
            }).returning();
            projectId = newProject.id;
        }

        // 3. Pre-emptive Strike Logic (New Project)
        if (payload.stage === 'CONSTRUCTION' || payload.stage === 'FIT_OUT') {
            // Check if we have placements
            // const activePlacements = ... count placements for this project

            // Check Supply (Candidates within 5km)
            // const nearbySupply = await db.execute(sql`...`);
            
            // Simulating Logic: Always trigger for MVP
            await db.insert(nudges).values({
                type: 'PRE_EMPTIVE_STRIKE',
                priority: 'CRITICAL',
                title: `HOT LEAD: ${payload.title} started Construction`,
                description: `You have 0 people on site. 5 Candidates found nearby.`,
                actionPayload: { action: 'PITCH_CREW', projectId: projectId },
                relatedProjectId: projectId,
            });
        }

        return NextResponse.json({ success: true, projectId });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
