import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

const SIGNALS = [
  { asset: "NGN/USD", direction: "LONG", confidence: 82, horizon: "48H", reason: "CBN FX supply increase + positive trade balance", status: "ACTIVE" },
  { asset: "Cocoa Futures", direction: "LONG", confidence: 91, horizon: "72H", reason: "West African harvest shortfall + historic resistance breach", status: "ACTIVE" },
  { asset: "JSE Top 40", direction: "SHORT", confidence: 67, horizon: "24H", reason: "RSA PMI below 48 + ZAR weakness signal", status: "WATCH" },
  { asset: "Copper (LME)", direction: "LONG", confidence: 74, horizon: "5J", reason: "DRC production cut + China stimulus demand", status: "ACTIVE" },
  { asset: "EGP/USD", direction: "NEUTRAL", confidence: 55, horizon: "24H", reason: "CBE decision ambiguity + mixed inflation data", status: "WATCH" },
];

const radarData = [
  { subject: "Momentum", A: 80, B: 55 },
  { subject: "Volatilité", A: 60, B: 75 },
  { subject: "Liquidité", A: 90, B: 65 },
  { subject: "Sentiment", A: 72, B: 50 },
  { subject: "Macro", A: 85, B: 60 },
  { subject: "Technique", A: 68, B: 72 },
];

const forecastData = Array.from({ length: 20 }, (_, i) => ({
  t: i,
  actual: i < 15 ? 1440 + i * 1.2 + Math.sin(i) * 4 : null,
  forecast: i >= 13 ? 1440 + 13 * 1.2 + Math.sin(13) * 4 + (i - 13) * 1.8 : null,
  upper: i >= 13 ? 1440 + 13 * 1.2 + Math.sin(13) * 4 + (i - 13) * 1.8 + (i - 13) * 2 : null,
  lower: i >= 13 ? 1440 + 13 * 1.2 + Math.sin(13) * 4 + (i - 13) * 1.8 - (i - 13) * 2 : null,
}));

export function AIPredictivePage() {
  const [selected, setSelected] = useState(SIGNALS[0]);

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: "#e2e2e8" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #2d323e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>LIVE MARKET FEED</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#43ed9e" }} />
          <span style={{ color: "#43ed9e", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}>OPERATIONAL</span>
        </div>
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "rgba(230,195,100,0.1)", borderRadius: "8px", padding: "10px" }}>
            <Brain size={24} style={{ color: "#e6c364" }} />
          </div>
          <div>
            <h1 style={{ color: "#e2e2e8", fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>IA Prédictive</h1>
            <p style={{ color: "#99907e", fontSize: "12px", margin: 0 }}>Modèles de machine learning pour marchés frontières africains</p>
          </div>
          <div style={{ marginLeft: "auto", background: "rgba(67,237,158,0.1)", border: "1px solid rgba(67,237,158,0.3)", borderRadius: "6px", padding: "6px 14px" }}>
            <span style={{ color: "#43ed9e", fontSize: "12px", fontWeight: 700 }}>MODÈLE ACTIF: v3.2.1</span>
          </div>
        </div>

        {/* Signals Grid */}
        <div>
          <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "12px" }}>SIGNAUX IA ACTIFS</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SIGNALS.map(s => (
              <div key={s.asset} onClick={() => setSelected(s)} style={{
                background: selected.asset === s.asset ? "#1e2024" : "#1a1c20",
                border: selected.asset === s.asset ? "1px solid #e6c364" : "1px solid #2d323e",
                borderRadius: "8px", padding: "16px", cursor: "pointer"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ color: "#e2e2e8", fontSize: "13px", fontWeight: 700 }}>{s.asset}</span>
                  <span style={{
                    background: s.direction === "LONG" ? "rgba(67,237,158,0.15)" : s.direction === "SHORT" ? "rgba(255,77,109,0.15)" : "rgba(153,144,126,0.15)",
                    color: s.direction === "LONG" ? "#43ed9e" : s.direction === "SHORT" ? "#ff4d6d" : "#99907e",
                    fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.06em"
                  }}>{s.direction}</span>
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#99907e", fontSize: "11px" }}>Confiance</span>
                    <span style={{ color: "#e6c364", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{s.confidence}%</span>
                  </div>
                  <div style={{ height: 4, background: "#2d323e", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: `${s.confidence}%`, background: "#e6c364", borderRadius: "2px" }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#99907e", fontSize: "11px" }}>Horizon: <span style={{ color: "#e2e2e8", fontFamily: "'IBM Plex Mono', monospace" }}>{s.horizon}</span></span>
                  <span style={{
                    background: s.status === "ACTIVE" ? "rgba(67,237,158,0.1)" : "rgba(230,195,100,0.1)",
                    color: s.status === "ACTIVE" ? "#43ed9e" : "#e6c364",
                    fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", letterSpacing: "0.06em"
                  }}>{s.status}</span>
                </div>
                <p style={{ color: "#99907e", fontSize: "11px", marginTop: "8px", lineHeight: 1.5, margin: "8px 0 0" }}>{s.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Forecast */}
          <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px" }}>
            <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "4px" }}>PRÉVISION IA — {selected.asset}</div>
            <div style={{ color: "#e2e2e8", fontSize: "20px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, marginBottom: "16px" }}>
              Confiance: <span style={{ color: "#e6c364" }}>{selected.confidence}%</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={forecastData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="t" tick={{ fill: "#99907e", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#99907e", fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: "#1e2024", border: "1px solid #2d323e", borderRadius: "6px", color: "#e2e2e8", fontSize: "11px" }} />
                <Line type="monotone" dataKey="actual" stroke="#e2e2e8" strokeWidth={2} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke="#e6c364" strokeWidth={2} strokeDasharray="5 3" dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="upper" stroke="#e6c364" strokeWidth={1} strokeDasharray="2 4" dot={false} opacity={0.4} connectNulls={false} />
                <Line type="monotone" dataKey="lower" stroke="#e6c364" strokeWidth={1} strokeDasharray="2 4" dot={false} opacity={0.4} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px" }}>
            <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "4px" }}>ANALYSE MULTI-FACTEURS</div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: 10, height: 2, background: "#e6c364" }} />
                <span style={{ color: "#99907e", fontSize: "11px" }}>Bullish</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: 10, height: 2, background: "#ff4d6d" }} />
                <span style={{ color: "#99907e", fontSize: "11px" }}>Bearish</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2d323e" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#99907e", fontSize: 10 }} />
                <Radar name="Bull" dataKey="A" stroke="#e6c364" fill="#e6c364" fillOpacity={0.15} />
                <Radar name="Bear" dataKey="B" stroke="#ff4d6d" fill="#ff4d6d" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
