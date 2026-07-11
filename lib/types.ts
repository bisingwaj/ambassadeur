// Modèle d'une candidature — aligné sur supabase/schema.sql.

export type CandidatureStatus =
  | "nouveau"
  | "en_revue"
  | "accepte"
  | "refuse";

export const STATUS_META: Record<
  CandidatureStatus,
  { label: string; color: string; bg: string }
> = {
  nouveau: { label: "Nouveau", color: "#1848B8", bg: "#EAF1FE" },
  en_revue: { label: "En revue", color: "#8A5A00", bg: "#FDF3DF" },
  accepte: { label: "Accepté", color: "#0E7A57", bg: "#E4F6EF" },
  refuse: { label: "Refusé", color: "#B23B2A", bg: "#FCECE9" },
};

export interface Candidature {
  id: string;
  ref: string;
  created_at: string;
  status: CandidatureStatus;
  nom: string;
  prenom: string | null;
  age: string | null;
  genre: string | null;
  commune: string | null;
  quartier: string | null;
  avenue: string | null;
  numero: string | null;
  langues: string[] | null;
  email: string | null;
  tel: string | null;
  secteurs: string[] | null;
  parole: string | null;
  secourisme: string | null;
  experience: string | null;
  soir: string | null;
  weekend: string | null;
  formation: string | null;
  jours: string | null;
  publics: string | null;
  idees: string | null;
  consent: boolean;
  meta: Record<string, unknown> | null;
}

// Charge utile envoyée par le formulaire public.
export interface CandidaturePayload {
  nom: string;
  age?: string;
  genre?: string;
  commune?: string;
  quartier?: string;
  avenue?: string;
  numero?: string;
  langues?: string[];
  email?: string;
  tel?: string;
  secteurs?: string[];
  parole?: string;
  secourisme?: string;
  experience?: string;
  soir?: string;
  weekend?: string;
  formation?: string;
  jours?: string;
  publics?: string;
  idees?: string;
  consent: boolean;
}
