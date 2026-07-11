// Helpers de formatage partagés (téléphone, dates).

/** Ne garde que les 9 chiffres nationaux (retire +243, 0 initial, espaces). */
export function telDigits(raw: string | null | undefined): string {
  if (!raw) return "";
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("243")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 9);
}

/** Vrai si le numéro est un mobile RDC valide : 9 chiffres commençant par 8 ou 9. */
export function isValidTel(raw: string | null | undefined): boolean {
  return /^[89]\d{8}$/.test(telDigits(raw));
}

/** Forme canonique stockée en base : +243XXXXXXXXX. */
export function telCanonical(raw: string | null | undefined): string {
  const d = telDigits(raw);
  return d ? "+243" + d : "";
}

/** Affichage groupé : +243 8XX XXX XXX. */
export function formatTel(raw: string | null | undefined): string {
  const d = telDigits(raw);
  if (d.length !== 9) return raw || "—";
  return `+243 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

/** Groupage des 9 chiffres pendant la saisie : "8XX XXX XXX". */
export function groupTelInput(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 9);
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)].filter(Boolean);
  return parts.join(" ");
}
