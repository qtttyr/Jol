import feedparser
import httpx
from datetime import datetime, timedelta
from typing import List, Dict
from models.project import ProjectInDB

async def search_tech_news_feeds(niche: str, limit: int = 10) -> List[Dict]:
    """
    Parses RSS feeds from tech news sources (HackerNews, TechCrunch, etc.)
    to find trending topics relevant to the niche.
    Returns a list of trending articles without AI processing.
    """
    feeds = [
        "https://news.ycombinator.com/rss",
        "https://feeds.techcrunch.com/techcrunch/",
        "https://feeds.arstechnica.com/arstechnica/index",
    ]
    
    trends = []
    
    for feed_url in feeds:
        try:
            # Fetch and parse RSS feed
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(feed_url)
                response.raise_for_status()
            
            feed_data = feedparser.parse(response.content)
            
            # Extract relevant entries
            for entry in feed_data.entries[:20]:  # Get top 20 entries per feed
                title = entry.get("title", "").lower()
                summary = entry.get("summary", "").lower()
                
                # Simple keyword matching for relevance
                if any(keyword in title + " " + summary for keyword in niche.lower().split()):
                    trends.append({
                        "title": entry.get("title", ""),
                        "summary": entry.get("summary", "")[:200],  # First 200 chars
                        "link": entry.get("link", ""),
                        "published": entry.get("published", ""),
                        "source": feed_url.split("/")[2],  # Extract domain
                    })
        
        except Exception as e:
            print(f"Error parsing feed {feed_url}: {e}")
            continue
    
    # Return unique trends, limited by limit parameter
    unique_trends = {trend["link"]: trend for trend in trends}
    return list(unique_trends.values())[:limit]


async def search_reddit_threads(niche: str) -> list:
    """
    Searches for Reddit threads matching the niche.
    Returns trending threads without generating AI responses.
    Uses public Reddit data (no API key required initially).
    """
    # Placeholder structure for now - will integrate actual tech news instead
    return []


async def extract_trending_keywords(articles: List[Dict]) -> List[str]:
    """
    Extracts frequently mentioned keywords from articles.
    Simple keyword frequency analysis without AI.
    """
    from collections import Counter
    
    keywords = []
    stop_words = {"the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been"}
    
    for article in articles:
        title = article.get("title", "").lower().split()
        # Filter out stop words and short words
        filtered = [w.strip(".,!?;:") for w in title if w.lower() not in stop_words and len(w) > 3]
        keywords.extend(filtered)
    
    # Get top 20 most frequent keywords
    counter = Counter(keywords)
    return [word for word, _ in counter.most_common(20)]
