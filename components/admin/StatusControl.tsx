"use client";

import { useTransition } from "react";
import { updateStatus } from "@/app/admin/actions";
import { STATUS_META, type CandidatureStatus } from "@/lib/types";

const ORDER: CandidatureStatus[] = ["nouveau", "en_revue", "accepte", "refuse"];

export default function StatusControl({
  id,
  status,
}: {
  id: string;
  status: CandidatureStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, opacity: pending ? 0.5 : 1 }}>
      {ORDER.map((s) => {
        const active = s === status;
        const m = STATUS_META[s];
        return (
          <button
            key={s}
            disabled={pending || active}
            onClick={() => startTransition(() => updateStatus(id, s))}
            style={{
              cursor: active ? "default" : "pointer",
              font: "600 13px/1 var(--font-schibsted),sans-serif",
              padding: "9px 14px",
              border: `1px solid ${active ? m.color : "#DCE1EC"}`,
              background: active ? m.bg : "#fff",
              color: active ? m.color : "#5A6478",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
