## **Implementation Plan \- Agent Swarm "Functional Core" Refactor**

### **Goal Description**

The current "Command Centre" suffers from a "Puppet Show" architecture where high-fidelity Agent Personas (YAML) are used primarily for narrative flair while the actual execution logic remains either dormant or trapped in deterministic frontend functions. This plan refactors the app/api/agent/route.js into a **Functional Swarm Router** that can execute specific protocols (Commission Audits, Squad Building, etc.) by bridging legacy deterministic logic with the LLM's reasoning.

### **User Review Required**

**IMPORTANT**

This refactor changes the core interaction model of the Command Centre. Agents will now explicitly state when they are running a "Protocol" (e.g., \[RR\] Redeployment Radar) and will output data-driven results instead of generic advice.

### **Proposed Changes**

#### **Core Logic Layer**

**\[CREATE\] services/logic-hub.js**

* **Central Brain:** Creates a logic hub to import and consolidate scattered logic files (construction-logic.js, growth-logic.js).  
* **Financial Logic:** Implements the missing calculateNCR function to deterministically calculate Net Commission Revenue using the 20/30/20/30 split rules.  
* **Protocol Router:** Exports a runProtocol function to switch between logic streams (Audit, Risk, Sales) based on user intent.

#### **Core API Layer**

**\[MODIFY\] app/api/agent/route.js**

* **Router Logic:** Updates the API to detect user intent (e.g., "Audit my deals") and call runProtocol *before* involving the LLM.  
* **Context Injection:** Instead of dumping raw database records, the API now injects the calculated *results* of the protocol into the system prompt.  
* **Persona Enforcement:** Updates the system prompt to instruct the LLM to prioritize the injected "Protocol Data" over its own hallucinations.

#### **Business Logic Stabilization**

**\[MODIFY\] stellar-accountant.agent.yaml** (Implicit via Logic Hub)

* *Note: We are effectively moving the math execution OUT of the YAML and INTO the LogicHub JavaScript. The YAML remains the "Personality," but the "Brain" is now code.*

### **Verification Plan**

#### **Automated Tests**

1. **Commission Audit Test:**  
   * curl test for the accountant: curl \-X POST ... \-d '{"message": "Audit my commissions", "agentId": "accountant"}' \-\> Verify response contains a table with exact NCR numbers calculated by JS.  
2. **Risk Radar Test:**  
   * curl test for candidate manager: curl \-X POST ... \-d '{"message": "Who is finishing soon?", "agentId": "candidate"}' \-\> Verify response lists candidates with daysUntilFinish \< 14\.

#### **Manual Verification**

1. Open Command Centre.  
2. Select **Accountant**.  
3. Type "Run a commission audit".  
4. Verify that the agent replies with a specific table showing "Busy Fool" or "Gold Mine" verdicts based on the logic rules.  
5. Verify the response is fast because the full database is not being sent to the LLM.

### ---

**Code Assets**

#### **1\. New File: services/logic-hub.js**

*(Copy and paste the code below)*

JavaScript

import { WORKFORCE\_MATRIX, getProjectSize, PHASE\_MAP } from './construction-logic.js';  
import { calculateReactivationScore, getGoldenHourTargets } from './growth-logic.js';

// \--- FINANCIAL LOGIC (The "Accountant" Brain) \---  
// Single Source of Truth for Commission Splits  
export const SPLIT\_RULES \= {  
    recruiter: 0.20,  
    candidateManager: 0.30,  
    clientOwner: 0.20,  
    accountManager: 0.30  
};

export function calculateNCR(dealData) {  
    // 1\. Calculate Weekly Margin  
    // Formula: (Charge \- (Pay \* 1.30)) \* Hours  
    const charge \= parseFloat(dealData.chargeRate) || 0;  
    const pay \= parseFloat(dealData.payRate) || 0;  
    const hours \= parseFloat(dealData.guaranteedHours) || 40;  
      
    // Burden is hardcoded to 1.30 (standard construction burden)  
    const margin \= (charge \- (pay \* 1.30)) \* hours;

    // 2\. Determine Ownership  
    // In a real app, these would be IDs. For now, we match strings or booleans passed from context.  
    const isRecruiter \= dealData.userIsRecruiter;   
    const isClientOwner \= dealData.userIsClientOwner;  
    const isAccountMgr \= dealData.userIsAccountMgr;

    // 3\. Calculate "The Split"  
    let commissionPct \= 0;  
    if (isRecruiter) commissionPct \+= SPLIT\_RULES.recruiter; // \+20%  
    // We assume Cand Mgr is someone else (Sarah) usually, so we don't add that 30%  
    if (isClientOwner) commissionPct \+= SPLIT\_RULES.clientOwner; // \+20%  
    if (isAccountMgr) commissionPct \+= SPLIT\_RULES.accountManager; // \+30%

    const ncr \= margin \* commissionPct;

    // 4\. Verdict  
    let verdict \= "STANDARD";  
    if (commissionPct \< 0.5) verdict \= "BUSY\_FOOL"; // User getting \< 50%  
    if (commissionPct \>= 0.7) verdict \= "GOLD\_MINE"; // User getting \> 70%

    return {  
        weeklyMargin: Math.round(margin),  
        userCommissionPct: commissionPct \* 100,  
        weeklyNCR: Math.round(ncr),  
        verdict: verdict,  
        splitBreakdown: {  
            recruiter: SPLIT\_RULES.recruiter,  
            candMgr: SPLIT\_RULES.candidateManager,  
            client: SPLIT\_RULES.clientOwner,  
            account: SPLIT\_RULES.accountManager  
        }  
    };  
}

// \--- LOGIC ROUTER (The API calls this) \---

export async function runProtocol(protocolName, contextData) {  
    console.log(\`\[LogicHub\] Running Protocol: ${protocolName}\`);

    switch (protocolName) {  
        case 'COMMISSION\_AUDIT':  
            // Filter for Active deals  
            const activeDeals \= contextData.candidates ? contextData.candidates.filter(c \=\> c.status \=== 'On Job') : \[\];  
            const auditResults \= activeDeals.map(deal \=\> {  
                // Defensive coding for missing nested objects  
                const financials \= deal.financials || {};  
                const splits \= deal.splits || {};  
                  
                return {  
                    candidateName: deal.name,  
                    client: deal.currentProject || "Unknown",  
                    ...calculateNCR({  
                        chargeRate: financials.chargeRate,  
                        payRate: financials.payRate,  
                        guaranteedHours: financials.guaranteedHours,  
                        // Mocking ownership logic \- assumes "Joe Ward" is the user  
                        userIsRecruiter: splits.recruiter \=== 'Joe Ward',  
                        userIsClientOwner: splits.clientOwner \=== 'Joe Ward',  
                        userIsAccountMgr: splits.accountManager \=== 'Joe Ward'  
                    })  
                };  
            });  
            return { type: 'AUDIT\_DATA', count: auditResults.length, data: auditResults };

        case 'GOLDEN\_HOUR':  
            // Uses growth-logic.js  
            const targets \= getGoldenHourTargets(contextData.clients || \[\], contextData.leads || \[\]);  
            return { type: 'TARGET\_LIST', count: targets.length, data: targets };

        case 'RECRUITMENT\_RISK':  
            // Uses construction-logic.js concepts  
            const candidates \= contextData.candidates || \[\];  
            const finishingSoon \= candidates.filter(c \=\> c.daysUntilFinish \!== null && c.daysUntilFinish \< 14 && c.daysUntilFinish \>= 0);  
            const visaRisks \= candidates.filter(c \=\>   
                (c.compliance?.visa && (c.compliance.visa.includes('Expire') || c.compliance.visa.includes('Check')))  
            );  
              
            return {  
                type: 'RISK\_REPORT',  
                data: {  
                    finishingCount: finishingSoon.length,  
                    visaRiskCount: visaRisks.length,  
                    details: finishingSoon.map(c \=\> \`${c.name} (${c.role}) ends in ${c.daysUntilFinish} days.\`)  
                }  
            };

        default:  
            return null;  
    }  
}

#### **2\. Modified File: app/api/agent/route.js**

*(Replace entire file content with this code)*

JavaScript

import { NextResponse } from 'next/server';  
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";  
import fs from 'fs';  
import path from 'path';  
import { runProtocol } from '../../../services/logic-hub.js'; 

// \--- LOAD PERSONAS (Cached) \---  
const AGENT\_DIR \= path.join(process.cwd(), '\_bmad-output/bmb-creations');

const loadFile \= (relPath) \=\> {  
    try {  
        const fullPath \= path.join(process.cwd(), relPath);  
        if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, 'utf8');  
        return "";  
    } catch (e) { return ""; }  
};

const PERSONAS \= {  
    gm: loadFile(path.join(AGENT\_DIR, 'stellar-gm/stellar-gm.agent.yaml')),  
    accountant: loadFile(path.join(AGENT\_DIR, 'stellar-accountant/stellar-accountant.agent.yaml')),  
    sales: loadFile(path.join(AGENT\_DIR, 'stellar-sales-lead/stellar-sales-lead.agent.yaml')),  
    candidate: loadFile(path.join(AGENT\_DIR, 'stellar-candidate-mgr/stellar-candidate-mgr.agent.yaml')),  
};

export async function POST(request) {  
    try {  
        // 1\. Parse Input  
        const { message, agentId \= 'gm', context } \= await request.json();  
        const userQuery \= message.toLowerCase();

        // 2\. DETERMINE INTENT & RUN PROTOCOLS (The "Pre-Flight" Check)  
        let protocolData \= null;  
        let protocolName \= null;

        // A. Explicit Accountant Trigger  
        if (agentId \=== 'accountant' || userQuery.includes('audit') || userQuery.includes('commission') || userQuery.includes('ncr')) {  
            protocolName \= 'COMMISSION\_AUDIT';  
            // We pass the frontend 'context' which contains the full 'candidates' list  
            protocolData \= await runProtocol('COMMISSION\_AUDIT', context);   
        }  
          
        // B. Explicit Sales Trigger  
        else if (agentId \=== 'sales' || userQuery.includes('golden hour') || userQuery.includes('call list')) {  
            protocolName \= 'GOLDEN\_HOUR';  
            protocolData \= await runProtocol('GOLDEN\_HOUR', context);  
        }

        // C. Explicit Candidate Trigger  
        else if (agentId \=== 'candidate' || userQuery.includes('visa') || userQuery.includes('expire') || userQuery.includes('finish') || userQuery.includes('risk')) {  
            protocolName \= 'RECRUITMENT\_RISK';  
            protocolData \= await runProtocol('RECRUITMENT\_RISK', context);  
        }

        // 3\. Construct the "Targeted" System Prompt  
        // We do NOT dump the whole DB. We dump the Protocol Result.  
          
        const primaryPersona \= PERSONAS\[agentId\] || PERSONAS.gm;  
          
        let dynamicContext \= "";  
          
        if (protocolData) {  
            dynamicContext \= \`  
            \#\#\# ⚡ ACTIVE PROTOCOL: ${protocolName}  
            The system has pre-calculated the following HARD DATA. You must interpret this data, not invent it.  
              
            ${JSON.stringify(protocolData, null, 2)}  
              
            INSTRUCTION: Present this data in a markdown table using the styles defined in your visual\_standards.  
            If the data verdict is "BUSY\_FOOL", you must reprimand the user for Low NCR.  
            \`;  
        } else {  
            // Fallback: General Context (Briefing Mode)  
            // We provide high-level summaries only to save context window  
            dynamicContext \= \`  
            \#\#\# 📊 LIVE DASHBOARD CONTEXT  
            \- Weekly Revenue: $${context.financials?.weeklyRevenue || 0} (Status: ${context.financials?.status})  
            \- Active Projects: ${context.projects?.length || 0}  
            \- Critical Risks: ${context.criticalRisks?.length || 0}  
            \- Current Period: ${context.financials?.currentPeriod || "Unknown"}  
            \`;  
        }

        const systemPrompt \= \`  
        You are strictly the persona defined below.  
          
        \#\#\# AUTHORITATIVE PERSONA  
        ${primaryPersona}

        ${dynamicContext}

        \#\#\# OPERATIONAL RULES  
        1\. If "Protocol Data" is present, YOU MUST USE IT. Do not hallucinate numbers.  
        2\. If the Protocol Data shows a "BUSY\_FOOL" verdict, use your "Busy Fool" catchphrase.  
        3\. Format all tables using the 'visual\_standards' in your YAML.  
          
        \#\#\# USER DIRECTIVE  
        "${message}"  
        \`;

        // 4\. Call Gemini  
        const apiKey \= process.env.GOOGLE\_GENERATIVE\_AI\_API\_KEY;  
        const genAI \= new GoogleGenerativeAI(apiKey);  
          
        const schema \= {  
            description: "Agent Response",  
            type: SchemaType.OBJECT,  
            properties: {  
                chat\_response: { type: SchemaType.STRING, description: "Markdown response" },  
                signal\_updates: {  
                    type: SchemaType.ARRAY,  
                    items: {  
                        type: SchemaType.OBJECT,  
                        properties: {  
                            agent\_id: { type: SchemaType.STRING },  
                            status: { type: SchemaType.STRING, enum: \["success", "caution", "urgent", "predict", "neutral"\] },  
                            meta: { type: SchemaType.STRING }  
                        }  
                    }  
                }  
            },  
            required: \["chat\_response", "signal\_updates"\]  
        };

        const model \= genAI.getGenerativeModel({  
            model: "gemini-2.0-flash-exp",  
            generationConfig: { responseMimeType: "application/json", responseSchema: schema }  
        });

        const result \= await model.generateContent(systemPrompt);  
        const parsed \= JSON.parse(result.response.text());  
          
        return NextResponse.json(parsed);

    } catch (error) {  
        console.error("Agent Error:", error);  
        return NextResponse.json({  
            chat\_response: \`\*\*\[SYSTEM FAILURE\]\*\*\\n\\nUnable to execute protocol. Error: ${error.message}\`,  
            signal\_updates: \[\]  
        });  
    }  
}  
