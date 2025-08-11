#!/usr/bin/env python3
"""
Simple runner script for the Unghost benchmark system.
This provides a quick way to run common benchmark scenarios.
"""

import sys
import subprocess
import argparse
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Quick runner for Unghost benchmark tests"
    )
    parser.add_argument(
        '--quick',
        action='store_true',
        help='Run a quick test with only 3 scenarios'
    )
    parser.add_argument(
        '--category',
        choices=['professional_networking', 'b2b_sales', 'fundraising', 'influencer_outreach'],
        help='Test a specific category'
    )
    parser.add_argument(
        '--full',
        action='store_true',
        help='Run full benchmark suite (default)'
    )
    
    args = parser.parse_args()
    
    # Build command
    cmd = [sys.executable, "benchmark_runner.py"]
    
    if args.quick:
        cmd.extend(["--limit", "3"])
    elif args.category:
        cmd.extend(["--categories", args.category])
    # Full is default, no additional args needed
    
    # Change to benchmark directory
    benchmark_dir = Path(__file__).parent
    
    print("🚀 Starting Unghost Benchmark...")
    print(f"📂 Working directory: {benchmark_dir}")
    print(f"🔧 Command: {' '.join(cmd)}")
    print("-" * 60)
    
    # Run the benchmark
    try:
        subprocess.run(cmd, cwd=benchmark_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Benchmark failed with error code: {e.returncode}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Benchmark interrupted by user")
        sys.exit(1)


if __name__ == "__main__":
    main()