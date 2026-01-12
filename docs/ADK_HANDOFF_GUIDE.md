# 📘 ADK Integration Strategy: Co-Pilot Construction Platform

## 1. What is the Google Agent Development Kit (ADK)?

The **Google ADK** is a code-first framework for building, evaluating, and deploying AI agents.

In the context of **Co-Pilot**, think of ADK as the "Brain" to your Next.js "Body."
*   **The Next.js App** handles the UI, state (`DataContext`), and visualization (Maps/Kanban).
*   **The ADK Agents** handle the *reasoning*, *decision making*, and *external data fetching*.

---

## 2. Brownfield Setup Guide
*Follow these instructions to initialize ADK within the existing Co-Pilot repository.*

### A. Folder Structure Strategy
We will not disrupt the Next.js structure. We will create a parallel `backend_agents` directory.

**Target Structure:**
```text
co-pilot-repo/
├── app/                  # Existing Next.js App Router
├── components/           # Existing React Components
├── ...
└── backend_agents/       # <--- NEW ADK DIRECTORY
    ├── .venv/            # Python Virtual Environment
    ├── .env              # API Keys (Gemini, Maps, etc)
    ├── main_agent/       # The Orchestrator
    └── sub_agents/       # Specialized agents (Financial, Geo, etc)
```

### B. Installation & Initialization Commands
*Execute these commands in the project root:*

1.  **Create the Agents Directory:**
    ```bash
    mkdir backend_agents
    cd backend_agents
    ```

2.  **Initialize Python Environment:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install ADK:**
    ```bash
    pip install google-adk
    ```

4.  **Create the Base Agent:**
    ```bash
    adk create co_pilot_brain
    ```

5.  **Run the API Server:**
    To allow the Next.js frontend to talk to the agents, we run the ADK API server:
    ```bash
    # Runs on localhost:8000 by default
    adk api_server
    ```

---

## 3. Co-Pilot Agent Architecture Plan
*Based on the project overview, here is how we replace static logic with active Agents.*

### 🛠 Module 1: The "Bench Warrior" (Financial Command Center)
**Goal:** Reduce Bench Liability (cost of unplaced workers).
*   **Agent Name:** `agent_bench_optimizer`
*   **Role:** Analyzes candidates on the bench. Cross-references active "Deal Tickets" in the CRM to suggest immediate placements.
*   **Output:** Generates a specific "Float Pitch" text message for recruiters.

### 🌍 Module 2: The "Geo-Matchmaker" (Market Intelligence)
**Goal:** Intelligent commute-based placement.
*   **Agent Name:** `agent_geo_logistics`
*   **Role:** Uses Isochrone Analysis to rank candidates based on commute time vs. margin cost.
*   **Tool:** `calculate_commute_ranking(site_lat_long, candidate_list)`

### 🏗️ Module 3: The "Project Oracle" (Market Intelligence)
**Goal:** Predict labor needs based on construction phases.
*   **Agent Name:** `agent_project_lifecycle`
*   **Role:** Monitors Project Timelines. When a project hits the "Structure" phase, it automatically drafts deals for Carpenters 2 weeks in advance.

---

## 4. Connecting Next.js to ADK
*How the frontend interacts with the agents.*

In your Next.js `services` layer, replace mock data calls with `fetch` requests to the ADK API server.

**Example: Running an Agent from JS**
```javascript
export async function askCoPilotBrain(prompt) {
  const response = await fetch('http://localhost:8000/agent/co_pilot_brain/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt }),
  });
  const data = await response.json();
  return data.response;
}
```

## 5. Next Steps for You (The Agent)
1.  **Execute** the setup commands in Section 2.
2.  **Inspect** `co_pilot_brain/agent.py`.
3.  **Implement** the `agent_bench_optimizer` first, as "Bench Liability" is the primary financial pain point.
