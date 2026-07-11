import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { communeCoverage } from "@/lib/analytics";
import { computeScore, scoreBand, BAND_META } from "@/lib/scoring";
import StatusControl from "@/components/admin/StatusControl";
import ScoreMeter from "@/components/admin/charts/ScoreMeter";
import { QUESTIONS } from "@/lib/questions";
import { formatTel, telDigits } from "@/lib/format";
import type { Candidature } from "@/lib/types";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function CandidatureDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isSupabaseConfigured) notFound();

  const supabase = await getServerClient();
  const { data } = await supabase.from("candidatures").select("*").eq("id", id).single();
  if (!data) notFound();
  const c = data as Candidature;

  // Contexte de couverture (pour le facteur « zone » du score) sur l'ensemble.
  const { data: allData } = await supabase.from("candidatures").select("commune");
  const cov = communeCoverage((allData ?? []).map((x: { commune: string | null }) => ({ commune: x.commune })) as Candidature[]);
  const score = computeScore(c, { underCommunes: cov.under });
  const band = BAND_META[scoreBand(score.total)];

  const value = (key: string): string => {
    if (key === "tel") return formatTel(c.tel);
    const v = c[key as keyof Candidature];
    if (Array.isArray(v)) return v.join(", ");
    if (v === null || v === undefined || v === "") return "—";
    return String(v);
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <Link href="/admin/candidatures" style={{ font: "600 13.5px/1 var(--font-schibsted),sans-serif", color: "#5A6478" }}>← Toutes les candidatures</Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", margin: "16px 0 6px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ font: "800 clamp(1.6rem,3.5vw,2.2rem)/1.1 var(--font-schibsted),sans-serif", color: "#0B1B34", margin: 0 }}>{c.nom}</h1>
            <span style={{ font: "800 15px/1 var(--font-plex-mono),monospace", color: band.color, background: band.bg, padding: "6px 11px" }}>Score {score.total}</span>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8, font: "500 13px/1 var(--font-plex-mono),monospace", color: "#98A2B6" }}>
            <span style={{ color: "#2E6AE0" }}>{c.ref}</span>
            <span>Reçu le {fmtDate(c.created_at)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {c.tel && <a href={`https://wa.me/243${telDigits(c.tel)}`} className="eb-cta" style={{ color: "#fff", fontWeight: 600, fontSize: 13.5, padding: "10px 15px" }}>WhatsApp</a>}
          {c.email && <a href={`mailto:${c.email}`} style={{ border: "1px solid #DCE1EC", color: "#0B1B34", fontWeight: 600, fontSize: 13.5, padding: "10px 15px", background: "#fff" }}>E-mail</a>}
        </div>
      </div>

      {/* Tags */}
      {score.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "14px 0 0" }}>
          {score.tags.map((t) => (
            <span key={t} style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", color: "#1848B8", background: "#EAF1FE", padding: "6px 11px" }}>{t}</span>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, margin: "22px 0" }}>
        {/* Score */}
        <div style={{ background: "#fff", border: "1px solid #E5E8EF", padding: "18px 20px" }}>
          <div style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".06em", textTransform: "uppercase", color: "#98A2B6", marginBottom: 16 }}>Profil de fit</div>
          <ScoreMeter score={score} />
        </div>
        {/* Statut */}
        <div style={{ background: "#fff", border: "1px solid #E5E8EF", padding: "18px 20px" }}>
          <div style={{ font: "600 12px/1 var(--font-schibsted),sans-serif", letterSpacing: ".06em", textTransform: "uppercase", color: "#98A2B6", marginBottom: 12 }}>Statut de la candidature</div>
          <StatusControl id={c.id} status={c.status} />
          <p style={{ font: "400 12px/1.5 var(--font-schibsted),sans-serif", color: "#98A2B6", marginTop: 16 }}>
            Consentement : {c.consent ? "accordé" : "non"}<br />ID interne {c.id}
          </p>
        </div>
      </div>

      {/* Réponses complètes */}
      <div style={{ background: "#fff", border: "1px solid #E5E8EF" }}>
        <div style={{ font: "700 13px/1 var(--font-schibsted),sans-serif", color: "#0B1B34", padding: "14px 20px", borderBottom: "1px solid #F0F2F6" }}>Réponses au formulaire</div>
        {QUESTIONS.map((q, i) => (
          <div key={q.key} style={{ display: "grid", gridTemplateColumns: "minmax(140px,220px) 1fr", gap: 16, padding: "12px 20px", borderBottom: i < QUESTIONS.length - 1 ? "1px solid #F5F6F8" : "none" }}>
            <div style={{ font: "600 13px/1.4 var(--font-schibsted),sans-serif", color: "#98A2B6" }}>{q.label}</div>
            <div style={{ font: "500 14.5px/1.5 var(--font-schibsted),sans-serif", color: value(q.key) === "—" ? "#C4CAD6" : "#0B1B34" }}>{value(q.key)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
