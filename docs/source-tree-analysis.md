# Source Tree Analysis - Stellar Co-Pilot

This document provides an annotated overview of the project structure to assist AI agents in navigating the codebase.

## Directory Structure

```text
/ (root)
├── app/                # Next.js App Router
│   ├── candidates/     # Candidate dashboard and management
│   ├── crm/            # Client Relationship Management (CRM)
│   ├── market/         # Market insights and mapping
│   ├── projects/       # Project management and tracking
│   ├── layout.js       # Root layout (Navigation, Sidebar)
│   └── page.js         # Home dashboard page
├── components/         # UI Component Library
│   ├── Card.js         # Generic card component
│   ├── Sidebar.js      # Main navigation sidebar
│   ├── RealMap.js      # Leaflet map integration
│   └── ... (20+ specific UI components)
├── context/            # State Management
│   └── DataContext.js  # React Context for candidates, clients, and projects
├── services/           # Business Logic & Data
│   ├── constructionLogic.js # Specialized logic for construction industry
│   ├── dataProvider.js      # Abstracted data access layer
│   ├── mockData.js          # Primary mock data source
│   └── enhancedMockData.js  # Extended mock data for projects/clients
├── docs/               # BMad Planning Artifacts
│   ├── bmm-workflow-status.yaml # Progress tracking
│   └── project-scan-report.json # Detailed scan metadata
├── public/             # Static Assets
│   └── images/         # Project logos and icons
├── openapi.json        # API Specification (for potential backend integration)
├── package.json        # Project manifest and dependencies
└── jsconfig.json       # JS compiler configuration (paths/aliases)
```

## Critical Folders Summary

| Folder | Purpose | Key Files |
| :--- | :--- | :--- |
| `app/` | Routing and Page Layouts | `page.js`, `layout.js` |
| `components/` | Reusable UI Elements | `Sidebar.js`, `RealMap.js`, `Card.js` |
| `context/` | Global State Management | `DataContext.js` |
| `services/` | Data Models and Business Logic | `mockData.js`, `constructionLogic.js` |
| `docs/` | Planning and Architecture | `index.md`, `architecture.md` |

## Entry Points
- **Web Frontend**: `app/page.js` (Home Dashboard)
- **Data Initialization**: `context/DataContext.js` (Wraps the application)
