from fastapi import APIRouter, Depends, HTTPException
from core.security import get_current_user
from db.supabase import get_supabase
from agents.intelligence_agent import generate_weekly_intelligence
from services.cache_service import get_cached_item, set_cached_item
from core.rate_limiter import check_plan_limits
import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/intelligence", tags=["intelligence"])

@router.get("/{project_id}")
async def get_intelligence_digest(project_id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    
    # 1. Verify project ownership
    project_res = supabase.table("projects").select("niche").eq("id", project_id).eq("user_id", user.id).execute()
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Project not found")
        
    niche = project_res.data[0].get("niche", "SaaS")
    
    # 2. Check cache for THIS week and THIS niche
    week_num = datetime.datetime.now().isocalendar()[1]
    str_niche = niche.lower().replace(" ", "_")
    cache_key = f"advanced_intelligence:{str_niche}:{week_num}"
    
    cached = get_cached_item(cache_key)
    if cached:
        return cached
    
    # 3. Check rate limits if NOT in cache (expensive generation)
    try:
        check_plan_limits(user.id, "generate_intelligence")
    except Exception as e:
        raise HTTPException(status_code=429, detail=str(e))
        
    # 4. Generate new intelligence report
    try:
        result = await generate_weekly_intelligence(niche, week=week_num)
    except Exception as e:
        logger.error(f"Intelligence generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate intelligence report")
    
    payload = {
        "niche": niche,
        "week": week_num,
        "trends": result["trends"],
        "insights": result["insights"],
        "competitive_moves": result["competitive_moves"],
        "actionable_advice": result["actionable_advice"],
        "sentiment": result["sentiment"],
        "data_summary": result["data_summary"],
        "created_at": result["created_at"]
    }
    
    # Save to DB
    db_res = supabase.table("weekly_digests").insert(payload).execute()
    intelligence = db_res.data[0] if db_res.data else payload
    
    # Cache for 7 days
    set_cached_item(cache_key, intelligence, expires_in=86400 * 7)
    
    return intelligence


@router.post("/{project_id}/refresh")
async def refresh_intelligence(project_id: str, user=Depends(get_current_user)):
    supabase = get_supabase()

    project_res = supabase.table("projects").select("niche").eq("id", project_id).eq("user_id", user.id).execute()
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Project not found")

    niche = project_res.data[0].get("niche", "SaaS")

    try:
        check_plan_limits(user.id, "generate_intelligence")
    except Exception as e:
        raise HTTPException(status_code=429, detail=str(e))

    week_num = datetime.datetime.now().isocalendar()[1]
    str_niche = niche.lower().replace(" ", "_")
    cache_key = f"advanced_intelligence:{str_niche}:{week_num}"

    # Bust cache and regenerate
    from services.cache_service import delete_cached_item
    delete_cached_item(cache_key)

    try:
        result = await generate_weekly_intelligence(niche, week=week_num)
    except Exception as e:
        logger.error(f"Intelligence generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate intelligence report")

    payload = {
        "niche": niche,
        "week": week_num,
        "trends": result["trends"],
        "insights": result["insights"],
        "competitive_moves": result["competitive_moves"],
        "actionable_advice": result["actionable_advice"],
        "sentiment": result["sentiment"],
        "data_summary": result["data_summary"],
        "created_at": result["created_at"]
    }

    db_res = supabase.table("weekly_digests").insert(payload).execute()
    intelligence = db_res.data[0] if db_res.data else payload

    set_cached_item(cache_key, intelligence, expires_in=86400 * 7)

    return intelligence
