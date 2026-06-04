from fastapi import APIRouter, Depends, HTTPException
from typing import Literal
from pydantic import BaseModel
from core.security import get_current_user
from db.supabase import get_supabase
from agents.content_agent import generate_post_with_params
from core.rate_limiter import check_plan_limits, validate_generation_input
from services.format_service import format_for_platform
from models.project import ProjectInDB
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/content", tags=["content"])

class ContentGenerationRequest(BaseModel):
    post_type: Literal['data_driven', 'storytelling', 'hot_take']
    platform: Literal['telegram', 'instagram', 'threads', 'medium', 'linkedin']
    language: Literal['en', 'ru', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ko', 'ar', 'hi']
    style: Literal['professional', 'casual', 'humorous', 'academic']

@router.post("/generate/{project_id}")
async def generate_content(
    project_id: str, 
    request: ContentGenerationRequest,
    user=Depends(get_current_user)
):
    """
    Generate content with specified parameters.
    
    Parameters:
    - post_type: 'data_driven', 'storytelling', or 'hot_take'
    - platform: 'telegram', 'instagram', 'threads', 'medium', or 'linkedin'
    - language: Two-letter ISO 639-1 code (en, ru, es, fr, de, ja, etc)
    - style: 'professional', 'casual', 'humorous', or 'academic'
    """
    
    # 1. Validate input
    try:
        validate_generation_input(
            project_id=project_id,
            post_type=request.post_type,
            platform=request.platform,
            language=request.language,
            style=request.style
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # 2. Check rate limits
    try:
        check_plan_limits(user.id, "generate_posts")
    except Exception as e:
        raise HTTPException(status_code=429, detail=str(e))
    
    # 3. Fetch project context
    supabase = get_supabase()
    project_res = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user.id).execute()
    
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project = ProjectInDB(**project_res.data[0])
    
    # 4. Generate post with parameters
    try:
        result = await generate_post_with_params(
            project=project,
            post_type=request.post_type,
            platform=request.platform,
            language=request.language,
            style=request.style
        )
    except Exception as e:
        logger.error(f"Content generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate content")
    
    if "error" in result:
        logger.error(f"Generation error: {result['error']}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {result['error']}")
    
    # 5. Format and save to DB
    content_raw = result.get("content", "")
    
    post_payload = {
        "project_id": project_id,
        "type": request.post_type,
        "platform": request.platform,
        "language": request.language,
        "style": request.style,
        "content": format_for_platform(content_raw, request.platform),
        "status": "draft",
        "user_edited": False
    }
    
    try:
        db_res = supabase.table("posts").insert(post_payload).execute()
        if not db_res.data:
            raise HTTPException(status_code=500, detail="Failed to save post")
    except Exception as e:
        logger.error(f"DB error inserting post: {e}")
        # Check if it's a missing column error
        error_str = str(e).lower()
        if "column" in error_str and ("does not exist" in error_str or "missing" in error_str):
            raise HTTPException(status_code=500, detail="Database schema error. Please run the migration script to add the required columns (platform, language, style, content) to the posts table.")
        else:
            raise HTTPException(status_code=500, detail="Failed to save post due to a database error.")
    
    # Increment user post gen count
    try:
        supabase.rpc('increment_post_count', {'user_uuid': user.id}).execute()
    except Exception as e:
        logger.warning(f"Failed to increment post count: {e}")
    
    return {
        "message": "Generated successfully",
        "post": db_res.data[0],
        "platform": request.platform,
        "language": request.language
    }

@router.get("/posts/{project_id}")
async def get_posts(project_id: str, user=Depends(get_current_user)):
    """Get all posts for a project with pagination."""
    supabase = get_supabase()
    
    # Verify ownership
    project_res = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user.id).execute()
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Fetch posts ordered by creation date
    posts_res = supabase.table("posts").select("*").eq("project_id", project_id).order("created_at", desc=True).execute()
    
    return {"posts": posts_res.data or []}

@router.patch("/posts/{post_id}")
async def update_post(post_id: str, updates: dict, user=Depends(get_current_user)):
    """Update post content or status."""
    supabase = get_supabase()
    
    # Get post and verify ownership
    post_res = supabase.table("posts").select("project_id").eq("id", post_id).execute()
    if not post_res.data:
        raise HTTPException(status_code=404, detail="Post not found")
    
    project_id = post_res.data[0]["project_id"]
    project_res = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user.id).execute()
    if not project_res.data:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Sanitize updates - only allow safe fields
    allowed_fields = {"content", "status", "user_edited"}
    safe_updates = {k: v for k, v in updates.items() if k in allowed_fields}
    
    if "status" in safe_updates and safe_updates["status"] not in ["draft", "approved", "posted"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = supabase.table("posts").update(safe_updates).eq("id", post_id).execute()
    return result.data[0] if result.data else {"error": "Update failed"}

