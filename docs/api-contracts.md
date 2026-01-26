# API Contracts: Co-Pilot

This document outlines the internal API endpoints available in Co-Pilot.

## Base URL
`/api`

---

## 1. Candidates API
**Path**: `/api/candidates`

### GET
**Description**: Fetches all candidates with their qualifications and status.
**Response**: `Array<Candidate>`
- **Example**: `[{ "id": "uuid", "firstName": "John", "lastName": "Doe", "status": "available", ... }]`

### POST
**Description**: Creates a new candidate or updates an existing one (Mock Echo).
**Body**: `Candidate Object`
**Response**: `{ "success": true, "data": Candidate }`

---

## 2. Sync API
**Path**: `/api/sync`

### GET
**Description**: Fetches raw data from a specific Google Sheets tab.
**Parameters**: `tab` (string, required) - e.g., "Projects", "Candidates", "Clients"
**Response**: `Array<Object>` - Array of rows from the sheet.

### POST
**Description**: Updates a specific row in a Google Sheets tab.
**Body**:
```json
{
  "tab": "Projects",
  "id": "project_id_or_row_index",
  "data": { "status": "Active", "notes": "Updated via API" }
}
```
**Response**: `{ "success": true, "updatedRow": Object }`

---

## 3. Nudges API
**Path**: `/api/nudges`

### GET
**Description**: Retrieves active alerts and proactive tasks for the current user.
**Response**: `Array<Nudge>`
- **Example**: `[{ "type": "ZOMBIE_HUNTER", "priority": "HIGH", "title": "Dormant Candidate", ... }]`

---

## 4. Geospatial API
**Path**: `/api/geo`

### GET
**Description**: Performs geocoding or retrieves spatial data for mapping.
**Parameters**: `address` or `bounds`
**Response**: GeoJSON or Lat/Lng objects.

---

## 5. Agent API
**Path**: `/api/agent`

### POST
**Description**: Entry point for AI agents to trigger actions or request data analysis.
**Body**: `{ "query": string, "context": object }`
**Response**: `{ "response": string, "actions": Array }`