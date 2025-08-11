# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

"""
Template selector tool for choosing the best outreach template based on context.
"""

from typing import Dict, List, Optional
from src.utils.template_loader import template_loader
import logging

logger = logging.getLogger(__name__)


def select_best_template(
    context: Dict[str, any],
    preferred_tone: Optional[str] = None,
    use_case: Optional[str] = None
) -> Optional[Dict]:
    """
    Select the best outreach template based on context.
    
    Args:
        context: Dictionary containing prospect information and outreach goals
        preferred_tone: Preferred tone (Friendly, Confident, Playful, etc.)
        use_case: Specific use case to filter by
        
    Returns:
        Best matching template or None
    """
    templates = template_loader.get_all_templates()
    
    if not templates:
        logger.warning("No templates available")
        return None
    
    # Filter by tone if specified
    if preferred_tone:
        filtered = template_loader.get_templates_by_tone(preferred_tone)
        if filtered:
            templates = filtered
    
    # Filter by use case if specified
    if use_case:
        filtered = template_loader.get_templates_by_use_case(use_case)
        if filtered:
            templates = filtered
    
    # Simple scoring based on context matching
    # In production, this could use ML or more sophisticated matching
    best_template = None
    best_score = 0
    
    for template in templates:
        score = 0
        
        # Check if template variables match available context
        template_text = template.get('prompt_template', '')
        if '{{name}}' in template_text and context.get('recipient_name'):
            score += 1
        if '{{company}}' in template_text and context.get('recipient_company'):
            score += 1
        if '{{topic}}' in template_text and context.get('recent_activity'):
            score += 1
        if '{{community}}' in template_text and context.get('shared_communities'):
            score += 1
            
        # Bonus for matching use case
        if use_case and use_case.lower() in template.get('use_case', '').lower():
            score += 2
            
        if score > best_score:
            best_score = score
            best_template = template
    
    if best_template:
        logger.info(f"Selected template {best_template['template_id']} with score {best_score}")
    else:
        logger.warning("No suitable template found")
        
    return best_template


def get_template_variables(template: Dict) -> List[str]:
    """Extract variable names from a template."""
    import re
    template_text = template.get('prompt_template', '')
    # Find all {{variable}} patterns
    variables = re.findall(r'\{\{(\w+)\}\}', template_text)
    return list(set(variables))


def fill_template(template: Dict, values: Dict[str, str]) -> str:
    """Fill a template with provided values."""
    template_text = template.get('prompt_template', '')
    
    for key, value in values.items():
        template_text = template_text.replace(f'{{{{{key}}}}}', value)
    
    return template_text


def get_templates_for_ui() -> List[Dict]:
    """Get simplified template list for UI display."""
    templates = template_loader.get_all_templates()
    
    # Simplify for UI
    ui_templates = []
    for template in templates:
        ui_templates.append({
            'id': template.get('template_id'),
            'label': f"{template.get('use_case')} - {template.get('tone')}",
            'tone': template.get('tone'),
            'use_case': template.get('use_case'),
            'preview': template.get('prompt_template', '')[:100] + '...'
        })
    
    return ui_templates