import os
from supabase import create_client, Client
from datetime import datetime, timedelta
import dateutil.parser

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key: return None
    return create_client(url, key)

def search_clients(region: str = None, industry: str = None):
    """Finds clients based on region or industry."""
    sb = get_supabase()
    if not sb: return "Error"
    try:
        query = sb.table("clients").select("*")
        if region: query = query.ilike("region", f"%{region}%")
        if industry: query = query.ilike("industry", f"%{industry}%")
        res = query.limit(5).execute()
        return res.data
    except Exception as e: return str(e)

def get_golden_hour_list():
    """Generates priority call list (Tier 1 decay + Tenders)."""
    sb = get_supabase()
    if not sb: return []
    try:
        res = sb.table("clients").select("*").eq("tier", "1").execute() # Enum might be string '1'
        clients = res.data
        risks = []
        now = datetime.now()
        for c in clients:
            last = c.get("last_contact")
            days = 99
            if last:
                days = (now - dateutil.parser.parse(last).replace(tzinfo=None)).days
            if days > 14:
                risks.append({"name": c.get("name"), "days_silent": days})
        return {"strategy": "Attack Decay", "call_list": risks}
    except Exception as e: return str(e)

def find_demand_for_squad(squad: dict):
    """
    Refactor P1: Proximity Matchmaker.
    Finds clients near the Squad's region.
    """
    region = squad.get("logistics", {}).get("region", "")
    if not region: return "No region in squad data."
    
    clients = search_clients(region=region)
    return {
        "match_type": "Regional Proximity",
        "squad_region": region,
        "potential_clients": clients
    }
