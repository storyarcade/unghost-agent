#!/usr/bin/env python3
"""
Alternative entry point that doesn't require uv
WebContainer-compatible version without signal handling.
"""
import sys
import subprocess
import os
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import langchain
        import langgraph
        print("✅ Core dependencies found")
        return True
    except ImportError as e:
        print(f"❌ Missing dependencies: {e}")
        print("Please run: python -m pip install -r requirements.txt")
        return False

def setup_environment():
    """Setup environment variables"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  .env file not found. Creating from template...")
        env_example = Path(".env.example")
        if env_example.exists():
            with open(env_example, "r") as src, open(env_file, "w") as dst:
                dst.write(src.read())
            print("✅ Created .env file from template")
        else:
            print("⚠️  .env.example file not found. Please create a .env file manually.")
        return False
    
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("✅ Environment loaded from .env file")
    except ImportError:
        print("⚠️  python-dotenv not installed. Environment variables may not be loaded.")
    
    return True

def main():
    """Main entry point"""
    print("👻 Unghost Agent - Alternative Launcher")
    print("=" * 40)
    
    # Setup environment
    setup_environment()
    
    # Check if we should run in interactive mode
    interactive = "--interactive" in sys.argv
    
    # Import and run the main application
    try:
        if interactive:
            print("🚀 Starting in interactive mode...")
            if os.path.exists("main.py"):
                subprocess.run([sys.executable, "main.py", "--interactive"])
            else:
                print("❌ main.py not found")
                sys.exit(1)
        else:
            print("🚀 Starting server mode...")
            if os.path.exists("server.py"):
                subprocess.run([sys.executable, "server.py"])
            else:
                print("❌ server.py not found")
                sys.exit(1)
    except Exception as e:
        print(f"❌ Error running application: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("🛑 Received keyboard interrupt. Shutting down...")
        sys.exit(0)

if __name__ == "__main__":
    main()