import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Activity, Globe, Zap, AlertTriangle } from "lucide-react";

const areaData = [
  { t: "09:00", ngn: 1440, egp: 47.2 }, { t: "09:30", ngn: 1443, egp: 47.4 },
  { t: "10:00", ngn: 1446, egp: 47.3 }, { t: "10:30", ngn: 1444, egp: 47.6 },
  { t: "11:00", ngn: 1449, egp: 47.5 }, { t: "11:30", ngn: 1447, egp: 47.7 },
  { t: "12:00", ngn: 1451, egp: 47.8 }, { t: "12:30", ngn: 1450, egp: 47.9 },
  { t: "13:00", ngn: 1452, egp: 47.85 },
];

const barData = [
  { m: "NGX", vol: 2.4 }, { m: "JSE", vol: 8.1 }, { m: "EGX", vol: 1.9 },
  { m: "BRVM", vol: 0.7 }, { m: "NSE", vol: 1.2 }, { m: "DSE", vol: 0.4 },
];

const MARKETS = [
  { name: "NGN/USD", price: "1,452.30", change: "+1.24%", up: true, vol: "2.4B" },
  { name: "JSE Top 40", price: "73,481.20", change: "-0.34%", up: false, vol: "8.1B" },
  { name: "EGP/USD", price: "47.85", change: "+0.05%", up: true, vol: "1.9B" },
  { name: "BRVM Composite", price: "215.48", change: "+0.72%", up: true, vol: "0.7B" },
  { name: "GHS/USD", price: "13.20", change: "+0.08%", up: true, vol: "0.5B" },
  { name: "ZAR/USD", price: "18.92", change: "+0.12%", up: true, vol: "3.1B" },
];

const ALERTS = [
  { msg: "NGN/USD breach 1,450 resistance level", time: "14:02", severity: "warn" },
  { msg: "SARB Interest Rate Decision — 16:30 GMT", time: "13:45", severity: "info" },
  { msg: "BRVM: Volume spike detected +340%", time: "13:12", severity: "warn" },
  { msg: "CBN FX reserves update: $33.2B", time: "12:58", severity: "info" },
];

const SENTIMENT = { score: 64.2, label: "BULLISH", equities: "+1.4%", fx: "-0.8%" };

const Card = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
  <div style={{
    background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px",
    padding: "20px", ...style
  }}>
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "6px" }}>
    {children}
  </div>
);

export function DashboardPage() {
  return (
    <div style={{ padding: "0", fontFamily: "'Manrope', sans-serif", color: "#e2e2e8" }}>
      {/* Header */}
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
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "AI SENTIMENT", val: "64.2", sub: "BULLISH", subColor: "#43ed9e", icon: Activity },
            { label: "MARCHÉS ACTIFS", val: "54", sub: "+3 ce mois", subColor: "#e6c364", icon: Globe },
            { label: "LATENCE DONNÉES", val: "15ms", sub: "Optimal", subColor: "#43ed9e", icon: Zap },
            { label: "ALERTES ACTIVES", val: "7", sub: "3 critiques", subColor: "#ff4d6d", icon: AlertTriangle },
          ].map(k => (
            <Card key={k.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <Label>{k.label}</Label>
                  <div style={{ color: "#e2e2e8", fontSize: "28px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, lineHeight: 1 }}>{k.val}</div>
                  <div style={{ color: k.subColor, fontSize: "11px", fontWeight: 600, marginTop: "6px" }}>{k.sub}</div>
                </div>
                <div style={{ background: "rgba(230,195,100,0.1)", borderRadius: "8px", padding: "8px" }}>
                  <k.icon size={18} style={{ color: "#e6c364" }} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Chart */}
          <div style={{ gridColumn: "span 2" }}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <Label>NGN/USD — INTRAJOURNALIER</Label>
                  <div style={{ color: "#e2e2e8", fontSize: "22px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>1,452.30</div>
                </div>
                <div style={{ background: "rgba(67,237,158,0.15)", border: "1px solid rgba(67,237,158,0.3)", borderRadius: "4px", padding: "4px 10px" }}>
                  <span style={{ color: "#43ed9e", fontSize: "12px", fontWeight: 700 }}>▲ +1.24%</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={areaData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ngnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#43ed9e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#43ed9e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: "#99907e", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#99907e", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ background: "#1e2024", border: "1px solid #2d323e", borderRadius: "6px", color: "#e2e2e8", fontSize: "11px" }}
                    labelStyle={{ color: "#99907e" }}
                  />
                  <Area type="monotone" dataKey="ngn" stroke="#43ed9e" fill="url(#ngnGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* AI Sentiment */}
          <Card>
            <Label>AI MACRO SENTIMENT</Label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ color: "#43ed9e", fontSize: "40px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{SENTIMENT.score}</div>
              <div style={{ background: "rgba(67,237,158,0.15)", border: "1px solid #43ed9e", borderRadius: "4px", padding: "3px 8px" }}>
                <span style={{ color: "#43ed9e", fontSize: "11px", fontWeight: 700 }}>BULLISH</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#99907e", fontSize: "11px" }}>Equities</span>
                  <span style={{ color: "#43ed9e", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace" }}>{SENTIMENT.equities}</span>
                </div>
                <div style={{ height: 4, background: "#2d323e", borderRadius: "2px" }}>
                  <div style={{ height: "100%", width: "65%", background: "#43ed9e", borderRadius: "2px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#99907e", fontSize: "11px" }}>FX Markets</span>
                  <span style={{ color: "#ff4d6d", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace" }}>{SENTIMENT.fx}</span>
                </div>
                <div style={{ height: 4, background: "#2d323e", borderRadius: "2px" }}>
                  <div style={{ height: "100%", width: "35%", background: "#ff4d6d", borderRadius: "2px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#99907e", fontSize: "11px" }}>Commodities</span>
                  <span style={{ color: "#43ed9e", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace" }}>+2.1%</span>
                </div>
                <div style={{ height: 4, background: "#2d323e", borderRadius: "2px" }}>
                  <div style={{ height: "100%", width: "78%", background: "#43ed9e", borderRadius: "2px" }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Markets + Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Markets Table */}
          <div style={{ gridColumn: "span 2" }}>
            <Card style={{ padding: 0 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d323e" }}>
                <Label>MARCHÉS EN DIRECT</Label>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["MARCHÉ", "PRIX", "VAR. %", "VOLUME"].map(h => (
                      <th key={h} style={{
                        padding: "10px 20px", color: "#99907e", fontSize: "9px",
                        fontWeight: 700, letterSpacing: "0.08em", textAlign: "left",
                        borderBottom: "1px solid #2d323e"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MARKETS.map((m, i) => (
                    <tr key={m.name} style={{ borderBottom: i < MARKETS.length - 1 ? "1px solid #1e2024" : "none" }}>
                      <td style={{ padding: "12px 20px", color: "#e2e2e8", fontSize: "13px", fontWeight: 600 }}>{m.name}</td>
                      <td style={{ padding: "12px 20px", color: "#e2e2e8", fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace" }}>{m.price}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{
                          background: m.up ? "rgba(67,237,158,0.15)" : "rgba(255,77,109,0.15)",
                          color: m.up ? "#43ed9e" : "#ff4d6d",
                          fontSize: "11px", fontWeight: 700, padding: "2px 8px",
                          borderRadius: "4px", fontFamily: "'IBM Plex Mono', monospace",
                          display: "inline-flex", alignItems: "center", gap: "3px"
                        }}>
                          {m.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {m.change}
                        </span>
                      </td>
                      <td style={{ padding: "12px 20px", color: "#99907e", fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace" }}>{m.vol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Alerts */}
          <Card style={{ padding: 0 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d323e" }}>
              <Label>ALERTES ACTIVES</Label>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {ALERTS.map((a, i) => (
                <div key={i} style={{
                  padding: "14px 20px",
                  borderBottom: i < ALERTS.length - 1 ? "1px solid #1e2024" : "none",
                  display: "flex", flexDirection: "column", gap: "4px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                      background: a.severity === "warn" ? "#e6c364" : "#99907e"
                    }} />
                    <span style={{ color: "#e2e2e8", fontSize: "12px", lineHeight: 1.5, flex: 1 }}>{a.msg}</span>
                  </div>
                  <span style={{ color: "#4d4637", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", paddingLeft: "14px" }}>{a.time} GMT</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Volume Bar Chart */}
        <Card>
          <Label>VOLUME PAR BOURSE (USD Mds)</Label>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={barData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="m" tick={{ fill: "#99907e", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#99907e", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1e2024", border: "1px solid #2d323e", borderRadius: "6px", color: "#e2e2e8", fontSize: "11px" }}
              />
              <Bar dataKey="vol" fill="#e6c364" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
