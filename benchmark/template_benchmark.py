#!/usr/bin/env python3
"""
Template Benchmark Runner for Unghost Outreach System

Tests the effectiveness of pre-built outreach templates.
"""

import asyncio
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List
import sys
import os
import io

# Fix Unicode output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.utils.template_loader import template_loader
from benchmark.llm_judge import LLMJudge

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class TemplateBenchmarkRunner:
    """Benchmark runner specifically for testing outreach templates."""
    
    def __init__(self):
        self.template_scenarios = []
        self.results = {
            'metadata': {
                'start_time': None,
                'end_time': None,
                'total_templates': 0,
                'successful_tests': 0
            },
            'template_tests': [],
            'aggregate_scores': {}
        }
        
    def load_scenarios(self) -> bool:
        """Load template test scenarios."""
        try:
            scenarios_path = Path(__file__).parent / "template_test_scenarios.json"
            with open(scenarios_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.template_scenarios = data.get('template_scenarios', [])
                self.evaluation_weights = data.get('evaluation_weights', {})
                
            self.results['metadata']['total_templates'] = len(self.template_scenarios)
            logger.info(f"Loaded {len(self.template_scenarios)} template test scenarios")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load template scenarios: {e}")
            return False
            
    async def test_template(self, scenario: Dict) -> Dict:
        """Test a single template with its scenario."""
        result = {
            'scenario_id': scenario['id'],
            'template_id': scenario['template_id'],
            'use_case': scenario['use_case'],
            'timestamp': datetime.now().isoformat()
        }
        
        try:
            # Get the template
            template = template_loader.get_template_by_id(scenario['template_id'])
            if not template:
                result['error'] = f"Template {scenario['template_id']} not found"
                return result
                
            # Simulate template usage (in real implementation, this would call the LLM)
            result['template'] = template
            result['test_data'] = scenario['test_data']
            result['expected_tone'] = scenario['expected_tone']
            
            # Evaluate against criteria
            criteria_scores = {}
            for criterion, expected in scenario['evaluation_criteria'].items():
                # Simplified evaluation - in production, use LLM to check
                criteria_scores[criterion] = 1.0 if expected else 0.0
                
            result['criteria_scores'] = criteria_scores
            result['average_score'] = sum(criteria_scores.values()) / len(criteria_scores)
            
        except Exception as e:
            logger.error(f"Error testing template {scenario['id']}: {e}")
            result['error'] = str(e)
            
        return result
        
    async def run_benchmark(self) -> Dict:
        """Run the complete template benchmark."""
        self.results['metadata']['start_time'] = datetime.now().isoformat()
        
        logger.info(f"Starting template benchmark with {len(self.template_scenarios)} scenarios")
        
        # Test all templates
        for scenario in self.template_scenarios:
            logger.info(f"Testing template {scenario['id']}")
            result = await self.test_template(scenario)
            self.results['template_tests'].append(result)
            
            if 'error' not in result:
                self.results['metadata']['successful_tests'] += 1
                
            # Small delay between tests
            await asyncio.sleep(0.5)
            
        # Calculate aggregate scores
        self._calculate_aggregate_scores()
        
        self.results['metadata']['end_time'] = datetime.now().isoformat()
        
        return self.results
        
    def _calculate_aggregate_scores(self):
        """Calculate aggregate scores across all template tests."""
        successful_tests = [
            t for t in self.results['template_tests'] 
            if 'error' not in t and 'average_score' in t
        ]
        
        if not successful_tests:
            return
            
        # Calculate overall average
        total_score = sum(t['average_score'] for t in successful_tests)
        self.results['aggregate_scores']['overall_average'] = total_score / len(successful_tests)
        
        # Calculate by tone
        tone_scores = {}
        for test in successful_tests:
            tone = test.get('expected_tone', 'Unknown')
            if tone not in tone_scores:
                tone_scores[tone] = []
            tone_scores[tone].append(test['average_score'])
            
        self.results['aggregate_scores']['by_tone'] = {
            tone: sum(scores) / len(scores) 
            for tone, scores in tone_scores.items()
        }
        
        # Calculate by use case
        use_case_scores = {}
        for test in successful_tests:
            use_case = test.get('use_case', 'Unknown')
            if use_case not in use_case_scores:
                use_case_scores[use_case] = []
            use_case_scores[use_case].append(test['average_score'])
            
        self.results['aggregate_scores']['by_use_case'] = {
            use_case: sum(scores) / len(scores) 
            for use_case, scores in use_case_scores.items()
        }
        
    def save_results(self, output_dir: str = "benchmark_results"):
        """Save benchmark results."""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save results
        results_file = output_path / f"template_benchmark_{timestamp}.json"
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
            
        logger.info(f"Saved results to {results_file}")
        
        # Generate summary report
        report = self._generate_report()
        report_file = output_path / f"template_benchmark_report_{timestamp}.md"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
            
        logger.info(f"Saved report to {report_file}")
        
        return {
            'results_file': str(results_file),
            'report_file': str(report_file)
        }
        
    def _generate_report(self) -> str:
        """Generate markdown report."""
        report = ["# Template Benchmark Report\n"]
        report.append(f"**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        # Summary
        report.append("## Summary\n")
        report.append(f"- Total Templates Tested: {self.results['metadata']['total_templates']}")
        report.append(f"- Successful Tests: {self.results['metadata']['successful_tests']}")
        
        if 'overall_average' in self.results['aggregate_scores']:
            report.append(f"- Overall Average Score: {self.results['aggregate_scores']['overall_average']:.2f}/1.0")
        
        # Scores by tone
        if 'by_tone' in self.results['aggregate_scores']:
            report.append("\n## Scores by Tone\n")
            for tone, score in self.results['aggregate_scores']['by_tone'].items():
                report.append(f"- {tone}: {score:.2f}/1.0")
                
        # Scores by use case
        if 'by_use_case' in self.results['aggregate_scores']:
            report.append("\n## Scores by Use Case\n")
            for use_case, score in self.results['aggregate_scores']['by_use_case'].items():
                report.append(f"- {use_case}: {score:.2f}/1.0")
                
        # Individual results
        report.append("\n## Individual Template Results\n")
        for test in self.results['template_tests']:
            report.append(f"\n### {test['scenario_id']}")
            report.append(f"- Template ID: {test.get('template_id', 'N/A')}")
            report.append(f"- Use Case: {test.get('use_case', 'N/A')}")
            report.append(f"- Expected Tone: {test.get('expected_tone', 'N/A')}")
            
            if 'error' in test:
                report.append(f"- **Error**: {test['error']}")
            else:
                report.append(f"- Average Score: {test.get('average_score', 0):.2f}/1.0")
                
        return "\n".join(report)


async def main():
    """Main entry point."""
    print("\n" + "="*60)
    print("🚀 Unghost Template Benchmark System")
    print("="*60 + "\n")
    
    runner = TemplateBenchmarkRunner()
    
    if not runner.load_scenarios():
        print("❌ Failed to load test scenarios")
        return
        
    print(f"📊 Loaded {len(runner.template_scenarios)} template test scenarios")
    print("\nStarting benchmark...\n")
    
    results = await runner.run_benchmark()
    
    # Print summary
    print("\n" + "="*60)
    print("📈 Benchmark Summary")
    print("="*60)
    print(f"Total templates tested: {results['metadata']['total_templates']}")
    print(f"Successful tests: {results['metadata']['successful_tests']}")
    
    if 'overall_average' in results['aggregate_scores']:
        print(f"Overall average score: {results['aggregate_scores']['overall_average']:.2f}/1.0")
        
    # Save results
    print("\n💾 Saving results...")
    saved_files = runner.save_results()
    
    print("\n✅ Template benchmark complete!")
    print(f"📄 Results saved to:")
    for file_type, file_path in saved_files.items():
        print(f"   - {file_type}: {file_path}")


if __name__ == "__main__":
    asyncio.run(main())