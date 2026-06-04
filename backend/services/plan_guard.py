from fastapi import Depends
from core.security import get_current_user
from core.exceptions import UnauthorizedException
from db.supabase import get_supabase
import logging

logger = logging.getLogger(__name__)

FEATURE_LIMITS = {
    "brand_voice": {"free": False, "pro": True, "dev": True},
    "roadmap_full": {"free": False, "pro": True, "dev": True},
    "projects": {"free": 1, "pro": 3, "dev": 100},
    "daily_generations": {"free": 1, "pro": 3, "dev": 100},
}


def get_user_plan(user_id: str) -> str:
    supabase = get_supabase()
    response = supabase.table("profiles").select("plan").eq("id", user_id).execute()
    if response.data:
        return response.data[0].get("plan", "free")
    return "free"


def check_feature_access(feature: str, user=Depends(get_current_user)):
    plan = get_user_plan(user.id)
    limits = FEATURE_LIMITS.get(feature)

    if limits is None:
        return True

    limit = limits.get(plan, limits.get("free", False))

    if isinstance(limit, bool):
        if not limit:
            raise UnauthorizedException(
                detail=f"'{feature}' is a Pro feature. Please upgrade your plan to access it."
            )
    elif isinstance(limit, int):
        supabase = get_supabase()
        if feature == "projects":
            count = supabase.table("projects").select("id", count="exact").eq("user_id", user.id).execute()
            current = count.count if hasattr(count, 'count') else len(count.data or [])
            if current >= limit:
                raise UnauthorizedException(
                    detail=f"Free plan allows up to {limit} project(s). Upgrade to Pro for more."
                )

    return True
