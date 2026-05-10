import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, TrendingUp, Brain, FolderKanban, ShieldAlert,
  CreditCard, Bell, Newspaper, Settings, User, ChevronRight,
  Activity, LogOut, Plus
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/app/markets", label: "Markets", icon: TrendingUp },
  { path: "/app/ai-predictive", label: "AI Predictive", icon: Brain },
  { path: "/app/project-simulator", label: "Project Simulator", icon: FolderKanban },
  { path: "/app/risk-register", label: "Risk Register", icon: ShieldAlert },
  { path: "/app/billing", label: "Billing", icon: CreditCard },
  { path: "/app/notifications", label: "Notifications", icon: Bell },
  { path: "/app/actualites", label: "Actualités", icon: Newspaper },
  { path: "/app/admin", label: "Admin", icon: Settings },
];

const TICKER_DATA = [
  { pair: "NGN/USD", price: "1,452.30", change: "+1.24%", up: true },
  { pair: "EGP/USD", price: "47.85", change: "+0.05%", up: true },
  { pair: "GHS/USD", price: "13.20", change: "+0.08%", up: true },
  { pair: "KGF/EUR", price: "695.95", change: "0.28%", up: false },
  { pair: "ZAR/USD", price: "18.92", change: "+0.12%", up: true },
  { pair: "MAD/USD", price: "9.87", change: "-0.33%", up: false },
  { pair: "TZS/USD", price: "2,510.40", change: "+0.67%", up: true },
  { pair: "KES/USD", price: "132.48", change: "-0.45%", up: false },
];

function LiveTicker() {
  return (
    <div
      style={{ background: "#0c0e12", borderBottom: "1px solid #2d323e", fontFamily: "'IBM Plex Mono', monospace" }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-2 py-1 px-3">
        <span style={{ color: "#e6c364", fontSize: "9px", letterSpacing: "0.08em", fontWeight: 700 }} className="shrink-0 uppercase">
          ● Live
        </span>
        <div className="overflow-hidden flex-1">
          <div
            style={{ animation: "ticker-scroll 30s linear infinite", display: "flex", gap: "48px", width: "max-content" }}
          >
            {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
              <span key={i} className="flex items-center gap-2" style={{ fontSize: "11px" }}>
                <span style={{ color: "#99907e" }}>{item.pair}</span>
                <span style={{ color: "#e2e2e8" }}>{item.price}</span>
                <span style={{ color: item.up ? "#43ed9e" : "#ff4d6d" }}>{item.up ? "▲" : "▼"} {item.change}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ background: "#111318", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Manrope', sans-serif" }}>
      <LiveTicker />
      <div className="flex flex-1" style={{ minHeight: 0 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: collapsed ? 60 : 200,
            background: "#0c0e12",
            borderRight: "1px solid #2d323e",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.2s ease",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div
            style={{ padding: "16px 16px 8px", borderBottom: "1px solid #2d323e", cursor: "pointer" }}
            onClick={() => navigate("/app")}
          >
            <div style={{ color: "#e6c364", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.02em", fontFamily: "'Manrope', sans-serif" }}>
              {collapsed ? "E" : "ELOKO"}
            </div>
            {!collapsed && (
              <div style={{ color: "#99907e", fontSize: "9px", letterSpacing: "0.08em", fontWeight: 700, marginTop: "2px", textTransform: "uppercase" }}>
                Financial Intelligence
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto" style={{ padding: "8px 0" }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: collapsed ? "10px 0 10px 18px" : "10px 12px",
                  color: isActive ? "#e6c364" : "#99907e",
                  background: isActive ? "rgba(230, 195, 100, 0.08)" : "transparent",
                  borderLeft: isActive ? "2px solid #e6c364" : "2px solid transparent",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: "none",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                })}
              >
                <item.icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Bottom */}
          <div style={{ borderTop: "1px solid #2d323e", padding: "12px" }}>
            {!collapsed && (
              <button
                onClick={() => navigate("/app/ai-predictive")}
                style={{
                  width: "100%", background: "#e6c364", color: "#111318",
                  border: "none", borderRadius: "6px", padding: "8px 12px",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px", justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Plus size={14} /> NEW ANALYSIS
              </button>
            )}
            <div
              style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: "#1e2024",
                border: "1px solid #2d323e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <User size={14} style={{ color: "#e6c364" }} />
              </div>
              {!collapsed && (
                <div>
                  <div style={{ color: "#e2e2e8", fontSize: "12px", fontWeight: 600 }}>J. Doe</div>
                  <div style={{ color: "#99907e", fontSize: "10px" }}>Admin</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
