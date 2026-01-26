# Component Inventory: Co-Pilot

Co-Pilot features a rich library of specialized React components designed for data visualization and workflow management.

## Component Categories

### 1. Dashboard & Visualization
- **`stat-card.js`**: Reusable card for displaying key performance indicators (KPIs).
- **`activity-feed-widget.js`**: Real-time stream of events and updates.
- **`financial-forecast-widget.js`**: Visualization of projected revenue and costs.
- **`relationship-decay-widget.js`**: Heatmap or chart showing client interaction frequency.

### 2. Geospatial (Mapping)
- **`real-map.js`**: Primary Leaflet implementation for project visualization.
- **`candidate-map.js`**: Specialized map showing candidate proximity to project sites.
- **`geospatial-map.js`**: Generic wrapper for various mapping views.

### 3. Modals & Interaction
- **`candidate-modal.js`**: Detailed view and edit form for candidate profiles.
- **`client-details-modal.js`**: Deep-dive view for client history and contacts.
- **`active-bench-modal.js`**: List of available candidates (the "Bench").
- **`add-project-modal.js`**: Form for initializing new projects.

### 4. Workflow & Planning
- **`placements-pipeline.js`**: Kanban or list view of current placement stages.
- **`project-timeline.js`**: Gantt-style or linear visualization of project phases.
- **`client-tier-board.js`**: Strategic visualization of clients sorted by tier (1, 2, 3).
- **`squad-builder.js`**: Drag-and-drop interface for forming project teams.

### 5. Specialized Tools
- **`whatsapp-blaster.js`**: UI for bulk communication with candidates.
- **`nudge-logic/`**: Components related to the Nudge Engine display.
- **`golden-hour-mode.js`**: Focused view for high-priority morning tasks.

### 6. General Layout
- **`sidebar.js`**: Primary navigation and user profile.
- **`card.js`**: Standard layout container with "glass-panel" styling.
- **`action-drawer.js`**: Side-sliding panel for quick actions.

## Design System Patterns
- **Styling**: Tailwind CSS with custom `glass-panel` and `neon-gradient` utility classes.
- **Icons**: Lucide React for consistent iconography.
- **Interactivity**: DnD Kit for drag-and-drop operations in the Squad Builder.