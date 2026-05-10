"""
ELOKO — Gateway : Collecte de données
Proxy vers le module de collecte (ingest des bourses africaines).

GET  /api/v1/collection/status          État de la collecte en temps réel
GET  /api/v1/collection/exchanges       Bourses disponibles et leur état
POST /api/v1/collection/refresh/{id}    Forcer un rafraîchissement (admin)
GET  /api/v1/collection/macro           Indicateurs macroéconomiques
"""
import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.config import settings
from app.core.i18n import get_lang, t
from app.core.security import get_current_admin, get_current_user

router = APIRouter(prefix="/collection", tags=["Collecte de données"])
MODULE_URL = settings.COLLECTION_MODULE_URL


async def _proxy_get(path: str, request: Request, user: dict, params: dict = None) -> dict:
    headers = {"X-User-Id": str(user.get("sub", "")), "X-Language": get_lang(request)}
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.get(f"{MODULE_URL}{path}", headers=headers, params=params or {})
            r.raise_for_status()
            return r.json()
        except httpx.TimeoutException:
            raise HTTPException(504, t("errors.service_unavailable", get_lang(request)))
        except httpx.RequestError:
            raise HTTPException(503, t("errors.service_unavailable", get_lang(request)))


@router.get("/status", summary="État du pipeline de collecte")
async def collection_status(
    request: Request, current_user: dict = Depends(get_current_user)
):
    return await _proxy_get("/status", request, current_user)


@router.get("/exchanges", summary="Liste des bourses disponibles et leur connectivité")
async def list_exchanges(
    request: Request, current_user: dict = Depends(get_current_user)
):
    return await _proxy_get("/exchanges", request, current_user)


@router.post(
    "/refresh/{exchange_code}",
    summary="Forcer le rafraîchissement d'une bourse (admin uniquement)",
)
async def force_refresh(
    exchange_code: str,
    request: Request,
    admin: dict = Depends(get_current_admin),
):
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.post(
                f"{MODULE_URL}/refresh/{exchange_code}",
                headers={"X-User-Id": str(admin.get("sub", ""))},
            )
            r.raise_for_status()
            return r.json()
        except Exception:
            raise HTTPException(503, t("errors.service_unavailable", get_lang(request)))


@router.get(
    "/macro",
    summary="Indicateurs macroéconomiques africains",
    description="PIB, inflation, taux directeurs par pays.",
)
async def get_macro_indicators(
    request: Request,
    country_code: str = None,
    indicator: str = None,
    current_user: dict = Depends(get_current_user),
):
    params = {k: v for k, v in {"country": country_code, "indicator": indicator}.items() if v}
    return await _proxy_get("/macro", request, current_user, params)
