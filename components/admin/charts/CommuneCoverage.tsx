import { COMMUNES } from "@/lib/questions";
import type { CommuneCoverage as Coverage } from "@/lib/analytics";
import { CHART } from "./palette";

// Grille des 24 communes de Kinshasa. État par pastille + label (jamais couleur
// seule) : couvert / sous-représenté / manquant. Objectif = couvrir les 24.
export default function CommuneCoverage({ cov }: { cov: Coverage }) {
  const countFor = (c: string) => cov.covered.find((b) => b.label === c)?.value ?? 0;

  const cell = (commune: string) => {
    const n = countFor(commune);
    const missing = n === 0;
    const under = !missing && cov.under.has(commune);
    const bg = missing ? "#F5F6F8" : under ? "#FDF3DF" : "#E4F6EF";
    const dot = missing ? CHART.muted : under ? CHART.amber : CHART.green;
    const col = missing ? "#98A2B6" : "#0B1B34";
    return (
      <div key={commune} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, background: bg, padding: "8px 10px", border: "1px solid #EEF0F4" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flex: "none" }} />
          <span style={{ font: "500 12px/1.2 var(--font-schibsted),sans-serif", color: col, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{commune}</span>
        </span>
        <span style={{ font: "700 11.5px/1 var(--font-plex-mono),monospace", color: missing ? "#C4CAD6" : "#0B1B34" }}>{n}</span>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12, font: "500 11.5px/1 var(--font-schibsted),sans-serif", color: "#5A6478" }}>
        <Legend color={CHART.green} label="Couvert" />
        <Legend color={CHART.amber} label="Sous-représenté" />
        <Legend color={CHART.muted} label="Manquant" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 6 }}>
        {COMMUNES.map(cell)}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} /> {label}
    </span>
  );
}
