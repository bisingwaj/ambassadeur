import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { loadScored } from "@/lib/adminData";
import {
  trendByDay, countBy, countByArray, availabilityStats, scoreDistribution, countThisWeek,
} from "@/lib/analytics";
import { STATUS_META } from "@/lib/types";
import { BAND_META, scoreBand } from "@/lib/scoring";
import StatCard from "@/components/admin/charts/StatCard";
import HBar from "@/components/admin/charts/HBar";
import TrendLine from "@/components/admin/charts/TrendLine";
import Donut from "@/components/admin/charts/Donut";
import CommuneCoverage from "@/components/admin/charts/CommuneCoverage";
import { CHART } from "@/components/admin/charts/palette";

export const dynamic = "force-dynamic";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E5E8EF", padding: "clamp(16px,2.5vw,22px)" };
const cardTitle: React.CSSProperties = { font: "700 14px/1.2 var(--font-schibsted),sans-serif", color: "#0B1B34", margin: "0 0 16px" };

function Panel({ title, sub, children, span }: { title: string; sub?: string; children: React.ReactNode; span?: number }) {
  return (
    <section style={{ ...card, gridColumn: span ? `span ${span}` : undefined }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={cardTitle}>{title}</h2>
        {sub && <p style={{ font: "400 12px/1.4 var(--font-schibsted),sans-serif", color: "#98A2B6", margin: "-12px 0 0" }}>{sub}</p>}
      </div>
      {children}
    </section>
  );
}

export default async function AdminOverview() {
  if (!isSupabaseConfigured) {
    return (
      <div style={card}>
        <h1 style={{ font: "800 1.5rem/1.2 var(--font-schibsted),sans-serif", margin: "0 0 10px" }}>Configuration requise</h1>
        <p style={{ color: "#5A6478", font: "400 15px/1.6 var(--font-schibsted),sans-serif" }}>
          Renseigne les variables Supabase dans <code>.env</code> puis exécute <code>supabase/schema.sql</code>. Voir le README.
        </p>
      </div>
    );
  }

  const { rows, cov } = await loadScored();
  const total = rows.length;
  const thisWeek = countThisWeek(rows);
  const avgScore = total ? Math.round(rows.reduce((s, r) => s + r.score.total, 0) / total) : 0;
  const avail = availabilityStats(rows);
  const soirWe = rows.filter((r) => (r.soir || "").startsWith("Oui") && (r.weekend || "").startsWith("Oui")).length;
  const soirWePct = total ? Math.round((soirWe / total) * 100) : 0;

  const statusCounts = { nouveau: 0, en_revue: 0, accepte: 0, refuse: 0 };
  rows.forEach((r) => { if (r.status in statusCounts) statusCounts[r.status]++; });
  const statusColor = { nouveau: CHART.blue, en_revue: CHART.amber, accepte: CHART.green, refuse: CHART.red };

  const top = [...rows].sort((a, b) => b.score.total - a.score.total).slice(0, 10);
  const dist = scoreDistribution(rows.map((r) => r.score.total));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div>
          <h1 style={{ font: "800 clamp(1.5rem,3vw,2rem)/1.1 var(--font-schibsted),sans-serif", color: "#0B1B34", margin: 0 }}>Vue d&apos;ensemble</h1>
          <p style={{ font: "400 13px/1.4 var(--font-schibsted),sans-serif", color: "#98A2B6", margin: "6px 0 0" }}>Profilage & analyse de la Cohorte 01</p>
        </div>
        <Link href="/shaka/candidatures" className="eb-cta" style={{ color: "#fff", fontWeight: 600, fontSize: 13.5, padding: "10px 16px" }}>
          Voir les candidatures →
        </Link>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 16 }}>
        <StatCard value={total} label="Candidatures" hint={`+${thisWeek} cette semaine`} accent={CHART.ink} />
        <StatCard value={avgScore} label="Score moyen /100" accent={CHART.blue} />
        <StatCard value={`${cov.coveredCount}/24`} label="Communes couvertes" hint={`${cov.missing.length} manquantes`} accent={CHART.green} />
        <StatCard value={`${soirWePct}%`} label="Dispo soir + week-end" accent={CHART.violet} />
        <StatCard value={statusCounts.accepte} label="Acceptés" hint={`${statusCounts.nouveau} à traiter`} accent={STATUS_META.accepte.color} />
      </div>

      {/* Rangée 1 : tendance + statuts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 16 }}>
        <Panel title="Candidatures dans le temps" sub="par jour">
          <TrendLine data={trendByDay(rows)} />
        </Panel>
        <Panel title="Statuts">
          <Donut
            centerLabel={String(total)}
            segments={[
              { label: "Nouveau", value: statusCounts.nouveau, color: statusColor.nouveau },
              { label: "En revue", value: statusCounts.en_revue, color: statusColor.en_revue },
              { label: "Accepté", value: statusCounts.accepte, color: statusColor.accepte },
              { label: "Refusé", value: statusCounts.refuse, color: statusColor.refuse },
            ]}
          />
        </Panel>
      </div>

      {/* Couverture des communes */}
      <div style={{ marginBottom: 16 }}>
        <Panel title="Couverture géographique" sub={`Objectif : les 24 communes de Kinshasa — ${cov.coveredCount} couvertes`}>
          <CommuneCoverage cov={cov} />
        </Panel>
      </div>

      {/* Rangée démographie */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 16 }}>
        <Panel title="Langues parlées"><HBar data={countByArray(rows, "langues")} color={CHART.blue} /></Panel>
        <Panel title="Domaines d'aide"><HBar data={countByArray(rows, "secteurs")} color={CHART.violet} /></Panel>
        <Panel title="Tranches d'âge"><HBar data={countBy(rows, "age")} color={CHART.green} /></Panel>
      </div>

      {/* Rangée dispo + score */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 16 }}>
        <Panel title="Disponibilité & compétences" sub="% des candidats">
          <div style={{ display: "grid", gap: 10 }}>
            {avail.map((a) => (
              <div key={a.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ font: "500 12.5px/1.3 var(--font-schibsted),sans-serif", color: "#48526A", marginBottom: 4 }}>{a.label}</div>
                  <span style={{ display: "block", height: 8, background: "#F0F2F6" }}>
                    <span style={{ display: "block", height: "100%", width: `${a.pct}%`, background: CHART.blue, borderRadius: "0 3px 3px 0", minWidth: 2 }} />
                  </span>
                </div>
                <span style={{ font: "700 13px/1 var(--font-plex-mono),monospace", color: "#0B1B34" }}>{a.pct}%</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Distribution des scores" sub="nombre de candidats par bande">
          <HBar data={dist} color={CHART.amber} max={4} />
        </Panel>
      </div>

      {/* Top candidats */}
      <Panel title="Top candidats" sub="meilleurs scores de fit">
        <div style={{ display: "grid", gap: 2 }}>
          {top.length === 0 && <p style={{ font: "400 13px/1.5 var(--font-schibsted),sans-serif", color: "#98A2B6", margin: 0 }}>Aucune candidature pour l&apos;instant.</p>}
          {top.map((r, i) => {
            const band = BAND_META[scoreBand(r.score.total)];
            return (
              <Link key={r.id} href={`/shaka/candidatures/${r.id}`} style={{ display: "grid", gridTemplateColumns: "26px 1fr auto auto", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: i < top.length - 1 ? "1px solid #F0F2F6" : "none" }}>
                <span style={{ font: "700 12px/1 var(--font-plex-mono),monospace", color: "#C4CAD6" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ font: "600 14px/1.2 var(--font-schibsted),sans-serif", color: "#0B1B34", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.nom} <span style={{ color: "#98A2B6", fontWeight: 400 }}>· {r.commune || "—"}</span>
                </span>
                <span style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {r.score.tags.slice(0, 2).map((t) => (
                    <span key={t} style={{ font: "600 10.5px/1 var(--font-schibsted),sans-serif", color: "#5A6478", background: "#F0F2F6", padding: "4px 7px" }}>{t}</span>
                  ))}
                </span>
                <span style={{ font: "700 13px/1 var(--font-plex-mono),monospace", color: band.color, background: band.bg, padding: "6px 9px", minWidth: 34, textAlign: "center" }}>{r.score.total}</span>
              </Link>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
