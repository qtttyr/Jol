from typing import Optional
from fastapi import HTTPException, status

class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Not authenticated"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers={"WWW-Authenticate": "Bearer"})

class RateLimitExceededException(HTTPException):
    def __init__(self, detail: str = "Rate limit exceeded. Try again later or upgrade your plan."):
        super().__init__(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail)
