# Component Inventory: Co-Pilot

Co-Pilot features a rich library of specialized React components designed for data visualization and workflow management.

## Component Categories

### 1. Dashboard & Visualization
- **`stat-card.js`**: Reusable card for displaying key performance indicators (KPIs) with trend indicators and progress rings.
- **`activity-feed-widget.js`**: Real-time stream of events, triggers, and signals across the platform.
- **`activity-pulse-widget.js`**: Tracks daily/weekly KPIs (calls, SMS, emails, floats) against targets.
- **`financial-forecast-widget.js`**: Visualization of projected revenue vs. budget for specific project sectors.
- **`relationship-decay-widget.js`**: Tracks client interaction frequency and alerts when relationships are "cooling off" based on tier-based targets.
- **`bench-liability-widget.js`**: Calculates and displays the financial risk of unassigned workers on guaranteed hours.
- **`candidate-dashboard.js`**: High-level summary of candidate supply, including counts of available workers and those finishing soon.
- **`client-demand-widget.js`**: Aggregates labor requirements across all active projects to show total market demand.
- **`commission-dashboard.js`**: calculates recruiter and manager commissions based on placement margins and revenue splits.
- **`deal-flow-summary.js`**: Compact view of the sales pipeline, showing counts of active floats and placements.
- **`focus-feed-card.js`**: AI-driven signal cards for "Churn Interceptors," "Pre-emptive Strikes," and urgent tasks.
- **`project-watchlist-card.js`**: Tracks project progress through phases (Foundations, Structure, Finishes) and signals upcoming labor needs.
- **`sharepoint-mirror-widgets.js`**: "Mirror" components that sync with external SharePoint data for finishing/top-up alerts.
- **`agent-signal-card.js`**: Compact status indicator for various AI agents (GM, Scout, etc.) in the Command Centre.

### 2. Geospatial (Mapping)
- **`real-map.js`**: Primary Leaflet implementation for project and candidate visualization.
- **`candidate-map.js`**: Specialized map showing candidate proximity to project sites with availability-based color coding.
- **`geospatial-map.js`**: Generic dynamic wrapper for various mapping views to ensure client-side rendering.

### 3. Modals & Interaction
- **`candidate-modal.js`**: Detailed view and edit form for candidate profiles, including CV management and project assignment.
- **`client-details-modal.js`**: Deep-dive view for client history, contacts, and interaction logs.
- **`enhanced-client-details-modal.js`**: Advanced client view with construction lifecycle mapping and WhatsApp integration.
- **`active-bench-modal.js`**: Interactive list of available candidates requiring placement.
- **`active-placements-modal.js`**: Detailed list of all workers currently on-site.
- **`add-project-modal.js`**: Comprehensive form for initializing new projects, including labor requirement and phase building.
- **`add-client-modal.js`**: Simplified form for adding new clients to the CRM.
- **`deal-flow-modal.js`**: Pipeline management view for tracking floats, interviews, and placements.
- **`float-candidate-modal.js`**: Multi-step workflow for "floating" a candidate to a client or project.
- **`hot-list-modal.js`**: Generator for bulk WhatsApp/SMS messages featuring a "hot squad" of available workers.
- **`match-list-modal.js`**: AI-driven interface for matching available candidates to specific project gaps.
- **`placement-ticket-modal.js`**: Management interface for confirming or canceling worker placements.
- **`relationship-action-modal.js`**: Quick-action interface for contacting clients using pre-defined templates.
- **`action-drawer.js`**: Side-sliding panel for executing "Nudge" actions and communication.

### 4. Workflow & Planning
- **`placements-pipeline.js`**: Stage-based visualization of current recruitment activity.
- **`project-timeline.js`**: Linear visualization of project phases and associated signals.
- **`client-tier-board.js`**: Strategic visualization of clients sorted by tier (1, 2, 3) to guide account management.
- **`squad-builder.js`**: Interface for creating groups of workers (Squads) for deployment.
- **`crew-builder-panel.js`**: Side panel for building crews via drag-and-drop with compliance validation.
- **`bench-roster.js`**: Tool for selecting and acting on groups of available candidates.
- **`project-list.js`**: Filterable list of projects for navigation and selection.
- **`project-intelligence-panel.js`**: Detailed project view with phase-based triggers and labor requirements.
- **`project-detail-panel.js`**: Management panel for individual project settings and automation logic.

### 5. AI & Intelligence
- **`boardroom-chat.js`**: Interactive interface for communicating with specialized AI agents using real project context.
- **`tender-radar.js`**: AI-assisted tool for scanning tender documents and predicting labor requirements.

### 6. Client Portal
- **`portal-dashboard.js`**: Central hub for client-facing portal, featuring role selection and shopping-cart-style booking.
- **`project-builder.js`**: Wizard for clients to define their own project requirements and labor needs.
- **`booking-form-modal.js`**: Final checkout step for client labor requests.
- **`client-projects-view.js`**: Portal-specific view of a client's active and historical projects.
- **`portal-timesheets.js`**: Interface for clients to submit and approve worker hours.
- **`portal-health-safety.js`**: Portal component for reporting site incidents and hazards.
- **`portal-contact.js`**: Display for the client's dedicated account manager.

### 7. General Layout & Utility
- **`sidebar.js`**: Primary navigation and user profile.
- **`card.js`**: Standard layout container with "glass-panel" styling.
- **`client-providers.js`**: Root wrapper for Data, Crew, and DnD contexts.
- **`dnd-wrapper.js`**: Global context provider for drag-and-drop operations.
- **`crew-slot.js`**: Droppable target for candidates in the Crew Builder.
- **`squad-card.js`**: Display card for built squads with blended rate calculations.
- **`client-card.js`**: Reusable card for client summaries in various contexts.
- **`region-grid.js`**: Geographic navigation grid for filtering by region.
- **`trade-grid.js`**: Industry navigation grid for filtering by trade/sector.
- **`weekly-checkin-widget.js`**: Tool for logging and tracking candidate/client satisfaction scores.
- **`client-side-panel.js`**: slide-out overview of client stats and recent activity.

## Design System Patterns
- **Styling**: Tailwind CSS with custom `glass-panel` and `neon-gradient` utility classes.
- **Icons**: Lucide React for consistent iconography.
- **Interactivity**: DnD Kit for drag-and-drop operations in the Squad Builder and Crew Builder.
- **Context**: Centralized state management via `DataContext` and `CrewContext`.
