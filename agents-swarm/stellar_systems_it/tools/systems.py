import os
from supabase import create_client, Client

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key: return None
    return create_client(url, key)

def audit_data_quality():
    """Checks for missing critical fields (Phone, Email, SiteSafe)."""
    sb = get_supabase()
    if not sb: return "Error"
    try:
        res = sb.table("candidates").select("*").execute()
        issues = []
        for c in res.data:
            missing = []
            if not c.get("phone"): missing.append("Phone")
            if not c.get("email"): missing.append("Email")
            if missing:
                issues.append({"name": f"{c.get('first_name')} {c.get('last_name')}", "missing": missing})
        return {"status": "Audit Complete", "issues_count": len(issues), "details": issues[:5]}
    except Exception as e: return str(e)

def validate_trade_logic(project_type: str, role: str):
    """Enforces the Trade Matrix."""
    matrix = {
        "CIVIL": ["Labourer", "Digger", "Drainlayer"],
        "STRUCTURE": ["Carpenter", "Hammerhand", "Concrete"],
        "INTERIOR": ["Painter", "GIB"]
    }
    allowed = matrix.get(project_type.upper(), [])
    if role in allowed: return "VALID"
    return f"VIOLATION: {role} cannot work on {project_type} site."
