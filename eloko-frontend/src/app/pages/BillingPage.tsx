import { useState } from "react";
import { CheckCircle, Download, CreditCard, Check } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "om", name: "Orange Money", color: "#ff6600", abbr: "OM", selected: true },
  { id: "mtn", name: "MTN MoMo", color: "#ffd700", abbr: "MTN", selected: false },
  { id: "wave", name: "Wave", color: "#0055ff", abbr: "WAVE", selected: false },
  { id: "visa", name: "•••• 4242", color: "#1a1a6e", abbr: "VISA", selected: false },
];

const TRANSACTIONS = [
  { date: "15 Oct 2023", ref: "INV-ELK-8892", method: "Orange Money", amount: "45,000 XOF", status: "PAYÉ", paid: true },
  { date: "15 Sep 2023", ref: "INV-ELK-8104", method: "Orange Money", amount: "45,000 XOF", status: "PAYÉ", paid: true },
  { date: "15 Aug 2023", ref: "INV-ELK-7542", method: "MTN MoMo", amount: "45,000 XOF", status: "EN ATTENTE", paid: false },
  { date: "15 Jul 2023", ref: "INV-ELK-7021", method: "Orange Money", amount: "45,000 XOF", status: "PAYÉ", paid: true },
  { date: "15 Jun 2023", ref: "INV-ELK-6510", method: "Orange Money", amount: "45,000 XOF", status: "PAYÉ", paid: true },
];

export function BillingPage() {
  const [billing, setBilling] = useState<"mensuel" | "annuel">("annuel");
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const PLANS = {
    mensuel: [
      { id: "starter", name: "STARTER", price: "0", unit: "XOF / mois", features: ["Données de marché (Délai 15m)", "Alertes basiques (Max 5)", "Vue d'ensemble du portefeuille"], cta: "ACTUEL", current: false },
      { id: "pro", name: "PRO", price: "45,000", unit: "XOF / mois", popular: true, features: ["Données de marché en Temps Réel", "Alertes illimitées via SMS/Email", "Accès Simulateur de Projets", "Indicateurs d'IA Prédictive", "Export de rapports avancés"], cta: "GÉRER PLAN PRO", current: true },
      { id: "institution", name: "INSTITUTION", price: "Sur Mesure", unit: "", features: ["Tout dans le plan PRO", "Accès API dédié", "SLA garanti 99.9%", "Gestionnaire de compte dédié"], cta: "CONTACTER LES VENTES", current: false },
    ],
    annuel: [
      { id: "starter", name: "STARTER", price: "0", unit: "XOF / mois", features: ["Données de marché (Délai 15m)", "Alertes basiques (Max 5)", "Vue d'ensemble du portefeuille"], cta: "ACTUEL", current: false },
      { id: "pro", name: "PRO", price: "36,000", unit: "XOF / mois", popular: true, features: ["Données de marché en Temps Réel", "Alertes illimitées via SMS/Email", "Accès Simulateur de Projets", "Indicateurs d'IA Prédictive", "Export de rapports avancés"], cta: "GÉRER PLAN PRO", current: true },
      { id: "institution", name: "INSTITUTION", price: "Sur Mesure", unit: "", features: ["Tout dans le plan PRO", "Accès API dédié", "SLA garanti 99.9%", "Gestionnaire de compte dédié"], cta: "CONTACTER LES VENTES", current: false },
    ],
  };

  const plans = PLANS[billing];

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

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Abonnement Actuel + Moyens de Paiement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Abonnement */}
          <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h2 style={{ color: "#e2e2e8", fontSize: "16px", fontWeight: 700, margin: 0 }}>Abonnement Actuel</h2>
              <span style={{ background: "rgba(67,237,158,0.15)", border: "1px solid rgba(67,237,158,0.3)", color: "#43ed9e", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.06em" }}>ACTIF</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "end" }}>
              <div>
                <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "4px" }}>PLAN SÉLECTIONNÉ</div>
                <div style={{ color: "#e6c364", fontSize: "28px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>PRO <span style={{ fontSize: "14px", fontWeight: 400, color: "#99907e" }}>/ mensuel</span></div>
                <div style={{ color: "#99907e", fontSize: "11px", marginTop: "4px" }}>Prochaine facturation: 15 Nov 2023</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "4px" }}>MONTANT</div>
                <div style={{ color: "#e2e2e8", fontSize: "22px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>45,000 XOF</div>
              </div>
            </div>
            <button style={{
              width: "100%", background: "transparent", border: "1px solid #2d323e", borderRadius: "6px",
              padding: "10px", color: "#e2e2e8", fontSize: "12px", fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.06em", marginTop: "20px"
            }}>
              GÉRER L'ABONNEMENT
            </button>
          </div>

          {/* Moyens de Paiement */}
          <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ color: "#e2e2e8", fontSize: "16px", fontWeight: 700, margin: "0 0 16px" }}>Moyens de Paiement</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {PAYMENT_METHODS.map(pm => (
                <div key={pm.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 14px", background: "#111318",
                  border: "1px solid #2d323e", borderRadius: "6px",
                  cursor: "pointer"
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "6px",
                    background: pm.color, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 800, color: "white", fontFamily: "'IBM Plex Mono', monospace"
                  }}>{pm.abbr}</div>
                  <span style={{ color: "#e2e2e8", fontSize: "13px", fontWeight: 600, flex: 1 }}>{pm.name}</span>
                  {pm.selected && (
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#43ed9e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={12} style={{ color: "#111318" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plans & Tarification */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ color: "#e2e2e8", fontSize: "20px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Plans & Tarification</h2>
              <p style={{ color: "#99907e", fontSize: "12px", margin: "4px 0 0" }}>Sélectionnez le niveau d'intelligence financière adapté à vos opérations.</p>
            </div>
            <div style={{ display: "inline-flex", background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "6px", padding: "3px" }}>
              {(["mensuel", "annuel"] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{
                  background: billing === b ? "#e6c364" : "transparent",
                  color: billing === b ? "#111318" : "#99907e",
                  border: "none", borderRadius: "4px", padding: "5px 12px",
                  fontSize: "10px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em",
                  textTransform: "uppercase", transition: "all 0.2s",
                }}>
                  {b === "annuel" ? "ANNUEL -20%" : "MENSUEL"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.id} style={{
                background: plan.popular ? "#1e2024" : "#1a1c20",
                border: plan.popular ? "2px solid #e6c364" : "1px solid #2d323e",
                borderRadius: "8px", padding: "24px", position: "relative"
              }}>
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                    background: "#e6c364", color: "#111318", fontSize: "9px", fontWeight: 700,
                    padding: "2px 10px", borderRadius: "3px", letterSpacing: "0.08em"
                  }}>MOST POPULAR</div>
                )}
                <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "8px" }}>{plan.name}</div>
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ color: "#e6c364", fontFamily: "'IBM Plex Mono', monospace", fontSize: plan.price === "Sur Mesure" ? "26px" : "32px", fontWeight: 600 }}>{plan.price}</span>
                  {plan.unit && <span style={{ color: "#99907e", fontSize: "12px", marginLeft: "4px" }}>{plan.unit}</span>}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#e2e2e8", fontSize: "12px" }}>
                      <CheckCircle size={13} style={{ color: "#43ed9e", flexShrink: 0, marginTop: 2 }} /> {f}
                    </li>
                  ))}
                </ul>
                <button style={{
                  width: "100%", border: plan.current ? "none" : "1px solid #2d323e",
                  background: plan.current ? "#e6c364" : "transparent",
                  color: plan.current ? "#111318" : "#e2e2e8",
                  borderRadius: "6px", padding: "10px",
                  fontSize: "11px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em"
                }}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d323e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ color: "#e2e2e8", fontSize: "15px", fontWeight: 700, margin: 0 }}>Historique des Transactions</h2>
            <button style={{
              background: "transparent", border: "none", color: "#99907e", fontSize: "11px", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", letterSpacing: "0.06em"
            }}>
              <Download size={13} /> EXPORT CSV
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["DATE", "RÉFÉRENCE", "MÉTHODE", "MONTANT", "STATUT"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", color: "#99907e", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textAlign: "left", borderBottom: "1px solid #2d323e" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={t.ref} style={{ borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid #1e2024" : "none" }}>
                  <td style={{ padding: "14px 20px", color: "#e2e2e8", fontSize: "13px", fontWeight: 600 }}>{t.date}</td>
                  <td style={{ padding: "14px 20px", color: "#99907e", fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace" }}>{t.ref}</td>
                  <td style={{ padding: "14px 20px", color: "#e2e2e8", fontSize: "13px" }}>{t.method}</td>
                  <td style={{ padding: "14px 20px", color: "#e2e2e8", fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{t.amount}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      background: t.paid ? "rgba(67,237,158,0.15)" : "rgba(230,195,100,0.15)",
                      color: t.paid ? "#43ed9e" : "#e6c364",
                      fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.06em"
                    }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
