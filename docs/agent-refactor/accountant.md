# Agent Refactor Plan: THE ACCOUNTANT (Stellar-Accountant)

**Status**: DEFINED
**Source**: User Interview (The Rule of 100)

## 1. Core Philosophy (The "CFO")
The Accountant is no longer just reporting revenue. It is a **Profit Hunter**. It focuses on "Capture Rate" (Ownership) and "Efficiency" (Killing Busy Fool deals).

## 2. New Logic Capabilities (`services/logic-hub.js`)

### A. Dynamic Split Engine (The Capture Game) - P0
*   **Trigger**: `#commission-audit`
*   **Input**: Placement Data + User ID ("Joe").
*   **Logic**:
    ```javascript
    let capture = 0;
    if (recruiter === 'Joe') capture += 0.20;
    if (candidateMgr === 'Joe') capture += 0.30;
    if (clientOwner === 'Joe') capture += 0.20;
    if (accountMgr === 'Joe') capture += 0.30;
    return capture * TotalMargin;
    ```
*   **Agent Output**: "You are capturing 50%. Swap [Worker] for your own candidate to hit 80% and gain +$300/week."

### B. "Busy Fool" Filter - P1
*   **Trigger**: `#margin-audit`
*   **Formula**: `NetGP = (Charge - (Pay * 1.30)) * GuaranteedHours`
*   **Logic**:
    ```javascript
    if (NetGP < 400 || (NetGP / Revenue) < 0.15) return "BUSY_FOOL";
    ```
*   **Agent Output**: "Kill or Renegotiate [Project]. You are making $200/week. It's empty calories."

### C. The Deficit Tracker - P1
*   **Trigger**: `#cfo-briefing`
*   **Source**: `2026-forecasts.json` vs `data-context.weeklyRevenue`.
*   **Activity Link**: Compare Deficit to `activity_logs` (Calls/Meetings).
*   **Agent Output**: "Deficit: $4k. Cause: Low Activity (20 calls vs Target 40). Fix it."

## 3. Database Updates (`lib/db/schema.ts`)

*   **New Table**: `financial_benchmarks`
    *   `id`: uuid
    *   `burden_multiplier`: decimal (default 1.30)
    *   `min_weekly_gp`: integer (default 400)
    *   `target_margin_pct`: decimal (default 0.18)

## 4. Revised Agent Definition (`stellar-accountant.agent.yaml`)

*   **Role**: Ruthless CFO.
*   **Critical Actions**:
    *   READ `logic-hub.getBusyFools()`
    *   READ `logic-hub.getCaptureOpportunities()`
    *   READ `logic-hub.getForecastDeficit()`
*   **Voice**: Mathematical, blunt, urgency. "Revenue is vanity, Margin is sanity."
