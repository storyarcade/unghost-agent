#!/usr/bin/env python3
"""
Main Benchmark Runner for Unghost Outreach System

Orchestrates the complete benchmark process:
1. Loads test scenarios
2. Generates outreach messages via API
3. Evaluates messages using LLM judge
4. Generates comprehensive reports
"""

import asyncio
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import argparse

from api_client import UnghostAPIClient
from llm_judge import LLMJudge
try:
    from report_generator_improved import EnhancedBenchmarkReportGenerator as BenchmarkReportGenerator
except ImportError:
    from report_generator import BenchmarkReportGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class OutreachBenchmarkRunner:
    """Main orchestrator for the benchmark system."""
    
    def __init__(
        self,
        backend_url: str = "http://localhost:8000",
        scenarios_file: str = "test_scenarios.json"
    ):
        self.backend_url = backend_url
        self.scenarios_file = scenarios_file
        self.scenarios = []
        self.results = {
            'metadata': {
                'start_time': None,
                'end_time': None,
                'backend_url': backend_url,
                'total_scenarios': 0,
                'successful_generations': 0,
                'successful_evaluations': 0
            },
            'generations': [],
            'evaluations': [],
            'aggregate_scores': {},
            'errors': []
        }
        
    def load_scenarios(self, specific_ids: Optional[List[str]] = None) -> bool:
        """Load test scenarios from file."""
        try:
            scenarios_path = Path(__file__).parent / self.scenarios_file
            with open(scenarios_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                all_scenarios = data.get('scenarios', [])
                
            # Filter scenarios if specific IDs provided
            if specific_ids:
                self.scenarios = [
                    s for s in all_scenarios 
                    if s['id'] in specific_ids
                ]
            else:
                self.scenarios = all_scenarios
                
            self.results['metadata']['total_scenarios'] = len(self.scenarios)
            logger.info(f"Loaded {len(self.scenarios)} test scenarios")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load scenarios: {e}")
            self.results['errors'].append({
                'stage': 'load_scenarios',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })
            return False
            
    async def run_benchmark(
        self,
        limit: Optional[int] = None,
        categories: Optional[List[str]] = None
    ) -> Dict:
        """
        Run the complete benchmark process.
        
        Args:
            limit: Maximum number of scenarios to test
            categories: Specific categories to test
            
        Returns:
            Complete benchmark results
        """
        self.results['metadata']['start_time'] = datetime.now().isoformat()
        
        # Filter scenarios
        scenarios_to_test = self.scenarios
        if categories:
            scenarios_to_test = [
                s for s in scenarios_to_test 
                if s.get('category') in categories
            ]
        if limit:
            scenarios_to_test = scenarios_to_test[:limit]
            
        logger.info(f"Starting benchmark with {len(scenarios_to_test)} scenarios")
        
        # Initialize components
        async with UnghostAPIClient(self.backend_url) as api_client:
            judge = LLMJudge()
            
            # Check backend health
            if not await api_client.health_check():
                logger.error("Backend health check failed")
                self.results['errors'].append({
                    'stage': 'health_check',
                    'error': 'Backend not accessible',
                    'timestamp': datetime.now().isoformat()
                })
                return self.results
                
            # Initialize LLM judge
            if not await judge.initialize():
                logger.error("Failed to initialize LLM judge")
                self.results['errors'].append({
                    'stage': 'judge_init',
                    'error': 'LLM judge initialization failed',
                    'timestamp': datetime.now().isoformat()
                })
                return self.results
                
            # Phase 1: Generate outreach messages
            logger.info("Phase 1: Generating outreach messages...")
            generation_results = await self._generate_messages(
                api_client, 
                scenarios_to_test
            )
            self.results['generations'] = generation_results
            self.results['metadata']['successful_generations'] = len([
                r for r in generation_results 
                if 'error' not in r
            ])
            
            # Phase 2: Evaluate generated messages
            logger.info("Phase 2: Evaluating generated messages...")
            evaluation_results = await judge.batch_evaluate(
                generation_results,
                scenarios_to_test
            )
            self.results['evaluations'] = evaluation_results
            self.results['metadata']['successful_evaluations'] = len([
                r for r in evaluation_results 
                if 'error' not in r and 'parsing_error' not in r
            ])
            
            # Phase 3: Calculate aggregate scores
            logger.info("Phase 3: Calculating aggregate scores...")
            self.results['aggregate_scores'] = judge.calculate_aggregate_scores(
                evaluation_results
            )
            
        self.results['metadata']['end_time'] = datetime.now().isoformat()
        
        # Calculate total benchmark time
        start = datetime.fromisoformat(self.results['metadata']['start_time'])
        end = datetime.fromisoformat(self.results['metadata']['end_time'])
        self.results['metadata']['total_duration_seconds'] = (end - start).total_seconds()
        
        return self.results
        
    async def _generate_messages(
        self,
        api_client: UnghostAPIClient,
        scenarios: List[Dict]
    ) -> List[Dict]:
        """Generate messages for all scenarios."""
        results = []
        
        for i, scenario in enumerate(scenarios):
            logger.info(f"Generating message {i+1}/{len(scenarios)}: {scenario['id']}")
            
            try:
                result = await api_client.generate_outreach(scenario)
                results.append(result)
                
                # Log preview
                message_preview = result.get('generated_message', '')[:100]
                logger.info(f"Generated: {message_preview}...")
                
            except Exception as e:
                logger.error(f"Error generating message for {scenario['id']}: {e}")
                results.append({
                    'scenario_id': scenario['id'],
                    'use_case': scenario['use_case'],
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                })
                
            # Rate limiting
            await asyncio.sleep(2)
            
        return results
        
    def save_results(self, output_dir: str = "benchmark_results"):
        """Save benchmark results to files."""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Create timestamp for filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save raw results as JSON
        results_file = output_path / f"benchmark_results_{timestamp}.json"
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved raw results to {results_file}")
        
        # Generate and save reports
        reporter = BenchmarkReportGenerator()
        
        # Markdown report
        md_report = reporter.generate_markdown_report(self.results)
        md_file = output_path / f"benchmark_report_{timestamp}.md"
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(md_report)
        logger.info(f"Saved markdown report to {md_file}")
        
        # HTML report
        html_report = reporter.generate_html_report(self.results)
        html_file = output_path / f"benchmark_report_{timestamp}.html"
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_report)
        logger.info(f"Saved HTML report to {html_file}")
        
        return {
            'results_file': str(results_file),
            'markdown_report': str(md_file),
            'html_report': str(html_file)
        }


async def main():
    """Main entry point for the benchmark runner."""
    parser = argparse.ArgumentParser(
        description="Run benchmark tests for Unghost outreach system"
    )
    parser.add_argument(
        '--backend-url',
        default='http://localhost:8000',
        help='Backend server URL'
    )
    parser.add_argument(
        '--scenarios',
        nargs='+',
        help='Specific scenario IDs to test'
    )
    parser.add_argument(
        '--categories',
        nargs='+',
        help='Specific categories to test'
    )
    parser.add_argument(
        '--limit',
        type=int,
        help='Maximum number of scenarios to test'
    )
    parser.add_argument(
        '--output-dir',
        default='benchmark_results',
        help='Output directory for results'
    )
    
    args = parser.parse_args()
    
    # Print banner
    print("\n" + "="*60)
    print("🚀 Unghost Outreach Benchmark System")
    print("="*60 + "\n")
    
    # Create and configure runner
    runner = OutreachBenchmarkRunner(
        backend_url=args.backend_url
    )
    
    # Load scenarios
    if not runner.load_scenarios(args.scenarios):
        print("❌ Failed to load test scenarios")
        return
        
    # Run benchmark
    print(f"🔧 Backend URL: {args.backend_url}")
    print(f"📊 Total scenarios: {len(runner.scenarios)}")
    print("\nStarting benchmark...\n")
    
    results = await runner.run_benchmark(
        limit=args.limit,
        categories=args.categories
    )
    
    # Print summary
    print("\n" + "="*60)
    print("📈 Benchmark Summary")
    print("="*60)
    print(f"Total scenarios tested: {results['metadata']['total_scenarios']}")
    print(f"Successful generations: {results['metadata']['successful_generations']}")
    print(f"Successful evaluations: {results['metadata']['successful_evaluations']}")
    
    if 'aggregate_scores' in results and 'overall_average' in results['aggregate_scores']:
        print(f"Overall average score: {results['aggregate_scores']['overall_average']:.2f}/5.0")
        
    print(f"Total duration: {results['metadata'].get('total_duration_seconds', 0):.1f} seconds")
    
    # Save results
    print("\n💾 Saving results...")
    saved_files = runner.save_results(args.output_dir)
    
    print("\n✅ Benchmark complete!")
    print(f"📄 Results saved to:")
    for file_type, file_path in saved_files.items():
        print(f"   - {file_type}: {file_path}")


if __name__ == "__main__":
    asyncio.run(main())