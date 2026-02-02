# Jarvis "Command Centre" Implementation Plan

## Overview
This plan upgrades the Command Centre to fully integrate "Jarvis" as the central orchestrator. It addresses the disconnect between the visual widgets and the agent backend, enables direct UI interaction through data context, and optimizes the API payload to prevent token limits.

## Current State Analysis
- **Missing Link**: Jarvis is defined in `_bmad-output/.../stellar-jarvis.agent.yaml` but is missing from `app/api/agent/route.js` and the `AGENTS` registry in `app/command-centre/page.js`.
- **Blind Agents**: Agents only "see" what is passed in the `context` object. Currently, widgets like `RelationshipDecayWidget` and `ActivityPulseWidget` have internal state/data that isn't fully exposed to the `buildContext` function.
- **Heavy Payload**: `buildContext` sends the entire candidate list to the LLM on every turn.

## Implementation Approach
1.  **Backend Integration**: Register Jarvis in `route.js` and `page.js`.
2.  **Context Refactor**: Create a "Context Slicer" service that generates summarized views (e.g., `getPulseSummary`, `getRiskSummary`) instead of raw dumps.
3.  **Widget "Readability"**: Ensure widgets accept `data` as props (controlled by parent) rather than fetching internally, or expose their data via a shared context hook, so `buildContext` can grab it.
4.  **New Agents**: Implement "The Negotiator" (Rates) and "Compliance Officer" (Visa/Safety).

## Phase 1: Backend & Context Core
### Overview
Register Jarvis and optimize the data context sent to the API.

### Changes Required:
#### 1. `app/api/agent/route.js`
**Goal**: Add Jarvis to `PERSONAS` and optimize context handling.
**Changes**:
- Import/Find `stellar-jarvis.agent.yaml`.
- Add `jarvis` to `PERSONAS` map.
- Implement a `summarizeContext(context)` function inside the route (or imported helper) to reduce token usage (e.g., "Active Candidates: 45" instead of an array of 45 objects).

#### 2. `app/command-centre/page.js`
**Goal**: Add Jarvis to sidebar and `AGENTS` registry.
**Changes**:
- Add `{ id: 'jarvis', name: 'Jarvis', title: 'Orchestrator', icon: <Cpu size={18} /> }` to `AGENTS`.
- Ensure `buildContext` includes specific fields Jarvis needs (e.g., `moneyMoves` from `Data Context` for the "Rainmaker" trigger).

### Success Criteria:
#### Automated:
- [x] `npm run dev` starts without errors.
- [x] `curl -X POST http://localhost:3000/api/agent -d '{"agentId": "jarvis", "message": "Status Report"}'` returns a valid JSON response with Jarvis's persona.

## Phase 2: Widget "Readability" & Logic Hooks
### Overview
Ensure the specific data points displayed in widgets are accessible to the agent.

### Changes Required:
#### 1. `services/logic-hub.js`
**Goal**: Add tools that mirror widget logic.
**Changes**:
- Add `getRelationshipHealth()` tool: Returns the same "decay" data used by `RelationshipDecayWidget`.
- Add `getPulseMetrics()` tool: Returns activity stats used by `ActivityPulseWidget`.

#### 2. `app/api/agent/route.js`
**Goal**: Connect new logic tools to Jarvis.
**Changes**:
- In the `POST` handler, if `agentId === 'jarvis'`, execute `getPulseMetrics` and `getRelationshipHealth` and inject the *result* (not the raw data) into the system prompt.

### Success Criteria:
#### Manual:
- [x] Ask Jarvis: "How is our relationship health?" -> Response should cite specific "Red/Yellow/Green" counts matching the widget.

## Phase 3: New Agents (Negotiator & Compliance)
### Overview
Create the new specialized agents requested.

### Changes Required:
#### 1. `_bmad/custom/stellar-agents/negotiator.agent.yaml`
**Goal**: Define the Negotiator persona.
**Content**:
- Role: "Hard-nosed Rate Negotiator".
- Prompts: Scripts for pushing back on low margin.

#### 2. `_bmad/custom/stellar-agents/compliance.agent.yaml`
**Goal**: Define the Compliance Officer persona.
**Content**:
- Role: "Visa & Safety Gatekeeper".
- Prompts: Checks for visa expiry and H&S tickets.

#### 3. `app/api/agent/route.js`
**Goal**: Register new agents.
**Changes**:
- Add `negotiator` and `compliance` to `PERSONAS`.

### Success Criteria:
#### Manual:
- [x] Select "Negotiator" in Command Centre -> Ask "Client wants $45 for a Carpenter, what do I say?" -> Response gives a negotiation script.

## Phase 4: Prompt List & Documentation
### Overview
Compile the prompt list and update docs.

### Changes Required:
#### 1. `docs/agent-prompts.md`
**Goal**: Centralized prompt cheat sheet.
**Content**:
- List all triggers from YAML files (e.g., `#rainmaker`, `#crisis-interceptor`).
- Provide example user queries for each agent.

### Success Criteria:
- [x] File exists and contains all agent triggers.
