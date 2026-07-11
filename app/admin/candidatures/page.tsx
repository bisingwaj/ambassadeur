import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { loadScored, type ScoredCandidature } from "@/lib/adminData";
import { COMMUNES, QUESTIONS } from "@/lib/questions";
import { STATUS_META, type CandidatureStatus } from "@/lib/types";
import { scoreBand, type ScoreBand } from "@/lib/scoring";
import CandidatureTable, { type Row } from "@/components/admin/CandidatureTable";

export const dynamic = "force-dynamic";

const PER_PAGE = 50;
const isOui = (v: string | null) => (v || "").startsWith("Oui");

type SP = {
  status?: string; commune?: string; langue?: string; secteur?: string;
  dispo?: string; score?: string; q?: string; sort?: string; page?: string;
};

const LANGUES = QUESTIONS.find((q) => q.key === "langues")?.options ?? [];
const SECTEURS = QUESTIONS.find((q) => q.key === "secteurs")?.options ?? [];

export default async function CandidaturesList({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;

  if (!isSupabaseConfigured) {
    return <div style={{ background: "#fff", border: "1px solid #E5E8EF", padding: 32 }}><p style={{ font: "400 15px/1.6 var(--font-schibsted),sans-serif", color: "#5A6478", margin: 0 }}>Configuration Supabase requise (voir README).</p></div>;
  }

  const { rows: all } = await loadScored();

  // ── Filtrage (en JS, après scoring) ──────────────────────────────────
  let rows: ScoredCandidature[] = all;
  if (sp.status) rows = rows.filter((r) => r.status === sp.status);
  if (sp.commune) rows = rows.filter((r) => r.commune === sp.commune);
  if (sp.langue) rows = rows.filter((r) => (r.langues || []).includes(sp.langue!));
  if (sp.secteur) rows = rows.filter((r) => (r.secteurs || []).includes(sp.secteur!));
  if (sp.dispo === "soirwe") rows = rows.filter((r) => isOui(r.soir) && isOui(r.weekend));
  else if (sp.dispo === "secourisme") rows = rows.filter((r) => isOui(r.secourisme));
  else if (sp.dispo === "experience") rows = rows.filter((r) => isOui(r.experience));
  if (sp.score) rows = rows.filter((r) => scoreBand(r.score.total) === (sp.score as ScoreBand));
  if (sp.q) {
    const q = sp.q.toLowerCase();
    rows = rows.filter((r) =>
      [r.nom, r.email, r.ref, r.tel, r.commune].some((f) => (f || "").toLowerCase().includes(q))
    );
  }

  // ── Tri ──────────────────────────────────────────────────────────────
  const sort = sp.sort || "date_desc";
  rows = [...rows].sort((a, b) => {
    switch (sort) {
      case "date_asc": return a.created_at.localeCompare(b.created_at);
      case "nom": return a.nom.localeCompare(b.nom);
      case "commune": return (a.commune || "").localeCompare(b.commune || "");
      case "score_asc": return a.score.total - b.score.total;
      case "score_desc": return b.score.total - a.score.total;
      case "statut": return a.status.localeCompare(b.status);
      default: return b.created_at.localeCompare(a.created_at);
    }
  });

  const filteredCount = rows.length;
  const page = Math.max(1, Number(sp.page) || 1);
  const pages = Math.max(1, Math.ceil(filteredCount / PER_PAGE));
  const slice = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const tableRows: Row[] = slice.map((r) => ({
    id: r.id, ref: r.ref, nom: r.nom, commune: r.commune, tel: r.tel,
    created_at: r.created_at, status: r.status,
    score: r.score.total, band: scoreBand(r.score.total), tags: r.score.tags,
  }));

  // ── Helpers URL ──────────────────────────────────────────────────────
  const build = (patch: Partial<SP>) => {
    const merged: SP = { ...sp, ...patch };
    const p = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => { if (v && k !== "page") p.set(k, String(v)); });
    if (merged.page && Number(merged.page) > 1) p.set("page", String(merged.page));
    const s = p.toString();
    return s ? `/admin/candidatures?${s}` : "/admin/candidatures";
  };

  const statusPills: { key: string; label: string }[] = [
    { key: "", label: "Tous" },
    { key: "nouveau", label: "Nouveaux" },
    { key: "en_revue", label: "En revue" },
    { key: "accepte", label: "Acceptés" },
    { key: "refuse", label: "Refusés" },
  ];

  const sel: React.CSSProperties = { border: "1px solid #DCE1EC", background: "#fff", padding: "8px 10px", font: "500 13px/1 var(--font-schibsted),sans-serif", color: "#0B1B34", outline: "none" };
  const exportHref = (() => {
    const p = new URLSearchParams();
    (["status", "commune", "q"] as const).forEach((k) => { if (sp[k]) p.set(k, sp[k]!); });
    const s = p.toString();
    return s ? `/api/export?${s}` : "/api/export";
  })();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h1 style={{ font: "800 clamp(1.5rem,3vw,2rem)/1.1 var(--font-schibsted),sans-serif", color: "#0B1B34", margin: 0 }}>Candidatures</h1>
          <p style={{ font: "400 13px/1.4 var(--font-schibsted),sans-serif", color: "#98A2B6", margin: "6px 0 0" }}>{filteredCount} résultat{filteredCount > 1 ? "s" : ""}{filteredCount !== all.length ? ` sur ${all.length}` : ""}</p>
        </div>
        <a href={exportHref} className="eb-cta" style={{ color: "#fff", fontWeight: 600, fontSize: 13.5, padding: "10px 16px" }}>Exporter en CSV</a>
      </div>

      {/* Pills de statut */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {statusPills.map((p) => {
          const active = (sp.status || "") === p.key;
          return (
            <Link key={p.key || "all"} href={build({ status: p.key || undefined, page: undefined })} style={{ font: "600 13px/1 var(--font-schibsted),sans-serif", padding: "9px 14px", border: "1px solid", borderColor: active ? "#2E6AE0" : "#DCE1EC", background: active ? "#F1F6FE" : "#fff", color: active ? "#1848B8" : "#5A6478" }}>{p.label}</Link>
          );
        })}
      </div>

      {/* Filtres avancés (GET) */}
      <form action="/admin/candidatures" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", background: "#fff", border: "1px solid #E5E8EF", padding: 12, marginBottom: 8 }}>
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        <input name="q" defaultValue={sp.q || ""} placeholder="Nom, e-mail, réf, tél…" style={{ ...sel, minWidth: 190 }} />
        <select name="commune" defaultValue={sp.commune || ""} style={sel}><option value="">Toutes communes</option>{COMMUNES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <select name="langue" defaultValue={sp.langue || ""} style={sel}><option value="">Toute langue</option>{LANGUES.map((l) => <option key={l} value={l}>{l}</option>)}</select>
        <select name="secteur" defaultValue={sp.secteur || ""} style={sel}><option value="">Tout domaine</option>{SECTEURS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <select name="dispo" defaultValue={sp.dispo || ""} style={sel}><option value="">Toute dispo</option><option value="soirwe">Soir + week-end</option><option value="secourisme">Secourisme</option><option value="experience">Expérience</option></select>
        <select name="score" defaultValue={sp.score || ""} style={sel}><option value="">Tout score</option><option value="eleve">Élevé (80+)</option><option value="bon">Bon (60–79)</option><option value="moyen">Moyen (40–59)</option><option value="faible">Faible (&lt;40)</option></select>
        {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}
        <button type="submit" style={{ background: "#0B1B34", color: "#fff", border: "none", cursor: "pointer", font: "600 13px/1 var(--font-schibsted),sans-serif", padding: "9px 16px" }}>Filtrer</button>
        {(sp.commune || sp.langue || sp.secteur || sp.dispo || sp.score || sp.q) && (
          <Link href={build({ commune: undefined, langue: undefined, secteur: undefined, dispo: undefined, score: undefined, q: undefined, page: undefined })} style={{ font: "500 13px/1 var(--font-schibsted),sans-serif", color: "#98A2B6", padding: "9px 6px" }}>Réinitialiser</Link>
        )}
      </form>

      {/* Tri */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12, font: "500 12.5px/1 var(--font-schibsted),sans-serif", color: "#98A2B6" }}>
        <span>Trier :</span>
        {[
          { key: "date_desc", label: "Plus récentes" },
          { key: "score_desc", label: "Score ↓" },
          { key: "score_asc", label: "Score ↑" },
          { key: "nom", label: "Nom A→Z" },
          { key: "commune", label: "Commune" },
        ].map((s) => {
          const active = sort === s.key;
          return <Link key={s.key} href={build({ sort: s.key, page: undefined })} style={{ padding: "5px 10px", border: "1px solid", borderColor: active ? "#2E6AE0" : "#E5E8EF", color: active ? "#1848B8" : "#5A6478", background: active ? "#F1F6FE" : "#fff" }}>{s.label}</Link>;
        })}
      </div>

      <CandidatureTable rows={tableRows} />

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 18 }}>
          {page > 1 && <Link href={build({ page: String(page - 1) })} style={{ font: "600 13px/1 var(--font-schibsted),sans-serif", color: "#2E6AE0", padding: "8px 12px", border: "1px solid #DCE1EC" }}>← Précédent</Link>}
          <span style={{ font: "500 13px/1 var(--font-plex-mono),monospace", color: "#98A2B6" }}>Page {page} / {pages}</span>
          {page < pages && <Link href={build({ page: String(page + 1) })} style={{ font: "600 13px/1 var(--font-schibsted),sans-serif", color: "#2E6AE0", padding: "8px 12px", border: "1px solid #DCE1EC" }}>Suivant →</Link>}
        </div>
      )}
    </div>
  );
}
