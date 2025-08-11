# Copyright (c) 2025 Peter Liu
# SPDX-License-Identifier: MIT

"""
Server script for running the Unghost Agent API.
WebContainer-compatible version without signal handling.
"""

import argparse
import logging
import os
import sys
import uvicorn
import warnings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Suppress specific warnings
warnings.filterwarnings("ignore", message="Convert_system_message_to_human will be deprecated")
warnings.filterwarnings("ignore", message=".*missing field.*", module="langchain_google_genai")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


def handle_shutdown():
    """Handle graceful shutdown"""
    logger.info("Starting graceful shutdown...")
    sys.exit(0)


if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Run the Unghost Agent API server")
    parser.add_argument(
        "--reload",
        action="store_true",
        help="Enable auto-reload (default: True except on Windows)",
    )
    parser.add_argument(
        "--host",
        type=str,
        default="localhost",
        help="Host to bind the server to (default: localhost)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.environ.get("BACKEND_PORT", "8000")),
        help="Port to bind the server to (default: BACKEND_PORT env or 8000)",
    )
    parser.add_argument(
        "--log-level",
        type=str,
        default="info",
        choices=["debug", "info", "warning", "error", "critical"],
        help="Log level (default: info)",
    )

    args = parser.parse_args()

    # Determine reload setting
    reload = False
    if args.reload:
        reload = True

    try:
        logger.info(f"Starting Unghost Agent API server on {args.host}:{args.port}")
        logger.info(f"Reload mode: {reload}")
        logger.info(f"Log level: {args.log_level}")
        uvicorn.run(
            "src.server:app",
            host=args.host,
            port=args.port,
            reload=reload,
            log_level=args.log_level,
        )
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        sys.exit(1)
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt. Shutting down...")
        handle_shutdown()