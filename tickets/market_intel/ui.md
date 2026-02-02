---
id: ui
title: "Implement Market Intel UI"
status: Done
priority: High
project: Co-Pilot
created: 2026-02-02
updated: 2026-02-02
links:
  - url: ../../docs/market_intel_prd.md
    title: PRD
labels: [frontend, ui]
assignee: Pickle Rick
---

# Description

## Problem to solve
Users see a blank page. They need the Kanban board.

## Solution
1. Replace `app/market/page.js`.
2. Build components:
   - `MarketBoard`: Kanban columns.
   - `TenderCard`: The card with "Explode" button.
   - `TenderModal`: Detailed view + Stakeholder actions.
   - `NewsFeedWidget`: RSS placeholder.
3. Integrate with Backend service.
