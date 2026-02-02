import os
from supabase import create_client, Client
from typing import List, Dict, Any

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("CRITICAL: Supabase credentials missing.")
        return None
    return create_client(url, key)

def _parse_currency(value: Any) -> float:
    if not value: return 0.0
    if isinstance(value, (int, float)): return float(value)
    clean_str = str(value).replace('$', '').replace(',', '').strip()
    return float(''.join(c for c in clean_str if c.isdigit() or c == '.'))

def _enrich_candidate(c: Dict) -> Dict:
    """
    Applies Stellar Business Logic to raw DB rows.
    Mirrors 'data-context.js' enrichment.
    """
    residency = (c.get("residency") or "").lower()
    role = (c.get("role") or "").lower()
    compliance = c.get("compliance") or {}
    
    # LOGIC: Mobility (The 'Ute' Factor)
    # Assumes Work Visa holders or specific crews are mobile/willing to travel
    is_mobile = "work visa" in residency or "filipino" in residency or "mobile" in residency
    
    # LOGIC: Seniority
    is_senior = "lbp" in role or "foreman" in role or "manager" in role or _parse_currency(c.get("pay_rate")) > 38

    return {
        "id": c.get("id"),
        "name": f"{c.get('first_name')} {c.get('last_name')}",
        "role": c.get("role"),
        "status": c.get("status"),
        "region": c.get("suburb") or c.get("state") or "Unknown",
        "pay_rate": _parse_currency(c.get("pay_rate")),
        "charge_rate": _parse_currency(c.get("charge_out_rate") or c.get("charge_rate")),
        "is_mobile": is_mobile,
        "is_senior": is_senior,
        "site_safe": compliance.get("siteSafeExpiry") is not None or c.get("site_safe_expiry") is not None
    }

def search_talent(query: str, status: str = "available") -> List[Dict]:
    """
    Delegate: Candidate Manager (Scout).
    Finds specific talent matching a role and status.
    """
    sb = get_supabase()
    if not sb: return [{"error": "DB Connection Failed"}]

    try:
        # Flexible search on Role or Skills
        response = sb.table("candidates").select("*") \
            .eq("status", status) \
            .ilike("role", f"%{query}%") \
            .limit(15) \
            .execute()
            
        return [_enrich_candidate(c) for c in response.data]
    except Exception as e:
        return [{"error": f"Search failed: {str(e)}"}]

def get_bench_strength() -> Dict:
    """
    Returns a snapshot of the 'Available' workforce.
    Crucial for the 'Bench Zero' strategy.
    """
    sb = get_supabase()
    if not sb: return {}

    try:
        response = sb.table("candidates").select("*").eq("status", "available").execute()
        bench = [_enrich_candidate(c) for c in response.data]
        
        return {
            "total_count": len(bench),
            "mobile_units": len([c for c in bench if c['is_mobile']]),
            "seniors": len([c for c in bench if c['is_senior']]),
            "roster": bench
        }
    except Exception as e:
        return {"error": str(e)}

def generate_squads(region: str) -> List[Dict]:
    """
    Refactor P1: Squad Builder (1 Senior : 2 Juniors).
    Calculates the 'Commercial Value' of the squad automatically.
    """
    sb = get_supabase()
    if not sb: return []
    
    try:
        # Fetch available candidates in region
        res = sb.table("candidates").select("*") \
            .eq("status", "available") \
            .ilike("suburb", f"%{region}%") \
            .execute()
            
        candidates = [_enrich_candidate(c) for c in res.data]
        
        seniors = [c for c in candidates if c['is_senior']]
        juniors = [c for c in candidates if not c['is_senior']]
        
        squads = []
        squad_id = 1
        
        # Build 1:2 Squads
        while len(seniors) >= 1 and len(juniors) >= 2:
            s = seniors.pop(0)
            j1 = juniors.pop(0)
            j2 = juniors.pop(0)
            
            # Commercial Logic
            total_charge = s['charge_rate'] + j1['charge_rate'] + j2['charge_rate']
            weekly_revenue = total_charge * 40
            
            squads.append({
                "squad_id": f"SQ-{region.upper()[:3]}-{squad_id}",
                "composition": "1 Senior + 2 Juniors",
                "leader": s,
                "crew": [j1, j2],
                "financials": {
                    "hourly_charge_total": total_charge,
                    "est_weekly_revenue": weekly_revenue
                },
                "logistics": {
                    "has_vehicle": s['is_mobile'] or j1['is_mobile'] or j2['is_mobile'],
                    "region": region
                }
            })
            squad_id += 1
            
        return squads
    except Exception as e:
        return [{"error": f"Squad generation failed: {str(e)}"}]