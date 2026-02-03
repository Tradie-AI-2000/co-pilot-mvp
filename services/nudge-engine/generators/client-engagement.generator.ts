import { NudgeGenerator, NudgeContext, NudgeResult } from '../types';

export class ClientEngagementGenerator implements NudgeGenerator {
    async generate(context: NudgeContext): Promise<NudgeResult[]> {
        const results: NudgeResult[] = [];
        const { clients } = context;

        for (const client of clients) {
            const clientAny = client as any;

            // Logic: Last Contact was > 45 days ago
            const daysQuiet = this.daysSince(clientAny.lastContact);

            if (daysQuiet > 45) {
                results.push({
                    title: `Cold Client: ${client.name}`,
                    description: `No contact for ${daysQuiet} days. Re-engage now.`,
                    type: 'PRE_EMPTIVE_STRIKE', // Purple Card
                    priority: 'HIGH',
                    clientId: client.id,
                    payload: {
                        communication: {
                            method: "sms",
                            recipient: clientAny.phone || "",
                            template: `Hey ${clientAny.contactName || 'there'}, it's been a while! Just reviewing our upcoming availability for next month and thought I'd check if you have any projects kicking off soon? Cheers - Joe`
                        }
                    }
                });
            }
        }

        return results;
    }

    private daysSince(dateInput: any): number {
        if (!dateInput) return 0;
        const target = new Date(dateInput);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - target.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
}
