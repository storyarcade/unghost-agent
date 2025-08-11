#!/usr/bin/env python3
"""
LLM Judge for Outreach Message Evaluation

Uses the configured LLM to evaluate generated outreach messages
based on predefined criteria.
"""

import json
import logging
import re
from typing import Dict, List, Optional
import asyncio
from pathlib import Path
import sys

# Add parent directory to path to import from src
sys.path.append(str(Path(__file__).parent.parent))

from src.llms.llm import get_llm_by_type
from src.utils.json_utils import repair_json_output

logger = logging.getLogger(__name__)


class LLMJudge:
    """LLM-based evaluator for outreach messages."""
    
    def __init__(self):
        self.llm = None
        self.evaluation_criteria = None
        self._load_evaluation_criteria()
        
    def _load_evaluation_criteria(self):
        """Load evaluation criteria from test scenarios."""
        try:
            scenarios_path = Path(__file__).parent / "test_scenarios.json"
            with open(scenarios_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.evaluation_criteria = data.get('evaluation_criteria', {})
                self.scoring_guidelines = data.get('scoring_guidelines', {})
        except Exception as e:
            logger.error(f"Failed to load evaluation criteria: {e}")
            self.evaluation_criteria = {}
            self.scoring_guidelines = {}
            
    async def initialize(self):
        """Initialize the LLM client."""
        try:
            # Use the basic model for evaluation
            self.llm = get_llm_by_type("basic")
            logger.info("Successfully initialized LLM judge")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize LLM judge: {e}")
            return False
            
    async def evaluate_message(
        self,
        message: str,
        scenario: Dict,
        criteria: Optional[Dict] = None
    ) -> Dict:
        """
        Evaluate an outreach message using LLM.
        
        Args:
            message: The generated outreach message
            scenario: The test scenario context
            criteria: Optional custom evaluation criteria
            
        Returns:
            Dictionary containing evaluation scores and feedback
        """
        if not self.llm:
            raise RuntimeError("LLM judge not initialized. Call initialize() first.")
            
        # Use provided criteria or default
        eval_criteria = criteria or self.evaluation_criteria
        
        # Build the evaluation prompt
        prompt = self._build_evaluation_prompt(message, scenario, eval_criteria)
        
        try:
            # Get LLM evaluation
            response = await self.llm.ainvoke(prompt)
            
            # Extract and parse the evaluation
            evaluation = self._parse_evaluation_response(response.content)
            
            # Add metadata
            evaluation['scenario_id'] = scenario['id']
            evaluation['use_case'] = scenario['use_case']
            
            return evaluation
            
        except Exception as e:
            logger.error(f"Error during evaluation: {e}")
            return {
                'error': str(e),
                'scenario_id': scenario['id'],
                'use_case': scenario['use_case']
            }
            
    def _build_evaluation_prompt(
        self,
        message: str,
        scenario: Dict,
        criteria: Dict
    ) -> str:
        """Build the evaluation prompt for the LLM."""
        
        # Format expected elements
        expected_elements = "\n".join([
            f"- {element}" for element in scenario.get('expected_elements', [])
        ])
        
        # Format evaluation criteria
        criteria_text = ""
        for criterion, details in criteria.items():
            criteria_text += f"\n{criterion}: {details['description']}"
            
        # Format scoring guidelines
        scoring_text = "\n".join([
            f"{score}: {description}" 
            for score, description in self.scoring_guidelines.items()
        ])
        
        prompt = f"""You are an expert evaluator of outreach messages. Evaluate the following message based on the given context and criteria.

## SCENARIO CONTEXT

Use Case: {scenario['use_case']}
Category: {scenario.get('category', 'general')}

Recipient Information:
- Name: {scenario['recipient']['name']}
- Role: {scenario['recipient']['role']} at {scenario['recipient']['company']}
- Recent Activity: {scenario['recipient']['recent_activity']}
- Interests: {', '.join(scenario['recipient']['interests'])}

Sender Information:
- Objective: {scenario['sender']['objective']}
- Value Proposition: {scenario['sender']['value_proposition']}

Expected Elements in the Message:
{expected_elements}

## MESSAGE TO EVALUATE

{message}

## EVALUATION CRITERIA

Please evaluate the message on each of the following criteria using a 1-5 scale:
{criteria_text}

## SCORING GUIDELINES
{scoring_text}

## EVALUATION TASK

1. For each criterion, provide:
   - A score (1-5)
   - A brief justification for the score
   - Specific examples from the message

2. Check if the expected elements are present in the message

3. Provide an overall assessment and recommendations for improvement

Return your evaluation in the following JSON format:
{{
    "scores": {{
        "personalization": <score>,
        "goal_alignment": <score>,
        "tone_appropriateness": <score>,
        "clarity_readability": <score>,
        "cta_effectiveness": <score>,
        "authenticity": <score>,
        "relevance": <score>
    }},
    "justifications": {{
        "personalization": "<justification>",
        "goal_alignment": "<justification>",
        "tone_appropriateness": "<justification>",
        "clarity_readability": "<justification>",
        "cta_effectiveness": "<justification>",
        "authenticity": "<justification>",
        "relevance": "<justification>"
    }},
    "expected_elements_present": {{
        "element_1": true/false,
        "element_2": true/false,
        ...
    }},
    "overall_score": <weighted average of all scores>,
    "overall_assessment": "<1-2 sentence summary>",
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "improvements": ["<improvement 1>", "<improvement 2>", ...],
    "recommendation": "<specific recommendation for improvement>"
}}"""
        
        return prompt
        
    def _parse_evaluation_response(self, response_text: str) -> Dict:
        """Parse the LLM evaluation response."""
        try:
            # Try to extract JSON from the response
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                json_str = json_match.group()
                # Use the repair function to handle any JSON issues
                evaluation = json.loads(repair_json_output(json_str))
            else:
                # Fallback: create a basic structure
                evaluation = {
                    'raw_response': response_text,
                    'parsing_error': 'Could not extract JSON from response'
                }
                
            # Calculate overall score if not present
            if 'scores' in evaluation and 'overall_score' not in evaluation:
                scores = evaluation['scores']
                weights = {k: v['weight'] for k, v in self.evaluation_criteria.items()}
                
                weighted_sum = sum(
                    scores.get(criterion, 3) * weights.get(criterion, 0.1)
                    for criterion in scores
                )
                total_weight = sum(weights.values())
                evaluation['overall_score'] = round(weighted_sum / total_weight, 2)
                
            return evaluation
            
        except Exception as e:
            logger.error(f"Error parsing evaluation response: {e}")
            return {
                'parsing_error': str(e),
                'raw_response': response_text[:500] + '...' if len(response_text) > 500 else response_text
            }
            
    async def batch_evaluate(
        self,
        messages: List[Dict],
        scenarios: List[Dict]
    ) -> List[Dict]:
        """
        Evaluate multiple messages in batch.
        
        Args:
            messages: List of generated messages with metadata
            scenarios: Corresponding test scenarios
            
        Returns:
            List of evaluation results
        """
        evaluations = []
        
        # Create scenario lookup
        scenario_map = {s['id']: s for s in scenarios}
        
        for message_data in messages:
            scenario_id = message_data.get('scenario_id')
            scenario = scenario_map.get(scenario_id)
            
            if not scenario:
                logger.warning(f"No scenario found for ID: {scenario_id}")
                continue
                
            # Evaluate the message
            evaluation = await self.evaluate_message(
                message_data.get('generated_message', ''),
                scenario
            )
            
            # Add generation metadata
            evaluation['generation_time'] = message_data.get('generation_time', 0)
            evaluation['timestamp'] = message_data.get('timestamp', '')
            
            evaluations.append(evaluation)
            
            # Rate limiting
            await asyncio.sleep(1)
            
        return evaluations
        
    def calculate_aggregate_scores(self, evaluations: List[Dict]) -> Dict:
        """Calculate aggregate scores across all evaluations."""
        if not evaluations:
            return {}
            
        # Initialize aggregates
        criteria_scores = {}
        use_case_scores = {}
        overall_scores = []
        
        for eval_data in evaluations:
            if 'error' in eval_data or 'parsing_error' in eval_data:
                continue
                
            scores = eval_data.get('scores', {})
            use_case = eval_data.get('use_case', 'Unknown')
            overall = eval_data.get('overall_score', 0)
            
            # Aggregate by criteria
            for criterion, score in scores.items():
                if criterion not in criteria_scores:
                    criteria_scores[criterion] = []
                criteria_scores[criterion].append(score)
                
            # Aggregate by use case
            if use_case not in use_case_scores:
                use_case_scores[use_case] = []
            use_case_scores[use_case].append(overall)
            
            overall_scores.append(overall)
            
        # Calculate averages
        criteria_averages = {
            criterion: sum(scores) / len(scores)
            for criterion, scores in criteria_scores.items()
            if scores
        }
        
        use_case_averages = {
            use_case: sum(scores) / len(scores)
            for use_case, scores in use_case_scores.items()
            if scores
        }
        
        return {
            'criteria_averages': criteria_averages,
            'use_case_averages': use_case_averages,
            'overall_average': sum(overall_scores) / len(overall_scores) if overall_scores else 0,
            'total_evaluations': len(evaluations),
            'successful_evaluations': len(overall_scores)
        }


async def test_llm_judge():
    """Test the LLM judge functionality."""
    judge = LLMJudge()
    
    # Initialize
    if not await judge.initialize():
        print("Failed to initialize LLM judge")
        return
        
    # Test evaluation with a sample message
    test_message = """Hi Sarah,

I noticed your recent post about AI trends in product management and the importance of human-centric design - it really resonated with me! As someone who's been building AI-powered B2B solutions for the past 5 years, I couldn't agree more about keeping the human element at the center.

At InnovateAI, we've successfully implemented AI in 3 enterprise products with 40% efficiency gains, but what I'm most proud of is how we've maintained that human-centric approach you mentioned. 

I'd love to connect and share some insights on AI product strategy, especially around balancing automation with user experience. Would you be open to a virtual coffee chat sometime next week?

Best regards,
Alex Thompson
Founder, InnovateAI"""
    
    test_scenario = {
        "id": "test_001",
        "use_case": "LinkedIn DM",
        "category": "professional_networking",
        "recipient": {
            "name": "Sarah Chen",
            "role": "Product Manager",
            "company": "TechCorp",
            "recent_activity": "Posted about AI trends in product management and the importance of human-centric design",
            "interests": ["AI/ML", "Product Strategy", "Team Leadership", "Design Thinking"]
        },
        "sender": {
            "objective": "Connect and discuss potential collaboration on AI product strategy",
            "value_proposition": "Successfully implemented AI in 3 enterprise products with 40% efficiency gains"
        },
        "expected_elements": [
            "reference to AI trends post",
            "mention of human-centric design alignment",
            "soft CTA for coffee chat or virtual meeting",
            "professional but friendly tone"
        ]
    }
    
    print("Evaluating test message...")
    evaluation = await judge.evaluate_message(test_message, test_scenario)
    
    print("\nEvaluation Results:")
    print(json.dumps(evaluation, indent=2))


if __name__ == "__main__":
    asyncio.run(test_llm_judge())