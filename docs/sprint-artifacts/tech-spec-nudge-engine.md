# Tech-Spec: The Nudge Engine (Algorithmic Sales Director)

**Created:** 2026-01-05
**Status:** Ready for Development
**Module:** Business Development (BD)

## 1. Overview

### Problem Statement
The current BD dashboard relies on the consultant to *actively search* for insights ("Pull" model). This leads to missed opportunities due to cognitive load and decision paralysis.

### Solution
Upgrade the system to a **"Push" model** by building a **Nudge Engine**. This logic layer runs in the background, continuously scanning data (Project Lifecycle, Candidate Rosters, Weather, CRM) to generate high-value **"Action Cards"** (Nudges) that appear in the consultant's "Mission Control" feed.

### Scope
*   **In Scope:**
    *   Backend Logic Engine (Next.js API Routes).
    *   Database Schema Update (`nudges`, `search_logs` tables).
    *   The 5 Core Agents (Pre-emptive, Churn, Zombie, Stalker, Rainmaker).
    *   **Google Sheets Integration** for Data Ingestion (ETL).
*   **Out of Scope:**
    *   Full UI Redesign (we will feed existing UI widgets for now).
    *   Production API Key procurement.

---

## 2. Architecture: Hybrid Event Strategy

We will use a **Hybrid (Cron + Webhook)** approach to balance timeliness with resource efficiency.

### A. The "Daily Sweep" (Cron)
*   **Trigger:** Vercel Cron (`07:00 AM NZDT`).
*   **Endpoint:** `/api/cron/generate-nudges`
*   **Responsibilities:** Predictable, time-based logic.
    *   *Churn Interceptor* (End Dates)
    *   *Client Stalker* (Last Contact)
    *   *Rainmaker* (Weather Forecast)
*   **Performance:** All heavy geospatial queries must execute via **PostGIS/SQL**.
*   **Rate Limiting:** Interactions with external APIs (JobAdder) **MUST** use batch processing (Chunk Size: 50) to prevent 429 errors.

### B. The "Live Trigger" (Webhook)
*   **Trigger:** Google Sheets Apps Script (The "Poor Man's ETL").
*   **Endpoint:** `/api/webhooks/bci-ingest`
*   **Responsibilities:** Unpredictable, high-value events.
    *   *Pre-emptive Strike* (New Project Starts)
    *   *Zombie Hunter* (New Location activation)

---

## 3. Data Schema & Persistence

### PostGIS Prerequisite (CRITICAL)
Before running migrations, the database **MUST** have PostGIS enabled.
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### New Table: `nudges`
The Agent's memory. Tracks what was recommended and the outcome.

```typescript
// db/schema.ts updates

export const nudgeTypeEnum = pgEnum('nudge_type', [
  'PRE_EMPTIVE_STRIKE', // New Project
  'CHURN_INTERCEPTOR',  // Retention Risk
  'ZOMBIE_HUNTER',      // Dormant Candidate
  'CLIENT_STALKER',     // CRM Decay
  'RAINMAKER'           // Weather Event
]);

export const nudgePriorityEnum = pgEnum('nudge_priority', ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const nudges = pgTable('nudges', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: nudgeTypeEnum('type').notNull(),
  priority: nudgePriorityEnum('priority').notNull(),
  
  // The "Why"
  title: text('title').notNull(),
  description: text('description').notNull(),
  
  // The "Action" Payload (JSON for flexibility)
  actionPayload: jsonb('action_payload').notNull(),
  
  // Ownership Logic
  consultantId: uuid('consultant_id').references(() => users.id), // NULL = Open Bounty
  
  // Links
  relatedProjectId: uuid('related_project_id').references(() => projects.id),
  relatedClientId: uuid('related_client_id').references(() => clients.id),
  relatedCandidateId: uuid('related_candidate_id').references(() => candidates.id),
  
  // State
  isSeen: boolean('is_seen').default(false),
  isActioned: boolean('is_actioned').default(false),
  snoozedUntil: timestamp('snoozed_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

### New Table: `search_logs`
Required for the "Zombie Hunter" to know if a consultant has neglected a region.

```typescript
export const searchLogs = pgTable('search_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  consultantId: uuid('consultant_id').references(() => users.id).notNull(),
  location: text('location'), // e.g., "Manukau"
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
  filters: jsonb('filters'), // Role, keywords, etc.
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## 4. The 5 Core Agents (Logic Rules)

### 1. The "Pre-emptive Strike" (New Projects)
*   **Trigger:** `Webhook (ProjectSignal)` from Google Sheets.
*   **Logic:**
    1.  Check internal DB: Do we have active placements on this `externalId`? (If > 0, abort).
    2.  Check Supply: `PostGIS` query for `Available` candidates within `5km`.
    3.  If `Supply > 0` AND `Placements == 0`: **Trigger Nudge**.
*   **Owner:** NULL (Open Bounty).

### 2. The "Churn Interceptor" (Retention)
*   **Trigger:** `Cron`
*   **Logic:**
    1.  Find active placements where `finishDate` is within `3 days`.
    2.  Find **Open** Orders/Projects within `5km` of candidate's home.
    3.  If found: **Trigger Nudge** ("Redeploy to Project X").
    4.  If not found: **Trigger Nudge** ("Call to extend").
*   **Owner:** `consultantId` (Placement Owner).

### 3. The "Zombie Hunter" (Database Resurrection)
*   **Trigger:** `Webhook (New Project)` OR `Cron`
*   **Logic:**
    1.  Identify `New Project` location (Lat/Lng).
    2.  **Query `search_logs`**: Have we queried within `10km` of this point in the last 90 days?
    3.  If `No Activity` AND `Dormant Candidates (in DB) > 10`: **Trigger Nudge**.
*   **Owner:** NULL (Open Bounty).

### 4. The "Client Stalker" (CRM Health)
*   **Trigger:** `Cron`
*   **Constraint:** **BATCH PROCESSING REQUIRED**. Process clients in chunks of 50 to avoid JobAdder API Rate Limits.
*   **Logic:**
    1.  Query JobAdder Service for `LastNoteDate` (Single Source of Truth).
    2.  If `Client.Tier == 1` AND `LastNoteDate > 14 Days`: **Trigger Nudge**.
*   **Owner:** `consultantId` (Account Manager).

### 5. The "Rainmaker" (Weather)
*   **Trigger:** `Cron` (Morning)
*   **Logic:**
    1.  Check `WeatherProvider`.
    2.  If `Rain > Threshold`: Find `Outdoor` placements + `Indoor` orders.
    3.  **Trigger Nudge** ("Rain Blitz").
*   **Owner:** NULL.

---

## 5. Data Ingestion Architecture (The Staging Layer)

We use **Google Sheets** as a "Poor Man's ETL" to clean and geocode data before it hits the app.

### Components
1.  **Google Sheet**: "Stellar Intelligence Staging".
    *   Columns: `External ID`, `Project Name`, `Address`, `Value`, `Stage`.
2.  **Apps Script**:
    *   Validates Address.
    *   Uses **Google Maps Service** (built-in) to geocode `Address` -> `Lat/Lng`.
    *   POSTs JSON to `/api/webhooks/bci-ingest`.

### Project Signal Interface
The Webhook receives this *clean* payload:
```typescript
type ProjectSignal = {
  externalId: string;
  title: string;
  lat: number;   // Calculated by Google Sheets
  lng: number;   // Calculated by Google Sheets
  value: number;
  stage: 'CONCEPT' | 'TENDER' | 'CONSTRUCTION' | 'FIT_OUT';
  contractorId?: string; 
};
```

---

## 6. Implementation Plan

### Phase 1: Foundation
- [ ] **DB Setup**: Run `CREATE EXTENSION postgis;` on the database.
- [ ] **Schema Migration**: Add `nudges` and `search_logs` tables.
- [ ] **Service Layer**: Create `services/nudge-logic/` directory.

### Phase 2: The Watchers (Cron)
- [ ] **Cron Endpoint**: Create `app/api/cron/generate-nudges/route.ts`.
- [ ] **Client Stalker**: Implement with **Batching (Chunk Size 50)**.
- [ ] **Rainmaker**: Implement with `MockWeatherProvider`.

### Phase 3: The Ingestion (Webhook)
- [ ] **Webhook Endpoint**: Create `app/api/webhooks/bci-ingest/route.ts`.
- [ ] **Validation**: Ensure webhook accepts only valid `ProjectSignal` payloads (simulating the Google Sheet push).

### Phase 4: UI Hookup
- [ ] **Dashboard Integration**: Wire `app/page.js` to fetch from `nudges` table.