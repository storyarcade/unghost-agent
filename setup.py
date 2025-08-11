#!/usr/bin/env python3
"""
Setup script to help resolve Python environment issues
"""
import sys
import os
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 12):
        print(f"❌ Python 3.12+ required, found {sys.version}")
        print("Please install Python 3.12 or higher")
        return False
    print(f"✅ Python {sys.version} found")
    return True

def check_uv_installation():
    """Check if uv is installed"""
    try:
        result = subprocess.run(["uv", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ uv found: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ uv not found")
    print("Installing uv...")
    try:
        # Install uv using pip
        subprocess.run([sys.executable, "-m", "pip", "install", "uv"], check=True)
        print("✅ uv installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install uv")
        print("Please install uv manually: https://docs.astral.sh/uv/getting-started/installation/")
        return False

def setup_environment():
    """Setup the Python environment"""
    print("🔧 Setting up Python environment...")
    
    try:
        # Use uv to sync dependencies
        subprocess.run(["uv", "sync"], check=True, cwd=Path.cwd())
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_env_files():
    """Check if required configuration files exist"""
    env_file = Path(".env")
    conf_file = Path("conf.yaml")
    
    if not env_file.exists():
        print("⚠️  .env file created from template")
        print("Please edit .env and add your API keys")
    else:
        print("✅ .env file found")
    
    if not conf_file.exists():
        print("⚠️  conf.yaml file created from template")
        print("Please edit conf.yaml and configure your model settings")
    else:
        print("✅ conf.yaml file found")

def main():
    """Main setup function"""
    print("🦌 Unghost Agent Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check uv installation
    if not check_uv_installation():
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        print("⚠️  Environment setup failed, but continuing...")
    
    # Check configuration files
    check_env_files()
    
    print("\n🎉 Setup complete!")
    print("\nNext steps:")
    print("1. Edit .env file and add your API keys")
    print("2. Edit conf.yaml file and configure your model")
    print("3. Run: uv run server.py")

if __name__ == "__main__":
    main()