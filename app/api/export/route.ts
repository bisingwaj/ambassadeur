import { NextResponse } from "next/server";
import { getServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loadScored } from "@/lib/adminData";
import { QUESTIONS } from "@/lib/questions";
import { formatTel } from "@/lib/format";
import type { ScoredCandidature } from "@/lib/adminData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  let s = Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v);
  // Neutralise l'injection de formules (CSV injection) : un tableur exécute
  // les cellules commençant par = + - @ ou une tabulation/CR. On les préfixe
  // d'une apostrophe pour qu'elles restent du texte inerte.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase non configuré." }, { status: 400 });
  }

  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const commune = url.searchParams.get("commune");
  const q = url.searchParams.get("q")?.toLowerCase();
  const idsParam = url.searchParams.get("ids");
  const ids = idsParam ? new Set(idsParam.split(",")) : null;

  // Charge + score, puis applique les mêmes filtres que la liste.
  const { rows } = await loadScored();
  let filtered: ScoredCandidature[] = rows;
  if (ids) filtered = filtered.filter((r) => ids.has(r.id));
  if (status && status !== "tous") filtered = filtered.filter((r) => r.status === status);
  if (commune) filtered = filtered.filter((r) => r.commune === commune);
  if (q) filtered = filtered.filter((r) => [r.nom, r.email, r.ref, r.tel, r.commune].some((f) => (f || "").toLowerCase().includes(q)));

  const cols = [
    { label: "Référence", get: (r: ScoredCandidature) => r.ref },
    { label: "Reçu le", get: (r: ScoredCandidature) => r.created_at },
    { label: "Statut", get: (r: ScoredCandidature) => r.status },
    { label: "Score", get: (r: ScoredCandidature) => r.score.total },
    { label: "Score · Disponibilité", get: (r: ScoredCandidature) => r.score.parts.dispo },
    { label: "Score · Compétences", get: (r: ScoredCandidature) => r.score.parts.competences },
    { label: "Score · Aisance oral", get: (r: ScoredCandidature) => r.score.parts.oral },
    { label: "Score · Couverture", get: (r: ScoredCandidature) => r.score.parts.couverture },
    { label: "Tags", get: (r: ScoredCandidature) => r.score.tags.join(", ") },
    ...QUESTIONS.map((qq) => ({
      label: qq.label,
      get: (r: ScoredCandidature) => (qq.key === "tel" ? formatTel(r.tel) : r[qq.key as keyof ScoredCandidature]),
    })),
  ];

  const header = cols.map((c) => csvCell(c.label)).join(",");
  const lines = filtered.map((r) => cols.map((c) => csvCell(c.get(r))).join(","));
  const csv = "﻿" + [header, ...lines].join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="candidatures-etoile-bleue-${stamp}.csv"`,
    },
  });
}
