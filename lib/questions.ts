// Définition du formulaire de candidature — fidèle au prototype d'origine.
// 20 questions, réparties en étapes. Sert à la fois au formulaire public
// et au rendu du détail dans le dashboard admin.

export type QuestionType =
  | "text"
  | "email"
  | "tel"
  | "single"
  | "multi"
  | "grid" // communes de Kinshasa
  | "yesno"
  | "textarea";

export interface Question {
  key: string;
  type: QuestionType;
  q: string;
  help?: string;
  ph?: string;
  options?: string[];
  optional?: boolean;
  errMsg?: string;
  /** Libellé court, utilisé dans la relecture et le dashboard. */
  label: string;
}

export const COMMUNES = [
  "Bandalungwa", "Barumbu", "Bumbu", "Gombe", "Kalamu", "Kasa-Vubu",
  "Kimbanseke", "Kinshasa", "Kintambo", "Kisenso", "Lemba", "Limete",
  "Lingwala", "Makala", "Maluku", "Masina", "Matete", "Mont-Ngafula",
  "Ndjili", "Ngaba", "Ngaliema", "Ngiri-Ngiri", "Nsele", "Selembao",
];

export const QUESTIONS: Question[] = [
  { key: "nom", type: "text", label: "Nom et prénom", q: "Comment t'appelles-tu ?", help: "Ton nom et ton prénom.", ph: "Ex. Kabeya Mwamba" },
  { key: "age", type: "single", label: "Âge", q: "Quelle est ta tranche d'âge ?", options: ["18 – 25 ans", "26 – 35 ans", "36 – 50 ans"] },
  { key: "genre", type: "single", label: "Genre", q: "Quel est ton genre ?", options: ["Homme", "Femme", "Autre"] },
  { key: "commune", type: "grid", label: "Commune", q: "Dans quelle commune vis-tu ?", help: "Les 24 communes de Kinshasa.", errMsg: "Choisis ta commune." },
  { key: "quartier", type: "text", label: "Quartier", q: "Et ton quartier ?", ph: "Ex. Matonge" },
  { key: "avenue", type: "text", label: "Avenue", q: "Sur quelle avenue habites-tu ?", ph: "Ex. Avenue Kasa-Vubu" },
  { key: "numero", type: "text", label: "N° parcelle", q: "Quel est le numéro de ta parcelle ?", help: "Le numéro inscrit sur ta maison ou parcelle.", ph: "Ex. 12" },
  { key: "langues", type: "multi", label: "Langues", q: "Quelles langues parles-tu ?", help: "Plusieurs choix possibles.", options: ["Français", "Lingala", "Swahili", "Tshiluba", "Kikongo", "Autre"] },
  { key: "email", type: "email", label: "E-mail", q: "Ton adresse e-mail ?", help: "Pour te tenir informé(e).", ph: "prenom@email.com" },
  { key: "tel", type: "tel", label: "WhatsApp", q: "Ton numéro WhatsApp ?", help: "Juste les 9 chiffres après +243 — c'est par là qu'on te recontactera.", ph: "812 345 678" },
  { key: "secteurs", type: "multi", label: "Domaines", q: "Dans quels domaines peux-tu aider ?", help: "Plusieurs choix possibles.", options: ["Animation et sensibilisation", "Logistique et organisation", "Communication et relations publiques", "Encadrement et formation", "Autre"] },
  { key: "parole", type: "single", label: "Prise de parole", q: "À l'aise pour parler en public ?", options: ["Oui, très à l'aise", "Assez à l'aise", "Pas très à l'aise", "Pas du tout à l'aise"] },
  { key: "secourisme", type: "yesno", label: "Secourisme", q: "Des connaissances en secourisme ?", help: "Premiers secours, gestes qui sauvent." },
  { key: "experience", type: "yesno", label: "Expérience", q: "Déjà fait de la sensibilisation ou de l'animation ?" },
  { key: "soir", type: "yesno", label: "Soirée", q: "Disponible en soirée ou tard le soir ?" },
  { key: "weekend", type: "yesno", label: "Week-end", q: "Disponible le week-end et les jours fériés ?" },
  { key: "formation", type: "yesno", label: "Formation", q: "Partant(e) pour une formation avant la mission ?" },
  { key: "jours", type: "single", label: "Jours / semaine", q: "Combien de jours par semaine ?", options: ["1 jour", "2 jours", "3 jours ou plus", "Cela dépend des semaines"] },
  { key: "publics", type: "textarea", label: "Terrains connus", q: "Quels lieux ou publics connais-tu le mieux ?", help: "Marchés, écoles, églises, groupes de jeunes… Où serais-tu le plus à l'aise ? (optionnel)", optional: true },
  { key: "idees", type: "textarea", label: "Idées", q: "Une idée pour mieux sensibiliser ?", help: "Optionnel — pour la coordination.", optional: true },
];

export const FAQ = [
  { q: "Le service est-il vraiment gratuit ?", a: "Oui, totalement — 0 FC. C'est un service public du Ministère de la Santé Publique, Hygiène et Prévoyance sociale, accessible à tous, jour et nuit." },
  { q: "C'est un programme officiel ?", a: "Oui. Étoile Bleue est un service de la Coordination Nationale Spécialisée en Prise en Charge des Urgences Médicales Préhospitalières et Hospitalières, du Ministère de la Santé Publique, Hygiène et Prévoyance sociale. Le programme des Ambassadeurs Communautaires en est le volet citoyen." },
  { q: "Faut-il des diplômes ou de l'expérience ?", a: "Non. Ta motivation suffit. Une formation certifiante est prévue avant d'aller sur le terrain — premiers secours, mission d'ambassadeur et prise de parole." },
  { q: "Est-ce rémunéré ?", a: "C'est un engagement volontaire — on ne vient pas pour un salaire. En retour : une vraie formation qui renforce tes capacités, l'opportunité de faire partie d'un grand projet national, et la reconnaissance officielle du Ministère de la Santé comme Ambassadeur Communautaire." },
  { q: "Combien de temps ça demande ?", a: "À partir d'un jour par semaine, selon tes disponibilités. C'est toi qui choisis ton rythme et tes terrains d'action." },
  { q: "Quand commence la Cohorte 01 ?", a: "La campagne de pré-lancement commence maintenant. Tu seras contacté(e) sur WhatsApp dès la validation de ta candidature." },
];
