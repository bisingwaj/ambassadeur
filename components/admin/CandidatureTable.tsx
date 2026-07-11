"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateStatusBulk } from "@/app/shaka/actions";
import { STATUS_META, type CandidatureStatus } from "@/lib/types";
import { BAND_META, type ScoreBand } from "@/lib/scoring";
import { formatTel } from "@/lib/format";

export interface Row {
  id: string;
  ref: string;
  nom: string;
  commune: string | null;
  tel: string | null;
  created_at: string;
  status: CandidatureStatus;
  score: number;
  band: ScoreBand;
  tags: string[];
}

const STATUSES: CandidatureStatus[] = ["nouveau", "en_revue", "accepte", "refuse"];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });
}

export default function CandidatureTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected((s) => {
      if (allOnPage) return new Set();
      const n = new Set(s);
      rows.forEach((r) => n.add(r.id));
      return n;
    });

  const applyBulk = (status: CandidatureStatus) => {
    const ids = [...selected];
    if (!ids.length) return;
    startTransition(async () => {
      await updateStatusBulk(ids, status);
      setSelected(new Set());
    });
  };

  const th: React.CSSProperties = { textAlign: "left", font: "600 11px/1 var(--font-schibsted),sans-serif", letterSpacing: ".04em", textTransform: "uppercase", color: "#98A2B6", padding: "12px 14px", whiteSpace: "nowrap" };
  const td: React.CSSProperties = { padding: "12px 14px" };

  return (
    <div>
      {/* Barre d'actions groupées */}
      {selected.size > 0 && (
        <div style={{ position: "sticky", top: 0, zIndex: 5, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: "#0B1B34", color: "#fff", padding: "10px 14px", marginBottom: 10, opacity: pending ? 0.6 : 1 }}>
          <span style={{ font: "700 13px/1 var(--font-schibsted),sans-serif" }}>{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>
          <span style={{ font: "400 12.5px/1 var(--font-schibsted),sans-serif", color: "#A9BCDE" }}>Changer le statut :</span>
          {STATUSES.map((s) => (
            <button key={s} disabled={pending} onClick={() => applyBulk(s)} style={{ cursor: "pointer", border: "none", font: "600 12.5px/1 var(--font-schibsted),sans-serif", padding: "7px 12px", background: STATUS_META[s].bg, color: STATUS_META[s].color }}>
              {STATUS_META[s].label}
            </button>
          ))}
          <button onClick={() => setSelected(new Set())} style={{ marginLeft: "auto", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,.25)", color: "#fff", font: "600 12.5px/1 var(--font-schibsted),sans-serif", padding: "7px 12px" }}>
            Effacer
          </button>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #E5E8EF", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E8EF" }}>
              <th style={{ ...th, width: 38 }}>
                <input type="checkbox" checked={allOnPage} onChange={toggleAll} style={{ width: 16, height: 16, accentColor: "#2E6AE0", cursor: "pointer" }} aria-label="Tout sélectionner" />
              </th>
              <th style={th}>Réf</th>
              <th style={th}>Nom</th>
              <th style={th}>Commune</th>
              <th style={th}>WhatsApp</th>
              <th style={th}>Score</th>
              <th style={th}>Reçu</th>
              <th style={th}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} style={{ padding: "40px 14px", textAlign: "center", color: "#98A2B6", font: "400 14px/1.5 var(--font-schibsted),sans-serif" }}>Aucune candidature pour ces filtres.</td></tr>
            )}
            {rows.map((r) => {
              const sel = selected.has(r.id);
              const band = BAND_META[r.band];
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid #F0F2F6", background: sel ? "#F1F6FE" : "#fff" }}>
                  <td style={td}>
                    <input type="checkbox" checked={sel} onChange={() => toggle(r.id)} style={{ width: 16, height: 16, accentColor: "#2E6AE0", cursor: "pointer" }} aria-label={`Sélectionner ${r.nom}`} />
                  </td>
                  <td style={td}><Link href={`/shaka/candidatures/${r.id}`} style={{ font: "600 12.5px/1 var(--font-plex-mono),monospace", color: "#2E6AE0" }}>{r.ref}</Link></td>
                  <td style={td}>
                    <Link href={`/shaka/candidatures/${r.id}`} style={{ font: "600 14px/1.3 var(--font-schibsted),sans-serif", color: "#0B1B34" }}>{r.nom}</Link>
                    {r.tags.length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                        {r.tags.slice(0, 2).map((t) => (
                          <span key={t} style={{ font: "600 10px/1 var(--font-schibsted),sans-serif", color: "#5A6478", background: "#F0F2F6", padding: "3px 6px" }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ ...td, font: "400 13.5px/1.3 var(--font-schibsted),sans-serif", color: "#5A6478" }}>{r.commune || "—"}</td>
                  <td style={{ ...td, font: "400 13px/1.3 var(--font-plex-mono),monospace", color: "#5A6478", whiteSpace: "nowrap" }}>{formatTel(r.tel)}</td>
                  <td style={td}>
                    <span style={{ font: "700 12.5px/1 var(--font-plex-mono),monospace", color: band.color, background: band.bg, padding: "5px 9px", display: "inline-block", minWidth: 32, textAlign: "center" }}>{r.score}</span>
                  </td>
                  <td style={{ ...td, font: "400 12.5px/1.3 var(--font-schibsted),sans-serif", color: "#98A2B6", whiteSpace: "nowrap" }}>{fmtDate(r.created_at)}</td>
                  <td style={td}>
                    <span style={{ display: "inline-flex", font: "600 12px/1 var(--font-schibsted),sans-serif", color: STATUS_META[r.status].color, background: STATUS_META[r.status].bg, padding: "5px 10px" }}>{STATUS_META[r.status].label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
