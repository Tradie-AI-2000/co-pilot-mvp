# Architecture Documentation: Co-Pilot

## Executive Summary
Co-Pilot is a Next.js 16 application leveraging the App Router for server-side rendering, API routes, and client-side interactivity. The architecture is a **Layered Monolith** built upon **Supabase** as a comprehensive Backend-as-a-Service (BaaS) provider, designed for high performance, geospatial visualization, and real-time data integration. It features a specialized **Agent Layer** for AI-driven business intelligence and decision support.

## Technology Stack
- **Framework**: Next.js 16.0.8
- **Frontend**: React 19, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes (Route Handlers) & Supabase
- **Backend-as-a-Service**: Supabase (Postgres, Auth, Storage)
- **Database ORM**: Drizzle ORM
- **Client-Side Data Fetching**: SWR
- **State Management**: React Context (`DataContext`, `CrewContext`)
- **Mapping**: Leaflet/React-Leaflet
- **External APIs**: Gemini AI (gemini-2.0-flash)
- **Agent Framework**: BMad Method (BMad Builder/Monitor)

## Architecture Pattern: Next.js App Router on Supabase (Layered)

### 1. Presentation Layer (`app/`, `components/`)
- **App Router**: Organizes routes and layouts.
- **Client Components**: Used for interactive elements (maps, drag-and-drop, modals). Data fetching is often handled by **SWR** for caching, revalidation, and a reactive user experience.
- **Server Components**: Used for initial data fetching and static layouts.
- **Portal (`components/portal/`)**: A dedicated client-facing interface for project management, timesheets, and health & safety reporting.

### 2. State Management Layer (`context/`)
- **DataContext**: Centralized state for global data (clients, candidates, projects) fetched from Supabase.
- **CrewContext**: Specific state for the "Crew Builder" functionality, managing temporary "Draft Squads" and compliance validation.

### 3. Agent & Intelligence Layer (`_bmad/`, `lib/intel-engine.js`)
- **BMad Framework**: Resides in `_bmad/`, implementing autonomous agents (GM, Scout, Sales, Candidate, Accountant).
- **Agent Logic**: specialized workflows and manifests (`_config/`) that define agent personas and tool access.
- **Intelligence Engine (`lib/intel-engine.js`)**: A data processing engine that queries Supabase using Drizzle to generate high-level business intelligence, providing the "brain" for the Command Centre.

### 4. Business Logic Layer (`services/`, `lib/`)
This layer contains the core business rules and data processing engines.
- **Logic Hub (`services/logic-hub.js`)**: Acts as a central facade. It orchestrates calls to specialized modules like `ConstructionLogic`, `GrowthLogic`, and `NudgeLogic`.
- **Specialized Logic Modules**:
    - **`ConstructionLogic`**: Encapsulates construction phases, role matrixes, and project lifecycle scheduling.
    - **`GrowthLogic`**: Handles lead generation, business development scripts, and revenue projections.
    - **`NudgeLogic`**: The rule engine for generating proactive alerts and "Buy Signals" based on database triggers.

### 5. Data Access & Integration Layer (`app/api/`, `lib/db/`, `supabase/`)
- **Supabase**: The core data layer providing Postgres, Auth, and Storage.
- **Drizzle ORM (`lib/db/`)**: The primary, type-safe query builder for interacting with the Supabase Postgres database.


## Data Flow
1. **User Interaction**: Triggered in React components.
2. **Data Fetching/Mutation**:
    - **Client-Side**: Components use **SWR** hooks to call internal API routes (`app/api`).
    - **Server-Side**: Server Components or API routes directly query Supabase via Drizzle.
3. **Agent Loop**: The **Command Centre** triggers AI agents via `/api/agent`, passing real-time database context (financials, candidates, risks) to generate strategy directives.
4. **Response & UI Update**: SWR manages the state update on the client, while agent responses are streamed back to the Command Centre UI.

## Security
- **Authentication**: Managed by **Supabase Auth**.
- **Authorization**: Enforced via **Supabase Row-Level Security (RLS)** and secure API Route Handlers.
- **Environment Variables**: Stored in `.env.local`, including the `GOOGLE_GENERATIVE_AI_API_KEY` for the `gemini-2.0-flash` model.
