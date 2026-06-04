import asyncio
import logging
from google import genai
from core.config import settings
from db.supabase import get_supabase

logger = logging.getLogger(__name__)


def split_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list[str]:
    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)

    return chunks


async def process_and_store_document(project_id: str, text: str):
    try:
        chunks = split_text(text)
        if not chunks:
            logger.warning(f"No chunks to process for project {project_id}")
            return False

        client = genai.Client(api_key=settings.GOOGLE_AI_STUDIO_KEY)

        response = await asyncio.to_thread(
            lambda: client.models.embed_content(
                model="text-embedding-004",
                contents=chunks,
            )
        )

        vectors = [e.values for e in response.embeddings]

        supabase = get_supabase()
        records = [
            {
                "project_id": project_id,
                "content": chunk,
                "embedding": vector,
            }
            for chunk, vector in zip(chunks, vectors)
        ]

        supabase.table("documents").insert(records).execute()

        logger.info(f"Stored {len(records)} embeddings for project {project_id}")
        return True
    except Exception as e:
        logger.error(f"Error in embedding service: {e}")
        raise
