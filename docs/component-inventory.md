# UI Component Inventory - Stellar Co-Pilot

## Overview
The application uses a modular React component library focused on data visualization, recruitment workflows, and geospatial analysis.

## Core Components

| Component | Description |
| :--- | :--- |
| `sidebar.js` | Main navigation shell with route links and global branding. |
| `real-map.js` | Leaflet-based map for visualizing candidate and project density. |
| `geospatial-map.js` | Advanced mapping with filtering and clustering capabilities. |
| `stat-card.js` | High-level metric display (e.g., Active Jobs, Placements). |
| `candidate-dashboard.js` | Specialized view for candidate search and vetting. |
| `squad-builder.js` | Interactive tool for assembling teams for projects. |

## Modals & Interactions

| Component | Purpose |
| :--- | :--- |
| `candidate-modal.js` | Detailed candidate profile view and editing. |
| `client-details-modal.js` | Comprehensive client profile and associated project list. |
| `add-project-modal.js` | Form for initializing new construction projects with intelligent phase detection. |
| `add-client-modal.js` | Client onboarding interface. |
| `enhanced-client-details-modal.js` | Advanced version of client details with tabbed views. |

## Specialized Widgets

| Component | Description |
| :--- | :--- |
| `activity-feed-widget.js` | Real-time stream of placements and project triggers. |
| `project-timeline.js` | Gantt-style visualization of construction phases. |
| `trade-grid.js` | Matrix view of workforce requirements across projects. |
| `region-grid.js` | Geographic performance and demand heat map. |
| `focus-feed-card.js` | Card for displaying urgent actions in mission control. |
| `project-watchlist-card.js` | Card for displaying projects in the dashboard watchlist. |

## Design Principles
- **Visualization**: Heavy use of maps and grids for data-dense information.
- **Urgency-Driven**: Visual markers for "Urgent" jobs or "High" priority signals.
- **Contextual**: Components are tightly coupled with the `DataContext` for real-time updates.
