import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db/index.js';
import { placementGroups, placements, candidates } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
    try {
        const { projectId, groupName, candidateIds } = await request.json();

        if (!projectId || !groupName || !candidateIds || !Array.isArray(candidateIds)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Atomic Transaction
        const result = await db.transaction(async (tx) => {
            // 1. Create the placement group
            const [group] = await tx.insert(placementGroups).values({
                projectId,
                name: groupName,
                status: 'draft',
            }).returning();

            // 2. Create placements for each candidate
            const placementPromises = candidateIds.map((candidateId) =>
                tx.insert(placements).values({
                    groupId: group.id,
                    candidateId,
                    status: 'draft',
                })
            );

            await Promise.all(placementPromises);

            // 3. Optional: Update candidate status to 'placed' or similar
            // For now, we leave them as is or update if required by FR

            return group;
        });

        return NextResponse.json({ success: true, groupId: result.id });
    } catch (error) {
        console.error('Deployment error:', error);
        return NextResponse.json({ error: 'Failed to deploy squad', details: error.message }, { status: 500 });
    }
}
