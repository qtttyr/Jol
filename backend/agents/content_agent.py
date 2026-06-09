from services.ai_client import ModelTier, get_ai_client
from prompts.content_prompts import (
    PREMIUM_WRITER_INSTRUCTIONS,
    DATA_DRIVEN_OBJECTIVE,
    STORYTELLING_OBJECTIVE,
    HOT_TAKE_OBJECTIVE,
    BRAND_VOICE_ANALYSIS_PROMPT,
)
from models.project import ProjectInDB

OBJECTIVES = {
    "data_driven": DATA_DRIVEN_OBJECTIVE,
    "storytelling": STORYTELLING_OBJECTIVE,
    "hot_take": HOT_TAKE_OBJECTIVE,
}

PLATFORMS = ["telegram", "instagram", "threads", "medium", "linkedin", "reddit"]
LANGUAGES = ["en", "ru", "es", "fr", "de", "it", "pt", "ja", "zh", "ko", "ar", "hi"]
STYLES = ["professional", "casual", "humorous", "academic"]


def _build_writer_prompt(
    name: str, niche: str, stage: str, target_audience: str, description: str,
    brand_voice_summary: str, post_type_objective: str,
    platform: str = "", language: str = "", style: str = "",
) -> str:
    brand_voice = brand_voice_summary or "Write professionally but approachably."

    context = f"""STARTUP CONTEXT:
Name: {name}
Niche: {niche}
Stage: {stage}
Target Audience: {target_audience}
Description: {description}

BRAND VOICE: {brand_voice}

POST TYPE: {post_type_objective}"""

    if platform:
        context += f"\nPLATFORM: {platform}\nLANGUAGE: {language}\nSTYLE: {style}"

    return f"""{PREMIUM_WRITER_INSTRUCTIONS}

{context}

Write the post now. Return ONLY valid JSON: {{"content": "..."}}"""


async def generate_post_with_params(
    project: ProjectInDB,
    post_type: str,
    platform: str,
    language: str,
    style: str,
) -> dict:
    if post_type not in OBJECTIVES:
        raise ValueError(f"Invalid post type: {post_type}")
    if platform not in PLATFORMS:
        raise ValueError(f"Invalid platform: {platform}")
    if language not in LANGUAGES:
        raise ValueError(f"Invalid language: {language}")
    if style not in STYLES:
        raise ValueError(f"Invalid style: {style}")

    prompt = _build_writer_prompt(
        name=project.name,
        niche=project.niche,
        stage=project.stage.value,
        target_audience=project.target_audience,
        description=project.description,
        brand_voice_summary=project.brand_voice_summary,
        post_type_objective=OBJECTIVES[post_type],
        platform=platform,
        language=language,
        style=style,
    )

    client = get_ai_client()
    try:
        result = await client.generate_json(
            prompt=prompt,
            tier=ModelTier.GROQ_WRITER,
            estimated_tokens=1500,
        )
        return result
    except Exception as e:
        return {"error": str(e)}


async def analyze_brand_voice(examples: list[str]) -> str:
    if not examples:
        return ""

    combined = "\n\n--- EXAMPLE ---\n\n".join(examples)
    prompt = BRAND_VOICE_ANALYSIS_PROMPT.format(examples=combined)

    client = get_ai_client()
    try:
        return await client.generate(prompt=prompt, tier=ModelTier.GEMINI_FLASH)
    except Exception:
        return "Failed to analyze brand voice."
