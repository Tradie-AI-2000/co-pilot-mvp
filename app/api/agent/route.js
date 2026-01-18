import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// --- 1. Load Static Knowledge Bases (Cached outside handler) ---
const loadFile = (relPath) => {
    try {
        const fullPath = path.join(process.cwd(), relPath);
        if (fs.existsSync(fullPath)) {
            return fs.readFileSync(fullPath, 'utf8');
        }
        console.warn(`[AgentAPI] ⚠️ File not found: ${relPath}`);
        return "";
    } catch (e) {
        console.error(`[AgentAPI] Error loading ${relPath}:`, e);
        return "";
    }
};

// Load Context Files
const FORECASTS = loadFile('_bmad/_memory/stellar-jarvis-sidecar/knowledge/2026-forecasts.json');
const BOARD_MINUTES = loadFile('_bmad/_memory/stellar-board/board-minutes.md');
const ARCHITECTURE = loadFile('expert-agent-architecture.md');
const TRADE_LOGIC = loadFile('services/construction-logic.js');

// Load Agent Personas
const AGENT_DIR = path.join(process.cwd(), '_bmad-output/bmb-creations/stellar-board/agents');
const AGENTS = {
    gm: loadFile(path.join(AGENT_DIR, 'stellar-gm/stellar-gm.agent.yaml')),
    accountant: loadFile(path.join(AGENT_DIR, 'stellar-accountant/stellar-accountant.agent.yaml')),
    sales: loadFile(path.join(AGENT_DIR, 'stellar-sales-lead/stellar-sales-lead.agent.yaml')),
    candidate: loadFile(path.join(AGENT_DIR, 'stellar-candidate-mgr/stellar-candidate-mgr.agent.yaml')),
    immigration: loadFile(path.join(AGENT_DIR, 'stellar-immigration/stellar-immigration.agent.yaml')),
    it: loadFile(path.join(AGENT_DIR, 'stellar-systems-it/stellar-systems-it.agent.yaml')),
};

export async function POST(request) {
    try {
        const { message, agentId, context } = await request.json();

        // --- DEBUG: LOG DATA RECEPTION ---
        console.log("🟢 [AGENT API] Context Received:");
        console.log(`   - Financials: ${context?.financials ? 'YES' : 'NO'}`);
        console.log(`   - Projects: ${context?.projects?.length || 0} items`);
        console.log(`   - Candidates: ${context?.candidates?.length || 0} items`);
        console.log(`   - Forecast Data Loaded: ${FORECASTS.length > 0 ? 'YES' : 'NO'} (${FORECASTS.length} chars)`);
        // ---------------------------------

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

        const genAI = new GoogleGenerativeAI(apiKey);

        // --- 2. DEFINE THE SCHEMA ---
        const schema = {
            description: "Command Centre Executive Response",
            type: SchemaType.OBJECT,
            properties: {
                chat_response: { type: SchemaType.STRING, description: "The strategic advice for Joe." },
                delegation_log: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "Log of which sub-agents were consulted."
                },
                signal_updates: {
                    type: SchemaType.ARRAY,
                    description: "Updates for the Zone B Signal Cards.",
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            agent_id: { type: SchemaType.STRING },
                            status: { type: SchemaType.STRING, enum: ["success", "caution", "urgent", "predict", "neutral"] },
                            meta: { type: SchemaType.STRING }
                        }
                    }
                },
                nudge_trigger: {
                    type: SchemaType.OBJECT,
                    description: "Optional: Create a new card in the Focus Feed.",
                    properties: {
                        title: { type: SchemaType.STRING },
                        type: { type: SchemaType.STRING, enum: ["risk", "urgent", "lead", "info"] },
                        description: { type: SchemaType.STRING }
                    }
                }
            },
            required: ["chat_response", "signal_updates"]
        };

        // --- 3. CONSTRUCT PROMPT (UPDATED WITH LOGIC & PROTOCOLS) ---
        const systemPrompt = `
        You are the **Stellar GM (General Manager)**, orchestrating the 'stellar-board' swarm.
        
        ### 1. THE BOARDROOM CONTEXT
        You are sitting in the Command Centre. The user has provided a live data snapshot below.
        
        <LIVE_DATA>
        ${JSON.stringify(context || {}, null, 2)}
        </LIVE_DATA>

        ### 2. YOUR RESOURCES
        - **Forecasts (The Bible):** ${FORECASTS}
        - **Trade Logic:** ${TRADE_LOGIC} (Use this for S/M/L/XL sizing and Phase Logic).
        - **Minutes:** ${BOARD_MINUTES}
        - **Architecture:** ${ARCHITECTURE}

        ### 3. YOUR BOARD MEMBERS (The Agents)
        ${Object.entries(AGENTS).map(([k, v]) => `--- AGENT: ${k.toUpperCase()} ---\n${v}`).join('\n')}

        ### 4. OPERATIONAL RULES
        - **Hypothetical Override:** If the user starts a prompt with "Assume", "Imagine", or "It is [Date]", prioritize that input over <LIVE_DATA> for the analysis.
        - **Seasonality Check:** Look at \`context.financials.currentPeriod\` (e.g., "January_Week_1"). 
        - Lookup this key in \`FORECASTS.calendar_events\` or \`FORECASTS.monthly_seasonality\`.
          - If a 'risk_factor' or 'impact' exists, ADJUST the revenue target accordingly before declaring a "Deficit."
        - **Data Hierarchy:** 1. **User Hypotheticals** (Highest Priority for analysis).
            2. **<LIVE_DATA>** (Trusted for current status reporting).
            3. **Forecasts** (The baseline for targets/benchmarks).
        - **Financial Audits:** When analyzing rates, ALWAYS compare the User's stated rate against the 'role_rates' in the Forecasts JSON.
        - **Project Sizing:** Use the 'sizeClass' field in projects (S/M/L/XL) to determine headcount needs (Squads vs Individuals).
        - **Strategic Honesty:** If criteria aren't met, state it clearly.
        - **Brevity Protocol:** Use bullet points. Be ruthless.
        - **Squad Grouping:** If a match yields more than 3 candidates for a single role, do NOT list all names. Group them as a "Squad" (e.g., "**Squad of 26 Carpenters** available"). Only list specific names for scarce/specialist roles (e.g., Excavator Operators, Site Managers).
        
        ### 5. EMAIL DRAFTING PROTOCOL (THE "SPEAR-FISHING" METHOD)
        If asked to draft an email, YOU MUST follow this high-status structure:
        1.  **Subject Line:** Urgent & Specific (e.g., "First Refusal: [Role] for [Project]").
        2.  **The Context:** State the **CURRENT** phase from data. If pitching a trade for a *future* phase, acknowledge that (e.g., "...planning ahead for Structure").
        3.  **The "Proof of Life" (MANDATORY):** You MUST list the candidate's specific compliance data from the <LIVE_DATA> if available:
            - Visa Status (e.g., "Open Work Visa")
            - Site Safe Expiry (e.g., "Valid until 2026")
            - Residency Status
        4.  **The "Why":** Connect their specific skill to the project's scale (XL/M/S).
        5.  **The Close:** "Yes/No" on sending the CV.
        
        **Constraint:** Use the 'manager' name from data. Do not use generic greetings if a name exists.

        ### 6. TASK
        User Input: "${message}"
        
        Analyze the <LIVE_DATA> specifically. Do not hallucinate. Generate Response.
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const result = await model.generateContent(systemPrompt);
        return NextResponse.json(JSON.parse(result.response.text()));

    } catch (error) {
        console.error("Agent API Error:", error);
        return NextResponse.json({
            chat_response: "System Error: " + error.message,
            signal_updates: []
        });
    }
}