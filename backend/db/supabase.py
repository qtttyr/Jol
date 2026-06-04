from supabase import create_client, Client
from core.config import settings
import logging

logger = logging.getLogger(__name__)

supabase_client: Client = None

def get_supabase() -> Client:
    global supabase_client
    if not supabase_client:
        try:
            supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
            logger.info("Supabase admin client initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise e
    return supabase_client
