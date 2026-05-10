"""
ELOKO — Routes utilisateur et abonnements
GET    /api/v1/users/me
PATCH  /api/v1/users/me
DELETE /api/v1/users/me
POST   /api/v1/users/me/avatar
GET    /api/v1/subscriptions/plans
POST   /api/v1/subscriptions/subscribe
GET    /api/v1/subscriptions/me
DELETE /api/v1/subscriptions/me
GET    /api/v1/subscriptions/history
"""
from datetime import datetime
from fastapi import APIRouter, Depends, File, Request, UploadFile, status

from app.core.i18n import get_lang, t
from app.core.security import get_current_user
from app.schemas.schemas import (
    DeleteAccountRequest,
    MessageResponse,
    PlanResponse,
    SubscribeRequest,
    SubscriptionResponse,
    UserProfile,
    UserUpdateRequest,
)

router = APIRouter(tags=["Utilisateurs & Abonnements"])


# ─── Profil ───────────────────────────────────────────────────

@router.get(
    "/users/me",
    response_model=UserProfile,
    summary="Récupérer le profil de l'utilisateur connecté",
)
async def get_my_profile(
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    # TODO: user = await user_service.get_by_id(current_user["sub"])
    # Exemple de retour pour documentation frontend :
    return UserProfile(
        id=int(current_user["sub"]),
        full_name="Jean Désire Moubeb",
        email="jd@eloko.africa",
        phone="+237690000000",
        language="fr",
        role=current_user.get("role", "user"),
        is_verified=True,
        is_active=True,
        avatar_url=None,
        created_at=datetime.now(),
    )


@router.patch(
    "/users/me",
    response_model=MessageResponse,
    summary="Modifier le profil",
)
async def update_my_profile(
    body: UserUpdateRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    # TODO: await user_service.update(current_user["sub"], body)
    return MessageResponse(message=t("user.profile_updated", lang))


@router.post(
    "/users/me/avatar",
    response_model=MessageResponse,
    summary="Mettre à jour la photo de profil",
)
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    # Validation type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        from fastapi import HTTPException
        raise HTTPException(400, "Seuls les formats JPEG, PNG et WebP sont acceptés.")
    # TODO: await storage_service.upload_avatar(current_user["sub"], file)
    return MessageResponse(message=t("user.photo_updated", lang))


@router.delete(
    "/users/me",
    response_model=MessageResponse,
    summary="Supprimer le compte (RGPD — anonymisation)",
)
async def delete_my_account(
    body: DeleteAccountRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    # TODO: Vérifier OTP de confirmation, anonymiser les données
    # await user_service.anonymize(current_user["sub"], body.code)
    return MessageResponse(message=t("user.account_deleted", lang))


# ─── Abonnements ──────────────────────────────────────────────

@router.get(
    "/subscriptions/plans",
    response_model=list[PlanResponse],
    summary="Lister les plans disponibles",
)
async def list_plans(request: Request):
    # TODO: return await subscription_service.get_active_plans()
    return [
        PlanResponse(id=1, name="FREE", price=0, currency="XOF",
                     features={"market_data": True, "predictions": False, "simulations": False}, is_active=True),
        PlanResponse(id=2, name="PRO", price=5000, currency="XOF",
                     features={"market_data": True, "predictions": True, "simulations": True, "reports": True}, is_active=True),
        PlanResponse(id=3, name="ENTERPRISE", price=25000, currency="XOF",
                     features={"market_data": True, "predictions": True, "simulations": True, "reports": True, "api_access": True}, is_active=True),
    ]


@router.post(
    "/subscriptions/subscribe",
    response_model=SubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Souscrire à un plan",
)
async def subscribe(
    body: SubscribeRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    # TODO: await payment_service.process(body, current_user["sub"])
    # TODO: await subscription_service.activate(current_user["sub"], body.plan_id)
    return SubscriptionResponse(
        id=1,
        plan="PRO",
        status="ACTIVE",
        start_date=datetime.now(),
        end_date=None,
        message=t("subscription.subscribed", lang, plan="PRO"),
    )


@router.get(
    "/subscriptions/me",
    response_model=SubscriptionResponse,
    summary="Consulter l'abonnement actif",
)
async def get_my_subscription(
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    # TODO: return await subscription_service.get_active(current_user["sub"])
    return SubscriptionResponse(
        id=1, plan="FREE", status="ACTIVE",
        start_date=datetime.now(), end_date=None, message="",
    )


@router.delete(
    "/subscriptions/me",
    response_model=MessageResponse,
    summary="Résilier l'abonnement",
)
async def cancel_subscription(
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    lang = get_lang(request)
    # TODO: await subscription_service.cancel(current_user["sub"])
    return MessageResponse(
        message=t("subscription.cancelled", lang, end_date="2026-06-01")
    )
