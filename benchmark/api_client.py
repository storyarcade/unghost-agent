#!/usr/bin/env python3
"""
API Client for Unghost Backend Integration

Handles communication with the Unghost backend server for generating
outreach messages through the chat API.
"""

import json
import logging
import asyncio
from typing import Dict, List, Optional, AsyncGenerator
import aiohttp
from datetime import datetime

logger = logging.getLogger(__name__)


class UnghostAPIClient:
    """Client for interacting with the Unghost backend API."""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip('/')
        self.session: Optional[aiohttp.ClientSession] = None
        
    async def __aenter__(self):
        """Async context manager entry."""
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.session:
            await self.session.close()
            
    async def health_check(self) -> bool:
        """Check if the backend server is running and accessible."""
        try:
            async with self.session.get(f"{self.base_url}/docs") as response:
                return response.status == 200
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False
            
    async def generate_outreach(
        self,
        scenario: Dict,
        timeout: int = 120
    ) -> Dict:
        """
        Generate an outreach message for a given scenario.
        
        Args:
            scenario: Test scenario containing recipient and sender info
            timeout: Request timeout in seconds
            
        Returns:
            Dictionary containing the generated message and metadata
        """
        # Construct the prompt from scenario data
        prompt = self._build_prompt(scenario)
        
        # Prepare the request payload
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "user_background": scenario['sender'].get('background', ''),
            "enable_background_investigation": True,
            "max_plan_iterations": 1,
            "max_step_num": 3,
            "max_search_results": 3,
            "auto_accepted_plan": True,
            "report_style": "friendly"
        }
        
        # Make the API call and collect the streamed response
        start_time = datetime.now()
        full_response = await self._stream_chat_response(payload, timeout)
        end_time = datetime.now()
        
        # Process the response
        return {
            "scenario_id": scenario['id'],
            "use_case": scenario['use_case'],
            "generated_message": self._extract_message(full_response),
            "full_response": full_response,
            "generation_time": (end_time - start_time).total_seconds(),
            "timestamp": datetime.now().isoformat()
        }
        
    def _build_prompt(self, scenario: Dict) -> str:
        """Build a prompt from the scenario data."""
        recipient = scenario['recipient']
        sender = scenario['sender']
        
        prompt = f"""Create a {scenario['use_case']} outreach message with the following context:

RECIPIENT INFORMATION:
- Name: {recipient['name']}
- Role: {recipient['role']} at {recipient['company']}
- Recent Activity: {recipient['recent_activity']}
- Interests: {', '.join(recipient['interests'])}
- Profile: {recipient['profile_summary']}

SENDER INFORMATION:
- Name: {sender['name']}
- Background: {sender['background']}
- Company: {sender['company']}
- Objective: {sender['objective']}
- Value Proposition: {sender['value_proposition']}

Please create a personalized outreach message that:
1. References the recipient's recent activity
2. Establishes common ground or mutual interests
3. Clearly communicates the value proposition
4. Includes a specific but low-pressure call-to-action
5. Maintains an authentic, human tone appropriate for {scenario['use_case']}

Generate ONLY the message content, without any preamble or explanation."""
        
        return prompt
        
    async def _stream_chat_response(
        self,
        payload: Dict,
        timeout: int
    ) -> str:
        """Stream the chat response from the API."""
        url = f"{self.base_url}/api/chat/stream"
        headers = {"Accept": "text/event-stream"}
        
        collected_content = []
        
        try:
            timeout_config = aiohttp.ClientTimeout(total=timeout)
            async with self.session.post(
                url,
                json=payload,
                headers=headers,
                timeout=timeout_config
            ) as response:
                async for line in response.content:
                    if line:
                        line_str = line.decode('utf-8').strip()
                        if line_str.startswith("data: "):
                            data_str = line_str[6:]
                            if data_str and data_str != "[DONE]":
                                try:
                                    data = json.loads(data_str)
                                    # Extract content from different event types
                                    if 'content' in data:
                                        collected_content.append(data['content'])
                                    elif 'chunk' in data:
                                        collected_content.append(data['chunk'])
                                except json.JSONDecodeError:
                                    logger.debug(f"Could not parse: {data_str}")
                                    
        except asyncio.TimeoutError:
            logger.error(f"Request timeout after {timeout} seconds")
            raise
        except Exception as e:
            logger.error(f"Error streaming response: {e}")
            raise
            
        return ''.join(collected_content)
        
    def _extract_message(self, full_response: str) -> str:
        """
        Extract the actual outreach message from the full response.
        
        The response may contain planning steps, research, and the final message.
        We need to extract just the final outreach message.
        """
        # Look for common patterns that indicate the start of the actual message
        markers = [
            "Subject:",
            "Hi ",
            "Hello ",
            "Dear ",
            "Hey ",
            "Good morning",
            "Good afternoon",
            "Good evening"
        ]
        
        # Try to find the message start
        message_start = -1
        for marker in markers:
            idx = full_response.rfind(marker)
            if idx != -1 and (message_start == -1 or idx > message_start):
                message_start = idx
                
        if message_start != -1:
            # Extract from the marker to the end
            message = full_response[message_start:].strip()
            
            # Clean up any trailing metadata or system messages
            end_markers = ["---", "```", "[End", "[Done", "Generated by"]
            for end_marker in end_markers:
                end_idx = message.find(end_marker)
                if end_idx != -1:
                    message = message[:end_idx].strip()
                    
            return message
        else:
            # Fallback: return the last substantial paragraph
            paragraphs = full_response.split('\n\n')
            for para in reversed(paragraphs):
                if len(para.strip()) > 50:  # Arbitrary minimum length
                    return para.strip()
                    
        return full_response.strip()


async def test_api_client():
    """Test the API client functionality."""
    async with UnghostAPIClient() as client:
        # Test health check
        is_healthy = await client.health_check()
        print(f"Backend health check: {'✅' if is_healthy else '❌'}")
        
        if is_healthy:
            # Test with a simple scenario
            test_scenario = {
                "id": "test_001",
                "use_case": "LinkedIn DM",
                "recipient": {
                    "name": "Test User",
                    "role": "Product Manager",
                    "company": "Test Corp",
                    "recent_activity": "Posted about AI trends",
                    "interests": ["AI", "Product Management"],
                    "profile_summary": "5 years in product management"
                },
                "sender": {
                    "name": "Test Sender",
                    "background": "AI startup founder",
                    "company": "Test AI",
                    "objective": "Connect for collaboration",
                    "value_proposition": "AI expertise"
                }
            }
            
            try:
                result = await client.generate_outreach(test_scenario)
                print(f"\nGenerated message preview:")
                print(result['generated_message'][:200] + "...")
                print(f"\nGeneration time: {result['generation_time']:.2f} seconds")
            except Exception as e:
                print(f"Error generating message: {e}")


if __name__ == "__main__":
    asyncio.run(test_api_client())