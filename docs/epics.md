---
stepsCompleted: [1, 2, 3]
inputDocuments: ['docs/prd.md', 'docs/architecture.md', 'docs/ux-design-specification.md']
---

# Stellar Co-Pilot - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Stellar Co-Pilot, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Talent Management:**
FR1: Users can create a "Crew" entity and assign multiple Candidates to it.
FR2: Users can deploy an entire "Crew" to a Project in a single action.
FR3: Users can filter Candidates/Crews by "Commute Tolerance" (Drive time from Project location).
FR4: Users can view a visual indicator of Candidate availability ("Bench Status").

**Project Management:**
FR5: Users can create Projects using "Lifecycle Templates" (e.g., Civil, Residential) to auto-populate phases.
FR6: Users can view a "Money Moves" feed highlighting Projects with upcoming phase transitions.
FR7: Users can define specific "Start Dates" for Project Phases.

**Communications:**
FR8: Users can select multiple Candidates and generate a pre-filled WhatsApp message.
FR9: Users can view "Visual Compliance Badges" (Site Safe, Visa) on Candidate cards.

**Search & Matching:**
FR10: Users can perform a "Bench Match" search that prioritizes local candidates first, then travelers.
FR11: System must alert users if a selected candidate is outside the "Local" radius (Margin Alert).

### NonFunctional Requirements

NFR1: Performance - "Bench Match" search results must load in < 200ms.
NFR2: UI Responsiveness - Map interactions (pan/zoom with pins) must remain 60fps with up to 500 markers.
NFR3: Reliability - Candidate availability status must be accurate to within the last 4 hours.
NFR4: Security - Mapbox API keys must be proxied via backend route handlers.
NFR5: Performance - Nested backdrop-blur-md must be limited to top-level containers to ensure iPad frame rates.

### Additional Requirements

**Architecture Requirements:**
- Database: Supabase PostgreSQL with PostGIS extension.
- ORM: Drizzle ORM (snake_case database, camelCase code).
- Proxy Requirement: `/app/api/geo/isochrone/route.ts` for Mapbox calls.
- Transactional Integrity: `POST /api/crews/deploy` must be an atomic database transaction.
- State Management: `CrewContext` for drafts, SWR for server-data fetching.
- Type Safety: Export inferred types from `@/types/db.ts`.

**UX Requirements:**
- "Cockpit" Vibe: High-density, dark-mode "Stellar Glass" aesthetic.
- Radius Strategy: Sharp corners (`rounded-sm` or `rounded-md`).
- iPad Interaction: "Tap-to-Select -> Tap-to-Fill" fallback for drag-and-drop.
- Map Pins: Traffic Light System (Green: Safe, Yellow: Margin Risk, Red: Unavailable).
- Live Tally: Real-time cost/headcount header updating on every candidate change.

### FR Coverage Map

FR1: Epic 1 - Operational Foundations
FR2: Epic 4 - Deployment & Comms
FR3: Epic 2 - Geospatial Bench Matching
FR4: Epic 2 - Geospatial Bench Matching
FR5: Epic 1 - Operational Foundations
FR6: Epic 4 - Deployment & Comms
FR7: Epic 1 - Operational Foundations
FR8: Epic 4 - Deployment & Comms
FR9: Epic 3 - Interactive Squad Assembly
FR10: Epic 2 - Geospatial Bench Matching
FR11: Epic 3 - Interactive Squad Assembly

## Epic List

### Epic 1: Operational Foundations (Crews & Project Lifecycles)
Establish the underlying data model and persistence for Crews and Project Phases to enable all future automated workflows.
**FRs covered:** FR1, FR5, FR7

### Epic 2: Geospatial Bench Matching (The Tactical View)
Visualize candidate locations and commute zones on a map to rapidly identify local talent.
**FRs covered:** FR3, FR4, FR10

### Epic 3: Interactive Squad Assembly (The Builder)
Efficiently build project squads using drag-and-drop mechanics with real-time financial and compliance feedback.
**FRs covered:** FR9, FR11

### Epic 4: Deployment & Flash Comms (Execution)
Commit squads to projects and blast communications to candidates to close jobs instantly.
**FRs covered:** FR2, FR6, FR8

---

## Epic 1: The Crew Engine (Foundation)

**Goal:** Establish the Drizzle data model and API proxies required to support "Crew" entities.

### Story 1.1: Database Schema Migration
**As a** Backend Developer,
**I want** to create the `crew_templates` and `placement_groups` tables,
**So that** we can persist the "Split Crew" data model.

**Acceptance Criteria:**
- **Given** a Supabase PostgreSQL instance
- **When** the Drizzle migrations are run
- **Then** the `crew_templates`, `crew_template_members`, `placement_groups`, and `placements` tables are created with the specific fields and FKs defined in `lib/db/schema.ts`.
- **And** the `placement_status` and `candidate_status` enums are correctly initialized.

**Integration Target:**
- **New File:** `lib/db/schema.ts`
- **Existing Context:** Must reference existing `candidates` and `projects` tables for Foreign Keys.

### Story 1.2: Mapbox Isochrone Proxy
**As a** System,
**I want** a secure API route `/api/geo/isochrone`,
**So that** I can proxy requests to Mapbox.

**Acceptance Criteria:**
- **Given** a valid Mapbox API Token in environment variables
- **When** a GET request is made to `/api/geo/isochrone` with `lat`, `lng`, and `minutes`
- **Then** the system proxies the request to Mapbox and returns the GeoJSON polygon.
- **And** the response is cached in Vercel KV/Redis with a 7-day TTL.

**Integration Target:**
- **New File:** `app/api/geo/isochrone/route.ts`
- **Existing Context:** Use existing env var `MAPBOX_ACCESS_TOKEN`.

---

## Epic 2: The Bench Match Map (Visualization)

**Goal:** Upgrade the existing map to visualize commute zones and dynamic pins.

### Story 2.1: Upgrade GeospatialMap Component
**As a** Recruiter,
**I want** to see the "Green Zone" (Commute Polygon) on the map,
**So that** I can identify local talent.

**Acceptance Criteria:**
- **Given** an active project selection
- **When** the "Commute" filter is toggled ON
- **Then** the `GeospatialMap` accepts new prop `isochroneData` (GeoJSON).
- **And** renders a `<Polygon />` (Leaflet) as an emerald-green overlay when data is present.
- **And** existing map markers remain visible.

**Integration Target:**
- **Modify File:** `components/GeospatialMap.js` (Do NOT create a new map component).
- **Modify File:** `app/page.js` (PredictiveCommandCenter) to fetch data and pass it to the map.

### Story 2.2: Dynamic Pin Colors
**As a** User,
**I want** pins to change color based on the "Green Zone,"
**So that** I can see margin risks.

**Acceptance Criteria:**
- **Given** a project location and its isochrone polygon
- **When** candidates are rendered on the map
- **Then** existing markers change color:
    - Inside Polygon: Green.
    - Outside Polygon: Yellow.
    - Unavailable: Red (semi-transparent).

**Integration Target:**
- **Modify File:** `components/GeospatialMap.js` (Update the `renderMarkers` logic).

---

## Epic 3: The Squad Builder (Interaction)

**Goal:** Inject the "Fantasy Football" panel into the Dashboard with high-performance interactions.

### Story 3.1: Inject Floating Crew Panel
**As a** User,
**I want** a collapsible panel on the right side of the Dashboard,
**So that** I can build my crew.

**Acceptance Criteria:**
- **Given** the Dashboard view
- **When** the "Build Crew" action is triggered
- **Then** `CrewBuilderPanel` renders on the right side of the screen.
- **And** the panel is collapsible on iPad and includes a "Pin" toggle for desktop.
- **And** the Map (Center) maintains situational awareness.

**Integration Target:**
- **Modify File:** `app/page.js` (PredictiveCommandCenter).
- **Logic:** Wrap the existing grid in a `CrewContext` provider. Insert `<CrewBuilderPanel />` adjacent to the main content.

### Story 3.2: High-Performance Drag-and-Drop
**As a** User,
**I want** to drag candidates from the Map into the Panel,
**So that** I can fill slots intuitively.

**Acceptance Criteria:**
- **Given** an Action Pin on the map and an empty Crew Slot
- **When** the user drags the pin onto the panel
- **Then** the candidate is assigned to the next available slot.
- **And** the drag preview MUST use CSS `transform: translate()` (not top/left) to ensure 60fps performance on iPad Pro.
- **And** the entire panel area acts as a drop target.

**Integration Target:**
- **Modify File:** `components/GeospatialMap.js` (Wrap markers in `@dnd-kit/core` Draggable).
- **New File:** `components/features/crew-builder/crew-slot.tsx`.

---

## Epic 4: Operational Triggers (Execution)

**Goal:** Commit squads to projects and execute speed-based communications.

### Story 4.1: Atomic Crew Deployment Transaction
**As a** User,
**I want** the 'Deploy' button to commit the PlacementGroup to the DB,
**So that** my work is persisted accurately and safely.

**Acceptance Criteria:**
- **Given** a valid draft crew
- **When** the "Deploy Squad" button is clicked
- **Then** the system calls `POST /api/crews/deploy`.
- **And** the backend MUST execute the creation of `placement_groups` and `placements` within a single SQL transaction.
- **And** if any part fails, the entire operation rolls back (All or Nothing).

**Integration Target:**
- **New File:** `app/api/crews/deploy/route.ts`.
- **Logic:** Use Drizzle's `db.transaction()`.

### Story 4.2: "Flash Blast" WhatsApp Handoff
**As a** User,
**I want** to trigger the WhatsApp Modal from the existing list,
**So that** I can message candidates instantly.

**Acceptance Criteria:**
- **Given** a successfully deployed squad
- **When** the "WhatsApp Blast" action is triggered
- **Then** a modal appears with a pre-templated message.
- **And** clicking "Copy Message" copies text to clipboard and triggers a success animation.

**Integration Target:**
- **Modify File:** `components/ProjectWatchlistCard.js` OR `components/StatCard.js` (Add trigger buttons where relevant).
- **New File:** `components/ui/whatsapp-blaster.tsx`.