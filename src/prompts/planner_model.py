# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class StepType(str, Enum):
    RESEARCH = "research"
    PROCESSING = "processing"
    PERSONA_RESEARCH = "persona_research"
    STRATEGY_FORMULATION = "strategy_formulation"
    MESSAGE_DRAFTING = "message_drafting"


class Step(BaseModel):
    need_search: bool = Field(..., description="Must be explicitly set for each step")
    title: str
    description: str = Field(..., description="Specify exactly what data to collect")
    step_type: StepType = Field(..., description="Indicates the nature of the step")
    execution_res: Optional[str] = Field(
        default=None, description="The Step execution result"
    )
    # New fields for 2024 outreach improvements
    channels: Optional[list[str]] = Field(
        default=None, description="Recommended outreach channels for this step (e.g., ['email', 'LinkedIn'])"
    )
    follow_up_sequence: Optional[list[str]] = Field(
        default=None, description="Recommended follow-up steps or timing for this step"
    )
    ab_test_variants: Optional[list[str]] = Field(
        default=None, description="A/B test or persona variant options for this step, if context is ambiguous"
    )
    trend_hijacking_reference: Optional[str] = Field(
        default=None, description="Reference to a recent trend, news, or recipient activity for this step, if applicable"
    )


class Plan(BaseModel):
    locale: str = Field(
        ..., description="e.g. 'en-US' or 'zh-CN', based on the user's language"
    )
    has_enough_context: bool
    thought: str
    title: str
    steps: List[Step] = Field(
        default_factory=list,
        description="Research & Processing steps to get more context",
    )
    # Template selection fields for automatic template usage
    selected_template_id: Optional[str] = Field(
        None, description="The ID of the selected outreach template (e.g., 'T01', 'T02')"
    )
    selected_tone: Optional[str] = Field(
        None, description="The selected tone for the outreach message (e.g., 'Friendly', 'Confident')"
    )
    # New fields for 2024 outreach improvements
    overall_channels: Optional[list[str]] = Field(
        default=None, description="Recommended overall outreach channels for the plan"
    )
    overall_follow_up_sequence: Optional[list[str]] = Field(
        default=None, description="Recommended overall follow-up sequence for the plan"
    )
    ab_test_summary: Optional[str] = Field(
        default=None, description="Summary of A/B test or persona variant logic for the plan"
    )
    trend_hijacking_summary: Optional[str] = Field(
        default=None, description="Summary of trend hijacking or recent activity references for the plan"
    )

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "has_enough_context": False,
                    "thought": (
                        "To craft an effective outreach message to Sarah Johnson, we need to gather comprehensive information about her professional background, interests, and communication style."
                    ),
                    "title": "Personalized Outreach Plan for Sarah Johnson",
                    "steps": [
                        {
                            "need_search": True,
                            "title": "Professional Background Research",
                            "description": (
                                "Gather detailed information about Sarah Johnson's current role, company, career trajectory, and professional achievements."
                            ),
                            "step_type": "persona_research",
                            "channels": ["LinkedIn"],
                            "follow_up_sequence": ["Send follow-up email 3 days after LinkedIn message if no response"],
                            "ab_test_variants": ["Formal persona", "Casual persona"],
                            "trend_hijacking_reference": "Reference Sarah's recent talk at FinTech Summit 2024",
                        }
                    ],
                    "overall_channels": ["LinkedIn", "Email"],
                    "overall_follow_up_sequence": ["Initial LinkedIn message", "Follow-up email after 3 days"],
                    "ab_test_summary": "Test formal vs. casual sender persona for best response rate.",
                    "trend_hijacking_summary": "Reference recipient's recent public speaking event.",
                    "selected_template_id": "T02",
                    "selected_tone": "Confident",
                }
            ]
        }