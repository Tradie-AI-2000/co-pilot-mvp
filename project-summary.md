# Co-Pilot Project Summary

## 1. Project Overview
**Co-Pilot** is a comprehensive web application designed for the construction and recruitment industry. It serves as a "Candidate Intelligence Dashboard" and CRM, enabling users to track construction projects, manage client relationships, and optimize candidate placement through real-time market intelligence.

The application is built to provide a seamless flow of information between **Projects** (the demand), **Clients** (the companies), and **Candidates** (the supply), visualized through geospatial maps and interactive dashboards.

## 2. Technology Stack
*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS + Custom CSS Modules (Glassmorphism aesthetic)
*   **Icons**: Lucide React
*   **Maps**: React Leaflet (OpenStreetMap)
*   **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
*   **Deployment**: Vercel

## 3. Core Modules

### 3.1 Market Intelligence (`/app/market`)
This module focuses on visualizing construction activity and identifying hiring signals.
*   **Geospatial Map**: Displays project locations with interactive markers. Clicking a marker reveals project details.
*   **Project List**: A sidebar list of projects that syncs with the map selection.
*   **Project Timeline**: Visualizes project phases (Excavation, Structure, Fit-out) and "Contact Triggers" (e.g., "Start Hammer Hands").
*   **Add Project**: A modal to input new project data, including:
    *   **Core Details**: Name, Value, Status, Location.
    *   **Packages**: Sub-contractor packages (e.g., Electrical, Plumbing).
    *   **Triggers**: Key dates that signal hiring needs.

### 3.2 CRM (`/app/crm`)
A robust Client Relationship Management system designed for construction recruitment.
*   **Client Grid**: Displays clients as cards with key metrics (Active Jobs, Tier, Status).
*   **Enhanced Client Details Modal**: A comprehensive view of a client, featuring:
    *   **Header**: Financials (YTD Revenue, Avg Fee), Tier badges, and Action Alerts (e.g., "Contract Expires").
    *   **Tabbed Interface**:
        *   **Key People**: Decision makers with "Relationship DNA" (Coffee order, Communication style, Ice breakers) and Influence status (Champion, Blocker).
        *   **Projects**: List of linked projects. **Feature**: "Link Project" dropdown to associate existing projects with the client.
        *   **Candidates**: Lists candidates currently placed with this client (filtered by `currentEmployer`).
        *   **Activity**: Notes and Tasks timeline.
        *   **Site Intel**: Editable logistics info (PPE requirements, Induction process, Parking).
        *   **Hiring Insights**: Editable data on hiring speed, most hired roles, and feedback.

### 3.3 Candidates (`/app/candidates`)
Manages the talent pool with a focus on availability and location.
*   **Dashboard**: High-level stats (Total Candidates, Available, On Job).
*   **View Modes**: Toggle between **List View** and **Map View** (visualizes candidate locations relative to projects).
*   **Candidate Card**: Displays availability status (Traffic light system: Green/Available, Orange/Finishing Soon, Red/On Job), Role, and Rate.
*   **Candidate Modal**: Detailed profile editing:
    *   **Status & Availability**: Manage status (Available, On Job, Placed) and Finish Date.
    *   **Current Project**: If "On Job", link to a specific Project (auto-fills location/employer).
    *   **Personal Details**: Contact info, Address, Residency.
    *   **Export**: CSV export functionality.

### 3.4 Projects Database (`/app/projects`)
A central repository for all construction projects.
*   **Grid View**: Displays projects as cards with Stage badges (Won, Tender, Pipeline) and assigned companies.
*   **Deep Linking**: Supports URL parameters (`?projectId=...`) to open specific projects directly from other modules (e.g., clicking a project in CRM).
*   **Add/Edit Project Modal**: A multi-tab modal for deep project management:
    *   **Core Info**: Value, Dates, Stage.
    *   **Command Chain**: Key contacts (Project Director, Site Manager).
    *   **Package Matrix**: Track which companies hold which trade packages (e.g., Electrical -> Downer).
    *   **Virtual PM**: Automated contact triggers based on project phase.
    *   **Site Logistics**: Specific site requirements.

## 4. Data Architecture
The application currently uses a sophisticated mock data layer (`services/enhancedMockData.js`) that simulates a relational database.

### Key Entities & Relationships
*   **Projects**:
    *   `id`, `name`, `location`, `stage`, `value`.
    *   `assignedCompanyIds`: Array of Client IDs (Many-to-Many with Clients).
    *   `labourPrediction`: Forecast of roles needed by month.
*   **Clients**:
    *   `id`, `name`, `tier`, `status`.
    *   `projectIds`: Array of Project IDs.
    *   `network`: Relationships with other clients (Competitor, JV Partner).
    *   `keyContacts`: Nested array with `relationshipDNA`.
*   **Candidates**:
    *   `id`, `name`, `status`, `finishDate`.
    *   `projectId`: ID of the project they are currently working on (Links Candidate -> Project).
    *   `currentEmployer`: Name of the client (Links Candidate -> Client).

## 5. Key Components
*   **`GeospatialMap.js`**: Reusable Leaflet map component for Projects and Candidates.
*   **`EnhancedClientDetailsModal.js`**: The core of the CRM, handling complex client data and editing.
*   **`AddProjectModal.js`**: Used in both Market and Projects modules for creating/editing projects.
*   **`CandidateMap.js`**: Specialized map for visualizing talent distribution.

## 6. Future Analysis Areas
*   **Data Persistence**: Currently using in-memory state. Needs migration to a real backend (Supabase/Firebase).
*   **Authentication**: No user login implemented yet.
*   **API Integration**: "JobAdder" integration is planned but not yet implemented (currently using mock data).
*   **Mobile Responsiveness**: UI is optimized for desktop/tablet; mobile view needs refinement.
