from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Application
    APP_NAME: str = "ELOKO"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = False
    DEFAULT_LANGUAGE: str = "fr"

    # Security
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    OTP_EXPIRE_SECONDS: int = 600
    MAX_LOGIN_ATTEMPTS: int = 5

    # Database
    DATABASE_URL: str
    MONGODB_URL: str = "mongodb://localhost:27017/eloko_sessions"

    # Modules internes
    MARKET_MODULE_URL: str = "http://localhost:8001"
    COLLECTION_MODULE_URL: str = "http://localhost:8002"
    PREDICTION_MODULE_URL: str = "http://localhost:8003"

    # Email
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@eloko.africa"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    # Paiements
    STRIPE_SECRET_KEY: str = ""
    ORANGE_MONEY_API_KEY: str = ""
    MTN_MOMO_API_KEY: str = ""
    WAVE_API_KEY: str = ""

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


settings = Settings()
