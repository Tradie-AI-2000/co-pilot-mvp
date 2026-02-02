# Market Intel & Construction League PRD

## HR Eng

| Market Intel PRD |  | Build a strategic Market Intelligence dashboard combining Sales Leads (Kanban) with Competitor Analytics (Construction League). |
| :---- | :---- | :---- |
| **Author**: Pickle Rick **Contributors**: Joe | **Status**: Draft **Updated**: 2026-02-02 | **Context**: Co-Pilot |

## Introduction

The Market Intel page is the strategic brain of the Co-Pilot. It has two functions:
1.  **Tactical**: A Kanban board of active tenders for the Sales Team to hunt (The Hunter).
2.  **Strategic**: A "Construction League" style dashboard analyzing market share, top builders, and sector trends in the "Golden Triangle" (Auckland, Waikato, Bay of Plenty).

## Problem Statement

**Current State**: The previous iteration was a simple list of jobs. It lacked context on *who* is winning work and *where* the market is heading.
**Inspiration**: The *Construction League NZ 2025* report shows the value of ranking builders by project value and analyzing sector splits.
**Goal**: We want that PDF's level of insight, but *live* and interactive.

## Objective & Scope

**Objective**: Create a "Market Command Center" that visualizes project data and facilitates immediate stakeholder outreach.

### In-Scope
1.  **Project Kanban**: Drag-and-drop board for active tenders (Status: New, Contacted, Quoted, Won).
2.  **Competitor Intelligence (The League)**:
    -   **Top Builders Leaderboard**: Ranked by Total Project Value (Mocked from PDF data initially, then real).
    -   **Sector Analytics**: Visual breakdown (Donut Charts) of Commercial vs. Industrial vs. Residential.
3.  **Golden Triangle Focus**: Strict filtering for Auckland, Northland, Waikato, BOP.
4.  **Stakeholder Actions**: "Explode" card -> One-click SMS/Email/Call.
5.  **News Feed**: RSS widget for industry news.

## Product Requirements

### Critical User Journeys (CUJs)
1.  **The Analyst**: User views the "Market Overview" tab -> Sees "Hawkins" is winning 45% of Commercial work in Auckland -> Clicks "Hawkins" to see their active sites.
2.  **The Hunter**: User switches to "Tender Board" -> Filters by "Industrial" -> Sees a new "Foodstuffs Distribution Centre" -> Explodes card -> Emails the Project Manager.

### Functional Requirements

| Priority | Requirement | Details |
| :---- | :---- | :---- |
| P0 | **Schema Upgrade** | Add `sector`, `main_contractor`, `project_value_int` for analytics. |
| P0 | **Analytics UI** | Implement Donut Charts (Recharts/Chart.js) for Sector/Region split. |
| P0 | **Leaderboard UI** | "Top 10 Builders" list widget with Total Value metrics. |
| P0 | **Tender Kanban** | Existing requirement (Keep it). |
| P1 | **Data Import** | Script to seed "Construction League" data (Hawkins, Naylor Love, etc.) so the charts aren't empty. |

## Schema Changes (Target State)

### `market_tenders` (Updates)
-   `region` (text): Auckland, Northland, Waikato, Bay of Plenty.
-   `sector` (text): Commercial, Community, Industrial, Legal & Military, Multi-Residential.
-   `main_contractor` (text): e.g., "Hawkins", "Naylor Love".
-   `project_value_raw` (numeric): For summing up totals (The PDF uses specific dollar values).
-   `status` (text): New, Qualified, Contacted, Tender, Won, Lost.
-   `subcontractors` (jsonb): List of subs.

### `market_tender_stakeholders` (Updates)
-   `email` (text).
-   `phone` (text).

## Technical Strategy
1.  **Schema**: Update `lib/db/schema.ts` with new fields.
2.  **Seed Data**: Create `scripts/seed-league-data.js` to inject the Top 10 Builders from the PDF (Hawkins, Naylor Love, etc.) and some dummy projects for them.
3.  **UI**:
    -   **Tab 1: Dashboard**: Charts & Leaderboards.
    -   **Tab 2: Tenders**: The Kanban Board.
4.  **Components**:
    -   `SectorDonutChart`
    -   `BuilderRankList`
    -   `TenderBoard` (Refactored)

## Stakeholders
-   **Joe**: Product Owner
-   **Pickle Rick**: Chief Architect