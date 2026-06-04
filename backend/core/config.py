import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Jol Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENV: str = "development"

    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str

    REDIS_URL: str = ""

    GOOGLE_AI_STUDIO_KEY: str
    GROQ_API_KEY: str

    GEMINI_MODEL: str = "gemini-3-flash-preview"
    GROQ_WRITER_MODEL: str = "llama-3.1-8b-instant"
    GROQ_FALLBACK_MODEL: str = "qwen/qwen3-32b"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
