from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class PostType(str, Enum):
    data_driven = "data_driven"
    storytelling = "storytelling"
    hot_take = "hot_take"

class PostStatus(str, Enum):
    draft = "draft"
    approved = "approved"
    posted = "posted"

class PostBase(BaseModel):
    project_id: str
    type: PostType
    content: str
    status: PostStatus = PostStatus.draft
    user_edited: bool = False

class PostInDB(PostBase):
    id: str
    created_at: datetime
    
class PostUpdate(BaseModel):
    content: Optional[str] = None
    status: Optional[PostStatus] = None
    user_edited: Optional[bool] = None
