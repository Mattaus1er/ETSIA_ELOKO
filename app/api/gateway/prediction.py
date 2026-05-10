"""
ELOKO — Gateway : Analyse prédictive (IA)
Proxy vers le module de prédiction ML.

GET  /api/v1/prediction/trend/{id}      Prédiction de tendance d'un instrument
GET  /api/v1/prediction/recommendations Recommandations personnalisées
POST /api/v1/simulation/analyze         Dépôt et analyse d'un business plan
GET  /api/v1/simulation/report/{id}     Rapport PDF de simulation de projet
"""
import httpx
from fastapi import APIRouter, Depends, File, HTTPException, Query, Request, UploadFile, status
from fastapi.responses import StreamingResponse

from app.config import settings
from app.core.i18n import get_lang, t
from app.core.security import get_current_user

router = APIRouter(tags=["Prédiction IA & Simulation"])
MODULE_URL = settings.PREDICTION_MODULE_URL


# ─── Prédiction de tendances ──────────────────────────────────

@router.get(
    "/prediction/trend/{instrument_id}",
    summary="Prédiction de tendance d'un instrument",
    description="L'IA calcule la probabilité de hausse/baisse à 7, 30 et 90 jours. Fiabilité cible > 80%.",
)
async def predict_trend(
    instrument_id: int,
    request: Request,
    horizon: str = Query("30d", description="Horizon : 7d | 30d | 90d"),
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    headers = {
        "X-User-Id": str(current_user.get("sub", "")),
        "X-Language": lang,
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            r = await client.get(
                f"{MODULE_URL}/trend/{instrument_id}",
                headers=headers,
                params={"horizon": horizon},
            )
            r.raise_for_status()
            return r.json()
        except httpx.TimeoutException:
            raise HTTPException(504, t("prediction.model_error", lang))
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 422:
                raise HTTPException(422, t("prediction.insufficient_data", lang))
            raise HTTPException(e.response.status_code, t("prediction.model_error", lang))
        except httpx.RequestError:
            raise HTTPException(503, t("errors.service_unavailable", lang))


@router.get(
    "/prediction/recommendations",
    summary="Recommandations d'investissement personnalisées",
    description="Suggestions basées sur le profil de risque et l'historique de l'utilisateur.",
)
async def get_recommendations(
    request: Request,
    limit: int = Query(5, ge=1, le=20),
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    headers = {"X-User-Id": str(current_user.get("sub", "")), "X-Language": lang}
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.get(
                f"{MODULE_URL}/recommendations",
                headers=headers,
                params={"user_id": current_user["sub"], "limit": limit},
            )
            r.raise_for_status()
            return r.json()
        except Exception:
            raise HTTPException(503, t("errors.service_unavailable", lang))


# ─── Simulation de projet ─────────────────────────────────────

@router.post(
    "/simulation/analyze",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Dépôt et analyse d'un business plan",
    description="""
    Accepte un PDF (max 10 Mo) de business plan ou pitch deck.
    L'analyse IA est asynchrone — un email est envoyé quand le rapport est prêt.
    Retourne un `simulation_id` pour suivre l'avancement.
    """,
)
async def submit_project_for_analysis(
    request: Request,
    file: UploadFile = File(..., description="Business plan PDF (< 10 Mo)"),
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)

    # Validation taille (10 Mo)
    MAX_SIZE = 10 * 1024 * 1024
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(413, t("simulation.file_too_large", lang))

    if file.content_type not in ("application/pdf",):
        raise HTTPException(415, "Seuls les fichiers PDF sont acceptés.")

    headers = {"X-User-Id": str(current_user.get("sub", "")), "X-Language": lang}
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            r = await client.post(
                f"{MODULE_URL}/simulation/analyze",
                headers=headers,
                files={"file": (file.filename, contents, "application/pdf")},
                data={"user_id": str(current_user["sub"])},
            )
            r.raise_for_status()
            return {
                **r.json(),
                "message": t("simulation.analysis_queued", lang),
            }
        except httpx.TimeoutException:
            raise HTTPException(504, t("errors.service_unavailable", lang))
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 422:
                raise HTTPException(422, t("simulation.insufficient_info", lang))
            raise HTTPException(e.response.status_code, t("errors.internal", lang))


@router.get(
    "/simulation/report/{simulation_id}",
    summary="Télécharger le rapport PDF d'une simulation",
)
async def get_simulation_report(
    simulation_id: int,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    headers = {"X-User-Id": str(current_user.get("sub", "")), "X-Language": lang}
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            r = await client.get(
                f"{MODULE_URL}/simulation/report/{simulation_id}",
                headers=headers,
            )
            r.raise_for_status()
            return StreamingResponse(
                r.aiter_bytes(),
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename=simulation_{simulation_id}.pdf"
                },
            )
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise HTTPException(404, t("errors.not_found", lang))
            raise HTTPException(503, t("errors.service_unavailable", lang))
