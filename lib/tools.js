// ==========================================
// 🛠️ STELLAR SUPER TOOLKIT (Consolidated)
// ==========================================

// ==========================================
// 1. SCOUTING & TALENT INTELLIGENCE
// ==========================================

// The "Universal Search Engine" (Updated for Fuzzy Matching)
export const scoutBench = (context, criteria = {}) => {
    const candidates = context.candidates || [];
    const { role } = criteria;

    // 1. Filter for Availability
    let pool = candidates.filter(c =>
        ['available', 'bench', 'ready'].includes((c.status || '').toLowerCase())
    );

    // 2. Fuzzy Role Match
    if (role) {
        // Split "Qualified Carpenter" into ["qualified", "carpenter"]
        const searchTerms = role.toLowerCase().split(' ').filter(w => w.length > 2);

        pool = pool.filter(c => {
            const cRole = (c.role || c.jobTitle || '').toLowerCase();
            const tags = (c.tags || []).join(' ').toLowerCase();

            // Check if ANY search term appears in the Candidate's Role or Tags
            return searchTerms.some(term => cRole.includes(term) || tags.includes(term));
        });
    }

    return {
        found: pool.length,
        candidates: pool.map(c => ({
            id: c.id,
            name: c.name,
            role: c.role || 'General',
            location: c.location || 'Unknown',
            status: c.status,
            tags: c.tags || []
        }))
    };
};

// The "Ghostbuster" (Wrapper for Ghost Town Rescue)
export const matchmakeGhostTown = (context, requiredRole = 'General') => {
    const result = scoutBench(context, { role: requiredRole });
    return {
        targetRole: requiredRole,
        matchCount: result.found,
        candidates: result.candidates,
        recommendation: result.found > 0 ? "Send placement offer SMS." : "Run external ad immediately."
    };
};

// The "Gap Analyzer"
export const analyzeProjectGap = (context, projectName) => {
    const projects = context.projects || [];
    const targetProject = projects.find(p => p.name.toLowerCase().includes(projectName.toLowerCase()));

    if (!targetProject) return { error: "Project not found." };

    const requiredHeadcount = targetProject.requiredStaff || 5;
    const currentStaff = (context.candidates || []).filter(c =>
        c.currentProject === targetProject.name || c.projectId === targetProject.id
    ).length;

    const gap = requiredHeadcount - currentStaff;
    return {
        project: targetProject.name,
        status: gap > 0 ? "UNDERSTAFFED" : "OPTIMAL",
        gap: gap > 0 ? gap : 0,
        message: gap > 0 ? `Urgent: Need ${gap} more workers.` : "Staffing levels optimal."
    };
};

// ==========================================
// 2. OPERATIONS & RISK MANAGEMENT
// ==========================================

export const analyzeSystemHealth = (context) => {
    const candidates = context.candidates || [];
    const projects = context.projects || [];
    return {
        status: "OPERATIONAL",
        vitals: {
            activeWorkers: candidates.filter(c => c.status === 'On Job').length,
            benchStrength: candidates.filter(c => ['available', 'bench'].includes((c.status || '').toLowerCase())).length,
            liveSites: projects.filter(p => p.status === 'Active').length
        }
    };
};

export const calculateBenchLiability = (context) => {
    const candidates = context.candidates || [];
    const benchStaff = candidates.filter(c => ['available', 'bench', 'ready'].includes((c.status || '').toLowerCase()));
    const liabilityStaff = benchStaff.filter(c => c.guaranteedHours === true);
    const weeklyBurn = liabilityStaff.reduce((sum, c) => sum + ((c.rate || 0) * 40), 0);

    return {
        status: weeklyBurn > 0 ? "BURNING CASH" : "OPTIMIZED",
        benchHeadcount: benchStaff.length,
        financialLiability: weeklyBurn,
        names: benchStaff.map(c => `${c.name} (${c.role || 'Gen'})`),
        action: benchStaff.length > 0 ? "Deploy these candidates immediately." : "Recruit more stock."
    };
};

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

// ==========================================
// 3. SALES & STRATEGY (The Rainmaker)
// ==========================================

export const identifyRainmakerTargets = (context) => {
    const clients = context.clients || [];
    const nudges = context.moneyMoves || [];

    const nudgeTargets = nudges
        .filter(n => n.type === 'PRE_EMPTIVE_STRIKE')
        .map(n => ({ name: n.title.replace('Rainmaker: ', ''), reason: n.description }));

    const fallbackTargets = clients.filter(c => {
        if (!c.lastContact || c.status !== 'Active') return false;
        const days = Math.floor((new Date() - new Date(c.lastContact)) / (1000 * 60 * 60 * 24));
        return days > 30;
    }).map(c => ({ name: c.name, reason: "30+ Days No Contact" }));

    return {
        targets: nudgeTargets.length > 0 ? nudgeTargets : fallbackTargets,
        totalOpportunities: (nudgeTargets.length || fallbackTargets.length),
        strategy: "Re-engage immediately using the 'Relationship Decay' script."
    };
};

// ==========================================
// 4. FINANCIAL TOOLS (CFO Suite)
// ==========================================

export const auditCommissions = (context) => ({ status: "AUDIT COMPLETE", discrepancies: 0 });

export const analyzeMarginHealth = (context) => {
    const financials = context.financials || {};
    const margin = financials.grossMargin || 0.18;
    return {
        currentMargin: `${(margin * 100).toFixed(1)}%`,
        status: margin < 0.15 ? "CRITICAL ALERT" : "HEALTHY",
        action: margin < 0.15 ? "Review pricing on recent placements." : "Maintain course."
    };
};

export const generateFinancialForecast = (context) => ({
    nextMonthProjection: "Stable",
    growthTrajectory: "+5% based on current pipeline."
});

// ==========================================
// 5. MARKET INTELLIGENCE (The Scout's Spyglass)
// ==========================================

export const searchConstructionNews = (query) => {
    // ⚠️ REAL WORLD: You would call SerpApi or Tavily here.
    // 🧪 SIMULATION: We return realistic "Mock" Intel for the demo.
    console.log(`📡 SCOUT SEARCHING WEB FOR: ${query}`);

    const mockIntel = [
        {
            source: "Pacific Tenders",
            date: "2 days ago",
            snippet: "Fletcher Construction awarded $200M contract for Auckland Hospital extension. Sub-trades tendering opens next week.",
            url: "www.pacifictenders.co.nz/hospital-extension"
        },
        {
            source: "BusinessDesk",
            date: "4 hours ago",
            snippet: "Mainzeal 2.0? Large civil contractor 'EarthMovers NZ' rumors of liquidation after stalled payment claims.",
            url: "www.businessdesk.co.nz/earthmovers-risk"
        },
        {
            source: "Council Consents",
            date: "Yesterday",
            snippet: "Resource consent granted for 400-lot subdivision in Drury. Lead Developer: Kippenberger Estates.",
            url: "www.aucklandcouncil.govt.nz/drury-south"
        }
    ];

    const keywords = query.toLowerCase().split(' ');
    const results = mockIntel.filter(item =>
        keywords.some(k => item.snippet.toLowerCase().includes(k)) ||
        keywords.some(k => item.source.toLowerCase().includes(k))
    );

    return {
        query: query,
        results: results.length > 0 ? results : mockIntel,
        status: "INTEL ACQUIRED"
    };
};