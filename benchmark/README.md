# Unghost Outreach Benchmark System

A comprehensive benchmark system for testing and evaluating the Unghost outreach message generation system using real LLM calls and automated evaluation.

## Overview

This benchmark system replaces simulation-based testing with actual API calls to the Unghost backend, providing real-world performance metrics and quality evaluation through an LLM judge system.

### Key Features

- **Real LLM Integration**: Makes actual API calls to the backend (port 8000)
- **Automated Evaluation**: Uses LLM judge to score messages on multiple criteria
- **Comprehensive Test Scenarios**: 10 diverse outreach scenarios covering various use cases
- **Detailed Reporting**: Generates both Markdown and HTML reports with visualizations
- **Performance Metrics**: Tracks generation time, success rates, and quality scores

## Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│ Benchmark Runner│────▶│ Backend API  │────▶│ LLM Service │
│                 │     │ (Port 8000)  │     │  (Gemini)   │
└────────┬────────┘     └──────────────┘     └─────────────┘
         │                                            │
         │              ┌──────────────┐             │
         └─────────────▶│  LLM Judge   │◀────────────┘
                        │ (Evaluator)  │
                        └──────┬───────┘
                                │
                        ┌───────▼────────┐
                        │ Report Generator│
                        └────────────────┘
```

## Installation

1. Ensure you're in the unghost-main directory:
```bash
cd C:\Users\Stream\Downloads\unghost-master\unghost-main
```

2. Install required dependencies (if not already installed):
```bash
pip install aiohttp langchain-openai
```

3. Ensure the backend server is running:
```bash
python server.py
```

## Configuration

The system uses the LLM configuration from `conf.yaml`. Currently configured to use:
- **Model**: Gemini 2.0 Flash Lite
- **API Key**: Set via `GEMINI_API_KEY` environment variable

## Usage

### Basic Usage

Run benchmark with default settings (all scenarios):
```bash
python benchmark/benchmark_runner.py
```

### Advanced Options

```bash
# Test specific scenarios
python benchmark/benchmark_runner.py --scenarios linkedin_dm_001 cold_email_003

# Test specific categories
python benchmark/benchmark_runner.py --categories b2b_sales fundraising

# Limit number of tests
python benchmark/benchmark_runner.py --limit 5

# Specify custom backend URL
python benchmark/benchmark_runner.py --backend-url http://localhost:8080

# Custom output directory
python benchmark/benchmark_runner.py --output-dir my_results
```

## Test Scenarios

The benchmark includes 10 comprehensive test scenarios:

1. **LinkedIn DM** - Professional networking outreach
2. **Twitter DM** - Influencer engagement
3. **Cold Email** - B2B sales outreach
4. **Investor Pitch** - Fundraising communication
5. **Partnership Proposal** - Strategic partnerships
6. **Instagram DM** - Influencer collaboration
7. **Newsletter** - Email marketing
8. **Sales Pitch** - Direct sales
9. **Warm Introduction** - Networking with mutual connections
10. **Promotional Email** - Customer promotions

## Evaluation Criteria

Messages are evaluated on 7 criteria (1-5 scale):

- **Personalization** (20% weight): References to recipient's specific details
- **Goal Alignment** (15% weight): Alignment with stated objectives
- **Tone Appropriateness** (15% weight): Suitable tone for channel and context
- **Clarity & Readability** (10% weight): Clear and concise messaging
- **CTA Effectiveness** (15% weight): Clear, actionable next steps
- **Authenticity** (15% weight): Genuine, human-like communication
- **Relevance** (10% weight): References to recent activities/trends

## Output

The benchmark generates three types of output:

1. **Raw Results** (`benchmark_results_[timestamp].json`):
   - Complete test data
   - Generation responses
   - Evaluation scores
   - Error logs

2. **Markdown Report** (`benchmark_report_[timestamp].md`):
   - Executive summary
   - Performance metrics
   - Detailed evaluations
   - Recommendations

3. **HTML Report** (`benchmark_report_[timestamp].html`):
   - Visual dashboard
   - Progress bars for scores
   - Interactive tables
   - Color-coded grades

## Example Output

```
🚀 Unghost Outreach Benchmark System
============================================================

🔧 Backend URL: http://localhost:8000
📊 Total scenarios: 10

Starting benchmark...

Phase 1: Generating outreach messages...
Generating message 1/10: linkedin_dm_001
Generated: Hi Sarah, I noticed your recent post about AI trends...

Phase 2: Evaluating generated messages...
Phase 3: Calculating aggregate scores...

============================================================
📈 Benchmark Summary
============================================================
Total scenarios tested: 10
Successful generations: 10
Successful evaluations: 9
Overall average score: 4.32/5.0
Total duration: 124.5 seconds

💾 Saving results...

✅ Benchmark complete!
📄 Results saved to:
   - results_file: benchmark_results/benchmark_results_20250118_143022.json
   - markdown_report: benchmark_results/benchmark_report_20250118_143022.md
   - html_report: benchmark_results/benchmark_report_20250118_143022.html
```

## Troubleshooting

### Backend Connection Issues
- Ensure the backend is running on port 8000
- Check firewall settings
- Verify the backend URL in the command

### LLM Initialization Errors
- Check that `GEMINI_API_KEY` is set in environment
- Verify API key is valid
- Check internet connectivity

### Timeout Errors
- Default timeout is 120 seconds per message
- Increase if needed in `api_client.py`
- Check backend performance

## Development

### Adding New Test Scenarios

Edit `test_scenarios.json` to add new scenarios:

```json
{
  "id": "new_scenario_001",
  "use_case": "New Use Case",
  "category": "category_name",
  "recipient": {
    "name": "Recipient Name",
    "role": "Role",
    "company": "Company",
    "recent_activity": "Recent activity description",
    "interests": ["Interest 1", "Interest 2"],
    "profile_summary": "Profile summary"
  },
  "sender": {
    "name": "Sender Name",
    "background": "Background description",
    "company": "Company",
    "objective": "Objective description",
    "value_proposition": "Value proposition"
  },
  "expected_elements": [
    "Expected element 1",
    "Expected element 2"
  ],
  "evaluation_weight": 1.0
}
```

### Customizing Evaluation Criteria

Modify the `evaluation_criteria` section in `test_scenarios.json` to adjust weights or add new criteria.

### Extending the API Client

The `api_client.py` can be extended to support additional endpoints or parameters as needed.

## Best Practices

1. **Run During Low Load**: Benchmark during off-peak hours to get consistent results
2. **Multiple Runs**: Run multiple times and average results for reliability
3. **Monitor Resources**: Check CPU/memory usage during tests
4. **Review Failures**: Investigate any failed generations or evaluations
5. **Compare Over Time**: Track scores over time to measure improvements

## Future Enhancements

- [ ] A/B testing support for comparing different prompt strategies
- [ ] Real-time dashboard for monitoring benchmark progress
- [ ] Integration with CI/CD pipelines
- [ ] Automated regression testing
- [ ] Multi-model comparison support
- [ ] Custom evaluation criteria per use case
- [ ] Performance profiling and optimization recommendations

## License

Copyright (c) 2025 Peter Liu
SPDX-License-Identifier: MIT