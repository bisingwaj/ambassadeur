import Link from "next/link";
import Image from "next/image";

const Star = ({ size = 14, fill = "#fff" }: { size?: number; fill?: string }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} aria-hidden>
    <polygon
      points="50,2 61.76,33.82 95.65,35.17 69.02,56.18 78.22,88.83 50,70 21.78,88.83 30.98,56.18 4.35,35.17 38.24,33.82"
      fill={fill}
    />
  </svg>
);

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,.94)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #E5E8EF",
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "12px clamp(14px,4vw,40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,2.4vw,16px)", minWidth: 0 }}>
          <Image
            src="/ministere-sante.png"
            alt="République démocratique du Congo — Ministère de la Santé Publique, Hygiène et Prévoyance sociale"
            width={120}
            height={33}
            priority
            style={{ height: "clamp(27px,4.4vw,33px)", width: "auto", display: "block", flex: "none" }}
          />
          <span style={{ width: 1, height: 26, background: "#DDE2EB", flex: "none" }} />
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span
              style={{
                width: 26, height: 26, borderRadius: "50%", background: "#2E6AE0",
                display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
              }}
            >
              <Star />
            </span>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#0B1B34", letterSpacing: "-.02em", whiteSpace: "nowrap" }}>
              Étoile Bleue
            </span>
          </Link>
        </div>
        <Link
          href="/candidature"
          className="eb-cta"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, color: "#fff",
            fontWeight: 600, fontSize: 14, padding: "10px 16px",
          }}
        >
          Candidater
        </Link>
      </div>
    </header>
  );
}
