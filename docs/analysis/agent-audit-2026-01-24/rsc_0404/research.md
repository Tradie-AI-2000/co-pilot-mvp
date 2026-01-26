# Research: Command Centre Orchestration Flow

## 1. UI Entry Point (`app/command-centre/page.js`)
- **Action**: User issues a directive via the "Tactical Stream" input.
- **Trigger**: `handleSendMessage` is invoked.
- **Request**: `POST /api/agent` with `{ message: msgText }`.
- **UI State**: Displays messages and shows "Jarvis is processing..." while waiting.
- **Specialists**: A hardcoded list of specialists (GM, Scout, Sales, etc.) is displayed in the sidebar. Currently, their status (e.g., 'predict', 'urgent') is hardcoded in the React component.

## 2. Orchestrator Logic (`app/api/agent/route.js`)
- **Role**: Acts as the "Stellar GM."
- **Static Context**: Loads `2026-forecasts.json`, `board-minutes.md`, and `construction-logic.js`.
- **Dynamic Context**: Queries Supabase via Drizzle for the `internalRoster` and the 5 most recent `projects`.
- **Persona Swarm**: Loads `.agent.yaml` files for all specialists from `_bmad-output/bmb-creations/`. These are injected into the system prompt as "Your Board (The Swarm)."
- **Strategic Mode**: Implements a "DEFCON" logic based on financial variance (e.g., `DEFCON_RED` if variance < -5000).
- **Intelligence Output**: Returns a JSON object with:
    - `chat_response`: Markdown for the tactical stream.
    - `signal_updates`: Intended to update the status/meta of the specialists in the UI.
    - `nudge_trigger`: For the "Focus Feed."

## 3. Specialized Intelligence (`lib/intel-engine.js`)
- **Scout Agent**: The `generateScoutIntel` function scans the `projects` table.
- **Logic**: It looks for packages with a status of "Tendering" and matches them against the internal roster's divisions.
- **Output**: Returns "SARs" (Situation, Analysis, Recommendation) for high-value tender opportunities.
- **Integration**: While `/api/scout` exists, the "Stellar GM" orchestrator is the one intended to synthesize this data for the user.

## 4. Identified Gaps
- **UI Synchronization**: The UI receives `signal_updates` from the API but doesn't yet apply them to the `specialists` state.
- **Context Passing**: The UI doesn't currently pass the full `financials` or `projects` context to the API; the API has to re-query everything or rely on the UI providing it in the future.
- **Dynamic Persona Selection**: The API always assumes the GM is the primary respondent, rather than switching the "Main Persona" based on the `agentId` selected in the sidebar.
