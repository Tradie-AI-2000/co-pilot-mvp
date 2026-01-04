---
stepsCompleted: [1, 2, 3]
inputDocuments: ['docs/prd.md', 'docs/ux-design-specification.md', 'docs/index.md', 'docs/analysis/brainstorming-session-2025-12-23.md', 'docs/architecture-initial.md']
workflowType: 'architecture'
lastStep: 3
project_name: 'Stellar Co-Pilot'
user_name: 'Joe'
date: '2025-12-23'
---

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2025-12-23
**Document Location:** docs/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**
- Made 12+ key architectural decisions together (Drizzle, PostGIS, SWR, Proxy).
- Established implementation patterns ensuring AI agent consistency.
- Defined a complete project structure optimized for Next.js 16.
- Validated that all requirements (Crews, Bench Match, iPad Performance) are fully supported.

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing Stellar Co-Pilot. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
Initialize the database schema using the `lib/db/schema.ts` definition and set up the `/api/geo/isochrone` proxy.

**Development Sequence:**
1. Initialize project foundations (Drizzle config, Types).
2. Implement core architectural foundations (Context, API Proxies).
3. Build features following established patterns (Crew Builder, Map Layers).
4. Maintain consistency with documented naming and structure rules.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Hand off to the Product Manager for Epic & Story breakdown.

## 1. Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Extending the existing Talent/Project database into a reactive "Co-Pilot" engine.
- Transition to `Crew` as a primary operational entity.
- Implementation of "Bench Match" geospatial search algorithm.
- Automated sales triggers based on Project Lifecycle templates.

**Non-Functional Requirements:**
- **Performance:** Sub-200ms latency for matching; 60fps UI for iPad Pro.
- **Security:** Backend proxying for third-party Mapbox services.
- **Data Integrity:** Accurate sync between client-side "Draft" state and backend "Deployed" state.

**Scale & Complexity:**
High-complexity interactive system within a monolithic Next.js architecture.
- Primary domain: Web (App Router) / Recruitment Logistics.
- Complexity level: High (Geospatial + Real-time Tally + Drag-and-Drop).
- Estimated architectural components: 12+ (context providers, API proxies, logic layers, hooks).

### Technical Constraints & Dependencies
- **Framework:** Next.js 16 (App Router) / React 19.
- **Infrastructure:** Vercel (Frontend) / Supabase (PostgreSQL).
- **Geospatial:** Mapbox Isochrone API.
- **Communication:** Manual WhatsApp Handoff (V1).

### Cross-Cutting Concerns Identified
- **State Propagation:** Ripple effects from `Project` updates to `Market Intel` scarcity scores.
- **Touch-vs-Mouse Logic:** Multi-modal interaction handlers for the Crew Builder.
- **Performance Budget:** Limiting backdrop-blur to maintain frame rates on iPad.

## 2. Starter Template & Core Stack

### Primary Technology Domain
Web Application (Next.js 16 App Router)

### Core Stack Decisions
*   **Foundation:** Existing Next.js 16 codebase.
*   **Database:** Supabase PostgreSQL.
*   **ORM:** **Drizzle ORM**.
    *   *Rationale:* Faster than Prisma for serverless environments (cold starts), lightweight, and provides excellent support for PostGIS/Geospatial queries.
*   **Caching:** Vercel KV (Redis) for Mapbox proxy caching.
*   **State Management:**
    *   **Client State:** React Context API (`CrewContext`) for real-time "Draft" crew assembly.
    *   **Server State:** SWR (or React Query) for fetching Candidate Pool and Project data ("Store Shelves").

### Implementation Command (for new modules)
```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```
