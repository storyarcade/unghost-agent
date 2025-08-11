#!/usr/bin/env python3
"""
Report Generator for Benchmark Results

Generates comprehensive reports in multiple formats from benchmark data.
"""

import json
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path


class BenchmarkReportGenerator:
    """Generate reports from benchmark results."""
    
    def generate_markdown_report(self, results: Dict) -> str:
        """Generate a comprehensive markdown report."""
        report = []
        
        # Header
        report.append("# Unghost Outreach Benchmark Report")
        report.append("")
        report.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"**Backend URL:** {results['metadata']['backend_url']}")
        report.append(f"**Total Duration:** {results['metadata'].get('total_duration_seconds', 0):.1f} seconds")
        report.append("")
        
        # Executive Summary
        report.append("## Executive Summary")
        report.append("")
        
        metadata = results['metadata']
        report.append(f"- **Scenarios Tested:** {metadata['total_scenarios']}")
        report.append(f"- **Successful Generations:** {metadata['successful_generations']} ({self._percentage(metadata['successful_generations'], metadata['total_scenarios'])}%)")
        report.append(f"- **Successful Evaluations:** {metadata['successful_evaluations']} ({self._percentage(metadata['successful_evaluations'], metadata['total_scenarios'])}%)")
        
        if 'aggregate_scores' in results:
            agg = results['aggregate_scores']
            if 'overall_average' in agg:
                report.append(f"- **Overall Average Score:** {agg['overall_average']:.2f}/5.0 ({self._score_grade(agg['overall_average'])})")
        
        report.append("")
        
        # Performance Metrics
        report.append("## Performance Metrics")
        report.append("")
        
        # Calculate generation times
        gen_times = [
            g.get('generation_time', 0) 
            for g in results.get('generations', []) 
            if 'error' not in g
        ]
        if gen_times:
            report.append(f"- **Average Generation Time:** {sum(gen_times)/len(gen_times):.2f} seconds")
            report.append(f"- **Min Generation Time:** {min(gen_times):.2f} seconds")
            report.append(f"- **Max Generation Time:** {max(gen_times):.2f} seconds")
        
        report.append("")
        
        # Aggregate Scores by Criteria
        if 'aggregate_scores' in results and 'criteria_averages' in results['aggregate_scores']:
            report.append("## Evaluation Criteria Scores")
            report.append("")
            report.append("| Criterion | Average Score | Grade |")
            report.append("|-----------|---------------|-------|")
            
            for criterion, score in results['aggregate_scores']['criteria_averages'].items():
                report.append(f"| {criterion.replace('_', ' ').title()} | {score:.2f}/5.0 | {self._score_grade(score)} |")
            
            report.append("")
        
        # Scores by Use Case
        if 'aggregate_scores' in results and 'use_case_averages' in results['aggregate_scores']:
            report.append("## Scores by Use Case")
            report.append("")
            report.append("| Use Case | Average Score | Grade |")
            report.append("|----------|---------------|-------|")
            
            for use_case, score in results['aggregate_scores']['use_case_averages'].items():
                report.append(f"| {use_case} | {score:.2f}/5.0 | {self._score_grade(score)} |")
            
            report.append("")
        
        # Detailed Results
        report.append("## Detailed Results")
        report.append("")
        
        evaluations = results.get('evaluations', [])
        for i, eval_data in enumerate(evaluations):
            if 'error' in eval_data or 'parsing_error' in eval_data:
                continue
                
            report.append(f"### {i+1}. {eval_data.get('use_case', 'Unknown')} - {eval_data.get('scenario_id', 'Unknown')}")
            report.append("")
            
            # Overall score
            if 'overall_score' in eval_data:
                report.append(f"**Overall Score:** {eval_data['overall_score']:.2f}/5.0 ({self._score_grade(eval_data['overall_score'])})")
                report.append("")
            
            # Individual scores
            if 'scores' in eval_data:
                report.append("**Detailed Scores:**")
                for criterion, score in eval_data['scores'].items():
                    report.append(f"- {criterion.replace('_', ' ').title()}: {score}/5")
                report.append("")
            
            # Strengths and improvements
            if 'strengths' in eval_data:
                report.append("**Strengths:**")
                for strength in eval_data['strengths']:
                    report.append(f"- {strength}")
                report.append("")
                
            if 'improvements' in eval_data:
                report.append("**Areas for Improvement:**")
                for improvement in eval_data['improvements']:
                    report.append(f"- {improvement}")
                report.append("")
                
            if 'recommendation' in eval_data:
                report.append(f"**Recommendation:** {eval_data['recommendation']}")
                report.append("")
                
            report.append("---")
            report.append("")
        
        # Errors Section
        if results.get('errors'):
            report.append("## Errors Encountered")
            report.append("")
            for error in results['errors']:
                report.append(f"- **Stage:** {error['stage']}")
                report.append(f"  - **Error:** {error['error']}")
                report.append(f"  - **Time:** {error['timestamp']}")
                report.append("")
        
        # Recommendations
        report.append("## Recommendations")
        report.append("")
        report.extend(self._generate_recommendations(results))
        
        return "\n".join(report)
        
    def generate_html_report(self, results: Dict) -> str:
        """Generate an HTML report with visualizations."""
        html = []
        
        # HTML header with embedded CSS
        html.append("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unghost Outreach Benchmark Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        .metric-card {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #3498db;
        }
        .score-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-weight: bold;
            color: white;
        }
        .score-excellent { background-color: #27ae60; }
        .score-good { background-color: #3498db; }
        .score-average { background-color: #f39c12; }
        .score-poor { background-color: #e74c3c; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #3498db;
            color: white;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .chart-container {
            margin: 20px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background-color: #3498db;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
""")
        
        # Header
        html.append(f"<h1>🚀 Unghost Outreach Benchmark Report</h1>")
        html.append(f"<p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>")
        html.append(f"<p><strong>Backend URL:</strong> {results['metadata']['backend_url']}</p>")
        
        # Executive Summary
        html.append("<h2>Executive Summary</h2>")
        html.append('<div class="metric-card">')
        
        metadata = results['metadata']
        overall_score = results.get('aggregate_scores', {}).get('overall_average', 0)
        
        html.append(f"<p><strong>Scenarios Tested:</strong> {metadata['total_scenarios']}</p>")
        html.append(f"<p><strong>Success Rate:</strong> {self._percentage(metadata['successful_evaluations'], metadata['total_scenarios'])}%</p>")
        
        if overall_score > 0:
            score_class = self._score_class(overall_score)
            html.append(f'<p><strong>Overall Score:</strong> <span class="score-badge {score_class}">{overall_score:.2f}/5.0</span></p>')
        
        html.append("</div>")
        
        # Performance Metrics
        html.append("<h2>Performance Metrics</h2>")
        html.append('<div class="metric-card">')
        
        gen_times = [
            g.get('generation_time', 0) 
            for g in results.get('generations', []) 
            if 'error' not in g
        ]
        if gen_times:
            avg_time = sum(gen_times) / len(gen_times)
            html.append(f"<p><strong>Average Generation Time:</strong> {avg_time:.2f} seconds</p>")
            html.append(f"<p><strong>Total Duration:</strong> {results['metadata'].get('total_duration_seconds', 0):.1f} seconds</p>")
        
        html.append("</div>")
        
        # Criteria Scores Table
        if 'aggregate_scores' in results and 'criteria_averages' in results['aggregate_scores']:
            html.append("<h2>Evaluation Criteria Scores</h2>")
            html.append("<table>")
            html.append("<tr><th>Criterion</th><th>Score</th><th>Visual</th></tr>")
            
            for criterion, score in results['aggregate_scores']['criteria_averages'].items():
                html.append("<tr>")
                html.append(f"<td>{criterion.replace('_', ' ').title()}</td>")
                html.append(f"<td>{score:.2f}/5.0</td>")
                html.append(f'<td><div class="progress-bar"><div class="progress-fill" style="width: {score*20}%"></div></div></td>')
                html.append("</tr>")
            
            html.append("</table>")
        
        # Use Case Scores
        if 'aggregate_scores' in results and 'use_case_averages' in results['aggregate_scores']:
            html.append("<h2>Scores by Use Case</h2>")
            html.append("<table>")
            html.append("<tr><th>Use Case</th><th>Score</th><th>Grade</th></tr>")
            
            for use_case, score in results['aggregate_scores']['use_case_averages'].items():
                score_class = self._score_class(score)
                html.append("<tr>")
                html.append(f"<td>{use_case}</td>")
                html.append(f"<td>{score:.2f}/5.0</td>")
                html.append(f'<td><span class="score-badge {score_class}">{self._score_grade(score)}</span></td>')
                html.append("</tr>")
            
            html.append("</table>")
        
        # Close HTML
        html.append("""
    </div>
</body>
</html>
""")
        
        return "\n".join(html)
        
    def _percentage(self, part: int, whole: int) -> float:
        """Calculate percentage."""
        if whole == 0:
            return 0.0
        return round((part / whole) * 100, 1)
        
    def _score_grade(self, score: float) -> str:
        """Convert numeric score to letter grade."""
        if score >= 4.5:
            return "Excellent"
        elif score >= 4.0:
            return "Good"
        elif score >= 3.0:
            return "Average"
        elif score >= 2.0:
            return "Below Average"
        else:
            return "Poor"
            
    def _score_class(self, score: float) -> str:
        """Get CSS class for score."""
        if score >= 4.5:
            return "score-excellent"
        elif score >= 4.0:
            return "score-good"
        elif score >= 3.0:
            return "score-average"
        else:
            return "score-poor"
            
    def _generate_recommendations(self, results: Dict) -> List[str]:
        """Generate recommendations based on results."""
        recommendations = []
        
        if 'aggregate_scores' not in results:
            recommendations.append("- Complete evaluation data not available for comprehensive recommendations")
            return recommendations
            
        agg = results['aggregate_scores']
        criteria_avg = agg.get('criteria_averages', {})
        
        # Check for low-scoring criteria
        for criterion, score in criteria_avg.items():
            if score < 3.5:
                if criterion == 'personalization':
                    recommendations.append("- **Improve Personalization**: Messages need more specific references to recipient's recent activities and interests")
                elif criterion == 'authenticity':
                    recommendations.append("- **Enhance Authenticity**: Messages feel too templated. Add more human touches and natural language variations")
                elif criterion == 'cta_effectiveness':
                    recommendations.append("- **Strengthen CTAs**: Calls-to-action need to be clearer and more compelling while remaining low-pressure")
                elif criterion == 'relevance':
                    recommendations.append("- **Increase Relevance**: Better incorporate trending topics and mutual connections into messages")
                    
        # Check use case performance
        use_case_avg = agg.get('use_case_averages', {})
        for use_case, score in use_case_avg.items():
            if score < 3.5:
                recommendations.append(f"- **{use_case} Improvement Needed**: This use case scores below average and needs targeted optimization")
                
        # General recommendations
        overall = agg.get('overall_average', 0)
        if overall < 4.0:
            recommendations.append("- **Consider A/B Testing**: Implement message variations to identify what resonates best with different recipient types")
            recommendations.append("- **Enhance Prompt Templates**: Review and refine the prompts used for message generation")
            
        if not recommendations:
            recommendations.append("- **Maintain Excellence**: Continue current practices while monitoring for consistency")
            recommendations.append("- **Expand Testing**: Consider testing edge cases and new use case categories")
            
        return recommendations


def test_report_generator():
    """Test the report generator with sample data."""
    # Sample results
    sample_results = {
        'metadata': {
            'backend_url': 'http://localhost:8000',
            'total_scenarios': 5,
            'successful_generations': 5,
            'successful_evaluations': 4,
            'total_duration_seconds': 45.2
        },
        'aggregate_scores': {
            'overall_average': 4.2,
            'criteria_averages': {
                'personalization': 4.5,
                'goal_alignment': 4.3,
                'tone_appropriateness': 4.1,
                'clarity_readability': 4.4,
                'cta_effectiveness': 3.8,
                'authenticity': 4.0,
                'relevance': 4.3
            },
            'use_case_averages': {
                'LinkedIn DM': 4.4,
                'Cold Email': 4.1,
                'Twitter DM': 4.0
            }
        },
        'errors': []
    }
    
    generator = BenchmarkReportGenerator()
    
    # Generate markdown report
    md_report = generator.generate_markdown_report(sample_results)
    print("Markdown Report Preview:")
    print("=" * 60)
    print(md_report[:500] + "...")
    
    # Generate HTML report
    html_report = generator.generate_html_report(sample_results)
    
    # Save HTML for viewing
    with open("sample_report.html", "w") as f:
        f.write(html_report)
    print("\nHTML report saved to sample_report.html")


if __name__ == "__main__":
    test_report_generator()