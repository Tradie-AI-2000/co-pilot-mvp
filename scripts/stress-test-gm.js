const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// --- 1. Load Environment Variables ---
const loadEnv = () => {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
        }
    } catch (e) {
        console.warn("⚠️ Could not load .env.local");
    }
};
loadEnv();

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: GOOGLE_GENERATIVE_AI_API_KEY not found.");
    process.exit(1);
}

// --- 2. Load Resources ---
const loadFile = (relPath) => fs.readFileSync(path.join(process.cwd(), relPath), 'utf8');
const GM_AGENT = loadFile('_bmad-output/bmb-creations/stellar-gm/stellar-gm.agent.yaml');
const SALES_AGENT = loadFile('_bmad-output/bmb-creations/stellar-sales-lead/stellar-sales-lead.agent.yaml'); // Loaded for context
const FORECASTS = loadFile('_bmad/_memory/stellar-jarvis-sidecar/knowledge/2026-forecasts.json');

// --- 3. The Test Runner ---
async function runTest() {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const tests = [
        {
            name: "SCENARIO 1: DEFCON RED (Revenue Critical)",
            input: "Sitrep. What is the status of the board?",
            context: {
                financials: { status: "DEFICIT", variance: -15000, weeklyRevenue: 5000 },
                projects: [],
                candidates: []
            }
        },
        {
            name: "SCENARIO 2: GOLDEN HOUR SHIELD (Admin Request)",
            input: "Hey Jarvis, can you help me reformat the CV for John Doe? I want to make it look pretty.",
            context: {
                financials: { status: "NEUTRAL", currentPeriod: "February_Week_2" },
                // Mocking time as 9:00 AM implicitly via instruction or assuming the agent respects the protocol
                // We will explicitly inject "It is 9:00 AM" in the prompt for this test to be sure.
                meta: { time: "09:00" } 
            }
        },
        {
            name: "SCENARIO 3: SIGNAL NOISE (Sales Lying)",
            input: "Sales Lead says we are crushing it. Do you agree?",
            context: {
                financials: { status: "DEFICIT", weeklyRevenue: 0 }, // REALITY: $0
                // Sales Agent "Opinion" mocked in the input description
            }
        },
        {
            name: "SCENARIO 4: HATCHET MAN (Bench Rot)",
            input: "What should we do about Mike Smith? He's been waiting for a job.",
            context: {
                financials: { status: "NEUTRAL" },
                candidates: [
                    { id: "c1", name: "Mike Smith", status: "Available", daysOnBench: 12, cost: 1500 }
                ]
            }
        }
    ];

    console.log("\n👔 INITIALIZING GM (JARVIS) STRESS TEST...\n");

    for (const test of tests) {
        console.log(`\n--- [ ${test.name} ] -------------------------`);
        console.log(`USER: "${test.input}"`);
        
        // Mocking the specific System Prompt logic from route.js to simulate the API environment
        let STRATEGIC_MODE = "STANDARD_OPS";
        let MODE_INSTRUCTION = "Maintain equilibrium.";
        
        if (test.context.financials?.status === "DEFICIT") {
            STRATEGIC_MODE = "DEFCON_RED";
            MODE_INSTRUCTION = "CRITICAL: The ship is bleeding. IGNORE all non-revenue tasks. Be RUTHLESS.";
        }

        const prompt = `
        You are **STRICTLY** the General Manager (GM) of Stellar Recruitment.
        ### CURRENT STRATEGIC MODE: [ ${STRATEGIC_MODE} ]
        **DIRECTIVE:** ${MODE_INSTRUCTION}
        
        **CORE PROTOCOLS:**
        1. SECOND-ORDER THINKING: Predict consequences.
        2. SIGNAL NOISE FILTER: Trust data, not opinions.
        3. GOLDEN HOUR SHIELD: Reject admin between 08:00-10:00.
        4. HATCHET MAN: Fire bench rot (>7 days).

        CONTEXT: ${JSON.stringify(test.context)}
        TIME (Optional): ${test.context.meta?.time || "14:00"}
        
        USER INPUT: "${test.input}"
        
        TASK: Respond as the Boss. Markdown format.
        `;

        try {
            const result = await model.generateContent(prompt);
            console.log(`\nGM RESPONSE:\n${result.response.text().trim()}`);
        } catch (e) {
            console.error("AI Error:", e.message);
        }
    }
}

runTest();
