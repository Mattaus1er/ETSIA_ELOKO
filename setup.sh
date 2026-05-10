#!/bin/bash

# ========================================
# ELOKO Backend - Setup Script for Python 3.14
# ========================================

set -e  # Exit on error

echo ""
echo "=== ELOKO Backend Setup (Python 3.14+) ==="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed!"
    echo "Please install Python 3.14 from https://www.python.org/downloads/"
    exit 1
fi

# Display Python version
echo "[INFO] Detected Python version:"
python3 --version
echo ""

# Create virtual environment
echo "[STEP 1] Creating virtual environment..."
if [ -d ".venv" ]; then
    echo "[WARNING] .venv directory already exists. Removing..."
    rm -rf .venv
fi
python3 -m venv .venv
echo "[SUCCESS] Virtual environment created."
echo ""

# Activate virtual environment
echo "[STEP 2] Activating virtual environment..."
source .venv/bin/activate
echo "[SUCCESS] Virtual environment activated."
echo ""

# Upgrade pip, setuptools, and wheel
echo "[STEP 3] Upgrading pip, setuptools, and wheel..."
python -m pip install --upgrade pip setuptools wheel
echo ""

# Install dependencies
echo "[STEP 4] Installing dependencies..."
pip install -r requirements.txt
echo "[SUCCESS] Dependencies installed."
echo ""

# Create .env file if it doesn't exist
echo "[STEP 5] Checking environment configuration..."
if [ ! -f .env ]; then
    echo "[INFO] Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "[WARNING] .env created from .env.example - please configure it!"
    else
        echo "[WARNING] .env.example not found. Creating minimal .env..."
        cat > .env << 'EOF'
SECRET_KEY=your_secret_key_here_change_in_production
DATABASE_URL=postgresql+asyncpg://user:password@localhost/eloko_db
MONGODB_URL=mongodb://localhost:27017/eloko_sessions
EOF
        echo "[WARNING] Minimal .env created - please configure it!"
    fi
else
    echo "[SUCCESS] .env already exists."
fi
echo ""

# Verify installation
echo "[STEP 6] Verifying installation..."
python -c "import fastapi; import pydantic; import sqlalchemy; print('[SUCCESS] Core packages verified!')"
echo ""

# Final message
echo ""
echo "========================================"
echo "[SUCCESS] Setup completed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with database credentials"
echo "2. Run: python -m uvicorn app.main:app --reload --port 8000"
echo "3. Visit: http://localhost:8000/docs"
echo ""
