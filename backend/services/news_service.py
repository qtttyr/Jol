import feedparser
import httpx
from collections import Counter
from typing import List, Dict

async def search_tech_news_feeds(niche: str, limit: int = 10) -> List[Dict]:
    feeds = [
        "https://news.ycombinator.com/rss",
        "https://feeds.techcrunch.com/techcrunch/",
        "https://feeds.arstechnica.com/arstechnica/index",
    ]

    trends = []

    for feed_url in feeds:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(feed_url)
                response.raise_for_status()

            feed_data = feedparser.parse(response.content)

            for entry in feed_data.entries[:20]:
                title = entry.get("title", "").lower()
                summary = entry.get("summary", "").lower()

                if any(keyword in title + " " + summary for keyword in niche.lower().split()):
                    trends.append({
                        "title": entry.get("title", ""),
                        "summary": entry.get("summary", "")[:200],
                        "link": entry.get("link", ""),
                        "published": entry.get("published", ""),
                        "source": feed_url.split("/")[2],
                    })

        except Exception as e:
            print(f"Error parsing feed {feed_url}: {e}")
            continue

    unique_trends = {trend["link"]: trend for trend in trends}
    return list(unique_trends.values())[:limit]


async def extract_trending_keywords(articles: List[Dict]) -> List[str]:
    keywords = []
    stop_words = {"the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been"}

    for article in articles:
        title = article.get("title", "").lower().split()
        filtered = [w.strip(".,!?;:") for w in title if w.lower() not in stop_words and len(w) > 3]
        keywords.extend(filtered)

    counter = Counter(keywords)
    return [word for word, _ in counter.most_common(20)]
