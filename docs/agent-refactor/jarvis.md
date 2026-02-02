# Agent Refactor Plan: JARVIS (The Orchestrator)

**Status**: DEFINED
**Source**: Audit 2026-02-01 & User Interview

## 1. Core Philosophy (The "Law of Joe")
Jarvis shifts from a passive reporter to a **Logistics Commander**. He does not just "count heads"; he manages **Margin Protection** and **Operational Compliance**.

## 2. New Logic Capabilities (`services/logic-hub.js`)

### A. Bench Risk (Emergency Protocol) - P0
*   **Trigger**: `#desk-pulse` or automatic daily scan.
*   **Logic**:
    ```javascript
    candidates.filter(c => c.status === 'Available' && c.guaranteedHours > 0)
    ```
*   **Output**: List of "Cash Burn" candidates with total weekly liability.
*   **Directive**: "Immediate Deployment Required. Run Matchmaker."

### B. Redeployment Radar (21-Day Window) - P1
*   **Trigger**: `#desk-pulse` or `#redeployment-radar`.
*   **Logic**:
    ```javascript
    placements.filter(p => p.endDate <= NOW + 21_DAYS)
    ```
*   **Output**: "Finishing Soon" list.
*   **Action**: Auto-run `ClientDemand` check for matches.

### C. Relationship Decay (Tier 1 Guardrails) - P1
*   **Trigger**: `#relationship-health` (Automatic).
*   **Logic**:
    ```javascript
    clients.filter(c => c.tier === 1 && daysSince(c.lastContact) > 40)
    ```
*   **Output**: "Neglect Alert".

### D. Compliance Hard Stops (SSA) - P2
*   **Trigger**: `#audit-desk`.
*   **Logic**:
    ```javascript
    projects.filter(p => p.ssaStatus.expiry < NOW + 21_DAYS || placement.duration > 8_WEEKS)
    ```
*   **Output**: "Site Safety Audit Required."

## 3. Revised Agent Definition (`stellar-jarvis.agent.yaml`)

*   **Role**: Logistics Commander & Margin Guardian.
*   **Critical Actions**:
    *   READ `logic-hub.getBenchLiability()`
    *   READ `logic-hub.getRedeploymentRisks()`
    *   READ `logic-hub.getTier1Decay()`
*   **Prompts**: Updated to explicitly request these specific data points rather than "analyzing context".

## 4. Q&A Summary
*   **The Bleed**: Defined as "Unfilled Jobs" AND "Bench Liability" (Guaranteed Hours).
*   **Crisis**: Unassigned Bench Risk, Zero Client Demand, Compliance Hard-Stops.
*   **Rainmaker**: Now includes "Margin Optimization" (Migrant swaps) and "Performance Benchmarking".
