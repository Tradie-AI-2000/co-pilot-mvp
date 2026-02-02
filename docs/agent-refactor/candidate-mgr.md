# Agent Refactor Plan: THE CANDIDATE MANAGER (Stellar-Candidate-Mgr)

**Status**: DEFINED
**Source**: User Interview (The Asset)

## 1. Core Philosophy (Talent Ops)
The Candidate Manager treats the workforce as a "Deployed Army". The goal is **Bench Zero** and **Retention**.

## 2. New Logic Capabilities (`services/logic-hub.js`)

### A. Flight Risk Engine (Retention Radar) - P0
*   **Trigger**: `#flight-risk`
*   **Logic**:
    *   **Mood**: `checkins.slice(-2).every(c => ['Negative', 'Neutral'].includes(c.mood))`
    *   **Boredom**: `placement.duration > 6_MONTHS`
    *   **Commute**: `geo.calculateDriveTime(home, site) > 60_MINS`
*   **Output**: List of At-Risk candidates with "Risk Factor" (Mood, Boredom, Fatigue).
*   **Action**: "Call [Name]. Risk: Commute Fatigue. Offer Rotation."

### B. Squad Builder (1:2 Ratio) - P1
*   **Trigger**: `#squad-builder`
*   **Logic**:
    1.  Filter Bench by Region (e.g. West).
    2.  Identify Seniors (Rate > $40 or Role='LBP/L4').
    3.  Identify Juniors (Hammerhand/Labourer).
    4.  **Match**: 1 Senior + 2 Juniors.
*   **Output**: "West Auckland Frame Squad (1 LBP, 2 HH). Ready Monday."

### C. The Marketing Window (28 Days) - P1
*   **Trigger**: Daily Cron / `#redeployment-radar`
*   **Logic**:
    ```javascript
    if (placement.endDate === NOW + 28_DAYS) {
        return { action: 'FLOAT_ASSET', target: 'Sales Lead' };
    }
    ```
*   **Agent Output**: "Alert Sales Lead: [Name] finishes in 4 weeks. Begin Floating."

## 3. Revised Agent Definition (`stellar-candidate-mgr.agent.yaml`)

*   **Role**: Talent Operations Lead (Ari Gold).
*   **Critical Actions**:
    *   READ `logic-hub.getFlightRisks()`
    *   READ `logic-hub.generateSquads()`
    *   READ `logic-hub.getMarketingAssets()` (28-day finishers)
*   **Voice**: Protective, logistical, urgent. "Don't insult my guy with a low-ball."

## 4. Database Updates
*   **Schema**: Ensure `candidates` table has `seniority_level` (inferred from Rate/Role) to support Squad Logic.
