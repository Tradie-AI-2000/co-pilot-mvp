import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { nudges, placements, candidates, projects, clients, users } from '../../../../lib/db/schema';
import { eq, and, lte, isNull, sql } from 'drizzle-orm';
import { MockWeatherProvider } from '../../../../services/nudge-logic/weather';
// import { jobAdderService } from '../../../../services/job-adder'; // Commented out until configured

export async function GET(request: Request) {
    try {
        console.log('Running Daily Nudge Sweep...');
        const createdNudges = [];

        // 1. Churn Interceptor (End Dates)
        // Logic: Find active placements finishing in 3 days
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        
        // Note: In a real app, we'd query for candidates with finishDate = 3 days from now
        // For MVP, we'll scan all 'active' placements and check the candidate's finishDate
        // This is inefficient but functional for MVP
        const expiringPlacements = await db.select({
            placement: placements,
            candidate: candidates
        })
        .from(placements)
        .innerJoin(candidates, eq(placements.candidateId, candidates.id))
        .where(eq(placements.status, 'active'));

        for (const record of expiringPlacements) {
            const finishDate = record.candidate.finishDate;
            if (finishDate) {
                const diffTime = new Date(finishDate).getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays <= 3 && diffDays > 0) {
                     // Check for nearby projects (PostGIS)
                     // const nearbyProjects = await db.execute(sql`
                     //   SELECT id FROM projects 
                     //   WHERE ST_DWithin(
                     //     ST_MakePoint(${record.candidate.lng}, ${record.candidate.lat})::geography,
                     //     ST_MakePoint(lng, lat)::geography,
                     //     5000
                     //   )
                     // `);
                     // For MVP, skip spatial check and just nudge
                    
                    await db.insert(nudges).values({
                        type: 'CHURN_INTERCEPTOR',
                        priority: 'CRITICAL',
                        title: `Retention Risk: ${record.candidate.firstName} finishes in ${diffDays} days`,
                        description: `Don't let them go to a competitor. Redeploy now.`,
                        actionPayload: { action: 'REDEPLOY', placementId: record.placement.id },
                        relatedCandidateId: record.candidate.id,
                        // consultantId: ... (needs user mapping)
                    });
                    createdNudges.push('CHURN_INTERCEPTOR');
                }
            }
        }

        // 2. Rainmaker (Weather)
        const weather = new MockWeatherProvider();
        // Mock Auckland Lat/Lng
        const forecast = await weather.getForecast(-36.8485, 174.7633, new Date());
        
        if (forecast.condition === 'RAIN' && forecast.rainMm > 10) {
            // Find outdoor placements
            // For MVP, assume all placements are outdoor
             await db.insert(nudges).values({
                type: 'RAINMAKER',
                priority: 'HIGH',
                title: `Rain Blitz: Heavy Rain Tomorrow (${forecast.rainMm}mm)`,
                description: `Outdoor sites will close. Move crew to indoor projects.`,
                actionPayload: { action: 'RAIN_BLITZ' },
            });
            createdNudges.push('RAINMAKER');
        }

        // 3. Client Stalker (CRM)
        // Skipped for MVP to avoid API limits without real keys

        return NextResponse.json({ success: true, nudgesGenerated: createdNudges.length });

    } catch (error) {
        console.error('Cron Nudge Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
