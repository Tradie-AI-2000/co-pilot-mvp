
import { NudgeGenerator, NudgeContext, NudgeResult } from '../types';

export class CandidateRiskGenerator implements NudgeGenerator {
    async generate(context: NudgeContext): Promise<NudgeResult[]> {
        const results: NudgeResult[] = [];
        const { candidates } = context;

        for (const staff of candidates) {
            const staffAny = staff as any;

            // A. START REMINDER (3 Days Out)
            const daysToStart = this.daysUntil(staffAny.startDate || staffAny.nextStartDate);
            if (daysToStart === 3) {
                const projName = staffAny.currentProject || "the site";
                const address = staffAny.siteAddress || "site address";

                results.push({
                    title: `Start Reminder: ${staff.firstName} ${staff.lastName}`,
                    description: `Starts at ${projName} in 3 days. Send confirmation.`,
                    type: 'TASK',
                    priority: 'HIGH',
                    candidateId: staff.id,
                    payload: {
                        communication: {
                            method: "sms",
                            recipient: staff.phone || "No Phone",
                            template: `Hey mate, just a reminder - job at ${projName} starts in 3 days. 7:30am at ${address}. Just making sure you're all good to go? Any issues let me know. Cheers - Joe`
                        }
                    }
                });
            }

            // B. VISA EXPIRY
            const visaDays = this.daysUntil(staffAny.visaExpiry);

            // Check for upcoming expiry (within 45 days) OR already expired properties
            // We'll use a wide window for "already expired" to ensure we catch them (e.g., up to -365 days)
            if (visaDays > -365 && visaDays <= 45) {
                let description = `Visa expires in ${visaDays} days.`;
                let priority: 'HIGH' | 'CRITICAL' = visaDays < 14 ? 'CRITICAL' : 'HIGH';

                if (visaDays <= 0) {
                    const daysAgo = Math.abs(visaDays);
                    description = `Visa EXPIRED ${daysAgo} days ago!`;
                    priority = 'CRITICAL';
                }

                results.push({
                    title: `Visa Expiry: ${staff.firstName} ${staff.lastName}`,
                    description: description,
                    type: 'CHURN_INTERCEPTOR',
                    priority: priority,
                    candidateId: staff.id,
                    payload: { daysLeft: visaDays }
                });
            }

            // C. SITE SAFE EXPIRY
            // Safe Safe logic: expires in 30 days usually requires booking a course.
            const siteSafeDate = staffAny.compliance?.siteSafeExpiry;
            if (siteSafeDate) {
                const ssDays = this.daysUntil(siteSafeDate);

                if (ssDays > -365 && ssDays <= 30) {
                    let description = `Site Safe expires in ${ssDays} days.`;
                    let priority: 'HIGH' | 'CRITICAL' | 'MEDIUM' = 'MEDIUM';

                    if (ssDays <= 0) {
                        const daysAgo = Math.abs(ssDays);
                        description = `Site Safe EXPIRED ${daysAgo} days ago!`;
                        priority = 'CRITICAL';
                    } else if (ssDays <= 7) {
                        priority = 'HIGH';
                    }

                    results.push({
                        title: `Site Safe Expiry: ${staff.firstName} ${staff.lastName}`,
                        description: description,
                        type: 'COMPLIANCE_RISK', // New type or fallback to TASK
                        priority: priority as any,
                        candidateId: staff.id,
                        payload: { daysLeft: ssDays, type: 'site_safe' }
                    });
                }
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
