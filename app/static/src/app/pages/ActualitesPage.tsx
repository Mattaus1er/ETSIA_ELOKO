import { useState } from "react";
import { Search, TrendingUp, TrendingDown, Minus, Calendar, Hash } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const CATEGORIES = ["ALL", "MACRO", "MINING", "TECH", "CRYPTO", "BANKING"];

const NEWS = [
  {
    id: 1, category: "MACRO", sentiment: "BULLISH", source: "BLOOMBERG", time: "10:42 AM",
    title: "South African Rand Rallies as Reserve Bank Surprises with Rate Hold",
    excerpt: "The SARB kept its benchmark interest rate unchanged at 8.25%, defying market expectations of a 25 basis point hike amidst cooling inflation data and improved current account dynamics...",
    image: "https://images.unsplash.com/photo-1753998941540-081eed4f6397?w=400&q=80",
    tags: ["ZAR", "SARB", "#RateDecision"],
  },
  {
    id: 2, category: "MINING", sentiment: "BEARISH", source: "REUTERS AFRICA", time: "08:15 AM",
    title: "Copper Output Forecast Trimmed by Major DRC Operator Due to Power Constraints",
    excerpt: "Ongoing grid instability in the copper belt region has forced downward revisions of Q3 production targets by an estimated 12%, sending ripples through the global supply chain...",
    image: "https://images.unsplash.com/photo-1668609268461-4f6a15269ff1?w=400&q=80",
    tags: ["Copper", "DRC", "#Mining"],
  },
  {
    id: 3, category: "TECH", sentiment: "NEUTRAL", source: "ECOFIN", time: "YESTERDAY",
    title: "Pan-African Fintech Hub Announces Strategic Alignment on Data Sovereignty Rules",
    excerpt: "New regulatory framework proposal seeks to standardize cross-border data flows while mandating localized storage for Tier 1 financial institutions operating across multiple African jurisdictions...",
    image: "https://images.unsplash.com/photo-1667494398891-dd00bad6e8d8?w=400&q=80",
    tags: ["Fintech", "AfCFTA", "#DataSovereignty"],
  },
  {
    id: 4, category: "MACRO", sentiment: "BULLISH", source: "BLOOMBERG", time: "YESTERDAY",
    title: "Nigeria's Dangote Refinery Begins Supplying Domestic Market with Diesel, Aviation Fuel",
    excerpt: "Move expected to significantly reduce Nigeria's FX requirements for petroleum imports, analysts upgrade banking sector outlook following landmark operational milestone...",
    image: "https://images.unsplash.com/photo-1525945995886-0ede2bd49ab6?w=400&q=80",
    tags: ["NGN", "Energy", "#FX"],
  },
  {
    id: 5, category: "BANKING", sentiment: "NEUTRAL", source: "ECOFIN", time: "2 DAYS AGO",
    title: "Safaricom and Vodacom Consortium Finalize Ethiopia Expansion Capital Call",
    excerpt: "The $250M injection will focus on accelerating M-Pesa rollout and 5G infrastructure in Addis Ababa, marking a pivotal entry into the 120M-user market...",
    image: "https://images.unsplash.com/photo-1667494398891-dd00bad6e8d8?w=400&q=80",
    tags: ["NSE", "Telecom", "#M&A"],
  },
];

const CALENDAR_EVENTS = [
  { time: "14:30", flag: "🇳🇬", dots: ["#43ed9e", "#43ed9e", "#43ed9e"], title: "CBN Interest Rate Decision", actual: "--", est: "26.25%", prev: "26.25%" },
  { time: "16:00", flag: "🇿🇦", dots: ["#43ed9e", "#43ed9e"], title: "Mining Production YoY", actual: "--", est: "1.2%", prev: "0.0%" },
  { time: "TOM", flag: "🇬🇭", dots: ["#43ed9e"], title: "Q2 GDP Growth Rate", actual: "--", est: "5.1%", prev: "5.0%" },
];

const TRENDING = [
  { tag: "#SARB", count: "42k" }, { tag: "#CopperPrices", count: "18k" },
  { tag: "#Naira", count: "15k" }, { tag: "#Eurobond", count: "9k" },
  { tag: "#AfCFTA", count: "8.5k" },
];

const SOURCES = ["Bloomberg", "Reuters Africa", "EcoFin"];

const SENTIMENT_CONFIG = {
  BULLISH: { color: "#43ed9e", bg: "rgba(67,237,158,0.15)", icon: TrendingUp },
  BEARISH: { color: "#ff4d6d", bg: "rgba(255,77,109,0.15)", icon: TrendingDown },
  NEUTRAL: { color: "#99907e", bg: "rgba(153,144,126,0.15)", icon: Minus },
};

export function ActualitesPage() {
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = NEWS.filter(n =>
    (category === "ALL" || n.category === category) &&
    (search === "" || n.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: "#e2e2e8" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #2d323e" }}>
        <div style={{ display: "flex", gap: "6px", color: "#99907e", fontSize: "11px", marginBottom: "4px" }}>
          <span>Platform</span>
          <span>›</span>
          <span style={{ color: "#e2e2e8" }}>Actualités</span>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ color: "#e2e2e8", fontSize: "28px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Actualités</h1>
          <div style={{ position: "relative", width: 320 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#99907e" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search intelligence, markets..."
              style={{
                width: "100%", background: "#1a1c20", border: "1px solid #2d323e",
                borderRadius: "6px", padding: "9px 12px 9px 32px",
                color: "#e2e2e8", fontSize: "12px", outline: "none", boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "24px", borderBottom: "1px solid #2d323e" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              background: "transparent", border: "none", padding: "8px 16px",
              color: category === cat ? "#e2e2e8" : "#99907e",
              fontSize: "12px", fontWeight: category === cat ? 700 : 500,
              cursor: "pointer", letterSpacing: "0.04em",
              borderBottom: category === cat ? "2px solid #e6c364" : "2px solid transparent",
              marginBottom: "-1px"
            }}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News list */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map(article => {
              const cfg = SENTIMENT_CONFIG[article.sentiment as keyof typeof SENTIMENT_CONFIG];
              const Icon = cfg.icon;
              return (
                <div key={article.id} style={{
                  background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px",
                  overflow: "hidden", display: "flex", gap: "0", cursor: "pointer",
                  transition: "border-color 0.2s"
                }}>
                  <div style={{ width: 180, flexShrink: 0, position: "relative" }}>
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div style={{ padding: "16px 20px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>
                        {article.source} · {article.time}
                      </span>
                      <span style={{
                        background: cfg.bg, color: cfg.color,
                        fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px",
                        display: "flex", alignItems: "center", gap: "4px", letterSpacing: "0.06em"
                      }}>
                        <Icon size={10} /> {article.sentiment}
                      </span>
                    </div>
                    <h3 style={{ color: "#e2e2e8", fontSize: "15px", fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 }}>{article.title}</h3>
                    <p style={{ color: "#99907e", fontSize: "12px", lineHeight: 1.6, margin: "0 0 10px" }}>{article.excerpt}</p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {article.tags.map(tag => (
                        <span key={tag} style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Economic Calendar */}
            <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #2d323e", display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={14} style={{ color: "#e6c364" }} />
                <span style={{ color: "#e2e2e8", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em" }}>ECONOMIC CALENDAR</span>
              </div>
              {CALENDAR_EVENTS.map((e, i) => (
                <div key={i} style={{ padding: "12px 16px", borderBottom: i < CALENDAR_EVENTS.length - 1 ? "1px solid #1e2024" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{e.time}</span>
                    <div style={{ display: "flex", gap: "3px" }}>
                      {e.flag} {e.dots.map((c, j) => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />)}
                    </div>
                  </div>
                  <div style={{ color: "#e2e2e8", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{e.title}</div>
                  <div style={{ display: "flex", gap: "12px", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>
                    <span style={{ color: "#99907e" }}>Act: <span style={{ color: "#e2e2e8" }}>{e.actual}</span></span>
                    <span style={{ color: "#99907e" }}>Est: <span style={{ color: "#e6c364" }}>{e.est}</span></span>
                    <span style={{ color: "#99907e" }}>Prev: <span style={{ color: "#e2e2e8" }}>{e.prev}</span></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trending Topics */}
            <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #2d323e", display: "flex", alignItems: "center", gap: "8px" }}>
                <Hash size={14} style={{ color: "#e6c364" }} />
                <span style={{ color: "#e2e2e8", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em" }}>TRENDING TOPICS</span>
              </div>
              <div style={{ padding: "14px 16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TRENDING.map(t => (
                  <span key={t.tag} style={{
                    background: "rgba(230,195,100,0.1)", border: "1px solid rgba(230,195,100,0.2)",
                    color: "#e6c364", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "4px", cursor: "pointer"
                  }}>
                    {t.tag} <span style={{ color: "#99907e" }}>({t.count})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #2d323e" }}>
                <span style={{ color: "#e2e2e8", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em" }}>SOURCE FILTER</span>
              </div>
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {SOURCES.map(src => (
                  <label key={src} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <div style={{ width: 16, height: 16, background: "#e6c364", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 8, height: 6, border: "2px solid #111318", borderTop: "none", borderRight: "none", transform: "rotate(-45deg) translateY(-1px)" }} />
                    </div>
                    <span style={{ color: "#e2e2e8", fontSize: "13px" }}>{src}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
