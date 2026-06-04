from fastapi import APIRouter, Depends, HTTPException
from core.security import get_current_user
from db.supabase import get_supabase
from agents.roadmap_agent import generate_roadmap as ai_generate_roadmap
from services.cache_service import get_cached_item, set_cached_item
from core.rate_limiter import check_plan_limits
from models.project import ProjectInDB
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.get("/{project_id}")
async def get_roadmap(project_id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    
    # 1. Verify project ownership
    project_res = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user.id).execute()
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = ProjectInDB(**project_res.data[0])
    
    # 2. Get user plan for Free tier limitation
    user_res = supabase.table("profiles").select("plan").eq("id", user.id).execute()
    is_free = user_res.data and user_res.data[0].get("plan") == "free" if user_res.data else True
        
    # 3. Check Cache
    cache_key = f"roadmap:{project_id}"
    cached = get_cached_item(cache_key)
    if cached:
        # Apply Free tier limit: only return first 3 steps
        if is_free and "steps" in cached:
            cached = {**cached, "steps": cached["steps"][:3]}
        return cached
        
    # 4. Check DB
    db_res = supabase.table("roadmaps").select("*").eq("project_id", project_id).execute()
    if db_res.data:
        roadmap = db_res.data[0]
        set_cached_item(cache_key, roadmap)
        # Apply Free tier limit: only return first 3 steps
        if is_free and "steps" in roadmap:
            roadmap = {**roadmap, "steps": roadmap["steps"][:3]}
        return roadmap
        
    # 5. Generate if neither
    return await refresh_roadmap(project_id, user)


@router.post("/{project_id}/refresh")
async def refresh_roadmap(project_id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    
    # 1. Verify project ownership
    project_res = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user.id).execute()
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # 2. Check rate limits for roadmap refresh (expensive generation)
    try:
        check_plan_limits(user.id, "refresh_roadmap")
    except Exception as e:
        raise HTTPException(status_code=429, detail=str(e))
        
    project = ProjectInDB(**project_res.data[0])
    
    # 3. Get user plan for Free tier limitation
    user_res = supabase.table("profiles").select("plan").eq("id", user.id).execute()
    is_free = user_res.data and user_res.data[0].get("plan") == "free" if user_res.data else True
    
    # 4. Hit Gemini LLM
    try:
        result = await ai_generate_roadmap(project)
    except Exception as e:
        logger.error(f"Roadmap generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate roadmap")
    
    steps = result.get("steps", [])
    
    # 5. Save full roadmap to DB (upsert-like logic)
    payload = {
        "project_id": project_id,
        "steps": steps
    }
    
    try:
        # Delete existing roadmap for this project
        supabase.table("roadmaps").delete().eq("project_id", project_id).execute()
        # Insert new roadmap
        db_res = supabase.table("roadmaps").insert(payload).execute()
        roadmap = db_res.data[0] if db_res.data else payload
    except Exception as e:
        logger.error(f"DB error saving roadmap: {e}")
        raise HTTPException(status_code=500, detail="Failed to save generated roadmap")
    
    # 6. Update Cache
    cache_key = f"roadmap:{project_id}"
    set_cached_item(cache_key, roadmap)
    
    # 7. Apply Free tier limit: only return first 3 steps
    if is_free and "steps" in roadmap:
        roadmap = {**roadmap, "steps": roadmap["steps"][:3]}
    
    return roadmap
