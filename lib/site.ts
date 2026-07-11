// Constantes partagées du site Étoile Bleue — Ambassadeurs Communautaires.

export const SITE = {
  name: "Étoile Bleue",
  fullName: "Étoile Bleue — Ambassadeurs Communautaires",
  tagline: "Le 199, le bon réflexe.",
  description:
    "Le premier service d'aide médicale urgente gratuit arrive à Kinshasa. Étoile Bleue recrute ses Ambassadeurs Communautaires — Cohorte 01. Sa réussite dépend de nous.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ambassadeurs.199.cd",
  domainLabel: "ambassadeurs.199.cd",
  ministere:
    "Ministère de la Santé Publique, Hygiène et Prévoyance sociale",
  coordination:
    "Coordination Nationale Spécialisée en Prise en Charge des Urgences Médicales Préhospitalières et Hospitalières",
  urgence: "199",
  cohorte: {
    base: Number(process.env.NEXT_PUBLIC_COHORTE_BASE ?? 0),
    objectif: Number(process.env.NEXT_PUBLIC_COHORTE_OBJECTIF ?? 500),
  },
  social: {
    whatsapp: "https://wa.me/",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
  // ⚠️ À confirmer par la Coordination avant mise en ligne définitive.
  legal: {
    // Adresse de contact « protection des données » (droits d'accès, etc.).
    contactEmail: "data@199.cd",
    // Durée de conservation des candidatures non retenues.
    retention: "24 mois après la clôture de la campagne de recrutement",
    // Hébergement souverain : serveurs du Ministère (on-premise, RDC).
    hosting:
      "les serveurs du Ministère de la Santé Publique, Hygiène et Prévoyance sociale, à Kinshasa (République démocratique du Congo)",
    lastUpdated: "11 juillet 2026",
  },
} as const;

// Année © gérée statiquement pour éviter une hydratation dépendante de l'horloge.
export const COPYRIGHT_YEAR = 2026;
