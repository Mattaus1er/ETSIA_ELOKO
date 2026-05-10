# Développement — Guide des contributeurs

## 🎯 Stack de développement

- **Language**: Python 3.14+
- **Framework**: FastAPI 0.115+
- **Database**: PostgreSQL 16 + asyncpg
- **ORM**: SQLAlchemy 2.0+
- **Validation**: Pydantic 2.11+
- **Testing**: pytest + pytest-asyncio
- **Code Quality**: black, flake8, mypy

---

## 🚀 Setup développeur

```bash
# 1. Clone le repo
git clone https://github.com/eloko/backend.git
cd eloko-backend

# 2. Setup automatique (Windows)
setup.bat

# 2. Setup automatique (Unix/Mac)
chmod +x setup.sh
./setup.sh

# 3. Configurer .env
cp .env.example .env
# Éditer .env
```

---

## 📂 Structure du projet

```
app/
├── api/
│   ├── v1/               # Routes API v1
│   │   ├── auth.py      # Authentification & OTP
│   │   └── users.py     # Gestion utilisateurs
│   └── gateway/         # Proxy vers modules internes
│       ├── market.py
│       ├── collection.py
│       └── prediction.py
│
├── core/
│   ├── security.py      # JWT, OTP, bcrypt
│   └── i18n.py         # Internationalization
│
├── models/              # Modèles SQLAlchemy
├── schemas/             # Schémas Pydantic
├── services/            # Logique métier
├── locales/             # Fichiers i18n (JSON)
│
├── main.py             # Point d'entrée FastAPI
└── config.py           # Configuration (Pydantic Settings)
```

---

## 💻 Commandes courantes

```bash
# Démarrer le serveur (auto-reload)
make dev
# ou
uvicorn app.main:app --reload --port 8000

# Lancer les tests
make test

# Vérifier la qualité du code
make lint

# Formater le code
make format

# Docker development
make dev-docker

# Voir tous les commands
make help
```

---

## 🧪 Tests

### Structure

```
tests/
├── unit/
│   ├── test_auth.py
│   ├── test_users.py
│   └── test_security.py
├── integration/
│   ├── test_api_auth.py
│   └── test_api_users.py
└── conftest.py         # Fixtures pytest
```

### Écrire un test

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_auth_register_success(db_session):
    """Test inscription valide"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@eloko.africa",
            "password": "SecurePass123!",
            "first_name": "John",
            "last_name": "Doe"
        }
    )
    assert response.status_code == 201
```

### Lancer les tests

```bash
# Tous les tests
pytest

# Avec coverage
pytest --cov=app --cov-report=html

# Un seul fichier
pytest tests/unit/test_auth.py

# Un seul test
pytest tests/unit/test_auth.py::test_login_success

# Verbeux
pytest -v

# Avec logs
pytest -s
```

---

## 🔍 Qualité du code

### Linter (flake8)

```bash
# Vérifier
flake8 app/ --max-line-length=100

# Configuration: .flake8 ou pyproject.toml
```

### Type checking (mypy)

```bash
# Vérifier
mypy app/ --ignore-missing-imports

# Configuration: pyproject.toml
```

### Formatting (black)

```bash
# Formater
black app/ --line-length=100

# Vérifier (sans modifier)
black app/ --check --line-length=100

# Faire du diff
black app/ --diff
```

### Pre-commit hook

```bash
pip install pre-commit
pre-commit install

# Exécute automatiquement avant chaque commit
```

---

## 📝 Conventions

### Nommage

```python
# Classes
class UserRepository:
    pass

# Fonctions/Méthodes
def get_user_by_email(email: str) -> User:
    pass

async def authenticate_user(email: str, password: str) -> Token:
    pass

# Constantes
MAX_LOGIN_ATTEMPTS = 5
JWT_ALGORITHM = "HS256"

# Variables privées
_internal_counter = 0
```

### Type hints

```python
from typing import Optional, List
from fastapi import HTTPException
from pydantic import BaseModel

def process_users(users: List[User]) -> Optional[Dict[str, Any]]:
    """Process a list of users."""
    pass

async def fetch_data(user_id: int) -> User:
    """Fetch user data asynchronously."""
    pass
```

### Docstrings

```python
def calculate_age(birth_date: datetime) -> int:
    """
    Calculate age from birth date.
    
    Args:
        birth_date: Date of birth
        
    Returns:
        Age in years
        
    Raises:
        ValueError: If birth_date is in the future
    """
    pass
```

### Import order

```python
# 1. Standard library
import os
from datetime import datetime
from typing import List, Optional

# 2. Third-party libraries
from fastapi import FastAPI, HTTPException
from sqlalchemy import Column, String
from pydantic import BaseModel, Field

# 3. Local imports
from app.config import settings
from app.core.security import verify_password
```

---

## 🐛 Debugging

### Logs

```python
import logging

logger = logging.getLogger(__name__)

logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
logger.exception("Exception with traceback")
```

### VS Code Debugger

1. Ajouter un breakpoint (clic sur la ligne)
2. Commande: `Debug: Start Debugging` (F5)
3. Utiliser la barre de débogage

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["app.main:app", "--reload", "--port", "8000"],
      "jinja": true,
      "justMyCode": true
    }
  ]
}
```

### REPL Python

```bash
python
>>> from app.config import settings
>>> from app.models import User
>>> # Tesser en interactif
```

---

## 🔄 Git & PR

### Branches

```bash
# Convention: feature/*, fix/*, docs/*, chore/*
git checkout -b feature/new-auth-flow
git checkout -b fix/password-reset-bug
```

### Commits

```bash
# Format: [TYPE] Message concis

# Types:
# - feat: Nouvelle feature
# - fix: Bug fix
# - docs: Documentation
# - style: Formatting
# - refactor: Refactorisation (pas de feat/fix)
# - test: Tests
# - chore: Dependencies, config

git commit -m "feat: Add OTP validation for 2FA"
git commit -m "fix: Resolve async database connection leak"
```

### Pull Request

1. Fork & branch
2. Commit les changements
3. Push to fork
4. Créer une PR avec description détaillée
5. Passer les tests CI
6. Code review & merge

---

## 📦 Ajouter une dépendance

```bash
# Ajouter à requirements.txt manuellement
# Ou:
pip install new-package
pip freeze > requirements.txt

# Tester que tout fonctionne
pytest

# Commit
git add requirements.txt pyproject.toml
git commit -m "chore: Add new-package>=1.0.0"
```

---

## 🚀 Déploiement local (Docker)

```bash
# Build
docker build -t eloko-backend:latest .

# Run
docker run -p 8000:8000 --env-file .env eloko-backend:latest

# Docker Compose (recommandé)
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

## 📚 Ressources utiles

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org)
- [Pydantic Docs](https://docs.pydantic.dev)
- [Python Async](https://docs.python.org/3/library/asyncio.html)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## ❓ FAQ

### Comment ajouter une nouvelle route?

```python
# app/api/v1/my_routes.py
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/my", tags=["My Routes"])

@router.get("/items")
async def list_items(skip: int = 0, limit: int = 10):
    """List all items"""
    return {"items": []}

# app/main.py
from app.api.v1 import my_routes
app.include_router(my_routes.router)
```

### Comment utiliser la BD?

```python
# app/services/user_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User

async def get_user(db: AsyncSession, user_id: int) -> User:
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# app/api/v1/users.py
@router.get("/{user_id}")
async def get_user_detail(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404)
    return user
```

### Comment écrire un test async?

```python
import pytest

@pytest.mark.asyncio
async def test_async_function():
    result = await my_async_function()
    assert result == expected_value
```

---

**Besoin d'aide?** Ouvrez une issue ou contactez l'équipe dev! 🚀
