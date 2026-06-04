WEEKLY_INTELLIGENCE_PROMPT = """
You are a market analyst generating a weekly intelligence report for startups in the "{niche}" space.

Recent articles and data:
{context}

Generate a comprehensive weekly intelligence digest with the following sections:

1. TRENDS: Identify the top 3 trends. For each provide:
   - title: Trend name
   - growth_percentage: Estimated growth (float, 0-100)
   - forecast: Short-term outlook (1-2 sentences)
   - keywords: 3-5 related keywords
   - sources: URLs or publication names

2. INSIGHTS: 2-3 deep market insights (each 2-3 sentences)

3. COMPETITIVE_MOVES: Identify 1-2 companies making moves, with:
   - company: Company name
   - move: What they did
   - date: ISO date string
   - relevance: 0.0-1.0 score

4. ACTIONABLE_ADVICE: Specific actions for THIS WEEK (3-4 sentences)

5. SENTIMENT: One of "positive", "cautious", or "negative"

6. DATA_SUMMARY: A dict with keys:
   - search_volume_growth: e.g. "+25%"
   - news_velocity: summarized article count
   - market_signals: key observations

Output MUST be valid JSON matching this structure:
{{
    "trends": [{{ "title": "", "growth_percentage": 0.0, "forecast": "", "keywords": [], "sources": [] }}],
    "insights": "",
    "competitive_moves": [{{ "company": "", "move": "", "date": "", "relevance": 0.0 }}],
    "actionable_advice": "",
    "sentiment": "",
    "data_summary": {{ "search_volume_growth": "", "news_velocity": "", "market_signals": "" }}
}}
"""
