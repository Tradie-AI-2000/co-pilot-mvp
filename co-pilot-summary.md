# Stellar Recruitment Co-Pilot - Project Summary

## 1. Project Overview
**Name:** Stellar Recruitment Co-Pilot (Labour Hire Edition)
**Description:** An intelligent, predictive command center for recruitment, specifically tailored for the labour hire and trade sectors. It provides a central dashboard for high-level operational insights, along with dedicated modules for managing clients (CRM), candidates, projects, and market intelligence.

## 2. Technology Stack
*   **Framework:** Next.js (App Router)
*   **Library:** React
*   **Styling:** Vanilla CSS / Styled JSX (Scoped CSS), CSS Variables for theming.
*   **Icons:** Lucide React
*   **State Management:** Local state management using React `useState` and `useEffect` hooks.
*   **Data:** Relies on mock data services with a clear path for future API integration (e.g., JobAdder).

## 3. Architecture
The application uses the Next.js App Router architecture, organizing features by routes.

*   **`app/`**: Contains all pages and their corresponding logic.
    *   `layout.js`: The global layout, which includes the main `Sidebar` navigation.
    *   `page.js`: **Predictive Command Center**, the main dashboard.
    *   `crm/page.js`: **Client Management** module.
    *   `candidates/page.js`: **Candidate Pool** management module.
    *   `projects/page.js`: **Projects Database** module.
    *   `market/page.js`: **Market Intelligence** module.
*   **`components/`**: A rich library of reusable UI components.
    *   **Core:** `Sidebar.js`, `Card.js`, `StatCard.js`.
    *   **Modals:** `EnhancedClientDetailsModal.js`, `ClientDetailsModal.js`, `AddClientModal.js`, and a `CandidateModal` for CRUD operations.
    *   **Dashboard Specific:** `ProjectWatchlistCard.js`, `FocusFeedCard.js`, `ActivityFeedWidget.js`, `ProjectDetailPanel.js`.
    *   **Feature Specific:** `ClientCard.js`, `GeospatialMap.js`.
*   **`services/`**: Data access and business logic layer.
    *   `mockData.js` & `enhancedMockData.js`: Provide static data for development.
    *   `projectService.js`: Contains logic related to project data.
    *   `jobadder.js`: Pre-built service for integrating with the JobAdder API.

## 4. Key Features

### A. Predictive Command Center (Dashboard - `app/page.js`)
The main landing page providing a holistic view of recruitment operations.
*   **The Scoreboard:** A top-level grid of `StatCard` components displaying critical KPIs like MTD Billings, Activity Pulse, Active Placements, and Compliance.
*   **Mission Control:** A dual-panel view for focused action.
    *   **Project Watchlist:** Tracks key projects.
    *   **Urgent Actions:** A feed highlighting time-sensitive tasks and risks.
*   **Context & Territory:** A sidebar with:
    *   **Territory Map:** A `GeospatialMap` for visualizing project locations.
    *   **Activity Feed:** A stream of recent system and user activities.

### B. Client Management (CRM - `app/crm/page.js`)
A dedicated module for managing the client lifecycle.
*   **Client Grid:** Displays all clients using `ClientCard` components.
*   **CRUD Functionality:** Features buttons to Add, Import, and Export clients. Adding a client is currently a placeholder.
*   **Enhanced Client Details:** Clicking a client opens a detailed modal (`EnhancedClientDetailsModal`) for in-depth analysis and editing.

### C. Candidate Pool (`app/candidates/page.js`)
A comprehensive tool for managing the candidate database.
*   **Candidate List:** Displays a list of candidates with key details, a "Ready to Deploy" indicator, and a mock "Match Score".
*   **Skeleton Loading:** Provides a smooth loading experience while data is fetched.
*   **Full CRUD in Modal:**
    *   **Create/Edit:** A `CandidateModal` allows for adding new candidates and editing existing ones across dozens of fields.
    *   **Import/Export:** The page supports bulk CSV export, and the modal allows exporting individual profiles.

### D. Projects Database (`app/projects/page.js`)
A central repository for tracking all construction and labour projects.
*   **Project Grid:** Shows all projects with details like name, stage, value, and location.
*   **Create Project Modal:** A functional modal allows for the creation of new projects, including name, location, value, and the ability to assign them to one or more clients from the CRM.

### E. Market Intelligence (`app/market/page.js`)
Provides insights into regional market trends.
*   **Geospatial Map:** A large-format map for visualizing market data.
*   **Regional Insights:** A panel showing region-specific data like top roles in demand, and trend indicators.

## 5. Styling Strategy
The project uses a "Premium" dark mode aesthetic defined in `app/globals.css`.
*   **CSS Variables:** A well-defined color palette with variables like `--primary`, `--secondary`, and `--surface`.
*   **Glassmorphism:** The `.glass-panel` utility class is used for creating translucent, modern UI elements.
*   **Scoped Styles:** `style jsx` blocks are used extensively within components to ensure styles are encapsulated and don't leak, a key feature of Styled-JSX.

## 6. Next Steps (Inferred)
1.  **Activate API Integration:** Replace all mock data services with live data by fully implementing the `jobadder.js` service and other potential backend APIs.
2.  **Implement Persistence:** Currently, updates made in the UI (like editing a candidate or adding a project) are only held in local component state. A proper database or backend is needed to persist this data.
3.  **Build Out Placeholders:** Complete the functionality for "Add Client", "Import", and other placeholder features.
4.  **Enhance Filtering/Searching:** Wire up the UI search and filter controls to actually manipulate the displayed data.