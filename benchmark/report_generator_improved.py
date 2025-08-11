#!/usr/bin/env python3
"""
Enhanced Report Generator for Benchmark Results

Generates comprehensive reports with request/response details, analysis,
and visual comparisons.
"""

import json
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path
import html as html_module


class EnhancedBenchmarkReportGenerator:
    """Generate enhanced reports from benchmark results."""
    
    def generate_markdown_report(self, results: Dict) -> str:
        """Generate a comprehensive markdown report with request/response details."""
        report = []
        
        # Header
        report.append("# 🚀 Unghost Outreach Benchmark Report")
        report.append("")
        report.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"**Backend URL:** {results['metadata']['backend_url']}")
        report.append(f"**Total Duration:** {results['metadata'].get('total_duration_seconds', 0):.1f} seconds")
        report.append("")
        
        # Executive Summary
        report.append("## 📊 Executive Summary")
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
        
        # Quick Stats Dashboard
        report.append("## 📈 Quick Stats Dashboard")
        report.append("")
        report.append("| Metric | Value | Status |")
        report.append("|--------|-------|--------|")
        
        # Calculate success metrics
        success_rate = self._percentage(metadata['successful_evaluations'], metadata['total_scenarios'])
        status_emoji = "✅" if success_rate >= 80 else "⚠️" if success_rate >= 50 else "❌"
        report.append(f"| Success Rate | {success_rate}% | {status_emoji} |")
        
        # Performance metrics
        gen_times = [g.get('generation_time', 0) for g in results.get('generations', []) if 'error' not in g]
        if gen_times:
            avg_time = sum(gen_times) / len(gen_times)
            time_emoji = "🚀" if avg_time < 10 else "⏱️" if avg_time < 20 else "🐌"
            report.append(f"| Avg Generation Time | {avg_time:.2f}s | {time_emoji} |")
        
        # Score overview
        if 'aggregate_scores' in results and 'overall_average' in results['aggregate_scores']:
            score = results['aggregate_scores']['overall_average']
            score_emoji = "🌟" if score >= 4.5 else "👍" if score >= 4.0 else "📊" if score >= 3.0 else "📉"
            report.append(f"| Overall Quality Score | {score:.2f}/5.0 | {score_emoji} |")
        
        report.append("")
        
        # API Request Configuration
        report.append("## 🔧 API Request Configuration")
        report.append("")
        report.append("```json")
        report.append("{")
        report.append('  "endpoint": "/api/chat/stream",')
        report.append('  "method": "POST",')
        report.append('  "timeout": 120,')
        report.append('  "payload_template": {')
        report.append('    "messages": [{"role": "user", "content": "<personalized_prompt>"}],')
        report.append('    "user_background": "<sender_background>",')
        report.append('    "enable_background_investigation": true,')
        report.append('    "max_plan_iterations": 1,')
        report.append('    "max_step_num": 3,')
        report.append('    "max_search_results": 3,')
        report.append('    "auto_accepted_plan": true,')
        report.append('    "report_style": "friendly"')
        report.append('  }')
        report.append("}")
        report.append("```")
        report.append("")
        
        # Aggregate Scores by Criteria
        if 'aggregate_scores' in results and 'criteria_averages' in results['aggregate_scores']:
            report.append("## 📊 Evaluation Criteria Analysis")
            report.append("")
            report.append("| Criterion | Score | Visual | Weight | Impact |")
            report.append("|-----------|-------|--------|--------|--------|")
            
            # Get weights from evaluation criteria
            weights = {
                'personalization': 0.20,
                'goal_alignment': 0.15,
                'tone_appropriateness': 0.15,
                'clarity_readability': 0.10,
                'cta_effectiveness': 0.15,
                'authenticity': 0.15,
                'relevance': 0.10
            }
            
            for criterion, score in results['aggregate_scores']['criteria_averages'].items():
                weight = weights.get(criterion, 0.10)
                impact = score * weight
                visual = self._create_visual_bar(score, 5)
                report.append(f"| {criterion.replace('_', ' ').title()} | {score:.2f}/5.0 | {visual} | {weight*100:.0f}% | {impact:.2f} |")
            
            report.append("")
        
        # Detailed Test Results
        report.append("## 🔍 Detailed Test Results")
        report.append("")
        
        # Match generations with evaluations
        generations = {g['scenario_id']: g for g in results.get('generations', []) if 'scenario_id' in g}
        evaluations = {e['scenario_id']: e for e in results.get('evaluations', []) if 'scenario_id' in e}
        
        # Load test scenarios for context
        try:
            scenarios_path = Path(__file__).parent / "test_scenarios.json"
            with open(scenarios_path, 'r', encoding='utf-8') as f:
                scenario_data = json.load(f)
                scenarios = {s['id']: s for s in scenario_data.get('scenarios', [])}
        except:
            scenarios = {}
        
        test_num = 1
        for scenario_id in sorted(set(list(generations.keys()) + list(evaluations.keys()))):
            gen_data = generations.get(scenario_id, {})
            eval_data = evaluations.get(scenario_id, {})
            scenario = scenarios.get(scenario_id, {})
            
            if 'error' in gen_data or 'error' in eval_data:
                continue
            
            report.append(f"### Test #{test_num}: {gen_data.get('use_case', 'Unknown')} ({scenario_id})")
            report.append("")
            
            # Test Context
            report.append("#### 📋 Test Context")
            report.append("")
            
            if scenario:
                recipient = scenario.get('recipient', {})
                sender = scenario.get('sender', {})
                
                report.append("**Target Recipient:**")
                report.append(f"- **Name:** {recipient.get('name', 'N/A')}")
                report.append(f"- **Role:** {recipient.get('role', 'N/A')} at {recipient.get('company', 'N/A')}")
                report.append(f"- **Recent Activity:** {recipient.get('recent_activity', 'N/A')}")
                report.append(f"- **Interests:** {', '.join(recipient.get('interests', []))}")
                report.append("")
                
                report.append("**Sender Profile:**")
                report.append(f"- **Objective:** {sender.get('objective', 'N/A')}")
                report.append(f"- **Value Proposition:** {sender.get('value_proposition', 'N/A')}")
                report.append("")
            
            # Request Details
            report.append("#### 📤 Request Details")
            report.append("")
            report.append("<details>")
            report.append("<summary>Click to expand request prompt</summary>")
            report.append("")
            report.append("```")
            # Reconstruct the prompt that was sent
            if scenario:
                report.append(self._reconstruct_prompt(scenario))
            report.append("```")
            report.append("")
            report.append("</details>")
            report.append("")
            
            # Generated Response
            report.append("#### 📥 Generated Response")
            report.append("")
            
            if 'generated_message' in gen_data:
                report.append("**Final Outreach Message:**")
                report.append("```")
                report.append(gen_data['generated_message'])
                report.append("```")
                report.append("")
                
                # Message stats
                message = gen_data['generated_message']
                word_count = len(message.split())
                char_count = len(message)
                report.append(f"📏 **Message Stats:** {word_count} words, {char_count} characters")
                report.append(f"⏱️ **Generation Time:** {gen_data.get('generation_time', 0):.2f} seconds")
                report.append("")
            
            # Evaluation Results
            if eval_data and 'scores' in eval_data:
                report.append("#### 📊 Evaluation Results")
                report.append("")
                
                # Overall score with visual
                if 'overall_score' in eval_data:
                    score = eval_data['overall_score']
                    report.append(f"**Overall Score:** {score:.2f}/5.0 {self._create_visual_bar(score, 5)} ({self._score_grade(score)})")
                    report.append("")
                
                # Detailed scores table
                report.append("| Criterion | Score | Justification |")
                report.append("|-----------|-------|---------------|")
                
                scores = eval_data.get('scores', {})
                justifications = eval_data.get('justifications', {})
                
                for criterion in ['personalization', 'goal_alignment', 'tone_appropriateness', 
                               'clarity_readability', 'cta_effectiveness', 'authenticity', 'relevance']:
                    if criterion in scores:
                        score = scores[criterion]
                        justification = justifications.get(criterion, 'N/A')
                        # Truncate long justifications
                        if len(justification) > 100:
                            justification = justification[:97] + "..."
                        report.append(f"| {criterion.replace('_', ' ').title()} | {score}/5 | {justification} |")
                
                report.append("")
                
                # Expected elements check
                if 'expected_elements_present' in eval_data:
                    report.append("**Expected Elements Check:**")
                    elements = eval_data['expected_elements_present']
                    present = sum(1 for v in elements.values() if v)
                    total = len(elements)
                    report.append(f"- ✅ Present: {present}/{total}")
                    
                    for element, is_present in elements.items():
                        emoji = "✅" if is_present else "❌"
                        report.append(f"  - {emoji} {element.replace('_', ' ').title()}")
                    report.append("")
                
                # Strengths and improvements
                if 'strengths' in eval_data:
                    report.append("**💪 Strengths:**")
                    for strength in eval_data['strengths'][:3]:  # Limit to top 3
                        report.append(f"- {strength}")
                    report.append("")
                
                if 'improvements' in eval_data:
                    report.append("**🔧 Areas for Improvement:**")
                    for improvement in eval_data['improvements'][:3]:  # Limit to top 3
                        report.append(f"- {improvement}")
                    report.append("")
            
            # Agent's Thought Process (if available)
            if 'full_response' in gen_data:
                report.append("#### 🤔 Agent's Thought Process")
                report.append("")
                report.append("<details>")
                report.append("<summary>Click to see agent's planning and reasoning</summary>")
                report.append("")
                report.append("```")
                # Extract thought process from full response
                full_response = gen_data['full_response']
                if '"thought":' in full_response:
                    try:
                        response_json = json.loads(full_response.split('\n')[0])
                        report.append(f"**Thought:** {response_json.get('thought', 'N/A')}")
                        report.append("")
                        report.append("**Planning Steps:**")
                        for i, step in enumerate(response_json.get('steps', []), 1):
                            report.append(f"{i}. **{step.get('title', 'N/A')}**")
                            report.append(f"   - {step.get('description', 'N/A')}")
                    except:
                        report.append("(Unable to parse agent thought process)")
                report.append("```")
                report.append("</details>")
                report.append("")
            
            report.append("---")
            report.append("")
            test_num += 1
        
        # Comparative Analysis
        if len(evaluations) > 1:
            report.append("## 📊 Comparative Analysis")
            report.append("")
            
            # Best and worst performing
            scored_evals = [(e['scenario_id'], e['overall_score']) 
                          for e in evaluations.values() 
                          if 'overall_score' in e]
            if scored_evals:
                scored_evals.sort(key=lambda x: x[1], reverse=True)
                
                report.append("**🏆 Top Performers:**")
                for scenario_id, score in scored_evals[:3]:
                    use_case = evaluations[scenario_id].get('use_case', 'Unknown')
                    report.append(f"1. **{use_case}** ({scenario_id}): {score:.2f}/5.0")
                report.append("")
                
                if len(scored_evals) > 3:
                    report.append("**📉 Needs Improvement:**")
                    for scenario_id, score in scored_evals[-3:]:
                        use_case = evaluations[scenario_id].get('use_case', 'Unknown')
                        report.append(f"1. **{use_case}** ({scenario_id}): {score:.2f}/5.0")
                    report.append("")
        
        # Recommendations
        report.append("## 💡 Recommendations")
        report.append("")
        report.extend(self._generate_enhanced_recommendations(results))
        
        # Technical Details
        report.append("## 🔧 Technical Details")
        report.append("")
        report.append("**Benchmark Configuration:**")
        report.append("- LLM Judge: Gemini 2.0 Flash (Experimental)")
        report.append("- Evaluation Criteria: 7 weighted factors")
        report.append("- Timeout: 120 seconds per generation")
        report.append("- Rate Limiting: 2 seconds between requests")
        report.append("")
        
        return "\n".join(report)
    
    def generate_html_report(self, results: Dict) -> str:
        """Generate an enhanced HTML report with better visualizations."""
        html = []
        
        # HTML header with enhanced CSS
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f7fa;
        }
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        h1, h2, h3, h4 {
            color: #2c3e50;
            margin-top: 2em;
        }
        h1 {
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .metric-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 25px;
            border-radius: 10px;
            margin: 15px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .metric-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            text-align: center;
            transition: transform 0.2s;
        }
        .metric-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #3498db;
            margin: 10px 0;
        }
        .metric-label {
            color: #7f8c8d;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .score-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 25px;
            font-weight: bold;
            color: white;
            font-size: 0.9em;
        }
        .score-excellent { background: linear-gradient(135deg, #27ae60, #2ecc71); }
        .score-good { background: linear-gradient(135deg, #2980b9, #3498db); }
        .score-average { background: linear-gradient(135deg, #f39c12, #f1c40f); }
        .score-poor { background: linear-gradient(135deg, #c0392b, #e74c3c); }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            border-radius: 8px;
            overflow: hidden;
        }
        th, td {
            padding: 15px;
            text-align: left;
        }
        th {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #e8f4f8;
        }
        .progress-bar {
            width: 100%;
            height: 24px;
            background-color: #ecf0f1;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #3498db, #2980b9);
            transition: width 0.3s ease;
            position: relative;
        }
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 0.85em;
        }
        .test-result {
            background: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 25px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .message-box {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            line-height: 1.8;
            white-space: pre-wrap;
        }
        .context-box {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .stats-row {
            display: flex;
            gap: 20px;
            margin: 15px 0;
            flex-wrap: wrap;
        }
        .stat-item {
            background: white;
            padding: 10px 20px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }
        details {
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
        }
        summary {
            font-weight: bold;
            color: #2c3e50;
            outline: none;
        }
        .emoji {
            font-size: 1.2em;
            margin-right: 5px;
        }
        .visual-bar {
            display: inline-block;
            width: 150px;
            height: 20px;
            background: #ecf0f1;
            border-radius: 10px;
            overflow: hidden;
            vertical-align: middle;
            margin-left: 10px;
        }
        .visual-fill {
            height: 100%;
            background: linear-gradient(135deg, #3498db, #2980b9);
        }
    </style>
</head>
<body>
    <div class="container">
""")
        
        # Header
        html.append("<h1>🚀 Unghost Outreach Benchmark Report</h1>")
        html.append(f"<p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>")
        html.append(f"<p><strong>Backend URL:</strong> {results['metadata']['backend_url']}</p>")
        
        # Executive Summary with metric cards
        html.append("<h2>📊 Executive Summary</h2>")
        html.append('<div class="metric-grid">')
        
        metadata = results['metadata']
        
        # Success Rate Card
        success_rate = self._percentage(metadata['successful_evaluations'], metadata['total_scenarios'])
        html.append('<div class="metric-box">')
        html.append('<div class="metric-label">Success Rate</div>')
        html.append(f'<div class="metric-value">{success_rate}%</div>')
        html.append('</div>')
        
        # Overall Score Card
        if 'aggregate_scores' in results and 'overall_average' in results['aggregate_scores']:
            score = results['aggregate_scores']['overall_average']
            html.append('<div class="metric-box">')
            html.append('<div class="metric-label">Overall Score</div>')
            html.append(f'<div class="metric-value">{score:.2f}</div>')
            html.append(f'<span class="score-badge {self._score_class(score)}">{self._score_grade(score)}</span>')
            html.append('</div>')
        
        # Generation Time Card
        gen_times = [g.get('generation_time', 0) for g in results.get('generations', []) if 'error' not in g]
        if gen_times:
            avg_time = sum(gen_times) / len(gen_times)
            html.append('<div class="metric-box">')
            html.append('<div class="metric-label">Avg Generation Time</div>')
            html.append(f'<div class="metric-value">{avg_time:.1f}s</div>')
            html.append('</div>')
        
        # Total Tests Card
        html.append('<div class="metric-box">')
        html.append('<div class="metric-label">Tests Run</div>')
        html.append(f'<div class="metric-value">{metadata["total_scenarios"]}</div>')
        html.append('</div>')
        
        html.append('</div>') # Close metric-grid
        
        # Evaluation Criteria Scores
        if 'aggregate_scores' in results and 'criteria_averages' in results['aggregate_scores']:
            html.append("<h2>📊 Evaluation Criteria Analysis</h2>")
            html.append("<table>")
            html.append("<tr><th>Criterion</th><th>Score</th><th>Visual</th><th>Weight</th></tr>")
            
            weights = {
                'personalization': 0.20,
                'goal_alignment': 0.15,
                'tone_appropriateness': 0.15,
                'clarity_readability': 0.10,
                'cta_effectiveness': 0.15,
                'authenticity': 0.15,
                'relevance': 0.10
            }
            
            for criterion, score in results['aggregate_scores']['criteria_averages'].items():
                weight = weights.get(criterion, 0.10)
                html.append("<tr>")
                html.append(f"<td>{criterion.replace('_', ' ').title()}</td>")
                html.append(f"<td>{score:.2f}/5.0</td>")
                html.append('<td>')
                html.append('<div class="progress-bar">')
                html.append(f'<div class="progress-fill" style="width: {score*20}%">')
                html.append(f'<span class="progress-text">{score:.1f}</span>')
                html.append('</div>')
                html.append('</div>')
                html.append('</td>')
                html.append(f"<td>{weight*100:.0f}%</td>")
                html.append("</tr>")
            
            html.append("</table>")
        
        # Detailed Test Results
        html.append("<h2>🔍 Detailed Test Results</h2>")
        
        # Match generations with evaluations
        generations = {g['scenario_id']: g for g in results.get('generations', []) if 'scenario_id' in g}
        evaluations = {e['scenario_id']: e for e in results.get('evaluations', []) if 'scenario_id' in e}
        
        test_num = 1
        for scenario_id in sorted(set(list(generations.keys()) + list(evaluations.keys()))):
            gen_data = generations.get(scenario_id, {})
            eval_data = evaluations.get(scenario_id, {})
            
            if 'error' in gen_data or 'error' in eval_data:
                continue
            
            html.append('<div class="test-result">')
            
            # Test header
            html.append('<div class="test-header">')
            html.append(f'<h3>Test #{test_num}: {gen_data.get("use_case", "Unknown")}</h3>')
            if 'overall_score' in eval_data:
                score = eval_data['overall_score']
                html.append(f'<span class="score-badge {self._score_class(score)}">{score:.2f}/5.0</span>')
            html.append('</div>')
            
            # Generated Message
            if 'generated_message' in gen_data:
                html.append('<h4>Generated Message:</h4>')
                html.append('<div class="message-box">')
                html.append(html_module.escape(gen_data['generated_message']))
                html.append('</div>')
                
                # Stats
                message = gen_data['generated_message']
                html.append('<div class="stats-row">')
                html.append(f'<div class="stat-item">📏 <strong>Words:</strong> {len(message.split())}</div>')
                html.append(f'<div class="stat-item">🔤 <strong>Characters:</strong> {len(message)}</div>')
                html.append(f'<div class="stat-item">⏱️ <strong>Generation Time:</strong> {gen_data.get("generation_time", 0):.2f}s</div>')
                html.append('</div>')
            
            # Evaluation Details
            if eval_data and 'scores' in eval_data:
                html.append('<h4>Evaluation Breakdown:</h4>')
                html.append('<table>')
                html.append('<tr><th>Criterion</th><th>Score</th><th>Visual</th></tr>')
                
                scores = eval_data.get('scores', {})
                for criterion, score in scores.items():
                    html.append('<tr>')
                    html.append(f'<td>{criterion.replace("_", " ").title()}</td>')
                    html.append(f'<td>{score}/5</td>')
                    html.append('<td>')
                    html.append(f'<div class="visual-bar"><div class="visual-fill" style="width: {score*20}%"></div></div>')
                    html.append('</td>')
                    html.append('</tr>')
                
                html.append('</table>')
            
            html.append('</div>') # Close test-result
            test_num += 1
        
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
    
    def _create_visual_bar(self, value: float, max_value: float) -> str:
        """Create a text-based visual bar."""
        filled = int((value / max_value) * 10)
        empty = 10 - filled
        return "█" * filled + "░" * empty
    
    def _reconstruct_prompt(self, scenario: Dict) -> str:
        """Reconstruct the prompt that was sent to the API."""
        recipient = scenario.get('recipient', {})
        sender = scenario.get('sender', {})
        
        prompt = f"""Create a {scenario.get('use_case', 'outreach')} outreach message with the following context:

RECIPIENT INFORMATION:
- Name: {recipient.get('name', 'N/A')}
- Role: {recipient.get('role', 'N/A')} at {recipient.get('company', 'N/A')}
- Recent Activity: {recipient.get('recent_activity', 'N/A')}
- Interests: {', '.join(recipient.get('interests', []))}
- Profile: {recipient.get('profile_summary', 'N/A')}

SENDER INFORMATION:
- Name: {sender.get('name', 'N/A')}
- Background: {sender.get('background', 'N/A')}
- Company: {sender.get('company', 'N/A')}
- Objective: {sender.get('objective', 'N/A')}
- Value Proposition: {sender.get('value_proposition', 'N/A')}

Please create a personalized outreach message that:
1. References the recipient's recent activity
2. Establishes common ground or mutual interests
3. Clearly communicates the value proposition
4. Includes a specific but low-pressure call-to-action
5. Maintains an authentic, human tone appropriate for {scenario.get('use_case', 'the channel')}

Generate ONLY the message content, without any preamble or explanation."""
        
        return prompt
    
    def _generate_enhanced_recommendations(self, results: Dict) -> List[str]:
        """Generate enhanced recommendations based on results."""
        recommendations = []
        
        if 'aggregate_scores' not in results:
            recommendations.append("- ⚠️ **Complete Testing**: Many tests failed. Focus on fixing API connectivity and error handling.")
            return recommendations
        
        agg = results['aggregate_scores']
        criteria_avg = agg.get('criteria_averages', {})
        
        # Success rate recommendations
        success_rate = self._percentage(
            results['metadata']['successful_evaluations'],
            results['metadata']['total_scenarios']
        )
        
        if success_rate < 50:
            recommendations.append("- 🚨 **Critical**: Low success rate indicates system instability. Prioritize debugging failed generations.")
        elif success_rate < 80:
            recommendations.append("- ⚠️ **Improve Reliability**: Some scenarios are failing. Review error logs and timeout settings.")
        
        # Score-based recommendations
        low_scores = [(k, v) for k, v in criteria_avg.items() if v < 3.5]
        if low_scores:
            recommendations.append("- 📈 **Priority Improvements Needed:**")
            for criterion, score in sorted(low_scores, key=lambda x: x[1]):
                if criterion == 'personalization':
                    recommendations.append(f"  - **Personalization ({score:.2f})**: Enhance recipient research and reference more specific details")
                elif criterion == 'authenticity':
                    recommendations.append(f"  - **Authenticity ({score:.2f})**: Reduce template-like phrases, add natural variations")
                elif criterion == 'cta_effectiveness':
                    recommendations.append(f"  - **CTA Effectiveness ({score:.2f})**: Make calls-to-action clearer and more specific")
                elif criterion == 'relevance':
                    recommendations.append(f"  - **Relevance ({score:.2f})**: Better incorporate current trends and mutual connections")
        
        # Performance recommendations
        gen_times = [g.get('generation_time', 0) for g in results.get('generations', []) if 'error' not in g]
        if gen_times:
            avg_time = sum(gen_times) / len(gen_times)
            if avg_time > 20:
                recommendations.append("- ⏱️ **Optimize Performance**: Average generation time is high. Consider caching or prompt optimization.")
        
        # Excellence maintenance
        high_scores = [(k, v) for k, v in criteria_avg.items() if v >= 4.5]
        if high_scores:
            recommendations.append("- 🌟 **Maintain Excellence In:**")
            for criterion, score in high_scores:
                recommendations.append(f"  - {criterion.replace('_', ' ').title()} ({score:.2f}/5.0)")
        
        # General recommendations
        overall = agg.get('overall_average', 0)
        if overall < 4.0:
            recommendations.append("- 🔬 **A/B Testing**: Implement message variations to identify winning patterns")
            recommendations.append("- 📝 **Prompt Engineering**: Review and refine generation prompts for better quality")
        else:
            recommendations.append("- 🎯 **Scale Testing**: Expand to more diverse scenarios and edge cases")
            recommendations.append("- 📊 **Track Metrics**: Monitor real-world response rates to validate benchmark scores")
        
        return recommendations


# Backwards compatibility
BenchmarkReportGenerator = EnhancedBenchmarkReportGenerator


def test_enhanced_report():
    """Test the enhanced report generator."""
    # Load sample results
    try:
        with open('benchmark_results/benchmark_results_20250718_151405.json', 'r') as f:
            results = json.load(f)
    except:
        print("Could not load sample results file")
        return
    
    generator = EnhancedBenchmarkReportGenerator()
    
    # Generate enhanced markdown report
    md_report = generator.generate_markdown_report(results)
    with open('enhanced_report.md', 'w', encoding='utf-8') as f:
        f.write(md_report)
    print("Enhanced markdown report saved to enhanced_report.md")
    
    # Generate enhanced HTML report
    html_report = generator.generate_html_report(results)
    with open('enhanced_report.html', 'w', encoding='utf-8') as f:
        f.write(html_report)
    print("Enhanced HTML report saved to enhanced_report.html")


if __name__ == "__main__":
    test_enhanced_report()