# Source Tree Analysis: Co-Pilot

## Repository Structure: Monolith

Co-Pilot is a single-part Next.js application. Below is the annotated directory structure highlighting critical paths.

```
project-root/
├── app/                # Next.js App Router (Routes & API)
│   ├── api/            # Route Handlers (Internal API)
│   │   ├── candidates/ # Candidate endpoints
│   │   ├── projects/   # Project endpoints
│   │   └── sync/       # Google Sheets / JobAdder sync
│   ├── crm/            # Client Relationship Management views
│   ├── market/         # Market Intelligence views
│   ├── projects/       # Project management views
│   ├── layout.js       # Root layout (Navigation, Providers)
│   └── page.js         # Main Dashboard
├── components/         # Reusable UI Components
│   ├── dashboard/      # Stat cards, widgets
│   ├── mapping/        # Leaflet map components
│   ├── modals/         # Dialogs for data entry
│   └── shared/         # Cards, sidebars, buttons
├── context/            # React Context Providers (State)
│   ├── data-context.js # Primary global state
│   └── crew-context.js # Specialized crew builder state
├── lib/                # Shared Library Code
│   └── db/             # Drizzle ORM schema & client
├── services/           # Business Logic Layer
│   ├── nudge-logic/    # Proactive alert engine
│   ├── google-sheets.js# Google Sheets API integration
│   ├── job-adder.js    # JobAdder API integration
│   └── mock-data.js    # Development mock data
├── scripts/            # Maintenance & Utility Scripts
├── public/             # Static Assets (Images, Icons)
├── types/              # TypeScript Definitions
├── package.json        # Dependencies & Scripts
└── next.config.mjs     # Next.js Configuration
```

## Critical Directories

### `/app`
The heart of the application. It defines the routing structure and the API endpoints. Every folder corresponds to a URL path.

### `/components`
A flat directory containing over 50 specialized UI components. This is the primary area for UI development and refinement.

### `/services`
Contains the "brains" of the application. The logic here is independent of the UI and handles data transformation, external API communication, and business rules.

### `/lib/db`
Contains the database definition using Drizzle ORM. `schema.ts` is the single source of truth for the database structure.

## Entry Points
- **Client**: `app/page.js` (Dashboard) and `app/layout.js` (Provider injection).
- **Server**: `app/api/` route handlers.
- **Database**: `lib/db/index.js` (Drizzle client).