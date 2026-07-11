import type { Metadata } from "next";
import CandidatureForm from "@/components/form/CandidatureForm";

export const metadata: Metadata = {
  title: "Candidature — Ambassadeur Communautaire",
  description:
    "Rejoins la Cohorte 01 des Ambassadeurs Communautaires Étoile Bleue. 17 questions rapides, environ 3 minutes.",
  robots: { index: true, follow: false },
};

export default function CandidaturePage() {
  return <CandidatureForm />;
}
