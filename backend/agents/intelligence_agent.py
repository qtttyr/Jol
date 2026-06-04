import asyncio
from datetime import datetime
from services.ai_client import ModelTier, get_ai_client
from services.news_service import search_tech_news_feeds, extract_trending_keywords
from prompts.intelligence_prompts import WEEKLY_INTELLIGENCE_PROMPT


def _build_articles_context(articles: list) -> str:
    lines = []
    for a in articles[:8]:
        title = a.get("title", "")
        summary = a.get("summary", "")[:300]
        source = a.get("source", "")
        lines.append(f"- {title} ({source}): {summary}")
    return "\n\n".join(lines) if lines else "No recent articles found for this niche."


async def generate_weekly_intelligence(niche: str, week: int = None) -> dict:
    if week is None:
        week = datetime.now().isocalendar()[1]

    articles = await search_tech_news_feeds(niche, limit=10)
    keywords = await extract_trending_keywords(articles)

    context = _build_articles_context(articles)

    if keywords:
        context += f"\n\nTrending keywords: {', '.join(keywords[:10])}"

    prompt = WEEKLY_INTELLIGENCE_PROMPT.format(
        niche=niche,
        context=context,
    )

    client = get_ai_client()
    try:
        result = await client.generate_json(
            prompt=prompt,
            tier=ModelTier.GEMINI_FLASH,
            estimated_tokens=2000,
        )

        result["niche"] = niche
        result["week"] = week
        result["created_at"] = datetime.now().isoformat()

        return result
    except Exception as e:
        return {
            "niche": niche,
            "week": week,
            "trends": [],
            "insights": f"Failed to generate intelligence: {e}",
            "competitive_moves": [],
            "actionable_advice": "",
            "sentiment": "cautious",
            "data_summary": {},
            "created_at": datetime.now().isoformat(),
        }
