// Score de « fit » ambassadeur — transparent, déterministe, sur 100 points.
// 4 blocs équilibrés de 25 pts : Disponibilité, Compétences, Aisance à l'oral,
// Couverture langues/zone. Calculé à la volée (aucune colonne en base).

import type { Candidature } from "@/lib/types";

const LOCAL_LANGS = ["Lingala", "Swahili", "Tshiluba", "Kikongo"];

export interface ScoreContext {
  /** Communes sous-représentées (bonus de couverture géographique). */
  underCommunes?: Set<string>;
}

export interface ScoreBreakdown {
  total: number; // 0–100
  parts: {
    dispo: number; // /25
    competences: number; // /25
    oral: number; // /25
    couverture: number; // /25
  };
  tags: string[];
}

const isOui = (v: string | null | undefined) => (v || "").toLowerCase().startsWith("oui");

function scoreDispo(c: Candidature): number {
  let s = 0;
  if (isOui(c.soir)) s += 7;
  if (isOui(c.weekend)) s += 7;
  if (isOui(c.formation)) s += 4;
  switch (c.jours) {
    case "3 jours ou plus": s += 7; break;
    case "2 jours": s += 5; break;
    case "1 jour": s += 3; break;
    default: s += 3; // "Cela dépend des semaines"
  }
  return Math.min(25, s);
}

function scoreCompetences(c: Candidature): number {
  let s = 0;
  if (isOui(c.secourisme)) s += 13;
  if (isOui(c.experience)) s += 12;
  return s;
}

function scoreOral(c: Candidature): number {
  switch (c.parole) {
    case "Oui, très à l'aise": return 25;
    case "Assez à l'aise": return 17;
    case "Pas très à l'aise": return 8;
    default: return 0; // "Pas du tout à l'aise" ou vide
  }
}

function scoreCouverture(c: Candidature, ctx?: ScoreContext): number {
  const langs = (c.langues || []).filter((l) => LOCAL_LANGS.includes(l));
  let s = Math.min(16, langs.length * 4);
  if (c.commune && ctx?.underCommunes?.has(c.commune)) s += 9;
  return Math.min(25, s);
}

export function computeScore(c: Candidature, ctx?: ScoreContext): ScoreBreakdown {
  const parts = {
    dispo: scoreDispo(c),
    competences: scoreCompetences(c),
    oral: scoreOral(c),
    couverture: scoreCouverture(c, ctx),
  };
  const total = parts.dispo + parts.competences + parts.oral + parts.couverture;

  const tags: string[] = [];
  if (isOui(c.soir) && isOui(c.weekend)) tags.push("Disponible soir+WE");
  if (isOui(c.secourisme)) tags.push("Secouriste");
  if (isOui(c.experience)) tags.push("Expérimenté");
  if (c.parole === "Oui, très à l'aise") tags.push("Orateur");
  if ((c.langues || []).filter((l) => LOCAL_LANGS.includes(l)).length >= 2) tags.push("Multilingue");
  if (c.commune && ctx?.underCommunes?.has(c.commune)) tags.push("Zone prioritaire");

  return { total, parts, tags };
}

/** Bande de score pour le filtrage / la coloration. */
export type ScoreBand = "eleve" | "bon" | "moyen" | "faible";

export function scoreBand(total: number): ScoreBand {
  if (total >= 80) return "eleve";
  if (total >= 60) return "bon";
  if (total >= 40) return "moyen";
  return "faible";
}

export const BAND_META: Record<ScoreBand, { label: string; color: string; bg: string }> = {
  eleve: { label: "Élevé", color: "#0E7A57", bg: "#E4F6EF" },
  bon: { label: "Bon", color: "#1848B8", bg: "#EAF1FE" },
  moyen: { label: "Moyen", color: "#8A5A00", bg: "#FDF3DF" },
  faible: { label: "Faible", color: "#8A93A6", bg: "#F0F2F6" },
};
