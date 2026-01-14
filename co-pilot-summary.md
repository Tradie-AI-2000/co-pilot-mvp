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

## 3. Architecture
The application uses the Next.js App Router architecture.

*   **`app/`**: Routes and Page Logic.
    *   `page.js`: **Predictive Command Center** (Main Dashboard).
    *   `bd/page.js`: **Business Development** (The Hunter, Matchmaker, Golden Hour).
    *   `crm/page.js`: **Client Management** (Tiered Clients, Relationship Tracking).
    *   `projects/page.js`: **Projects Database** (Construction Sites, Phases).
    *   `candidates/page.js`: **Candidate Pool** (Roster, Squads).
    *   `financials/page.js`: **Financial Performance** (Margins, Forecasting, Commissions).
    *   `market/page.js`: **Market Intelligence** (Geospatial Analysis).
    *   `portal/page.js`: **Client Portal** (External facing view for clients like Fletcher).
*   **`components/`**: Reusable UI Components.
    *   **Core:** `Sidebar.js`, `Card.js`, `StatCard.js`.
    *   **Complex Widgets:**
        *   `SquadBuilder.js`: Drag-and-drop team creation.
        *   `RedeploymentRadar.js`: Tracks finishing dates and risk.
        *   `GoldenHourMode.js`: Focused call-list interface.
        *   `RealMap.js` & `GeospatialMap.js`: Map visualizations.
        *   `ProjectIntelligencePanel.js`: Detailed site analytics.
        *   `EnhancedClientDetailsModal.js`: Comprehensive client management.
*   **`context/`**:
    *   `data-context.js`: Hydrates state, handles data sanitization, and manages "Cloud Sync" simulation.

## 4. Key Features

### A. Predictive Command Center
*   **The Scoreboard:** Live metrics for Billings, Margins, and Active Headcount.
*   **Mission Control:** Activity feeds, urgent alerts, and project watchlists.
*   **Territory Map:** Visualizes active sites and candidate locations.

### B. Business Development (The Hunter)
*   **The Matchmaker:** Algorithmic matching of candidates to upcoming project phases.
*   **Golden Hour Mode:** Distraction-free interface for high-volume call blocks.
*   **Tender Radar:** Tracks upcoming project opportunities.

### C. Projects & Sites
*   **Phase Tracking:** detailed construction lifecycle tracking (Civil -> Structure -> Fitout).
*   **Workforce Planning:** Gap analysis between required trades and deployed staff.
*   **Site Intelligence:** Manage site managers, H&S requirements, and access details.

### D. Candidate & Workforce Management
*   **Squad Builder:** Group candidates into functional teams for bulk deployment.
*   **Redeployment Radar:** Visualizes when workers are finishing to prevent bench time.
*   **Active Bench:** Monitoring of available candidates with guaranteed hours liability.

### E. Financials
*   **Commission Dashboard:** Tracks individual and team performance.
*   **Margin Analysis:** Real-time visibility into weekly gross profit and revenue at risk.
*   **Forecasting:** Projecting future revenue based on pipeline probability.

## 5. Recent Changes & Fixes
*   **Duplicate ID Resolution:** Fixed critical rendering errors caused by duplicate `assignedCompanyIds` (e.g., `CL043`) in the Project List and Client Modals. Implemented `Set` based filtering in `app/projects/page.js` and `enhanced-client-details-modal.js` to ensure key uniqueness.
*   **State hardening:** Improved data sanitization in `DataContext` to handle string/number ID mismatches.

## 6. Next Steps
1.  **API Integration:** Fully replace mock data with live endpoints (JobAdder, Google Sheets).
2.  **Authentication:** Implement actual user/client login for the Portal.
3.  **Data Persistence:** Connect `write` operations (Add/Edit) to a backend database.
4.  **Mobile Optimization:** Refine complex tables and grids for mobile responsiveness.
