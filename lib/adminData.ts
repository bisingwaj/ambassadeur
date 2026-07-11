import { getServerClient } from "@/lib/supabase/server";
import { communeCoverage, type CommuneCoverage } from "@/lib/analytics";
import { computeScore, type ScoreBreakdown } from "@/lib/scoring";
import type { Candidature } from "@/lib/types";

export type ScoredCandidature = Candidature & { score: ScoreBreakdown };

/**
 * Charge toutes les candidatures, calcule la couverture des communes puis
 * le score de chaque candidat (le facteur « zone » dépend de la couverture
 * globale, d'où le calcul en deux temps). Réutilisé par overview, liste et export.
 */
export async function loadScored(): Promise<{
  rows: ScoredCandidature[];
  cov: CommuneCoverage;
}> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("candidatures")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);

  const base = (data ?? []) as Candidature[];
  const cov = communeCoverage(base);
  const rows = base.map((c) => ({
    ...c,
    score: computeScore(c, { underCommunes: cov.under }),
  }));
  return { rows, cov };
}
