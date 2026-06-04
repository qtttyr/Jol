import os
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.exceptions import UnauthorizedException
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)

# Assuming Supabase JWTs are signed with this secret
# This should ideally come from .env (SUPABASE_JWT_SECRET)
# For this basic implementation, we can just use the auth client to get user context,
# but decoding helps avoiding DB trips on every request if we have the secret.

class MockUser:
    def __init__(self, user_id: str = "dev-user-123"):
        self.id = user_id
        self.email = "dev@example.com"
        self.user_metadata = {}

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    from db.supabase import get_supabase

    if credentials:
        token = credentials.credentials
        supabase = get_supabase()

        try:
            user_response = supabase.auth.get_user(token)
            if user_response.user:
                return user_response.user
        except Exception as e:
            logger.error(f"Auth error: {e}")

    if os.getenv("USE_MOCK_AUTH", "").lower() in ("true", "1"):
        logger.warning("Using mock user (USE_MOCK_AUTH=true)")
        return MockUser()

    raise UnauthorizedException(detail="Missing or invalid authentication credentials")
