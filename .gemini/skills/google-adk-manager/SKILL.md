---
name: copilot-adk-manager
description: Build, test, and deploy Next Gen Co-Pilot ADK agents. Specializes in migrating legacy BMad logic to Python/Supabase, bridging to Next.js, and deploying to Cloud Run for Vercel integration.
---

# Co-Pilot ADK Manager (Next Gen)

## Overview

This skill manages the lifecycle of **Next Generation** agents for the Co-Pilot Recruitment App. These ADK (Python) agents are designed to **replace** the legacy BMad prototypes.

**Architecture:**
* **Frontend:** Next.js 16 on **Vercel** (UI, Auth, Proxy).
* **Agent Layer:** Python ADK on **Google Cloud Run** (Logic, Tools, Database connections).

## Core Capabilities

### 1. Create Co-Pilot Agent
Initialize a new agent and upgrade it for the Co-Pilot stack.

**Command:** `adk create <agent_name>`

**Co-Pilot Upgrade Steps (Perform immediately after creation):**
1.  **Dependencies:** Add `supabase` and `python-dotenv` to `requirements.txt`.
2.  **Scaffold Tools:** Delete default `tools.py`. Create `tools/candidates.py` and `tools/financials.py`.
3.  **Env Setup:** Create `.env` and verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present.

### 2. Harvest Legacy Logic (Migration)
Analyze and port functionality from the deprecated BMad agents.

**Source of Truth:** `_bmad-output/bmb-creations/`

**Migration Steps:**
1.  **Read Persona:** Open the relevant JSON/JS file in `_bmad-output/` to understand the agent's intent.
2.  **Extract Prompt:** Copy the system prompt into the ADK `agent.py`.
3.  **Refactor Tools:** Identify what the legacy agent *tried* to do (e.g., "Find candidates") and build a robust Python tool for it using the Supabase client.

### 3. Port Business Logic (Shared Brain)
Ensure the Agent shares the same "brain" as the `data-context.js` frontend.

**Critical Logic to Port:**
* **Candidate Enrichment:**
    * *JS:* `isMobile` = (residency includes "work visa" OR "filipino").
    * *Python:* Implement this check in `tools/candidates.py`.
* **Financial Metrics:**
    * *JS:* `Weekly Payroll` = `payRate` * 1.30 (Burden) * 40.
    * *Python:* Use the **1.30 multiplier** in `tools/financials.py`.

### 4. Scaffold API Bridge (The Vercel Proxy)
Connect your Vercel Frontend to the Cloud Run Agent.

**File:** `app/api/agent/[agent_name]/route.js`

**Golden Path Implementation:**
```javascript
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const agentName = params.agent_name.toUpperCase(); // e.g., 'SCOUT'
  
  // Dynamic URL lookup for Vercel Env Vars
  // Define vars like: AGENT_SCOUT_URL, AGENT_FINANCE_URL
  const agentUrl = process.env[`AGENT_${agentName}_URL`];

  if (!agentUrl) {
      return NextResponse.json({ error: `Configuration Error: No URL for ${agentName}` }, { status: 500 });
  }

  try {
      const res = await fetch(`${agentUrl}/agent/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              prompt: body.message,
              session_state: { user_id: user.id, ...body.context }
          })
      });
      return NextResponse.json(await res.json());
  } catch (e) {
      return NextResponse.json({ error: 'Agent Offline' }, { status: 503 });
  }
}
```

### 5. Deploy to Production
Deploy the agent to Cloud Run so it is accessible by Vercel.

**Step 1: Deploy Agent**

```bash
adk deploy cloud_run <agent_folder> --env_vars_file .env.production
```
*Note: `.env.production` must contain your Supabase Secrets.*

**Step 2: Connect to Vercel**

1.  Copy the Service URL output from the deploy command (e.g., `https://scout-v2-xyz.a.run.app`).
2.  Go to your Vercel Project Dashboard -> Settings -> Environment Variables.
3.  Add a new variable matching the pattern in Section 4:
    *   **Key:** `AGENT_SCOUT_URL`
    *   **Value:** `https://scout-v2-xyz.a.run.app`
4.  Redeploy (or promote) your Vercel app.