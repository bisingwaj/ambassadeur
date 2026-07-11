import type { Bucket } from "@/lib/analytics";
import { CHART } from "./palette";

// Courbe + aire d'une série unique (candidatures/jour). Une série → pas de légende ;
// le titre nomme la série. Repères min/max en labels directs.
export default function TrendLine({
  data,
  color = CHART.blue,
  height = 140,
}: {
  data: Bucket[];
  color?: string;
  height?: number;
}) {
  if (data.length < 2) {
    return <p style={{ font: "400 13px/1.5 var(--font-schibsted),sans-serif", color: "#98A2B6", margin: 0 }}>Pas encore assez de données pour une tendance.</p>;
  }

  const W = 640;
  const H = height;
  const pad = { t: 12, r: 12, b: 22, l: 12 };
  const peak = Math.max(1, ...data.map((d) => d.value));
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (i / (data.length - 1)) * innerW;
  const y = (v: number) => pad.t + innerH - (v / peak) * innerH;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(pad.t + innerH).toFixed(1)} L${x(0).toFixed(1)},${(pad.t + innerH).toFixed(1)} Z`;

  const fmtDay = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  };
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={`Tendance des candidatures : ${total} au total`}>
        <line x1={pad.l} y1={pad.t + innerH} x2={W - pad.r} y2={pad.t + innerH} stroke={CHART.grid} strokeWidth="1" />
        <path d={area} fill={color} fillOpacity="0.1" />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.value)} r={d.value === peak ? 3.5 : 2} fill={color}>
            <title>{`${fmtDay(d.label)} : ${d.value}`}</title>
          </circle>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", font: "400 11px/1 var(--font-plex-mono),monospace", color: "#98A2B6", marginTop: 2 }}>
        <span>{fmtDay(data[0].label)}</span>
        <span>{fmtDay(data[data.length - 1].label)}</span>
      </div>
    </div>
  );
}
