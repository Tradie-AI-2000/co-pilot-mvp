---
id: parent
title: "[Epic] Supabase Data Flow & Agent Architecture"
status: Backlog
priority: High
project: project
created: 2026-01-24
updated: 2026-01-24
links:
  - url: prd.md
    title: PRD Document
labels: [epic, supabase, agents, command-centre]
---

# Description

## Problem to solve
The application has a data schism: UI context uses Google Sheets, while the AI agents in the Command Centre use Supabase. Furthermore, agent personas are defined in YAML but implementation logic is hardcoded in API routes.

## Solution
1. Unified Source of Truth: Transition the UI dashboard to use the same Supabase-backed API as the agents.
2. Formalize Orchestration: Ensure the "Stellar GM" orchestrator dynamically loads personas from the BMB YAML blueprints.
3. Map and document all flows between UI, API, and Intelligence Engine.

# Discussion/Comments
- 2026-01-24 Pickle Rick: Epic initialized from updated PRD.
