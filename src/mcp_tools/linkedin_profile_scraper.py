# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

import json
from typing import Dict, Optional, Any

from mcp.server.fastmcp import FastMCP
from src.tools.search import LoggedTavilySearch
from src.llms.llm import get_llm_by_type
from src.prompts.template import apply_prompt_template

# Initialize the MCP server
mcp = FastMCP("LinkedIn Profile Scraper")


@mcp.tool("linkedin_profile_scraper")
def linkedin_profile_scraper(
    person_name: str,
    company_name: Optional[str] = None,
    job_title: Optional[str] = None
) -> Dict[str, Any]:
    """
    Retrieves comprehensive LinkedIn profile data for a specified person by performing
    a targeted live web search and using an AI to extract structured information.

    Args:
        person_name: Full name of the person to search for.
        company_name: Optional company name to narrow the search.
        job_title: Optional job title to narrow the search.

    Returns:
        A dictionary containing the person's LinkedIn profile information.
    """
    print(f"INFO: Starting live LinkedIn profile scrape for: {person_name}")
    search_results = _perform_targeted_search(person_name, company_name, job_title)
    if not search_results:
        print(f"WARNING: No search results found for {person_name}.")
        return {"error": "No information found."}

    structured_data = _extract_data_with_ai(search_results, person_name)
    return structured_data


def _perform_targeted_search(
    person_name: str,
    company_name: Optional[str],
    job_title: Optional[str]
) -> list:
    """Constructs a search query and uses Tavily to find relevant professional info."""
    query_parts = [f'"{person_name}"']
    if job_title:
        query_parts.append(f'"{job_title}"')
    if company_name:
        query_parts.append(company_name)
    query_parts.append("LinkedIn profile")
    
    query = " ".join(query_parts)
    print(f"INFO: Executing search query: {query}")

    # Use the existing Tavily search tool for the web search
    search_tool = LoggedTavilySearch(max_results=5)
    results = search_tool.invoke(query)
    
    # We only need the content from the search results for the AI to process
    return [result.get("content", "") for result in results if result.get("content")]


def _extract_data_with_ai(search_results: list, person_name: str) -> Dict[str, Any]:
    """Uses an AI model to read search results and extract structured data."""
    print("INFO: Using AI to extract structured data from search results.")
    
    # We create a new "scraper" prompt template that will guide the AI.
    # This prompt needs to be created. For now, we'll define it here.
    # In a real scenario, this would be in `src/prompts/scraper.md`
    
    context = {
        "person_name": person_name,
        "search_results": "\n---\n".join(search_results)
    }

    # This is a simplified version of what would be in a prompt file.
    prompt_content = f"""
        Objective: Analyze the provided web search results for '{person_name}' and extract their professional profile information into a structured JSON format. Focus on details relevant to their LinkedIn profile.

        SEARCH RESULTS:
        ---
        {context['search_results']}
        ---

        Based *only* on the text above, extract the following fields. If a field is not mentioned, use null.
        - full_name
        - current_role
        - company
        - location
        - about (a brief summary)
        - experience (list of jobs with title, company, duration)
        - education (list of schools with degree, field)
        - skills (list of professional skills)
        - recent_activity (any mentioned posts, articles, or comments)
        - profile_url (the direct URL to their LinkedIn profile)

        Respond with ONLY the JSON object.
    """
    
    messages = [{"role": "user", "content": prompt_content}]

    # Use the 'basic' LLM for this extraction task
    llm = get_llm_by_type("basic")
    
    try:
        response = llm.invoke(messages)
        # The response from the LLM should be a JSON string.
        # We need to parse it to return a dictionary.
        # Adding cleanup to remove markdown code block fences.
        cleaned_json = response.content.replace("```json\n", "").replace("\n```", "")
        return json.loads(cleaned_json)
    except Exception as e:
        print(f"ERROR: Failed to extract data with AI. Error: {e}")
        return {"error": "AI data extraction failed.", "details": str(e)}


def main():
    """Run the MCP server with the LinkedIn Profile Scraper tool."""
    mcp.run()


if __name__ == "__main__":
    main()