import { CHART } from "./palette";

export interface Segment {
  label: string;
  value: number;
  color: string;
}

// Anneau + légende (≥2 catégories → légende toujours présente ; identité par
// label, jamais par couleur seule). Segments espacés d'un petit gap.
export default function Donut({
  segments,
  size = 148,
  centerLabel,
}: {
  segments: Segment[];
  size?: number;
  centerLabel?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = size / 2;
  const stroke = 20;
  const radius = r - stroke / 2 - 2;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Répartition">
        <circle cx={r} cy={r} r={radius} fill="none" stroke="#F0F2F6" strokeWidth={stroke} />
        {total > 0 &&
          segments.map((s, i) => {
            const frac = s.value / total;
            const len = frac * circ;
            const gap = s.value > 0 ? 2 : 0;
            const el = (
              <circle
                key={i}
                cx={r}
                cy={r}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${Math.max(0, len - gap)} ${circ - Math.max(0, len - gap)}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${r} ${r})`}
              >
                <title>{`${s.label} : ${s.value}`}</title>
              </circle>
            );
            offset += len;
            return el;
          })}
        {centerLabel && (
          <text x={r} y={r} textAnchor="middle" dominantBaseline="central" style={{ font: "800 22px var(--font-schibsted),sans-serif", fill: CHART.ink }}>
            {centerLabel}
          </text>
        )}
      </svg>
      <div style={{ display: "grid", gap: 8 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 11, height: 11, background: s.color, flex: "none", borderRadius: 2 }} />
            <span style={{ font: "500 13px/1.2 var(--font-schibsted),sans-serif", color: "#48526A" }}>{s.label}</span>
            <span style={{ font: "700 13px/1 var(--font-plex-mono),monospace", color: "#0B1B34" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
