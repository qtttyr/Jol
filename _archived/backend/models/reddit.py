from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class ThreadStatus(str, Enum):
    new = "new"
    reviewed = "reviewed"
    posted = "posted"

class RedditThreadBase(BaseModel):
    project_id: str
    thread_url: str
    thread_title: str
    draft_reply: str
    status: ThreadStatus = ThreadStatus.new

class RedditThreadInDB(RedditThreadBase):
    id: str
    found_at: datetime
    
class RedditThreadUpdate(BaseModel):
    draft_reply: Optional[str] = None
    status: Optional[ThreadStatus] = None
