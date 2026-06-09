import uuid
import logging
from services.ai_client import ModelTier, get_ai_client
from models.project import ProjectInDB
from prompts.roadmap_prompts import ROADMAP_GENERATION_PROMPT

logger = logging.getLogger(__name__)


async def generate_roadmap(project: ProjectInDB) -> dict:
    brand = project.brand_voice_summary or "Professional but approachable"

    prompt = ROADMAP_GENERATION_PROMPT.format(
        name=project.name,
        stage=project.stage.value,
        niche=project.niche,
        target_audience=project.target_audience,
        description=project.description,
        brand_voice=brand,
    )

    client = get_ai_client()
    try:
        result = await client.generate_json(
            prompt=prompt,
            tier=ModelTier.GEMINI_FLASH,
            estimated_tokens=2048,
        )
    except Exception as e:
        logger.warning(f"generate_json failed: {e}")
        return {"steps": []}

    if not isinstance(result, dict):
        logger.warning(f"generate_json returned non-dict: {type(result).__name__} = {str(result)[:200]}")
        return {"steps": []}

    steps_raw = result.get("steps", [])
    if not steps_raw:
        logger.warning(f"generate_json returned dict without steps key. Keys: {list(result.keys())[:10]}")
        return {"steps": []}

    steps = []
    for i, s in enumerate(steps_raw):
        steps.append({
            "id": str(uuid.uuid4()),
            "title": (s.get("title") or f"Step {i+1}").strip(),
            "description": (s.get("description") or "").strip(),
            "how_to": s.get("how_to", []),
            "resources": s.get("resources", []),
            "timeframe": (s.get("timeframe") or "").strip(),
            "kpi": (s.get("kpi") or "").strip(),
            "priority": s.get("priority", "medium") if s.get("priority") in ("high", "medium", "low") else "medium",
            "status": "pending",
        })

    return {"steps": steps}
