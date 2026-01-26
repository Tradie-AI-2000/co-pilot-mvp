---
id: imp_0606
title: "Implementation: Formalize YAML-Driven Agent Personas in API"
status: Triage
priority: Medium
project: project
created: 2026-01-24
updated: 2026-01-24
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [implementation, agents, yaml]
---

# Description

## Problem to solve
The `app/api/agent/route.js` currently hardcodes the "General Manager" persona and has a somewhat manual way of loading other personas. 

## Solution
1. Refactor `/api/agent` to dynamically select and load the primary agent persona from the `_bmad-output/bmb-creations/` YAML files based on the `agentId` passed from the UI.
2. Ensure the "Board" of sub-agents is also populated from these authoritative YAML definitions.
