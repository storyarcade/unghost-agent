# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

from langgraph.graph import MessagesState

from src.prompts.planner_model import Plan
from src.rag import Resource


class State(MessagesState):
    """State for the agent system, extends MessagesState with next field."""

    # Runtime Variables
    locale: str = "en-US"
    research_topic: str = ""
    observations: list[str] = []
    resources: list[Resource] = []
    plan_iterations: int = 0
    current_plan: Plan | str = None
    final_report: str = ""
    auto_accepted_plan: bool = False
    enable_background_investigation: bool = True
    background_investigation_results: str = None
    user_background: str = None  # User's professional background for personalized outreach
    
    # Template System Variables
    selected_template_id: str = None  # The ID of the selected outreach template (e.g., 'T01', 'T02')
    selected_template: dict = None  # The full template object with all details
    templates_summary: str = None  # Summary of all available templates for planner
