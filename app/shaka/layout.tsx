import type { Metadata } from "next";
import Link from "next/link";
import { getServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import NavLink from "@/components/admin/NavLink";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email: string | null = null;
  if (isSupabaseConfigured) {
    const supabase = await getServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  }

  // Page de connexion (aucun utilisateur) : rendu simple, sans coquille.
  if (!email) return <>{children}</>;

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA" }}>
      <header style={{ background: "#0B1B34", color: "#fff" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px clamp(16px,4vw,28px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <Link href="/shaka" style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#2E6AE0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 100 100" style={{ width: 14, height: 14 }}><polygon points="50,2 61.76,33.82 95.65,35.17 69.02,56.18 78.22,88.83 50,70 21.78,88.83 30.98,56.18 4.35,35.17 38.24,33.82" fill="#fff" /></svg>
            </span>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Étoile Bleue</span>
            <span style={{ font: "500 11px/1 var(--font-plex-mono),monospace", color: "#7FA0DC", letterSpacing: ".06em" }}>· ADMIN</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <NavLink href="/shaka" label="Vue d'ensemble" exact />
              <NavLink href="/shaka/candidatures" label="Candidatures" />
            </nav>
            <span style={{ font: "400 13px/1 var(--font-schibsted),sans-serif", color: "#7FA0DC" }}>{email}</span>
            <form action={signOut}>
              <button type="submit" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "none", cursor: "pointer", font: "600 13px/1 var(--font-schibsted),sans-serif", padding: "8px 14px" }}>
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(20px,4vw,32px) clamp(16px,4vw,28px)" }}>
        {children}
      </div>
    </div>
  );
}
