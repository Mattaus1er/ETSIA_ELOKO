"""
ELOKO — Routes d'authentification
POST /api/v1/auth/register
POST /api/v1/auth/verify-otp
POST /api/v1/auth/login
POST /api/v1/auth/login/verify-otp
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/password-reset
POST /api/v1/auth/password-reset/confirm
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.core.i18n import get_lang, t
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_otp,
    generate_otp_secret,
    hash_password,
    verify_otp,
    verify_password,
)
from app.config import settings
from app.schemas.schemas import (
    DeleteAccountRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    OTPVerifyRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentification"])

# NOTE : Dans un vrai projet, ces fonctions appellent la couche service
# (app/services/auth_service.py) qui accède à la base de données.
# Ici on documente l'interface exacte — le service est à brancher.


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Inscription d'un nouvel utilisateur",
    description="""
    Crée un compte, génère un OTP et l'envoie par email.
    Le compte n'est activé qu'après vérification OTP (/verify-otp).
    """,
)
async def register(body: RegisterRequest, request: Request):
    lang = get_lang(request)

    # TODO: Vérifier que l'email n'existe pas déjà (appel service)
    # if await user_service.email_exists(body.email):
    #     raise HTTPException(400, t("auth.email_already_exists", lang))

    # TODO: Créer l'utilisateur en base
    # user = await user_service.create(body, hashed_pw=hash_password(body.password))

    # TODO: Générer et envoyer l'OTP
    # otp_secret = generate_otp_secret()
    # otp_code = generate_otp(otp_secret)
    # await notification_service.send_otp_email(body.email, otp_code, lang)

    return RegisterResponse(
        message=t("auth.register_success", lang),
        user_id=1,          # Remplacer par user.id
        email=body.email,
    )


@router.post(
    "/verify-otp",
    response_model=MessageResponse,
    summary="Vérification OTP post-inscription",
)
async def verify_registration_otp(body: OTPVerifyRequest, request: Request):
    lang = get_lang(request)

    # TODO: Décoder otp_token, récupérer le secret, vérifier le code
    # payload = decode_token(body.otp_token)
    # if not verify_otp(payload["otp_secret"], body.code):
    #     raise HTTPException(400, t("auth.otp_invalid", lang))
    # await user_service.activate(payload["user_id"])

    return MessageResponse(message=t("auth.login_success", lang))


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Connexion (étape 1 sur 2 si MFA activé)",
)
async def login(body: LoginRequest, request: Request):
    lang = get_lang(request)

    # TODO: Vérifier les identifiants
    # user = await user_service.get_by_email(body.email)
    # if not user or not verify_password(body.password, user.password_hash):
    #     raise HTTPException(401, t("auth.invalid_credentials", lang))
    # if not user.is_active or not user.is_verified:
    #     raise HTTPException(403, t("auth.account_not_verified", lang))

    # TODO: Générer OTP et créer un token temporaire
    # otp_code = generate_otp(user.otp_secret)
    # await notification_service.send_otp_email(user.email, otp_code, lang)
    # otp_token = create_access_token({"user_id": user.id, "otp_secret": user.otp_secret, "type": "otp"}, ...)

    return LoginResponse(
        message=t("auth.otp_sent", lang),
        requires_otp=True,
        otp_token="<otp_token_temporaire>",
    )


@router.post(
    "/login/verify-otp",
    response_model=TokenResponse,
    summary="Connexion (étape 2) — validation OTP et émission des tokens",
)
async def login_verify_otp(body: OTPVerifyRequest, request: Request):
    lang = get_lang(request)

    # TODO: Vérifier l'OTP
    # payload = decode_token(body.otp_token)
    # if not verify_otp(payload["otp_secret"], body.code):
    #     raise HTTPException(400, t("auth.otp_invalid", lang))

    # TODO: Émettre les tokens définitifs
    # access = create_access_token({"sub": str(payload["user_id"]), "role": user.role})
    # refresh = create_refresh_token({"sub": str(payload["user_id"])})

    return TokenResponse(
        access_token="<access_token>",
        refresh_token="<refresh_token>",
        token_type="bearer",
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Renouvellement du token d'accès",
)
async def refresh_token(body: RefreshRequest, request: Request):
    lang = get_lang(request)
    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, t("auth.token_invalid", lang))

    access = create_access_token({"sub": payload["sub"], "role": payload.get("role", "user")})
    return TokenResponse(
        access_token=access,
        refresh_token=body.refresh_token,
        token_type="bearer",
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout", response_model=MessageResponse, summary="Déconnexion")
async def logout(request: Request):
    lang = get_lang(request)
    # TODO: Blacklister le token en base / Redis
    return MessageResponse(message=t("auth.logout_success", lang))


@router.post(
    "/password-reset",
    response_model=MessageResponse,
    summary="Demande de réinitialisation de mot de passe",
)
async def password_reset_request(body: PasswordResetRequest, request: Request):
    lang = get_lang(request)
    # TODO: Si email existe → envoyer OTP de réinitialisation
    # Toujours retourner le même message (anti-enumeration)
    return MessageResponse(message=t("auth.password_reset_sent", lang))


@router.post(
    "/password-reset/confirm",
    response_model=MessageResponse,
    summary="Confirmation du nouveau mot de passe",
)
async def password_reset_confirm(body: PasswordResetConfirm, request: Request):
    lang = get_lang(request)
    # TODO: Vérifier OTP + mettre à jour le mot de passe
    return MessageResponse(message=t("auth.password_reset_success", lang))
