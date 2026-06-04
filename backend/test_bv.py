import asyncio
import os
import sys

# Add backend directory to sys.path so we can import from core
sys.path.append('c:/Jol/backend')

from agents.brand_voice_agent import analyze_brand_voice

async def main():
    print("Testing brand voice analysis...")
    res = await analyze_brand_voice(["This is a test example written in a very enthusiastic way!"])
    print(f"Result: {repr(res)}")

if __name__ == "__main__":
    asyncio.run(main())
