# Configuration — Guide complet

## Vue d'ensemble

ELOKO Backend utilise **Pydantic Settings** pour la gestion centralisée de la configuration via fichier `.env`.

Pour voir la configuration actuelle:
```python
from app.config import settings
print(settings.model_dump())
```

---

## Variables d'environnement

### Application

| Variable | Type | Défaut | Description |
|----------|------|--------|-------------|
| `APP_NAME` | str | `"ELOKO"` | Nom de l'application |
| `APP_VERSION` | str | `"1.0.0"` | Version de l'application |
| `APP_ENV` | str | `"development"` | Environment: `development`, `staging`, `production` |
| `DEBUG` | bool | `False` | Mode debug (logs verbeux) |
| `DEFAULT_LANGUAGE` | str | `"fr"` | Langue par défaut: `"fr"` ou `"en"` |

### Base de données

| Variable | Type | Format | Description |
|----------|------|--------|-------------|
| `DATABASE_URL` | str | `postgresql+asyncpg://user:password@host:port/db` | PostgreSQL avec asyncpg |
| `MONGODB_URL` | str | `mongodb://user:password@host:port/db` | MongoDB pour sessions |

**Exemples**:
```
# Développement local
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/eloko_dev

# Production (via Docker)
DATABASE_URL=postgresql+asyncpg://user:pass@postgres_container:5432/eloko_prod

# MongoDB
MONGODB_URL=mongodb://admin:password@mongodb:27017/eloko_sessions
```

### Sécurité & JWT

| Variable | Type | Défaut | Description |
|----------|------|--------|-------------|
| `SECRET_KEY` | str | ❌ Requis | Clé secrète pour signer les JWTs |
| `JWT_ALGORITHM` | str | `"HS256"` | Algorithme JWT |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | int | `60` | Expiration du token d'accès (minutes) |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | int | `7` | Expiration du token de refresh (jours) |

**Générer une SECRET_KEY**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### OTP & 2FA

| Variable | Type | Défaut | Description |
|----------|------|--------|-------------|
| `OTP_EXPIRE_SECONDS` | int | `600` | Durée de validité du code OTP (secondes) |
| `MAX_LOGIN_ATTEMPTS` | int | `5` | Nombre maximum de tentatives de login |

### Email (SMTP)

| Variable | Type | Défaut | Description |
|----------|------|--------|-------------|
| `MAIL_USERNAME` | str | ❌ Requis | Email/login SMTP |
| `MAIL_PASSWORD` | str | ❌ Requis | Mot de passe SMTP |
| `MAIL_FROM` | str | `"noreply@eloko.africa"` | Email d'envoi |
| `MAIL_SERVER` | str | `"smtp.gmail.com"` | Serveur SMTP |
| `MAIL_PORT` | int | `587` | Port SMTP |
| `MAIL_STARTTLS` | bool | `True` | Utiliser STARTTLS |
| `MAIL_SSL_TLS` | bool | `False` | Utiliser SSL/TLS |

**Configuration Gmail**:
```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password-16-chars  # Pas le mot de passe Google
MAIL_FROM=noreply@eloko.africa
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_STARTTLS=true
MAIL_SSL_TLS=false
```

[👉 Générer App Password Gmail](https://support.google.com/accounts/answer/185833)

### Modules internes

| Variable | Type | Format | Description |
|----------|------|--------|-------------|
| `MARKET_MODULE_URL` | str | `http://host:port` | URL du module Market Analysis |
| `COLLECTION_MODULE_URL` | str | `http://host:port` | URL du module Collection |
| `PREDICTION_MODULE_URL` | str | `http://host:port` | URL du module AI Prediction |

### Paiements

| Variable | Type | Description |
|----------|------|-------------|
| `STRIPE_SECRET_KEY` | str | Clé API Stripe (sk_test_...) |
| `ORANGE_MONEY_API_KEY` | str | Clé API Orange Money |
| `MTN_MOMO_API_KEY` | str | Clé API MTN Mobile Money |
| `WAVE_API_KEY` | str | Clé API Wave |

### CORS

| Variable | Type | Format | Description |
|----------|------|--------|-------------|
| `ALLOWED_ORIGINS` | str | `origin1,origin2,origin3` | Origines CORS (séparées par virgules) |

**Exemples**:
```env
# Développement
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Production
ALLOWED_ORIGINS=https://app.eloko.africa,https://mobile.eloko.africa
```

---

## Configuration par environnement

### 🔧 Développement

```env
APP_ENV=development
DEBUG=true
SECRET_KEY=dev_secret_key_12345
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/eloko_dev
MONGODB_URL=mongodb://localhost:27017/eloko_sessions
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### 🚀 Production

```env
APP_ENV=production
DEBUG=false
SECRET_KEY=production_secret_key_generated_by_secrets
DATABASE_URL=postgresql+asyncpg://user:strong_password@db.eloko.africa:5432/eloko_prod
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/eloko_sessions
ALLOWED_ORIGINS=https://app.eloko.africa,https://mobile.eloko.africa
```

---

## Validation de la configuration

Au démarrage, Pydantic valide automatiquement:

```bash
# Affiche les erreurs si des variables manquent
python -m uvicorn app.main:app

# Ou dans Python
from app.config import settings  # Lèvera une exception si invalide
```

---

## Docker & Variables

Dans `docker-compose.yml`, les variables peuvent être:

1. **Définies directement**:
   ```yaml
   environment:
     SECRET_KEY: my_secret_key
   ```

2. **Chargées d'un fichier**:
   ```yaml
   env_file:
     - .env.docker
   ```

3. **Surchargées en CLI**:
   ```bash
   docker run -e SECRET_KEY=value ... eloko-backend
   ```

---

## Secrets & Sécurité

### 🔐 Gestion des secrets en production

**Option 1: AWS Secrets Manager**
```python
import boto3
client = boto3.client('secretsmanager')
secret = client.get_secret_value(SecretId='eloko/prod')
```

**Option 2: HashiCorp Vault**
```python
from hvac import Client
client = Client(url='https://vault.eloko.africa')
secret = client.secrets.kv.v2.read_secret_version(path='eloko/prod')
```

**Option 3: Files secrètes (mounted volumes)**
```yaml
volumes:
  - /secure/path/.env.prod:/app/.env.prod:ro
```

### 🛡️ Checklist sécurité

- [ ] `SECRET_KEY` est fort (32+ caractères aléatoires)
- [ ] `DEBUG=false` en production
- [ ] Credentials BD dans des secrets, pas en git
- [ ] CORS restreint aux domaines connus
- [ ] HTTPS forcé en production
- [ ] Rotation régulière des credentials

---

## Recharger la configuration

La configuration est chargée au démarrage. Pour recharger:

```bash
# Redémarrer le serveur
Ctrl+C
uvicorn app.main:app --reload
```

Ou pour Docker:
```bash
docker-compose restart eloko_api
```

---

## FAQ

### ❓ Où mettez-vous les secrets en production?

→ **Ne pas les mettre dans `.env`**. Utiliser:
- Variables d'environnement du serveur
- AWS Secrets Manager / Parameter Store
- HashiCorp Vault
- Docker Secrets

### ❓ Comment avoir plusieurs .env?

```bash
# Créez:
.env.dev
.env.staging
.env.prod

# Puis:
cp .env.prod .env
uvicorn app.main:app
```

### ❓ Quelle est la priorité entre .env et variables système?

**Pydantic Settings priorité**:
1. Variables d'environnement système
2. Fichier `.env`
3. Valeurs par défaut dans `config.py`

---

## Ressources

- [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [OWASP Secrets Management](https://owasp.org/www-community/attacks/Sensitive_Data_Exposure)
