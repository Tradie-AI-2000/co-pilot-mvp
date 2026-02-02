---
id: parent
title: "[Epic] Agent Swarm Functional Core Refactor"
status: Backlog
priority: Urgent
project: Co-Pilot
created: 2026-02-01
updated: 2026-02-01
links:
  - url: tickets/prd.md
    title: PRD Document
  - url: docs/agent-refactor/
    title: Refactor Plans
labels: [epic, core, agents]
assignee: Pickle Rick
---

# Description

## Problem to solve
The Agent Swarm (Jarvis, Accountant, etc.) is currently a "Puppet Show". Agents have personality but lack the "Hard Logic" to execute complex tasks (Math, Compliance, Risk). They hallucinate tools that don't exist.

## Solution
Implement a "Functional Core" (`logic-hub.js`) that executes deterministic logic *before* the LLM generates a response. Refactor the API Router to inject these results into the context.

# Child Tickets
- `tickets/task_logic_hub.md`: Implement Logic Hub Service
- `tickets/task_db_schema.md`: Update Database Schema
- `tickets/task_agent_router.md`: Refactor API Router
- `tickets/task_yaml_configs.md`: Update Agent YAML Definitions
