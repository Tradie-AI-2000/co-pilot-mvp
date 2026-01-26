import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Import our upgraded toolkit
import {
    analyzeSystemHealth,
    calculateBenchLiability,
    identifyRainmakerTargets,
    auditCommissions,
    analyzeMarginHealth,
    generateFinancialForecast,
    matchmakeGhostTown,
    identifyRedeploymentRisks
} from '../../../lib/tools.js';

// --- 1. Load Static Knowledge Bases (Personas) ---
// This path assumes your folder structure is correct based on previous uploads
const AGENT_DIR = path.join(process.cwd(), '_bmad-output/bmb-creations');

const loadFile = (relPath) => {
    try {
        const fullPath = path.join(process.cwd(), relPath);
        if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, 'utf8');
        return ""; // Fail gracefully if file missing
    } catch (e) { return ""; }
};

// Load the "Personality" Files
const PERSONAS = {
    gm: loadFile(path.join(AGENT_DIR, 'stellar-gm/stellar-gm.agent.yaml')),
    accountant: loadFile(path.join(AGENT_DIR, 'stellar-accountant/stellar-accountant.agent.yaml')),
    sales: loadFile(path.join(AGENT_DIR, 'stellar-sales-lead/stellar-sales-lead.agent.yaml')),
    scout: loadFile(path.join(AGENT_DIR, 'stellar-scout/stellar-scout.agent.yaml')),
    candidate: loadFile(path.join(AGENT_DIR, 'stellar-candidate-mgr/stellar-candidate-mgr.agent.yaml')),
};

export async function POST(request) {
    try {
        // 1. Parse Input & Context
        // 'context' is the data bucket sent from the frontend
        const { message, agentId = 'gm', context = {} } = await request.json();
        const userQuery = message.toLowerCase();

        // 2. EXTRACT OPERATIONAL RISKS (The Nudge Engine Integration)
        // We look for the Red/Purple cards we created earlier
        const nudges = context.moneyMoves || [];

        // Categorize Nudges for the AI
        const ghostTowns = nudges.filter(n => n.title?.includes('GHOST TOWN') || n.priority === 'CRITICAL');
        const rainmakers = nudges.filter(n => n.type === 'PRE_EMPTIVE_STRIKE');
        const tasks = nudges.filter(n => n.type === 'TASK');

        // Build the Live "Risk Report"
        // This is injected into the prompt so the AI knows the situation immediately
        const riskReport = `
        ### 🚨 OPERATIONAL ALERT FEED (LIVE):
        ${ghostTowns.length > 0 ? `🔥 CRITICAL: ${ghostTowns.length} Ghost Towns Detected! (Immediate Action Required)` : "✅ No Critical Site Risks."}
        ${rainmakers.length > 0 ? `💰 OPPORTUNITY: ${rainmakers.length} Rainmaker Targets (Cold Clients) Identified.` : "⏸️ No Cold Clients."}
        ${tasks.length > 0 ? `📋 TASKS: ${tasks.length} pending administrative tasks.` : "✅ Admin Clear."}
        
        TOP PRIORITY ALERTS:
        ${ghostTowns.map(n => `- [URGENT] ${n.title}: ${n.description}`).join('\n')}
        ${rainmakers.map(n => `- [GROWTH] ${n.title}: ${n.description}`).join('\n')}
        `;

        // 3. LOGIC HUB: Determine Intent & Run Tools
        let toolData = null;
        let protocolName = null;

        // --- GM PROTOCOLS (General Manager) ---
        if (agentId === 'gm') {
            // A. Boot / Status Check
            if (message === 'SYSTEM_STARTUP_BRIEFING' || userQuery.includes('boot') || userQuery.includes('status') || userQuery.includes('briefing')) {
                protocolName = 'BOOT_SEQUENCE';
                const health = analyzeSystemHealth(context);
                // We calculate Bench Liability manually here to ensure it's fresh in the briefing
                const benchData = calculateBenchLiability(context);
                toolData = {
                    ...health,
                    benchReport: benchData,
                    operationalRisks: riskReport
                };
            }
            // B. Bench / Liability Check
            else if (userQuery.includes('bench') || userQuery.includes('liability')) {
                protocolName = 'BENCH_LIABILITY';
                toolData = calculateBenchLiability(context);
            }
            // C. Growth / Sales Check
            else if (userQuery.includes('deficit') || userQuery.includes('rainmaker') || userQuery.includes('sales')) {
                protocolName = 'GROWTH_PROTOCOL';
                toolData = {
                    rainmakerTargets: rainmakers, // Feed the Nudges directly
                    ...identifyRainmakerTargets(context)
                };
            }
            // D. Rescue / Matchmaking (New!)
            else if (userQuery.includes('ghost') || userQuery.includes('match') || userQuery.includes('find')) {
                protocolName = 'RESCUE_PROTOCOL';
                // If the user says "Find a hammerhand", we could parse that. 
                // For now, we default to 'General' or match the first Ghost Town if it exists.
                const targetRole = ghostTowns.length > 0 ? 'General' : 'General';
                toolData = matchmakeGhostTown(context, targetRole);
            }
        }

        // --- ACCOUNTANT / CFO PROTOCOLS ---
        if (agentId === 'accountant') {
            if (userQuery.includes('audit') || userQuery.includes('commission')) {
                protocolName = 'COMMISSION_AUDIT';
                toolData = auditCommissions(context);
            }
            else if (userQuery.includes('margin') || userQuery.includes('profit')) {
                protocolName = 'MARGIN_HEALTH';
                toolData = analyzeMarginHealth(context);
            }
            else if (userQuery.includes('briefing') || userQuery.includes('report')) {
                protocolName = 'CFO_BRIEFING';
                toolData = {
                    marginHealth: analyzeMarginHealth(context),
                    forecast: generateFinancialForecast(context),
                    liability: calculateBenchLiability(context),
                    commissionStructure: auditCommissions(context)
                };
            }
        }

        // 4. Construct the Final Prompt
        const primaryPersona = PERSONAS[agentId] || PERSONAS.gm;

        // Add instructions for the GM to orchestrate others
        let orchestratorAddon = "";
        if (agentId === 'gm') {
            orchestratorAddon = `
            ### 🤖 BOARD OF DIRECTORS SWARM (SUB-AGENTS)
            You command these specialists. If you see a specific risk (e.g. Low Margin), task them by name:
            ${Object.entries(PERSONAS).filter(([id]) => id !== 'gm').map(([id, yaml]) => `- **${id.toUpperCase()}**: ${yaml.split('title:')[1]?.split('\n')[0] || id}`).join('\n')}
            `;
        }

        // Prepare the Dynamic Data Block
        let dynamicContext = "";
        if (toolData) {
            dynamicContext = `
            ### ⚡ ACTIVE PROTOCOL: ${protocolName}
            HARD DATA GENERATED. INTERPRET THIS IMMEDIATELY:
            ${JSON.stringify(toolData, null, 2)}
            `;
        } else {
            // Fallback Context (General Chat)
            dynamicContext = `
            ### 📊 LIVE DASHBOARD CONTEXT
            ${riskReport} 
            
            - Weekly Revenue: $${context.financials?.weeklyRevenue || 0}
            - Revenue at Risk: $${context.financials?.revenueAtRisk || 0}
            `;
        }

        const systemPrompt = `
        You are strictly the persona defined below for Stellar Recruitment.
        
        ### 🧠 AUTHORITATIVE PERSONA
        ${primaryPersona}

        ${orchestratorAddon}

        ${dynamicContext}

        ### MANDATORY VISUAL HIERARCHY
        1. **Header**: # [AGENT: IDENTIFIER] | STATUS: [URGENT/CAUTION/CLEAR]
        2. **Situation Report**: If there are GHOST TOWNS or CRITICAL RISKS in the data above, put them right here in RED bold text.
        3. **Tactical Plan**: Use bullet points.
        4. **Direct Orders**: Assign tasks to Joe or Sub-Agents.

        ### USER DIRECTIVE
        User Directive: "${message}"
        `;

        // 5. Call Gemini
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const result = await model.generateContent(systemPrompt);

        return NextResponse.json({
            chat_response: result.response.text(),
            signal_updates: [] // Future: Wire this to UI signals
        });

    } catch (error) {
        console.error("🚨 [AGENT_ERROR]:", error);
        return NextResponse.json({
            chat_response: `**[SYSTEM FAILURE]**\n\nError: ${error.message}`,
            signal_updates: []
        });
    }
}