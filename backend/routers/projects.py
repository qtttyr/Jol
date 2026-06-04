from fastapi import APIRouter, Depends, HTTPException, status
from core.security import get_current_user
from models.project import ProjectCreate, ProjectUpdate, ProjectInDB
from db.supabase import get_supabase
from agents.brand_voice_agent import analyze_brand_voice

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("", response_model=ProjectInDB)
async def create_project(project: ProjectCreate, user=Depends(get_current_user)):
    supabase = get_supabase()
    
    # Ensure profile exists for users created before the DB trigger
    check_profile = supabase.table("profiles").select("id").eq("id", user.id).execute()
    if not check_profile.data:
        try:
            supabase.table("profiles").insert({"id": user.id, "email": user.email, "plan": "free"}).execute()
        except Exception as e:
            print(f"Failed to auto-create profile: {e}")
            
    # Analyze brand voice from examples via AI
    # This might take a few seconds, so we await it
    bv_summary = ""
    if project.brand_voice_examples:
        bv_summary = await analyze_brand_voice(project.brand_voice_examples)
    
    payload = {
        "user_id": user.id,
        "name": project.name,
        "stage": project.stage.value,
        "description": project.description,
        "target_audience": project.target_audience,
        "niche": project.niche,
        "brand_voice_examples": project.brand_voice_examples,
        "brand_voice_summary": bv_summary
    }
    
    response = supabase.table("projects").insert(payload).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create project")
        
    return response.data[0]

@router.patch("/{project_id}", response_model=ProjectInDB)
async def update_project(project_id: str, updates: ProjectUpdate, user=Depends(get_current_user)):
    supabase = get_supabase()
    
    # Ensure ownership
    check = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user.id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Project not found")
        
    update_data = updates.model_dump(exclude_unset=True)
    if "stage" in update_data and hasattr(update_data["stage"], "value"):
        update_data["stage"] = update_data["stage"].value
        
    response = supabase.table("projects").update(update_data).eq("id", project_id).execute()
    
    return response.data[0]
