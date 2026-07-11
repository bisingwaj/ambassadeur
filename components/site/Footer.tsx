import Link from "next/link";
import { SITE, COPYRIGHT_YEAR } from "@/lib/site";

const Star = () => (
  <svg viewBox="0 0 100 100" style={{ width: 14, height: 14 }} aria-hidden>
    <polygon
      points="50,2 61.76,33.82 95.65,35.17 69.02,56.18 78.22,88.83 50,70 21.78,88.83 30.98,56.18 4.35,35.17 38.24,33.82"
      fill="#fff"
    />
  </svg>
);

const navLinks = [
  { href: "/#projet", label: "Le projet" },
  { href: "/#projet", label: "Le constat" },
  { href: "/#role", label: "Ta mission" },
  { href: "/#criteres", label: "Les critères" },
  { href: "/#faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0B1B34", color: "#fff", padding: "clamp(48px,8vw,80px) clamp(18px,5vw,40px) 40px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "clamp(28px,4vw,48px)",
            paddingBottom: "clamp(32px,5vw,48px)",
            borderBottom: "1px solid rgba(255,255,255,.14)",
          }}
        >
          <div style={{ maxWidth: "38ch" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#2E6AE0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Star />
              </span>
              <span style={{ fontWeight: 800, fontSize: 17 }}>Étoile Bleue</span>
            </div>
            <p style={{ font: "400 14.5px/1.6 var(--font-schibsted),sans-serif", color: "#A9BCDE", margin: 0 }}>
              Le premier service d&apos;aide médicale urgente gratuit de la RDC — un projet national, en phase pilote à Kinshasa. Le 199, le bon réflexe.
            </p>
          </div>

          <div>
            <div style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E83AC", marginBottom: 16 }}>
              Navigation
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 11 }}>
              {navLinks.map((l, i) => (
                <li key={i}>
                  <Link href={l.href} style={{ color: "#D4DEEF", fontSize: 14.5 }}>{l.label}</Link>
                </li>
              ))}
              <li>
                <a href={SITE.social.whatsapp} style={{ color: "#D4DEEF", fontSize: 14.5 }}>WhatsApp</a>
              </li>
            </ul>
          </div>

          <div>
            <div style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E83AC", marginBottom: 16 }}>
              Urgence
            </div>
            <div style={{ font: "800 clamp(2.4rem,6vw,3.2rem)/1 var(--font-schibsted),sans-serif", letterSpacing: "-.02em", color: "#fff", marginBottom: 8 }}>
              199
            </div>
            <p style={{ font: "400 13.5px/1.5 var(--font-schibsted),sans-serif", color: "#A9BCDE", margin: 0 }}>
              Service public gratuit, 24 h/24 et 7 j/7.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
              <a href={SITE.social.instagram} style={{ color: "#D4DEEF", fontSize: 14 }}>Instagram</a>
              <a href={SITE.social.facebook} style={{ color: "#D4DEEF", fontSize: 14 }}>Facebook</a>
            </div>
          </div>
        </div>

        <p style={{ font: "400 13px/1.6 var(--font-schibsted),sans-serif", color: "#6E83AC", margin: "24px 0 0", maxWidth: "80ch" }}>
          Étoile Bleue est un service de la {SITE.coordination} — {SITE.ministere}.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 20 }}>
          <Link href="/conditions" style={{ font: "500 13px/1 var(--font-schibsted),sans-serif", color: "#A9BCDE" }}>Conditions d&apos;utilisation</Link>
          <Link href="/confidentialite" style={{ font: "500 13px/1 var(--font-schibsted),sans-serif", color: "#A9BCDE" }}>Politique de confidentialité</Link>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
          <span style={{ font: "400 13px/1 var(--font-schibsted),sans-serif", color: "#6E83AC" }}>
            © {COPYRIGHT_YEAR} Étoile Bleue — Kinshasa, RDC
          </span>
          <span style={{ font: "500 13px/1 var(--font-plex-mono),monospace", color: "#6E83AC" }}>
            {SITE.domainLabel}
          </span>
        </div>
      </div>
    </footer>
  );
}
