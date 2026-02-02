# Agent Refactor Plan: THE SALES LEAD (Stellar-Sales-Lead)

**Status**: DEFINED
**Source**: User Interview (Velocity over Margin)

## 1. Core Philosophy (The Rainmaker)
The Sales Lead drives **Pipeline Velocity**. It prioritizes Speed (Proximity) and Contact Frequency (Decay Prevention).

## 2. New Logic Capabilities (`services/logic-hub.js`)

### A. Golden Hour Generator (The Priority Stack) - P0
*   **Trigger**: `#golden-hour`
*   **Logic**:
    1.  **Tier 1 Risk**: `clients.filter(c => c.tier === 1 && daysSince(c.lastContact) > 40)`
    2.  **Tender Leads**: `tenders.filter(t => !contacts.includes(t.client))` (New Market Intel)
    3.  **Unmet Demand**: `openJobs.filter(j => j.floats === 0)`
*   **Output**: Ranked Call List (Top 10).
*   **Action**: "Hunter Mode Activated. Top Target: [Client Name]. Reason: 40 Days Silence."

### B. Proximity Matchmaker (Velocity) - P1
*   **Trigger**: `#matchmaker`
*   **Logic**:
    1.  Filter Candidates by `Status` (Available/Finishing).
    2.  Filter by `Commute` (Site to Home < 45 mins via `api/geo`).
    3.  Calculate `Breakeven` = `PayRate * 1.30`.
*   **Output**: List of "Site-Ready" Candidates with Negotiation Buffer.
*   **Agent Output**: "[Name] is 20 mins away. Breakeven is $39. Close at $45+."

### C. The BCI Offensive (Decay Hook) - P1
*   **Trigger**: `#relationship-decay`
*   **Logic**:
    1.  Identify Decaying Client.
    2.  Scan `market_tenders` for recent awards linked to this client.
    3.  Generate Script.
*   **Agent Output**: "Call [Name]. Hook: 'Saw you won the [Project] tender on BCI.' Ask for a coffee."

## 3. Revised Agent Definition (`stellar-sales-lead.agent.yaml`)

*   **Role**: Head of Growth.
*   **Critical Actions**:
    *   READ `logic-hub.getGoldenHourList()`
    *   READ `logic-hub.getProximityMatches()`
    *   READ `logic-hub.getTenderHooks()`
*   **Voice**: High-energy, persuasive. "Speed kills."

## 4. Database Updates
*   **New Table**: `market_tenders` and `market_tender_stakeholders` (for Market Intel).
*   **Schema**: Ensure `leads` table links to `tenders`.
