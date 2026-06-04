from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from core.security import get_current_user
from db.supabase import get_supabase
from services.embedding_service import process_and_store_document
from core.rate_limiter import check_plan_limits
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/projects", tags=["knowledge"])

MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
ALLOWED_EXTENSIONS = {".txt", ".md"}

@router.post("/{project_id}/knowledge")
async def upload_knowledge(project_id: str, file: UploadFile = File(...), user=Depends(get_current_user)):
    """
    Handle knowledge base uploads with security checks.
    """
    supabase = get_supabase()
    
    # 1. Verify project ownership
    check = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user.id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # 2. Check file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {ALLOWED_EXTENSIONS}")
        
    # 3. Check rate limits for knowledge processing
    try:
        check_plan_limits(user.id, "upload_knowledge")
    except Exception as e:
        raise HTTPException(status_code=429, detail=str(e))
        
    try:
        # 4. Read content and check size
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds limit (2MB)")
            
        # 5. Decode and sanitize
        try:
            text_content = content.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Invalid file encoding. Use UTF-8.")
            
        # 6. Process document (embedding and storage)
        await process_and_store_document(project_id, text_content)
        
        return {"message": "Knowledge document processed successfully", "filename": file.filename}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Knowledge processing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process document")
