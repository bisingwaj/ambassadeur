import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmationView from "./ConfirmationView";

export const metadata: Metadata = {
  title: "Candidature reçue",
  description: "Merci — ta candidature d'Ambassadeur Communautaire Étoile Bleue a bien été reçue.",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationView />
    </Suspense>
  );
}
