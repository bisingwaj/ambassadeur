// Palette de graphiques — validée avec scripts/validate_palette.js (mode light) :
// lightness band ✓, chroma ✓, séparation CVD ✓, contraste ≥ 3:1 ✓.
// Les marques portent toujours un label direct (jamais couleur seule).

export const CHART = {
  blue: "#2E6AE0",
  green: "#12855F",
  amber: "#C77A00",
  violet: "#6E5AE6",
  red: "#C0392B",
  ink: "#0B1B34",
  grid: "#E7EAF0",
  axis: "#C4CAD6",
  muted: "#98A2B6",
  surface: "#FFFFFF",
} as const;

// Couleur par facteur de score (ordre catégoriel fixe).
export const FACTOR_COLOR = {
  dispo: CHART.blue,
  competences: CHART.green,
  oral: CHART.amber,
  couverture: CHART.violet,
} as const;

export const FACTOR_LABEL = {
  dispo: "Disponibilité",
  competences: "Compétences",
  oral: "Aisance à l'oral",
  couverture: "Couverture langues/zone",
} as const;
