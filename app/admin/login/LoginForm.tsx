"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  // Anti open-redirect : uniquement un chemin interne (/admin…), jamais //evil ni http(s)://…
  const rawNext = params.get("next") || "/admin";
  const next = /^\/admin(?:\/|$)/.test(rawNext) ? rawNext : "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = getBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
      setLoading(false);
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", border: "1px solid #D7DEEA", background: "#fff", padding: "13px 15px",
    font: "500 15px/1.4 var(--font-schibsted),sans-serif", color: "#0B1B34", outline: "none",
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#fff", border: "1px solid #E5E8EF", padding: "clamp(28px,5vw,40px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#2E6AE0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 100 100" style={{ width: 15, height: 15 }}><polygon points="50,2 61.76,33.82 95.65,35.17 69.02,56.18 78.22,88.83 50,70 21.78,88.83 30.98,56.18 4.35,35.17 38.24,33.82" fill="#fff" /></svg>
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0B1B34", letterSpacing: "-.02em" }}>Étoile Bleue</div>
            <div style={{ font: "500 11px/1 var(--font-plex-mono),monospace", color: "#98A2B6", marginTop: 2 }}>DASHBOARD ADMIN</div>
          </div>
        </div>

        <h1 style={{ font: "800 1.4rem/1.2 var(--font-schibsted),sans-serif", color: "#0B1B34", margin: "0 0 20px" }}>Connexion</h1>

        {!configured && (
          <p style={{ font: "400 13px/1.5 var(--font-schibsted),sans-serif", color: "#B23B2A", background: "#FCECE9", padding: "10px 12px", margin: "0 0 16px" }}>
            Supabase n&apos;est pas encore configuré. Renseigne les variables d&apos;environnement (voir README).
          </p>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={{ font: "600 12.5px/1 var(--font-schibsted),sans-serif", color: "#5A6478", display: "block", marginBottom: 7 }}>E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inp} autoComplete="username" />
          </div>
          <div>
            <label style={{ font: "600 12.5px/1 var(--font-schibsted),sans-serif", color: "#5A6478", display: "block", marginBottom: 7 }}>Mot de passe</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inp} autoComplete="current-password" />
          </div>
          {error && <p style={{ font: "600 13px/1.4 var(--font-schibsted),sans-serif", color: "#C8402C", margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} className="eb-cta" style={{ color: "#fff", border: "none", cursor: loading ? "default" : "pointer", fontWeight: 700, fontSize: 15, padding: "14px 20px", marginTop: 4 }}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
