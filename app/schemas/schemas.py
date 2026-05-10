"""
ELOKO — Schémas Pydantic : Auth & Utilisateur
Ces schémas définissent la forme exacte des données échangées
entre le frontend et le backend (validation automatique par FastAPI).
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
import re


# ─── Auth ─────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    language: str = "fr"

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Minimum 8 caractères")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Au moins une majuscule requise")
        if not re.search(r"\d", v):
            raise ValueError("Au moins un chiffre requis")
        return v

    @field_validator("full_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Le nom ne peut pas être vide")
        return v.strip()


class RegisterResponse(BaseModel):
    message: str
    user_id: int
    email: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    message: str
    requires_otp: bool
    otp_token: Optional[str] = None  # Token temporaire pour l'étape OTP


class OTPVerifyRequest(BaseModel):
    otp_token: str  # Token temporaire reçu après le login
    code: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # secondes


class RefreshRequest(BaseModel):
    refresh_token: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    otp_token: str
    code: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8 or not re.search(r"[A-Z]", v) or not re.search(r"\d", v):
            raise ValueError("Mot de passe trop faible")
        return v


# ─── Utilisateur ──────────────────────────────────────────────

class UserProfile(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    language: str
    role: str
    is_verified: bool
    is_active: bool
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = None
    notification_email: Optional[bool] = None
    notification_sms: Optional[bool] = None

    @field_validator("language")
    @classmethod
    def valid_language(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in {"fr", "en"}:
            raise ValueError("Langue non supportée (fr ou en)")
        return v


class DeleteAccountRequest(BaseModel):
    code: str  # OTP de confirmation


# ─── Abonnements ──────────────────────────────────────────────

class PlanResponse(BaseModel):
    id: int
    name: str
    price: float
    currency: str
    features: dict
    is_active: bool


class SubscribeRequest(BaseModel):
    plan_id: int
    payment_method: str  # "orange_money" | "mtn_momo" | "wave" | "visa" | "paypal"
    phone: Optional[str] = None  # Requis pour Mobile Money


class SubscriptionResponse(BaseModel):
    id: int
    plan: str
    status: str
    start_date: datetime
    end_date: Optional[datetime]
    message: str


# ─── Réponse générique ────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None
