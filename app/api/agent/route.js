import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Import All Tools (Now including searchConstructionNews)
import {
    analyzeSystemHealth,
    calculateBenchLiability,
    identifyRainmakerTargets,
    auditCommissions,
    analyzeMarginHealth,
    generateFinancialForecast,
    matchmakeGhostTown,
    identifyRedeploymentRisks,
    scoutBench,
    searchConstructionNews
} from '../../../lib/tools.js';

// =========================================================
// 🕵️ SMART FILE LOADER
// =========================================================
const findAgentFile = (filename) => {
    const possiblePaths = [
        path.join(process.cwd(), filename),
        path.join(process.cwd(), 'agents', filename),
        path.join(process.cwd(), 'lib', 'agents', filename),
        path.join(process.cwd(), '_bmad-output', 'bmb-creations', filename.replace('.yaml', ''), filename)
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
    }
    return null;
};

// 🛡️ FALLBACK BRAIN
const FALLBACK_SCOUT = `
title: The Scout (Fallback)
description: Talent Acquisition Specialist.
system_prompt: |
  You are THE SCOUT.
  Goal: Find available candidates OR Intel.
  Tone: Military-style reporting.
`;

// =========================================================
// 🧠 LOAD PERSONAS
// =========================================================
const PERSONAS = {
    gm: findAgentFile('stellar-executive.agent.yaml') || findAgentFile('stellar-gm.agent.yaml'),
    scout: findAgentFile('stellar-scout.agent.yaml') || FALLBACK_SCOUT,
    sales: findAgentFile('stellar-sales-lead.agent.yaml'),
    accountant: findAgentFile('stellar-accountant.agent.yaml'),
    candidate: findAgentFile('stellar-candidate-mgr.agent.yaml'),
};

// --- HELPER: Run a Sub-Agent ---
async function runSubAgent(agentId, instruction, context, apiKey) {
    console.log(`🤖 WAKING SUB-AGENT: ${agentId}`);

    const id = agentId.toLowerCase();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // 🛑 SCOUT INTELLIGENCE OVERRIDE
    if (id === 'scout') {
        let specializedContext = "";

        // CHECK INTENT: Recruitment (Internal) vs Espionage (External)
        const isRecruitment = /find\s+(?:a|an)?\s*(candidate|carpenter|hammerhand|staff|worker|labourer|sparky)/i.test(instruction);

        if (isRecruitment) {
            // --- MODE A: RECRUITMENT ---
            let targetRole = instruction
                .replace(/^(find|get|search\s+for|show|locate)\s+(me\s+)?(an?|the\s+)?(available\s+)?/i, '')
                .split('.')[0].trim();

            if (!targetRole) targetRole = "General";

            const scanResults = scoutBench(context, { role: targetRole });

            specializedContext = `
            [SYSTEM DATA: INTERNAL DB SCAN]
            QUERY: ${targetRole}
            RESULTS: ${scanResults.found} matches.
            DATA: ${JSON.stringify(scanResults.candidates)}
            `;
        } else {
            // --- MODE B: ESPIONAGE ---
            const searchResults = searchConstructionNews(instruction);

            specializedContext = `
            [SYSTEM DATA: EXTERNAL WEB INTELLIGENCE]
            QUERY: "${instruction}"
            SOURCE: Simulated Construction News Feed
            
            👇 CLASSIFIED INTEL FOUND:
            ${JSON.stringify(searchResults.results, null, 2)}
            `;
        }

        const strictPrompt = `
        You are the SCOUT AGENT (Head of Intelligence).
        ${specializedContext}
        
        ### ⚡ MISSION ORDER
        DIRECTIVE: "${instruction}"
        
        🛑 EXECUTION RULES:
        1. Do NOT simulate the search. The data is provided above.
        2. If this is recruitment data, output a Candidate Table.
        3. If this is News/Intel, output a "SITREP" (Strategic Situation Report).
        `;

        try {
            const result = await model.generateContent(strictPrompt);
            return result.response.text();
        } catch (e) {
            return `[Scout Reporting Error: ${e.message}]`;
        }
    }

    // --- STANDARD LOGIC FOR OTHER AGENTS ---
    const persona = PERSONAS[id];
    if (!persona) return `[SYSTEM ERROR: Agent '${id}' file not found.]`;

    const prompt = `
    ${persona}
    ### ⚡ MISSION ORDER
    DIRECTIVE: "${instruction}"
    REPORT BACK IMMEDIATELY.
    Start with: "🫡 **${id.toUpperCase()} REPORTING:**"
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        return `[${id} crashed: ${e.message}]`;
    }
}

export async function POST(request) {
    try {
        const { message, agentId = 'gm', context = {} } = await request.json();
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        const nudges = context.moneyMoves || [];
        const ghostTowns = nudges.filter(n => n.title?.includes('GHOST TOWN') || n.priority === 'CRITICAL');
        const rainmakers = nudges.filter(n => n.type === 'PRE_EMPTIVE_STRIKE');

        const riskReport = `
        ### 🚨 OPERATIONAL ALERT FEED:
        ${ghostTowns.length > 0 ? `🔥 CRITICAL: ${ghostTowns.length} Ghost Towns` : "✅ Ops Clear"}
        ${rainmakers.length > 0 ? `💰 RAINMAKER: ${rainmakers.length} Targets` : "✅ Sales Clear"}
        `;

        let toolData = null;
        if (message.toLowerCase().includes('match') || message.toLowerCase().includes('ghost')) {
            toolData = matchmakeGhostTown(context, 'General');
        }

        const primaryPersona = PERSONAS[agentId] || PERSONAS.gm || "You are the Executive Agent.";

        const delegationInstructions = `
        ### 🔗 CHAIN OF COMMAND PROTOCOL
        To delegate work, use this exact invisible tag:
        
        |||DELEGATE:scout|instruction|||
        
        **VALID AGENTS:** 'scout', 'sales', 'accountant'.
        **NEVER** use 'agent_id'. 
        `;

        const systemPrompt = `
        ${primaryPersona}
        ${riskReport}
        ${delegationInstructions}
        
        ${toolData ? `### ⚡ HARD DATA: ${JSON.stringify(toolData)}` : ''}

        User Directive: "${message}"
        `;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent(systemPrompt);
        let finalResponse = result.response.text();

        const delegationRegex = /\|\|\|DELEGATE:(\w+)\|(.*?)\|\|\|/;
        const match = finalResponse.match(delegationRegex);
        let subAgentReport = "";

        if (match) {
            const [fullTag, subAgentId, instruction] = match;
            finalResponse = finalResponse.replace(fullTag, `\n\n*📡 Transmitting order to ${subAgentId.toUpperCase()}...*`);
            subAgentReport = await runSubAgent(subAgentId, instruction, context, apiKey);
        }

        return NextResponse.json({
            chat_response: subAgentReport ? `${finalResponse}\n\n---\n${subAgentReport}` : finalResponse
        });

    } catch (error) {
        console.error("🚨 [AGENT_ERROR]:", error);
        return NextResponse.json({ chat_response: `Error: ${error.message}` });
    }
}