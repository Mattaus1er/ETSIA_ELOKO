"""
ELOKO — Couche sécurité
Responsabilités : hachage des mots de passe, génération/vérification JWT,
génération OTP TOTP, et helpers d'injection de dépendances FastAPI.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional

import pyotp
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

# ─── Hachage mot de passe ────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

security_scheme = HTTPBearer()


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─── JWT ─────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload.update({"exp": expire, "type": "access"})
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(data: dict) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload.update({"exp": expire, "type": "refresh"})
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ─── OTP ─────────────────────────────────────────────────────
def generate_otp_secret() -> str:
    """Génère un secret TOTP unique par utilisateur."""
    return pyotp.random_base32()


def generate_otp(secret: str) -> str:
    """Génère le code OTP courant (valide 10 min, interval=600)."""
    totp = pyotp.TOTP(secret, interval=settings.OTP_EXPIRE_SECONDS)
    return totp.now()


def verify_otp(secret: str, code: str) -> bool:
    """Vérifie un code OTP avec tolérance d'1 intervalle."""
    totp = pyotp.TOTP(secret, interval=settings.OTP_EXPIRE_SECONDS)
    return totp.verify(code, valid_window=1)


# ─── Dépendance FastAPI ───────────────────────────────────────
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> dict:
    """
    Injecte l'utilisateur courant dans chaque route protégée.
    Usage : current_user: dict = Depends(get_current_user)
    """
    token = credentials.credentials
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Type de token invalide",
        )
    return payload


async def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Vérifie que l'utilisateur courant est administrateur."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs",
        )
    return current_user
