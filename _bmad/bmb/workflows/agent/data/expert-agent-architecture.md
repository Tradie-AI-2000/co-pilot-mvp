# Co-Pilot Nervous System: Technical Blueprint

This document maps the complete technical architecture ("The Nervous System") of the Stellar Recruitment Co-Pilot. It is designed to be ingested by Expert Agents (like Stellar-Jarvis) to understand the app's anatomy.

---

## 1. The Component Tree (The Body)
*Physical structure of the UI and interactive elements.*

### Core Layout
- `components/sidebar.js`: Main navigation controller.
- `app/layout.js`: Global provider wrapper (ClientProviders).

### Dashboard Widgets (Mission Control)
- `components/stat-card.js`: Individual metric cards (Revenue, Risk).
- `components/bench-liability-widget.js`: Visualizes guaranteed hours costs.
- `components/activity-feed-widget.js`: Live stream of desk events.
- `components/focus-feed-card.js`: Urgent "Nudge" cards (e.g., Compliance Alerts).
- `components/deal-flow-summary.js`: High-level pipeline view.
- `components/client-demand-widget.js`: Live client requirements.

### Business Development (The Hunter Deck)
- `components/golden-hour-mode.js`: Focused call interface.
- `components/relationship-decay-widget.js`: Client contact frequency tracker.
- `components/tender-radar.js`: Upcoming project opportunities.
- `components/matchmaker-widget.js` (Inline in `app/bd/page.js`): Auto-matches candidates to roles.
- `components/activity-pulse-widget.js` (Inline in `app/bd/page.js`): Heatmap of calls/sms.

### Operations & Logistics
- `components/squad-builder.js`: Drag-and-drop crew assembly.
- `components/redeployment-radar.js`: Finishing date visualization.
- `components/bench-roster.js`: Available candidate list.
- `components/geospatial-map.js`: Mapbox/Leaflet integration for candidate locations.
- `components/project-intelligence-panel.js`: Deep dive into project phases/risks.

### Client Management (CRM)
- `components/client-tier-board.js`: Strategic client segmentation.
- `components/client-action-board.js`: Daily CRM tasks.
- `components/enhanced-client-details-modal.js`: Comprehensive client profile.

### Financials
- `components/commission-dashboard.js`: Recruiter earnings tracker.
- `components/financial-forecast-widget.js`: Revenue vs Budget 2026.

---

## 2. The Data Schema (The Memory)
*State management and data flow structure.*

### Context: `context/data-context.js`
The central nervous system hub. Stores:
*   `candidates`: Array of Candidate objects (enriched).
*   `projects`: Array of Project objects (with phases).
*   `clients`: Array of Client objects (with tiers).
*   `placements`: Active/Historical placement records.
*   `moneyMoves`: The "Nudge" queue (triggers for Jarvis).
*   `weeklyRevenue`: Calculated live financial metric.

### Sync Service: `services/google-sheets.js`
*   **Role:** The bridge to the "Old World" (Spreadsheets).
*   **Mechanism:** Fetches/Pushes data to Google Sheets API.
*   **Enrichment:** Raw sheet rows are "enriched" in `data-context.js` (e.g., parsing dates, calculating margins).

### Persistence
*   **Primary:** Google Sheets (Legacy Sync).
*   **Secondary:** `localStorage` (Hydration speed).
*   **Future:** PostgreSQL/Drizzle (via `app/api` routes).

---

## 3. The API Routes (The Reflexes)
*Server-side logic and external integrations.*

*   `/api/nudges`: Generates proactive alerts (Churn Interceptor, Rainmaker).
*   `/api/geo/isochrone`: Mapbox proxy for travel-time calculations.
*   `/api/crews/deploy`: Atomic transaction for deploying a Squad.
*   `/api/webhooks/bci-ingest`: Receives project leads from BCI Central.
*   `/api/sync`: Proxy for Google Sheets operations.
*   `/api/cron/generate-nudges`: Periodic task runner for daily alerts.

---

## 4. The Logic Layers (The Instincts)
*Hard-coded business rules and domain knowledge.*

### `services/construction-logic.js`
*   **`PHASE_MAP`**: Defines the 15 construction phases (01_civil to 06_handover).
*   **`WORKFORCE_MATRIX`**: Predicts role requirements per phase (e.g., "Structure" needs "Formworkers").
*   **`MASTER_ROLES`**: Valid list of trade roles.
*   **`RELATED_ROLES`**: Semantic mapping (e.g., "Hammerhand" is related to "Carpenter").
*   **`checkVisaCompliance()`**: Hard stop logic for visa restrictions.

### `services/nudge-logic/` (Inferred)
*   **`weather.js`**: Mock provider for Rainmaker signals.
*   **`types.ts`**: TypeScript definitions for signals.

---

## 5. Critical Integration Points for Agents

1.  **Active Observation Hook:** Agents should monitor `DataContext.moneyMoves` for new "Signal" or "Risk" items.
2.  **Trade Logic Gate:** Agents must validate all role suggestions against `WORKFORCE_MATRIX` in `construction-logic.js`.
3.  **Geospatial Validation:** Agents must use `/api/geo/isochrone` to validate any "Matchmaker" suggestion before pitching.