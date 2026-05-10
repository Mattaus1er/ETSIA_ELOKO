"""
ELOKO — Internationalisation (i18n)
Principe : les réponses API n'embarquent jamais de texte en dur.
Chaque message est une clé (ex. "auth.invalid_credentials") dont la
traduction est lue dans locales/fr.json ou locales/en.json.

Utilisation dans une route :
    from app.core.i18n import t, get_lang
    lang = get_lang(request)
    raise HTTPException(400, detail=t("auth.weak_password", lang))
"""
import json
import os
from functools import lru_cache
from typing import Optional

from fastapi import Request

SUPPORTED_LANGS = {"fr", "en"}
DEFAULT_LANG = "fr"
LOCALES_DIR = os.path.join(os.path.dirname(__file__), "..", "locales")


@lru_cache(maxsize=None)
def _load(lang: str) -> dict:
    """Charge et met en cache le fichier de traduction."""
    path = os.path.join(LOCALES_DIR, f"{lang}.json")
    if not os.path.exists(path):
        path = os.path.join(LOCALES_DIR, f"{DEFAULT_LANG}.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def t(key: str, lang: str = DEFAULT_LANG, **kwargs) -> str:
    """
    Retourne la traduction d'une clé avec interpolation optionnelle.
    Exemple : t("user.welcome", lang, name="NJOCK") → "Bienvenue, NJOCK !"
    Clé manquante → retourne la clé elle-même (jamais une erreur).
    """
    if lang not in SUPPORTED_LANGS:
        lang = DEFAULT_LANG

    translations = _load(lang)
    # Navigation dans les clés imbriquées : "auth.invalid_credentials"
    value = translations
    for part in key.split("."):
        if isinstance(value, dict):
            value = value.get(part, key)
        else:
            return key

    if not isinstance(value, str):
        return key

    return value.format(**kwargs) if kwargs else value


def get_lang(request: Request) -> str:
    """
    Détecte la langue depuis :
    1. Query param  ?lang=en
    2. Header       Accept-Language
    3. Défaut       fr
    """
    # 1. Query param explicite
    lang = request.query_params.get("lang")
    if lang and lang in SUPPORTED_LANGS:
        return lang

    # 2. Header Accept-Language (premier code seulement)
    accept = request.headers.get("Accept-Language", "")
    for segment in accept.split(","):
        code = segment.strip().split(";")[0].strip()[:2].lower()
        if code in SUPPORTED_LANGS:
            return code

    return DEFAULT_LANG
