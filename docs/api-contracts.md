# API Contracts - JobAdder Integration

Stellar Co-Pilot integrates with the **JobAdder V2 API** to manage recruitment data. This document outlines the primary endpoints and contracts used or planned for integration.

## Authentication
JobAdder uses **OAuth 2.0** (Authorization Code Flow).
- **Authorization URL**: `https://id.jobadder.com/connect/authorize`
- **Scopes required**: `read`, `write`, `read_contact`, `read_job`, `read_candidate`

## Primary Endpoints

### 1. Candidates API
Used for fetching and managing candidate profiles.
- **GET** `/candidates`: Search for candidates.
- **POST** `/candidates`: Add a new candidate.
- **GET** `/candidates/{candidateId}`: Get detailed candidate information.

### 2. Jobs API
Used for managing job orders and placements.
- **GET** `/jobs`: Find active job orders.
- **GET** `/jobs/{jobId}`: Get job details and statistics.
- **POST** `/jobs`: Create a new job order.

### 3. Companies & Contacts API (CRM)
Used for client relationship management.
- **GET** `/companies`: Search for companies/clients.
- **GET** `/contacts`: Find key contacts within client organizations.

### 4. Placements API
Used for tracking successful recruitment matches.
- **GET** `/placements`: Search placements.
- **POST** `/placements`: Record a new placement.

## Integration Patterns
- **Syncing**: The application caches JobAdder data in local state (`DataContext.js`) for rapid UI responsiveness.
- **Mapping**: JobAdder addresses are geocoded for display on the `GeospatialMap` component.
