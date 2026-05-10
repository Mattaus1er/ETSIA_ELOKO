@echo off
REM ========================================
REM ELOKO Backend - Setup Script for Python 3.14
REM ========================================

echo.
echo === ELOKO Backend Setup (Python 3.14+) ===
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.14 from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Display Python version
echo [INFO] Detected Python version:
python --version
echo.

REM Create virtual environment
echo [STEP 1] Creating virtual environment...
if exist .venv (
    echo [WARNING] .venv directory already exists. Removing...
    rmdir /s /q .venv
)
python -m venv .venv
if errorlevel 1 (
    echo [ERROR] Failed to create virtual environment!
    pause
    exit /b 1
)
echo [SUCCESS] Virtual environment created.
echo.

REM Activate virtual environment
echo [STEP 2] Activating virtual environment...
call .venv\Scripts\activate.bat
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment!
    pause
    exit /b 1
)
echo [SUCCESS] Virtual environment activated.
echo.

REM Upgrade pip, setuptools, and wheel
echo [STEP 3] Upgrading pip, setuptools, and wheel...
python -m pip install --upgrade pip setuptools wheel
if errorlevel 1 (
    echo [WARNING] Failed to upgrade pip components, continuing anyway...
)
echo.

REM Install dependencies
echo [STEP 4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed.
echo.

REM Create .env file if it doesn't exist
echo [STEP 5] Checking environment configuration...
if not exist .env (
    echo [INFO] Creating .env from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo [WARNING] .env created from .env.example - please configure it!
    ) else (
        echo [WARNING] .env.example not found. Creating minimal .env...
        (
            echo SECRET_KEY=your_secret_key_here_change_in_production
            echo DATABASE_URL=postgresql+asyncpg://user:password@localhost/eloko_db
            echo MONGODB_URL=mongodb://localhost:27017/eloko_sessions
        ) > .env
        echo [WARNING] Minimal .env created - please configure it!
    )
) else (
    echo [SUCCESS] .env already exists.
)
echo.

REM Verify installation
echo [STEP 6] Verifying installation...
python -c "import fastapi; import pydantic; import sqlalchemy; print('[SUCCESS] Core packages verified!')"
if errorlevel 1 (
    echo [ERROR] Verification failed!
    pause
    exit /b 1
)
echo.

REM Final message
echo.
echo ========================================
echo [SUCCESS] Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your .env file with database credentials
echo 2. Run: python -m uvicorn app.main:app --reload --port 8000
echo 3. Visit: http://localhost:8000/docs
echo.
pause
