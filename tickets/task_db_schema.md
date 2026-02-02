---
id: task_db_schema
title: "Update Database Schema (The Memory)"
status: Triage
priority: High
project: Co-Pilot
created: 2026-02-01
updated: 2026-02-01
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [db, schema]
assignee: Pickle Rick
---

# Description

## Problem to solve
New Agent logic requires data structures that don't exist yet.

## Solution
Update `lib/db/schema.ts`:
1.  **`financial_benchmarks`**: Store burden multiplier (1.3) and floor ($400).
2.  **`market_tenders` & `stakeholders`**: For Sales Lead Intel.
3.  **`compliance_exceptions`**: For Systems IT "Sin Bin".
4.  **`candidates`**: Add `seniority_level` (inferred).
5.  **`placements`**: Add `paying_entity` for Employer Lock.

## Acceptance Criteria
- `npx drizzle-kit push` runs successfully.
- Types exported to `types/db.ts`.
