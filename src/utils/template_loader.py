# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

import json
import os
from pathlib import Path
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class TemplateLoader:
    """Utility class to load and manage outreach templates."""
    
    def __init__(self):
        self.templates: List[Dict] = []
        self._load_templates()
    
    def _load_templates(self):
        """Load templates from the JSON file."""
        try:
            # Get the path to the templates file
            template_path = Path(__file__).parent.parent / "prompts" / "templates" / "outreach_templates.json"
            
            if template_path.exists():
                with open(template_path, 'r', encoding='utf-8') as f:
                    self.templates = json.load(f)
                logger.info(f"Loaded {len(self.templates)} outreach templates")
            else:
                logger.warning(f"Template file not found at {template_path}")
                self.templates = []
        except Exception as e:
            logger.error(f"Error loading templates: {e}")
            self.templates = []
    
    def get_all_templates(self) -> List[Dict]:
        """Get all available templates."""
        return self.templates
    
    def get_template_by_id(self, template_id: str) -> Optional[Dict]:
        """Get a specific template by ID."""
        for template in self.templates:
            if template.get("template_id") == template_id:
                return template
        return None
    
    def get_templates_by_tone(self, tone: str) -> List[Dict]:
        """Get templates filtered by tone."""
        return [t for t in self.templates if t.get("tone", "").lower() == tone.lower()]
    
    def get_templates_by_use_case(self, use_case: str) -> List[Dict]:
        """Get templates filtered by use case."""
        return [t for t in self.templates if use_case.lower() in t.get("use_case", "").lower()]
    
    def get_template_summary(self) -> str:
        """Get a formatted summary of all templates for prompt injection."""
        summary = "Available Outreach Templates:\n\n"
        for template in self.templates:
            summary += f"Template ID: {template.get('template_id', 'N/A')}\n"
            summary += f"Tone: {template.get('tone', 'N/A')}\n"
            summary += f"Use Case: {template.get('use_case', 'N/A')}\n"
            summary += f"Hook Type: {template.get('hook_type', 'N/A')}\n"
            summary += f"CTA Type: {template.get('cta_type', 'N/A')}\n"
            summary += f"Template: {template.get('prompt_template', 'N/A')}\n"
            summary += "-" * 50 + "\n\n"
        return summary

    def get_templates_summary(self) -> str:
        """Get a formatted summary of all templates for prompt injection."""
        return self.get_template_summary()

# Global instance
template_loader = TemplateLoader()