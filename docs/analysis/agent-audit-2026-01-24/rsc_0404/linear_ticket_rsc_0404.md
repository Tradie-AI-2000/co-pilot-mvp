---
id: rsc_0404
title: "Research: Map Command Centre Orchestration Flow"
status: Done
priority: Medium
project: project
created: 2026-01-24
updated: 2026-01-24
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [research, agents, command-centre]
---

# Description

## Problem to solve
The Command Centre UI talks to `/api/agent`, but the exact flow from the UI directive to the orchestrator loading specific personas and querying Supabase needs to be fully documented.

## Solution
1. Trace the data flow from `app/command-centre/page.js` to `/api/agent/route.js`.
2. Document how the "Stellar GM" uses the `context` passed from the UI vs. what it queries from the DB.
3. Map how the `lib/intel-engine.js` (Scout) results are intended to be consumed by the GM.
