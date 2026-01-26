// lib/intel-engine.js
import { db } from './db';
import { projects, internalRoster, stakeholders } from './db/schema';
import { eq, sql } from 'drizzle-orm';

export async function generateScoutIntel() {
    console.log('📡 Tender Scout: Scanning for Tendering packages...');

    const allProjects = await db.select().from(projects);
    const roster = await db.select().from(internalRoster);

    const intelProducts = [];

    for (const project of allProjects) {
        const pkgs = project.packages || {};
        
        // Scan for Tendering packages
        for (const [trade, data] of Object.entries(pkgs)) {
            if (data.status === 'Tendering') {
                const lead = roster.find(r => r.division?.toLowerCase() === trade.toLowerCase());
                
                if (lead) {
                    const sar = {
                        target: lead.name,
                        division: trade,
                        project: project.name,
                        location: project.location,
                        situation: `Tendering phase identified for ${trade} package on ${project.name} in ${project.location}.`,
                        analysis: `This is a high-value opportunity. INCUMBENT: ${project.incumbentAgency || 'Unknown'}. Our ${trade} specialist squad is currently 80% utilized but has capacity for a strategic start.`,
                        recommendation: `${lead.name}: Reach out to the PM/Site Manager immediately to secure the sub-package award. Drafted 'Sniper Pitch' is ready in your War Room.`
                    };
                    intelProducts.push(sar);
                }
            }
        }
    }

    return intelProducts;
}
