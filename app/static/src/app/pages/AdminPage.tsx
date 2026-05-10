import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { UserPlus, Shield, FileText, Settings, Users, Server } from "lucide-react";

const USERS = [
  { name: "Marcus Vance", email: "m.vance@fund.io", role: "Admin", plan: "Enterprise", status: "ACTIVE", avatar: "MV" },
  { name: "Sarah Teller", email: "st@quant.net", role: "Analyst", plan: "Pro", status: "ACTIVE", avatar: "ST" },
  { name: "David Chen", email: "d.chen@apex.com", role: "Trader", plan: "Institutional", status: "SUSPENDED", avatar: "DC" },
  { name: "Elena Rostova", email: "erost@global.org", role: "Auditor", plan: "Basic", status: "ACTIVE", avatar: "ER" },
  { name: "Julia Kim", email: "jkim@nexus.co", role: "Risk Officer", plan: "Enterprise", status: "ACTIVE", avatar: "JK" },
];

const UPTIME_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `J${i + 1}`,
  uptime: i === 8 ? 72 : 95 + Math.random() * 5,
  failed: i === 8,
}));

const APIS = [
  { name: "BRVM API", sub: "ABIDJAN GATEWAY", status: "STABLE", latency: "284ms", uptime: "99.98%", bars: [8, 6, 9, 7, 10, 8, 9, 7, 10, 9, 8, 10, 9, 10, 8] },
  { name: "NSE API", sub: "LAGOS GATEWAY", status: "STABLE", latency: "412ms", uptime: "99.92%", bars: [7, 9, 8, 10, 7, 9, 8, 7, 9, 10, 8, 9, 7, 8, 10] },
  { name: "PostgreSQL", sub: "MAIN CLUSTER", status: "HEALTHY", latency: null, uptime: null, conn: "1,204 / 2,000", cpu: "32.4%", bars: null },
  { name: "Redis Cache", sub: "L1 INTELLIGENCE CACHE", status: "OPTIMAL", latency: null, uptime: null, mem: "6.4 GB / 10 GB", bars: null },
];

const LOGS = [
  { time: "14:02:45", level: "INFO", msg: "System kernel daemon started." },
  { time: "14:02:46", level: "INFO", msg: "Initializing connection pool to primary DB cluster..." },
  { time: "14:02:47", level: "INFO", msg: "Connected established. Latency: 4ms." },
  { time: "14:05:12", level: "WARN", msg: "High memory usage detected on node-04 (82%). Auto-scaling triggered." },
  { time: "14:05:15", level: "INFO", msg: "Node-05 provisioned successfully." },
  { time: "14:12:33", level: "ERROR", msg: "Authentication failed for user IP 192.168.1.105. Invalid token payload." },
  { time: "14:12:33", level: "INFO", msg: "Security policy enforcement: IP temporarily blocked for 300s." },
  { time: "14:20:01", level: "INFO", msg: "Batch processing job 'EOD_Calculations' initiated." },
  { time: "14:20:45", level: "INFO", msg: "Processed 145,000 records. Chunk 1/5 complete." },
  { time: "14:25:10", level: "WARN", msg: "Market data feed 'TICKER_X' latency spike (150ms)." },
  { time: "14:25:12", level: "INFO", msg: "Market data feed 'TICKER_X' normalized (22ms)." },
];

const SECURITY_LOGS = [
  { time: "2023-10-24 14:22:01", status: "OK", code: "JWT_REFRESH_SUCCESS" },
  { time: "2023-10-24 14:21:45", status: "OK", code: "API_REQUEST_SIGNED" },
  { time: "2023-10-24 14:20:12", status: "WARN", code: "LATENCY_SPIKE_NSE" },
  { time: "2023-10-24 14:18:55", status: "OK", code: "DB_REPLICA_SYNC" },
];

type AdminTab = "users" | "system" | "security" | "logs" | "settings";

const LOG_COLOR = { INFO: "#43ed9e", WARN: "#e6c364", ERROR: "#ff4d6d" };
const STATUS_COLOR: Record<string, string> = { ACTIVE: "#43ed9e", SUSPENDED: "#ff4d6d" };
const API_STATUS_COLOR: Record<string, string> = { STABLE: "#43ed9e", HEALTHY: "#43ed9e", OPTIMAL: "#43ed9e" };

export function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("users");
  const [search, setSearch] = useState("");

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: "#e2e2e8" }}>
      {/* Top header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #2d323e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>LIVE MARKET FEED</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#43ed9e" }} />
          <span style={{ color: "#43ed9e", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}>OPERATIONAL</span>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Section Title */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ color: "#e2e2e8", fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Administration</h1>
          <p style={{ color: "#99907e", fontSize: "12px", margin: "4px 0 0" }}>System Management & Access Control</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "24px", borderBottom: "1px solid #2d323e" }}>
          {[
            { key: "users", label: "Users", icon: Users },
            { key: "system", label: "System & API", icon: Server },
            { key: "security", label: "Security", icon: Shield },
            { key: "logs", label: "Logs", icon: FileText },
            { key: "settings", label: "Settings", icon: Settings },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as AdminTab)} style={{
              background: "transparent", border: "none", padding: "8px 16px",
              color: tab === t.key ? "#e6c364" : "#99907e",
              fontSize: "12px", fontWeight: tab === t.key ? 700 : 500,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              borderBottom: tab === t.key ? "2px solid #e6c364" : "2px solid transparent",
              marginBottom: "-1px"
            }}>
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* USERS TAB */}
        {tab === "users" && (
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Left: metrics + table */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* KPIs */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "GLOBAL LATENCY", val: "24", unit: "ms", icon: "✓", color: "#43ed9e" },
                  { label: "SYSTEM UPTIME", val: "99.99", unit: "%", icon: "✓", color: "#43ed9e" },
                  { label: "CORE DB LOAD", val: "68", unit: "%", icon: "⚠", color: "#e6c364" },
                  { label: "ACTIVE SESSIONS", val: "1,428", unit: "", icon: "👥", color: "#e2e2e8" },
                ].map(k => (
                  <div key={k.label} style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em" }}>{k.label}</span>
                      <span style={{ color: k.color, fontSize: "14px" }}>{k.icon}</span>
                    </div>
                    <div style={{ color: "#e2e2e8", fontFamily: "'IBM Plex Mono', monospace", fontSize: "22px", fontWeight: 600 }}>
                      {k.val}<span style={{ fontSize: "12px", color: "#99907e" }}>{k.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Directory table */}
              <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #2d323e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#e2e2e8", fontSize: "13px", fontWeight: 700 }}>Directory Access</span>
                  <button style={{
                    background: "#e6c364", color: "#111318", border: "none", borderRadius: "6px",
                    padding: "7px 14px", fontSize: "11px", fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}>
                    <UserPlus size={13} /> ADD USER
                  </button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["User", "Role", "Plan", "Status"].map(h => (
                        <th key={h} style={{ padding: "10px 20px", color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textAlign: "left", borderBottom: "1px solid #2d323e" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {USERS.map((u, i) => (
                      <tr key={u.email} style={{ borderBottom: i < USERS.length - 1 ? "1px solid #1e2024" : "none" }}>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: "50%", background: "#2d323e",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "10px", fontWeight: 700, color: "#e6c364"
                            }}>{u.avatar}</div>
                            <div>
                              <div style={{ color: "#e2e2e8", fontSize: "13px", fontWeight: 600 }}>{u.name}</div>
                              <div style={{ color: "#99907e", fontSize: "10px" }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", color: "#e2e2e8", fontSize: "12px" }}>{u.role}</td>
                        <td style={{ padding: "14px 20px", color: "#99907e", fontSize: "12px" }}>{u.plan}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{
                            background: `${STATUS_COLOR[u.status]}1a`,
                            color: STATUS_COLOR[u.status],
                            fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.06em"
                          }}>{u.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: logs */}
            <div style={{ width: 340, flexShrink: 0, background: "#0c0e12", border: "1px solid #2d323e", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #2d323e", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#99907e" }}>
                root@eloko-core:~# tail -f /var/log/syslog
              </div>
              <div style={{ padding: "12px 14px", height: 420, overflow: "auto", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", lineHeight: 2 }}>
                {LOGS.map((l, i) => (
                  <div key={i}>
                    <span style={{ color: "#4d4637" }}>{l.time} </span>
                    <span style={{ color: LOG_COLOR[l.level as keyof typeof LOG_COLOR] }}>[{l.level}] </span>
                    <span style={{ color: "#e2e2e8" }}>{l.msg}</span>
                  </div>
                ))}
                <div style={{ color: "#99907e" }}>root@eloko-core:~# <span style={{ animation: "blink 1s infinite" }}>█</span></div>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM & API TAB */}
        {tab === "system" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Header metrics */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "GLOBAL LATENCY", val: "142ms", sub: "-12ms (avg)" },
                { label: "ACTIVE SESSIONS", val: "8,442", sub: "Live Sync" },
                { label: "THROUGHPUT", val: "12.5k", sub: "req/sec" },
              ].map(k => (
                <div key={k.label} style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                  <div style={{ color: "#e6c364", fontFamily: "'IBM Plex Mono', monospace", fontSize: "24px", fontWeight: 600 }}>{k.val}</div>
                  <div style={{ color: "#99907e", fontSize: "10px", marginTop: "2px" }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Infrastructure */}
              <div>
                <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Server size={12} /> CORE INFRASTRUCTURE
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {APIS.map(api => (
                    <div key={api.name} style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div>
                          <div style={{ color: "#e6c364", fontSize: "14px", fontWeight: 700 }}>{api.name}</div>
                          <div style={{ color: "#99907e", fontSize: "10px", letterSpacing: "0.06em" }}>{api.sub}</div>
                        </div>
                        <span style={{
                          background: "rgba(67,237,158,0.1)", color: "#43ed9e",
                          fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.06em"
                        }}>{api.status}</span>
                      </div>
                      {api.bars && (
                        <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: 24, marginBottom: "8px" }}>
                          {api.bars.map((b, j) => (
                            <div key={j} style={{ flex: 1, background: "#43ed9e", borderRadius: "2px", height: `${b * 10}%` }} />
                          ))}
                        </div>
                      )}
                      {api.conn && (
                        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: "8px" }}>
                          <div style={{ background: "#111318", borderRadius: "4px", padding: "8px 10px" }}>
                            <div style={{ color: "#99907e", fontSize: "9px", letterSpacing: "0.06em", marginBottom: "2px" }}>CONNECTIONS</div>
                            <div style={{ color: "#e2e2e8", fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{api.conn}</div>
                          </div>
                          <div style={{ background: "#111318", borderRadius: "4px", padding: "8px 10px" }}>
                            <div style={{ color: "#99907e", fontSize: "9px", letterSpacing: "0.06em", marginBottom: "2px" }}>CPU USAGE</div>
                            <div style={{ color: "#e2e2e8", fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{api.cpu}</div>
                          </div>
                        </div>
                      )}
                      {api.mem && (
                        <div>
                          <div style={{ color: "#99907e", fontSize: "9px", letterSpacing: "0.06em", marginBottom: "4px" }}>MEMORY USAGE: {api.mem}</div>
                          <div style={{ height: 4, background: "#2d323e", borderRadius: "2px" }}>
                            <div style={{ height: "100%", width: "64%", background: "#43ed9e", borderRadius: "2px" }} />
                          </div>
                        </div>
                      )}
                      {api.latency && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>
                          <span style={{ color: "#99907e" }}>Latency: <span style={{ color: "#e2e2e8" }}>{api.latency}</span></span>
                          <span style={{ color: "#99907e" }}>Uptime: <span style={{ color: "#43ed9e" }}>{api.uptime}</span></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Uptime + logs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Uptime Chart */}
                <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ color: "#e2e2e8", fontSize: "13px", fontWeight: 700 }}>SYSTEM UPTIME INDEX</div>
                    <div style={{ color: "#99907e", fontSize: "10px" }}>Last 30 days performance metrics</div>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={UPTIME_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="day" tick={false} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#99907e", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: "#1e2024", border: "1px solid #2d323e", borderRadius: "6px", color: "#e2e2e8", fontSize: "11px" }}
                        formatter={(v: number) => [`${v.toFixed(1)}%`, "Uptime"]}
                      />
                      <Bar dataKey="uptime" radius={[2, 2, 0, 0]}
                        fill="#43ed9e"
                        label={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontFamily: "'IBM Plex Mono', monospace", color: "#99907e", marginTop: "4px" }}>
                    <span>30 DAYS AGO</span>
                    <span>TERMINAL AVERAGE: 99.86%</span>
                    <span>CURRENT (LIVE)</span>
                  </div>
                </div>

                {/* API Consumption + Security */}
                <div className="grid grid-cols-2 gap-3">
                  <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "12px" }}>API CONSUMPTION</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ color: "#e2e2e8", fontSize: "11px" }}>Production Tier</span>
                          <span style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>6.8M/10M</span>
                        </div>
                        <div style={{ height: 4, background: "#2d323e", borderRadius: "2px" }}>
                          <div style={{ height: "100%", width: "68%", background: "#e6c364", borderRadius: "2px" }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ color: "#e2e2e8", fontSize: "11px" }}>Webhooks Triggers</span>
                          <span style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>12k/50k</span>
                        </div>
                        <div style={{ height: 4, background: "#2d323e", borderRadius: "2px" }}>
                          <div style={{ height: "100%", width: "24%", background: "#e6c364", borderRadius: "2px" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "10px" }}>SECURITY LOGS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {SECURITY_LOGS.map((l, i) => (
                        <div key={i} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{
                            color: l.status === "OK" ? "#43ed9e" : "#e6c364",
                            fontSize: "9px", fontWeight: 700, minWidth: 28
                          }}>{l.status}</span>
                          <span style={{ color: "#99907e", fontSize: "9px", fontFamily: "'IBM Plex Mono', monospace" }}>{l.time.split(" ")[1]}</span>
                          <span style={{ color: "#e2e2e8", fontSize: "9px", fontFamily: "'IBM Plex Mono', monospace" }}>{l.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "12px" }}>SYSTEM ACTIONS:</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button style={{ background: "#e6c364", color: "#111318", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>FLUSH CACHE</button>
                    <button style={{ background: "transparent", border: "1px solid #2d323e", color: "#e2e2e8", borderRadius: "6px", padding: "8px 14px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>RESTART SERVICES</button>
                    <button style={{ background: "transparent", border: "1px solid #2d323e", color: "#e2e2e8", borderRadius: "6px", padding: "8px 14px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>DOWNLOAD AUDIT</button>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                      <span style={{ color: "#99907e", fontSize: "11px" }}>AUTO-REFRESH</span>
                      <div style={{ width: 36, height: 20, borderRadius: "10px", background: "#e6c364", position: "relative", cursor: "pointer" }}>
                        <div style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "#111318" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {tab === "security" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "POLICY ENFORCEMENT", val: "ACTIVE", color: "#43ed9e" },
                { label: "FAILED LOGIN (24H)", val: "3", color: "#e6c364" },
                { label: "IP BLOCKS ACTIVE", val: "1", color: "#ff4d6d" },
              ].map(k => (
                <div key={k.label} style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                  <div style={{ color: k.color, fontFamily: "'IBM Plex Mono', monospace", fontSize: "24px", fontWeight: 600 }}>{k.val}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0c0e12", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", lineHeight: 2 }}>
                {LOGS.map((l, i) => (
                  <div key={i}>
                    <span style={{ color: "#4d4637" }}>{l.time} </span>
                    <span style={{ color: LOG_COLOR[l.level as keyof typeof LOG_COLOR] }}>[{l.level}] </span>
                    <span style={{ color: "#e2e2e8" }}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {tab === "logs" && (
          <div style={{ background: "#0c0e12", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px" }}>
            <div style={{ color: "#99907e", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "12px" }}>
              root@eloko-core:~# tail -f /var/log/syslog
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", lineHeight: 2.2 }}>
              {[...LOGS, ...LOGS].map((l, i) => (
                <div key={i}>
                  <span style={{ color: "#4d4637" }}>{l.time} </span>
                  <span style={{ color: LOG_COLOR[l.level as keyof typeof LOG_COLOR] }}>[{l.level}] </span>
                  <span style={{ color: "#e2e2e8" }}>{l.msg}</span>
                </div>
              ))}
              <div style={{ color: "#99907e" }}>root@eloko-core:~# <span style={{ animation: "blink 1s infinite" }}>█</span></div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "Rétention des données", desc: "Durée de conservation des logs et données historiques", val: "90 jours" },
              { title: "Fuseau horaire système", desc: "Timezone par défaut pour tous les timestamps", val: "UTC+0 (GMT)" },
              { title: "Authentification 2FA", desc: "Authentification à deux facteurs obligatoire", val: "Activé" },
              { title: "IP Whitelist", desc: "Accès restreint aux IP autorisées", val: "Désactivé" },
              { title: "Mode maintenance", desc: "Basculer l'application en mode maintenance", val: "Désactivé" },
              { title: "Notifications admin", desc: "Alertes système pour les administrateurs", val: "Activé" },
            ].map(s => (
              <div key={s.title} style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#e2e2e8", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>{s.title}</div>
                  <div style={{ color: "#99907e", fontSize: "11px" }}>{s.desc}</div>
                </div>
                <span style={{ color: "#e6c364", fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{s.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}