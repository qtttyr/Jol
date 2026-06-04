from apscheduler.schedulers.asyncio import AsyncIOScheduler
from db.supabase import get_supabase
import logging

logger = logging.getLogger(__name__)

async def generate_daily_content_job():
    """
    Background job to generate content for pro users.
    """
    logger.info("Executing daily content generation job...")
    # Fetch pro projects
    # For each, run agents.content_agent.generate_all_posts
    # Save to db

async def generate_weekly_digest_job():
    """
    Background job to generate weekly digests for active niches.
    """
    logger.info("Executing weekly intelligence digest job...")
    # Fetch unique niches
    # Run agents.intelligence_agent.generate_weekly_digest
    # Cache / save to DB

def setup_scheduler(scheduler: AsyncIOScheduler):
    # Scheduled to run every day at 00:00 midnight
    scheduler.add_job(generate_daily_content_job, "cron", hour=0, minute=0)
    
    # Scheduled to run every Monday at 06:00 AM
    scheduler.add_job(generate_weekly_digest_job, "cron", day_of_week="mon", hour=6, minute=0)
    
    logger.info("Background scheduler initialized with daily/weekly jobs.")
