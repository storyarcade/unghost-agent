# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

import json
from typing import Dict, Any

from mcp.server.fastmcp import FastMCP
from src.tools.search import LoggedTavilySearch
from src.llms.llm import get_llm_by_type

# Initialize the MCP server
mcp = FastMCP("Company Information Tool")


@mcp.tool("company_information_retriever")
def company_information_retriever(
    company_name: str
) -> Dict[str, Any]:
    """
    Retrieves structured data about a company by performing a live web search
    and using an AI to extract key business information.

    Args:
        company_name: Name of the company to research.

    Returns:
        A dictionary containing comprehensive company information.
    """
    print(f"INFO: Starting live company information retrieval for: {company_name}")
    search_results = _perform_company_search(company_name)
    if not search_results:
        print(f"WARNING: No information found for company: {company_name}.")
        return {"error": "No public information found for the company."}

    structured_data = _extract_company_data_with_ai(search_results, company_name)
    return structured_data


def _perform_company_search(company_name: str) -> list:
    """Performs a targeted search for official and news-related company information."""
    # Query designed to find official websites, news, and business data sites like Crunchbase.
    query = f'"{company_name}" official website OR news OR "about us" OR Crunchbase'
    print(f"INFO: Executing company search query: {query}")

    search_tool = LoggedTavilySearch(max_results=5)
    results = search_tool.invoke(query)
    
    return [result.get("content", "") for result in results if result.get("content")]


def _extract_company_data_with_ai(search_results: list, company_name: str) -> Dict[str, Any]:
    """Uses an AI model to analyze search results and extract structured company data."""
    print(f"INFO: Using AI to extract structured data for {company_name}.")
    
    context = {
        "company_name": company_name,
        "search_results": "\n---\n".join(search_results)
    }

    prompt_content = f"""
        Objective: Analyze the provided web search results for the company '{company_name}' and extract key business information into a structured JSON format.

        SEARCH RESULTS:
        ---
        {context['search_results']}
        ---

        Based *only* on the text above, extract the following fields. If a field is not mentioned, use null.
        - company_name
        - industry
        - mission_vision (A summary of their mission, vision, or "about us" statement)
        - key_products_services (A list of their main products or services)
        - recent_news (A list of recent news headlines or announcements)
        - competitors (A list of mentioned competitors)
        - company_url (The official website URL)

        Respond with ONLY the JSON object.
    """
    
    messages = [{"role": "user", "content": prompt_content}]
    llm = get_llm_by_type("basic")
    
    try:
        response = llm.invoke(messages)
        cleaned_json = response.content.replace("```json\n", "").replace("\n```", "")
        return json.loads(cleaned_json)
    except Exception as e:
        print(f"ERROR: Failed to extract company data with AI. Error: {e}")
        return {"error": "AI data extraction for company failed.", "details": str(e)}


def main():
    """Run the MCP server with the Company Information tool."""
    mcp.run()


if __name__ == "__main__":
    main()