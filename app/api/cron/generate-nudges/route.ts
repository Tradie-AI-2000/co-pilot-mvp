import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
// @ts-ignore
import { nudges, candidates, projects, clients } from '../../../../lib/db/schema';
import { eq, and } from 'drizzle-orm';

// --- HELPERS ---
const daysUntil = (dateInput: any): number => {
    if (!dateInput) return 999;
    const target = new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const daysSince = (dateInput: any): number => {
    if (!dateInput) return 0;
    const target = new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - target.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export async function GET() {
    try {
        console.log("🔄 STARTING TRIPLE THREAT SCAN...");
        const logs: string[] = [];
        let newNudges = 0;

        // Fetch All Data Entities
        const allCandidates = await db.select().from(candidates);
        const allProjects = await db.select().from(projects);
        const allClients = await db.select().from(clients);

        // ==========================================
        // 1. CANDIDATE CHECKS (Existing)
        // ==========================================
        for (const staff of allCandidates) {
            const staffAny = staff as any;

            // A. START REMINDER (3 Days Out)
            const daysToStart = daysUntil(staffAny.startDate || staffAny.nextStartDate);
            if (daysToStart === 3) {
                const projName = staffAny.currentProject || "the site";
                const address = staffAny.siteAddress || "site address";

                await createNudgeIfNew({
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
            const visaDays = daysUntil(staffAny.visaExpiry);
            if (visaDays > 0 && visaDays <= 45) {
                await createNudgeIfNew({
                    title: `Visa Expiry: ${staff.firstName} ${staff.lastName}`,
                    description: `Visa expires in ${visaDays} days.`,
                    type: 'CHURN_INTERCEPTOR',
                    priority: visaDays < 14 ? 'CRITICAL' : 'HIGH',
                    candidateId: staff.id,
                    payload: { daysLeft: visaDays }
                });
            }
        }

        // ==========================================
        // 2. PROJECT CHECKS (Option A: Ghost Town)
        // ==========================================
        for (const proj of allProjects) {
            const projAny = proj as any;
            const daysToStart = daysUntil(projAny.startDate);

            // A. GHOST TOWN DETECTOR
            // Logic: Starts in < 7 days, but NO candidates assigned
            if (daysToStart >= 0 && daysToStart <= 7) {
                // Count staff assigned to this project (matching by ID or Name)
                const assignedStaff = allCandidates.filter((c: any) =>
                    c.projectId === proj.id || c.currentProject === proj.name
                );

                if (assignedStaff.length === 0) {
                    await createNudgeIfNew({
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
                await createNudgeIfNew({
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

        // ==========================================
        // 3. CLIENT CHECKS (Option B: Cold Client)
        // ==========================================
        for (const client of allClients) {
            const clientAny = client as any;

            // Logic: Last Contact was > 90 days ago
            const daysQuiet = daysSince(clientAny.lastContact);

            if (daysQuiet > 90) {
                await createNudgeIfNew({
                    title: `Cold Client: ${client.name}`,
                    description: `No contact for ${daysQuiet} days. Re-engage now.`,
                    type: 'PRE_EMPTIVE_STRIKE', // Purple Card
                    priority: 'HIGH', // <--- CHANGED FROM 'NORMAL' TO 'HIGH' (Safe Value)
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

        // --- HELPER: WRITE TO DB ---
        async function createNudgeIfNew(data: any) {
            const existing = await db.select().from(nudges)
                .where(and(
                    eq(nudges.title, data.title),
                    eq(nudges.isActioned, false)
                ));

            if (existing.length > 0) return;

            const insertValues: any = {
                title: data.title,
                description: data.description,
                type: data.type === 'URGENT' ? 'TASK' : data.type, // Fallback mapping
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
            newNudges++;
            logs.push(`🔔 Created: ${data.title}`);
        }

        return NextResponse.json({ success: true, newNudges, logs });

    } catch (error: any) {
        console.error("CRON ERROR:", error);
        return NextResponse.json({ error: error.message, detail: error.stack }, { status: 500 });
    }
}