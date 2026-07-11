import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

// Coquille + styles typographiques pour les pages légales (CGU, confidentialité).
export default function LegalShell({
  title,
  subtitle,
  updated,
  children,
}: {
  title: string;
  subtitle: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main style={{ background: "#fff", color: "#0B1B34" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "clamp(40px,7vw,80px) clamp(18px,5vw,40px)" }}>
          <div style={{ font: "600 12px/1.5 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A6478", marginBottom: 16 }}>
            Mentions légales
          </div>
          <h1 style={{ font: "800 clamp(2rem,5.5vw,3rem)/1.06 var(--font-schibsted),sans-serif", letterSpacing: "-.025em", margin: "0 0 14px", maxWidth: "20ch" }}>
            {title}
          </h1>
          <p style={{ font: "400 clamp(15px,2.2vw,17px)/1.6 var(--font-schibsted),sans-serif", color: "#48526A", margin: "0 0 8px", maxWidth: "56ch" }}>
            {subtitle}
          </p>
          <p style={{ font: "500 12.5px/1.5 var(--font-plex-mono),monospace", color: "#98A2B6", margin: "0 0 clamp(32px,5vw,48px)" }}>
            Dernière mise à jour : {updated}
          </p>
          <div className="legal-prose">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
