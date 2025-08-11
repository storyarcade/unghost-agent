# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

import aiohttp
import os
import json
import re
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Union, Tuple

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# Load API key from conf.yaml or environment
def get_tavily_api_key():
    """Get Tavily API key from configuration or environment variables."""
    # Try to load from conf.yaml first
    try:
        from src.config import load_yaml_config
        config_path = str((Path(__file__).parent.parent.parent.parent / "conf.yaml").resolve())
        config = load_yaml_config(config_path)
        if "TOOLS" in config and "search" in config["TOOLS"] and "tavily_api_key" in config["TOOLS"]["search"]:
            return config["TOOLS"]["search"]["tavily_api_key"]
    except Exception as e:
        logger.warning(f"Could not load Tavily API key from conf.yaml: {e}")
    
    # Fallback to environment variable
    return os.getenv("TAVILY_API_KEY")

TAVILY_API_KEY = get_tavily_api_key() or ""

PLATFORM_EMOJIS = {
    "twitter.com": "🐦",
    "x.com": "🐦", 
    "linkedin.com": "💼",
    "instagram.com": "📸",
    "reddit.com": "👽",
    "github.com": "💻",
    "medium.com": "📝",
    "substack.com": "📰",
}

def escape_md(text):
    """Escape Markdown special characters in text."""
    if not text:
        return ""
    return re.sub(r'([*_`\[\]()~>#+\-=|{}.!])', r'\\\1', str(text))

def normalize_date(date_str):
    """Normalize date string to a consistent format."""
    if not date_str:
        return ""
    try:
        dt = datetime.fromisoformat(date_str)
        return dt.strftime("%Y-%m-%d %H:%M")
    except Exception:
        return date_str

def dedup_results(results):
    """Remove duplicate results based on URL and content."""
    seen_urls = set()
    seen_content = set()
    deduped = []
    for r in results:
        url = r.get("url")
        content = r.get("content", "").strip()
        if url in seen_urls or content in seen_content:
            continue
        seen_urls.add(url)
        seen_content.add(content)
        deduped.append(r)
    return deduped

async def search_tavily(query: str, max_results: int = 5, domain: str = None) -> str:
    """Enhanced Tavily search with social media metadata extraction."""
    if not TAVILY_API_KEY:
        return "Error: Tavily API key not found in conf.yaml or environment variables"
    
    url = "https://api.tavily.com/search"
    headers = {"Authorization": f"Bearer {TAVILY_API_KEY}"}
    params = {
        "query": query,
        "max_results": max_results,
        "include_raw_content": True,
        "include_images": True,
    }
    if domain:
        params["include_domains"] = [domain]
        
    logger.info(f"[TAVILY] Query: {query}, Params: {params}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=params) as resp:
                data = await resp.json()
                logger.info(f"[TAVILY] Raw response: {json.dumps(data, indent=2, ensure_ascii=False)}")
                
                results = data.get("results", [])
                results = dedup_results(results)
                
                md_blocks = []
                for r in results:
                    title = escape_md(r.get("title", ""))
                    url_ = r.get("url", "")
                    content = escape_md(r.get("content", ""))
                    image_url = r.get("image_url") or r.get("image")
                    username = escape_md(r.get("author") or r.get("username") or "")
                    timestamp = normalize_date(r.get("timestamp") or r.get("published_time") or "")
                    
                    # Extract platform from URL
                    platform = domain if domain else (url_.split("/")[2] if url_ else "")
                    platform = str(platform)
                    badge = PLATFORM_EMOJIS.get(platform, "🌐")
                    
                    # Truncate long content with read more link
                    if len(content) > 400:
                        content = content[:400] + f"... [Read more]({url_})"
                    
                    # Build metadata block
                    meta_top = []
                    if username:
                        meta_top.append(f"👤 **User:** {username}")
                    if timestamp:
                        meta_top.append(f"🕒 **Time:** {timestamp}")
                    meta_top_str = "  ".join(meta_top)
                    
                    image_block = f"\n![Preview]({image_url})\n" if image_url else ""
                    
                    # Format result as markdown
                    md = f"{badge} **[{title}]({url_})**\n"
                    if meta_top_str:
                        md += f"{meta_top_str}\n"
                    if image_block:
                        md += f"{image_block}"
                    md += f"\n{content}\n"
                    md += f"\n🔗 [Open in {platform}]({url_}) 🏷️ **Source:** {platform}"
                    
                    # Store raw metadata for potential future use
                    raw_meta = json.dumps(r, ensure_ascii=False)
                    md += f"\n<!-- RAW_METADATA: {raw_meta} -->\n"
                    
                    md_blocks.append(md)
                
                output = "\n\n".join(md_blocks) if md_blocks else "No results found."
                logger.info(f"[TAVILY] Markdown output: {output[:500]}")  # Truncate for log
                
                # Convert results to a JSON structure for the frontend
                json_results = []
                for r in results:
                    json_results.append({
                        "type": "page",
                        "title": r.get("title", ""),
                        "url": r.get("url", ""),
                        "content": r.get("content", ""),
                    })
                    if r.get("image_url") or r.get("image"):
                        json_results.append({
                            "type": "image",
                            "image_url": r.get("image_url") or r.get("image"),
                            "image_description": r.get("title", ""),
                        })
                
                return json.dumps(json_results, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error in Tavily search: {e}")
        return f"Error occurred during search: {str(e)}"

# Platform-specific search functions for cold outreach
async def search_linkedin(query: str, max_results: int = 5) -> str:
    """Search LinkedIn for professional outreach research."""
    return await search_tavily(query, max_results=max_results, domain="linkedin.com")

async def search_twitter(query: str, max_results: int = 5) -> str:
    """Search Twitter/X for social media outreach research."""
    return await search_tavily(query, max_results=max_results, domain="x.com")

async def search_instagram(query: str, max_results: int = 5) -> str:
    """Search Instagram for visual content outreach research."""
    return await search_tavily(query, max_results=max_results, domain="instagram.com")

async def search_reddit(query: str, max_results: int = 5) -> str:
    """Search Reddit for community engagement outreach research."""
    return await search_tavily(query, max_results=max_results, domain="reddit.com")

async def search_github(query: str, max_results: int = 5) -> str:
    """Search GitHub for technical outreach research."""
    return await search_tavily(query, max_results=max_results, domain="github.com")

async def search_medium(query: str, max_results: int = 5) -> str:
    """Search Medium for thought leadership outreach research."""
    return await search_tavily(query, max_results=max_results, domain="medium.com")


# LangChain tool implementations
class SocialMediaSearchInput(BaseModel):
    query: str = Field(description="Search query for social media content")
    max_results: int = Field(default=5, description="Maximum number of results to return")

class LinkedInSearchTool(BaseTool):
    name: str = "linkedin_search_tool"
    description: str = (
        "Search LinkedIn for professional profiles, company pages, and posts. "
        "Ideal for cold outreach research to understand professional background, "
        "career trajectory, recent activities, and company context."
    )
    args_schema: type[BaseModel] = SocialMediaSearchInput

    def _run(self, query: str, max_results: int = 5, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Synchronous search - not implemented for async-only tool."""
        return "This tool requires async execution. Please use the async version."

    async def _arun(
        self, 
        query: str, 
        max_results: int = 5, 
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Search LinkedIn for professional outreach research."""
        return await search_linkedin(query, max_results)

class TwitterSearchTool(BaseTool):
    name: str = "twitter_search_tool"
    description: str = (
        "Search Twitter/X for tweets, conversations, and social engagement. "
        "Perfect for understanding communication style, interests, opinions, "
        "and recent activity for personalized cold outreach."
    )
    args_schema: type[BaseModel] = SocialMediaSearchInput

    def _run(self, query: str, max_results: int = 5, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        return "This tool requires async execution. Please use the async version."

    async def _arun(
        self, 
        query: str, 
        max_results: int = 5, 
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Search Twitter/X for social media outreach research."""
        return await search_twitter(query, max_results)

class GeneralOutreachSearchTool(BaseTool):
    name: str = "outreach_search_tool" 
    description: str = (
        "Enhanced general search with outreach-specific formatting. "
        "Automatically extracts metadata like usernames, timestamps, and "
        "platform information to support personalized cold outreach research."
    )
    args_schema: type[BaseModel] = SocialMediaSearchInput

    def _run(self, query: str, max_results: int = 5, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        return "This tool requires async execution. Please use the async version."

    async def _arun(
        self, 
        query: str, 
        max_results: int = 5, 
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Enhanced general search for outreach research."""
        return await search_tavily(query, max_results) 