import { useState } from "react";
import { ShieldAlert, Plus, AlertTriangle, CheckCircle, Clock, X } from "lucide-react";

const RISKS = [
  { id: "RSK-001", name: "Dépréciation NGN", category: "FX", probability: "HAUTE", impact: "CRITIQUE", status: "ACTIF", owner: "Marcus V.", date: "2023-10-15", desc: "Risque de dépréciation rapide du Naira suite à une réduction des réserves FX de la CBN." },
  { id: "RSK-002", name: "Volatilité prix Cacao", category: "Commodité", probability: "HAUTE", impact: "ÉLEVÉ", status: "SURVEILLANCE", owner: "Sarah T.", date: "2023-10-10", desc: "Incertitude sur la récolte Q4 en Côte d'Ivoire et Ghana. Exposition via futures." },
  { id: "RSK-003", name: "Risque infrastructure JSE", category: "Opérationnel", probability: "FAIBLE", impact: "ÉLEVÉ", status: "MITIGÉ", owner: "David C.", date: "2023-09-28", desc: "Pannes de courant (load shedding) affectant la continuité des opérations boursières au Cap." },
  { id: "RSK-004", name: "Réglementation CIMA", category: "Réglementaire", probability: "MOYENNE", impact: "MODÉRÉ", status: "ACTIF", owner: "Elena R.", date: "2023-10-05", desc: "Nouvelles directives CIMA sur la solvabilité des assureurs BRVM pourraient réduire les flux." },
  { id: "RSK-005", name: "Liquidité EGX en baisse", category: "Marché", probability: "MOYENNE", impact: "ÉLEVÉ", status: "ACTIF", owner: "Julia K.", date: "2023-10-12", desc: "Volume quotidien EGX en baisse de 34% YoY. Risque de slippage sur positions importantes." },
  { id: "RSK-006", name: "Contrepartie MTN MoMo", category: "Crédit", probability: "FAIBLE", impact: "MODÉRÉ", status: "FERMÉ", owner: "Marcus V.", date: "2023-09-15", desc: "Exposition crédit sur paiements via wallet mobile. Limites renforcées après audit." },
];

const PROB_COLOR: Record<string, string> = { "HAUTE": "#ff4d6d", "MOYENNE": "#e6c364", "FAIBLE": "#43ed9e" };
const IMPACT_COLOR: Record<string, string> = { "CRITIQUE": "#ff4d6d", "ÉLEVÉ": "#ff4d6d", "MODÉRÉ": "#e6c364", "FAIBLE": "#43ed9e" };
const STATUS_COLOR: Record<string, string> = { "ACTIF": "#ff4d6d", "SURVEILLANCE": "#e6c364", "MITIGÉ": "#43ed9e", "FERMÉ": "#99907e" };

export function RiskRegisterPage() {
  const [selected, setSelected] = useState(RISKS[0]);
  const [showAdd, setShowAdd] = useState(false);

  const active = RISKS.filter(r => r.status === "ACTIF").length;
  const critical = RISKS.filter(r => r.impact === "CRITIQUE").length;

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
            <h1 style={{ color: "#e2e2e8", fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Risk Register</h1>
            <p style={{ color: "#99907e", fontSize: "12px", margin: "4px 0 0" }}>Registre des risques et contrôle des expositions institutionnelles</p>
          </div>
          <button onClick={() => setShowAdd(true)} style={{
            background: "#e6c364", color: "#111318", border: "none", borderRadius: "6px", padding: "8px 16px",
            fontSize: "12px", fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px"
          }}>
            <Plus size={14} /> AJOUTER UN RISQUE
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "RISQUES ACTIFS", val: active, icon: AlertTriangle, color: "#ff4d6d" },
            { label: "CRITIQUES", val: critical, icon: ShieldAlert, color: "#ff4d6d" },
            { label: "EN SURVEILLANCE", val: RISKS.filter(r => r.status === "SURVEILLANCE").length, icon: Clock, color: "#e6c364" },
            { label: "MITIGÉS / FERMÉS", val: RISKS.filter(r => ["MITIGÉ", "FERMÉ"].includes(r.status)).length, icon: CheckCircle, color: "#43ed9e" },
          ].map(k => (
            <div key={k.label} style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                  <div style={{ color: k.color, fontSize: "28px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{k.val}</div>
                </div>
                <k.icon size={20} style={{ color: k.color, opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Risk Table */}
          <div style={{ gridColumn: "span 2", background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d323e" }}>
              <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>REGISTRE DES RISQUES</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["ID", "RISQUE", "CATÉGORIE", "PROBABILITÉ", "IMPACT", "STATUT", "PROPRIÉTAIRE"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid #2d323e" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RISKS.map((r, i) => (
                  <tr key={r.id} onClick={() => setSelected(r)} style={{
                    cursor: "pointer",
                    background: selected.id === r.id ? "rgba(230,195,100,0.05)" : "transparent",
                    borderBottom: i < RISKS.length - 1 ? "1px solid #1e2024" : "none"
                  }}>
                    <td style={{ padding: "12px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#99907e" }}>{r.id}</td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#e2e2e8", fontWeight: 600, maxWidth: 160 }}>{r.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: "11px", color: "#99907e" }}>{r.category}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: `${PROB_COLOR[r.probability]}1a`, color: PROB_COLOR[r.probability], fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", letterSpacing: "0.06em" }}>{r.probability}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: `${IMPACT_COLOR[r.impact]}1a`, color: IMPACT_COLOR[r.impact], fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", letterSpacing: "0.06em" }}>{r.impact}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: `${STATUS_COLOR[r.status]}1a`, color: STATUS_COLOR[r.status], fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", letterSpacing: "0.06em" }}>{r.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "11px", color: "#99907e" }}>{r.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "20px" }}>
            <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px" }}>DÉTAIL DU RISQUE</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#e6c364", marginBottom: "6px" }}>{selected.id}</div>
            <div style={{ color: "#e2e2e8", fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>{selected.name}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              {[
                { label: "Catégorie", val: selected.category },
                { label: "Probabilité", val: selected.probability, color: PROB_COLOR[selected.probability] },
                { label: "Impact", val: selected.impact, color: IMPACT_COLOR[selected.impact] },
                { label: "Statut", val: selected.status, color: STATUS_COLOR[selected.status] },
                { label: "Propriétaire", val: selected.owner },
                { label: "Date", val: selected.date },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e2024", paddingBottom: "8px" }}>
                  <span style={{ color: "#99907e", fontSize: "11px" }}>{item.label}</span>
                  <span style={{ color: item.color || "#e2e2e8", fontSize: "11px", fontWeight: 600 }}>{item.val}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#111318", border: "1px solid #2d323e", borderRadius: "6px", padding: "12px" }}>
              <div style={{ color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "6px" }}>DESCRIPTION</div>
              <p style={{ color: "#e2e2e8", fontSize: "12px", lineHeight: 1.6, margin: 0 }}>{selected.desc}</p>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button style={{
                flex: 1, background: "#e6c364", color: "#111318", border: "none", borderRadius: "6px",
                padding: "9px", fontSize: "11px", fontWeight: 700, cursor: "pointer"
              }}>MODIFIER</button>
              <button style={{
                flex: 1, background: "transparent", border: "1px solid #2d323e", borderRadius: "6px",
                padding: "9px", fontSize: "11px", fontWeight: 600, color: "#e2e2e8", cursor: "pointer"
              }}>CLÔTURER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
