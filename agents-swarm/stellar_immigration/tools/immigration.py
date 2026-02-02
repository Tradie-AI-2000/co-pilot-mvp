import os
from supabase import create_client, Client
from datetime import datetime

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key: return None
    return create_client(url, key)

def check_visa_risks():
    """Scans for visas expiring in < 90 days."""
    sb = get_supabase()
    if not sb: return "Error"
    try:
        # Fetch active candidates
        res = sb.table("candidates").select("*").not_.is_("visa_expiry", "null").execute()
        risks = []
        now = datetime.now()
        for c in res.data:
            expiry = c.get("visa_expiry")
            # Parse ISO string
            days_left = (datetime.fromisoformat(expiry.replace('Z','')) - now).days
            if days_left < 90:
                risks.append({"name": c.get("first_name"), "days_left": days_left})
        return {"status": "Risk Scan", "expiring_soon": risks}
    except Exception as e: return str(e)

def get_arrival_logistics():
    """Placeholder for flight arrivals."""
    return {"arrivals": [], "pastoral_care_needed": False}
