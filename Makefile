.PHONY: help install setup dev test lint format clean build run stop logs

# ═══════════════════════════════════════════════════════════════
# ELOKO Backend — Makefile
# ═══════════════════════════════════════════════════════════════

help:
	@echo "╔═══════════════════════════════════════════════════════╗"
	@echo "║ ELOKO Backend — Development Commands                ║"
	@echo "╠═══════════════════════════════════════════════════════╣"
	@echo "║ Setup & Installation                                 ║"
	@echo "║   make setup        - Complete setup (Python 3.14+) ║"
	@echo "║   make install      - Install dependencies only     ║"
	@echo "║                                                       ║"
	@echo "║ Development                                          ║"
	@echo "║   make dev          - Run dev server (auto-reload)  ║"
	@echo "║   make dev-docker   - Run dev server in Docker      ║"
	@echo "║                                                       ║"
	@echo "║ Testing & Quality                                    ║"
	@echo "║   make test         - Run pytest                     ║"
	@echo "║   make test-cov     - Run tests with coverage       ║"
	@echo "║   make lint         - Run flake8 & mypy             ║"
	@echo "║   make format       - Format code with black        ║"
	@echo "║   make format-check - Check formatting              ║"
	@echo "║                                                       ║"
	@echo "║ Docker & Deployment                                  ║"
	@echo "║   make build        - Build Docker image            ║"
	@echo "║   make run          - Run in Docker                 ║"
	@echo "║   make stop         - Stop Docker containers        ║"
	@echo "║   make logs         - View Docker logs              ║"
	@echo "║                                                       ║"
	@echo "║ Utilities                                            ║"
	@echo "║   make clean        - Clean cache & build artifacts ║"
	@echo "║   make requirements - Generate requirements.txt     ║"
	@echo "║   make venv-check   - Verify venv setup             ║"
	@echo "╚═══════════════════════════════════════════════════════╝"

# ─── Setup & Installation ─────────────────────────────────────

setup:
	@echo "🔧 Running complete setup..."
	@python --version
	@if not exist .venv python -m venv .venv
	@.venv\Scripts\activate.bat && \
		python -m pip install --upgrade pip setuptools wheel && \
		pip install -r requirements.txt && \
		echo "✅ Setup complete!"

install:
	@echo "📦 Installing dependencies..."
	@python -m pip install --upgrade pip setuptools wheel
	@pip install -r requirements.txt
	@echo "✅ Dependencies installed!"

venv-check:
	@echo "✓ Python executable:"
	@which python || where python
	@echo "✓ Python version:"
	@python --version
	@echo "✓ Pip version:"
	@pip --version
	@echo "✓ Installed packages:"
	@pip list | grep -E "fastapi|pydantic|sqlalchemy|asyncpg"

# ─── Development ──────────────────────────────────────────────

dev:
	@echo "🚀 Starting development server..."
	@echo "📍 API: http://localhost:8000"
	@echo "📍 Docs: http://localhost:8000/docs"
	@uvicorn app.main:app --reload --port 8000

dev-docker:
	@echo "🐳 Starting development with Docker Compose..."
	@docker-compose up -d
	@echo "✅ Services running!"
	@echo "📍 API: http://localhost:8000"
	@echo "📍 Postgres: localhost:5432"
	@echo "📍 MongoDB: localhost:27017"

# ─── Testing & Quality ────────────────────────────────────────

test:
	@echo "🧪 Running tests..."
	@pytest -v

test-cov:
	@echo "🧪 Running tests with coverage..."
	@pytest --cov=app --cov-report=html --cov-report=term
	@echo "📊 Coverage report: htmlcov/index.html"

lint:
	@echo "🔍 Running linters..."
	@flake8 app/ --max-line-length=100
	@mypy app/ --ignore-missing-imports
	@echo "✅ Linting complete!"

format:
	@echo "🎨 Formatting code with black..."
	@black app/ --line-length=100
	@echo "✅ Formatted!"

format-check:
	@echo "🔍 Checking formatting..."
	@black app/ --check --line-length=100
	@echo "✅ Format check complete!"

# ─── Docker & Deployment ──────────────────────────────────────

build:
	@echo "🏗️  Building Docker image..."
	@docker build -t eloko-backend:latest .
	@echo "✅ Image built!"

run:
	@echo "🐳 Running Docker container..."
	@docker run -p 8000:8000 --env-file .env eloko-backend:latest

stop:
	@echo "⏹️  Stopping Docker services..."
	@docker-compose down
	@echo "✅ Stopped!"

logs:
	@echo "📋 Viewing logs..."
	@docker-compose logs -f eloko_api

# ─── Utilities ────────────────────────────────────────────────

clean:
	@echo "🧹 Cleaning cache & artifacts..."
	@find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete
	@rm -rf .pytest_cache .mypy_cache .coverage htmlcov dist build *.egg-info
	@echo "✅ Cleaned!"

requirements:
	@echo "📝 Generating requirements.txt..."
	@pip freeze > requirements.txt
	@echo "✅ requirements.txt updated!"

# ─── Database ─────────────────────────────────────────────────

migrate:
	@echo "🔄 Running migrations..."
	@alembic upgrade head
	@echo "✅ Migrations complete!"

migrate-create:
	@echo "📝 Creating new migration..."
	@alembic revision --autogenerate -m "$(msg)"

# Default target
.DEFAULT_GOAL := help
