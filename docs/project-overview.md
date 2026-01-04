# Co-Pilot: Intelligent Construction Recruitment Platform
**Version:** 1.2 (Beta) | **Last Updated:** Jan 2026

## 1. Executive Summary
**Co-Pilot** is a sophisticated "Predictive Command Center" for the construction recruitment industry. It moves beyond traditional CRM by integrating **real-time market intelligence**, **geospatial data**, and **financial analytics** to optimize the placement of skilled labor.

The platform visualizes the supply-demand dynamics between **Construction Projects** (Demand), **Recruitment Clients** (Connectors), and **Candidates** (Supply). Its primary goal is to reduce "bench liability" (unemployed candidates with guaranteed hours) and maximize "fill rate" (placing candidates on active sites).

---

## 2. Technology Stack
*   **Framework**: Next.js 16 (App Router)
*   **Language**: JavaScript / React
*   **Styling**: Tailwind CSS + Styled JSX (Glassmorphism/Dark UI aesthetic)
*   **Icons**: Lucide React
*   **Maps**: React Leaflet (OpenStreetMap) with Geospatial features
*   **State Management**: React Context API (`DataContext`, `CrewContext`)
*   **Data Layer**: Sophisticated Mock Data Service simulating a relational DB

---

## 3. Core Modules & User Guide

### 3.1 Predictive Command Center (Dashboard)
**Route:** `/`
The landing page is a high-density "6 AM View" for recruiters. It answers: "Who is costing me money?" and "Where is the fire?".

**Key Features:**
*   **The Scoreboard**: Live metrics for Weekly Billings, Revenue at Risk, and Active Placements.
*   **Risk Control**: `BenchLiabilityWidget` showing the cost of unplaced workers.
*   **Mission Control**: Kanban-style pipeline and "Urgent Actions" feed (AI-driven alerts).
*   **Territory Map**: Interactive map with Isochrone Analysis (commute polygons).

**🧪 Testing Procedure:**
1.  **Verify Stats**: Click "Active Placements" card. Ensure the modal opens and lists deployed candidates.
2.  **Check Risks**: Verify the "Bench Liability" widget shows a dollar amount.
3.  **Map Interaction**: Click a project marker on the map. Ensure the "Project Intelligence" panel slides out.
4.  **Action Feed**: Click an "Urgent" card in the Mission Control feed. Verify it navigates to the relevant entity.

### 3.2 CRM & Relationship Intelligence
**Route:** `/crm`
A Relationship Management system tailored for construction, featuring a "Virtual Assistant" board.

**Key Features:**
*   **Client Action Board**: A top-level Kanban board showing "Fires & Risks", "Today's Tasks", "Active Deals", and "Buying Signals".
*   **Deal Ticket**: A dedicated modal for managing the sales pipeline (Float -> Interview -> Offer -> Deployed).
*   **Client Intelligence Panel**: Detailed view with "Relationship DNA" (Contact influence, coffee orders) and "Project Linking".

**🧪 Testing Procedure:**
1.  **Kanban Interaction**: In "Active Deals", click "View" on a card. Ensure "Deal Ticket" modal opens.
2.  **Move Deal**: In the Deal Ticket, click "Log Interview". Verify status updates to "Interview".
3.  **Client Details**: Click a Client Card in the grid. Check the "People" tab for contact details and "Projects" tab for linked jobs.
4.  **Deploy**: In a Deal Ticket, click "Deploy Candidate". Verify the candidate appears in the "Active Placements" list on the Dashboard.

### 3.3 Financial Command Center
**Route:** `/financials`
A dedicated Profit & Loss (P&L) dashboard for the recruitment desk.

**Key Features:**
*   **The Ledger**: Real-time snapshot of Weekly Revenue, Payroll (with 20% burden), and Net Profit.
*   **Bench Bleed**: A prioritized list of "Available" candidates costing money. Includes a **"Float Now"** action.
*   **Margin Optimizer**: A list of active placements sorted by lowest margin to highlight renegotiation opportunities.
*   **Forecasting**: Visualizes the weighted value of the sales pipeline.

**🧪 Testing Procedure:**
1.  **Check Totals**: Ensure "Net Weekly Profit" is Green (positive) or Red (negative).
2.  **Action Bench**: Click "Float Now" on a liability row. Verify the Float Candidate Modal opens.
3.  **Check Margins**: Click a low-margin row in "Margin Optimizer". Verify it opens the relevant Deal Ticket.

### 3.4 Candidate Pool & Bench Management
**Route:** `/candidates`
A hybrid Grid/Roster view for managing talent.

**Key Features:**
*   **Roster View**: High-density table for managing "Available" candidates. Shows "Days on Bench" and specific tags (Vehicle, Tools).
*   **Hot List Generator**: Multi-select candidates to generate a formatted WhatsApp blast for clients.
*   **Candidate Profile**: Detailed modal with Financials, Compliance (Site Safe, Visa), and Employment history.

**🧪 Testing Procedure:**
1.  **Toggle Views**: Switch between "Grid" and "Roster" views using the toolbar.
2.  **Filter Bench**: Click the "On The Bench" metric card. Verify view switches to Roster and shows only available candidates.
3.  **Generate Blast**: Select 2 candidates in Roster view -> Click "Generate Hot List" -> Verify text is copied/displayed.
4.  **Edit Status**: Open a profile -> Click "Edit" -> Change Status to "On Job". Verify this updates the Dashboard "Active Placements" count.

### 3.5 Market Intelligence
**Route:** `/market`
A map-centric view of construction activity.

**Key Features:**
*   **Project Timeline**: Visualizes construction phases (Excavation, Structure, Fit-out).
*   **Buying Signals**: AI prediction of labor needs based on project phase transitions.

---

## 4. Key Workflows

### 4.1 The "Float" Workflow (Sales)
1.  Identify a candidate on the Bench (Financials Page or Candidate Page).
2.  Click **"Float"**.
3.  Select Client, Project, and Contact.
4.  Input Pay Rate & Charge Rate (System calculates Margin).
5.  Click **"Send Float"**.
6.  **Result:** Creates a `Placement` record in "Floated" status. Appears on CRM Kanban board.

### 4.2 The "Deployment" Workflow (Operations)
1.  Open a **Deal Ticket** (CRM Page) in "Offer" status.
2.  Click **"Deploy Candidate"**.
3.  **Result:**
    *   Placement status -> "Deployed".
    *   Candidate status -> "On Job".
    *   Active Placements count increases.
    *   Weekly Revenue/Payroll figures update automatically.

---

## 5. Data Architecture
The app uses a `DataContext` to simulate a relational database with the following entities:
*   **Candidates**: Supply pool.
*   **Clients**: Companies hiring labor.
*   **Projects**: Construction sites (linked to Clients).
*   **Placements**: The link between Candidate and Project (Financials, Dates, Status).
*   **MoneyMoves**: The "Action Engine" that generates alerts based on logic rules (e.g., "Visa Expiring", "Project Starting").

## 6. Development Guide
*   **Add New Page**: Create `app/page-name/page.js`, update `components/sidebar.js`.
*   **Modify Logic**: Edit `context/data-context.js` or `services/construction-logic.js`.
*   **Styling**: Use `glass-panel` and `modern-card` classes for consistent UI.