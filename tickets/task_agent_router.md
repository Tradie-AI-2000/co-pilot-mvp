---
id: task_agent_router
title: "Refactor API Router (The Nervous System)"
status: Triage
priority: High
project: Co-Pilot
created: 2026-02-01
updated: 2026-02-01
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [api, orchestration]
assignee: Pickle Rick
---

# Description

## Problem to solve
`app/api/agent/route.js` is currently a "Puppet Show" that doesn't execute logic.

## Solution
1.  **Intent Detection**: Parse `message` to identify triggers (e.g., `#desk-pulse`, `#golden-hour`).
2.  **Tool Execution**: Call the corresponding function from `services/logic-hub.js`.
3.  **Context Injection**: Inject the *result* (JSON) into the System Prompt.
4.  **Persona Loading**: Dynamically load the correct YAML based on `agentId`.

## Acceptance Criteria
- Agents respond with "Hard Data" from the Logic Hub, not hallucinations.
