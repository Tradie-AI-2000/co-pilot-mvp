# Product Requirements Document: Stellar Co-Pilot

**Version:** 1.0
**Date:** 2025-12-23
**Status:** Draft
**Author:** Joe (Recruitment Consultant) / BMad Agent (Analyst/PM)

## 1. Vision & Alignment

### Product Vision
Stellar Co-Pilot is an intelligent, high-velocity recruitment platform designed to transform consultants from "Order Takers" into "Order Makers." By automating the logistics of temp labour and predicting sales windows, it enables consultants to fill jobs faster and protect margins.

### Project Classification
- **Type:** Web Application (Next.js 16, Monolith)
- **Domain:** Construction Recruitment (Temp Labour Hire)
- **Track:** BMad Method (Brownfield)

### Core Differentiator
**Operational Velocity:** Unlike traditional ATS/CRMs that are static databases, Stellar Co-Pilot is a reactive engine. It uses geospatial logic ("Commute Tolerance") and grouped entities ("Crews") to reduce time-to-fill from 60 minutes to 5 minutes.

## 2. Success Definition

### Primary Success Metric
*   **Time to Fill:** Reduce the time from "Job Order Received" to "Candidate Placed" to < 10 minutes for standard trade requests.

### Business Metrics
*   **Reduction in "No Shows":** Decrease candidate drop-off rate by 20% via accurate Commute Tolerance matching.
*   **Margin Protection:** Eliminate margin erosion caused by hidden travel costs through predictive alerts.
*   **Sales Velocity:** Increase proactive sales calls by 30% using the "Money Moves" feed.

## 3. Scope Definition

### MVP Scope (Theme 1: Operational Velocity)
1.  **"Crew" Entity:** Database support for grouping candidates into deployable units.
2.  **"Bench Match" Logic:** Search algorithm prioritizing "Locals" vs. "Travelers" based on commute time.
3.  **Geospatial Engine:** Isochrone mapping for accurate 30-min drive time filtering.
4.  **WhatsApp "Blast":** One-click bulk messaging to filtered candidate lists.

### Growth Features (Theme 2: Predictive Intelligence)
1.  **"Money Moves" Feed:** Algorithmic sales triggers based on project lifecycle.
2.  **Smart Lifecycle Templates:** Auto-population of project phases.
3.  **Bench Visualizer:** Forecasting tool for candidate availability.

### Future Vision (Themes 3 & 4)
1.  **Client Intelligence:** "Gatekeeper" tagging and deep history analysis.
2.  **Visual Trust:** Automated compliance badges and real-time reliability scores.

## 4. Domain Requirements (Recruitment/Temp Labour)

### Key Concerns
*   **Speed:** The primary currency. Features must reduce clicks and latency.
*   **Reliability:** Data (availability/location) must be accurate to prevent "no-shows."
*   **Compliance:** Basic visual verification of tickets (Site Safe) is mandatory but not the primary blocker for MVP.

## 5. Technical Feasibility Spike

### Isochrone Mapping (Commute Tolerance)
**Objective:** Determine the most cost-effective way to filter candidates by "30-min drive time" in a Next.js/Leaflet environment.

**Options:**
1.  **Mapbox Isochrone API:** High accuracy, easy React integration, generous free tier.
2.  **OpenRouteService:** Open-source, free, decent accuracy.
3.  **Euclidean Distance (MVP Fallback):** Simple radius check (e.g., 15km).

**Recommendation for MVP:** Use **Mapbox Isochrone API** for accuracy if budget permits, or **Euclidean Distance** as a "good enough" V1 proxy to save dev time.

### WhatsApp Integration
**Objective:** Enable "One-Click Blast" to candidates without massive API costs.

**Options:**
1.  **WhatsApp Business API:** Complex setup, cost per message, high reliability.
2.  **Click-to-Chat Links (`wa.me`):** Free, simple, opens user's WhatsApp Web/App. Good for 1:1.
3.  **Bulk Link Generator:** Generates a pre-filled message for multiple numbers (limited by URL length/browser handling).

**Recommendation for MVP:** Implement a **"Copy to Clipboard" + "Open WhatsApp Web"** workflow.
1.  Select Candidates.
2.  System generates a comma-separated list of numbers.
3.  User pastes into a Broadcast List in WhatsApp Web.
*Reasoning:* Avoids API costs and complex approval processes for V1.

## 6. Project-Specific Requirements (Web/Next.js)

### Platform Requirements
*   **Responsive:** Must work flawlessly on Desktop (Office) and Mobile/iPad (Field).
*   **Real-Time:** "Bench" status and "Project" updates should reflect instantly across the team (using React Context/SWR).

## 7. Functional Requirements

### Capability Area: Talent Management ("Crew" & "Bench")
*   **FR1:** Users can create a "Crew" entity and assign multiple Candidates to it.
*   **FR2:** Users can deploy an entire "Crew" to a Project in a single action.
*   **FR3:** Users can filter Candidates/Crews by "Commute Tolerance" (Drive time from Project location).
*   **FR4:** Users can view a visual indicator of Candidate availability ("Bench Status").

### Capability Area: Project Management
*   **FR5:** Users can create Projects using "Lifecycle Templates" (e.g., Civil, Residential) to auto-populate phases.
*   **FR6:** Users can view a "Money Moves" feed highlighting Projects with upcoming phase transitions.
*   **FR7:** Users can define specific "Start Dates" for Project Phases.

### Capability Area: Communications
*   **FR8:** Users can select multiple Candidates and generate a pre-filled WhatsApp message.
*   **FR9:** Users can view "Visual Compliance Badges" (Site Safe, Visa) on Candidate cards.

### Capability Area: Search & Matching
*   **FR10:** Users can perform a "Bench Match" search that prioritizes local candidates first, then travelers.
*   **FR11:** System must alert users if a selected candidate is outside the "Local" radius (Margin Alert).

## 8. Non-Functional Requirements

### Performance
*   **NFR1:** "Bench Match" search results must load in < 200ms.
*   **NFR2:** Map interactions (pan/zoom with candidate pins) must remain 60fps with up to 500 markers.

### Reliability
*   **NFR3:** Candidate availability status must be accurate to within the last 4 hours (requires process discipline + system timestamps).

## 9. Summary & Next Steps

This PRD defines the **Operational Velocity** engine for Stellar Co-Pilot. By focusing on **Crews**, **Commute Logic**, and **Fast Comms**, we address the core business need: speed.

**Next Steps:**
1.  **Architecture:** Design the `Crew` schema and update `Candidate` relationships.
2.  **UX Design:** Prototype the "Bench Match" map interface and "Crew" builder.
3.  **Epic Breakdown:** Create detailed stories for the MVP build.
