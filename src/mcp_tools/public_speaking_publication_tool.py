# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

import json
from typing import Dict, Any, Optional

from mcp.server.fastmcp import FastMCP
from src.tools.search import LoggedTavilySearch
from src.llms.llm import get_llm_by_type

# Initialize the MCP server
mcp = FastMCP("Public Speaking Publication Tool")


@mcp.tool("public_speaking_publication_tracker")
def public_speaking_publication_tracker(
    person_name: str,
    company_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Finds public speaking engagements, publications, and podcast appearances for an individual
    by performing a live web search and using an AI to extract the information.

    Args:
        person_name: Full name of the person to research.
        company_name: Optional company name to refine the search.

    Returns:
        A dictionary containing lists of their public thought leadership activities.
    """
    print(f"INFO: Starting live thought leadership search for: {person_name}")
    search_results = _perform_thought_leadership_search(person_name, company_name)
    if not search_results:
        print(f"WARNING: No public activities found for {person_name}.")
        return {"error": "No public speaking or publication activities found."}

    structured_data = _extract_activities_with_ai(search_results, person_name)
    return structured_data


def _perform_thought_leadership_search(person_name: str, company_name: Optional[str]) -> list:
    """Performs a targeted search for articles, talks, and podcasts by the person."""
    query_parts = [f'"{person_name}"']
    if company_name:
        query_parts.append(company_name)
    # Search terms designed to find content they have created or appeared in.
    query_parts.append("(author OR speaker OR interview OR podcast OR publication OR talk)")
    
    query = " ".join(query_parts)
    print(f"INFO: Executing thought leadership search query: {query}")

    search_tool = LoggedTavilySearch(max_results=7)
    results = search_tool.invoke(query)
    
    return [result.get("content", "") for result in results if result.get("content")]


def _extract_activities_with_ai(search_results: list, person_name: str) -> Dict[str, Any]:
    """Uses an AI model to analyze search results and extract public activities."""
    print(f"INFO: Using AI to extract public activities for {person_name}.")
    
    context = {
        "person_name": person_name,
        "search_results": "\n---\n".join(search_results)
    }

    prompt_content = f"""
        Objective: Analyze the provided web search results for '{person_name}' and extract their public thought leadership activities into a structured JSON format.

        SEARCH RESULTS:
        ---
        {context['search_results']}
        ---

        Based *only* on the text above, extract the following fields. If a category has no items, provide an empty list.
        - speaking_engagements: (List of talks or panels, including event and title if mentioned)
        - publications: (List of articles, blog posts, or whitepapers, including title and publication name if mentioned)
        - podcast_appearances: (List of podcast episodes they were featured on, including podcast name and episode title if mentioned)

        Respond with ONLY the JSON object.
    """
    
    messages = [{"role": "user", "content": prompt_content}]
    llm = get_llm_by_type("basic")
    
    try:
        response = llm.invoke(messages)
        cleaned_json = response.content.replace("```json\n", "").replace("\n```", "")
        return json.loads(cleaned_json)
    except Exception as e:
        print(f"ERROR: Failed to extract public activities with AI. Error: {e}")
        return {"error": "AI data extraction for public activities failed.", "details": str(e)}


def main():
    """Run the MCP server with the Public Speaking Publication tool."""
    mcp.run()


if __name__ == "__main__":
    main()