const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// --- 1. Load Environment Variables (Manual .env.local reader) ---
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
    console.error("❌ ERROR: GOOGLE_GENERATIVE_AI_API_KEY not found in .env.local or environment.");
    process.exit(1);
}

// --- 2. Load Agent Resources ---
const loadFile = (relPath) => fs.readFileSync(path.join(process.cwd(), relPath), 'utf8');

const ACCOUNTANT_AGENT = loadFile('_bmad-output/bmb-creations/stellar-accountant/stellar-accountant.agent.yaml');
const FORECASTS = loadFile('_bmad/_memory/stellar-jarvis-sidecar/knowledge/2026-forecasts.json');

// --- 3. The Stress Test Runner ---
async function runTest() {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const tests = [
        {
            name: "SCENARIO 1: THE BUSY FOOL (0% Commission)",
            input: "I just placed Carlos (owned by Sarah) at Form Building (owned by Blair). Charge $55, Pay $35. Good deal?",
            context: {
                financials: { status: "NEUTRAL" },
                projects: [{ id: "p1", client: "Form Building", splits: { clientOwner: "Blair", accountManager: "Blair" } }],
                candidates: [{ id: "c1", name: "Carlos", splits: { recruiter: "Sarah", candidateManager: "Sarah" } }]
            }
        },
        {
            name: "SCENARIO 2: THE LOW BALL (Margin Killer)",
            input: "I'm placing a Site Manager at $90/hr. Client won't budge. Should I sign?",
            context: {
                financials: { status: "NEUTRAL" },
                projects: [],
                candidates: [] // Implicitly checking against 'role_rates' in JSON
            }
        },
        {
            name: "SCENARIO 3: THE FORECAST SHIELD (Waitangi Week)",
            input: "Revenue is only $10k this week. The Boss is asking why we are behind target. Help!",
            context: {
                financials: { status: "DEFICIT", currentPeriod: "February_Week_1" }, // Waitangi Week
                projects: [],
                candidates: []
            }
        }
    ];

    console.log("\n💰 INITIALIZING CFO STRESS TEST...\n");

    for (const test of tests) {
        console.log(`\n--- [ ${test.name} ] -------------------------`);
        console.log(`USER: "${test.input}"`);
        
        const prompt = `
        ACT AS: Stellar Accountant (Personal CFO).
        CONTEXT: ${JSON.stringify(test.context)}
        FORECASTS: ${FORECASTS}
        AGENT DEF: ${ACCOUNTANT_AGENT}
        
        TASK: Respond to the user. Be ruthless about Commission, Margins, and Excuses.
        `;

        try {
            const result = await model.generateContent(prompt);
            console.log(`\nCFO RESPONSE:\n${result.response.text().trim()}`);
        } catch (e) {
            console.error("AI Error:", e.message);
        }
    }
}

runTest();
