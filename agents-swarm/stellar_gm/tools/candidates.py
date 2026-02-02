import os
from supabase import create_client, Client

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return None
    return create_client(url, key)

def search_talent(query_role: str):
    """
    Delegate: Candidate Manager (Scout).
    Searches for candidates and enriches them with Mobility data.
    """
    sb = get_supabase()
    if not sb:
        return "Error: Database connection failed (Candidate Mgr)."

    # Simple search (can be enhanced with vector search later)
    # Using ilike for broad matching
    response = sb.table("candidates").select("*").ilike("role", f"%{query_role}%").limit(5).execute()
    candidates = response.data
    
    enriched_results = []
    
    for c in candidates:
        residency = (c.get("residency_status") or "").lower()
        nationality = (c.get("nationality") or "").lower()
        
        # LOGIC PARITY: Enrichment
        is_mobile = "work visa" in residency or "filipino" in nationality
        
        enriched_results.append({
            "id": c.get("id"),
            "name": f"{c.get('first_name')} {c.get('last_name')}",
            "role": c.get("role"),
            "status": c.get("status"),
            "is_mobile": is_mobile,  # <--- Critical Flag
            "location": c.get("region")
        })

    return enriched_results
