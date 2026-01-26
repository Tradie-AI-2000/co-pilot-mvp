# Retrospective Product Requirements Document (PRD)
**Application:** Stellar Recruitment Co-Pilot  
**Version:** 1.0 (As-Built Analysis)  
**Date:** January 21, 2026  
**Status:** Live Prototype / Brownfield

---

## 1. System Overview
The **Stellar Recruitment Co-Pilot** is a high-fidelity "Operating System" for construction and labour-hire recruitment. Unlike traditional CRMs which are passive systems of record, this application is designed as an **active command centre**. It utilizes predictive logic, geospatial intelligence, and AI agents to drive recruiter behavior, optimize margin, and ensure compliance.

The system is built as a **Next.js 16** Monolith, leveraging **React Context** for global state management and **server-side API routes** for AI and third-party integrations.

## 2. Functional Architecture

### 2.1 Core Tech Stack
*   **Framework:** Next.js 16 (App Router)
*   **Frontend:** React 19, Tailwind CSS (implied utility classes), Lucide React (Icons).
*   **State Management:** `DataContext` (Global Entity Store) & `CrewContext` (Squad/Deployment State).
*   **AI Engine:** Google Gemini 2.0 Flash (via `/api/agent`).
*   **Data Layer:** Hybrid Model.
    *   *Primary:* `enhanced-mock-data.js` (Rich static fixtures for dev/demo).
    *   *Services:* `job-adder.js` & `google-sheets.js` connectors for "Live Mode".
    *   *Logic:* Domain-specific service layers (`construction-logic.js`, `growth-logic.js`).

### 2.2 Navigation Structure
*   **Dashboard (`/`)**: Operational "Scoreboard" and Nudge feed.
*   **Command Centre (`/command-centre`)**: AI-driven strategic interface ("Boardroom Chat").
*   **Projects (`/projects`)**: Lifecycle management, Geospatial Map, and Watchlists.
*   **Candidates (`/candidates`)**: Talent pool, Squad Builder, Map Search, and Rosters.
*   **CRM (`/crm`)**: Client management, Tiered Boards, and Relationship Decay tracking.
*   **Business Dev (`/bd`)**: "Golden Hour" call blocks and Tender Radar.
*   **Financials (`/financials`)**: Commission tracking and Forecasting.
*   **Portal (`/portal`)**: Client-facing external view.

---

## 3. Key Features & Capabilities

### 3.1 The Command Centre (AI Core)
**Objective:** Provide executive-level strategic guidance to the recruiter.
*   **Boardroom Chat:** A conversational interface interacting with the `stellar-gm` persona (Gemini 2.0).
*   **Context-Aware:** Injects live financial data (Revenue, Variance) and project states into the AI prompt.
*   **Signal Grid:** Visual status indicators for sub-agents (Sales, IT, Compliance, Finance).
*   **Logic:** `app/api/agent/route.js` implements a "DEFCON" system, changing advice style based on financial variance (e.g., "DEFCON_RED" triggers ruthless sales protocols).

### 3.2 Talent & Workforce Management
**Objective:** Optimize candidate utilization and deployment speed.
*   **Geospatial Intelligence:** `CandidateMap` (wrapping `RealMap`) visualizes talent against project locations using Leaflet. Supports "Isochrone" logic (implied) and margin risk visualization (local vs. travel).
*   **Squad Builder:** A dedicated drag-and-drop interface (`CrewBuilderPanel`) for assembling "Crews" from the bench. Calculates blended pay/charge rates in real-time.
*   **Compliance Engine:** Real-time checks for Visa restrictions (e.g., Filipino workers restricted to specific regions) and ticket expiry (Site Safe).
*   **Redeployment Radar:** Visualizes upcoming "finishers" in buckets (Critical 0-14d, Upcoming 15-28d) to prevent bench rot.

### 3.3 Growth Engine (The Hunter)
**Objective:** Gamify business development and client retention.
*   **Golden Hour Mode:** A focused, high-velocity calling interface.
    *   *Playlists:* Automatically groups targets into "Defense" (Tier 1 @ Risk), "Growth" (Tier 2), and "Revival" (Dormant).
    *   *Scripts:* `growth-logic.js` generates context-aware scripts (e.g., "I have a crew finishing nearby").
*   **Relationship Decay:** Tracks "Days Since Last Contact" across client tiers, visually flagging neglected accounts.
*   **Tender Radar:** Scrapes (simulated) and analyzes construction tenders, estimating role requirements automatically.

### 3.4 Operational Execution
**Objective:** Streamline the complex logistics of construction projects.
*   **Project Builder:** A wizard interface (`ProjectBuilder`) for scoping new jobs, defining trade packages, and estimating workforce needs.
*   **Phase Intelligence:** `construction-logic.js` contains a hardcoded "Knowledge Graph" of construction phases (Civil -> Structure -> Fitout), automatically suggesting relevant trades and timelines.
*   **Flash Blast:** One-click WhatsApp message generation (`WhatsAppBlaster`) for deploying squads with site details and maps.

### 3.5 Client Portal (Stellar Connect)
**Objective:** Provide transparency and self-service to clients.
*   **Features:** Project History, Live Candidate "Shopping" (Cart functionality), Timesheet submission, and H&S reporting.
*   **Architecture:** Shares the same codebase but renders a simplified, client-branded UI shell.

---

## 4. Data Architecture & Logic

### 4.1 Core Entities
*   **Candidate:** High-fidelity profile including `compliance` (Tickets), `financials` (Pay/Charge), `geo` (Lat/Lng), and `relationshipDNA` (soft skills).
*   **Project:** Hierarchical structure. `Project` -> `Packages` (e.g., Concrete) -> `LaborRequirements`.
*   **Client:** Tiered entity (1, 2, 3) with computed `relationshipDecay` and `hiringInsights`.

### 4.2 Business Logic Layers
*   **Construction Logic (`services/construction-logic.js`):**
    *   Maps Phases (e.g., "02a_concrete") to specific Roles ("Steel Fixer", "Formworker").
    *   Defines sequence orders and typical durations to predict future demand.
*   **Growth Logic (`services/growth-logic.js`):**
    *   `calculateReactivationScore`: Algorithms to rank dormant clients based on past revenue and tier.
    *   `getGoldenHourTargets`: Filters top 10 calls for the day.
*   **Compliance Logic:**
    *   `checkVisaCompliance`: Hardcoded rules checking Candidate Nationality vs. Project Region.

---

## 5. Discrepancy Analysis (Planned vs. Built)

| Feature | PRD/Intent | As-Built Status | Notes |
| :--- | :--- | :--- | :--- |
| **Authentication** | Secure Login (NextAuth) | **Mocked** | Portal uses a hardcoded `clientUser` object. |
| **Data Persistence** | Postgres/Supabase | **Hybrid/Mock** | Heavy reliance on `enhanced-mock-data`. `google-sheets.js` exists but "Live Mode" flags are manual. |
| **Geospatial** | Mapbox Isochrone | **Leaflet/Turf** | `RealMap` uses Leaflet. Polygon logic exists but relies on passed prop data. |
| **AI Agent** | "Jarvis" Sidebar | **Full Route** | Implemented as a sophisticated server-side route interacting with Gemini. |
| **Mobile** | Responsive Design | **Partial** | Some complex grids (Squad Builder, Kanban) may struggle on small screens. |

## 6. Recommendations
1.  **Persistence Layer:** Immediate priority is to wire the `DataContext` actions (`addCandidate`, `updateClient`) to a persistent DB (Supabase) or fully enable the Google Sheets sync as the primary store.
2.  **Auth Implementation:** Replace mock Portal login with NextAuth to secure client data.
3.  **Refactoring:** The `candidates/page.js` component is becoming monolithic. Extract `ViewMode` sub-components (Map, Table, Grid) into their own files to improve maintainability.
4.  **Error Handling:** The `api/agent/route.js` has basic error catching, but the frontend `BoardroomChat` needs robust handling for network failures or API quota limits.

---
**Signed:** *Codebase Investigator Agent (B-MAD)*
