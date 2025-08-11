# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

import json
from typing import Dict, Any, Optional

from mcp.server.fastmcp import FastMCP
from src.tools.search import LoggedTavilySearch
from src.llms.llm import get_llm_by_type

# Initialize the MCP server
mcp = FastMCP("Social Media Activity Tool")


@mcp.tool("social_media_activity_analyzer")
def social_media_activity_analyzer(
    person_name: str,
    company_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyzes recent public social media activity by performing a live web search
    and using an AI to infer interests and communication style.

    Args:
        person_name: Full name of the person to analyze.
        company_name: Optional company name to help focus the search.

    Returns:
        A dictionary containing an analysis of social media activity.
    """
    print(f"INFO: Starting live social media analysis for: {person_name}")
    search_results = _perform_social_media_search(person_name, company_name)
    if not search_results:
        print(f"WARNING: No social media activity found for {person_name}.")
        return {"error": "No public social media activity found."}

    analysis = _analyze_activity_with_ai(search_results, person_name)
    return analysis


def _perform_social_media_search(person_name: str, company_name: Optional[str]) -> list:
    """Performs a targeted search for public social media profiles and activity."""
    # This query is designed to find public profiles and discussions.
    query_parts = [f'"{person_name}"']
    if company_name:
        query_parts.append(company_name)
    # Broad terms to catch different platforms
    query_parts.append("(Twitter OR X.com OR personal blog OR Medium OR Substack)")
    
    query = " ".join(query_parts)
    print(f"INFO: Executing social media search query: {query}")

    search_tool = LoggedTavilySearch(max_results=7) # More results to get a broader picture
    results = search_tool.invoke(query)
    
    return [result.get("content", "") for result in results if result.get("content")]


def _analyze_activity_with_ai(search_results: list, person_name: str) -> Dict[str, Any]:
    """Uses an AI model to analyze search results for personality and style."""
    print("INFO: Using AI to analyze social media activity from search results.")
    
    context = {
        "person_name": person_name,
        "search_results": "\n---\n".join(search_results)
    }

    # This prompt asks the AI to act as an analyst.
    prompt_content = f"""
        Objective: Analyze the provided web search results, which contain public social media activity for '{person_name}'. Infer their communication style, key interests, and engagement patterns.

        SEARCH RESULTS (snippets from blogs, Twitter/X, etc.):
        ---
        {context['search_results']}
        ---

        Based *only* on the text provided above, perform the following analysis and respond in a structured JSON format:

        1.  **communication_style**: Describe their tone and style. (e.g., "Formal and data-driven", "Casual and humorous", "Inspirational and uses storytelling").
        2.  **frequent_topics**: List the top 3-5 topics they most frequently discuss or engage with.
        3.  **engagement_patterns**: Briefly describe how they seem to interact online. (e.g., "Asks questions to the audience", "Posts long-form thought leadership articles", "Mainly shares links from other experts").
        4.  **potential_ice_breakers**: Suggest 1-2 specific conversation starters based on their recent activity. (e.g., "I saw your post about AI ethics and was wondering...", "Your article on scaling product teams was insightful, especially...").

        Respond with ONLY the JSON object.
    """
    
    messages = [{"role": "user", "content": prompt_content}]
    llm = get_llm_by_type("basic")
    
    try:
        response = llm.invoke(messages)
        cleaned_json = response.content.replace("```json\n", "").replace("\n```", "")
        return json.loads(cleaned_json)
    except Exception as e:
        print(f"ERROR: Failed to analyze social media activity with AI. Error: {e}")
        return {"error": "AI analysis of social media failed.", "details": str(e)}


def main():
    """Run the MCP server with the Social Media Activity tool."""
    mcp.run()


if __name__ == "__main__":
    main()