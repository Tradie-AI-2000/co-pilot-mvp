# Co-Pilot

## Project Overview

Co-Pilot is a comprehensive labour hire management platform built with Next.js 16. It serves as a centralized hub for managing recruitment consultants, clients, candidates, and projects, specifically tailored for the construction and labour hire industry.

It leverages a monolithic layered architecture with a strong emphasis on geospatial data (Leaflet), real-time updates (SWR + Supabase), and AI integration (Google Generative AI + BMad Agents).

### Tech Stack

-   **Framework:** Next.js 16 (App Router)
-   **Frontend:** React 19, Tailwind CSS, Lucide Icons
-   **Backend:** Next.js API Routes, Supabase (Postgres, Auth, Storage)
-   **Database ORM:** Drizzle ORM
-   **State Management:** React Context (DataContext, CrewContext), SWR
-   **Mapping:** Leaflet, React-Leaflet
-   **AI:** Google Generative AI, BMad Method (Agent Framework)

## Architecture

The application follows a **Layered Monolith** pattern:

1.  **Presentation Layer (`app/`, `components/`)**:
    -   Next.js App Router for routing.
    -   Client Components for interactivity (maps, drag-and-drop).
    -   Server Components for initial data fetching.
2.  **State Layer (`context/`)**:
    -   `DataContext`: Global state for core entities.
    -   `CrewContext`: Specific state for crew building.
3.  **Business Logic Layer (`services/`, `lib/`)**:
    -   `logic-hub.js`: Facade/Router for specialized logic modules.
    -   `intel-engine.js`: Business intelligence processing via Drizzle.
    -   Specialized logic: `ConstructionLogic`, `GrowthLogic`, `NudgeLogic`.
4.  **Data Layer (`app/api/`, `lib/db/`, `supabase/`)**:
    -   Supabase for Database and Auth.
    -   Drizzle ORM for type-safe database queries.
    -   External connectors: `google-sheets.js`, `job-adder.js`.

## Build and Run

### Prerequisites
-   Node.js v18+
-   PostgreSQL instance (or Supabase project)
-   Environment variables in `.env.local` (see `docs/development-guide.md`)

### Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the development server at http://localhost:3000 |
| `npm run build` | Build the application for production |
| `npm run lint` | Run ESLint for code quality |
| `npx drizzle-kit push` | Push schema changes to the database |
| `npx drizzle-kit studio` | Open Drizzle Studio to explore the database |

## Development Conventions

-   **Components**: Place reusable UI components in `components/`. Use `"use client"` directive for interactive components.
-   **Database**:
    -   Modify schema in `lib/db/schema.ts`.
    -   Sync changes using `npx drizzle-kit push`.
    -   Update services in `services/` to reflect schema changes.
-   **API**: Create new endpoints in `app/api/` using standard Next.js Route Handlers (`route.js`).
-   **Mapping**: Use `react-leaflet` components in `components/` for map visualizations.
-   **Agents**: Agent configurations and logic reside in `_bmad/`. Refer to `_bmad/bmb/README.md` for extending agents.

## Documentation

-   `docs/index.md`: Master Documentation Index.
-   `docs/development-guide.md`: Detailed setup and dev patterns.
-   `docs/architecture.md`: In-depth architectural breakdown.
-   `_bmad/bmb/README.md`: BMad Builder Module documentation.
