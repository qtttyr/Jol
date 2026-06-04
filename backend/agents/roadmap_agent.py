import json
from services.ai_client import ModelTier, get_ai_client
from models.project import ProjectInDB

ROADMAP_PROMPT = """
You are a fractional CMO specializing in early-stage startups ({stage} stage).
The founder is building a product in the {niche} space.

STARTUP CONTEXT:
Name: {name}
Audience: {target_audience}
Description: {description}

Generate a step-by-step marketing roadmap tailored EXACTLY to this product and its current stage.
If they are at the "idea" stage, focus on validation and initial audience building.
If they are at "mvp", focus on acquiring early adopters.
If they are at "growth" or "scale", focus on scalable distribution channels.

INSTRUCTIONS:
1. Provide exactly 5 highly actionable marketing steps.
2. Do not give generic advice like "Start a blog". Be specific (e.g., "Launch a waitlist page targeting CTOs with this specific value prop").
3. Assign a priority (high, medium, low) to each step.
4. Output MUST be valid JSON in the following structure:
{{
    "steps": [
        {{
            "title": "Actionable title (max 6 words)",
            "description": "Detailed explanation of what to do and why (2-3 sentences)",
            "priority": "high"
        }}
    ]
}}
"""


async def generate_roadmap(project: ProjectInDB) -> dict:
    prompt = ROADMAP_PROMPT.format(
        stage=project.stage.value,
        niche=project.niche,
        name=project.name,
        target_audience=project.target_audience,
        description=project.description,
    )

    client = get_ai_client()
    try:
        return await client.generate_json(
            prompt=prompt,
            tier=ModelTier.GEMINI_FLASH,
        )
    except Exception as e:
        return {"steps": []}
