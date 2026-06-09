from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class PriorityPhase(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class StepStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class RoadmapStep(BaseModel):
    id: str
    title: str
    description: str
    how_to: List[str] = []
    resources: List[str] = []
    timeframe: str = ""
    kpi: str = ""
    priority: PriorityPhase = PriorityPhase.medium
    status: StepStatus = StepStatus.pending


class RoadmapBase(BaseModel):
    project_id: str
    steps: List[RoadmapStep]


class RoadmapInDB(RoadmapBase):
    id: str
    generated_at: datetime
    expires_at: Optional[datetime] = None
