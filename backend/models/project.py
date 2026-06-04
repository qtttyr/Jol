from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ProjectStage(str, Enum):
    idea = "idea"
    mvp = "mvp"
    growth = "growth"
    scale = "scale"

class ProjectBase(BaseModel):
    name: str
    stage: ProjectStage
    description: str
    target_audience: str
    niche: str

class ProjectCreate(ProjectBase):
    brand_voice_examples: List[str]

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    stage: Optional[ProjectStage] = None
    description: Optional[str] = None
    target_audience: Optional[str] = None
    niche: Optional[str] = None

class ProjectInDB(ProjectBase):
    id: str
    user_id: str
    brand_voice_examples: List[str]
    brand_voice_summary: Optional[str] = None
    created_at: datetime
