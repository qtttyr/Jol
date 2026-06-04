from fastapi import APIRouter, Depends, HTTPException
from core.security import get_current_user
from db.supabase import get_supabase
from agents.reddit_agent import search_tech_news_feeds, extract_trending_keywords
from models.project import ProjectInDB

router = APIRouter(prefix="/reddit", tags=["reddit"])

@router.get("/{project_id}/threads")
async def get_reddit_intel(project_id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    
    # 1. Verify project
    project_res = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user.id).execute()
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project = ProjectInDB(**project_res.data[0])
    
    # 2. Search tech news feeds for trending topics (no AI)
    articles = await search_tech_news_feeds(project.niche, limit=10)
    
    results = []
    # 3. Extract keywords from articles
    keywords = await extract_trending_keywords(articles) if articles else []
    
    for article in articles:
        payload = {
            "project_id": project_id,
            "thread_title": article["title"],
            "thread_url": article["link"],
            "draft_reply": article["summary"],  # Use summary as content
            "status": "new"
        }
        
        # Save to DB
        db_res = supabase.table("reddit_threads").insert(payload).execute()
        if db_res.data:
            results.append(db_res.data[0])
            
    return {
        "articles": results,
        "trending_keywords": keywords
    }
