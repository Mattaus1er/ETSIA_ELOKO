"""
ELOKO — Gateway : Analyse des marchés
Le gateway reçoit les requêtes frontend, les authentifie,
les enrichit (user_id, lang) et les proxifie vers le module marché.

Routes exposées au frontend :
GET  /api/v1/market/instruments         Liste des instruments disponibles
GET  /api/v1/market/instruments/{id}    Détail d'un instrument
GET  /api/v1/market/prices/{id}         Cours historiques
GET  /api/v1/market/dashboard           Tableau de bord (indices majeurs)
GET  /api/v1/market/report/weekly       Rapport hebdomadaire PDF
"""
from typing import Optional
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from fastapi.responses import StreamingResponse

from app.config import settings
from app.core.i18n import get_lang, t
from app.core.security import get_current_user

router = APIRouter(prefix="/market", tags=["Analyse des marchés"])

MODULE_URL = settings.MARKET_MODULE_URL
TIMEOUT = 10.0  # secondes


async def _proxy(
    method: str,
    path: str,
    request: Request,
    current_user: dict,
    params: Optional[dict] = None,
) -> dict:
    """
    Proxifie une requête vers le module marché.
    Injecte l'identité utilisateur dans les headers pour traçabilité.
    """
    headers = {
        "X-User-Id": str(current_user.get("sub", "")),
        "X-User-Role": str(current_user.get("role", "user")),
        "X-Language": get_lang(request),
        "Content-Type": "application/json",
    }
    url = f"{MODULE_URL}{path}"

    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        try:
            resp = await client.request(method, url, params=params, headers=headers)
            resp.raise_for_status()
            return resp.json()
        except httpx.TimeoutException:
            raise HTTPException(
                status.HTTP_504_GATEWAY_TIMEOUT,
                t("market.api_unavailable", get_lang(request)),
            )
        except httpx.HTTPStatusError as e:
            raise HTTPException(e.response.status_code, e.response.text)
        except httpx.RequestError:
            raise HTTPException(
                status.HTTP_503_SERVICE_UNAVAILABLE,
                t("errors.service_unavailable", get_lang(request)),
            )


@router.get(
    "/instruments",
    summary="Liste des instruments financiers disponibles",
    description="Retourne tous les instruments actifs (actions, obligations, ETF) avec filtres.",
)
async def list_instruments(
    request: Request,
    exchange: Optional[str] = Query(None, description="Code de la bourse (ex: BRVM, NSE)"),
    sector: Optional[str] = Query(None, description="Secteur GICS"),
    type: Optional[str] = Query(None, description="STOCK | BOND | ETF | INDEX"),
    current_user: dict = Depends(get_current_user),
):
    params = {k: v for k, v in {"exchange": exchange, "sector": sector, "type": type}.items() if v}
    return await _proxy("GET", "/instruments", request, current_user, params)


@router.get(
    "/instruments/{instrument_id}",
    summary="Détail d'un instrument financier",
)
async def get_instrument(
    instrument_id: int,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    return await _proxy("GET", f"/instruments/{instrument_id}", request, current_user)


@router.get(
    "/prices/{instrument_id}",
    summary="Cours historiques d'un instrument",
    description="Retourne les OHLCV journaliers. Paramètres : period (7d|1m|3m|1y|5y).",
)
async def get_prices(
    instrument_id: int,
    request: Request,
    period: str = Query("1m", description="Période : 7d | 1m | 3m | 1y | 5y"),
    current_user: dict = Depends(get_current_user),
):
    return await _proxy(
        "GET", f"/prices/{instrument_id}", request, current_user,
        params={"period": period},
    )


@router.get(
    "/dashboard",
    summary="Tableau de bord — indices africains majeurs",
    description="Retourne les performances du jour pour BRVM Composite, NSE All-Share, JSE Top40, etc.",
)
async def get_dashboard(
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    return await _proxy("GET", "/dashboard", request, current_user)


@router.get(
    "/report/weekly",
    summary="Rapport hebdomadaire PDF",
    description="Génère et retourne le rapport PDF de la semaine en cours.",
)
async def get_weekly_report(
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    headers = {
        "X-User-Id": str(current_user.get("sub", "")),
        "X-Language": lang,
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.get(f"{MODULE_URL}/report/weekly", headers=headers)
            resp.raise_for_status()
            return StreamingResponse(
                resp.aiter_bytes(),
                media_type="application/pdf",
                headers={"Content-Disposition": "attachment; filename=rapport_hebdomadaire.pdf"},
            )
        except Exception:
            raise HTTPException(
                status.HTTP_503_SERVICE_UNAVAILABLE,
                t("market.api_unavailable", lang),
            )
