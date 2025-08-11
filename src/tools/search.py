# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

import json
import logging
import os

from langchain_community.tools import BraveSearch, DuckDuckGoSearchResults
from langchain_community.tools.arxiv import ArxivQueryRun
from langchain_community.utilities import ArxivAPIWrapper, BraveSearchWrapper

from src.config import SearchEngine, SELECTED_SEARCH_ENGINE
from src.tools.tavily_search.tavily_search_results_with_images import (
    TavilySearchResultsWithImages,
)
from src.tools.tavily_search.enhanced_tavily_wrapper import (
    LinkedInSearchTool,
    TwitterSearchTool, 
    GeneralOutreachSearchTool,
)

from src.tools.decorators import create_logged_tool

logger = logging.getLogger(__name__)

# Create logged versions of the search tools
LoggedTavilySearch = create_logged_tool(TavilySearchResultsWithImages)
LoggedDuckDuckGoSearch = create_logged_tool(DuckDuckGoSearchResults)
LoggedBraveSearch = create_logged_tool(BraveSearch)
LoggedArxivSearch = create_logged_tool(ArxivQueryRun)

# Enhanced outreach search tools
LoggedLinkedInSearch = create_logged_tool(LinkedInSearchTool)
LoggedTwitterSearch = create_logged_tool(TwitterSearchTool)
LoggedGeneralOutreachSearch = create_logged_tool(GeneralOutreachSearchTool)


# Get the selected search tool
def get_web_search_tool(max_search_results: int):
    """Get the primary web search tool based on configuration."""
    if SELECTED_SEARCH_ENGINE == SearchEngine.TAVILY.value:
        return LoggedGeneralOutreachSearch(
            name="web_search",
        )
    elif SELECTED_SEARCH_ENGINE == SearchEngine.DUCKDUCKGO.value:
        return LoggedDuckDuckGoSearch(
            name="web_search",
            num_results=max_search_results,
        )
    elif SELECTED_SEARCH_ENGINE == SearchEngine.BRAVE_SEARCH.value:
        return LoggedBraveSearch(
            name="web_search",
            search_wrapper=BraveSearchWrapper(
                api_key=os.getenv("BRAVE_SEARCH_API_KEY", ""),
                search_kwargs={"count": max_search_results},
            ),
        )
    elif SELECTED_SEARCH_ENGINE == SearchEngine.ARXIV.value:
        return LoggedArxivSearch(
            name="web_search",
            api_wrapper=ArxivAPIWrapper(
                top_k_results=max_search_results,
                load_max_docs=max_search_results,
                load_all_available_meta=True,
            ),
        )
    else:
        raise ValueError(f"Unsupported search engine: {SELECTED_SEARCH_ENGINE}")


def get_enhanced_outreach_search_tool():
    """Get the enhanced outreach-focused search tool."""
    return LoggedGeneralOutreachSearch()


def get_linkedin_search_tool():
    """Get LinkedIn-specific search tool for professional outreach research."""
    return LoggedLinkedInSearch()


def get_twitter_search_tool():
    """Get Twitter/X-specific search tool for social media outreach research."""
    return LoggedTwitterSearch()


def get_outreach_tools_suite():
    """Get a complete suite of outreach research tools."""
    return {
        "general_outreach": get_enhanced_outreach_search_tool(),
        "linkedin_search": get_linkedin_search_tool(),
        "twitter_search": get_twitter_search_tool(),
    }
