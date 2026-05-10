"""
SQLAlchemy 2.x models — Plateforme Financière Africaine.
14 tables pour PostgreSQL + TimescaleDB.
"""

import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Boolean, BigInteger, Date, DateTime, ForeignKey, Index, Integer,
    Numeric, String, Text, Time, UniqueConstraint, func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base déclarative pour tous les modèles."""
    pass


class TimestampMixin:
    """Mixin pour ajouter updated_at automatiquement."""
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )


# ─── TABLE 1 : currencies ────────────────────────────────────────
class Currency(Base, TimestampMixin):
    """Devises référencées dans la plateforme."""
    __tablename__ = "currencies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(100))
    country_iso3: Mapped[Optional[str]] = mapped_column(String(3))
    is_fiat: Mapped[bool] = mapped_column(Boolean, default=True)
    xof_fixed: Mapped[bool] = mapped_column(Boolean, default=False)
    xof_rate: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 6))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 2 : countries ─────────────────────────────────────────
class Country(Base, TimestampMixin):
    """Pays africains et partenaires commerciaux."""
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    iso3: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    iso2: Mapped[Optional[str]] = mapped_column(String(2))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    region: Mapped[Optional[str]] = mapped_column(String(100))
    income_level: Mapped[Optional[str]] = mapped_column(String(50))
    capital_city: Mapped[Optional[str]] = mapped_column(String(100))
    currency_code: Mapped[Optional[str]] = mapped_column(
        String(10), ForeignKey("currencies.code")
    )
    longitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    latitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    wb_region_code: Mapped[Optional[str]] = mapped_column(String(10))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


# ─── TABLE 3 : exchanges ─────────────────────────────────────────
class Exchange(Base, TimestampMixin):
    """Bourses africaines (NGX, JSE, BRVM, etc.)."""
    __tablename__ = "exchanges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(200))
    country_iso3: Mapped[Optional[str]] = mapped_column(
        String(3), ForeignKey("countries.iso3")
    )
    currency_code: Mapped[Optional[str]] = mapped_column(
        String(10), ForeignKey("currencies.code")
    )
    timezone: Mapped[Optional[str]] = mapped_column(String(50))
    open_time: Mapped[Optional[datetime.time]] = mapped_column(Time)
    close_time: Mapped[Optional[datetime.time]] = mapped_column(Time)
    eodhd_code: Mapped[Optional[str]] = mapped_column(String(20))
    fcs_exchange: Mapped[Optional[str]] = mapped_column(String(20))
    source: Mapped[Optional[str]] = mapped_column(String(50))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 4 : instruments ───────────────────────────────────────
class Instrument(Base, TimestampMixin):
    """Instruments financiers (equity, etf, index, fund)."""
    __tablename__ = "instruments"
    __table_args__ = (UniqueConstraint("symbol", "exchange_code"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(50), nullable=False)
    exchange_code: Mapped[Optional[str]] = mapped_column(
        String(20), ForeignKey("exchanges.code")
    )
    isin: Mapped[Optional[str]] = mapped_column(String(12))
    name: Mapped[Optional[str]] = mapped_column(String(200))
    instrument_type: Mapped[Optional[str]] = mapped_column(String(20))
    currency_code: Mapped[Optional[str]] = mapped_column(
        String(10), ForeignKey("currencies.code")
    )
    country_iso3: Mapped[Optional[str]] = mapped_column(
        String(3), ForeignKey("countries.iso3")
    )
    sector: Mapped[Optional[str]] = mapped_column(String(100))
    industry: Mapped[Optional[str]] = mapped_column(String(100))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    first_trade_date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 5 : companies ─────────────────────────────────────────
class Company(Base, TimestampMixin):
    """Profils d'entreprises cotées."""
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    instrument_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("instruments.id")
    )
    symbol: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(200))
    description: Mapped[Optional[str]] = mapped_column(Text)
    ceo: Mapped[Optional[str]] = mapped_column(String(200))
    employees: Mapped[Optional[int]] = mapped_column(Integer)
    hq_country: Mapped[Optional[str]] = mapped_column(
        String(3), ForeignKey("countries.iso3")
    )
    hq_city: Mapped[Optional[str]] = mapped_column(String(100))
    website: Mapped[Optional[str]] = mapped_column(String(500))
    market_cap_usd: Mapped[Optional[int]] = mapped_column(BigInteger)
    shares_outstanding: Mapped[Optional[int]] = mapped_column(BigInteger)
    shares_float: Mapped[Optional[int]] = mapped_column(BigInteger)
    beta: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 4))
    dividend_yield: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 6))
    pe_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    data_quality: Mapped[str] = mapped_column(String(20), default="OK")
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


# ─── TABLE 6 : price_daily (hypertable) ──────────────────────────
class PriceDaily(Base, TimestampMixin):
    """Prix journaliers — hypertable TimescaleDB sur (date)."""
    __tablename__ = "price_daily"

    date: Mapped[datetime.date] = mapped_column(Date, primary_key=True, nullable=False)
    symbol: Mapped[str] = mapped_column(String(50), primary_key=True, nullable=False)
    exchange_code: Mapped[Optional[str]] = mapped_column(String(20))
    open: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 6))
    high: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 6))
    low: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 6))
    close: Mapped[Decimal] = mapped_column(Numeric(20, 6), nullable=False)
    close_usd: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 6))
    volume: Mapped[Optional[int]] = mapped_column(BigInteger)
    adjusted_close: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 6))
    split_ratio: Mapped[Decimal] = mapped_column(Numeric(10, 6), default=1.0)
    dividend: Mapped[Decimal] = mapped_column(Numeric(20, 6), default=0.0)
    is_trading_day: Mapped[bool] = mapped_column(Boolean, default=True)
    data_quality: Mapped[str] = mapped_column(String(20), default="OK")
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 7 : fx_rates (hypertable) ─────────────────────────────
class FxRate(Base, TimestampMixin):
    """Taux de change — hypertable TimescaleDB."""
    __tablename__ = "fx_rates"

    date: Mapped[datetime.date] = mapped_column(Date, primary_key=True, nullable=False)
    base_currency: Mapped[str] = mapped_column(String(10), primary_key=True, nullable=False)
    quote_currency: Mapped[str] = mapped_column(String(10), primary_key=True, nullable=False)
    rate_type: Mapped[str] = mapped_column(String(20), primary_key=True, default="official")
    rate: Mapped[Decimal] = mapped_column(Numeric(20, 6), nullable=False)
    source: Mapped[Optional[str]] = mapped_column(String(50))
    obs_status: Mapped[Optional[str]] = mapped_column(String(5))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 8 : macro_indicators (hypertable) ─────────────────────
class MacroIndicator(Base, TimestampMixin):
    """Indicateurs macroéconomiques — hypertable TimescaleDB."""
    __tablename__ = "macro_indicators"

    date: Mapped[datetime.date] = mapped_column(Date, primary_key=True, nullable=False)
    country_iso3: Mapped[str] = mapped_column(
        String(3), ForeignKey("countries.iso3"), primary_key=True, nullable=False
    )
    indicator_code: Mapped[str] = mapped_column(String(50), primary_key=True, nullable=False)
    indicator_name: Mapped[Optional[str]] = mapped_column(String(200))
    value: Mapped[Optional[Decimal]] = mapped_column(Numeric(30, 6))
    value_normalized: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 8))
    yoy_change: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 6))
    mom_change: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 6))
    unit: Mapped[Optional[str]] = mapped_column(String(50))
    unit_multiplier: Mapped[Optional[str]] = mapped_column(String(20))
    frequency: Mapped[Optional[str]] = mapped_column(String(10))
    obs_status: Mapped[Optional[str]] = mapped_column(String(5))
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 9 : wb_revisions ──────────────────────────────────────
class WbRevision(Base, TimestampMixin):
    """Log des révisions de données World Bank."""
    __tablename__ = "wb_revisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    country_iso3: Mapped[Optional[str]] = mapped_column(String(3))
    indicator_code: Mapped[Optional[str]] = mapped_column(String(50))
    date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    old_value: Mapped[Optional[Decimal]] = mapped_column(Numeric(30, 6))
    new_value: Mapped[Optional[Decimal]] = mapped_column(Numeric(30, 6))
    revision_date: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    pct_change: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4))


# ─── TABLE 10 : financial_statements ─────────────────────────────
class FinancialStatement(Base, TimestampMixin):
    """États financiers consolidés (income, balance, cashflow)."""
    __tablename__ = "financial_statements"
    __table_args__ = (
        UniqueConstraint("symbol", "period_ending", "period_type", "statement_type"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(50), nullable=False)
    period_ending: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    period_type: Mapped[Optional[str]] = mapped_column(String(10))
    statement_type: Mapped[Optional[str]] = mapped_column(String(20))
    currency_code: Mapped[Optional[str]] = mapped_column(String(10))
    # Income statement
    total_revenue: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    operating_revenue: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    gross_profit: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    operating_income: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    net_income: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    ebit: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    ebitda: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    basic_eps: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    diluted_eps: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    # Balance sheet
    total_assets: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    total_liabilities: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    total_equity: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    cash_and_equivalents: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    total_debt: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    net_debt: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    working_capital: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    # Cash flow
    operating_cash_flow: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    investing_cash_flow: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    financing_cash_flow: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    free_cash_flow: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    capital_expenditure: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 2))
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 11 : financial_ratios ─────────────────────────────────
class FinancialRatio(Base, TimestampMixin):
    """Ratios financiers et métriques de valorisation."""
    __tablename__ = "financial_ratios"
    __table_args__ = (UniqueConstraint("symbol", "period_ending"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(50), nullable=False)
    period_ending: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    currency_code: Mapped[Optional[str]] = mapped_column(String(10))
    market_cap_usd: Mapped[Optional[int]] = mapped_column(BigInteger)
    pe_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    forward_pe: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    peg_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    price_to_book: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    ev_to_ebitda: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    ev_to_revenue: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    debt_to_equity: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    current_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    quick_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4))
    gross_margin: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    operating_margin: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    net_margin: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    ebitda_margin: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    return_on_assets: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    return_on_equity: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    beta: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 4))
    dividend_yield: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    payout_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    earnings_growth: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    revenue_growth: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 6))
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 12 : corporate_actions ────────────────────────────────
class CorporateAction(Base, TimestampMixin):
    """Actions corporate (dividendes, splits, fusions)."""
    __tablename__ = "corporate_actions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(50), nullable=False)
    action_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    action_type: Mapped[Optional[str]] = mapped_column(String(20))
    value: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 6))
    currency_code: Mapped[Optional[str]] = mapped_column(String(10))
    notes: Mapped[Optional[str]] = mapped_column(Text)
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 13 : wb_documents ─────────────────────────────────────
class WbDocument(Base, TimestampMixin):
    """Documents de recherche World Bank."""
    __tablename__ = "wb_documents"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    title: Mapped[Optional[str]] = mapped_column(String(500))
    doc_type: Mapped[Optional[str]] = mapped_column(String(100))
    publication_date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    pdf_url: Mapped[Optional[str]] = mapped_column(String(1000))
    countries: Mapped[Optional[str]] = mapped_column(String(500))
    language: Mapped[Optional[str]] = mapped_column(String(10))
    topics: Mapped[Optional[str]] = mapped_column(Text)
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 14 : data_collection_log ──────────────────────────────
class DataCollectionLog(Base, TimestampMixin):
    """Traçabilité des collectes de données."""
    __tablename__ = "data_collection_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[Optional[str]] = mapped_column(String(50))
    route_name: Mapped[Optional[str]] = mapped_column(String(200))
    started_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(timezone=True))
    duration_ms: Mapped[Optional[int]] = mapped_column(Integer)
    records_fetched: Mapped[Optional[int]] = mapped_column(Integer)
    records_inserted: Mapped[Optional[int]] = mapped_column(Integer)
    records_updated: Mapped[Optional[int]] = mapped_column(Integer)
    status: Mapped[Optional[str]] = mapped_column(String(20))
    error_message: Mapped[Optional[str]] = mapped_column(Text)
    api_cost_units: Mapped[Optional[int]] = mapped_column(Integer)
    raw_data_path: Mapped[Optional[str]] = mapped_column(String(500))  # Nouveau champ



# ─── TABLE 15 : oil_prices (hypertable) ───────────────────────────
class OilPrice(Base):
    """Prix des commodités énergétiques et métaux précieux."""
    __tablename__ = "oil_prices"

    date: Mapped[datetime.date] = mapped_column(Date, primary_key=True, nullable=False)
    brent_usd: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4))
    wti_usd: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4))
    nat_gas_usd: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4))
    gold_usd: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4))
    source: Mapped[str] = mapped_column(String(50), default="openbb_yfinance")
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 16 : market_sentiment (hypertable) ──────────────────────
class MarketSentiment(Base):
    """Sentiment de marché et aversion au risque."""
    __tablename__ = "market_sentiment"

    date: Mapped[datetime.date] = mapped_column(Date, primary_key=True, nullable=False)
    vix: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 4))
    vix_change: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 4))
    em_spread_bps: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4))
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 17 : central_bank_rates (hypertable) ─────────────────────
class CentralBankRate(Base):
    """Taux directeurs des banques centrales."""
    __tablename__ = "central_bank_rates"

    date: Mapped[datetime.date] = mapped_column(Date, primary_key=True, nullable=False)
    country_iso3: Mapped[str] = mapped_column(String(3), primary_key=True, nullable=False)
    rate_type: Mapped[str] = mapped_column(String(30), primary_key=True, default="policy")
    rate_value: Mapped[Decimal] = mapped_column(Numeric(8, 4), nullable=False)
    decision_type: Mapped[Optional[str]] = mapped_column(String(10)) # hike, cut, hold
    source: Mapped[Optional[str]] = mapped_column(String(50))
    collected_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 18 : market_events ──────────────────────────────────────
class MarketEvent(Base):
    """Événements de marché majeurs et chocs exogènes."""
    __tablename__ = "market_events"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    event_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    country_iso3: Mapped[str] = mapped_column(String(3), nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[int] = mapped_column(Integer) # 1-5
    description: Mapped[Optional[str]] = mapped_column(Text)
    affected_symbols: Mapped[Optional[str]] = mapped_column(String(500)) # JSON string
    impact_forex: Mapped[bool] = mapped_column(Boolean, default=False)
    impact_equity: Mapped[bool] = mapped_column(Boolean, default=False)
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    auto_detected: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 19 : backfill_status ────────────────────────────────────
class BackfillStatus(Base):
    """Suivi du backfill historique Mansa Markets."""
    __tablename__ = "backfill_status"

    ticker: Mapped[str] = mapped_column(String(50), primary_key=True)
    exchange: Mapped[str] = mapped_column(String(20), primary_key=True)
    source: Mapped[str] = mapped_column(String(50), primary_key=True)
    from_date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    to_date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    records_count: Mapped[Optional[int]] = mapped_column(Integer)
    completed_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ─── TABLE 20 : wb_publication_log ──────────────────────────────────
class WbPublicationLog(Base):
    """Log de première parution des données World Bank (anti data leakage)."""
    __tablename__ = "wb_publication_log"

    indicator_code: Mapped[str] = mapped_column(String(50), primary_key=True)
    country_iso3: Mapped[str] = mapped_column(String(3), primary_key=True)
    data_year: Mapped[int] = mapped_column(Integer, primary_key=True)
    first_seen_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)


# ═══ INDEX supplémentaires (créés dans la migration Alembic) ═══
# idx_price_daily_symbol        ON price_daily(symbol)
# idx_fx_rates_pair             ON fx_rates(base_currency, quote_currency)
# idx_macro_country             ON macro_indicators(country_iso3)
# idx_macro_indicator           ON macro_indicators(indicator_code)
# idx_financial_stmt_symbol     ON financial_statements(symbol)
# idx_financial_ratios_symbol   ON financial_ratios(symbol)
# idx_market_events_country     ON market_events(country_iso3, event_date)
