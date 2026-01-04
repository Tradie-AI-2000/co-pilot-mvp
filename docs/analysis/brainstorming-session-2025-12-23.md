---
stepsCompleted: [1, 2]
inputDocuments: []
session_topic: 'Designing a World-Class, Interconnected Recruitment Co-Pilot Platform'
session_goals: '1. Design world-class Market Intel features. 2. Architect deep interconnectivity (Projects <-> Dashboard <-> CRM). 3. Identify NEW modules for a complete Co-Pilot experience. 4. Optimize for dynamic Temp Labour workflows.'
selected_approach: 'ai-recommended'
techniques_used: ['Mind Mapping', 'SCAMPER Method', 'Role Playing']
ideas_generated: []
context_file: ''
---

# Brainstorming Session Results

**Session Date:** 2025-12-23
**Facilitator:** Analyst Mary
**Participant:** Joe

## Session Overview

**Topic:** Designing a World-Class, Interconnected Recruitment Co-Pilot Platform
**Goals:**
1. Design world-class Market Intel features.
2. Architect deep interconnectivity (Projects <-> Dashboard <-> CRM).
3. Identify NEW modules for a complete Co-Pilot experience.
4. Optimize for dynamic Temp Labour workflows.

### Context Guidance

_Context loaded from project scan and user input:_
- **Domain:** Construction Recruitment (Temp Labour Hire).
- **Core Challenge:** Managing dynamic parts (people, projects, clients, timelines) in a highly interconnected way.
- **Specific Focus:** Transforming "Market Intel" into a world-class intelligence portal.
- **Technical Goal:** Ensuring state changes in one module (e.g., Projects) propagate intelligently to others (Dashboard, Market Intel).
- **Expansion:** Brainstorming *new* pages/modules to create a true "Co-Pilot".

### Session Setup

User seeks to elevate the current MVP to a polished, interconnected product. The focus is on "world-class" features for recruitment consultants, specifically handling the volatility of temp labour. The session will cover both the "Market Intel" design and the holistic system architecture (interconnectivity).

## Technique Selection

**Approach:** AI-Recommended Techniques
**Analysis Context:** System Architecture + Feature Innovation + User Workflow Design

**Recommended Techniques:**

- **Mind Mapping (Structure/Architecture):** To visualize the interconnected ecosystem and state propagation between modules.
- **SCAMPER Method (Innovation):** To radically upgrade the "Market Intel" page into a world-class feature set.
- **Role Playing (Workflow):** To simulate dynamic temp labour scenarios and define automated Co-Pilot behaviors.

## Technique Execution Results

**Technique Used:** Collaborative Refinement (Mind Mapping & SCAMPER applied to Core Recruitment Logic)

**Key Pivot:** Shifted focus from "Project-Specific Compliance (15% Quota)" to "Operational Recruitment Efficiency (Speed & Visibility)."

**Generated Master Feature List:**

### 1. The "Mission Control" Dashboard
*   **"Money Moves" Feed:** Proactive sales triggers based on project phase changes (e.g., "Project X ending in 14 days -> Pitch Finishing Trades").
*   **"Bench" Visualizer:** Bar chart forecast of talent availability by week. Click-to-float functionality.
*   **"4-Hour Guarantee" Timer:** T-minus 30 min alert after a candidate starts to prompt the quality check call.

### 2. Dynamic Project Database
*   **Smart Lifecycle Templates:** Auto-plots construction phases (Foundations, Framing, Fit-out) based on Project Type and Start Date.
*   **The "Subbie Web":** Interactive matrix mapping subcontractors to specific packages within a project for direct targeting.

### 3. The "Crew" & Talent Engine
*   **"Crew" Entities:** Group candidates into "Squads" (e.g., Tongan Steel Crew) for single-click deployment.
*   **"Commute Tolerance" Map:** Filter candidates by realistic drive time (e.g., 30 mins) to reduce burnout/churn.
*   **Visual Compliance Badges:** Digital wallet icons (Site Safe, Visa) on candidate cards that auto-alert on expiry.

### 4. CRM & Client Intelligence
*   **Role Tagging:** "Gatekeeper" vs. "Champion" vs. "Cheque Signer" for targeted calling.
*   **Project-Centric History:** Client timeline showing hiring patterns (e.g., "Only hires for Fit-out") to trigger future alerts.

### 5. Mobile & Field Tools
*   **WhatsApp "Blast":** Bulk SMS/WhatsApp integration from map/list views for instant job filling.

**Overall Creative Journey:**
We moved from a granular compliance focus to a high-velocity operational tool. The core insight is that the "Co-Pilot" shouldn't just store data; it should **predict sales windows** and **automate logistics**.

## Idea Organization and Prioritization

**Thematic Organization:**

*   **Theme 1: Operational Velocity ("Speed to Fee")** (Focus: Speed, Reliability, "Crew" Data Model)
*   **Theme 2: Predictive Intelligence ("The Co-Pilot")** (Focus: Sales Triggers, Inventory Forecasting)
*   **Theme 3: Targeted Sales ("Sniper Mode")** (Focus: CRM precision)
*   **Theme 4: Visual Trust ("Compliance & Status")** (Focus: Instant verification)

**Prioritization Results:**

*   **Top Priority (Immediate ROI): Theme 1 - Operational Velocity.**
    *   *Rationale:* In temp labour, Speed = Reliability. Reducing "Time to Fill" from 60m to 5m pays for the app. The "Crew" entity is a fundamental dependency.
*   **Secondary Priority: Theme 2 - Predictive Intelligence.**
    *   *Rationale:* Stops consultants from being "Order Takers." We need to know where to aim.
*   **Future Scope: Themes 3 & 4.**
    *   *Rationale:* Optimizations to add after the core engine (Speed + Prediction) is running.

## Action Planning

### Top 3 Priority Ideas

#### #1 Priority: Crew & Talent Engine (Theme 1)
- **Rationale:** Fundamental data model change required to support "Squad" deployment. Solves the core "speed" problem.
- **Next steps:** Define `Crew` schema, update `Candidate` schema, mock `deploySquad` logic.
- **Resources needed:** Backend schema update, UI for "Crew Builder."
- **Timeline:** Week 1

#### #2 Priority: Mission Control & Triggers (Theme 2)
- **Rationale:** Transforms the app from a database to a "Co-Pilot" by pushing data to the user.
- **Next steps:** Implement "Money Moves" logic (Project End Date - 14 Days = Alert).
- **Resources needed:** Trigger logic engine, Dashboard UI updates.
- **Timeline:** Week 2

#### #3 Priority: Commute Tolerance Mapping (Theme 1)
- **Rationale:** Reduces "no-shows" (the biggest cost in temp labour) by ensuring realistic logistics.
- **Next steps:** Integrate travel time API (or simple distance radius initially) into Map View.
- **Resources needed:** Geospatial query logic.
- **Timeline:** Week 2

## Reflection and Follow-up

### What Worked Well
The session successfully pivoted from a constrained view (quotas) to a high-value operational view. "Role Playing" stress-tested the workflow and revealed the need for speed over compliance.

### Areas for Further Exploration
Future sessions should focus on the specific UI interactions for the **"Subbie Web"** (Theme 3) and detailed **Client Intelligence** (Theme 4).

### Next Session Planning
- **Suggested topics:** PRD Creation, Architecture Design for "Crew" Entity.
- **Recommended timeframe:** Immediate.
- **Preparation needed:** Review `api-contracts.md` to ensure JobAdder compatibility with new "Crew" concept.

---

_Session facilitated using the BMAD CIS brainstorming framework_
