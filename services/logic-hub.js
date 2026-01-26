import { WORKFORCE_MATRIX, getProjectSize, PHASE_MAP } from './construction-logic.js';
import { calculateReactivationScore, getGoldenHourTargets } from './growth-logic.js';

// --- FINANCIAL LOGIC (The "Accountant" Brain) ---  
// Single Source of Truth for Commission Splits  
export const SPLIT_RULES = {
    recruiter: 0.20,
    candidateManager: 0.30,
    clientOwner: 0.20,
    accountManager: 0.30
};

export function calculateNCR(dealData) {
    // 1. Calculate Weekly Margin  
    // Formula: (Charge - (Pay * 1.30)) * Hours  
    const charge = parseFloat(dealData.chargeRate) || 0;
    const pay = parseFloat(dealData.payRate) || 0;
    const hours = parseFloat(dealData.guaranteedHours) || 40;

    // Burden is hardcoded to 1.30 (standard construction burden)  
    const margin = (charge - (pay * 1.30)) * hours;

    // 2. Determine Ownership  
    // In a real app, these would be IDs. For now, we match strings or booleans passed from context.  
    const isRecruiter = dealData.userIsRecruiter;
    const isClientOwner = dealData.userIsClientOwner;
    const isAccountMgr = dealData.userIsAccountMgr;

    // 3. Calculate "The Split"  
    let commissionPct = 0;
    if (isRecruiter) commissionPct += SPLIT_RULES.recruiter; // +20%  
    // We assume Cand Mgr is someone else (Sarah) usually, so we don't add that 30%  
    if (isClientOwner) commissionPct += SPLIT_RULES.clientOwner; // +20%  
    if (isAccountMgr) commissionPct += SPLIT_RULES.accountManager; // +30%

    const ncr = margin * commissionPct;

    // 4. Verdict  
    let verdict = "STANDARD";
    if (commissionPct < 0.5) verdict = "BUSY_FOOL"; // User getting < 50%  
    if (commissionPct >= 0.7) verdict = "GOLD_MINE"; // User getting > 70%

    return {
        weeklyMargin: Math.round(margin),
        userCommissionPct: commissionPct * 100,
        weeklyNCR: Math.round(ncr),
        verdict: verdict,
        splitBreakdown: {
            recruiter: SPLIT_RULES.recruiter,
            candMgr: SPLIT_RULES.candidateManager,
            client: SPLIT_RULES.clientOwner,
            account: SPLIT_RULES.accountManager
        }
    };
}

// --- LOGIC ROUTER (The API calls this) ---

export async function runProtocol(protocolName, contextData = {}) {
    console.log(`[LogicHub] Running Protocol: ${protocolName}`);

    switch (protocolName) {
        case 'COMMISSION_AUDIT':
            // Filter for Active deals  
            const activeDeals = contextData.candidates ? contextData.candidates.filter(c => c.status?.toLowerCase() === 'on_job') : [];
            const auditResults = activeDeals.map(deal => {
                // Defensive coding for missing nested objects  
                const financials = deal.financials || { chargeRate: deal.chargeRate, payRate: deal.payRate, guaranteedHours: deal.guaranteedHours };
                const splits = deal.splits || { recruiter: deal.recruiter || 'Joe Ward', clientOwner: deal.clientOwner || 'Joe Ward', accountManager: deal.accountManager || 'Joe Ward' };

                return {
                    candidateName: `${deal.firstName} ${deal.lastName}`,
                    client: deal.currentProject || deal.currentEmployer || "Unknown",
                    ...calculateNCR({
                        chargeRate: financials.chargeRate,
                        payRate: financials.payRate,
                        guaranteedHours: financials.guaranteedHours,
                        // Mocking ownership logic - assumes "Joe Ward" is the user  
                        userIsRecruiter: splits.recruiter === 'Joe Ward',
                        userIsClientOwner: splits.clientOwner === 'Joe Ward',
                        userIsAccountMgr: splits.accountManager === 'Joe Ward'
                    })
                };
            });
            return { type: 'AUDIT_DATA', count: auditResults.length, data: auditResults };

        case 'GOLDEN_HOUR':
            // Uses growth-logic.js  
            const targets = getGoldenHourTargets(contextData.clients || [], contextData.leads || []);
            return { type: 'TARGET_LIST', count: targets.length, data: targets };

        case 'BOOT_SEQUENCE':
            // High-level "Morning Briefing" Data
            const revenue = contextData.financials?.weeklyRevenue || 0;
            const target = 40000; // Mock target
            const status = revenue >= target ? "ON TRACK" : "BEHIND";

            return {
                type: 'MORNING_BRIEFING',
                data: {
                    greeting: "Gidday Joe, righto what's the plan today?",
                    financials: { revenue: `$${revenue}`, status: status },
                    riskCount: contextData.criticalRisks?.length || 0,
                    menu: [
                        "🦅 30,000ft View (Strategic Audit)",
                        "📞 Client Power Hour (Sales Focus)",
                        "👷 Bench Clearance (Candidate Focus)"
                    ]
                }
            };

        // [NEW] SCOUT PROTOCOL
        case 'TENDER_INTEL':
            const projects = contextData.projects || [];
            // Filter for projects in early stages
            const tenders = projects.filter(p =>
                p.currentPhase === 'Planning' ||
                p.currentPhase === 'Tendering' ||
                p.currentPhase === 'Consenting'
            );

            return {
                type: 'INTEL_REPORT',
                count: tenders.length,
                data: tenders.map(t => ({
                    project: t.name,
                    location: t.region || "Unknown",
                    value: t.value || "Undisclosed",
                    stage: t.currentPhase,
                    // Mocking logic for incumbents based on demands
                    incumbent: t.demands && t.demands.length > 0 ? "Competitor Active" : "Open Ground",
                    action: "Initiate 'Sniper Pitch'"
                }))
            };

        case 'RECRUITMENT_RISK':
            // Uses construction-logic.js concepts  
            const candidates = contextData.candidates || [];
            const finishingSoon = candidates.filter(c => c.finishDate && (new Date(c.finishDate) - new Date()) / (1000 * 60 * 60 * 24) < 14);
            const visaRisks = candidates.filter(c =>
                (c.residency?.toLowerCase().includes('visa') && (!c.visaExpiry || new Date(c.visaExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)))
            );

            return {
                type: 'RISK_REPORT',
                data: {
                    finishingCount: finishingSoon.length,
                    visaRiskCount: visaRisks.length,
                    details: finishingSoon.map(c => `${c.firstName} ${c.lastName} (${c.role}) ends in ${Math.round((new Date(c.finishDate) - new Date()) / (1000 * 60 * 60 * 24))} days.`)
                }
            };

        default:
            return null;
    }
}
