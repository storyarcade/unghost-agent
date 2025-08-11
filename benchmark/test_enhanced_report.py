#!/usr/bin/env python3
"""Test the enhanced report generator with existing benchmark results."""

import json
from pathlib import Path
from report_generator_improved import EnhancedBenchmarkReportGenerator

def main():
    # Find the most recent benchmark results
    results_dir = Path("benchmark_results")
    if not results_dir.exists():
        print("No benchmark_results directory found")
        return
    
    # Get all JSON result files
    result_files = sorted(results_dir.glob("benchmark_results_*.json"), reverse=True)
    if not result_files:
        print("No benchmark result files found")
        return
    
    # Use the most recent file
    latest_file = result_files[0]
    print(f"Using benchmark results from: {latest_file}")
    
    # Load the results
    with open(latest_file, 'r', encoding='utf-8') as f:
        results = json.load(f)
    
    # Create enhanced reports
    generator = EnhancedBenchmarkReportGenerator()
    
    # Generate markdown report
    print("\nGenerating enhanced markdown report...")
    md_report = generator.generate_markdown_report(results)
    md_file = results_dir / f"enhanced_report_{latest_file.stem.split('_')[-1]}.md"
    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(md_report)
    print(f"[OK] Saved to: {md_file}")
    
    # Generate HTML report
    print("\nGenerating enhanced HTML report...")
    html_report = generator.generate_html_report(results)
    html_file = results_dir / f"enhanced_report_{latest_file.stem.split('_')[-1]}.html"
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_report)
    print(f"[OK] Saved to: {html_file}")
    
    # Print summary of improvements
    print("\n[ENHANCED] Report Features:")
    print("- [OK] Shows full API request configuration")
    print("- [OK] Displays actual prompts sent to the API")
    print("- [OK] Includes generated messages with word/character counts")
    print("- [OK] Shows agent's thought process and planning steps")
    print("- [OK] Provides detailed evaluation breakdowns with justifications")
    print("- [OK] Includes visual progress bars and score comparisons")
    print("- [OK] Offers comparative analysis between test results")
    print("- [OK] Enhanced recommendations based on performance patterns")
    print("\nOpen the HTML file in a browser for the best viewing experience!")

if __name__ == "__main__":
    main()