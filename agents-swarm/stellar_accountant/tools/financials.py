import os
from supabase import create_client, Client
from typing import List, Dict, Any

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key: return None
    return create_client(url, key)

def _parse_currency(value: Any) -> float:
    if not value: return 0.0
    if isinstance(value, (int, float)): return float(value)
    clean_str = str(value).replace('$', '').replace(',', '').strip()
    return float(''.join(c for c in clean_str if c.isdigit() or c == '.'))

def get_financial_health() -> Dict:
    """
    Delegate: The Accountant.
    Calculates Margin and 'Busy Fool' Deals using 1.30x Burden.
    """
    sb = get_supabase()
    if not sb: return {"error": "DB Connection Failed"}

    try:
        # Placed candidates = Revenue Generating
        response = sb.table("candidates").select("*").in_("status", ["on_job", "placed"]).execute()
        placements = response.data
    except Exception as e:
        return {"error": str(e)}

    total_revenue = 0
    total_payroll = 0
    busy_fools = []
    
    for p in placements:
        pay_rate = _parse_currency(p.get("pay_rate"))
        charge_rate = _parse_currency(p.get("charge_out_rate") or p.get("charge_rate"))
        
        # 1.30 BURDEN LOGIC
        burdened_cost = pay_rate * 1.30
        weekly_revenue = charge_rate * 40
        weekly_cost = burdened_cost * 40
        net_gp = weekly_revenue - weekly_cost
        
        total_revenue += weekly_revenue
        total_payroll += weekly_cost

        # BUSY FOOL FILTER: < $400/week or < 15%
        margin_pct = (net_gp / weekly_revenue * 100) if weekly_revenue > 0 else 0
        if net_gp < 400 or margin_pct < 15:
            busy_fools.append({
                "name": f"{p.get('first_name')} {p.get('last_name')}",
                "net_gp": round(net_gp, 2),
                "margin_pct": round(margin_pct, 1),
                "client": p.get("current_project") or "Unknown"
            })

    gross_margin = total_revenue - total_payroll
    total_margin_percent = (gross_margin / total_revenue * 100) if total_revenue > 0 else 0

    return {
        "status": "Healthy" if total_margin_percent > 18 else "Critical",
        "weekly_revenue": total_revenue,
        "weekly_gross_profit": gross_margin,
        "margin_percent": round(total_margin_percent, 2),
        "busy_fool_deals": busy_fools
    }

def get_bench_liability() -> Dict:
    """
    Calculates the CASH BURN of unassigned candidates with guaranteed hours.
    """
    sb = get_supabase()
    if not sb: return {"error": "DB Connection Failed"}

    try:
        # Available candidates with > 0 guaranteed hours
        res = sb.table("candidates").select("*").eq("status", "available").gt("guaranteed_hours", 0).execute()
        liabilities = res.data
    except Exception as e:
        return {"error": str(e)}

    total_burn = 0
    burn_list = []

    for c in liabilities:
        hours = c.get("guaranteed_hours") or 0
        pay = _parse_currency(c.get("pay_rate"))
        weekly_burn = hours * pay # Direct cost, no burden on bench usually, or add ACC? Let's keep raw pay.
        
        total_burn += weekly_burn
        burn_list.append({
            "name": f"{c.get('first_name')} {c.get('last_name')}",
            "weekly_burn": weekly_burn,
            "guaranteed_hours": hours
        })

    return {
        "status": "Clean" if total_burn == 0 else "Burning Cash",
        "total_weekly_burn": total_burn,
        "liability_list": burn_list
    }
