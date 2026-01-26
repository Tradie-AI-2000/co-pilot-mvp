# Architecture Documentation: Co-Pilot

## Executive Summary
Co-Pilot is a Next.js 16 application leveraging the App Router for server-side rendering, API routes, and client-side interactivity. The architecture is a **Layered Monolith** built upon **Supabase** as a comprehensive Backend-as-a-Service (BaaS) provider, designed for high performance, geospatial visualization, and real-time data integration.

## Technology Stack
- **Framework**: Next.js 16.0.8
- **Frontend**: React 19, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes (Route Handlers) & Supabase
- **Backend-as-a-Service**: Supabase (Postgres, Auth, Storage)
- **Database ORM**: Drizzle ORM
- **Client-Side Data Fetching**: SWR
- **State Management**: React Context (DataContext)
- **Mapping**: Leaflet/React-Leaflet
- **External APIs**: JobAdder, Google Sheets, Gemini AI

## Architecture Pattern: Next.js App Router on Supabase (Layered)

### 1. Presentation Layer (`app/`, `components/`)
- **App Router**: Organizes routes and layouts.
- **Client Components**: Used for interactive elements (maps, drag-and-drop, modals). Data fetching is often handled by **SWR** for caching, revalidation, and a reactive user experience.
- **Server Components**: Used for initial data fetching and static layouts where appropriate.
- **Custom Components**: A rich library of UI widgets and modals located in `components/`.

### 2. State Management Layer (`context/`)
- **DataContext**: Centralized state for global data (clients, candidates, projects) fetched from the backend.
- **CrewContext**: Specific state for the "Crew Builder" functionality.
- **Local Storage**: Used for session persistence and non-sensitive UI state.

### 3. Business Logic Layer (`services/`, `lib/`)
This layer contains the core business rules and data processing engines.
- **Logic Hub (`services/logic-hub.js`)**: Acts as a central facade or "protocol router". It exposes functions that orchestrate calls to other, more specialized logic modules based on a given protocol (e.g., `COMMISSION_AUDIT`, `TENDER_INTEL`).
- **Specialized Logic Modules**:
    - **`ConstructionLogic`**: Encapsulates logic for construction phases and schedules.
    - **`GrowthLogic`**: Handles lead generation and business development algorithms.
    - **`NudgeLogic`**: The rule engine for generating proactive alerts.
- **Service Modules**:
    - **`ProjectService`**: Manages the CRUD operations and state for project entities.
- **Intelligence Engine (`lib/intel-engine.js`)**: A data processing engine that queries the database using Drizzle to generate higher-level business intelligence, such as "Tender Scout" reports.

### 4. Data Access & Integration Layer (`app/api/`, `lib/db/`, `supabase/`)
- **Supabase**: The core of the data layer. It provides:
    - A managed **Postgres Database**.
    - **Supabase Auth** for user authentication and authorization.
    - **File Storage** and other backend services.
- **API Routes**: Handle internal requests from the UI, often acting as a proxy or secure interface to the Supabase backend.
- **Drizzle ORM (`lib/db/`)**: The primary, type-safe query builder for interacting with the Supabase Postgres database from server-side code.
- **External Connectors**: `google-sheets.js` and `job-adder.js` for third-party data synchronization.

## Data Flow
1. **User Interaction**: Triggered in React components.
2. **Data Fetching/Mutation**:
    - **Client-Side**: Components use **SWR** hooks to call internal API routes (`app/api`).
    - **Server-Side**: Server Components or API routes directly query the database.
3. **API Route Handling**: The API route receives the request and uses a service from the **Business Logic Layer**.
4. **Database Interaction**: The service or logic module uses **Drizzle ORM** to execute queries against the **Supabase Postgres DB**.
5. **Response & UI Update**: The data is returned through the layers. SWR manages the state update on the client, triggering a re-render of affected components.

## Geospatial Strategy
Co-Pilot uses Leaflet for geospatial visualization. Data is enriched with coordinates (Lat/Lng) stored in the Supabase database. Components like `RealMap` and `CandidateMap` render this data dynamically using `react-leaflet`.

## Security
- **Authentication**: Managed by **Supabase Auth**, as configured in `supabase/config.toml`. This handles user sign-up, sign-in, and session management (JWTs).
- **Authorization**: Supabase's **Row-Level Security (RLS)** can be used to enforce data access policies at the database level, ensuring users can only access data they are permitted to see.
- **Environment Variables**: Sensitive keys (Supabase URL, service keys, API secrets) are stored in `.env` files and are not tracked in Git.
- **API Routes**: Act as a secure backend-for-frontend (BFF), preventing direct, unauthenticated access to backend services from the client.