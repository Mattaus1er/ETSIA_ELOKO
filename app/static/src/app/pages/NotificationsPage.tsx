import { useState } from "react";
import { Bell, TrendingUp, AlertTriangle, Info, CheckCircle, Trash2, Settings } from "lucide-react";

const NOTIFS = [
  { id: 1, type: "alert", title: "NGN/USD: Seuil de 1,450 franchi", desc: "Le cours NGN/USD a dépassé votre niveau d'alerte de 1,450 à 14:02 GMT.", time: "Il y a 12 min", read: false },
  { id: 2, type: "info", title: "Calendrier: SARB Interest Rate Decision", desc: "Décision de taux de la Reserve Bank of South Africa dans 2h15 (16:30 GMT). Volatilité attendue sur ZAR.", time: "Il y a 28 min", read: false },
  { id: 3, type: "success", title: "Rapport mensuel disponible — Octobre 2023", desc: "Votre rapport mensuel de performance a été généré. Téléchargez-le dans la section Billing.", time: "Il y a 1h", read: false },
  { id: 4, type: "alert", title: "Spike de volume détecté: BRVM Composite +340%", desc: "Volume anormal détecté sur la BRVM. Activité inhabituelle sur le secteur bancaire côte-ivoirien.", time: "Il y a 2h", read: true },
  { id: 5, type: "info", title: "Cocoa Futures: Nouveau plus haut historique", desc: "Le cacao a breché les $10,000/t pour la première fois, signalant des pressions structurelles en Afrique de l'Ouest.", time: "Il y a 3h", read: true },
  { id: 6, type: "success", title: "Abonnement PRO renouvelé", desc: "Votre abonnement mensuel PRO (45,000 XOF) a été débité avec succès via Orange Money.", time: "Hier", read: true },
  { id: 7, type: "alert", title: "Latence API NSE (Lagos): dégradée", desc: "Latence détectée à 450ms sur la passerelle NSE (Lagos). Équipe technique notifiée. Résolution en cours.", time: "Hier", read: true },
  { id: 8, type: "info", title: "Mise à jour du modèle IA v3.2.1", desc: "Nouveau modèle prédictif déployé. Amélioration de 12% de la précision sur les marchés FX africains.", time: "Il y a 2 jours", read: true },
];

const TYPE_ICON = {
  alert: AlertTriangle,
  info: Info,
  success: CheckCircle,
};
const TYPE_COLOR = {
  alert: "#e6c364",
  info: "#99907e",
  success: "#43ed9e",
};

const SETTINGS_OPTIONS = [
  { label: "Alertes de prix", desc: "Seuils de prix personnalisés", enabled: true },
  { label: "Calendrier économique", desc: "Événements macro clés", enabled: true },
  { label: "Rapports périodiques", desc: "Résumés hebdomadaires et mensuels", enabled: true },
  { label: "Maintenance système", desc: "Interruptions et mises à jour", enabled: false },
  { label: "Alertes IA", desc: "Signaux prédictifs importants", enabled: true },
  { label: "Facturation", desc: "Confirmation de paiement", enabled: true },
];

export function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFS);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "settings">("all");

  const unread = notifs.filter(n => !n.read).length;
  const displayed = activeTab === "unread" ? notifs.filter(n => !n.read) : notifs;

  function markAll() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function remove(id: number) {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: "#e2e2e8" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #2d323e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>LIVE MARKET FEED</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#43ed9e" }} />
          <span style={{ color: "#43ed9e", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}>OPERATIONAL</span>
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 800 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 style={{ color: "#e2e2e8", fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Notifications</h1>
            {unread > 0 && (
              <span style={{ background: "#e6c364", color: "#111318", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px" }}>{unread}</span>
            )}
          </div>
          <button onClick={markAll} style={{
            background: "transparent", border: "1px solid #2d323e", borderRadius: "6px",
            padding: "7px 14px", color: "#99907e", fontSize: "11px", fontWeight: 600, cursor: "pointer"
          }}>
            Tout marquer comme lu
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "20px", background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "6px", padding: "4px", width: "fit-content" }}>
          {[
            { key: "all", label: "Toutes" },
            { key: "unread", label: `Non lues (${unread})` },
            { key: "settings", label: "Préférences" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)} style={{
              background: activeTab === t.key ? "#e6c364" : "transparent",
              color: activeTab === t.key ? "#111318" : "#99907e",
              border: "none", borderRadius: "4px", padding: "6px 14px",
              fontSize: "11px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
              transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>

        {activeTab === "settings" ? (
          <div style={{ background: "#1a1c20", border: "1px solid #2d323e", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d323e" }}>
              <div style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>PRÉFÉRENCES DE NOTIFICATION</div>
            </div>
            {SETTINGS_OPTIONS.map((opt, i) => (
              <div key={opt.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 20px",
                borderBottom: i < SETTINGS_OPTIONS.length - 1 ? "1px solid #1e2024" : "none"
              }}>
                <div>
                  <div style={{ color: "#e2e2e8", fontSize: "13px", fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ color: "#99907e", fontSize: "11px", marginTop: "2px" }}>{opt.desc}</div>
                </div>
                <div style={{
                  width: 40, height: 22, borderRadius: "11px",
                  background: opt.enabled ? "#e6c364" : "#2d323e",
                  position: "relative", cursor: "pointer", transition: "background 0.2s"
                }}>
                  <div style={{
                    position: "absolute", top: 3, left: opt.enabled ? 21 : 3,
                    width: 16, height: 16, borderRadius: "50%", background: opt.enabled ? "#111318" : "#99907e",
                    transition: "left 0.2s"
                  }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {displayed.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#99907e" }}>
                <Bell size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
                <p style={{ fontSize: "14px" }}>Aucune notification</p>
              </div>
            )}
            {displayed.map(n => {
              const Icon = TYPE_ICON[n.type as keyof typeof TYPE_ICON];
              const color = TYPE_COLOR[n.type as keyof typeof TYPE_COLOR];
              return (
                <div key={n.id} style={{
                  background: n.read ? "#1a1c20" : "#1e2024",
                  border: n.read ? "1px solid #2d323e" : "1px solid rgba(230,195,100,0.2)",
                  borderRadius: "8px", padding: "16px 20px",
                  display: "flex", gap: "14px", alignItems: "flex-start",
                  transition: "all 0.2s", cursor: "pointer",
                }} onClick={() => markRead(n.id)}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "8px",
                    background: `${color}1a`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <span style={{ color: n.read ? "#e2e2e8" : "#ffffff", fontSize: "13px", fontWeight: n.read ? 500 : 700 }}>{n.title}</span>
                      {!n.read && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e6c364", flexShrink: 0, marginLeft: 8, marginTop: 4 }} />
                      )}
                    </div>
                    <p style={{ color: "#99907e", fontSize: "12px", lineHeight: 1.5, margin: "0 0 6px" }}>{n.desc}</p>
                    <span style={{ color: "#4d4637", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>{n.time}</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); remove(n.id); }} style={{
                    background: "transparent", border: "none", color: "#4d4637", cursor: "pointer",
                    padding: "4px", display: "flex", alignItems: "center", borderRadius: "4px"
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
