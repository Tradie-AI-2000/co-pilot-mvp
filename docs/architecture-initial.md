# System Architecture - Stellar Co-Pilot

## Executive Summary
Stellar Co-Pilot is a Next.js-based recruitment and project management tool designed for the labour hire and construction industries. It provides a centralized dashboard for managing candidates, clients, projects, and market insights, utilizing real-time mapping and intelligent workforce logic.

## Technology Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **State Management**: React Context API (`DataContext.js`)
- **Mapping**: Leaflet / react-leaflet
- **Icons**: Lucide React
- **Styling**: CSS Modules & Global CSS
- **Data Source**: Local Mock Data / Services Layer

## Architecture Patterns

### 1. Unified State Management
The application uses a "Single Source of Truth" pattern via the `DataProvider` context. This context manages the global state for:
- Candidates
- Clients (Construction Companies)
- Projects (Construction Sites)

### 2. Service-Oriented Data Layer
Data access is abstracted through the `services/` directory.
- `dataProvider.js`: Main interface for data operations.
- `constructionLogic.js`: Contains business logic specific to construction phases, workforce matrices, and lead time calculations.
- `mockData.js`: Provides structured seed data following industry-standard recruitment patterns.

### 3. Layout and Navigation
The application employs a persistent layout pattern:
- `Sidebar`: Global navigation and quick-access filters.
- `RootLayout`: Wraps the application in the `DataProvider` and provides the structural shell (Sidebar + Main Content).

## Data Architecture
The system uses a relational-style mock data structure:
- **Candidates**: Detailed profiles including skill sets, availability, and employment history.
- **Clients**: Organizations with associated projects and hiring tiers.
- **Projects**: Construction sites with phase-based tracking (Excavation, Structure, Fit-Out) and integrated "Hiring Signals" logic.

## UI Architecture
The UI is built using a component-based architecture:
- **Pages**: Located in `app/`, representing discrete functional domains (Market, Candidates, Projects, CRM).
- **Components**: Reusable UI elements in `components/`, ranging from simple `Card` components to complex `GeospatialMap` integrations.

## Integration & APIs
The project includes an `openapi.json` specification, suggesting a planned or existing integration with a backend REST API. Currently, the frontend operates primarily with local state and mock services.

## Related Documentation
- [Source Tree Analysis](./source-tree-analysis.md)
- [Development Guide](./development-guide.md)
