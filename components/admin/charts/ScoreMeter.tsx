import type { ScoreBreakdown } from "@/lib/scoring";
import { FACTOR_COLOR, FACTOR_LABEL, CHART } from "./palette";

// Décomposition du score d'un candidat : total + 4 facteurs (chacun /25).
// Ordre catégoriel fixe ; chaque facteur porte son label + sa valeur.
const ORDER: (keyof ScoreBreakdown["parts"])[] = ["dispo", "competences", "oral", "couverture"];

export default function ScoreMeter({ score, compact = false }: { score: ScoreBreakdown; compact?: boolean }) {
  return (
    <div>
      {!compact && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
          <span style={{ font: "800 clamp(2.2rem,5vw,3rem)/1 var(--font-schibsted),sans-serif", color: CHART.ink, letterSpacing: "-.02em" }}>{score.total}</span>
          <span style={{ font: "600 15px/1 var(--font-schibsted),sans-serif", color: "#98A2B6" }}>/ 100</span>
        </div>
      )}
      <div style={{ display: "grid", gap: 12 }}>
        {ORDER.map((k) => {
          const val = score.parts[k];
          const pct = (val / 25) * 100;
          return (
            <div key={k}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ font: "600 12.5px/1 var(--font-schibsted),sans-serif", color: "#48526A" }}>{FACTOR_LABEL[k]}</span>
                <span style={{ font: "700 12.5px/1 var(--font-plex-mono),monospace", color: "#0B1B34" }}>{val}<span style={{ color: "#C4CAD6" }}>/25</span></span>
              </div>
              <span style={{ display: "block", height: 8, background: "#F0F2F6" }}>
                <span style={{ display: "block", height: "100%", width: `${pct}%`, background: FACTOR_COLOR[k], borderRadius: "0 3px 3px 0", minWidth: 2 }} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
