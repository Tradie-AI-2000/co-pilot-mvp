import { WORKFORCE_MATRIX, getProjectSize, PHASE_MAP } from './construction-logic.js';
import { calculateReactivationScore, getGoldenHourTargets } from './growth-logic.js';

// --- FINANCIAL LOGIC (The "Accountant" Brain) ---
export const SPLIT_RULES = {
    recruiter: 0.20,
    candidateManager: 0.30,
    clientOwner: 0.20,
    accountManager: 0.30
};

export function calculateNCR(dealData) {
    const charge = parseFloat(dealData.chargeRate) || 0;
    const pay = parseFloat(dealData.payRate) || 0;
    const hours = parseFloat(dealData.guaranteedHours) || 40;
    const burden = 1.30;
    const margin = (charge - (pay * burden)) * hours;

    // Capture Logic
    let commissionPct = 0;
    if (dealData.userIsRecruiter) commissionPct += SPLIT_RULES.recruiter;
    if (dealData.userIsClientOwner) commissionPct += SPLIT_RULES.clientOwner;
    if (dealData.userIsAccountMgr) commissionPct += SPLIT_RULES.accountManager;
    // Candidate Mgr usually separate

    const ncr = margin * commissionPct;
    
    let verdict = "STANDARD";
    if (commissionPct < 0.5) verdict = "BUSY_FOOL"; 
    if (commissionPct >= 0.7) verdict = "GOLD_MINE";
    if (margin < 400) verdict = "BUSY_FOOL"; // Low total GP

    return {
        weeklyMargin: Math.round(margin),
        userCommissionPct: commissionPct * 100,
        weeklyNCR: Math.round(ncr),
        verdict,
        splitBreakdown: SPLIT_RULES
    };
}

// --- JARVIS LOGIC (Logistics) ---

export function getBenchLiability(candidates) {
    // Logic: Status=Available AND GuaranteedHours > 0
    const liability = candidates
        .filter(c => c.status === 'Available' && (c.guaranteedHours || 0) > 0)
        .map(c => ({
            name: `${c.firstName} ${c.lastName}`,
            cost: (c.payRate || 25) * (c.guaranteedHours || 0),
            hours: c.guaranteedHours
        }));
    
    const totalCost = liability.reduce((sum, c) => sum + c.cost, 0);
    return {
        status: totalCost > 0 ? "CRITICAL" : "SAFE",
        totalWeeklyLiability: totalCost,
        candidates: liability
    };
}

export function getRedeploymentRisks(placements) {
    // Logic: Finish Date <= 21 Days
    const now = new Date();
    const riskWindow = new Date();
    riskWindow.setDate(now.getDate() + 30);

    return placements
        .filter(p => {
            const finish = new Date(p.endDate || p.finishDate);
            return finish >= now && finish <= riskWindow;
        })
        .map(p => ({
            candidateName: p.candidateName,
            finishDate: p.endDate,
            project: p.projectName,
            daysRemaining: Math.ceil((new Date(p.endDate) - now) / (1000 * 60 * 60 * 24))
        }));
}

// --- CANDIDATE MGR LOGIC (Talent Ops) ---

export function generateSquads(benchCandidates) {
    // Logic: Group by Region + Trade. 1 Senior : 2 Juniors
    const squads = [];
    // Mocking logic for MVP - grouping simply by region
    const regions = [...new Set(benchCandidates.map(c => c.region || "Auckland"))];
    
    regions.forEach(region => {
        const regionalBench = benchCandidates.filter(c => c.region === region);
        if (regionalBench.length >= 3) {
            squads.push({
                name: `${region} Hit Squad`,
                members: regionalBench.slice(0, 3).map(c => c.firstName),
                skillMix: "Mixed"
            });
        }
    });
    return squads;
}

export function getFlightRisks(candidates) {
    // Logic: Mood Check + Commute
    return candidates.filter(c => {
        // Mock checkin logic - assuming 'mood' field exists on candidate for now
        const isUnhappy = c.mood === 'Negative' || c.mood === 'Neutral';
        return isUnhappy;
    }).map(c => ({
        name: `${c.firstName} ${c.lastName}`,
        riskFactor: "Mood Decay",
        action: "Call immediately"
    }));
}

// --- SALES LEAD LOGIC (The Hunter) ---

export function getProximityMatches(candidates, projectLocation) {
    // Logic: Distance < 45 mins. Mocking geo for now.
    // In real app, call api/geo
    return candidates
        .filter(c => c.status === 'Available')
        .map(c => ({
            name: `${c.firstName} ${c.lastName}`,
            driveTime: Math.floor(Math.random() * 60), // Mock
            marginBuffer: (c.chargeOutRate || 50) - ((c.payRate || 30) * 1.3)
        }))
        .filter(c => c.driveTime < 45)
        .sort((a, b) => a.driveTime - b.driveTime);
}

// --- IMMIGRATION LOGIC (The Guard) ---

export function validateVisaConditions(candidate, project) {
    if (!candidate.visaConditions) return { status: "UNKNOWN", message: "No Visa Data" };
    
    const violations = [];
    
    // 1. Role Check
    if (candidate.visaConditions.role && candidate.visaConditions.role !== project.role) {
        violations.push(`Role Mismatch: Visa says '${candidate.visaConditions.role}', Project says '${project.role}'`);
    }
    
    // 2. Region Check
    if (candidate.visaConditions.regions && !candidate.visaConditions.regions.includes(project.region)) {
        violations.push(`Region Mismatch: Visa allows [${candidate.visaConditions.regions}], Project is in '${project.region}'`);
    }
    
    // 3. Employer Lock
    if (candidate.visaConditions.employer && candidate.visaConditions.employer !== "CarryOn Working Limited") {
        violations.push(`Employer Mismatch: Visa locked to '${candidate.visaConditions.employer}'`);
    }
    
    return {
        status: violations.length > 0 ? "BLOCKED" : "APPROVED",
        violations
    };
}

// --- SYSTEMS IT LOGIC (The Sentinel) ---

export function getSyncStatus(lastSyncTime) {
    const now = new Date();
    const diffMins = (now - new Date(lastSyncTime)) / 60000;
    
    if (diffMins > 60) return { status: "KILL_SWITCH", message: "Data is > 1 hour old. Agents Disabled." };
    if (diffMins > 15) return { status: "WARNING", message: "Sync Latency > 15 mins." };
    return { status: "NOMINAL", message: "Systems Green." };
}

// --- MAIN ROUTER ---

export async function runProtocol(protocolName, contextData = {}) {
    console.log(`[LogicHub] Running Protocol: ${protocolName}`);

    switch (protocolName) {
        case 'COMMISSION_AUDIT':
            const activeDeals = contextData.candidates ? contextData.candidates.filter(c => c.status === 'On Job') : [];
            return {
                type: 'AUDIT_DATA',
                data: activeDeals.map(deal => calculateNCR(deal))
            };

        case 'BENCH_LIABILITY':
            return {
                type: 'BENCH_RISK',
                data: getBenchLiability(contextData.candidates || [])
            };

        case 'REDEPLOYMENT_RADAR':
            return {
                type: 'REDEPLOYMENT_LIST',
                data: getRedeploymentRisks(contextData.placements || [])
            };

        case 'FLIGHT_RISK':
            return {
                type: 'RISK_REPORT',
                data: getFlightRisks(contextData.candidates || [])
            };

        case 'SQUAD_BUILDER':
            return {
                type: 'SQUAD_SUGGESTIONS',
                data: generateSquads(contextData.candidates || [])
            };

        case 'SYSTEM_HEALTH':
            return {
                type: 'SYSTEM_STATUS',
                data: getSyncStatus(contextData.lastSyncTime || new Date())
            };

        case 'VISA_CHECK':
             return { type: 'VISA_STATUS', message: "Run validation on specific candidate." };

        case 'RELATIONSHIP_HEALTH':
            const clients = contextData.clients || [];
            const decaying = clients.filter(c => {
                const last = new Date(c.lastContact || 0);
                return (new Date() - last) / (1000 * 60 * 60 * 24) > 30;
            });
            return {
                type: 'RELATIONSHIP_HEALTH',
                data: {
                    totalClients: clients.length,
                    decayingCount: decaying.length,
                    healthScore: Math.round(100 - ((decaying.length / (clients.length || 1)) * 100))
                }
            };

        case 'PULSE_METRICS':
            const logs = contextData.activityLogs || [];
            const today = new Date().toISOString().split('T')[0];
            const calls = logs.filter(l => l.timestamp.startsWith(today) && l.type === 'contact').length;
            return {
                type: 'PULSE_METRICS',
                data: {
                    dailyActivityLevel: calls > 20 ? "High" : "Low",
                    callsMade: calls,
                    placements: contextData.candidates?.filter(c => c.status === 'On Job').length || 0
                }
            };

        case 'GOLDEN_HOUR':
             return {
                 type: 'TARGET_LIST',
                 data: getGoldenHourTargets(contextData.clients || [], contextData.leads || [])
             };

        default:
            return null;
    }
}