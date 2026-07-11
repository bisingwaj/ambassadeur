import type { Metadata } from "next";
import CandidatureForm from "@/components/form/CandidatureForm";

export const metadata: Metadata = {
  title: "Candidature — Ambassadeur Communautaire",
  description:
    "Rejoins la Cohorte 01 des Ambassadeurs Communautaires Étoile Bleue. 20 questions rapides, environ 4 minutes.",
  robots: { index: true, follow: false },
};

export default function CandidaturePage() {
  return <CandidatureForm />;
}
