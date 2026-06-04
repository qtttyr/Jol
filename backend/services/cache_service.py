import json
from db.redis import get_redis
import logging

logger = logging.getLogger(__name__)

def get_cached_item(key: str) -> dict | None:
    """Gets a JSON item from Redis cache."""
    redis = get_redis()
    if not redis:
        return None
        
    try:
        val = redis.get(key)
        if val:
            return json.loads(val)
    except Exception as e:
        logger.error(f"Redis get error for {key}: {e}")
    return None

def set_cached_item(key: str, value: dict, expires_in: int = 86400) -> bool:
    """Saves a JSON item to Redis cache with TTL (default 24h)."""
    redis = get_redis()
    if not redis:
        return False
        
    try:
        redis.setex(key, expires_in, json.dumps(value))
        return True
    except Exception as e:
        logger.error(f"Redis set error for {key}: {e}")
        return False
        
def delete_cached_item(key: str) -> bool:
    """Deletes an item from Redis."""
    redis = get_redis()
    if not redis:
        return False
        
    try:
        redis.delete(key)
        return True
    except Exception as e:
        logger.error(f"Redis delete error for {key}: {e}")
        return False
