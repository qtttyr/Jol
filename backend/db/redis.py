import redis
from core.config import settings
import logging

logger = logging.getLogger(__name__)

redis_client = None

def get_redis() -> redis.Redis:
    global redis_client
    if not redis_client:
        if settings.REDIS_URL:
            try:
                redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
                logger.info("Redis client initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize Redis client: {e}")
                redis_client = None
        else:
            logger.warning("REDIS_URL is not set. Cache operations will be bypassed.")
    return redis_client
