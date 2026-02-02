---
id: task_yaml_configs
title: "Update Agent YAML Definitions (The Personality)"
status: Triage
priority: Medium
project: Co-Pilot
created: 2026-02-01
updated: 2026-02-01
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [config, yaml]
assignee: Pickle Rick
---

# Description

## Problem to solve
Current YAML files (`_bmad-output/bmb-creations/`) have outdated prompts that don't reference the new "Hard Logic".

## Solution
Update all 6 Agent YAMLs:
- **Jarvis**: Update `#desk-pulse`, `#crisis-interceptor`.
- **Accountant**: Update `#commission-audit` to reference Split Logic.
- **Candidate Mgr**: Update `#flight-risk`, `#squad-builder`.
- **Sales Lead**: Update `#golden-hour`, `#matchmaker`.
- **Systems IT**: Update `#data-hygiene`.
- **Immigration**: Update `#visa-check` (Visa Guard).

## Acceptance Criteria
- Prompts explicitly instruct the LLM to "Read the injected Protocol Data".
