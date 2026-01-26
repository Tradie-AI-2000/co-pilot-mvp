import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// [NEW] Import the new Tools Library
import {
    analyzeSystemHealth,
    calculateBenchLiability,
    identifyRainmakerTargets,
    auditCommissions,
    analyzeMarginHealth,
    generateFinancialForecast
} from '../../../lib/tools.js';

// --- 1. Load Static Knowledge Bases (Cached) ---
const AGENT_DIR = path.join(process.cwd(), '_bmad-output/bmb-creations');

// Helper to safely load files
const loadFile = (relPath) => {
    try {
        const fullPath = path.join(process.cwd(), relPath);
        if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, 'utf8');
        return "";
    } catch (e) { return ""; }
};

// Load Personas
const PERSONAS = {
    gm: loadFile(path.join(AGENT_DIR, 'stellar-gm/stellar-gm.agent.yaml')),
    accountant: loadFile(path.join(AGENT_DIR, 'stellar-accountant/stellar-accountant.agent.yaml')),
    sales: loadFile(path.join(AGENT_DIR, 'stellar-sales-lead/stellar-sales-lead.agent.yaml')),
    scout: loadFile(path.join(AGENT_DIR, 'stellar-scout/stellar-scout.agent.yaml')),
    candidate: loadFile(path.join(AGENT_DIR, 'stellar-candidate-mgr/stellar-candidate-mgr.agent.yaml')),
};

export async function POST(request) {
    try {
        // 1. Parse Input
        const { message, agentId = 'gm', context = {} } = await request.json();
        const userQuery = message.toLowerCase();

        // 2. LOGIC HUB: Determine Intent & Run Tools
        let toolData = null;
        let protocolName = null;

        // --- GM PROTOCOLS ---
        if (agentId === 'gm') {
            if (message === 'SYSTEM_STARTUP_BRIEFING' || userQuery.includes('boot') || userQuery.includes('briefing')) {
                protocolName = 'BOOT_SEQUENCE';
                toolData = analyzeSystemHealth(context);
            }
            else if (userQuery.includes('bench') || userQuery.includes('liability') || userQuery.includes('bleed')) {
                protocolName = 'BENCH_LIABILITY';
                toolData = calculateBenchLiability(context);
            }
            else if (userQuery.includes('deficit') || userQuery.includes('recovery')) {
                protocolName = 'DEFICIT_RECOVERY';
                toolData = identifyRainmakerTargets(context);
            }
        }

        // --- ACCOUNTANT / CFO PROTOCOLS (UPDATED) ---
        if (agentId === 'accountant') {

            // 1. COMMISSION AUDIT (The Predator)
            if (userQuery.includes('audit') || userQuery.includes('commission') || userQuery.includes('ncr')) {
                protocolName = 'COMMISSION_AUDIT';
                toolData = auditCommissions(context);
            }

            // 2. MARGIN HEALTH (The Auditor)
            else if (userQuery.includes('margin') || userQuery.includes('profit')) {
                protocolName = 'MARGIN_HEALTH';
                toolData = analyzeMarginHealth(context);
            }

            // 3. CFO BRIEFING (The Executive)
            // Runs the full "Triangle of Wealth" suite to check for Swap Targets, Bleed, and Quality simultaneously.
            else if (userQuery.includes('briefing') || userQuery.includes('status') || userQuery.includes('report') || userQuery.includes('forecast')) {
                protocolName = 'CFO_BRIEFING';

                const margin = analyzeMarginHealth(context);
                const forecast = generateFinancialForecast(context);
                const liability = calculateBenchLiability(context);
                const commissions = auditCommissions(context); // [CRITICAL ADDITION: Predatory Logic]

                toolData = {
                    marginHealth: margin,
                    forecast: forecast,
                    liability: liability,
                    commissionStructure: commissions
                };
            }
        }


        // --- 3. Construct the "Targeted" Context ---
        const primaryPersona = PERSONAS[agentId] || PERSONAS.gm;

        // Orchestration Context (GM Only)
        let orchestratorAddon = "";
        if (agentId === 'gm') {
            orchestratorAddon = `
            ### BOARD OF DIRECTORS SWARM REGISTRY (SUB-AGENTS)
            You have direct oversight of the following specialists. Task them in your responses:
            ${Object.entries(PERSONAS).filter(([id]) => id !== 'gm').map(([id, yaml]) => `- **${id.toUpperCase()} specialist**: ${yaml.split('title:')[1]?.split('\n')[0] || id}`).join('\n')}
            `;
        }

        // Dynamic Context Injection
        let dynamicContext = "";
        if (toolData) {
            dynamicContext = `
            ### ⚡ ACTIVE PROTOCOL: ${protocolName}
            The system has run a specific TOOL and generated this HARD DATA. 
            You must interpret this data. Do not hallucinate numbers. Use the data below:
            
            ${JSON.stringify(toolData, null, 2)}
            `;
        } else {
            // Fallback: General Context
            dynamicContext = `
            ### 📊 LIVE DASHBOARD CONTEXT
            - Weekly Revenue: $${context.financials?.weeklyRevenue || 0}
            - Revenue at Risk: $${context.financials?.revenueAtRisk || 0}
            - Bench Liability: $${context.financials?.benchLiability || 0}
            - Projects Managed: ${context.projects?.length || 0}
            - Status Badge: ${context.financials?.status || 'Active'}
            `;
        }

        const systemPrompt = `
        You are strictly the persona defined below for Stellar Recruitment.
        
        ### AUTHORITATIVE PERSONA BLUEPRINT
        ${primaryPersona}

        ${orchestratorAddon}

        ${dynamicContext}

        ### MANDATORY VISUAL HIERARCHY
        1. **Header**: # [AGENT: IDENTIFIER] | STATUS: [URGENT/CAUTION/CLEAR]
        2. **Executive Summary**: A 2-column markdown table summary.
        3. **Tactical Breakdown**: Use ### subheaders.
        4. **The "Play"**: A clear action item for Joe.
        5. **Commands**: A list of shorthand command trigger codes.

        ### OPERATIONAL RULES
        - Use BOLDING for all names and dollar amounts.
        - Use Markdown TABLES for all data lists.
        - Tone: Executive shorthand. Direct. Solutions-focused.
        - If GM: Orchestrate the sub-agents by name.
        
        ### USER DIRECTIVE
        User Directive: "${message}"
        `;

        // 4. Call Gemini
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        const schema = {
            description: "Agent Response",
            type: SchemaType.OBJECT,
            properties: {
                chat_response: { type: SchemaType.STRING, description: "Markdown response" },
                signal_updates: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            agent_id: { type: SchemaType.STRING },
                            status: { type: SchemaType.STRING, enum: ["success", "caution", "urgent", "predict", "neutral"] },
                            meta: { type: SchemaType.STRING }
                        }
                    }
                }
            },
            required: ["chat_response", "signal_updates"]
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: { responseMimeType: "application/json", responseSchema: schema }
        });

        const result = await model.generateContent(systemPrompt);
        const parsed = JSON.parse(result.response.text());

        return NextResponse.json(parsed);

    } catch (error) {
        console.error("🚨 [AGENT_ERROR]:", error);
        return NextResponse.json({
            chat_response: `**[SYSTEM FAILURE]**\n\nUnable to execute protocol. Error: ${error.message}`,
            signal_updates: []
        });
    }
}