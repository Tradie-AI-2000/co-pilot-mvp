import { NudgeGenerator, NudgeContext, NudgeResult } from '../types';

export class ProjectRiskGenerator implements NudgeGenerator {
    async generate(context: NudgeContext): Promise<NudgeResult[]> {
        const results: NudgeResult[] = [];
        const { projects, candidates } = context;

        for (const proj of projects) {
            const projAny = proj as any;
            const daysToStart = this.daysUntil(projAny.startDate);

            // A. GHOST TOWN DETECTOR
            // Logic: Starts in < 7 days, but NO candidates assigned
            if (daysToStart >= 0 && daysToStart <= 7) {
                // Count staff assigned to this project (matching by ID or Name)
                const assignedStaff = candidates.filter((c: any) =>
                    c.projectId === proj.id || c.currentProject === proj.name
                );

                if (assignedStaff.length === 0) {
                    results.push({
                        title: `GHOST TOWN: ${proj.name}`,
                        description: `Project starts in ${daysToStart} days with ZERO staff assigned. Action required immediately.`,
                        type: 'URGENT', // New type we map to Red/Critical
                        priority: 'CRITICAL',
                        projectId: proj.id,
                        payload: {
                            // Internal Task - No SMS template needed, but we could add a Client Update one
                            communication: {
                                method: "email", // Internal
                                recipient: "internal",
                                template: `WARNING: ${proj.name} is scheduled to start on ${new Date(projAny.startDate).toLocaleDateString()} but has 0 candidates assigned. Please resource immediately.`
                            }
                        }
                    });
                }
            }

            // B. SSA CHECK
            const ssaStatus = (projAny.ssaStatus || "Pending");
            if (daysToStart >= 0 && daysToStart <= 7 && ssaStatus !== 'Complete') {
                results.push({
                    title: `SSA Missing: ${proj.name}`,
                    description: `Starts in ${daysToStart} days. SSA incomplete.`,
                    type: 'COMPLIANCE',
                    priority: 'CRITICAL',
                    projectId: proj.id,
                    payload: {
                        communication: {
                            method: "sms",
                            recipient: projAny.clientContactPhone,
                            template: `Hey ${projAny.clientContact || 'Client'}, reminder - SSA needed for ${proj.name}. 5min call to sort it? Cheers - Joe`
                        }
                    }
                });
            }
        }

        return results;
    }

    private daysUntil(dateInput: any): number {
        if (!dateInput) return 999;
        const target = new Date(dateInput);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        const diffTime = target.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}
