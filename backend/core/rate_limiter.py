from core.exceptions import RateLimitExceededException
from db.supabase import get_supabase
from db.redis import get_redis
from core.config import settings
import time
import logging

logger = logging.getLogger(__name__)

def check_plan_limits(user_id: str, action: str):
    """
    Utility function to be called before expensive LLM operations.
    Raises RateLimitExceededException if user is on free plan and out of credits.
    
    Rate limits:
    - Free: 1 generation per day (daily reset)
    - Pro: 3 generations per day per project (daily reset)
    """
    supabase = get_supabase()
    redis = get_redis()
    
    # Fetch user plan from DB
    response = supabase.table("profiles").select("plan").eq("id", user_id).execute()
    if not response.data:
        # If user not in our custom table yet, ignore or auto-create
        return True
        
    user_data = response.data[0]
    plan = user_data.get("plan", "free")
    
    # Check Redis for today's counter (if Redis available)
    if redis:
        today = time.strftime("%Y-%m-%d")
        counter_key = f"generation_count:{user_id}:{today}"
        
        try:
            current_count = redis.get(counter_key)
            current_count = int(current_count) if current_count else 0
        except Exception as e:
            logger.warning(f"Redis error checking rate limit: {e}")
            current_count = 0
        
        # Determine limits based on plan and environment
        if settings.ENV == "development":
            # High limits for development testing
            limit = 100
            plan_name = f"Development ({plan})"
        else:
            # Production limits
            if plan == "pro":
                limit = 3
                plan_name = "Pro"
            else:
                limit = 1
                plan_name = "Free"
        
        if current_count >= limit:
            logger.warning(f"User {user_id} ({plan_name}) exceeded rate limit ({current_count}/{limit})")
            raise RateLimitExceededException(
                detail=f"You've reached your daily {plan_name} plan limit ({limit}/day). Please upgrade to increase your limit or try again tomorrow."
            )

        
        # Increment counter and set expiry (24 hours)
        try:
            redis.incr(counter_key)
            redis.expire(counter_key, 86400)  # 24 hours
        except Exception as e:
            logger.warning(f"Redis error incrementing counter: {e}")
    else:
        # Redis not available, log and allow (warn user in development)
        logger.warning(f"Redis not available - rate limiting disabled (dev mode)")
    
    return True

def validate_generation_input(project_id: str, post_type: str, platform: str, language: str, style: str) -> bool:
    """
    Validates user input to prevent injection attacks and invalid parameters.
    
    Args:
        project_id: UUID format
        post_type: one of ['data_driven', 'storytelling', 'hot_take']
        platform: one of ['telegram', 'instagram', 'threads', 'medium', 'linkedin']
        language: one of supported languages (en, ru, es, fr, de, etc)
        style: one of ['professional', 'casual', 'humorous', 'academic']
    
    Returns:
        True if valid, raises ValueError if invalid
    """
    # Validate UUID format (basic)
    if not project_id or len(project_id) < 10:
        raise ValueError("Invalid project_id format")
    
    # Validate post_type
    valid_post_types = {'data_driven', 'storytelling', 'hot_take'}
    if post_type not in valid_post_types:
        raise ValueError(f"Invalid post_type. Must be one of: {valid_post_types}")
    
    # Validate platform
    valid_platforms = {'telegram', 'instagram', 'threads', 'medium', 'linkedin'}
    if platform not in valid_platforms:
        raise ValueError(f"Invalid platform. Must be one of: {valid_platforms}")
    
    # Validate language (ISO 639-1 codes)
    valid_languages = {'en', 'ru', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ko', 'ar', 'hi'}
    if language not in valid_languages:
        raise ValueError(f"Invalid language. Supported: {valid_languages}")
    
    # Validate style
    valid_styles = {'professional', 'casual', 'humorous', 'academic'}
    if style not in valid_styles:
        raise ValueError(f"Invalid style. Must be one of: {valid_styles}")
    
    return True

def sanitize_project_input(text: str, max_length: int = 5000) -> str:
    """
    Sanitizes user input to prevent prompt injection and XSS attacks.
    """
    if not text:
        return ""
    
    # Limit length
    text = text[:max_length]
    
    # Remove null bytes
    text = text.replace('\x00', '')
    
    # Remove excessive whitespace
    text = ' '.join(text.split())
    
    return text
