# Agent Refactor Plan: IMMIGRATION (Stellar-Immigration)

**Status**: DEFINED
**Source**: User Interview (The Visa Guard)

## 1. Core Philosophy (The Sentinel)
Immigration is a "Hard Stop" gatekeeper. It parses the Visa Conditions to enforce Role, Region, and Employer locks.

## 2. New Logic Capabilities (`services/logic-hub.js`)

### A. The Visa Guard (Condition Validator) - P0
*   **Trigger**: `#site-access-check` / `#validate-placement`
*   **Input**: Candidate (Visa Data) + Project (Location/Role).
*   **Logic**:
    1.  **Role Match**: `if (candidate.visa_role !== placement.role) return "VIOLATION_ROLE";`
    2.  **Region Guard**: `if (!candidate.visa_regions.includes(project.region)) return "VIOLATION_REGION";`
    3.  **Employer Lock**: `if (placement.paying_entity !== candidate.visa_employer) return "VIOLATION_EMPLOYER";`
*   **Output**: "STOP: Visa Restriction Breach. [Reason]."

### B. Expiry Horizon (90-Day Radar) - P1
*   **Trigger**: Daily Scan.
*   **Logic**: `if (visa.expiry < NOW + 90_DAYS) return "RENEWAL_RISK";`
*   **Action**: Auto-generate "VOC Renewal" email draft.

### C. Pastoral Defense (The Checklist) - P2
*   **Trigger**: `#pastoral-defense`
*   **Logic**: Check `visa_label`, `passport_number` (P8589132A), `tenancy`, `bank`, `ird`.

## 3. Revised Agent Definition (`stellar-immigration.agent.yaml`)

*   **Role**: Compliance Sentinel.
*   **Critical Actions**:
    *   READ `logic-hub.validateVisaConditions()`
    *   READ `logic-hub.getRenewalRadar()`
*   **Prompts**: Updated to parse INZ document fields (Application Number, Conditions Blob).