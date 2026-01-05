# Technical Audit: Business Development (BD) Module & "Nudge Engine" Architecture

## 1. Page & Route Inventory

| Route | Purpose | Critical Data Content |
| :--- | :--- | :--- |
| **`/` (Home)** | **Predictive Command Center**. The primary dashboard for the consultant. | **YES**: Displays Live Revenue, Risk Alerts, Urgent Actions (`moneyMoves`), and Active Placements. |
| **`/bd`** | **The Hunter Deck**. A specialized "Execution Mode" page for active business development. | **YES**: Houses the `TenderRadar` and `GoldenHourMode` (Call Lists). |
| **`/projects`** | **Project Management**. High-level view of all sites and status. | **YES**: Project locations, statuses, and phase data. |
| **`/crm`** | **Client CRM**. Management of client companies and contacts. | **YES**: Client history, contact frequency, and account tiering. |
| **`/candidates`** | **Candidate Pool**. Inventory of available and deployed talent. | **YES**: Availability dates, skills, and proximity data. |

**Key Finding:** The application currently splits "Intelligence" (Dashboard) from "Execution" (Hunter Deck). To realize the "Agentic" vision, the `/bd` routes should serve as the destination for actions triggered by the `/` dashboard's Nudge Engine.

---

## 2. Component Architecture (Business Development)

### Parent Components
*   **`BusinessDevPage` (`app/bd/page.js`)**: A layout wrapper with a "Mode Toggle" (Radar, Site Spotter, Golden Hour).
*   **`PredictiveCommandCenter` (`app/page.js`)**: The true functional heart of the app, containing the "Mission Control" feed.

### Key BD Widgets & Reusability
*   **`GoldenHourMode`**: A high-intensity dialer. **Reusable**: Linked to the global `moneyMoves` state, can be triggered by any "Call" action.
*   **`TenderRadar`**: A tender matching tool. **Isolated**: Currently uses hard-coded mock data; requires refactoring to use the global `projects` context for true intelligence.
*   **`FocusFeedCard`**: The atomic unit of the Nudge Engine. **Highly Reusable**: Used to display any prioritized action (Lead, Risk, Task).
*   **`GeospatialMap`**: The visual strategy engine. **Shared**: Used in Dashboard and Projects to show "Supply vs. Demand."

---

## 3. Data Flow & State Management

*   **Primary Source of Truth**: `context/data-context.js` (React Context API).
*   **State Management**: Uses a unified `DataProvider` that handles:
    *   **Hydration**: Syncs from `localStorage` (`stellar_projects_v2`, etc.).
    *   **Reactivity**: A central `useEffect` hook acts as a "Watcher," scanning all data arrays to calculate the `moneyMoves` (Nudges) list.
*   **State Propagation**: Updates to `projects` or `candidates` trigger a re-calculation of `moneyMoves`, which cascades updates to the Dashboard's "Mission Control" and the "Golden Hour" hit list.

---

## 4. Data Models & Relationships

The system uses **Drizzle ORM** with a Postgres schema (`lib/db/schema.ts`). Core entities for BD include:

*   **`clients`**: Tracks Tier (1, 2, 3) and Status (Lead, Active, Dormant).
*   **`projects`**: Tracks Stage (Tender, Construction, Planning) and Site coordinates.
*   **`candidates`**: Tracks Finish Date, Role, and Proximity.
*   **`placements`**: Links Candidates to Projects/Groups with a Status (Draft, Active).

**Architectural Gap:** The current "Nudge Engine" (`moneyMoves`) is entirely client-side and transient. It does not yet persist "Action Cards" in the database, which is required for an Agent to "remember" what it recommended or track consultant follow-through.

---

## 5. Interdependency Graph & Risks

*   **The "Double-Link" Requirement**: Any modification to the BD logic must maintain two links:
    1.  **JobAdder Link**: Syncing call notes/status to the external system of record.
    2.  **Project Link**: Associating the activity with a physical site for geospatial intelligence.
*   **Global Context Dependencies**: The BD module relies heavily on `DataProvider` for state and `GeospatialMap` for visualization.
*   **Notification Toasters**: The app uses a custom `ClientProviders` stack; adding "Push" notifications for the Nudge Engine will require integrating a web-push or WebSocket layer into this provider stack.

---

## 6. Implementation Strategy: From Dashboard to Agent

1.  **Upgrade `moneyMoves`**: Transition the calculation logic from a simple `useEffect` to a server-side or worker-based "Rule Engine."
2.  **Persist Nudges**: Add a `nudges` table to the schema to track "Agent Recommendations" (e.g., *Is this lead actioned? Is it snoozed?*).
3.  **Action Drawer**: Implement the "Command Drawer" in the Dashboard to allow execution (Calls/Emails) without leaving the "Feed of Truth."
4.  **Weather/Event Triggers**: Integrate external APIs (MetService, Pacifecon) into the `DataContext` watcher to enable "Pre-emptive" and "Rainmaker" nudges.
