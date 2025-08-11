# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

import json
import logging
import os
from typing import Annotated, Literal

from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from langgraph.types import Command, interrupt
from langchain_mcp_adapters.client import MultiServerMCPClient

from src.agents import create_agent
from src.tools import (
    crawl_tool,
    get_web_search_tool,
    get_retriever_tool,
    python_repl_tool,
)

from src.config.agents import AGENT_LLM_MAP
from src.config.configuration import Configuration
from src.llms.llm import get_llm_by_type
from src.prompts.planner_model import Plan, StepType
from src.prompts.template import apply_prompt_template
from src.utils.json_utils import repair_json_output
from src.utils.template_loader import TemplateLoader

from .types import State

logger = logging.getLogger(__name__)


@tool
def handoff_to_planner(
    research_topic: Annotated[str, "The topic of the research task to be handed off."],
    locale: Annotated[str, "The user's detected language locale (e.g., en-US, zh-CN)."],
):
    """Handoff to planner agent to do plan."""
    # This tool is not returning anything: we're just using it
    # as a way for LLM to signal that it needs to hand off to planner agent
    return


def background_investigation_node(state: State, config: RunnableConfig):
    logger.info("background investigation node is running.")
    configurable = Configuration.from_runnable_config(config)
    query = state.get("research_topic")
    
    # Get the web search tool
    search_tool = get_web_search_tool(configurable.max_search_results)
    
    try:
        # Invoke the search tool properly
        searched_content = search_tool.invoke({"query": query})
        
        # Handle the response - it could be a list or a string depending on the tool
        if isinstance(searched_content, list):
            # Handle both page and image results from our enhanced search
            background_investigation_results = []
            for elem in searched_content:
                if elem.get('type') == 'page':
                    background_investigation_results.append(
                        f"## {elem['title']}\n\n{elem['content']}"
                    )
                elif elem.get('type') == 'image':
                    background_investigation_results.append(
                        f"![{elem['image_description']}]({elem['image_url']})"
                    )
                # Fallback for legacy format without 'type' field
                elif 'title' in elem and 'content' in elem:
                    background_investigation_results.append(
                        f"## {elem['title']}\n\n{elem['content']}"
                    )
            
            return {
                "background_investigation_results": "\n\n".join(
                    background_investigation_results
                )
            }
        elif isinstance(searched_content, str):
            # Handle string responses (e.g., from other search engines)
            return {
                "background_investigation_results": searched_content
            }
        else:
            logger.error(
                f"Search tool returned unexpected response type: {type(searched_content)}, content: {searched_content}"
            )
            return {
                "background_investigation_results": json.dumps(
                    searched_content, ensure_ascii=False
                )
            }
    except Exception as e:
        logger.error(f"Error in background investigation: {e}")
        return {
            "background_investigation_results": f"Error occurred during background investigation: {str(e)}"
        }


def planner_node(
    state: State, config: RunnableConfig
) -> Command[Literal["human_feedback", "reporter"]]:
    """Planner node that generate the full plan."""
    logger.info("Planner generating full plan")
    configurable = Configuration.from_runnable_config(config)
    plan_iterations = state["plan_iterations"] if state.get("plan_iterations", 0) else 0
    
    # Load outreach templates for the planner
    template_loader = TemplateLoader()
    templates_summary = template_loader.get_templates_summary()
    
    # Create state with user_background and templates for template
    planner_state = {
        **state, 
        "user_background": state.get("user_background"),
        "templates_summary": templates_summary,
        "selected_template_id": configurable.selected_template_id  # Pass frontend template selection
    }
    messages = apply_prompt_template("planner", planner_state, configurable)

    if state.get("enable_background_investigation") and state.get(
        "background_investigation_results"
    ):
        messages += [
            {
                "role": "user",
                "content": (
                    "background investigation results of user query:\n"
                    + state["background_investigation_results"]
                    + "\n"
                ),
            }
        ]

    if configurable.enable_deep_thinking:
        llm = get_llm_by_type("reasoning")
    elif AGENT_LLM_MAP["planner"] == "basic":
        llm = get_llm_by_type("basic").with_structured_output(
            Plan,
            method="json_mode",
        )
    else:
        llm = get_llm_by_type(AGENT_LLM_MAP["planner"])

    # if the plan iterations is greater than the max plan iterations, return the reporter node
    if plan_iterations >= configurable.max_plan_iterations:
        return Command(goto="reporter")

    full_response = ""
    structured_output_used = False
    
    if AGENT_LLM_MAP["planner"] == "basic" and not configurable.enable_deep_thinking:
        try:
            logger.debug("Invoking structured output LLM for planner")
            response = llm.invoke(messages)
            
            # Handle different response types
            if hasattr(response, 'model_dump_json'):
                full_response = response.model_dump_json(indent=4, exclude_none=True)
                structured_output_used = True
            elif isinstance(response, dict):
                full_response = json.dumps(response, indent=4)
                structured_output_used = True
            else:
                # Fallback for unexpected response types
                content = getattr(response, 'content', str(response))
                full_response = content if isinstance(content, str) else str(content)
                
            # Check for empty response
            if not full_response or not full_response.strip():
                logger.error("LLM returned empty response")
                return Command(goto="__end__")
                
        except Exception as e:
            logger.error(f"Error invoking planner LLM: {e}")
            return Command(goto="__end__")
    else:
        try:
            response = llm.stream(messages)
            for chunk in response:
                if hasattr(chunk, 'content'):
                    full_response += chunk.content
                else:
                    full_response += str(chunk)
                    
            # Check for empty response
            if not full_response or not full_response.strip():
                logger.error("LLM returned empty streamed response")
                return Command(goto="__end__")
                
        except Exception as e:
            logger.error(f"Error streaming planner response: {e}")
            return Command(goto="__end__")
    
    logger.debug(f"Current state messages: {state['messages']}")
    logger.info(f"Planner response: {full_response}")

    try:
        # For structured output, the response is already valid JSON
        if structured_output_used:
            curr_plan = json.loads(full_response)
        else:
            # Try to repair JSON if needed
            repaired_json = repair_json_output(full_response)
            if not repaired_json or not repaired_json.strip():
                logger.error(f"Failed to repair JSON from response: {full_response[:200]}")
                return Command(goto="__end__")
            curr_plan = json.loads(repaired_json)
            
        # Validate required fields
        required_fields = ["locale", "has_enough_context", "thought", "title", "steps"]
        missing_fields = [field for field in required_fields if field not in curr_plan]
        if missing_fields:
            logger.error(f"Missing required fields in plan: {missing_fields}")
            if plan_iterations > 0:
                return Command(goto="reporter")
            else:
                return Command(goto="__end__")
                
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        logger.error(f"Error parsing planner response: {e}")
        if plan_iterations > 0:
            return Command(goto="reporter")
        else:
            return Command(goto="__end__")
    
    if curr_plan.get("has_enough_context"):
        logger.info("Planner response has enough context.")
        new_plan = Plan.model_validate(curr_plan)
        
        # Extract template information from plan or use user-selected template
        template_update = {}
        template_id = curr_plan.get("selected_template_id") or configurable.selected_template_id
        
        if template_id:
            template_update["selected_template_id"] = template_id
            # Load the full template details
            selected_template = template_loader.get_template_by_id(template_id)
            if selected_template:
                template_update["selected_template"] = selected_template
                logger.info(f"Selected template: {template_id} - {selected_template.get('use_case', 'Unknown')}")
        
        # Send the cleaned JSON to frontend, not the raw response
        clean_response = json.dumps(curr_plan, indent=2, ensure_ascii=False)
        return Command(
            update={
                "messages": [AIMessage(content=clean_response, name="planner")],
                "current_plan": new_plan,
                **template_update
            },
            goto="reporter",
        )
    
    # Send the cleaned JSON to frontend for human feedback
    clean_response = json.dumps(curr_plan, indent=2, ensure_ascii=False)
    return Command(
        update={
            "messages": [AIMessage(content=clean_response, name="planner")],
            "current_plan": curr_plan,
        },
        goto="human_feedback",
    )


def human_feedback_node(
    state,
) -> Command[Literal["planner", "research_team", "reporter", "__end__"]]:
    current_plan = state.get("current_plan", "")
    # check if the plan is auto accepted
    auto_accepted_plan = state.get("auto_accepted_plan", False)
    if not auto_accepted_plan:
        feedback = interrupt("Please Review the Plan.")

        # if the feedback is not accepted, return the planner node
        if feedback and str(feedback).upper().startswith("[EDIT_PLAN]"):
            return Command(
                update={
                    "messages": [
                        HumanMessage(content=feedback, name="feedback"),
                    ],
                },
                goto="planner",
            )
        elif feedback and str(feedback).upper().startswith("[ACCEPTED]"):
            logger.info("Plan is accepted by user.")
        else:
            raise TypeError(f"Interrupt value of {feedback} is not supported.")

    # if the plan is accepted, run the following node
    plan_iterations = state["plan_iterations"] if state.get("plan_iterations", 0) else 0
    goto = "research_team"
    try:
        # Handle both string and dict types for current_plan
        if isinstance(current_plan, dict):
            new_plan = current_plan
        else:
            current_plan = repair_json_output(current_plan)
            new_plan = json.loads(current_plan)
        
        # increment the plan iterations
        plan_iterations += 1
        
        if new_plan["has_enough_context"]:
            goto = "reporter"
    except (json.JSONDecodeError, TypeError) as e:
        logger.warning(f"Planner response is not a valid JSON: {e}")
        if plan_iterations > 1:  # the plan_iterations is increased before this check
            return Command(goto="reporter")
        else:
            return Command(goto="__end__")

    # Extract template information from plan
    template_update = {}
    if new_plan.get("selected_template_id"):
        template_update["selected_template_id"] = new_plan["selected_template_id"]
        # Load the full template details
        template_loader = TemplateLoader()
        selected_template = template_loader.get_template_by_id(new_plan["selected_template_id"])
        if selected_template:
            template_update["selected_template"] = selected_template
            logger.info(f"Selected template: {new_plan['selected_template_id']} - {selected_template.get('use_case', 'Unknown')}")

    return Command(
        update={
            "current_plan": Plan.model_validate(new_plan),
            "plan_iterations": plan_iterations,
            "locale": new_plan["locale"],
            "user_background": state.get("user_background"),  # Preserve user_background
            **template_update
        },
        goto=goto,
    )


def coordinator_node(
    state: State, config: RunnableConfig
) -> Command[Literal["planner", "background_investigator", "__end__"]]:
    """Coordinator node that communicate with customers."""
    logger.info("Coordinator talking.")
    configurable = Configuration.from_runnable_config(config)
    messages = apply_prompt_template("coordinator", state, configurable)
    response = (
        get_llm_by_type(AGENT_LLM_MAP["coordinator"])
        .bind_tools([handoff_to_planner])
        .invoke(messages)
    )
    logger.debug(f"Current state messages: {state['messages']}")

    goto = "__end__"
    locale = state.get("locale", "en-US")  # Default locale if not specified
    research_topic = state.get("research_topic", "")
    user_background = configurable.user_background if configurable.user_background else None

    if len(response.tool_calls) > 0:
        goto = "planner"
        if state.get("enable_background_investigation"):
            # if the search_before_planning is True, add the web search tool to the planner agent
            goto = "background_investigator"
        try:
            for tool_call in response.tool_calls:
                if tool_call.get("name", "") != "handoff_to_planner":
                    continue
                if tool_call.get("args", {}).get("locale") and tool_call.get(
                    "args", {}
                ).get("research_topic"):
                    locale = tool_call.get("args", {}).get("locale")
                    research_topic = tool_call.get("args", {}).get("research_topic")
                    break
        except Exception as e:
            logger.error(f"Error processing tool calls: {e}")
    else:
        logger.warning(
            "Coordinator response contains no tool calls. Terminating workflow execution."
        )
        logger.debug(f"Coordinator response: {response}")

    return Command(
        update={
            "locale": locale,
            "research_topic": research_topic,
            "resources": configurable.resources,
            "user_background": user_background,
        },
        goto=goto,
    )


def reporter_node(state: State, config: RunnableConfig):
    """Reporter node that write a final report."""
    logger.info("Reporter write final report")
    configurable = Configuration.from_runnable_config(config)
    current_plan = state.get("current_plan")
    input_ = {
        "messages": [
            HumanMessage(
                f"# Research Requirements\n\n## Task\n\n{current_plan.title}\n\n## Description\n\n{current_plan.thought}"
            )
        ],
        "locale": state.get("locale", "en-US"),
        "user_background": state.get("user_background"),
    }
    invoke_messages = apply_prompt_template("reporter", input_, configurable)
    observations = state.get("observations", [])

    # Add a reminder about the new report format, citation style, and table usage
    invoke_messages.append(
        HumanMessage(
            content="IMPORTANT: Structure your report according to the format in the prompt. Remember to include:\n\n1. Outreach Summary - A bulleted list of the most important findings\n2. Recipient Profile - A brief overview of the target recipient\n3. Outreach Strategy - The recommended approach, tone, and value proposition\n4. Outreach Message - The complete outreach message in a formatted box\n5. Next Steps - Recommended follow-up actions\n6. Sources - List all references at the end\n\nFor sources, DO NOT include inline citations in the text. Instead, place all sources in the 'Sources' section at the end using the format: `- [Source Title](URL)`. Include an empty line between each source for better readability.",
            name="system",
        )
    )

    for observation in observations:
        invoke_messages.append(
            HumanMessage(
                content=f"Below are some observations for the research task:\n\n{observation}",
                name="observation",
            )
        )
    logger.debug(f"Current invoke messages: {invoke_messages}")
    response = get_llm_by_type(AGENT_LLM_MAP["reporter"]).invoke(invoke_messages)
    response_content = response.content
    logger.info(f"reporter response: {response_content}")

    return {"final_report": response_content}


def research_team_node(state: State):
    """Research team node that collaborates on tasks."""
    logger.info("Research team is collaborating on tasks.")
    pass


async def _execute_agent_step(
    state: State, agent, agent_name: str, configurable: Configuration
) -> Command[Literal["research_team"]]:
    """Helper function to execute a step using the specified agent."""
    current_plan = state.get("current_plan")
    observations = state.get("observations", [])

    # Find the first unexecuted step
    current_step = None
    completed_steps = []
    for step in current_plan.steps:
        if not step.execution_res:
            current_step = step
            break
        else:
            completed_steps.append(step)

    if not current_step:
        logger.warning("No unexecuted step found")
        return Command(goto="research_team")

    logger.info(f"Executing step: {current_step.title}, agent: {agent_name}")

    # Format completed steps information
    completed_steps_info = ""
    if completed_steps:
        completed_steps_info = "# Existing Research Findings\n\n"
        for i, step in enumerate(completed_steps):
            completed_steps_info += f"## Existing Finding {i + 1}: {step.title}\n\n"
            completed_steps_info += f"<finding>\n{step.execution_res}\n</finding>\n\n"

    # Prepare the input for the agent with completed steps info
    agent_input = {
        "messages": [
            HumanMessage(
                content=f"{completed_steps_info}# Current Task\n\n## Title\n\n{current_step.title}\n\n## Description\n\n{current_step.description}\n\n## Locale\n\n{state.get('locale', 'en-US')}"
            )
        ],
        "report_style": configurable.report_style,
        "user_background": state.get("user_background"),
        # Pass template information through state for Jinja2 templates
        "selected_template_id": state.get("selected_template_id"),
        "selected_template": state.get("selected_template"),
    }
    
    # Add template information for strategizer agent
    if agent_name == "strategizer" and current_plan.selected_template_id:
        template_loader = TemplateLoader()
        selected_template = template_loader.get_template_by_id(current_plan.selected_template_id)
        if selected_template:
            agent_input["messages"].append(
                HumanMessage(
                    content=f"\n\n# Selected Outreach Template\n\n"
                    f"Template ID: {selected_template['template_id']}\n"
                    f"Tone: {selected_template['tone']}\n"
                    f"Use Case: {selected_template['use_case']}\n"
                    f"Hook Type: {selected_template['hook_type']}\n"
                    f"CTA Type: {selected_template['cta_type']}\n"
                    f"Template: {selected_template['prompt_template']}\n\n"
                    f"IMPORTANT: Use this template as the foundation for crafting the outreach message. "
                    f"Replace the placeholders with specific information from the research findings."
                )
            )

    # Add citation reminder for researcher agent
    if agent_name == "researcher":
        if state.get("resources"):
            resources_info = "**The user mentioned the following resource files:**\n\n"
            for resource in state.get("resources"):
                resources_info += f"- {resource.title} ({resource.description})\n"

            agent_input["messages"].append(
                HumanMessage(
                    content=resources_info
                    + "\n\n"
                    + "You MUST use the **local_search_tool** to retrieve the information from the resource files.",
                )
            )

        agent_input["messages"].append(
            HumanMessage(
                content="IMPORTANT: DO NOT include inline citations in the text. Instead, track all sources and include a References section at the end using link reference format. Include an empty line between each citation for better readability. Use this format for each reference:\n- [Source Title](URL)\n\n- [Another Source](URL)",
                name="system",
            )
        )

    # Invoke the agent
    default_recursion_limit = 25
    try:
        env_value_str = os.getenv("AGENT_RECURSION_LIMIT", str(default_recursion_limit))
        parsed_limit = int(env_value_str)

        if parsed_limit > 0:
            recursion_limit = parsed_limit
            logger.info(f"Recursion limit set to: {recursion_limit}")
        else:
            logger.warning(
                f"AGENT_RECURSION_LIMIT value '{env_value_str}' (parsed as {parsed_limit}) is not positive. "
                f"Using default value {default_recursion_limit}."
            )
            recursion_limit = default_recursion_limit
    except ValueError:
        raw_env_value = os.getenv("AGENT_RECURSION_LIMIT")
        logger.warning(
            f"Invalid AGENT_RECURSION_LIMIT value: '{raw_env_value}'. "
            f"Using default value {default_recursion_limit}."
        )
        recursion_limit = default_recursion_limit

    logger.info(f"Agent input: {agent_input}")
    
    # Initialize response_content to handle both success and error cases
    response_content = ""
    
    try:
        result = await agent.ainvoke(
            input=agent_input, config={"recursion_limit": recursion_limit}
        )

        # Process the result
        response_content = result["messages"][-1].content
        logger.debug(f"{agent_name.capitalize()} full response: {response_content}")

        # Update the step with the execution result
        current_step.execution_res = response_content
        logger.info(f"Step '{current_step.title}' execution completed by {agent_name}")
        
    except Exception as e:
        # Log the full error details for debugging
        logger.error(f"Error executing {agent_name} agent: {str(e)}")
        logger.error(f"Agent input that caused error: {agent_input}")
        
        # Provide a more informative error message
        error_msg = f"Agent execution failed due to: {str(e)}. This is likely a tool configuration issue."
        current_step.execution_res = error_msg
        response_content = error_msg  # Set response_content for error case
        logger.warning(f"Step '{current_step.title}' failed with error: {error_msg}")

    return Command(
        update={
            "messages": [
                HumanMessage(
                    content=response_content,
                    name=agent_name,
                )
            ],
            "observations": observations + [response_content],
        },
        goto="research_team",
    )


async def _setup_and_execute_agent_step(
    state: State,
    config: RunnableConfig,
    agent_type: str,
    default_tools: list,
) -> Command[Literal["research_team"]]:
    """Helper function to set up an agent with appropriate tools and execute a step.

    This function handles the common logic for both researcher_node and coder_node:
    1. Configures MCP servers and tools based on agent type
    2. Creates an agent with the appropriate tools or uses the default agent
    3. Executes the agent on the current step

    Args:
        state: The current state
        config: The runnable config
        agent_type: The type of agent ("researcher" or "coder")
        default_tools: The default tools to add to the agent

    Returns:
        Command to update state and go to research_team
    """
    configurable = Configuration.from_runnable_config(config)
    mcp_servers = {}
    enabled_tools = {}

    # Extract MCP server configuration for this agent type
    if configurable.mcp_settings:
        for server_name, server_config in configurable.mcp_settings["servers"].items():
            if (
                server_config["enabled_tools"]
                and agent_type in server_config["add_to_agents"]
            ):
                mcp_servers[server_name] = {
                    k: v
                    for k, v in server_config.items()
                    if k in ("transport", "command", "args", "url", "env")
                }
                for tool_name in server_config["enabled_tools"]:
                    enabled_tools[tool_name] = server_name

    # Create and execute agent with MCP tools if available
    if mcp_servers:
        async with MultiServerMCPClient(mcp_servers) as client:
            loaded_tools = default_tools[:]
            for tool in client.get_tools():
                if tool.name in enabled_tools:
                    tool.description = (
                        f"Powered by '{enabled_tools[tool.name]}'.\n{tool.description}"
                    )
                    loaded_tools.append(tool)
            agent = create_agent(agent_type, agent_type, loaded_tools, agent_type)
            return await _execute_agent_step(state, agent, agent_type, configurable)
    else:
        # Use default tools if no MCP servers are configured
        agent = create_agent(agent_type, agent_type, default_tools, agent_type)
        return await _execute_agent_step(state, agent, agent_type, configurable)


async def researcher_node(
    state: State, config: RunnableConfig
) -> Command[Literal["research_team"]]:
    """Researcher node that answers the steps with research type."""
    # Start with default tools that are always available
    from src.tools import (
        get_enhanced_outreach_search_tool,
        get_linkedin_search_tool,
        get_twitter_search_tool,
    )
    
    default_tools = [
        crawl_tool,
        get_web_search_tool(Configuration.from_runnable_config(config).max_search_results),
        get_enhanced_outreach_search_tool(),
        get_linkedin_search_tool(),
        get_twitter_search_tool(),
    ]

    # Conditionally add the retriever tool only if there are resources to search
    if state.get("resources"):
        default_tools.append(get_retriever_tool(state["resources"]))

    # Add comprehensive research tools for PersonaForge research
    from src.mcp_tools.linkedin_profile_scraper import linkedin_profile_scraper
    from src.mcp_tools.company_information_tool import company_information_retriever
    from src.mcp_tools.social_media_activity_tool import social_media_activity_analyzer
    from src.mcp_tools.public_speaking_publication_tool import public_speaking_publication_tracker
    from langchain_core.tools import tool
    
    @tool
    def linkedin_research_tool(person_name: str, company_name: str = None, job_title: str = None):
        """Research LinkedIn profile for comprehensive professional insights."""
        result = linkedin_profile_scraper(person_name, company_name, job_title)
        # Convert dict to JSON string for LangChain compatibility
        return json.dumps(result, ensure_ascii=False) if isinstance(result, dict) else str(result)
    
    @tool
    def company_research_tool(company_name: str):
        """Research company information for context and personalization."""
        result = company_information_retriever(company_name)
        # Convert dict to JSON string for LangChain compatibility
        return json.dumps(result, ensure_ascii=False) if isinstance(result, dict) else str(result)
    
    @tool
    def social_media_research_tool(person_name: str, company_name: str = None):
        """Analyze social media activity for communication style and interests."""
        result = social_media_activity_analyzer(person_name, company_name)
        # Convert dict to JSON string for LangChain compatibility
        return json.dumps(result, ensure_ascii=False) if isinstance(result, dict) else str(result)
    
    @tool
    def thought_leadership_research_tool(person_name: str, company_name: str = None):
        """Find public speaking and publications for expertise and influence."""
        result = public_speaking_publication_tracker(person_name, company_name)
        # Convert dict to JSON string for LangChain compatibility
        return json.dumps(result, ensure_ascii=False) if isinstance(result, dict) else str(result)
    
    default_tools.extend([
        linkedin_research_tool, 
        company_research_tool, 
        social_media_research_tool, 
        thought_leadership_research_tool
    ])
    
    return await _setup_and_execute_agent_step(
        state, config, "researcher", default_tools
    )


async def strategizer_node(
    state: State, config: RunnableConfig
) -> Command[Literal["research_team"]]:
    """Strategizer node that crafts outreach strategies."""
    logger.info("Strategizer node is crafting strategy.")
    configurable = Configuration.from_runnable_config(config)

    @tool
    def linkedin_insights_tool(person_name: str, company_name: str = None, job_title: str = None):
        """Get LinkedIn insights for a person."""
        # This is a placeholder for the actual tool implementation
        return "LinkedIn insights for {} at {}".format(person_name, company_name)

    @tool
    def company_insights_tool(company_name: str):
        """Get company insights."""
        # This is a placeholder for the actual tool implementation
        return "Company insights for {}".format(company_name)

    @tool
    def communication_style_tool(person_name: str, company_name: str = None):
        """Analyze communication style."""
        # This is a placeholder for the actual tool implementation
        return "Communication style analysis for {}".format(person_name)

    @tool
    def expertise_insights_tool(person_name: str, company_name: str = None):
        """Get expertise insights."""
        # This is a placeholder for the actual tool implementation
        return "Expertise insights for {}".format(person_name)

    tools = [
        linkedin_insights_tool,
        company_insights_tool,
        communication_style_tool,
        expertise_insights_tool,
    ]

    return await _setup_and_execute_agent_step(
        state,
        config,
        "strategizer",
        tools,
    )


async def coder_node(
    state: State, config: RunnableConfig
) -> Command[Literal["research_team"]]:
    """Coder node that answers the steps with processing type."""
    default_tools = [python_repl_tool]
    return await _setup_and_execute_agent_step(
        state, config, "coder", default_tools
    )


# Note: This function has been moved to builder.py where it's actually used.
# The routing logic is now handled directly in the graph builder.