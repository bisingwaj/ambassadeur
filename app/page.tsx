import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LandingInteractions from "@/components/site/LandingInteractions";
import { FAQ } from "@/lib/questions";
import { SITE } from "@/lib/site";
import { getCohortCount } from "@/lib/candidatures";

export const revalidate = 120; // le compteur se rafraîchit toutes les 2 min

// ── Petits helpers de mise en page ──────────────────────────────────────
function Eyebrow({ num, label, dark = false }: { num: string; label: string; dark?: boolean }) {
  return (
    <div
      data-reveal
      style={{
        display: "flex", alignItems: "baseline", gap: 14,
        borderTop: `1px solid ${dark ? "rgba(255,255,255,.3)" : "#0B1B34"}`,
        paddingTop: 14, marginBottom: "clamp(28px,5vw,44px)",
      }}
    >
      <span style={{ font: "500 13px/1 var(--font-plex-mono),monospace", color: dark ? "#6E83AC" : "#98A2B6" }}>{num}</span>
      <span style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: dark ? "#A9BCDE" : "#48526A" }}>{label}</span>
    </div>
  );
}

const H2 = "font:800 clamp(1.9rem,5.2vw,3.1rem)/1.05 var(--font-schibsted),sans-serif";
const wrap = { maxWidth: 1160, margin: "0 auto" } as const;
const sectionPad = "clamp(56px,9vw,104px) clamp(18px,5vw,40px)";

export default async function Home() {
  const inscrits = await getCohortCount();
  const objectif = SITE.cohorte.objectif;
  const restants = Math.max(0, objectif - inscrits);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: "Étoile Bleue — Ambassadeurs Communautaires",
    serviceType: "Service d'aide médicale urgente",
    areaServed: { "@type": "City", name: "Kinshasa" },
    provider: { "@type": "GovernmentOrganization", name: SITE.ministere },
    description: SITE.description,
    url: SITE.url,
    telephone: "199",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main style={{ background: "#fff", color: "#0B1B34" }}>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section id="top" style={{ background: "#fff", padding: "clamp(56px,9vw,110px) clamp(18px,5vw,40px) clamp(40px,6vw,64px)" }}>
          <div style={wrap}>
            <div data-reveal style={{ font: "600 12px/1.5 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A6478", marginBottom: "clamp(20px,3.5vw,28px)" }}>
              Projet national · Phase pilote à Kinshasa · Cohorte 01
            </div>
            <h1 data-reveal style={{ font: "800 clamp(2.2rem,7.6vw,4.6rem)/1.02 var(--font-schibsted),sans-serif", letterSpacing: "-.03em", margin: "0 0 clamp(22px,3.4vw,30px)", maxWidth: "19ch" }}>
              Le premier service d&apos;aide médicale urgente <span style={{ color: "#2E6AE0" }}>gratuit</span> arrive à Kinshasa.
            </h1>
            <p data-reveal style={{ font: "400 clamp(16px,2.3vw,19px)/1.6 var(--font-schibsted),sans-serif", color: "#48526A", margin: "0 0 clamp(28px,4vw,36px)", maxWidth: "52ch" }}>
              Un numéro unique, le 199. Une flotte médicalisée, entièrement gratuite. Il manque une seule chose pour que ça sauve des vies : que la population soit prête. <strong style={{ color: "#0B1B34", fontWeight: 700 }}>Sa réussite dépend de nous.</strong> C&apos;est pourquoi Étoile Bleue recrute ses <strong style={{ color: "#0B1B34", fontWeight: 700 }}>Ambassadeurs Communautaires</strong>.
            </p>
            <div data-reveal style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <Link href="/candidature" className="eb-cta" style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#fff", fontWeight: 600, fontSize: "clamp(15px,2vw,16.5px)", padding: "15px 24px" }}>
                Devenir ambassadeur <span aria-hidden>→</span>
              </Link>
              <a href="#projet" className="eb-link-under" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#0B1B34", fontWeight: 600, fontSize: "clamp(15px,2vw,16.5px)", padding: "15px 10px" }}>
                Découvrir le projet
              </a>
            </div>
            <div data-reveal style={{ marginTop: "clamp(44px,8vw,80px)", borderTop: "1px solid #0B1B34", paddingTop: "clamp(20px,3vw,28px)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "clamp(18px,3vw,32px)" }}>
                {[
                  ["199", "Numéro d'urgence unique"],
                  ["0 FC", "Service public gratuit"],
                  ["24/7", "Régulation médicale"],
                  ["65 + 150", "Ambulances et motos médicalisées"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ font: "800 clamp(1.4rem,3vw,1.8rem)/1.1 var(--font-schibsted),sans-serif", letterSpacing: "-.01em", color: "#0B1B34" }}>{n}</div>
                    <div style={{ font: "400 13.5px/1.45 var(--font-schibsted),sans-serif", color: "#5A6478", marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 01 LE CONSTAT ─────────────────────────────────────────── */}
        <section id="projet" style={{ background: "#fff", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="01" label="Le constat" />
            <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", margin: "0 0 clamp(34px,6vw,54px)", maxWidth: "24ch" }}>
              Être secouru ne devrait pas être un privilège.
            </h2>
            {[
              ["01", "Chaque jour, des milliers de personnes ont besoin d'une ", "aide urgente", "#F0604D", ".", "Un accident, un malaise, un accouchement qui se passe mal… Et beaucoup n'obtiennent jamais cette aide à temps."],
              ["02", "Les secours n'étaient ni gratuits, ", "ni pour tout le monde", "#F2A31C", ".", "Ils étaient réservés à ceux qui avaient les moyens. Et souvent, ils arrivaient trop tard — ou pas du tout."],
              ["03", "66 ans après l'indépendance, toujours ", "aucun numéro à appeler", "#2E6AE0", ".", "Quand une vie était en danger, on ne savait pas qui appeler. Ce numéro n'existait tout simplement pas."],
            ].map(([n, pre, hl, col, post, body]) => (
              <div key={n} data-reveal style={{ borderTop: "1px solid #E5E8EF", padding: "clamp(24px,4vw,36px) 0", display: "grid", gridTemplateColumns: "44px 1fr", gap: "clamp(14px,3vw,28px)" }}>
                <span style={{ font: "500 13px/1.5 var(--font-plex-mono),monospace", color: "#98A2B6" }}>{n}</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "clamp(10px,2vw,44px)", alignItems: "start" }}>
                  <h3 style={{ font: "800 clamp(1.35rem,3.4vw,2rem)/1.12 var(--font-schibsted),sans-serif", letterSpacing: "-.015em", margin: 0, maxWidth: "22ch" }}>
                    {pre}<span style={{ color: col }}>{hl}</span>{post}
                  </h3>
                  <p style={{ font: "400 clamp(15px,1.9vw,17px)/1.6 var(--font-schibsted),sans-serif", color: "#48526A", margin: 0, maxWidth: "46ch" }}>{body}</p>
                </div>
              </div>
            ))}
            <div data-reveal style={{ borderTop: "1px solid #0B1B34", paddingTop: "clamp(26px,4vw,40px)", marginTop: "clamp(8px,2vw,16px)" }}>
              <p style={{ font: "800 clamp(1.5rem,4.4vw,2.6rem)/1.18 var(--font-schibsted),sans-serif", letterSpacing: "-.02em", margin: 0, maxWidth: "30ch" }}>
                On a fini par croire que c&apos;était normal. <span style={{ color: "#F0604D" }}>Ce n&apos;est pas normal.</span><br />
                Et c&apos;est ça qui change, maintenant, <span style={{ color: "#2E6AE0" }}>avec Étoile Bleue.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── 02 L'ENJEU HUMAIN ─────────────────────────────────────── */}
        <section style={{ background: "#0B1B34", color: "#fff", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="02" label="L'enjeu humain" dark />
            <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", color: "#fff", margin: "0 0 clamp(34px,6vw,54px)", maxWidth: "24ch" }}>
              Quand une vie est en danger, chaque minute compte.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "clamp(22px,3vw,32px)" }}>
              {[
                ["0–10", "min", "Les premiers instants", "Ce sont les personnes présentes qui peuvent tout changer : appeler le 199, protéger la victime, faire les premiers gestes.", false],
                ["10–60", "min", "Les secours arrivent", "Une moto rapide ou une ambulance, avec des professionnels à bord. Quand l'aide arrive dans l'heure, une vie peut être sauvée.", true],
                ["+60", "min", "L'hôpital continue le travail", "Plus l'aide a été rapide avant l'hôpital, plus les médecins ont de chances de sauver la personne.", false],
              ].map(([num, unit, title, body, hi]) => (
                <div key={title as string} data-reveal style={{ borderTop: hi ? "2px solid #4C8DF0" : "2px solid rgba(255,255,255,.35)", paddingTop: 18 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ font: "800 clamp(2rem,4.6vw,2.8rem)/1 var(--font-schibsted),sans-serif", letterSpacing: "-.02em", color: "#fff" }}>{num}</span>
                      <span style={{ font: "500 13px/1 var(--font-plex-mono),monospace", color: "#7FA0DC" }}>{unit}</span>
                    </div>
                    {hi && <span style={{ font: "500 10.5px/1 var(--font-plex-mono),monospace", letterSpacing: ".08em", textTransform: "uppercase", color: "#7FB0FA", border: "1px solid rgba(76,141,240,.6)", padding: "5px 8px" }}>L&apos;heure qui décide</span>}
                  </div>
                  <h3 style={{ font: "700 clamp(1.05rem,2.2vw,1.25rem)/1.2 var(--font-schibsted),sans-serif", color: "#fff", margin: "0 0 8px" }}>{title}</h3>
                  <p style={{ font: "400 14.5px/1.55 var(--font-schibsted),sans-serif", color: "#A9BCDE", margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
            <div data-reveal style={{ marginTop: "clamp(34px,6vw,52px)", borderTop: "1px solid rgba(255,255,255,.14)", paddingTop: "clamp(24px,4vw,36px)" }}>
              <p style={{ font: "700 clamp(1.25rem,3vw,1.8rem)/1.3 var(--font-schibsted),sans-serif", letterSpacing: "-.01em", color: "#fff", margin: 0, maxWidth: "44ch" }}>
                La première personne qui sauve une vie, ce n&apos;est ni le médecin, ni l&apos;ambulancier. <span style={{ color: "#7FB0FA" }}>C&apos;est celui qui est là — et qui sait quoi faire.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── 03 LA RÉPONSE ─────────────────────────────────────────── */}
        <section style={{ background: "#fff", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="03" label="La réponse" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(26px,5vw,60px)", alignItems: "end", marginBottom: "clamp(34px,6vw,54px)" }}>
              <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", margin: 0, maxWidth: "20ch" }}>
                Une réponse nationale, intégrée et gratuite.
              </h2>
              <div data-reveal style={{ font: "800 clamp(4.4rem,15vw,9rem)/0.85 var(--font-schibsted),sans-serif", letterSpacing: "-.04em", color: "#2E6AE0", textAlign: "right" }}>199</div>
            </div>
            <div style={{ borderTop: "1px solid #E5E8EF" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "clamp(18px,3vw,32px)", paddingTop: "clamp(20px,3vw,28px)" }}>
                {[
                  ["Gratuit — 0 FC", "Service public, accessible à tous"],
                  ["Régulation 24/7", "Coordination médicale permanente"],
                  ["Application d'alerte", "Plateforme numérique et mobile"],
                  ["Projet national", "La phase pilote commence à Kinshasa, avant l'extension à tout le pays"],
                ].map(([t, d]) => (
                  <div key={t} data-reveal>
                    <div style={{ font: "700 16.5px/1.25 var(--font-schibsted),sans-serif", color: "#0B1B34", marginBottom: 4 }}>{t}</div>
                    <div style={{ font: "400 14px/1.5 var(--font-schibsted),sans-serif", color: "#5A6478" }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal style={{ marginTop: "clamp(26px,4vw,38px)", borderTop: "1px solid #E5E8EF", paddingTop: "clamp(20px,3vw,28px)", display: "flex", flexWrap: "wrap", gap: "clamp(28px,6vw,72px)" }}>
              {[
                [65, "ambulances médicalisées"],
                [150, "motos médicalisées"],
                [29, "structures de prise en charge présélectionnées"],
              ].map(([n, l]) => (
                <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div>
                    <span data-count={n} style={{ font: "800 clamp(1.9rem,4.6vw,2.7rem)/1 var(--font-schibsted),sans-serif", letterSpacing: "-.02em", color: "#0B1B34" }}>{n}</span>
                    <div style={{ font: "400 13.5px/1.4 var(--font-schibsted),sans-serif", color: "#5A6478", marginTop: 2, maxWidth: "22ch" }}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 LE FACTEUR DÉCISIF ─────────────────────────────────── */}
        <section style={{ background: "#F5F7FA", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="04" label="Le facteur décisif" />
            <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", margin: "0 0 clamp(34px,6vw,54px)", maxWidth: "24ch" }}>
              L&apos;infrastructure seule ne sauvera personne.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "clamp(26px,5vw,64px)" }}>
              <div data-reveal>
                <div style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#98A2B6", marginBottom: 6 }}>Un service équipé…</div>
                {["Un numéro national, le 199", "65 ambulances, 150 motos médicalisées", "29 structures de prise en charge présélectionnées", "Une régulation médicale 24/7", "Un personnel formé"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 0", borderBottom: "1px solid #E1E5EC" }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, flex: "none" }} fill="none"><path d="M4 12.5l5 5L20 6" stroke="#98A2B6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ font: "500 clamp(15px,2vw,16.5px)/1.4 var(--font-schibsted),sans-serif", color: "#48526A" }}>{t}</span>
                  </div>
                ))}
              </div>
              <div data-reveal>
                <div style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#2E6AE0", marginBottom: 6 }}>…n&apos;est utile que si</div>
                {["La population connaît le 199", "Elle sait quand et comment appeler", "Elle agit en attendant les secours"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 0", borderBottom: "1px solid #E1E5EC" }}>
                    <span style={{ width: 6, height: 6, background: "#2E6AE0", flex: "none" }} />
                    <span style={{ font: "700 clamp(15px,2vw,16.5px)/1.4 var(--font-schibsted),sans-serif", color: "#0B1B34" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal style={{ marginTop: "clamp(34px,6vw,52px)" }}>
              <p style={{ font: "700 clamp(1.25rem,3vw,1.8rem)/1.3 var(--font-schibsted),sans-serif", letterSpacing: "-.01em", color: "#0B1B34", margin: 0, maxWidth: "42ch" }}>
                La réussite du lancement dépend d&apos;une variable que ni les ambulances ni la technologie ne contrôlent : <span style={{ color: "#2E6AE0" }}>toi.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── 05 TA MISSION ─────────────────────────────────────────── */}
        <section id="role" style={{ background: "#fff", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="05" label="Ta mission" />
            <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", margin: "0 0 clamp(28px,5vw,44px)", maxWidth: "24ch" }}>
              Ambassadeur Communautaire Étoile Bleue : le premier maillon de la chaîne de secours.
            </h2>
            {[
              ["01", "Informer", "Faire connaître le 199, le service et sa gratuité — avant le tout premier appel."],
              ["02", "Sensibiliser", "Diffuser les bons réflexes et les gestes de premiers secours dans chaque quartier."],
              ["03", "Accompagner", "Guider les citoyens vers le bon usage du service au moment du lancement officiel."],
            ].map(([n, t, body], i) => (
              <div key={n} data-reveal style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: "clamp(14px,3vw,28px)", padding: "clamp(22px,3.6vw,32px) 0", borderTop: "1px solid #E5E8EF", borderBottom: i === 2 ? "1px solid #E5E8EF" : undefined }}>
                <span style={{ font: "500 13px/1.4 var(--font-plex-mono),monospace", color: "#98A2B6" }}>{n}</span>
                <div>
                  <h3 style={{ font: "800 clamp(1.35rem,3.2vw,1.9rem)/1.1 var(--font-schibsted),sans-serif", letterSpacing: "-.015em", margin: "0 0 8px" }}>{t}</h3>
                  <p style={{ font: "400 clamp(15px,1.8vw,17px)/1.55 var(--font-schibsted),sans-serif", color: "#48526A", margin: 0, maxWidth: "56ch" }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 06 AU QUOTIDIEN ───────────────────────────────────────── */}
        <section style={{ background: "#0B1B34", color: "#fff", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="06" label="Au quotidien" dark />
            <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", color: "#fff", margin: "0 0 clamp(34px,6vw,54px)", maxWidth: "20ch" }}>
              Une mission, trois terrains.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "clamp(22px,3vw,32px)" }}>
              {[
                ["Terrain", "Actions de proximité", ["Écoles et universités", "Marchés et quartiers", "Associations et lieux de culte"]],
                ["Numérique", "Présence en ligne", ["Relais des campagnes digitales", "Animation de ta communauté", "Réponses aux questions du public"]],
                ["Création", "Tes propres contenus", ["Dans ton propre style", "Validés avant diffusion", "Une information toujours fiable"]],
              ].map(([kicker, title, items]) => (
                <div key={kicker as string} data-reveal style={{ borderTop: "2px solid rgba(255,255,255,.35)", paddingTop: 18 }}>
                  <div style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#7FA0DC", marginBottom: 8 }}>{kicker}</div>
                  <h3 style={{ font: "700 clamp(1.1rem,2.4vw,1.35rem)/1.2 var(--font-schibsted),sans-serif", color: "#fff", margin: "0 0 14px" }}>{title}</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                    {(items as string[]).map((it) => (
                      <li key={it} style={{ font: "400 14.5px/1.5 var(--font-schibsted),sans-serif", color: "#A9BCDE", display: "flex", gap: 10 }}>
                        <span style={{ color: "#4C8DF0" }}>—</span> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p data-reveal style={{ font: "700 clamp(1.15rem,2.6vw,1.6rem)/1.35 var(--font-schibsted),sans-serif", color: "#fff", margin: "clamp(30px,5vw,48px) 0 0", maxWidth: "48ch" }}>
              Chaque ambassadeur garde son identité, sa créativité et sa manière de communiquer.
            </p>
          </div>
        </section>

        {/* ── 07 LES CRITÈRES ───────────────────────────────────────── */}
        <section id="criteres" style={{ background: "#fff", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="07" label="Les critères" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(26px,5vw,60px)", alignItems: "start" }}>
              <div>
                <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", margin: "0 0 clamp(20px,3vw,28px)", maxWidth: "14ch" }}>Tu as :</h2>
                <p data-reveal style={{ font: "400 clamp(15px,2vw,17px)/1.6 var(--font-schibsted),sans-serif", color: "#48526A", margin: "0 0 24px", maxWidth: "40ch" }}>
                  Pas besoin de diplôme. Juste l&apos;envie d&apos;agir pour les gens de ton quartier.
                </p>
                <Link href="/candidature" className="eb-cta" data-reveal style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#fff", fontWeight: 600, fontSize: "clamp(15px,2vw,16.5px)", padding: "15px 24px" }}>
                  Alors on te cherche <span aria-hidden>→</span>
                </Link>
              </div>
              <div data-reveal>
                {["18 ans et plus", "Un smartphone (WhatsApp)", "Tu vis à Kinshasa", "L'envie d'aider"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "clamp(16px,2.4vw,20px) 0", borderTop: "1px solid #E5E8EF" }}>
                    <span style={{ width: 26, height: 26, flex: "none", background: "#F1F6FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none"><path d="M4 12.5l5 5L20 6" stroke="#2E6AE0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span style={{ font: "700 clamp(1.05rem,2.4vw,1.35rem)/1.2 var(--font-schibsted),sans-serif", color: "#0B1B34" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 L'ENGAGEMENT RÉCIPROQUE ────────────────────────────── */}
        <section style={{ background: "#F5F7FA", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="08" label="L'engagement réciproque" />
            <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", margin: "0 0 clamp(34px,6vw,54px)", maxWidth: "20ch" }}>
              Formé, outillé, accompagné.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "clamp(22px,3vw,32px)" }}>
              {[
                ["Formation certifiante", "Premiers secours, mission d'ambassadeur, prise de parole — initiale puis continue."],
                ["Outils de communication", "Kits visuels, supports validés et argumentaires, prêts à l'emploi et adaptables."],
                ["Reporting simple", "Des outils légers pour suivre tes actions et mesurer l'impact collectif."],
                ["Communauté nationale", "Des échanges permanents entre ambassadeurs et avec l'équipe Étoile Bleue."],
              ].map(([t, d]) => (
                <div key={t} data-reveal style={{ background: "#fff", border: "1px solid #E5E8EF", padding: "clamp(20px,3vw,26px)" }}>
                  <h3 style={{ font: "700 clamp(1.05rem,2.2vw,1.25rem)/1.25 var(--font-schibsted),sans-serif", color: "#0B1B34", margin: "0 0 8px" }}>{t}</h3>
                  <p style={{ font: "400 14.5px/1.55 var(--font-schibsted),sans-serif", color: "#48526A", margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 09 LA COHORTE 01 (compteur) ───────────────────────────── */}
        <section style={{ background: "#0B1B34", color: "#fff", padding: sectionPad }}>
          <div style={wrap}>
            <Eyebrow num="09" label="La Cohorte 01" dark />
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span style={{ font: "800 clamp(3.4rem,12vw,7rem)/0.9 var(--font-schibsted),sans-serif", letterSpacing: "-.03em", color: "#fff" }}>{inscrits}</span>
              <span style={{ font: "600 clamp(1.2rem,3vw,1.8rem)/1 var(--font-schibsted),sans-serif", color: "#4C8DF0" }}>/ {objectif}</span>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,.12)", marginTop: 20, maxWidth: 560 }}>
              <div style={{ height: "100%", width: `${Math.min(100, (inscrits / objectif) * 100)}%`, background: "#2E6AE0" }} />
            </div>
            <p data-reveal style={{ font: "400 clamp(15px,2vw,17px)/1.6 var(--font-schibsted),sans-serif", color: "#A9BCDE", margin: "20px 0 0", maxWidth: "48ch" }}>
              ambassadeurs communautaires déjà inscrits — il reste <strong style={{ color: "#fff" }}>{restants} places</strong> dans la première cohorte. Objectif : les 24 communes de Kinshasa.
            </p>
          </div>
        </section>

        {/* ── 10 FAQ ────────────────────────────────────────────────── */}
        <section id="faq" style={{ background: "#fff", padding: sectionPad }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <Eyebrow num="10" label="Questions fréquentes" />
            <h2 data-reveal style={{ font: H2, letterSpacing: "-.025em", margin: "0 0 clamp(28px,5vw,44px)", maxWidth: "20ch" }}>
              Tu te demandes peut-être…
            </h2>
            <div data-reveal>
              {FAQ.map((f, i) => (
                <div className="eb-faq-item" data-open="false" key={i}>
                  <button className="eb-faq-q" aria-expanded="false">
                    <span>{f.q}</span>
                    <span className="eb-faq-sign" aria-hidden>+</span>
                  </button>
                  <div className="eb-faq-a">
                    <div className="eb-faq-a-inner">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────── */}
        <section style={{ background: "#2E6AE0", color: "#fff", padding: "clamp(56px,10vw,120px) clamp(18px,5vw,40px)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
            <h2 data-reveal style={{ font: "800 clamp(2rem,6vw,3.4rem)/1.05 var(--font-schibsted),sans-serif", letterSpacing: "-.025em", color: "#fff", margin: "0 0 20px" }}>
              Rejoins la première génération.
            </h2>
            <p data-reveal style={{ font: "400 clamp(16px,2.3vw,19px)/1.6 var(--font-schibsted),sans-serif", color: "#DCE7FB", margin: "0 auto clamp(28px,4vw,36px)", maxWidth: "46ch" }}>
              La première génération d&apos;Ambassadeurs Communautaires Étoile Bleue se construit maintenant. Elle commence avec toi.
            </p>
            <Link href="/candidature" data-reveal style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "#2E6AE0", fontWeight: 700, fontSize: "clamp(15px,2vw,17px)", padding: "17px 30px" }}>
              Remplir le formulaire d&apos;adhésion <span aria-hidden>→</span>
            </Link>
            <p data-reveal style={{ font: "500 13.5px/1.5 var(--font-plex-mono),monospace", color: "#BFD4F8", margin: "22px 0 0" }}>
              {inscrits} déjà inscrits · objectif {objectif} · réponse sous quelques jours
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <LandingInteractions />
    </>
  );
}
