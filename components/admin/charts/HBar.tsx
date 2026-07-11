import type { Bucket } from "@/lib/analytics";
import { CHART } from "./palette";

// Barres horizontales pour une grandeur par catégorie (magnitude → 1 seule teinte).
// Chaque barre porte son label + sa valeur en direct (jamais couleur seule).
export default function HBar({
  data,
  color = CHART.blue,
  max: maxItems = 10,
  emptyLabel = "Aucune donnée",
}: {
  data: Bucket[];
  color?: string;
  max?: number;
  emptyLabel?: string;
}) {
  const rows = data.slice(0, maxItems);
  const peak = Math.max(1, ...rows.map((r) => r.value));

  if (!rows.length) {
    return <p style={{ font: "400 13px/1.5 var(--font-schibsted),sans-serif", color: "#98A2B6", margin: 0 }}>{emptyLabel}</p>;
  }

  return (
    <div style={{ display: "grid", gap: 9 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "grid", gridTemplateColumns: "minmax(90px,140px) 1fr auto", alignItems: "center", gap: 12 }}>
          <span style={{ font: "500 12.5px/1.3 var(--font-schibsted),sans-serif", color: "#48526A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.label}>
            {r.label}
          </span>
          <span style={{ display: "block", height: 12, background: "#F0F2F6", position: "relative" }}>
            <span
              style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${(r.value / peak) * 100}%`,
                background: color, borderRadius: "0 3px 3px 0", minWidth: 3,
              }}
            />
          </span>
          <span style={{ font: "700 12.5px/1 var(--font-plex-mono),monospace", color: "#0B1B34", minWidth: 22, textAlign: "right" }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}
