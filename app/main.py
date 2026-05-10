"""
ELOKO Backend — Point d'entrée FastAPI
Lancez avec : uvicorn app.main:app --reload --port 8000
Documentation : http://localhost:8000/docs (Swagger UI)
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.api.v1 import auth, users
from app.api.gateway import market, collection, prediction


# ─── Lifecycle ───────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[ELOKO] 🚀 Démarrage — {settings.APP_ENV}")
    # TODO: Initialiser la connexion DB (SQLAlchemy async engine)
    # TODO: Vérifier la connectivité des modules internes
    yield
    print("[ELOKO] ⏹  Arrêt propre")
    # TODO: Fermer les connexions DB


# ─── Application ─────────────────────────────────────────────
app = FastAPI(
    title="ELOKO API",
    description="""
## Plateforme panafricaine d'intelligence financière

**ELOKO** est le cerveau financier de l'Afrique. Cette API Gateway centralise
l'accès aux modules d'analyse de marché, de prédiction IA et de simulation de projets.

### Authentification
Toutes les routes (sauf `/auth/*` et `/health`) nécessitent un token JWT Bearer.
Obtenez votre token via `POST /api/v1/auth/login` + `POST /api/v1/auth/login/verify-otp`.

### Langues supportées
Ajoutez `?lang=fr` ou `?lang=en` à n'importe quelle requête, ou utilisez le header `Accept-Language`.
""",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# ─── CORS ────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Middleware i18n (injecte la langue dans request.state) ──
@app.middleware("http")
async def i18n_middleware(request: Request, call_next):
    from app.core.i18n import get_lang
    request.state.lang = get_lang(request)
    return await call_next(request)


# ─── Gestionnaire d'erreurs global ───────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    from app.core.i18n import t
    lang = getattr(request.state, "lang", "fr")
    # En production, logger l'erreur ici (ex: Sentry)
    if settings.DEBUG:
        raise exc
    return JSONResponse(
        status_code=500,
        content={"detail": t("errors.internal", lang)},
    )


# ─── Routes ──────────────────────────────────────────────────
PREFIX = "/api/v1"

app.include_router(auth.router, prefix=PREFIX)
app.include_router(users.router, prefix=PREFIX)
app.include_router(market.router, prefix=PREFIX)
app.include_router(collection.router, prefix=PREFIX)
app.include_router(prediction.router, prefix=PREFIX)


# ─── Static frontend (build) ─────────────────────────────────
# Placez le build frontend (index.html + assets) dans `app/static`
# Exemple: cp -r frontend/dist/* app/static/
app.mount("/", StaticFiles(directory="app/static", html=True), name="frontend")


# ─── Santé ───────────────────────────────────────────────────
@app.get("/health", tags=["Système"], summary="Vérification de l'état du service")
async def health_check():
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
    }


# Root is served by the mounted frontend (index.html) when available.
