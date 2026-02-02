---
id: backend
title: "Implement Market Intel Data Access"
status: Done
priority: High
project: Co-Pilot
created: 2026-02-02
updated: 2026-02-02
links:
  - url: ../../docs/market_intel_prd.md
    title: PRD
labels: [backend, api]
assignee: Pickle Rick
---

# Description

## Problem to solve
Frontend needs a way to fetch tenders filtered by "Golden Triangle" and "Status".

## Solution
1. Create `services/market-service.js` (or similar) or Server Action.
2. Implement `getMarketTenders({ region, status })`.
3. Ensure it joins `stakeholders`.
