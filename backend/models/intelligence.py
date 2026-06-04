from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class Trend(BaseModel):
    title: str
    growth_percentage: float
    forecast: str
    keywords: List[str]
    sources: List[str]

class CompetitiveMove(BaseModel):
    company: str
    move: str
    date: datetime
    relevance: float

class AdvancedIntelligence(BaseModel):
    niche: str
    week: int
    trends: List[Trend]
    insights: str
    competitive_moves: List[CompetitiveMove]
    actionable_advice: str
    sentiment: str  # positive, cautious, negative
    data_summary: Dict[str, str]
    created_at: datetime

class AdvancedIntelligenceInDB(AdvancedIntelligence):
    id: str
