"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COPYRIGHT_YEAR, SITE } from "@/lib/site";

// Message personnel partagé après la candidature — le lien génère l'aperçu épuré (image OG).
const SHARE_TEXT =
  "Je viens de rejoindre les Ambassadeurs Communautaires d'Étoile Bleue 🌟 pour contribuer à rendre le 199 — le service d'aide médicale urgente gratuit qui va bientôt être lancé à Kinshasa — accessible près de chez moi. Rejoins le mouvement 👇";

export default function ConfirmationView() {
  const params = useSearchParams();
  const [ref, setRef] = useState<string>(params.get("ref") || "");
  const [prenom, setPrenom] = useState<string>("");

  useEffect(() => {
    if (!ref || !prenom) {
      try {
        const raw = localStorage.getItem("eb_candidature");
        if (raw) {
          const rec = JSON.parse(raw);
          if (!ref && rec.ref) setRef(rec.ref);
          if (rec.prenom) setPrenom(rec.prenom);
        }
      } catch {}
    }
  }, [ref, prenom]);

  async function share() {
    const url = SITE.url;
    // Partage natif (WhatsApp, SMS, réseaux sociaux…) quand le navigateur le supporte.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: SITE.fullName, text: SHARE_TEXT, url });
        return;
      } catch {
        // annulé par l'utilisateur ou non supporté → repli ci-dessous
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${url}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(40px,8vw,80px) clamp(18px,5vw,28px)" }}>
        <div style={{ width: "100%", maxWidth: 620 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#2E6AE0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 100 100" style={{ width: 15, height: 15 }}><polygon points="50,2 61.76,33.82 95.65,35.17 69.02,56.18 78.22,88.83 50,70 21.78,88.83 30.98,56.18 4.35,35.17 38.24,33.82" fill="#fff" /></svg>
            </span>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#0B1B34", letterSpacing: "-.02em" }}>Étoile Bleue</span>
          </div>

          <div style={{ width: 64, height: 64, background: "#EAF6F0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
            <svg viewBox="0 0 32 32" style={{ width: 34, height: 34 }} fill="none"><path d="M6 16.5l6 6L26 9" stroke="#1FA97C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>

          <h1 style={{ font: "800 clamp(2rem,6vw,3rem)/1.06 var(--font-schibsted),sans-serif", letterSpacing: "-.025em", color: "#0B1B34", margin: "0 0 16px" }}>
            {prenom ? `Merci, ${prenom} — ` : ""}Candidature reçue.
          </h1>
          <p style={{ font: "400 clamp(15.5px,2.4vw,18px)/1.6 var(--font-schibsted),sans-serif", color: "#48526A", margin: "0 0 32px", maxWidth: "50ch" }}>
            Tu fais désormais partie des candidats à la première cohorte d&apos;Ambassadeurs Communautaires Étoile Bleue. On a bien reçu ton dossier — voici ce qui t&apos;attend.
          </p>

          {ref && (
            <div style={{ border: "1px solid #E5E8EF", padding: "18px 20px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <span style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#98A2B6" }}>Référence</span>
              <span style={{ font: "600 16px/1 var(--font-plex-mono),monospace", color: "#0B1B34", letterSpacing: ".02em" }}>{ref}</span>
            </div>
          )}

          <ol style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "grid", gap: 2 }}>
            {[
              ["Vérification", "Notre équipe examine ta candidature dans les prochains jours."],
              ["Contact WhatsApp", "Tu es recontacté(e) sur le numéro que tu as indiqué."],
              ["Formation", "Premiers secours, mission d'ambassadeur et prise de parole avant le terrain."],
            ].map(([t, d], i) => (
              <li key={t} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 16, padding: "16px 0", borderTop: "1px solid #E5E8EF" }}>
                <span style={{ font: "500 13px/1.4 var(--font-plex-mono),monospace", color: "#2E6AE0" }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ font: "700 15.5px/1.3 var(--font-schibsted),sans-serif", color: "#0B1B34", marginBottom: 3 }}>{t}</div>
                  <div style={{ font: "400 14.5px/1.5 var(--font-schibsted),sans-serif", color: "#5A6478" }}>{d}</div>
                </div>
              </li>
            ))}
          </ol>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              onClick={share}
              className="eb-cta"
              style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#fff", fontWeight: 600, fontSize: 15.5, padding: "14px 22px", border: "none", cursor: "pointer" }}
            >
              Partager mon engagement <span aria-hidden>→</span>
            </button>
            <Link href="/" className="eb-link-under" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#0B1B34", fontWeight: 600, fontSize: 15.5, padding: "14px 10px" }}>
              Retour à l&apos;accueil
            </Link>
          </div>

          <p style={{ font: "400 14px/1.6 var(--font-schibsted),sans-serif", color: "#5A6478", margin: "34px 0 0" }}>
            Garde un œil sur ton WhatsApp — c&apos;est par là qu&apos;on te recontactera.
          </p>

          <p style={{ font: "400 12.5px/1.5 var(--font-schibsted),sans-serif", color: "#98A2B6", margin: "40px 0 0", paddingTop: 20, borderTop: "1px solid #EDF0F5" }}>
            © {COPYRIGHT_YEAR} Étoile Bleue — Kinshasa, RDC · Le 199, le bon réflexe.
          </p>
        </div>
      </main>
    </div>
  );
}
