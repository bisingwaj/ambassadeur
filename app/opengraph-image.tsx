import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Aperçu social épuré généré à la volée (WhatsApp, Facebook, X, LinkedIn, messages…).
export const alt = `${SITE.name} — Ambassadeurs Communautaires`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,2 61.76,33.82 95.65,35.17 69.02,56.18 78.22,88.83 50,70 21.78,88.83 30.98,56.18 4.35,35.17 38.24,33.82' fill='#2E6AE0'/></svg>",
  );

const STAR_FAINT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,2 61.76,33.82 95.65,35.17 69.02,56.18 78.22,88.83 50,70 21.78,88.83 30.98,56.18 4.35,35.17 38.24,33.82' fill='#16294a'/></svg>",
  );

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0B1B34 0%, #12294f 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Étoile décorative en filigrane */}
        <img
          src={STAR_FAINT}
          width={620}
          height={620}
          style={{ position: "absolute", right: -140, top: -120, opacity: 0.55 }}
        />

        {/* En-tête : logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={STAR} width={48} height={48} />
          <span style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            {SITE.name}
          </span>
        </div>

        {/* Titre principal */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 74,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Ambassadeurs Communautaires
          </span>
          <span style={{ fontSize: 30, color: "#A9BCDE", lineHeight: 1.35, maxWidth: 820 }}>
            Le premier service d&apos;aide médicale urgente gratuit arrive à Kinshasa. Sa réussite dépend de nous.
          </span>
        </div>

        {/* Pied : badge 199 + domaine */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              background: "#2E6AE0",
              color: "#fff",
              fontSize: 30,
              fontWeight: 800,
              padding: "10px 22px",
              borderRadius: 999,
              letterSpacing: "0.02em",
            }}
          >
            199 · Le bon réflexe
          </span>
          <span style={{ fontSize: 26, color: "#7E93BC", fontWeight: 600 }}>{SITE.domainLabel}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
