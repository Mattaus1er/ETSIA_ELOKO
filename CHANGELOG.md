# CHANGELOG — Historique des améliorations

## [1.1.0] — 2026-05-07 — Python 3.14+ Support

### ✨ Nouvelles fonctionnalités

- **Support Python 3.14+** 🐍
  - Mise à jour complète des dépendances pour Python 3.14
  - `asyncpg>=0.30.0` pour support natif Python 3.14
  - `pydantic>=2.11.0` avec PyO3 0.22.0+

- **Nouvelle structure de configuration**
  - Fichier `pyproject.toml` pour gestion moderne des dépendances
  - Configuration centralisée via `[tool.*]` sections
  - Support pour dépendances optionnelles (dev, test)

- **Scripts de setup automatisé**
  - `setup.bat` pour Windows
  - `setup.sh` pour Unix/Linux/macOS
  - Configuration .env automatique

- **Docker & Docker Compose**
  - `Dockerfile` optimisé multi-stage
  - `docker-compose.yml` complet avec PostgreSQL + MongoDB
  - Health checks intégrés

- **Makefile pour développement**
  - Commandes simplifiées (make setup, make dev, make test, etc.)
  - Support Docker Compose
  - Linting, formatting, testing automatisés

- **Documentation complète**
  - `CONFIGURATION.md` — Guide complet des variables d'env
  - `DEVELOPMENT.md` — Guide des contributeurs
  - `TROUBLESHOOTING.md` — Solutions aux problèmes courants
  - `.vscode/` — Configuration VS Code

### 🔄 Changements

- **requirements.txt → requirements.txt + pyproject.toml**
  - Gestion des dépendances plus granulaire
  - Support pour dev, test, production

- **Mises à jour de dépendances**
  - `fastapi` ≥ 0.115.0
  - `uvicorn[standard]` ≥ 0.30.6
  - `pydantic[email]` ≥ 2.11.0
  - `pydantic-settings` ≥ 2.5.0
  - `asyncpg` ≥ 0.30.0 (✅ Python 3.14+)
  - `python-jose[cryptography]` ≥ 3.3.0
  - Et toutes les autres dépendances mises à jour

- **Configuration .env améliorée**
  - Commentaires détaillés
  - Exemples de configuration par environnement
  - Sécurité : directives secrètes

- `.gitignore` complété
- `.python-version` spécifié à 3.14.0

### 🐛 Corrections

- ✅ Résolution du problème Python 3.14 incompatible avec PyO3 0.22.0
- ✅ Résolution du problème asyncpg 0.29.0 non compatible avec Python 3.14
- ✅ Correction de la compilation C++ pour Windows

### 📖 Documentation

- ✅ README.md révisé avec Python 3.14+
- ✅ CONFIGURATION.md créé (guide complet)
- ✅ DEVELOPMENT.md créé (guide des contributeurs)
- ✅ TROUBLESHOOTING.md créé (solutions courantes)

### 🔧 Infrastructure

- ✅ Dockerfile multi-stage optimisé
- ✅ docker-compose.yml avec services complets
- ✅ VS Code extensions recommandées
- ✅ Makefile pour automatisation
- ✅ Pre-commit hooks ready

### 🚀 Améliorations de développement

- Configuration linting automatique (black, flake8, mypy)
- Testing intégré (pytest, coverage)
- Type hints par défaut
- Logging structuré

---

## [1.0.0] — 2026-01-XX — Version initiale

### ✨ Fonctionnalités de base

- ✅ API Gateway FastAPI
- ✅ Authentification JWT + OTP (2FA)
- ✅ Gestion des utilisateurs
- ✅ Proxy vers modules internes (Market, Collection, Prediction)
- ✅ Internationalisation (fr/en)
- ✅ Support PostgreSQL + MongoDB
- ✅ Configuration Pydantic Settings
- ✅ Gestion des paiements (Stripe, Orange Money, MTN MoMo, Wave)
- ✅ Documentation Swagger/ReDoc

---

## Migration vers Python 3.14+

### Pour les utilisateurs actuels

Si vous utilisez Python 3.12/3.13:

```bash
# 1. Backup
git stash
cp .env .env.backup

# 2. Installer Python 3.14
# https://www.python.org/downloads/

# 3. Setup
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate
pip install -r requirements.txt

# 4. Tester
pytest
make test
```

### Problèmes connus lors de la migration

| Problème | Solution |
|----------|----------|
| `PyO3` incompatible | Déjà corrigé dans pyproject.toml |
| `asyncpg` compilation | Utiliser version ≥ 0.30.0 |
| `pydantic-core` build | Déjà corrigé |

---

## Roadmap futur

### v1.2.0 (Q3 2026)
- [ ] Tests end-to-end (Playwright/Selenium)
- [ ] Monitoring & APM (DataDog/New Relic)
- [ ] GraphQL API (optionnel)
- [ ] Rate limiting avancé

### v1.3.0 (Q4 2026)
- [ ] WebSocket support pour notifications temps réel
- [ ] Cache distribué (Redis)
- [ ] Message queuing (RabbitMQ/Kafka)
- [ ] Admin panel

### v2.0.0 (2027)
- [ ] Refactor pour microservices
- [ ] Support multi-tenant
- [ ] Plugins system

---

## Notes

### 🔐 Sécurité

- Toutes les dépendances mises à jour vers les versions sécurisées
- Pas de vulnérabilités connues (vérifiées avec pip-audit)

### 🚀 Performance

- Amélioration asyncio avec Python 3.14
- Meilleure gestion de la mémoire
- Optimisations compilateur CPython

### 📊 Compatibilité

| Component | Version | Compatible |
|-----------|---------|-----------|
| Python | 3.14.0+ | ✅ |
| FastAPI | 0.115+ | ✅ |
| Pydantic | 2.11+ | ✅ |
| SQLAlchemy | 2.0+ | ✅ |
| asyncpg | 0.30+ | ✅ |
| PostgreSQL | 14+ | ✅ |
| MongoDB | 5.0+ | ✅ |

---

## Remerciements

Merci à l'équipe de développement pour l'adoption de Python 3.14 et les améliorations d'infrastructure! 🎉

---

## Support

Pour toute question ou problème:
- 📧 Email: dev@eloko.africa
- 🐛 GitHub Issues: https://github.com/eloko/backend/issues
- 💬 Discord: [Lien serveur]
