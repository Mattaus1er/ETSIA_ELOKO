import { useState } from "react";
import { useNavigate } from "react-router";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/app");
    }, 1000);
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#080a0e",
      display: "flex", flexDirection: "column",
      fontFamily: "'Manrope', sans-serif", color: "#e2e2e8"
    }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{
          width: "100%", maxWidth: 400,
          background: "#111318", border: "1px solid #2d323e",
          borderRadius: "8px", padding: "40px 32px"
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ color: "#e6c364", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.02em", marginBottom: "16px" }}>
              ELOKO
            </div>
            <h2 style={{ color: "#e2e2e8", fontWeight: 600, fontSize: "20px", marginBottom: "6px" }}>Welcome Back</h2>
            <p style={{ color: "#99907e", fontSize: "13px" }}>Enter your credentials to access the terminal</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "8px" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@institution.com"
                style={{
                  width: "100%", background: "#1a1c20", border: "1px solid #2d323e",
                  borderRadius: "6px", padding: "10px 12px",
                  color: "#e2e2e8", fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace",
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ color: "#99907e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>PASSWORD</label>
                <a href="#" style={{ color: "#e6c364", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>Forgot Password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", background: "#1a1c20", border: "1px solid #2d323e",
                  borderRadius: "6px", padding: "10px 12px",
                  color: "#e2e2e8", fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace",
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: "#e6c364", color: "#111318",
                border: "none", borderRadius: "6px", padding: "13px",
                fontSize: "14px", fontWeight: 700, cursor: "pointer",
                letterSpacing: "0.02em", opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s"
              }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: 1, background: "#2d323e" }} />
            <span style={{ color: "#99907e", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: "#2d323e" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Google", icon: "G" },
              { label: "Apple", icon: "" },
            ].map(({ label, icon }) => (
              <button key={label} style={{
                width: "100%", background: "transparent", border: "1px solid #2d323e",
                borderRadius: "6px", padding: "11px",
                color: "#e2e2e8", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }}>
                <span style={{ fontWeight: 800 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: "center", color: "#99907e", fontSize: "13px", marginTop: "24px" }}>
            Don't have an account?{" "}
            <a href="#" style={{ color: "#e6c364", fontWeight: 600, textDecoration: "none" }}>Sign Up</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1a1c20", padding: "16px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ color: "#4d4637", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em" }}>
          © 2024 ELOKO FINANCIAL INTELLIGENCE. ALL RIGHTS RESERVED.
        </span>
        <div className="flex gap-4">
          {["PRIVACY POLICY", "TERMS OF SERVICE", "SECURITY ARCHITECTURE", "API DOCUMENTATION"].map(l => (
            <a key={l} href="#" style={{ color: "#4d4637", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
