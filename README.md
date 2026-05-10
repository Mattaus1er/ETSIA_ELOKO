# ELOKO Backend — API Gateway

> **Plateforme panafricaine d'intelligence financière**  
> Stack : Python 3.14+ · FastAPI 0.115+ · PostgreSQL + TimescaleDB · JWT + OTP

---

## Architecture

```
eloko-backend/
├── app/
│   ├── main.py                  # Point d'entrée FastAPI
│   ├── config.py                # Paramètres (Pydantic Settings)
│   │
│   ├── api/
│   │   ├── v1/                  # Routes directes (gérées par ce backend)
│   │   │   ├── auth.py          # /auth/* — Inscription, Login MFA, OTP
│   │   │   └── users.py         # /users/me, /subscriptions/*
│   │   │
│   │   └── gateway/             # Proxy vers les modules internes
│   │       ├── market.py        # /market/* → module:8001
│   │       ├── collection.py    # /collection/* → module:8002
│   │       └── prediction.py    # /prediction/* + /simulation/* → module:8003
│   │
│   ├── core/
│   │   ├── security.py          # JWT, OTP (TOTP), bcrypt
│   │   └── i18n.py              # Internationalisation (fr.json / en.json)
│   │
│   ├── schemas/
│   │   └── schemas.py           # Schémas Pydantic (validation des données)
│   │
│   └── locales/
│       ├── fr.json              # Traductions françaises (langue par défaut)
│       └── en.json              # English translations
│
├── requirements.txt
├── .env.example
└── README.md
```

---

## Installation & Setup

### ✅ Prérequis
- **Python 3.14+** (Obligatoire — testé avec Python 3.14)
- **PostgreSQL 14+** ou connection à une instance existante
- **Git** pour cloner le repo

### 🚀 Installation rapide (Windows)

```bash
# 1. Cloner le repo
git clone https://github.com/eloko/backend.git
cd eloko-backend

# 2. Lancer le script setup
setup.bat

# 3. Configurer .env (le script vous créera un fichier de base)
# Éditez .env avec vos credentials
```

### 🚀 Installation rapide (Linux/macOS)

```bash
# 1. Cloner le repo
git clone https://github.com/eloko/backend.git
cd eloko-backend

# 2. Rendre le script exécutable et le lancer
chmod +x setup.sh
./setup.sh

# 3. Configurer .env (le script vous créera un fichier de base)
# Éditez .env avec vos credentials
```

### 🔧 Installation manuelle

```bash
# 1. Vérifier Python 3.14+
python --version

# 2. Créer l'environnement virtuel
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 3. Mettre à jour pip et installer les dépendances
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# 4. Configurer l'environnement
cp .env.example .env
# Éditez .env avec vos valeurs

# 5. Lancer le serveur
uvicorn app.main:app --reload --port 8000
```

### 📦 Installation pour développement

```bash
# Installer les dépendances dev (incluant pytest, black, mypy)
pip install -e ".[dev]"

# Ou depuis requirements.txt
pip install -r requirements.txt pytest pytest-cov black mypy
```

---

## Configuration

### Variables d'environnement obligatoires

Créez un fichier `.env` à la racine avec:

```env
# Application
SECRET_KEY=your_secret_key_here_change_in_production
DEBUG=False
APP_ENV=production

# Database
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/eloko_db
MONGODB_URL=mongodb://localhost:27017/eloko_sessions

# JWT
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# OTP
OTP_EXPIRE_SECONDS=600
MAX_LOGIN_ATTEMPTS=5

# Email (Gmail)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@eloko.africa

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# URLs des modules internes
MARKET_MODULE_URL=http://localhost:8001
COLLECTION_MODULE_URL=http://localhost:8002
PREDICTION_MODULE_URL=http://localhost:8003
```

### ✨ Télécharger un template .env

```bash
cp .env.example .env
```

---

## Lancement du serveur

```bash
# Développement (avec auto-reload)
uvicorn app.main:app --reload --port 8000

# Production (sans reload)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Avec gunicorn (production)
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

---

## Vérification de l'installation

```bash
# Vérifier la version de Python
python --version

# Vérifier les packages critiques
python -c "import fastapi; import pydantic; import sqlalchemy; print('✅ Setup OK')"

# Lancer les tests
pytest

# Vérifier les types (mypy)
mypy app/

# Format le code (black)
black app/
```

---

## Documentation API

Une fois le serveur lancé :

---

## Frontend integration (quick start)

This repository supports two simple deployment options for the frontend:

- Serve the built SPA from the backend `app/static` (simple single-image deploy)
- Serve the built SPA from a separate Nginx container (recommended for production)

### Build and run frontend locally

1. Build the frontend (from the `frontend/` folder):

```bash
cd frontend
npm ci
npm run build
```

2a. Option A — Serve from backend (copy build to backend static dir):

```bash
cp -r frontend/dist/* app/static/
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

2b. Option B — Run with Docker (Nginx frontend + backend):

```bash
# Build images and start containers
docker-compose build
docker-compose up -d
# Frontend will be available at http://localhost:3000
# API at http://localhost:8000
```

### Environment variable used by frontend

- If the frontend needs to call the API, set `VITE_API_BASE_URL` (Vite) or `REACT_APP_API_URL` (CRA) during build, e.g.:

```bash
VITE_API_BASE_URL="https://api.your-domain.com" npm run build
```


| URL | Description |
|-----|-------------|
| `http://localhost:8000/docs` | Swagger UI (interactif) |
| `http://localhost:8000/redoc` | ReDoc (lecture) |
| `http://localhost:8000/openapi.json` | Schéma OpenAPI brut |
| `http://localhost:8000/health` | Santé du service |

---

## Routes principales

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/v1/auth/register` | Créer un compte |
| POST | `/api/v1/auth/verify-otp` | Valider le compte (OTP email) |
| POST | `/api/v1/auth/login` | Connexion (étape 1) |
| POST | `/api/v1/auth/login/verify-otp` | Connexion (étape 2 — MFA) |
| POST | `/api/v1/auth/refresh` | Renouveler le token |
| POST | `/api/v1/auth/logout` | Déconnexion |
| POST | `/api/v1/auth/password-reset` | Demande de réinitialisation |
| POST | `/api/v1/auth/password-reset/confirm` | Confirmer le nouveau mot de passe |

### Utilisateur
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/v1/users/me` | Mon profil |
| PATCH | `/api/v1/users/me` | Modifier mon profil |
| POST | `/api/v1/users/me/avatar` | Changer ma photo |
| DELETE | `/api/v1/users/me` | Supprimer mon compte (RGPD) |

### Abonnements
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/v1/subscriptions/plans` | Plans disponibles |
| POST | `/api/v1/subscriptions/subscribe` | Souscrire |
| GET | `/api/v1/subscriptions/me` | Mon abonnement actif |
| DELETE | `/api/v1/subscriptions/me` | Résilier |

### Gateway — Marchés
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/v1/market/instruments` | Liste des instruments |
| GET | `/api/v1/market/prices/{id}?period=1m` | Cours historiques |
| GET | `/api/v1/market/dashboard` | Indices africains |
| GET | `/api/v1/market/report/weekly` | Rapport PDF hebdomadaire |

### Gateway — Prédiction & Simulation
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/v1/prediction/trend/{id}` | Prédiction de tendance |
| GET | `/api/v1/prediction/recommendations` | Recommandations IA |
| POST | `/api/v1/simulation/analyze` | Déposer un business plan |
| GET | `/api/v1/simulation/report/{id}` | Rapport PDF de simulation |

---

## Internationalisation (i18n)

Tous les messages de l'API sont traduits. Deux façons de choisir la langue :

```
# Via query param
GET /api/v1/market/dashboard?lang=en

# Via header
Accept-Language: en
```

Pour ajouter une clé de traduction :
1. Ajouter la clé dans `app/locales/fr.json`
2. Ajouter la traduction dans `app/locales/en.json`
3. Utiliser dans le code : `t("ma.cle", lang)`

---

## Sécurité

- Mots de passe hachés avec **bcrypt**
- Tokens d'accès **JWT** (expiration 60 min)
- Tokens de rafraîchissement (expiration 7 jours)
- **OTP TOTP** (validité 10 min) pour inscription et connexion MFA
- Chiffrement des données en transit : **TLS/HTTPS** obligatoire en production
- Données sensibles en base : **AES-256**

---

## Variables d'environnement clés

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SECRET_KEY` | Clé de signature JWT | `openssl rand -hex 32` |
| `DATABASE_URL` | URL PostgreSQL async | `postgresql+asyncpg://...` |
| `MARKET_MODULE_URL` | URL du module marché | `http://localhost:8001` |
| `COLLECTION_MODULE_URL` | URL module collecte | `http://localhost:8002` |
| `PREDICTION_MODULE_URL` | URL module prédiction | `http://localhost:8003` |

---

## Équipe projet — Institut UCAC-ICAM
MBASSI · KUATE · MOUBEB · **NJOCK** · TOUKEM · DJIMADOUM
"# ETSIA_ELOKO" 
