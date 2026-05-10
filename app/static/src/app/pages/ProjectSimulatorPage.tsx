import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { FolderKanban, Play, RotateCcw, Download } from "lucide-react";

const genBacktest = (initial: number, rate: number, volatility: number) =>
  Array.from({ length: 36 }, (_, i) => {
    const noise = (Math.random() - 0.5) * volatility * initial;
    return {
      month: `M${i + 1}`,
      portfolio: Math.max(0, initial * Math.pow(1 + rate / 12, i) + noise),
      benchmark: initial * Math.pow(1 + 0.08 / 12, i),
    };
  });

const STRATEGIES = [
  { name: "Momentum FX Africain", desc: "Long NGN/USD + Short ZAR/USD sur divergence SARB/CBN" },
  { name: "Carry Trade Frontier", desc: "Position sur spread de taux entre pays africains" },
  { name: "Cocoa Commodities Alpha", desc: "Futures sur matières premières agricoles West Africa" },
  { name: "Arbitrage JSE-EGX", desc: "Pairs trading entre JSE Top40 et EGX30" },
];

export function ProjectSimulatorPage() {
  const [capital, setCapital] = useState(100000);
  const [rate, setRate] = useState(18);
  const [volatility, setVolatility] = useState(0.15);
  const [strategy, setStrategy] = useState(STRATEGIES[0]);
  const [data, setData] = useState(() => genBacktest(100000, 0.18, 0.15));
  const [running, setRunning] = useState(false);

  function runBacktest() {
    setRunning(true);
    setTimeout(() => {
      setData(genBacktest(capital, rate / 100, volatility));
      setRunning(false);
    }, 1200);
  }

  const finalVal = data[data.length - 1]?.portfolio ?? capital;
  const totalReturn = ((finalVal - capital) / capital * 100).toFixed(1);
  const maxDD = "-12.4%";
  const sharpe = (rate / 100 / volatility).toFixed(2);

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: "#e2e2e8" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #2d323e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>LIVE MARKET FEED</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#43ed9e" }} />
          <span style={{ color: "#43ed9e", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}>OPERATIONAL</span>
        </div>
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ color: "#e2e2e8", fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Simulateur de Projet</h1>
            <p style={{ color: "#99907e", fontSize: "12px", margin: "4px 0 0" }}>Backtesting & simulation quantitative pour marchés africains</p>
          </div>
          <button onClick={() => {}} style={{
            background: "transparent", border: "1px solid #2d323e", borderRadius: "6px", padding: "8px 14px",
            color: "#e2e2e8", fontSize: "12px", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px"
          }}>
            <Download size={14} /> EXPORT
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Config Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px" }}>
              <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px" }}>PARAMÈTRES</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "6px" }}>CAPITAL INITIAL (USD)</label>
                  <input
                    type="number"
                    value={capital}
                    onChange={e => setCapital(Number(e.target.value))}
                    style={{
                      width: "100%", background: "#111318", border: "1px solid #2d323e", borderRadius: "4px",
                      padding: "8px 10px", color: "#e2e2e8", fontSize: "13px",
                      fontFamily: "'IBM Plex Mono', monospace", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "6px" }}>
                    RENDEMENT CIBLE ANNUEL: <span style={{ color: "#e6c364" }}>{rate}%</span>
                  </label>
                  <input type="range" min={5} max={50} value={rate} onChange={e => setRate(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#e6c364" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "6px" }}>
                    VOLATILITÉ: <span style={{ color: "#e6c364" }}>{(volatility * 100).toFixed(0)}%</span>
                  </label>
                  <input type="range" min={5} max={50} value={volatility * 100} onChange={e => setVolatility(Number(e.target.value) / 100)}
                    style={{ width: "100%", accentColor: "#e6c364" }} />
                </div>
              </div>
            </div>

            <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px" }}>
              <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "12px" }}>STRATÉGIES</div>
              {STRATEGIES.map(s => (
                <div key={s.name} onClick={() => setStrategy(s)} style={{
                  padding: "10px 12px", borderRadius: "6px", cursor: "pointer", marginBottom: "6px",
                  background: strategy.name === s.name ? "rgba(230,195,100,0.1)" : "transparent",
                  border: strategy.name === s.name ? "1px solid rgba(230,195,100,0.3)" : "1px solid transparent"
                }}>
                  <div style={{ color: "#e2e2e8", fontSize: "12px", fontWeight: 600 }}>{s.name}</div>
                  <div style={{ color: "#99907e", fontSize: "11px", marginTop: "2px", lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <button onClick={runBacktest} disabled={running} style={{
              background: "#e6c364", color: "#111318", border: "none", borderRadius: "6px", padding: "12px",
              fontSize: "13px", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              opacity: running ? 0.7 : 1
            }}>
              <Play size={14} /> {running ? "SIMULATION EN COURS..." : "LANCER LE BACKTEST"}
            </button>
          </div>

          {/* Results */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "CAPITAL FINAL", val: `$${(finalVal / 1000).toFixed(1)}k`, color: parseFloat(totalReturn) > 0 ? "#43ed9e" : "#ff4d6d" },
                { label: "RENDEMENT TOTAL", val: `${totalReturn}%`, color: parseFloat(totalReturn) > 0 ? "#43ed9e" : "#ff4d6d" },
                { label: "MAX DRAWDOWN", val: maxDD, color: "#ff4d6d" },
                { label: "RATIO SHARPE", val: sharpe, color: "#e6c364" },
              ].map(k => (
                <div key={k.label} style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "6px", padding: "14px" }}>
                  <div style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                  <div style={{ color: k.color, fontSize: "20px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px", flex: 1 }}>
              <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "4px" }}>PERFORMANCE SUR 36 MOIS</div>
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: 12, height: 2, background: "#e6c364" }} />
                  <span style={{ color: "#99907e", fontSize: "11px" }}>{strategy.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: 12, height: 2, background: "#99907e", borderTop: "2px dashed #99907e", height: 0 }} />
                  <span style={{ color: "#99907e", fontSize: "11px" }}>Benchmark (8%)</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fill: "#99907e", fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} interval={5} />
                  <YAxis tick={{ fill: "#99907e", fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "#1e2024", border: "1px solid #2d323e", borderRadius: "6px", color: "#e2e2e8", fontSize: "11px" }}
                    formatter={(v: number) => [`$${v.toFixed(0)}`, ""]}
                  />
                  <ReferenceLine y={capital} stroke="#2d323e" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="portfolio" stroke="#e6c364" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="benchmark" stroke="#99907e" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
