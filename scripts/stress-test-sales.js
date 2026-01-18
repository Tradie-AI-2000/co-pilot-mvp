const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// --- Load Env & Key ---
const loadEnv = () => {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) process.env[key.trim()] = value.trim();
            });
        }
    } catch (e) {}
};
loadEnv();
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

// --- Load Resources ---
const loadFile = (relPath) => fs.readFileSync(path.join(process.cwd(), relPath), 'utf8');
const SALES_AGENT = loadFile('_bmad-output/bmb-creations/stellar-sales-lead/stellar-sales-lead.agent.yaml');

// --- Test Runner ---
async function runTest() {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const tests = [
        {
            name: "SCENARIO 1: GLENGARRY PROTOCOL (Ghost Clients)",
            input: "I need leads. Who should I call?",
            context: {
                clients: [
                    { id: "c1", name: "Big Construction Ltd", status: "Inactive", lastProjectDate: "2025-06-01", totalSpend: 500000 },
                    { id: "c2", name: "Small Fry Inc", status: "Active", lastProjectDate: "2026-01-01", totalSpend: 5000 }
                ]
            }
        },
        {
            name: "SCENARIO 2: SNIPER PITCH",
            input: "Draft a pitch for Carlos (Carpenter) to send to Form Building for their Structure phase.",
            context: {
                candidates: [{ id: "cand1", name: "Carlos", role: "Carpenter", skills: ["Formwork", "Framing"] }],
                projects: [{ id: "p1", client: "Form Building", currentPhase: "Structure" }]
            }
        },
        {
            name: "SCENARIO 3: MONDAY MORNING QB (Roast)",
            input: "How did I do last week?",
            context: {
                activityLogs: Array(20).fill({ type: 'call' }) // Only 20 calls
            }
        },
        {
            name: "SCENARIO 4: GOLDEN HOUR KILL LIST",
            input: "It's 8am. What do I do?",
            context: {
                // Implicit Golden Hour context via instruction
            }
        }
    ];

    console.log("\n🎯 INITIALIZING SALES WOLF STRESS TEST...\n");

    for (const test of tests) {
        console.log(`\n--- [ ${test.name} ] -------------------------`);
        console.log(`USER: "${test.input}"`);

        const prompt = `
        ACT AS: Stellar Sales Lead (The Wolf of Wall Street).
        AGENT DEF: ${SALES_AGENT}
        CONTEXT: ${JSON.stringify(test.context)}
        
        TASK: Respond to the user with high energy and actionable sales plays.
        `;

        try {
            const result = await model.generateContent(prompt);
            console.log(`\nRESPONSE:\n${result.response.text().trim()}`);
        } catch (e) {
            console.error("AI Error:", e.message);
        }
    }
}

runTest();
