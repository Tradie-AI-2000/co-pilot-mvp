# 🧠 Master Brainstorm: Stellar Co-Pilot Mission Control

**Date:** December 30, 2025  
**Context:** High-Volume Temp Construction Recruitment (NZ - Upper North Island)  
**Persona:** Joe Ward (World-Class Consultant)  
**Key Constraints:** Fast-paced, Guaranteed Hours Risk, Housing/Logistics, High-Margin Pressure.

---

## 1. The "Mission Control" Philosophy (The 6 AM View)

When Joe logs in at 6 AM, the dashboard must answer three questions instantly:
1.  **Who is costing me money right now?** (Guaranteed hours unassigned).
2.  **Who finishes soon?** (The 4-week redeployment window).
3.  **Where is the fire?** (Urgent client requests vs. available talent).

### 🚀 Dashboard Modules (The "Widgets")

#### A. The "Bleeding Edge" Ticker (Financial Risk)
*   **Concept:** A live ticker showing the **"Bench Cost"**.
*   **Logic:** `(Unassigned Candidates w/ Guaranteed Hours) * (30 hours) * (Pay Rate)`.
*   **Visual:** A Red/Green status. "Current Bench Liability: $2,400/wk".
*   **Action:** Click to see the list of unassigned workers to "Blitz" them out.

#### B. The "Redeployment Radar" (The 4-Week Horizon)
*   **Concept:** A Gantt-style view specifically for **End Dates**.
*   **Visual:**
    *   **Critical (0-7 Days):** Flashing Red. (Needs job TODAY).
    *   **Urgent (8-14 Days):** Orange. (CVs should be out).
    *   **Upcoming (15-28 Days):** Yellow. (Start calling clients).
*   **Smart Feature:** "Auto-Match". Click a candidate finishing in 3 weeks -> System scans "Planning" projects starting in 3 weeks -> Suggests placement.

#### C. The "Margin Master" (Profit Visualization)
*   **Concept:** Real-time Gross Margin tracking, not just billings.
*   **Data:**
    *   `Charge Rate` - (`Pay Rate` + `Overheads ~30%`) = `Net Margin`.
*   **Goal:** "Joe, you are running at 22% margin this week. Place 2 more carpenters at $55/hr to hit 25%".

#### D. The "Housing Tetris" Map
*   **Concept:** A geospatial view of **Assets** vs. **Jobs**.
*   **Layers:**
    *   **Projects:** Blue pins.
    *   **Stellar Houses:** House icons (Green = Vacancy, Red = Full).
    *   **Candidates:** Heatmap of where they currently live.
*   **Why:** "I have a job in Hamilton. Do we have a bed in the Hamilton house? Or do I need to find a candidate willing to travel?"

---

## 2. The Core Workflows (The "Float" & "Blitz")

#### A. The "Float" Pipeline (Kanban)
We need a dedicated pipeline for the *Placement Process*, distinct from the CRM pipeline.
*   **Stages:**
    1.  **Identified:** Matched from bench.
    2.  **Floated:** CV & Rate sent to Client.
    3.  **Interview/Site Visit:** (Optional).
    4.  **Offer/Acceptance:** Client says "Yes".
    5.  **Compliance Check:** Site Safe, Visa Check, PPE issued.
    6.  **Deployed:** On site, billing starts.

#### B. The "Smart Rate Card" Calculator
*   **Problem:** Calculating margin on the fly at 6 AM is risky.
*   **Solution:** A built-in calculator in the "Float" modal.
    *   Input: Candidate Pay Request ($32).
    *   System: Adds Visa/Accomm/ACC levy ($32 + 30% = $41.60 Break-even).
    *   Input: Desired Margin (25%).
    *   Output: "Quote the client **$55.50/hr**".

#### C. The "Digital Deployment Packet"
*   **Trigger:** When status moves to "Deployed".
*   **Action:** System generates a mobile-optimized link/WhatsApp for the worker.
    *   *Google Maps Link to Site*
    *   *Site Manager Name & Photo*
    *   *Start Time*
    *   *Required Gear List (Steel caps, Hard hat)*
    *   *Health & Safety Briefing PDF*

---

## 3. CRM & Relationship Intelligence (Retention)

#### A. The "Friday Check-in" Bot
*   **Context:** You must check in weekly.
*   **Feature:** Automated list of "Active Placements".
*   **Action:** "Thumb Up / Thumb Down" logging.
    *   Did the client like them?
    *   Is the candidate happy?
*   **Risk Trigger:** If a candidate rates a job "Thumbs Down" twice, flag them as "Flight Risk" (High priority for redeployment).

#### B. Client "Buying Signals"
*   **Logic:** Track project timelines.
*   **Alert:** "Fletcher Construction's 'Auckland Hospital' project is entering **Fit-out** in 2 weeks. They usually hire 5 Hammerhands for this phase. Call Dave (Site Manager) now."

---

## 4. EXPANDED: The "Unified Action Stream" (Urgent Actions V2)

We need to move beyond just "Project Triggers". The "Urgent Actions" feed must aggregate signals from three domains: **Projects**, **Clients**, and **Candidates**.

### A. The 4-Tier Urgency Matrix

We categorize actions not just by type, but by **Time to Impact**.

| Tier | Timeframe | Meaning | Color |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | **Today / 24hrs** | "Do this or lose money/client immediately." | 🔴 Red |
| **URGENT** | **Next 3-5 Days** | "Prepare now or scramble later." | 🟠 Orange |
| **UPCOMING** | **Next 2 Weeks** | "Strategic moves. Sales calls." | 🟡 Yellow |
| **HORIZON** | **1 Month+** | "Pipeline building." | 🔵 Blue |

### B. Domain-Specific Actions (Examples)

#### 🏗️ Project Actions (The Build)
*   **Critical:** "Start Date Tomorrow: [Project Name]. 2x Carpenters unassigned." (Gap Analysis).
*   **Urgent:** "Phase Transition: [Project] moves to 'Structure' in 5 days. Confirm Steel Fixers with Site Manager."
*   **Horizon:** "New Project Detected: Hawkins won 'Orewa College'. Call [Contact] to identify sub-contractors."

#### 🤝 Client Actions (The Relationship)
*   **Critical:** "Placement Fallover: Client rejected James Wilson. Replacement needed ASAP."
*   **Urgent:** "Follow-up: Steve (Naylor Love) asked for a Carpenter for Tauranga. Did you send the CV?"
*   **Upcoming:** "Check-in: 3 Placements at [Site] finish next week. Call Site Manager to extend?"
*   **Risk:** "Ghost Client: No contact with [Key Account] for 21 days."

#### 👷 Candidate Actions (The Talent)
*   **Critical:** "Compliance Block: Brian starts Friday but **Site Safe is expired**. Book course NOW."
*   **Urgent:** "Visa Expiry: Luis Garcia's work visa expires in 10 days. Notify Immigration team."
*   **Upcoming:** "Redeployment: 5 Filipino workers finishing at [Site] in 3 weeks. They need housing in Hamilton."
*   **Retention:** "Flight Risk: Sam T rated his last 2 weeks 'Poor'. Call him."

### C. The "Action Card" Logic
Every card in the "Mission Control" feed must have a **Direct Action Button**.
*   *Action:* "Brian Site Safe Expired" -> `[Book Course Button]` (Opens email template to Safety team).
*   *Action:* "Steve Follow-up" -> `[Log Call Button]` (Opens CRM note).
*   *Action:* "Orewa Subbies" -> `[Add Lead Button]` (Opens 'Add Client' modal).

---

## 5. Data Architecture & Multi-Tenancy (The "Tech Spec")

To support multiple consultants (e.g., Joe, Sarah, Mike) each with their own desk, we need a robust backend.

### Database Choice: **Supabase (PostgreSQL)**
*   **Why:** Relational integrity is vital. We have complex joins (Candidates <-> Placements <-> Projects <-> Clients). We need Row Level Security (RLS) so Joe sees Joe's candidates (unless shared).

### Schema Design (Draft)

1.  **`users` (Recruiters)**
    *   `id`, `email`, `role` (Admin, Consultant), `target_margin`.

2.  **`candidates`**
    *   `id`, `owner_id` (Linked to Recruiter), `status` (Bench, On Job), `visa_expiry`, `housing_location`, `pay_rate`, `trade`, `skills_tags`.

3.  **`clients`**
    *   `id`, `company_name`, `tier`, `payment_terms`.

4.  **`projects`**
    *   `id`, `client_id`, `location`, `housing_region` (e.g., Waikato), `start_date`, `end_date`.

5.  **`placements` (The Money Table)**
    *   `id`, `candidate_id`, `project_id`, `recruiter_id`.
    *   `start_date`, `end_date` (Guaranteed End).
    *   `charge_rate`, `pay_rate`, `margin_percent`.
    *   `status` (Active, Ending Soon, Completed).

6.  **`housing_assets`**
    *   `id`, `address`, `region`, `capacity`, `current_occupancy`.


### Multi-Tenancy Logic
*   **Shared Pool vs. Private Desk:**
    *   Candidates can be "Global" (anyone can place them) or "Private" (owned by Joe).
    *   If Joe places a Global candidate, the `placement` record belongs to Joe (he gets the commission).

---

## 6. Execution Plan: Status Update (Dec 30)

### ✅ Phase 1: The Foundation (COMPLETED)
*   **Database Migration:** Moved to enriched `mock-data.js` with relational-style schema (Candidates, Clients, Projects).
*   **Mission Control V2:** Implemented "Bench Cost Ticker" and "Redeployment Radar".
*   **Financial Intelligence:** Standardized `ChargeRate` vs `PayRate` and automated Margin calculation.

### ✅ Phase 2: The Intelligence Layer (COMPLETED)
*   **Unified Action Stream:** Aggregated signals from Projects (Gaps), Clients (Tasks), and Candidates (Compliance/Visa).
*   **Visual Feed:** Implemented color-coded alert cards (Rose for Compliance, Sky for Tasks, Orange for Flight Risk).
*   **Candidate Profile V2:** Added specific fields for Site Safe, Visa, and Satisfaction.

---

## 7. Phase 3: The "Float" Pipeline & CRM (NEXT UP)

Now that we have the data and the alerts, we need to **Execute the Sale**.

### A. The "Float" Workflow (Candidate -> Client)
*   **The Problem:** "I found James Wilson for the Fletcher job. Now I need to send his CV and rates to Sarah."
*   **The Solution:** A **"Float Candidate"** Action.
    *   **Trigger:** Click "Float" on Candidate Profile or "Assign" on Project Gap.
    *   **Modal:** "Float [Candidate] to [Client]".
        *   *Select Contact:* Sarah Jenkins.
        *   *Rate Card:* Auto-populated (with Margin preview).
        *   *CV Template:* "Hey Sarah, James is available. 5 years exp. $55/hr."
    *   **Outcome:** Creates a `Placement` record in "Floated" status.

### B. Client Intelligence Panel (The CRM View)
*   **The Problem:** "I need to see everything about Fletcher Construction in one place before I call them."
*   **The Solution:** A sliding drawer for Clients (mirroring the Project Intelligence Panel).
    *   **Tabs:**
        *   **Overview:** Active Jobs, Recent Placements, Financials (YTD Revenue).
        *   **Pulse:** Recent Notes, Tasks, "Ghost Risk" status.
        *   **People:** Key Contacts (Champion vs Blocker) with Relationship DNA.
        *   **Projects:** List of active/upcoming projects linked to this client.

### C. Task Management System
*   **The Problem:** "I have 5 tasks in the feed. I need to complete them."
*   **The Solution:** Interactive Task Cards.
    *   Clicking a "Task" card in Mission Control should open the **Task Action Modal** (Log Call, Send Email, Complete Task).

---

## 8. Phase 4: The "Connected" Expansion (BD & Portal) (NEXT UP)

We are moving beyond "managing what we have" (Ops) to "hunting what we need" (BD) and "empowering who we serve" (Portal).

**The Core Philosophy:** A **Lead** in BD is just a **Project** in embryo. A **Candidate** on the bench is **Inventory** for the Portal.

### 8.1 Pillar 1: The "Hunter Deck" (Business Development)
**Route:** `/app/bd`

#### A. The Tender Radar (Predictive Demand)
*   **Concept:** Ingests data (e.g., council consents, news) to visualize future demand.
*   **Operationalized (Refined):**
    *   **Active Matching:** The system parses tender documents via LLM to extract roles/dates.
    *   **Dynamic Bid Pack:** Automatically generates a "Bid Pack" PDF containing anonymized profiles of *available* candidates matching the tender dates.
    *   **Live Sync:** If a candidate is placed elsewhere, they disappear from the link.

#### B. The Site Spotter (Geospatial War Room)
*   **Visuals:** Overlays "Red Pins" (Competitor Sites) on the map.
*   **Logistics Logic (Refined):**
    *   **Efficiency Layer:** Highlights leads based on route efficiency.
    *   *Example:* If a Stellar van drops a squad at Project A (Green), and Competitor Site B (Red) is 500m away, it flags as a "High Efficiency Lead".

#### C. "Golden Hour" Mode
*   **Concept:** Gamified calling mode. Logs activity directly to Client CRM.

#### D. Ghost Client Resurrection
*   **Logic:** Alerts when high-value clients go quiet (>90 days).

### 8.2 Pillar 2: "Stellar Connect" (Client Portal)
**Subdomain:** `portal.stellar.co.nz`

#### A. Click & Deploy (Self-Service)
*   **Concept:** Clients book staff directly.
*   **Soft Hold Mechanism (Refined):**
    *   "Ticketmaster-style" reservation. Adding a candidate to cart holds them for 15 minutes.
*   **Smart Task Tags (Refined):**
    *   **Safety Check:** Clients must select specific Tasks (e.g., "Concrete Pouring"). System validates candidate compliance (e.g., "Site Safe Silver"). Blocks booking if mismatched.

#### B. The Live Muster
*   **Concept:** Real-time visibility of on-site staff and compliance docs.

#### C. Digital Timesheets
*   **Workflow:** Mobile approval workflow feeding directly into Financials.

### 8.3 Data Architecture Updates
*   **Project Status:** Expand to `Lead` -> `Tender` -> `Active` -> `Complete`.
*   **Public DTO:** Secure data layer for the Portal (hides margins/notes).
