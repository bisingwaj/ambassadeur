import { CHART } from "./palette";

export default function StatCard({
  value,
  label,
  hint,
  accent = CHART.ink,
}: {
  value: string | number;
  label: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E8EF", padding: "16px 18px" }}>
      <div style={{ font: "800 clamp(1.6rem,3vw,2.1rem)/1 var(--font-schibsted),sans-serif", color: accent, letterSpacing: "-.02em" }}>
        {value}
      </div>
      <div style={{ font: "600 12.5px/1.3 var(--font-schibsted),sans-serif", color: "#5A6478", marginTop: 6 }}>{label}</div>
      {hint && <div style={{ font: "400 11.5px/1.3 var(--font-schibsted),sans-serif", color: "#98A2B6", marginTop: 3 }}>{hint}</div>}
    </div>
  );
}
