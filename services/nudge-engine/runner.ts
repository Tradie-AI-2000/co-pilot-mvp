import { db } from '../../lib/db';
// @ts-ignore
import { nudges, candidates, projects, clients } from '../../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { NudgeContext, NudgeGenerator, NudgeResult } from './types';
import { CandidateRiskGenerator } from './generators/candidate-risk.generator';
import { ProjectRiskGenerator } from './generators/project-risk.generator';
import { ClientEngagementGenerator } from './generators/client-engagement.generator';

export class NudgeEngineRunner {
    private generators: NudgeGenerator[];

    constructor() {
        this.generators = [
            new CandidateRiskGenerator(),
            new ProjectRiskGenerator(),
            new ClientEngagementGenerator()
        ];
    }

    async execute(dryRun = false) {
        console.log("🚀 STARTING NUDGE ENGINE...");
        const logs: string[] = [];
        let newNudges = 0;

        try {
            // 1. Fetch Context
            const [allCandidates, allProjects, allClients] = await Promise.all([
                db.select().from(candidates),
                db.select().from(projects),
                db.select().from(clients)
            ]);

            const context: NudgeContext = {
                candidates: allCandidates,
                projects: allProjects,
                clients: allClients
            };

            // 2. Run Generators
            const results: NudgeResult[] = [];
            for (const generator of this.generators) {
                const genResults = await generator.generate(context);
                results.push(...genResults);
            }

            // 3. Persist Logic (Deduplicated)
            for (const nudge of results) {
                if (dryRun) {
                    logs.push(`[DRY RUN] Would create: ${nudge.title}`);
                    continue;
                }

                const created = await this.createNudgeIfNew(nudge);
                if (created) {
                    newNudges++;
                    logs.push(`🔔 Created: ${nudge.title}`);
                }
            }

            return { success: true, newNudges, logs };

        } catch (error: any) {
            console.error("Nudge Engine Error:", error);
            return { success: false, error: error.message };
        }
    }

    private async createNudgeIfNew(data: NudgeResult): Promise<boolean> {
        const existing = await db.select().from(nudges)
            .where(and(
                eq(nudges.title, data.title),
                eq(nudges.isActioned, false)
            ));

        if (existing.length > 0) {
            // UPDATE EXISTING NUDGE
            // If the description or priority has changed, update it.
            const current = existing[0];
            if (current.description !== data.description || current.priority !== data.priority) {
                // @ts-ignore
                await db.update(nudges)
                    .set({
                        description: data.description,
                        priority: data.priority,
                        actionPayload: data.payload || {},
                        updatedAt: new Date() // Ensure your schema has this or just rely on the change
                    })
                    .where(eq(nudges.id, current.id));
                return true; // Return true to indicate an update happened (for logging)
            }
            return false;
        }

        const insertValues: any = {
            title: data.title,
            description: data.description,
            type: data.type === 'URGENT' ? 'TASK' : data.type, // Fallback mapping from original code
            priority: data.priority,
            isActioned: false,
            createdAt: new Date(),
            actionPayload: data.payload || {},
            relatedCandidateId: data.candidateId || null,
            relatedProjectId: data.projectId || null,
            relatedClientId: data.clientId || null,
            consultantId: null
        };

        // @ts-ignore
        await db.insert(nudges).values(insertValues);
        return true;
    }
}
