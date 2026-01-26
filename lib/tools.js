// lib/tools.js
import { format } from 'date-fns';

const formatCurrency = (amount) => `$${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

// --- GM TOOLS (STRATEGY) ---
export const analyzeSystemHealth = (context) => {
    const { financials, candidates, criticalRisks } = context;
    const revenue = financials?.weeklyRevenue || 0;
    const target = 6000;
    const status = revenue >= target ? 'SURPLUS' : 'DEFICIT';

    // Simple date check for finishing soon (14 days)
    const today = new Date();
    const twoWeeksOut = new Date();
    twoWeeksOut.setDate(today.getDate() + 14);

    const finishingSoon = candidates ? candidates.filter(c => {
        if (!c.finishDate) return false;
        const finish = new Date(c.finishDate);
        return finish >= today && finish <= twoWeeksOut;
    }).length : 0;

    const onBench = candidates ? candidates.filter(c => c.status === 'Available').length : 0;
    const riskCount = criticalRisks ? criticalRisks.length : 0;

    return {
        financials: {
            display: `Weekly Revenue: ${formatCurrency(revenue)} (${status})`,
            verdict: status === 'DEFICIT' ? "Revenue Lagging." : "Revenue Strong."
        },
        operations: {
            display: `Bench: ${onBench} | Finishing (14d): ${finishingSoon}`,
            verdict: onBench > 2 ? "Liability High." : "Utilization High."
        },
        risks: { count: riskCount }
    };
};

export const calculateBenchLiability = (context) => {
    const { candidates } = context;
    if (!candidates) return { totalWeeklyBleed: "$0", criticalLiabilities: [] };

    const liabilityList = candidates
        .filter(c => c.status === 'Available')
        .map(c => {
            const pay = parseFloat(c.financials?.payRate || c.payRate || 0);
            const hours = parseFloat(c.financials?.guaranteedHours || c.guaranteedHours || 0);
            return {
                name: c.name,
                role: c.role,
                weeklyCost: pay * hours
            };
        })
        .sort((a, b) => b.weeklyCost - a.weeklyCost);

    const total = liabilityList.reduce((acc, curr) => acc + curr.weeklyCost, 0);

    return {
        totalWeeklyBleed: formatCurrency(total),
        headcount: liabilityList.length,
        criticalLiabilities: liabilityList.slice(0, 3)
    };
};

export const identifyRainmakerTargets = (context) => {
    const { projects } = context;
    if (!projects) return [];
    return projects
        .filter(p => (p.currentPhase || "").toLowerCase().includes('plan') || (p.currentPhase || "").toLowerCase().includes('tender'))
        .map(p => ({ client: p.client, project: p.name, value: p.value, tier: p.tier }))
        .sort((a, b) => (a.tier?.includes('1') ? -1 : 1))
        .slice(0, 3);
};

// --- ACCOUNTANT TOOLS (THE FULL CFO SUITE) ---

/**
 * 1. MARGIN HEALTH ANALYZER (Quality Control)
 * Identifies high-revenue but low-margin clients ("Empty Calories").
 */
export const analyzeMarginHealth = (context) => {
    const { candidates, financials } = context;
    const BURDEN = 1.20; // Matches page.js burden
    const WORK_WEEK = 40;

    if (!candidates) return { globalMargin: "0%", marginKillers: [], marginHeroes: [] };

    const activePlacements = candidates.filter(c => c.status === 'on_job' || c.status === 'On Job');

    const placements = activePlacements.map(c => {
        const charge = parseFloat(c.financials?.chargeRate || c.chargeRate || 0);
        const pay = parseFloat(c.financials?.payRate || c.payRate || 0);
        const margin = charge - (pay * BURDEN);
        const marginPct = charge > 0 ? (margin / charge) * 100 : 0;

        return {
            name: c.name,
            client: c.client || c.currentProject,
            marginPct: marginPct,
            weeklyProfit: margin * WORK_WEEK
        };
    });

    // Global Stats
    const totalRevenue = financials?.weeklyRevenue || 1;
    const totalProfit = financials?.weeklyGrossProfit || 0;
    const globalMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

    // Outliers
    const marginKillers = placements.filter(p => p.marginPct < 15).sort((a, b) => a.marginPct - b.marginPct).slice(0, 3);
    const marginHeroes = placements.filter(p => p.marginPct > 25).sort((a, b) => b.marginPct - a.marginPct).slice(0, 3);

    return {
        globalMargin: `${globalMargin}%`,
        status: globalMargin < 18 ? "CRITICAL" : globalMargin < 22 ? "CAUTION" : "HEALTHY",
        marginKillers, // Clients dragging us down
        marginHeroes   // Clients making us rich
    };
};

/**
 * 2. FINANCIAL FORECAST (The Future)
 * Simple extrapolation based on finishing dates and current run rate.
 */
export const generateFinancialForecast = (context) => {
    const { candidates, financials } = context;
    const weeklyRev = financials?.weeklyRevenue || 0;

    // Calculate known churn (finish dates in next 4 weeks)
    const today = new Date();
    let churnImpact = 0;

    if (candidates) {
        candidates.forEach(c => {
            if (c.finishDate && (c.status === 'on_job' || c.status === 'On Job')) {
                const finish = new Date(c.finishDate);
                const diffTime = finish - today;
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (days > 0 && days <= 30) {
                    // Rough calc: lost revenue per week
                    const charge = parseFloat(c.financials?.chargeRate || c.chargeRate || 0);
                    churnImpact += (charge * 40);
                }
            }
        });
    }

    const projectedMonthly = (weeklyRev * 4) - churnImpact;
    const targetMonthly = 24000; // Example target

    return {
        currentRunRate: formatCurrency(weeklyRev * 4),
        knownChurnImpact: formatCurrency(churnImpact),
        projectedLanding: formatCurrency(projectedMonthly),
        varianceToTarget: formatCurrency(projectedMonthly - targetMonthly)
    };
};

/**
 * 3. COMMISSION AUDIT (The "Owner-Operator" Logic)
 * Existing Predatory Logic.
 */
export const auditCommissions = (context) => {
    const { candidates } = context;
    if (!candidates) return [];

    const BURDEN = 1.30; // Note: Logic hub uses 1.3, page.js might use 1.2. Sticking to 1.3 for conservative estimates.
    const WORK_WEEK = 40;
    const USER = "Joe Ward";

    const auditResults = candidates
        .filter(c => c.status === 'on_job' || c.status === 'On Job')
        .map(c => {
            const charge = parseFloat(c.financials?.chargeRate || c.chargeRate || 0);
            const pay = parseFloat(c.financials?.payRate || c.payRate || 0);
            const margin = (charge - (pay * BURDEN)) * WORK_WEEK;

            // Ownership Flags
            const recruiter = c.splits?.recruiter || "Unknown";
            const candMgr = c.splits?.candidateManager || c.splits?.candidate_manager || "Unknown";
            const clientOwner = c.splits?.clientOwner || c.splits?.client_owner || "Unknown";
            const accountMgr = c.splits?.accountManager || c.splits?.account_manager || "Unknown";

            const ownership = {
                recruiter: recruiter.includes(USER),
                candMgr: candMgr.includes(USER),
                clientOwner: clientOwner.includes(USER),
                accountMgr: accountMgr.includes(USER)
            };

            let userShare = 0;
            if (ownership.recruiter) userShare += 0.20;
            if (ownership.candMgr) userShare += 0.30;
            if (ownership.clientOwner) userShare += 0.20;
            if (ownership.accountMgr) userShare += 0.30;
            if (userShare > 1) userShare = 1;

            const ncr = margin * userShare;
            let verdict = "STANDARD";
            let advice = "";

            if (ownership.clientOwner && ownership.accountMgr && ownership.recruiter && !ownership.candMgr) {
                verdict = "HOLY_GRAIL";
                advice = "High Income, Low Drama.";
            } else if (ownership.clientOwner && ownership.accountMgr && !ownership.recruiter && !ownership.candMgr) {
                verdict = "MARGIN_TARGET";
                advice = "SWAP TARGET: Replace with your own recruit to capture +20%.";
            } else if (!ownership.clientOwner && ownership.accountMgr && !ownership.recruiter && !ownership.candMgr) {
                verdict = "SWAP_TARGET";
                advice = "Busy Fool. PRIORITY: Replace candidate to boost margin.";
            } else if (ownership.recruiter && ownership.candMgr && !ownership.clientOwner && !ownership.accountMgr) {
                verdict = "IN_THE_WEEDS";
                advice = "Stop managing candidates for clients you don't own.";
            } else if (userShare >= 0.9) {
                verdict = "GOLD_MINE";
                advice = "High profit, high workload.";
            }

            return {
                candidate: c.name,
                client: c.client || c.currentProject,
                weeklyMargin: formatCurrency(margin),
                split: `${(userShare * 100).toFixed(0)}%`,
                weeklyNCR: formatCurrency(ncr),
                verdict: verdict,
                advice: advice
            };
        });

    return {
        totalRecords: auditResults.length,
        ncrTotal: formatCurrency(auditResults.reduce((sum, r) => sum + parseFloat(r.weeklyNCR.replace('$', '').replace(',', '')), 0)),
        details: auditResults
    };
};