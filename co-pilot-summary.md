# Stellar Recruitment Co-Pilot - Project Summary

## 1. Project Overview
**Name:** Stellar Recruitment Co-Pilot (Labour Hire Edition)
**Description:** An intelligent, predictive command center for recruitment, specifically tailored for the labour hire and trade sectors. It provides a central dashboard for high-level operational insights, along with dedicated modules for managing clients (CRM), candidates, projects, financials, business development, and client portals.

## 2. Technology Stack
*   **Framework:** Next.js 16 (App Router, Turbopack)
*   **Library:** React
*   **Styling:** Vanilla CSS / Styled JSX (Scoped CSS), CSS Variables for theming ("Premium" Dark Mode).
*   **Icons:** Lucide React
*   **State Management:** Centralized `DataContext` using React Context API for app-wide state (Projects, Clients, Candidates, Placements, Financials).
*   **Data:**
    *   `google-sheets.js`: Service for syncing data from external sheets.
    *   `enhanced-mock-data.js`: Rich static data for development.
    *   `construction-logic.js`: Domain-specific logic for phases and roles.
    *   `db/schema`: Drizzle ORM schema for SQLite/Postgres persistence.
    *   `api/`: Dedicated API routes for Nudges, Geo-services, and Crew Deployments.

## 3. Architecture
The application uses the Next.js App Router architecture.

*   **`app/`**: Routes and Page Logic.
    *   `page.js`: **Predictive Command Center** (Main Dashboard) with Risk Control & Mission Control.
    *   `bd/page.js`: **Business Development** ("The Hunter Deck") featuring The Bleed, Matchmaker, and Activity Pulse.
    *   `crm/page.js`: **Client Management** with Tiered Boards and Action Boards.
    *   `projects/page.js`: **Projects Database** with Geospatial Intelligence & Isochrone Mapping.
    *   `candidates/page.js`: **Candidate Pool** with Squad Builder, Rosters, and Map Views.
    *   `financials/page.js`: **Financial Command Center** with Ledger, Bench Liability, and Forecasting.
    *   `market/page.js`: **Market Intelligence** (Placeholder for future reports).
    *   `portal/page.js`: **Stellar Connect** (Client Portal) for Project History, Candidates, and Timesheets.
    *   `help/page.js`: **Help Desk** & Documentation.
*   **`app/api/`**: Backend Logic.
    *   `nudges/`: Logic for "Churn Interceptor", "Rainmaker", and "Client Stalker".
    *   `geo/`: Mapbox Isochrone proxy.
    *   `crews/`: Squad deployment logic.
    *   `webhooks/`: BCI Ingest and Project Signals.
*   **`components/`**: Reusable UI Components.
    *   **Core:** `Sidebar.js`, `Card.js`, `StatCard.js`.
    *   **Complex Widgets:**
        *   `SquadBuilder.js`: Drag-and-drop team creation.
        *   `RedeploymentRadar.js`: Tracks finishing dates and risk.
        *   `GoldenHourMode.js`: Focused call-list interface.
        *   `RealMap.js` & `GeospatialMap.js`: Map visualizations.
        *   `ProjectIntelligencePanel.js`: Detailed site analytics.
        *   `EnhancedClientDetailsModal.js`: Comprehensive client management.
        *   `ActivityPulseWidget`: Visualizes calls/sms/email volume.
*   **`context/`**:
    *   `data-context.js`: Hydrates state, handles data sanitization, and manages "Cloud Sync" simulation.
    *   `crew-context.js`: Manages squad deployment state.

## 4. Key Features

### A. Predictive Command Center
*   **The Scoreboard:** Live metrics for Billings, Margins, and Active Headcount.
*   **Risk Control:** Visual Redeployment Radar for upcoming finish dates.
*   **Mission Control:** Deal Flow summary and Client Demand widgets.
*   **Nudge Engine:** Proactive alerts ("Focus Feed") for critical actions.

### B. Business Development (The Hunter)
*   **The Matchmaker:** Algorithmic matching of candidates to upcoming project phases (Civil -> Structure -> Fitout).
*   **Activity Pulse:** Visual heatmaps of daily/weekly call volume.
*   **Golden Hour Mode:** Distraction-free interface for high-volume call blocks.
*   **The Bleed:** Real-time calculation of margin at risk from finishing candidates.

### C. Projects & Sites
*   **Geospatial Intelligence:** Isochrone mapping (commute times) and project clustering.
*   **Phase Tracking:** Detailed construction lifecycle tracking.
*   **Market Intel:** "Pre-Emptive Strike" logic based on BCI/Cordell data signals.

### D. Candidate & Workforce Management
*   **Squad Builder:** Group candidates into functional teams for bulk deployment.
*   **Bench Roster:** Visual management of available vs. deployed talent.
*   **SharePoint Mirror:** Widgets reflecting live spreadsheet data (Finishing Soon, Client Demand).

### E. Financials
*   **The Ledger:** Real-time P&L visualization (Revenue, Payroll, Net Profit).
*   **Liability Watchlist:** Tracking guaranteed hours costs for unassigned workers.
*   **Commission Dashboard:** Individual performance tracking.

## 5. Recent Changes & Fixes
*   **API Layer:** Added dedicated routes for Nudges, Geo, and Webhooks.
*   **Hunter Deck:** Enhanced BD page with Activity Pulse and improved Matchmaker logic.
*   **Projects:** Added Geospatial Map with Isochrone commute analysis.
*   **Help Desk:** Comprehensive documentation added.

## 6. Next Steps
1.  **Stellar-Jarvis Integration:** Deploying the "Desk Architect" agent to orchestrate nudges and strategy.
2.  **Live Data Sync:** Connect `google-sheets.js` to real API keys.
3.  **Authentication:** Implement NextAuth for Client Portal.
4.  **Mobile Polish:** Optimize complex grids for iPad/Phone views.