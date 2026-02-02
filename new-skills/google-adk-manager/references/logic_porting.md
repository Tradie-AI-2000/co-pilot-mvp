# Logic Porting Guide: JS to Python

This guide details how to port the core business logic from `context/data-context.js` into Python tools for Co-Pilot agents.

## 1. Candidate Enrichment Logic

**Source:** `enrichCandidateData` in `data-context.js`
**Target:** Python Pydantic Model or Dict Helper

The agent must normalize raw Supabase data just like the frontend does.

### Key Transformations
-   **Status Normalization:** Default to "available" if missing.
-   **Financials:** Parse `chargeOutRate`, `payRate`, `guaranteedHours` to floats.
-   **Computed Fields:**
    -   `isMobile`: Check residency for "work visa", "filipino", "mobile".
    -   `name`: Combine `firstName` + `lastName`.

### Python Implementation Pattern

```python
def enrich_candidate(candidate: dict) -> dict:
    residency = candidate.get("residency", "Unknown")
    
    return {
        "id": candidate.get("id"),
        "name": f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}".strip(),
        "status": candidate.get("status", "available"),
        "financials": {
            "charge_rate": float(candidate.get("chargeOutRate") or 0),
            "pay_rate": float(candidate.get("payRate") or 0),
            "guaranteed_hours": float(candidate.get("guaranteedHours") or 0),
        },
        "is_mobile": any(x in residency.lower() for x in ['work visa', 'filipino', 'mobile'])
    }
```

## 2. Financial Metrics Calculation

**Source:** `financialMetrics` (useMemo) in `data-context.js`
**Target:** Python Tool `calculate_weekly_metrics`

### Constants
-   `WORK_WEEK_HOURS = 40`
-   `BURDEN_MULTIPLIER = 1.30` (30% overhead on payroll)

### Formulas

1.  **Weekly Revenue:**
    Sum of `chargeRate * 40` for all candidates where `status == 'on_job'`.
    
2.  **Weekly Payroll:**
    Sum of `payRate * 1.30 * 40` for all candidates where `status == 'on_job'`.
    
3.  **Weekly Gross Profit (GP):**
    `Revenue - Payroll`

4.  **Bench Liability (The "Bleed"):**
    Sum of `payRate * 1.30 * guaranteedHours` for candidates where:
    -   `status == 'available'`
    -   `guaranteedHours > 0`

### Python Tool Example

```python
@tool
def calculate_crew_metrics(candidates: List[dict]) -> dict:
    """Calculates GP and Liability based on Co-Pilot standard formulas."""
    
    active = [c for c in candidates if c['status'] == 'on_job']
    bench = [c for c in candidates if c['status'] == 'available' and c['financials']['guaranteed_hours'] > 0]
    
    revenue = sum(c['financials']['charge_rate'] * 40 for c in active)
    payroll = sum(c['financials']['pay_rate'] * 1.3 * 40 for c in active)
    liability = sum(c['financials']['pay_rate'] * 1.3 * c['financials']['guaranteed_hours'] for c in bench)
    
    return {
        "weekly_revenue": revenue,
        "weekly_gross_profit": revenue - payroll,
        "bench_liability": liability
    }
```
