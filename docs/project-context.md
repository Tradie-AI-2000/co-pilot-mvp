---
project_name: 'Stellar Co-Pilot'
user_name: 'Joe'
date: '2025-12-23'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'data_logic', 'critical_rules']
status: 'complete'
rule_count: 15
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19 / Shadcn UI (Customized)
- **Styling**: Tailwind CSS / CSS Modules
- **Database**: Supabase PostgreSQL / PostGIS
- **ORM**: Drizzle ORM
- **State Management**: React Context (`CrewContext`) / SWR (Server state)
- **Geospatial**: Mapbox Isochrone API
- **Interactions**: @dnd-kit (Drag and Drop)
- **Icons**: Lucide React

---

## Critical Implementation Rules

### Language-Specific Rules
- **Naming Conventions**: 
    - Database: MUST use `snake_case` (e.g., `crew_templates`, `placement_group_id`).
    - Code: Variables/Functions use `camelCase`. Components use `PascalCase`.
    - Files: Components use `kebab-case.tsx`. Logic files use `camelCase.ts`.
- **Type Safety**: Export all Drizzle inferred types from `@/types/db.ts`. Do not import database schemas directly into UI components.

### Framework-Specific Rules
- **The "Stellar Glass" Vibe**: 
    - **Anti-Pattern**: NO white backgrounds. The app is 100% Dark Mode.
    - **Glass Tax**: Use `bg-slate-900/50 backdrop-blur-md` for Top-Level containers (Sidebar, Modals, Floating Panels) ONLY.
    - **Inner Performance**: Inner cards/list items MUST be solid semi-transparent (e.g., `bg-slate-800/80`) without blur to maintain 60fps on iPad.
    - **Tactical Sharpness**: Corner radius is limited to `rounded-sm` or `rounded-md`. Avoid bubbly `rounded-xl`.

### Data & State Logic
- **The Crew Split**: 
    - `CrewTemplate` = The static blueprint (Saved group of IDs).
    - `PlacementGroup` = The active job record (Dynamic set of placements).
    - **Rule**: Never modify a `CrewTemplate` via a `PlacementGroup` change.
- **State Management Boundary**:
    - **UI Drafts**: Use `CrewContext` for high-frequency interactive state (e.g., dragging candidates into slots).
    - **Server Data**: Use SWR for fetching the Candidate Pool and Project data.
    - **Anti-Pattern**: Do NOT store the entire database in React Context.

### Critical Don't-Miss Rules
- **Map Security**: NEVER call Mapbox APIs directly from the client. All geospatial requests must be proxied via `/app/api/geo/isochrone`.
- **DND Interaction**: Use `translate` transforms for drag-and-drop. Stop Leaflet event propagation (`e.stopPropagation()`) on map pin clicks to prevent map-pan/zoom conflicts on iPad touch.
- **Flash Blast**: Do NOT use automated SMS APIs for MVP. Generate the templated string and trigger the "Copy to Clipboard" success animation.

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code.
- Follow ALL rules exactly as documented.
- When in doubt, prefer the more restrictive "Stellar Glass" or "Performance" option.
- Update this file if new persistent patterns emerge.

**For Humans:**
- Keep this file lean and focused on agent needs.
- Review quarterly for outdated rules.

Last Updated: 2025-12-23