---
id: task_logic_hub
title: "Implement Logic Hub Service (The Brain)"
status: Triage
priority: Urgent
project: Co-Pilot
created: 2026-02-01
updated: 2026-02-01
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [backend, logic]
assignee: Pickle Rick
---

# Description

## Problem to solve
Agents currently lack deterministic logic for complex calculations (NCR, Flight Risk, Sync Health).

## Solution
Create `services/logic-hub.js` implementing the following tools defined in `docs/agent-refactor/`:
- **Jarvis**: `getBenchLiability`, `getRedeploymentRisks`, `getTier1Decay`
- **Accountant**: `calculateNCR` (Split Logic), `getBusyFools` (Margin Filter)
- **Candidate Mgr**: `getFlightRisks` (Mood/Commute), `generateSquads`
- **Sales Lead**: `getGoldenHourList`, `getProximityMatches`
- **Systems IT**: `getSyncStatus` (Kill Switch), `validateTradeMatrix`
- **Immigration**: `validateVisaConditions` (Role/Region/Employer), `getRenewalRadar`

## Acceptance Criteria
- All functions exported and unit-testable.
- Logic matches the "Law of Joe" definitions.
