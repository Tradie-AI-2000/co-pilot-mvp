import { enhancedClients } from './enhanced-mock-data.js';

// --- Wolf of Wall Street: Growth Engine Logic ---

/**
 * Calculates a 'Reactivation Score' (1-100) for dormant clients.
 * Factors: Days inactive, Previous Revenue (YTD), Tier.
 */
export function calculateReactivationScore(client) {
    if (client.status !== 'Dormant' && client.status !== 'At Risk') return 0;

    // Parse revenue (remove $ and ,)
    const revenue = parseInt(client.financials.ytdRevenue.replace(/[^0-9]/g, '')) || 0;

    // Parse last activity
    const lastActive = new Date(client.financials.lastActivity);
    const now = new Date();
    const daysInactive = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

    let score = 0;

    // 1. Revenue Weight (Max 50 points)
    if (revenue > 200000) score += 50;
    else if (revenue > 100000) score += 40;
    else if (revenue > 50000) score += 20;
    else score += 10;

    // 2. Tier Weight (Max 20 points)
    if (client.tier === '1') score += 20;
    if (client.tier === '2') score += 10;

    // 3. Recency Weight (Sweet spot: 90-120 days)
    if (daysInactive >= 90 && daysInactive <= 120) score += 30; // The "Golden Zone" for reactivation
    else if (daysInactive > 120) score += 10; // Getting colder
    else score += 0; // Too soon (handled by Relationship Agent)

    return Math.min(score, 100);
}

/**
 * Generates a "Cold Call Script" based on the target and intent.
 * This is a deterministic template that would be replaced by LLM in prod.
 */
export function generateCallScript(target, intent, agentName = 'Jarvis') {
    const isClient = target.industry !== undefined; // Simple check

    if (intent === 'REACTIVATION') {
        const lastJob = target.projectIds?.[0] || "your last project";
        return `
**Strategy**: The "I was just thinking of you" Approach.
**Tone**: Casual, presumptive.

"Hey ${target.keyContacts?.[0]?.name || 'mate'}, it's ${agentName} from Co-Pilot.

I was just looking at our roster for next week and saw I've got a couple of top-tier Steel Fixers finishing up at SkyCity who worked on ${lastJob} with you.

They know your site induction process already. 

Before I send them to [Competitor], I wanted to see if you needed hands for the new push?"
        `.trim();
    }

    if (intent === 'COLD_APPROACH') {
        return `
**Strategy**: The "Specific Value" Hook.
**Tone**: Professional, direct.

"Hi ${target.contactName},

I see you just picked up the [Project Name] tender - congratulations.

We haven't worked together, but we're currently supplying 80% of the carpentry labor for the site next door. 

I can have a crew fully inducted and on your site by Tuesday. Do you have a roster gap I can fill to prove we're better than your current agency?"
        `.trim();
    }

    return "Script generation failed.";
}

/**
 * Filters and ranks "Golden Hour" targets.
 * Top 10 calls to make between 9AM-10AM.
 */
export function getGoldenHourTargets(clients, leads) {
    const targets = [];

    // 1. Add Dormant Clients (Reactivation)
    clients.forEach(c => {
        const score = calculateReactivationScore(c);
        if (score > 50) {
            targets.push({
                type: 'CLIENT',
                data: c,
                score: score,
                intent: 'REACTIVATION',
                reason: `High Value Dormant (${c.financials.ytdRevenue} YTD)`
            });
        }
    });

    // 2. Add Hot Leads
    leads.forEach(l => {
        if (l.status === 'Warm' || l.status === 'Hot') {
            targets.push({
                type: 'LEAD',
                data: l,
                score: l.estimatedValue.includes('200k') ? 80 : 60, // Simple heuristic
                intent: 'COLD_APPROACH', // Technically warm, but similar script logic
                reason: 'Hot Lead'
            });
        }
    });

    // Sort by Score DESC
    return targets.sort((a, b) => b.score - a.score).slice(0, 10);
}
