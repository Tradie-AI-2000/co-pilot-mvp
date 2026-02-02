# Agent Refactor Plan: SYSTEMS IT (Stellar-Systems-IT)

**Status**: DEFINED
**Source**: User Interview (Data Sentinel)

## 1. Core Philosophy (The Auditor)
Systems IT is the "Referee". It enforces Data Integrity and Logic Rules. It has a **Kill Switch** for stale data.

## 2. New Logic Capabilities (`services/logic-hub.js`)

### A. Sync Watchdog (Kill Switch) - P0
*   **Trigger**: `#system-health` / Automatic Poll
*   **Logic**:
    ```javascript
    const staleMins = (NOW - lastSyncTime) / 60000;
    if (staleMins > 60) return "KILL_SWITCH";
    if (staleMins > 15) return "LATENCY_WARNING";
    ```
*   **Action**: Disable Matchmaker/Negotiator if Kill Switch active.

### B. The Sin Bin (Exception Log) - P1
*   **Trigger**: `overrideCompliance()` action.
*   **Logic**: Log `userId`, `candidateId`, `reason` to `compliance_exceptions` table.
*   **Agent Output**: "Override Logged. Added to Sin Bin for GM Review."

### C. Trade Matrix Enforcement (Logic Police) - P1
*   **Trigger**: `#validate-placement`
*   **Matrix**:
    *   `CIVIL`: [Labourer, Digger, Drainlayer, TC]
    *   `STRUCTURE`: [Formworker, Steelie, Concrete, Hammerhand, Carpenter]
    *   `ENVELOPE`: [Carpenter, Hammerhand, Site Manager, Cladder]
    *   `FITOUT`: [Painter, GIB, Plasterer, Carpenter]
*   **Logic**: `if (!PhaseMatrix[project.phase].includes(candidate.role)) return "VIOLATION";`

### D. Data Hygiene Score - P2
*   **Trigger**: `#data-hygiene`
*   **Logic**:
    ```javascript
    score = 100;
    if (!phone) score -= 20;
    if (!siteSafe) score -= 20;
    if (!cv) score -= 10;
    ```
*   **Output**: "Matchability Score: 40%. Fix Phone to restore."

## 3. Revised Agent Definition (`stellar-systems-it.agent.yaml`)

*   **Role**: CTO & Data Sentinel.
*   **Critical Actions**:
    *   READ `logic-hub.getSyncStatus()`
    *   READ `logic-hub.getHygieneReport()`
    *   READ `logic-hub.validateTradeMatrix()`
