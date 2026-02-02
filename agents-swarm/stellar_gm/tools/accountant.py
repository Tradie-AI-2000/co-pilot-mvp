import os
from supabase import create_client, Client

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return None
    return create_client(url, key)

def get_financial_health():
    """
    Delegate: The Accountant.
    Calculates weekly payroll liability and gross margin.
    Applies the 'Stellar Burden' logic (1.30x).
    """
    sb = get_supabase()
    if not sb:
        return "Error: Database connection failed (Accountant)."

    # Fetch active placements
    # Schema assumption: 'placements' table or 'candidates' with 'status'='Placed'
    # Based on data-context.js hints from Command Centre:
    # candidates have 'financials': { chargeRate, payRate }
    
    response = sb.table("candidates").select("*").eq("status", "Placed").execute()
    placements = response.data

    total_revenue = 0
    total_payroll = 0
    
    for p in placements:
        # Robust parsing (mirroring JS logic)
        pay_rate = float(p.get("pay_rate", 0) or 0)
        charge_rate = float(p.get("charge_rate", 0) or 0)
        
        # 1.30 BURDEN MULTIPLIER (Logic Parity)
        burdened_cost = pay_rate * 1.30
        
        # Assume 40 hour week for forecast
        weekly_revenue = charge_rate * 40
        weekly_cost = burdened_cost * 40
        
        total_revenue += weekly_revenue
        total_payroll += weekly_cost

    gross_margin = total_revenue - total_payroll
    margin_percent = (gross_margin / total_revenue * 100) if total_revenue > 0 else 0

    return {
        "status": "Healthy" if margin_percent > 15 else "Critical",
        "weekly_revenue": total_revenue,
        "weekly_payroll_liability": total_payroll,
        "gross_margin": gross_margin,
        "margin_percent": round(margin_percent, 2),
        "active_headcount": len(placements)
    }
