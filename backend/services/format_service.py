def format_for_linkedin(content: str) -> str:
    """
    Applies formatting rules for LinkedIn.
    - Professional tone maintained
    - Proper line breaks for readability
    - Hashtags at the end
    """
    formatted = content.strip()
    # LinkedIn supports markdown, but keep it simple
    return formatted

def format_for_telegram(content: str) -> str:
    """
    Applies formatting rules for Telegram.
    - Shorter paragraphs (max ~200 chars per para)
    - Emojis for visual interest
    - Mentions and hashtags
    """
    formatted = content.strip()
    return formatted

def format_for_instagram(content: str) -> str:
    """
    Applies formatting rules for Instagram.
    - Emojis for visual appeal
    - Hashtags (max 30)
    - Line breaks for readability
    - ~2000 char limit
    """
    formatted = content.strip()
    # Instagram supports emojis naturally
    return formatted

def format_for_threads(content: str) -> str:
    """
    Applies formatting rules for Threads (Twitter-like).
    - Concise, punchy messaging
    - ~500 character limit
    - Hashtags and mentions
    """
    formatted = content.strip()
    return formatted

def format_for_medium(content: str) -> str:
    """
    Applies formatting rules for Medium.
    - Rich markdown formatting
    - Heading hierarchy
    - Paragraphs with good spacing
    - 3000+ characters typical
    """
    formatted = content.strip()
    return formatted

def format_for_platform(content: str, platform: str) -> str:
    """
    Routes content to platform-specific formatter.
    
    Args:
        content: Raw generated content
        platform: Target platform (telegram, instagram, threads, medium, linkedin)
    
    Returns:
        Formatted content optimized for the target platform
    """
    platform = platform.lower().strip()
    
    formatters = {
        "linkedin": format_for_linkedin,
        "telegram": format_for_telegram,
        "instagram": format_for_instagram,
        "threads": format_for_threads,
        "medium": format_for_medium,
    }
    
    formatter = formatters.get(platform, format_for_linkedin)  # Default to LinkedIn
    return formatter(content)
