# Data Models - Stellar Co-Pilot

This document defines the core data structures used within the application, including local state models and JobAdder integration schemas.

## Core Entities

### 1. Candidate
Represents a job seeker or worker.
```typescript
interface Candidate {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  suburb: string;
  currentPosition: string;
  internalRating: number;      // 0.0 - 5.0
  status: "Available" | "On Job" | "Pending";
  idealSalary: string;
  noticePeriod: string;
}
```

### 2. Client (Company)
Represents a construction firm or hiring organization.
```typescript
interface Client {
  id: string | number;
  name: string;
  industry: string;            // Default: "Construction"
  status: "Active" | "Lead" | "Dormant";
  tier: "1" | "2" | "3";       // 1 = Enterprise, 3 = SME
  activeJobs: number;
  projectIds: string[];
}
```

### 3. Project (Site)
Represents a specific construction project or worksite.
```typescript
interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  startDate: string;           // ISO Date
  value: string;               // e.g., "$45M"
  phases: ProjectPhase[];
  hiringSignals: HiringSignal[];
}

interface ProjectPhase {
  name: "Excavation" | "Structure" | "Fit-Out" | "Lock-Up";
  start: string;
  status: "Completed" | "In Progress" | "Upcoming";
  progress: number;            // 0-100
}

interface HiringSignal {
  role: string;
  count: number;
  urgency: "High" | "Medium" | "Low";
  date: string;                // Target hiring date
  value: string;               // Estimated package value
}
```

## State Relationships
- **DataContext**: Acts as the central hub, linking `Candidates` to `Projects` via `deploySquad` actions.
- **JobAdder Sync**: Local `Candidate` and `Client` models are compatible with JobAdder API schemas for seamless synchronization.
