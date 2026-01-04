# Epic Technical Specification: Operational Foundations (Crews & Project Lifecycles)

Date: 2025-12-23
Author: Joe
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the operational foundations for the Stellar Co-Pilot app. This involves setting up the primary database schema using Drizzle ORM to support "Crews" and "Project Lifecycles" and implementing a secure backend proxy for Mapbox isochrone requests to visualize commute zones.

## Objectives and Scope

**In-Scope:**
- Define Drizzle schema for `crew_templates`, `crew_template_members`, `placement_groups`, and `placements`.
- Implement API route `/api/geo/isochrone` to proxy Mapbox requests.
- Ensure type safety by exporting Drizzle types to `@/types/db.ts`.
- Maintain "Stellar Glass" aesthetic in any initial UI scaffolding.

**Out-of-Scope:**
- Implementing the "Squad Builder" frontend (Epic 3).
- Real-time communications (WhatsApp Blast) (Epic 4).

## System Architecture Alignment

- **Database:** Supabase/PostgreSQL with PostGIS extension.
- **ORM:** Drizzle ORM (snake_case database, camelCase code).
- **Backend:** Next.js App Router API Routes.
- **Security:** Proxying Mapbox calls to protect API keys via `/api/geo/isochrone`.
- **State Management:** `CrewContext` for drafts, SWR for server-data.

## Detailed Design

### Services and Modules

| Service/Module | Responsibility |
| :--- | :--- |
| `lib/db/schema.ts` | Define database tables and enums. |
| `app/api/geo/isochrone` | Proxy Mapbox API calls with caching. |
| `@/types/db.ts` | Centralized type definitions inferred from Drizzle schema. |

### Data Models and Contracts

```typescript
// Enums
export const placementStatusEnum = pgEnum('placement_status', ['draft', 'active', 'completed', 'cancelled']);
export const candidateStatusEnum = pgEnum('candidate_status', ['available', 'on_job', 'placed', 'unavailable']);

// Tables
export const crewTemplates = pgTable('crew_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const crewTemplateMembers = pgTable('crew_template_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').references(() => crewTemplates.id).notNull(),
  candidateId: uuid('candidate_id').references(() => candidates.id).notNull(),
});

export const placementGroups = pgTable('placement_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  startDate: timestamp('start_date', { withTimezone: true }),
  status: placementStatusEnum('status').default('draft'),
});

export const placements = pgTable('placements', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => placementGroups.id).notNull(),
  candidateId: uuid('candidate_id').references(() => candidates.id).notNull(),
  status: placementStatusEnum('status').default('draft'),
});
```

### APIs and Interfaces

**`GET /api/geo/isochrone`**
- **Query Params:**
  - `lat`: latitude (number)
  - `lng`: longitude (number)
  - `minutes`: commute time in minutes (number)
- **Response:** GeoJSON FeatureCollection containing the isochrone polygon.
- **Caching:** 7-day TTL (Vercel KV/Redis recommended).

### Workflows and Sequencing

1. **Schema Definition**: Implementation of `lib/db/schema.ts` and export to `types/db.ts`.
2. **API Proxy**: Implementation of the Mapbox proxy route with environment variable security.

## Non-Functional Requirements

### Performance
- Mapbox isochrone proxy responses should be cached to minimize external API calls and latency.
- Database schema optimized for lookup by `projectId` and `candidateId`.

### Security
- Mapbox API tokens MUST NOT be exposed to the client.
- All database interactions must use Drizzle with proper type safety.

### Reliability/Availability
- Use Supabase connection pooling for database stability.
- Handle Mapbox API errors gracefully with fallback or informative messages.

### Observability
- Log API proxy requests and errors.

## Dependencies and Integrations

- `drizzle-orm`: Core ORM functionality.
- `drizzle-kit`: Migration and prototyping tool.
- `postgres`: PostgreSQL client.
- `swr`: Server-state management (fetching).
- `Mapbox API`: Geospatial isochrone data provider.

## Acceptance Criteria (Authoritative)

1. **Database Schema**: `crew_templates`, `crew_template_members`, `placement_groups`, and `placements` tables are created via Drizzle migration.
2. **Type Safety**: Inferred types are exported to `@/types/db.ts` and usable in TypeScript.
3. **API Proxy**: `GET /api/geo/isochrone` successfully returns a GeoJSON polygon when provided with valid coordinates.
4. **Security**: Mapbox token is successfully retrieved from environment variables on the server only.

## Traceability Mapping

| AC ID | Spec Section | Component | Test Idea |
| :--- | :--- | :--- | :--- |
| AC1 | Data Models | `lib/db/schema.ts` | Verify migration runs successfully on Supabase. |
| AC2 | Detailed Design | `@/types/db.ts` | Check that `db.ts` correctly exports types. |
| AC3 | APIs | `/api/geo/isochrone` | Test endpoint with Postman/cURL with mock params. |
| AC4 | Security | `/api/geo/isochrone` | Verify client cannot see MAPBOX_TOKEN in network tab. |

## Risks, Assumptions, Open Questions

- **Assumption**: Mapbox token is already configured in environment variables as `MAPBOX_ACCESS_TOKEN`.
- **Risk**: PostGIS extension might not be enabled by default in the target Supabase instance.
- **Assumption**: Existing `candidates` and `projects` tables exist and have `uuid` primary keys.

## Test Strategy Summary

- **Unit Testing**: Validate schema definitions.
- **Integration Testing**: Test the isochrone API proxy with valid and invalid parameters.
- **Manual Verification**: Confirm GeoJSON output format.
