# TROUBLESHOOTING — Guide de dépannage

## 🐍 Problèmes liés à Python

### ❌ `error: the configured Python interpreter version (3.14) is newer than PyO3's maximum supported version (3.13)`

**Cause**: Dépendances incompatibles avec Python 3.14

**Solution**:
```bash
# Option 1: Utiliser Python 3.13 temporairement
python3.13 -m venv .venv
source .venv/bin/activate

# Option 2: Mettre à jour les dépendances (recommandé)
pip install --upgrade pydantic asyncpg
```

---

### ❌ `command 'cl.exe' failed with exit code 2`

**Cause**: Compilateur C++ manquant (Visual Studio Build Tools)

**Solution**:
```bash
# 1. Télécharger Microsoft C++ Build Tools
# https://visualstudio.microsoft.com/visual-cpp-build-tools/

# 2. Réinstaller les dépendances
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

---

### ❌ `No module named 'fastapi'`

**Cause**: Dépendances non installées ou mauvais environnement virtuel

**Solution**:
```bash
# Vérifier que venv est activé
which python  # Unix/Mac
where python  # Windows

# Réinstaller
pip install -r requirements.txt
```

---

## 🗄️ Problèmes de Base de Données

### ❌ `FATAL: Ident authentication failed for user "postgres"`

**Cause**: PostgreSQL n'est pas configuré ou credentials incorrects

**Solution**:
```bash
# 1. Vérifier que PostgreSQL est en cours d'exécution
# Windows: Services → PostgreSQL
# Mac: brew services list | grep postgres
# Linux: sudo systemctl status postgresql

# 2. Vérifier les credentials dans .env
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/eloko_db

# 3. Créer la base si elle n'existe pas
psql -U postgres -c "CREATE DATABASE eloko_db;"
```

---

### ❌ `asyncpg.exceptions.CannotConnectNowError`

**Cause**: PostgreSQL n'est pas accessible

**Solution**:
```bash
# Vérifier la connexion
psql -U postgres -h localhost -p 5432

# Vérifier les logs PostgreSQL
tail -f /var/log/postgresql/postgresql-14-main.log  # Linux
```

---

## 📧 Problèmes Email

### ❌ `SMTPAuthenticationError`

**Cause**: Credentials Gmail incorrects

**Solution**:
```bash
# 1. Utiliser "App Password" (pas votre mot de passe Google)
# https://support.google.com/accounts/answer/185833

# 2. Vérifier que "Less secure app access" est désactivé (moderne)

# 3. Activer 2FA sur Google Account:
# https://support.google.com/accounts/answer/185839
```

---

## 🔌 Problèmes de Port

### ❌ `Address already in use: ('127.0.0.1', 8000)`

**Cause**: Un autre processus utilise le port 8000

**Solution**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8000
kill -9 <PID>

# Utiliser un autre port
uvicorn app.main:app --reload --port 8001
```

---

## 🧪 Problèmes de Tests

### ❌ `pytest: command not found`

**Cause**: pytest n'est pas installé dans l'env

**Solution**:
```bash
pip install pytest pytest-asyncio pytest-cov
pytest  # Lancer les tests
```

---

## 🐳 Problèmes Docker (si applicable)

### ❌ `docker: command not found`

**Cause**: Docker n'est pas installé

**Solution**:
- Télécharger depuis https://www.docker.com/products/docker-desktop

---

## 📝 Logs & Debugging

### Voir les logs détaillés

```bash
# Développement
uvicorn app.main:app --reload --port 8000 --log-level debug

# Production (avec logs structurés)
LOG_LEVEL=DEBUG python -m uvicorn app.main:app
```

### Vérifier l'état de santé de l'API

```bash
curl http://localhost:8000/health
# Devrait retourner: {"status": "ok"}
```

---

## 🆘 Toujours bloqué?

1. **Vérifier les logs complets**: `uvicorn app.main:app --log-level debug`
2. **Vérifier la configuration**: `python -c "from app.config import settings; print(settings)"`
3. **Activer le verbose pip**: `pip install -v -r requirements.txt`
4. **Créer une issue GitHub** avec:
   - Version Python: `python --version`
   - Version pip: `pip --version`
   - Message d'erreur complet
   - OS et version
