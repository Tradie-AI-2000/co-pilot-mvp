# Co-Pilot Integration Guide

This guide explains how to connect ADK agents with the Co-Pilot Next.js architecture and BMad framework.

## 1. BMad Framework Integration

The **BMad Framework** (located in `_bmad/`) expects agents to adhere to specific personas and configuration patterns.

### Agent Structure
When creating a new agent with `adk create`, you must:
1.  **Register the Agent:** Add the agent's configuration to `_bmad/_config/agents.yaml` (or equivalent registry).
2.  **Inherit Configuration:** Ensure your agent reads from `_bmad/bmb/personas/` if applicable, to share common prompts or tools.

### Supabase Connection
Co-Pilot agents **MUST** connect to Supabase to access the shared data layer (`candidates`, `projects`).

**Requirements:**
-   **Library:** Use `supabase-py` (install via `pip install supabase`).
-   **Env Vars:**
    -   `SUPABASE_URL`: The project URL.
    -   `SUPABASE_SERVICE_ROLE_KEY`: Critical for agents to bypass RLS when acting as system admins or specific roles. **NEVER** expose this to the client.

**Setup Snippet (`agent.py`):**
```python
import os
from supabase import create_client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)
```

## 2. Next.js API Bridge

To expose your agent to the Co-Pilot UI (Command Centre), you need a Next.js Route Handler.

**File:** `app/api/agent/[agentName]/route.js`

**Scaffold Code:**
```javascript
import { NextResponse } from 'next/server';

// Proxy request to the Python Agent (running on Cloud Run or Local)
const AGENT_HOST = process.env.AGENT_HOST || 'http://localhost:8000';

export async function POST(req, { params }) {
    const { agentName } = params;
    const body = await req.json();

    try {
        const response = await fetch(`${AGENT_HOST}/agents/${agentName}:run`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Agent unreachable" }, { status: 500 });
    }
}
```

## 3. Data Context Injection

The Command Centre (`components/command-centre/`) often sends the *current view state* to the agent. Ensure your agent's input schema can handle:

-   `selectedProject`: The ID of the project currently in focus.
-   `viewContext`: 'financials', 'map', or 'roster'.

**Tip:** Use the `logic_porting.md` guide to understand how to process this context once received.
