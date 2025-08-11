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


class Source(BaseModel):
    """Source of information used in research."""
    title: str = Field(..., description="Title of the source")
    url: str = Field(..., description="URL of the source")
    tool_used: str = Field(..., description="Tool used to retrieve this information")


class RecipientPersonaProfile(BaseModel):
    """Detailed profile of the outreach target recipient."""
    target_name: str = Field(..., description="Full name of the target recipient")
    target_role: str = Field(..., description="Current job title/role of the target")
    target_company: str = Field(..., description="Company where the target works")
    company_industry: str = Field(..., description="Industry of the target's company")
    recent_activity_summary: str = Field(..., description="Summary of recent professional activities")
    key_interests_professional: List[str] = Field(..., description="Professional interests and focus areas")
    key_interests_personal_optional: Optional[List[str]] = Field(None, description="Personal interests (if publicly available)")
    inferred_professional_priorities: List[str] = Field(..., description="Likely professional goals and priorities based on role and context")
    communication_style_cues: str = Field(..., description="Observations about preferred communication style")
    shared_connections_or_common_ground: List[str] = Field(default_factory=list, description="Mutual connections or shared experiences")
    potential_pain_points_or_challenges: List[str] = Field(..., description="Inferred challenges or pain points")
    timeliness_trigger: str = Field(..., description="Recent event or context that makes outreach timely now")
    sources_used: List[Source] = Field(..., description="Sources of information used in research")
    concise_personalization_summary: str = Field(..., description="1-2 sentence summary of best personalization angles")


class OutreachStrategy(BaseModel):
    """Strategic approach for the outreach message."""
    primary_value_proposition: str = Field(..., description="Core value proposition aligned with recipient's needs")
    recommended_angle: str = Field(..., description="Best approach angle based on persona research")
    tone_recommendation: str = Field(..., description="Recommended tone matching recipient's communication style")
    credibility_elements: List[str] = Field(..., description="Proof points to establish credibility")
    personalization_hooks: List[str] = Field(..., description="Specific details to include for personalization")
    call_to_action: str = Field(..., description="Recommended clear next step or ask")
    channel_recommendation: str = Field(..., description="Best channel for initial outreach (email, LinkedIn, etc.)")
    follow_up_strategy: Optional[str] = Field(None, description="Recommended follow-up approach if no response")


class OutreachMessage(BaseModel):
    """The actual outreach message draft."""
    subject_line: str = Field(..., description="Attention-grabbing subject line (for email)")
    greeting: str = Field(..., description="Personalized greeting")
    opening_hook: str = Field(..., description="Opening sentence to grab attention")
    body: str = Field(..., description="Main message body")
    value_proposition: str = Field(..., description="Clear statement of value to recipient")
    proof_point: str = Field(..., description="Evidence or social proof")
    call_to_action: str = Field(..., description="Clear, specific ask")
    closing: str = Field(..., description="Professional sign-off")
    full_message: str = Field(..., description="Complete formatted message")


class OutreachReport(BaseModel):
    """Complete outreach package with persona, strategy and message."""
    persona_profile: RecipientPersonaProfile
    outreach_strategy: OutreachStrategy
    outreach_message: OutreachMessage
    additional_notes: Optional[str] = Field(None, description="Any additional context or suggestions")