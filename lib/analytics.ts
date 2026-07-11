// Agrégations analytiques — fonctions pures sur un tableau de candidatures.

import type { Candidature } from "@/lib/types";
import { COMMUNES } from "@/lib/questions";

export interface Bucket {
  label: string;
  value: number;
}

/** Répartition par champ simple (commune, age, jours, parole…). */
export function countBy(rows: Candidature[], key: keyof Candidature): Bucket[] {
  const m = new Map<string, number>();
  for (const r of rows) {
    const v = (r[key] as string) || "—";
    m.set(v, (m.get(v) || 0) + 1);
  }
  return [...m.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** Répartition par champ tableau (langues, secteurs). */
export function countByArray(rows: Candidature[], key: "langues" | "secteurs"): Bucket[] {
  const m = new Map<string, number>();
  for (const r of rows) {
    for (const v of (r[key] as string[] | null) || []) {
      m.set(v, (m.get(v) || 0) + 1);
    }
  }
  return [...m.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** Courbe : nombre de candidatures par jour, sur les N derniers jours. */
export function trendByDay(rows: Candidature[], days = 30): Bucket[] {
  const m = new Map<string, number>();
  for (const r of rows) {
    const day = r.created_at.slice(0, 10); // YYYY-MM-DD
    m.set(day, (m.get(day) || 0) + 1);
  }
  const keys = [...m.keys()].sort();
  // On borne à la fenêtre demandée à partir de la 1re candidature.
  const window = keys.slice(-days);
  return window.map((day) => ({
    label: day,
    value: m.get(day) || 0,
  }));
}

export interface AvailabilityStat {
  label: string;
  pct: number;
  count: number;
}

const isOui = (v: string | null | undefined) => (v || "").toLowerCase().startsWith("oui");

export function availabilityStats(rows: Candidature[]): AvailabilityStat[] {
  const n = rows.length || 1;
  const mk = (label: string, key: keyof Candidature): AvailabilityStat => {
    const count = rows.filter((r) => isOui(r[key] as string)).length;
    return { label, count, pct: Math.round((count / n) * 100) };
  };
  return [
    mk("Disponible en soirée", "soir"),
    mk("Disponible le week-end", "weekend"),
    mk("Prêt·e pour la formation", "formation"),
    mk("Notions de secourisme", "secourisme"),
    mk("Déjà de l'expérience", "experience"),
  ];
}

export interface CommuneCoverage {
  covered: Bucket[]; // communes avec ≥1 candidat, triées desc
  missing: string[]; // communes sans candidat
  under: Set<string>; // communes sous-représentées (bonus score)
  coveredCount: number; // nb de communes couvertes / 24
  threshold: number; // seuil de sous-représentation
}

/** Couverture des 24 communes + détection des zones sous-représentées. */
export function communeCoverage(rows: Candidature[]): CommuneCoverage {
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (r.commune) counts.set(r.commune, (counts.get(r.commune) || 0) + 1);
  }
  const threshold = rows.length / COMMUNES.length; // répartition idéale
  const under = new Set<string>();
  const covered: Bucket[] = [];
  const missing: string[] = [];
  for (const commune of COMMUNES) {
    const c = counts.get(commune) || 0;
    if (c === 0) {
      missing.push(commune);
      under.add(commune);
    } else {
      covered.push({ label: commune, value: c });
      if (c < threshold) under.add(commune);
    }
  }
  covered.sort((a, b) => b.value - a.value);
  return {
    covered,
    missing,
    under,
    coveredCount: covered.length,
    threshold,
  };
}

/** Histogramme des scores en 4 bandes. */
export function scoreDistribution(scores: number[]): Bucket[] {
  const bands = [
    { label: "80–100", min: 80 },
    { label: "60–79", min: 60 },
    { label: "40–59", min: 40 },
    { label: "0–39", min: 0 },
  ];
  return bands.map((b, i) => {
    const max = i === 0 ? 101 : bands[i - 1].min;
    return { label: b.label, value: scores.filter((s) => s >= b.min && s < max).length };
  });
}

/** Candidatures reçues sur les 7 derniers jours (relatif à la plus récente). */
export function countThisWeek(rows: Candidature[]): number {
  if (!rows.length) return 0;
  const latest = rows.reduce((mx, r) => (r.created_at > mx ? r.created_at : mx), rows[0].created_at);
  const cutoff = new Date(new Date(latest).getTime() - 7 * 864e5).toISOString();
  return rows.filter((r) => r.created_at >= cutoff).length;
}
