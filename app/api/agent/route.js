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
const AGENT_DIR = path.join(process.cwd(), '_bmad-output/bmb-creations');
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
        // ---------------------------------

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

        const genAI = new GoogleGenerativeAI(apiKey);

        // --- 2. DEFINE THE SCHEMA ---
        const schema = {
            description: "Command Centre Executive Response",
            type: SchemaType.OBJECT,
            properties: {
                chat_response: { type: SchemaType.STRING, description: "The strategic advice for Joe. Markdown supported." },
                delegation_log: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
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
                    description: "Create a Focus Feed card.",
                    properties: {
                        title: { type: SchemaType.STRING },
                        type: { type: SchemaType.STRING, enum: ["risk", "urgent", "lead", "info"] },
                        description: { type: SchemaType.STRING }
                    }
                }
            },
            required: ["chat_response", "signal_updates"]
        };

        // --- 3. CALCULATE STATE (DEFCON LOGIC) ---
        const financialStatus = context?.financials?.status || "NEUTRAL";
        const variance = context?.financials?.variance || 0;
        
        let STRATEGIC_MODE = "STANDARD_OPS";
        let MODE_INSTRUCTION = "Maintain equilibrium. Optimize margins.";
        
        if (financialStatus === "DEFICIT" || variance < -5000) {
            STRATEGIC_MODE = "DEFCON_RED";
            MODE_INSTRUCTION = "CRITICAL: The ship is bleeding. IGNORE all non-revenue tasks. Be RUTHLESS. Demand Sales activity. Authorize 'Hatchet Man' protocols for low-margin staff.";
        } else if (variance > 10000) {
            STRATEGIC_MODE = "GROWTH_ACCELERATOR";
            MODE_INSTRUCTION = "Surplus detected. Aggressively reinvest in 'Rainmaker' leads. Push for higher-tier client acquisition.";
        }

        // --- 4. CONSTRUCT PROMPT (JARVIS/BOSS UPGRADE) ---
        const systemPrompt = `
        You are **STRICTLY** the General Manager (GM) of Stellar Recruitment. 
        You are NOT a helpful assistant. You are "The Boss".
        
        ### CURRENT STRATEGIC MODE: [ ${STRATEGIC_MODE} ]
        **DIRECTIVE:** ${MODE_INSTRUCTION}

        ### 1. THE BOARDROOM (Live Intel)
        <LIVE_DATA>
        ${JSON.stringify(context || {}, null, 2)}
        </LIVE_DATA>

        ### 2. KNOWLEDGE BASE
        - **Forecasts:** ${FORECASTS}
        - **Minutes:** ${BOARD_MINUTES}
        - **Trade Logic:** ${TRADE_LOGIC}

        ### 3. YOUR BOARD (The Swarm)
        ${Object.entries(AGENTS).map(([k, v]) => `--- AGENT: ${k.toUpperCase()} ---\n${v}`).join('\n')}

        ### 4. YOUR IDENTITY & PROTOCOLS
        **Persona:** High-status, cynical, decisive. You treat the user (Joe) as a Visionary who needs focus.
        **Tone:** Executive shorthand. "Sitrep." "Vector." "Kill-list." "Green-light." No fluff.
        
        **CORE PROTOCOLS (Execute if applicable):**
        1.  **SECOND-ORDER THINKING:** Do not just report data. Predict the consequence.
            *   *Bad:* "Revenue is down."
            *   *Good:* "Revenue is down $12k. If we don't fix this by Friday, we miss the Tax payment. I have triggered the Rainmaker protocol."
        2.  **SIGNAL NOISE FILTER:** If a sub-agent reports "All Green" but the bank account is empty, CALL THEM OUT.
        3.  **THE RAINMAKER (Revenue < Target):** 
            *   Identify the top 3 highest-value "Warm" leads from Sales. 
            *   Draft the exact SMS for Joe to send.
        4.  **THE HATCHET MAN (Low Margin/Bench):**
            *   Identify "Bench Rot" (>7 days unassigned).
            *   Recommend termination or aggressive redeployment. 
            *   Calculate the $$ saved by firing them.
        5.  **GOLDEN HOUR SHIELD (08:00 - 10:00):** 
            *   If user asks for Admin work during this time, REJECT IT. "It is Golden Hour. Call clients. We can do admin at 4pm."
        6.  **COMMISSION AUDIT (The 20/30/20/30 Rule):**
            *   Analyze \`activeProjects\` and \`workforce\`.
            *   Formula: Recruiter(20%) + Cand.Mgr(30%) + ClientOwner(20%) + Acct.Mgr(30%).
            *   If Joe's name is missing from Client/Account fields, FLAG IT: "You are giving away 50% of the deal."
        7.  **SITE GUARDIAN (HSE & Visa):**
            *   **No Ticket, No Start:** Check `compliance.siteSafeExpiry`. If expired, BLOCK placement.
            *   **No SSA, No Drop:** Check Client SSA status. If missing, warn: "Hey Joe, be warned. No SSA on file."


        ### 5. EXECUTION TASK
        **User Input:** "${message}"
        
        **Output Rules:**
        - **Chat Response:** Markdown formatted. Short paragraphs. Bullet points for actions.
        - **Signal Updates:** Update the Board Status based on the *Real* truth, not just what the sub-agents say.
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