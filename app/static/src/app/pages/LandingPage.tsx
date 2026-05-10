import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BarChart2, Brain, Zap, Shield, Globe, Bell, CheckCircle,
  TrendingUp, ArrowRight, Activity
} from "lucide-react";

const TICKER = [
  { p: "NGN/USD", v: "1,452.30", c: "+1.24%", up: true },
  { p: "EGP/USD", v: "47.85", c: "+0.05%", up: true },
  { p: "GHS/USD", v: "13.20", c: "+0.08%", up: true },
  { p: "KGF/EUR", v: "695.95", c: "-0.28%", up: false },
  { p: "ZAR/USD", v: "18.92", c: "+0.12%", up: true },
  { p: "MAD/USD", v: "9.87", c: "-0.33%", up: false },
  { p: "KES/USD", v: "132.48", c: "-0.45%", up: false },
];

const FEATURES = [
  { icon: BarChart2, title: "Données de Marché", desc: "Accès direct aux carnets d'ordres et flux de prix en temps réel pour 54 marchés africains. Agrégation OTC et boursière." },
  { icon: Brain, title: "IA Prédictive", desc: "Modèles de machine learning entraînés spécifiquement sur les anomalies et la macroéconomie des marchés frontières." },
  { icon: Zap, title: "Simulation & Backtesting", desc: "Moteur de backtest haute performance. Validez vos stratégies quantitatives avec des données historiques nettoyées." },
  { icon: Globe, title: "Routage d'Exécution", desc: "Connectivité FIX aux principaux courtiers et fournisseurs de liquidité. Exécution multi-devises optimisée." },
  { icon: Bell, title: "Alertes Paramétriques", desc: "Configurez des triggers complexes basés sur la volatilité, le volume, ou des événements d'actualité NLP." },
  { icon: Shield, title: "Interface Bilingue", desc: "Basculement instantané Anglais/Français. Terminologie financière standardisée pour les institutions panafricaines." },
];

const PLANS = {
  mensuel: [
    {
      name: "STARTER", price: "$99", period: "/mo", popular: false,
      features: ["Données fin de journée (EOD)", "5 marchés de base", "Graphiques standards"],
      cta: "SÉLECTIONNER", ctaSecondary: true,
    },
    {
      name: "PROFESSIONAL", price: "$350", period: "/mo", popular: true,
      features: ["Données Temps Réel (15ms)", "Tous les marchés (54)", "API REST & WebSocket (Limité)", "Signaux IA de base"],
      cta: "COMMENCER L'ESSAI", ctaSecondary: false,
    },
    {
      name: "INSTITUTION", price: "Sur Mesure", period: "", popular: false,
      features: ["API & FIX illimitée", "Déploiement sur site possible", "Support SLA 24/7", "Accès Quant Lab"],
      cta: "CONTACTER VENTES", ctaSecondary: true,
    },
  ],
  annuel: [
    {
      name: "STARTER", price: "$79", period: "/mo", popular: false,
      features: ["Données fin de journée (EOD)", "5 marchés de base", "Graphiques standards"],
      cta: "SÉLECTIONNER", ctaSecondary: true,
    },
    {
      name: "PROFESSIONAL", price: "$280", period: "/mo", popular: true,
      features: ["Données Temps Réel (15ms)", "Tous les marchés (54)", "API REST & WebSocket (Limité)", "Signaux IA de base"],
      cta: "COMMENCER L'ESSAI", ctaSecondary: false,
    },
    {
      name: "INSTITUTION", price: "Sur Mesure", period: "", popular: false,
      features: ["API & FIX illimitée", "Déploiement sur site possible", "Support SLA 24/7", "Accès Quant Lab"],
      cta: "CONTACTER VENTES", ctaSecondary: true,
    },
  ],
};

// Simulated mini chart data
const CHART_POINTS = [40, 38, 42, 39, 45, 43, 48, 51, 49, 55, 58, 62, 60, 65, 63, 68, 72, 70, 75, 78];

export function LandingPage() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"mensuel" | "annuel">("mensuel");

  const maxV = Math.max(...CHART_POINTS);
  const minV = Math.min(...CHART_POINTS);
  const h = 80;
  const w = 280;
  const pts = CHART_POINTS.map((v, i) => {
    const x = (i / (CHART_POINTS.length - 1)) * w;
    const y = h - ((v - minV) / (maxV - minV)) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ background: "#111318", minHeight: "100vh", fontFamily: "'Manrope', sans-serif", color: "#e2e2e8" }}>
      {/* TOP NAV */}
      <header style={{ borderBottom: "1px solid #2d323e", background: "#0c0e12" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="flex items-center justify-between" style={{ height: 56 }}>
            <div className="flex items-center gap-8">
              <div style={{ color: "#e6c364", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.02em" }}>ELOKO</div>
              <nav className="hidden md:flex items-center gap-6">
                {["MARKETS", "ANALYTICS", "INTELLIGENCE", "PRICING", "API"].map(item => (
                  <a key={item} href="#" style={{ color: "#99907e", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textDecoration: "none" }}
                    className="hover:text-white transition-colors">{item}</a>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                style={{ color: "#99907e", background: "transparent", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", padding: "6px 12px" }}
              >
                CONNEXION
              </button>
              <button
                onClick={() => navigate("/app")}
                style={{
                  background: "#e6c364", color: "#111318", border: "none",
                  padding: "8px 16px", borderRadius: "6px",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em"
                }}
              >
                LAUNCH TERMINAL
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div style={{ background: "#0c0e12", borderBottom: "1px solid #2d323e", overflow: "hidden", padding: "6px 0" }}>
        <div style={{ display: "flex", gap: "40px", animation: "ticker-scroll 25s linear infinite", width: "max-content" }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", display: "flex", gap: "8px", alignItems: "center", padding: "0 20px" }}>
              <span style={{ color: "#99907e" }}>{t.p}</span>
              <span style={{ color: "#e2e2e8" }}>{t.v}</span>
              <span style={{ color: t.up ? "#43ed9e" : "#ff4d6d" }}>{t.up ? "▲" : "▼"} {t.c}</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
      </div>

      {/* HERO */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(230,195,100,0.1)", border: "1px solid rgba(230,195,100,0.3)",
              borderRadius: "4px", padding: "4px 10px", marginBottom: "24px"
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#43ed9e" }} />
              <span style={{ color: "#e6c364", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>NEW: INTELLIGENCE ARTIFICIELLE</span>
            </div>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif", fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1,
              color: "#e2e2e8", marginBottom: "20px", letterSpacing: "-0.02em"
            }}>
              L'Intelligence<br />
              Financière de<br />
              l'Afrique, en Temps<br />
              <span style={{ color: "#e6c364" }}>Réel.</span>
            </h1>
            <p style={{ color: "#99907e", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px", maxWidth: 440 }}>
              Plateforme institutionnelle d'analyse de marché, de flux de données et d'exécution pour
              les marchés frontières et émergents africains. Précision absolue, sans compromis.
            </p>
            <div className="flex gap-3 flex-wrap" style={{ marginBottom: "48px" }}>
              <button
                onClick={() => navigate("/app")}
                style={{
                  background: "#e6c364", color: "#111318", border: "none",
                  padding: "12px 24px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em"
                }}
              >
                DEMANDER UN ACCÈS
              </button>
              <button
                style={{
                  background: "transparent", color: "#e2e2e8",
                  border: "1px solid #2d323e",
                  padding: "12px 24px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer"
                }}
              >
                VOIR LA DÉMO
              </button>
            </div>
            <div className="flex gap-8">
              {[
                { val: "15ms", label: "LATENCE DONNÉES" },
                { val: "54", label: "MARCHÉS COUVERTS" },
                { val: "99.9%", label: "DISPONIBILITÉ UPTIME" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ color: "#e6c364", fontFamily: "'IBM Plex Mono', monospace", fontSize: "24px", fontWeight: 600 }}>{s.val}</div>
                  <div style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal mockup */}
          <div style={{ position: "relative" }}>
            <div style={{
              background: "#0c0e12", border: "1px solid #2d323e", borderRadius: "8px",
              overflow: "hidden", boxShadow: "0 0 60px rgba(230,195,100,0.05)"
            }}>
              <div style={{ background: "#1a1c20", padding: "8px 12px", borderBottom: "1px solid #2d323e", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>ELOKO_TERMINAL_V2.4</span>
                <div className="flex gap-1">
                  {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <div className="flex justify-between items-start" style={{ marginBottom: "8px" }}>
                  <div>
                    <div style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>NGN/USD</div>
                    <div style={{ color: "#43ed9e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>+1.24%</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#e2e2e8", fontSize: "28px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, lineHeight: 1 }}>1,452.30</div>
                    <div style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>Vol: 2k</div>
                  </div>
                </div>
                <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="80">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#43ed9e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#43ed9e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline points={pts} fill="none" stroke="#43ed9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#chartGrad)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#0c0e12", borderTop: "1px solid #2d323e", borderBottom: "1px solid #2d323e", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "36px", color: "#e2e2e8", marginBottom: "12px", letterSpacing: "-0.02em" }}>
              Architecture de Décision
            </h2>
            <p style={{ color: "#99907e", fontSize: "14px", maxWidth: 480 }}>
              Conçu sur une grille stricte pour une densité d'information maximale. Outils institutionnels pour l'écosystème financier africain.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: "#111318", border: "1px solid #2d323e", borderRadius: "8px",
                padding: "24px", transition: "border-color 0.2s"
              }}>
                <div style={{
                  width: 40, height: 40, background: "rgba(230,195,100,0.1)",
                  borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "16px"
                }}>
                  <f.icon size={20} style={{ color: "#e6c364" }} />
                </div>
                <h3 style={{ color: "#e2e2e8", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ color: "#99907e", fontSize: "13px", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "36px", color: "#e2e2e8", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Tarification Transparente
          </h2>
          <p style={{ color: "#99907e", fontSize: "14px", marginBottom: "24px" }}>
            Solutions adaptées de l'analyste indépendant au desk institutionnel.
          </p>
          <div style={{ display: "inline-flex", background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "6px", padding: "4px" }}>
            {(["mensuel", "annuel"] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                background: billing === b ? "#e6c364" : "transparent",
                color: billing === b ? "#111318" : "#99907e",
                border: "none", borderRadius: "4px", padding: "6px 16px",
                fontSize: "11px", fontWeight: 700, cursor: "pointer",
                letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}>
                {b === "annuel" ? "ANNUEL (-20%)" : "MENSUEL"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS[billing].map((plan) => (
            <div key={plan.name} style={{
              background: plan.popular ? "#1a1c20" : "#0c0e12",
              border: plan.popular ? "2px solid #e6c364" : "1px solid #2d323e",
              borderRadius: "8px", padding: "32px 24px",
              position: "relative",
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "#e6c364", color: "#111318", fontSize: "10px", fontWeight: 700,
                  padding: "2px 12px", borderRadius: "4px", letterSpacing: "0.06em"
                }}>PLUS POPULAIRE</div>
              )}
              <div style={{ color: "#99907e", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "8px" }}>{plan.name}</div>
              <div style={{ marginBottom: "24px" }}>
                <span style={{ color: "#e6c364", fontFamily: "'IBM Plex Mono', monospace", fontSize: plan.price === "Sur Mesure" ? "32px" : "42px", fontWeight: 600 }}>{plan.price}</span>
                {plan.period && <span style={{ color: "#99907e", fontSize: "14px", marginLeft: "4px" }}>{plan.period}</span>}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e2e2e8", fontSize: "13px" }}>
                    <CheckCircle size={14} style={{ color: "#43ed9e", flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(plan.ctaSecondary ? "/login" : "/app")}
                style={{
                  width: "100%", border: plan.ctaSecondary ? "1px solid #2d323e" : "none",
                  background: plan.ctaSecondary ? "transparent" : "#e6c364",
                  color: plan.ctaSecondary ? "#e2e2e8" : "#111318",
                  borderRadius: "6px", padding: "12px",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em"
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0c0e12", borderTop: "1px solid #2d323e", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em" }}>
            © 2024 ELOKO FINANCIAL INTELLIGENCE. ALL RIGHTS RESERVED. DATA DELAYED BY 15 MINS.
          </span>
          <div className="flex gap-4">
            {["PRIVACY POLICY", "TERMS OF SERVICE", "SECURITY ARCHITECTURE", "API DOCUMENTATION"].map(l => (
              <a key={l} href="#" style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
