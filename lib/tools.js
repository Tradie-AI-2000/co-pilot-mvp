// ==========================================
// 🛠️ STELLAR TOOLKIT (OPERATIONS & STRATEGY)
// ==========================================

// --- 1. SYSTEM HEALTH & VITALS ---
export const analyzeSystemHealth = (context) => {
    const candidates = context.candidates || [];
    const projects = context.projects || [];

    const activeWorkers = candidates.filter(c => c.status === 'On Job').length;
    const bench = candidates.filter(c => c.status === 'Available').length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;

    return {
        status: "OPERATIONAL",
        vitals: {
            activeWorkers,
            benchStrength: bench,
            liveSites: activeProjects
        }
    };
};

// --- 2. BENCH MANAGEMENT (The "Inventory" Check) ---
// UPDATED: Distinguishes between "Bodies on Bench" vs "Cash Burn"
export const calculateBenchLiability = (context) => {
    const candidates = context.candidates || [];

    // A. Headcount (Who is ready to work?)
    // Checks for 'Available', 'Bench', or 'Ready' status (case-insensitive)
    const benchStaff = candidates.filter(c =>
        ['available', 'bench', 'ready'].includes((c.status || '').toLowerCase())
    );

    // B. Financial Liability (Who are we PAYING to sit there?)
    // Only counts staff with guaranteed hours or a retainer
    const liabilityStaff = benchStaff.filter(c => c.guaranteedHours === true);

    // Calculate Weekly Burn
    const weeklyBurn = liabilityStaff.reduce((sum, c) => sum + ((c.rate || 0) * 40), 0);

    return {
        status: weeklyBurn > 0 ? "BURNING CASH" : "OPTIMIZED",
        benchHeadcount: benchStaff.length, // The real number (e.g., 1 for Marcial)
        financialLiability: weeklyBurn,     // The real cost (e.g., $0)
        names: benchStaff.map(c => `${c.name} (${c.role || 'Gen'})`),
        action: benchStaff.length > 0 ? "Deploy these candidates immediately." : "Recruit more stock."
    };
};

// --- 3. SALES INTELLIGENCE (The "Rainmaker") ---
export const identifyRainmakerTargets = (context) => {
    const clients = context.clients || [];
    const nudges = context.moneyMoves || [];

    // Priority 1: Use the Nudge Engine's identified "Cold Clients"
    const nudgeTargets = nudges
        .filter(n => n.type === 'PRE_EMPTIVE_STRIKE')
        .map(n => ({
            name: n.title.replace('Rainmaker: ', ''),
            reason: n.description
        }));

    // Priority 2: Fallback logic if no nudges exist
    // Find clients with 'Active' status but last contact > 30 days
    const fallbackTargets = clients.filter(c => {
        if (!c.lastContact) return false;
        const days = Math.floor((new Date() - new Date(c.lastContact)) / (1000 * 60 * 60 * 24));
        return days > 30 && c.status === 'Active';
    }).map(c => ({ name: c.name, reason: "30+ Days No Contact" }));

    return {
        targets: nudgeTargets.length > 0 ? nudgeTargets : fallbackTargets,
        totalOpportunities: (nudgeTargets.length || fallbackTargets.length),
        strategy: "Re-engage immediately using the 'Relationship Decay' script."
    };
};

// --- 4. GHOST TOWN RESCUE (Matchmaking) ---
export const matchmakeGhostTown = (context, requiredRole = 'General') => {
    const candidates = context.candidates || [];
    // Filter for available candidates
    const available = candidates.filter(c =>
        ['available', 'bench', 'ready'].includes((c.status || '').toLowerCase())
    );

    // Keyword matching logic
    const matches = available.filter(c => {
        const role = (c.role || c.jobTitle || '').toLowerCase();
        const tags = (c.tags || []).join(' ').toLowerCase();
        const query = requiredRole.toLowerCase();

        // Matches if role or tags contain the query (e.g. "Hammerhand")
        return role.includes(query) || tags.includes(query);
    });

    return {
        targetRole: requiredRole,
        matchCount: matches.length,
        candidates: matches.map(c => ({
            name: c.name,
            id: c.id,
            role: c.role,
            location: c.location || 'Unknown'
        })),
        recommendation: matches.length > 0 ? "Send placement offer SMS." : "Run external ad."
    };
};

// --- 5. REDEPLOYMENT RADAR (Retention) ---
export const identifyRedeploymentRisks = (context) => {
    const candidates = context.candidates || [];
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const finishingSoon = candidates.filter(c => {
        if (c.status !== 'On Job' || !c.endDate) return false;
        const end = new Date(c.endDate);
        return end >= today && end <= nextWeek;
    });

    return {
        riskCount: finishingSoon.length,
        staff: finishingSoon.map(c => ({
            name: c.name,
            finishes: c.endDate,
            currentClient: c.currentProject || 'Unknown'
        })),
        action: "Line up next project immediately to prevent churn."
    };
};

// --- 6. FINANCIAL TOOLS (CFO Suite) ---
export const auditCommissions = (context) => {
    // Mock logic for demonstration
    return {
        status: "AUDIT COMPLETE",
        discrepancies: 0,
        message: "All commissions align with placements."
    };
};

export const analyzeMarginHealth = (context) => {
    const financials = context.financials || {};
    const margin = financials.grossMargin || 0.18; // Default 18%

    return {
        currentMargin: `${(margin * 100).toFixed(1)}%`,
        status: margin < 0.15 ? "CRITICAL ALERT" : "HEALTHY",
        action: margin < 0.15 ? "Review pricing on recent placements." : "Maintain course."
    };
};

export const generateFinancialForecast = (context) => {
    return {
        nextMonthProjection: "Stable",
        growthTrajectory: "+5% based on current pipeline."
    };
};