---
id: imp_0505
title: "Implementation: Transition DataContext to Supabase API"
status: Triage
priority: High
project: project
created: 2026-01-24
updated: 2026-01-24
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [implementation, supabase, data-flow]
---

# Description

## Problem to solve
`DataContext` is currently syncing from Google Sheets via `/api/sync`. This creates a mismatch with the Agents who use Supabase.

## Solution
1. Update `context/data-context.js` to fetch core entities from Supabase-backed endpoints.
2. Ensure the "Enrichment" logic is either migrated to the server or remains compatible with the structured database results.
3. Remove all mock data imports.
