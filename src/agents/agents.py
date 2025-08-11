# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

from langgraph.prebuilt import create_react_agent

from src.prompts import apply_prompt_template
from src.llms.llm import get_llm_by_type
from src.config.agents import AGENT_LLM_MAP


# Create agents using configured LLM types
def create_agent(agent_name: str, agent_type: str, tools: list, prompt_template: str):
    """Factory function to create agents with consistent configuration."""
    # Get the base LLM and ensure it doesn't have response_format issues
    base_llm = get_llm_by_type(AGENT_LLM_MAP[agent_type])
    
    # Remove any response_format configurations that might cause issues with tool calling
    if hasattr(base_llm, 'bind'):
        # Ensure the model is properly configured for tool calling
        llm = base_llm.bind(response_format=None)
    else:
        llm = base_llm
    
    return create_react_agent(
        name=agent_name,
        model=llm,
        tools=tools,
        prompt=lambda state: apply_prompt_template(prompt_template, state),
    )
