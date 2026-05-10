import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Search } from "lucide-react";

const CATEGORIES = ["ALL", "FX", "EQUITIES", "COMMODITIES", "BONDS", "CRYPTO"];

const PAIRS = [
  { name: "NGN/USD", price: "1,452.30", change: "+1.24%", high: "1,461.00", low: "1,438.50", vol: "2.4B", up: true },
  { name: "JSE Top 40", price: "73,481.20", change: "-0.34%", high: "74,100.00", low: "73,010.00", vol: "8.1B", up: false },
  { name: "EGP/USD", price: "47.85", change: "+0.05%", high: "47.99", low: "47.71", vol: "1.9B", up: true },
  { name: "GHS/USD", price: "13.20", change: "+0.08%", high: "13.28", low: "13.10", vol: "0.5B", up: true },
  { name: "ZAR/USD", price: "18.92", change: "+0.12%", high: "19.10", low: "18.80", vol: "3.1B", up: true },
  { name: "BRVM Comp.", price: "215.48", change: "+0.72%", high: "216.20", low: "213.90", vol: "0.7B", up: true },
  { name: "KES/USD", price: "132.48", change: "-0.45%", high: "133.20", low: "132.10", vol: "0.4B", up: false },
  { name: "Copper (USD/t)", price: "9,842.00", change: "+2.14%", high: "9,900.00", low: "9,620.00", vol: "5.2B", up: true },
  { name: "Cocoa (USD/t)", price: "10,240.00", change: "+8.32%", high: "10,250.00", low: "9,420.00", vol: "1.1B", up: true },
  { name: "Crude Oil (WTI)", price: "78.45", change: "-1.20%", high: "79.80", low: "77.90", vol: "12.4B", up: false },
];

const chartData = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(i).padStart(2, "0")}:00`,
  p: 1440 + Math.sin(i * 0.4) * 8 + i * 0.7 + Math.random() * 4,
}));

export function MarketsPage() {
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);

  const filtered = PAIRS.filter(p =>
    (selectedCat === "ALL" || true) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: "#e2e2e8" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #2d323e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>LIVE MARKET FEED</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#43ed9e" }} />
          <span style={{ color: "#43ed9e", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}>OPERATIONAL</span>
        </div>
      </div>

      <div style={{ padding: "24px", display: "flex", gap: "20px", height: "calc(100vh - 100px)" }}>
        {/* Left: markets list */}
        <div style={{ width: 340, flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#99907e" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un marché..."
              style={{
                width: "100%", background: "#1a1c20", border: "1px solid #2d323e",
                borderRadius: "6px", padding: "9px 12px 9px 32px",
                color: "#e2e2e8", fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace",
                outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          {/* Categories */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)} style={{
                background: selectedCat === cat ? "#e6c364" : "#1a1c20",
                color: selectedCat === cat ? "#111318" : "#99907e",
                border: selectedCat === cat ? "none" : "1px solid #2d323e",
                borderRadius: "4px", padding: "4px 10px",
                fontSize: "10px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em"
              }}>{cat}</button>
            ))}
          </div>

          {/* Markets list */}
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
            {filtered.map((p, i) => (
              <div key={p.name} onClick={() => setSelectedPair(p)} style={{
                padding: "12px 14px",
                background: selectedPair.name === p.name ? "#1e2024" : "transparent",
                border: selectedPair.name === p.name ? "1px solid #2d323e" : "1px solid transparent",
                borderRadius: "6px", cursor: "pointer", marginBottom: "4px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ color: "#e2e2e8", fontSize: "13px", fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", marginTop: "2px" }}>
                    H: {p.high} L: {p.low}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#e2e2e8", fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{p.price}</div>
                  <div style={{
                    color: p.up ? "#43ed9e" : "#ff4d6d",
                    fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700
                  }}>{p.up ? "▲" : "▼"} {p.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: chart */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "4px" }}>{selectedPair.name} — INTRAJOURNALIER</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                  <span style={{ color: "#e2e2e8", fontSize: "32px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{selectedPair.price}</span>
                  <span style={{
                    background: selectedPair.up ? "rgba(67,237,158,0.15)" : "rgba(255,77,109,0.15)",
                    color: selectedPair.up ? "#43ed9e" : "#ff4d6d",
                    fontSize: "13px", fontWeight: 700, padding: "4px 10px", borderRadius: "4px",
                    fontFamily: "'IBM Plex Mono', monospace"
                  }}>
                    {selectedPair.up ? "▲" : "▼"} {selectedPair.change}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {["1H", "4H", "1J", "1S", "1M"].map(tf => (
                  <button key={tf} style={{
                    background: tf === "1J" ? "#e6c364" : "transparent",
                    color: tf === "1J" ? "#111318" : "#99907e",
                    border: "none", borderRadius: "4px", padding: "4px 8px",
                    fontSize: "11px", fontWeight: 700, cursor: "pointer"
                  }}>{tf}</button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedPair.up ? "#43ed9e" : "#ff4d6d"} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={selectedPair.up ? "#43ed9e" : "#ff4d6d"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: "#99907e", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fill: "#99907e", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: "#1e2024", border: "1px solid #2d323e", borderRadius: "6px", color: "#e2e2e8", fontSize: "11px" }}
                  formatter={(v: number) => [v.toFixed(2), "Prix"]}
                />
                <Area
                  type="monotone" dataKey="p"
                  stroke={selectedPair.up ? "#43ed9e" : "#ff4d6d"}
                  fill="url(#pGrad)" strokeWidth={2} dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "OUVERTURE", val: selectedPair.low },
              { label: "PLUS HAUT (24H)", val: selectedPair.high },
              { label: "PLUS BAS (24H)", val: selectedPair.low },
              { label: "VOLUME", val: selectedPair.vol },
            ].map(s => (
              <div key={s.label} style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "6px", padding: "12px 14px" }}>
                <div style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "4px" }}>{s.label}</div>
                <div style={{ color: "#e2e2e8", fontSize: "14px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}