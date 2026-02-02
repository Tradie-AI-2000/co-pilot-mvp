---
id: schema
title: "Update DB Schema for Market Tenders"
status: Triage
priority: High
project: Co-Pilot
created: 2026-02-02
updated: 2026-02-02
links:
  - url: ../../docs/market_intel_prd.md
    title: PRD
labels: [db, schema]
assignee: Pickle Rick
---

# Description

## Problem to solve
Current schema lacks fields for region filtering, status tracking, and stakeholder contact details.

## Solution
1. Update `lib/db/schema.ts`:
   - `market_tenders`: Add `region` (text), `status` (text), `subcontractors` (jsonb), `estimated_start_date` (timestamp).
   - `market_tender_stakeholders`: Add `email` (text), `phone` (text).
2. Run `npx drizzle-kit push`.
3. Verify types.
