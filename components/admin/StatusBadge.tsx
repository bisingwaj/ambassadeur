import { STATUS_META, type CandidatureStatus } from "@/lib/types";

export default function StatusBadge({ status }: { status: CandidatureStatus }) {
  const m = STATUS_META[status] ?? STATUS_META.nouveau;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        font: "600 12px/1 var(--font-schibsted),sans-serif",
        color: m.color, background: m.bg, padding: "5px 10px", whiteSpace: "nowrap",
      }}
    >
      {m.label}
    </span>
  );
}
