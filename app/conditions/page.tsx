import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/site/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description:
    "Conditions Générales d'Utilisation de la plateforme de recrutement des Ambassadeurs Communautaires Étoile Bleue.",
  alternates: { canonical: "/conditions" },
};

export default function ConditionsPage() {
  return (
    <LegalShell
      title="Conditions Générales d'Utilisation"
      subtitle="Les présentes conditions régissent l'accès et l'utilisation de la plateforme de candidature des Ambassadeurs Communautaires Étoile Bleue."
      updated={SITE.legal.lastUpdated}
    >
      <div className="note">
        <strong>Urgence médicale ?</strong> Ce site ne traite aucune urgence. En cas d&apos;urgence,
        composez le <strong>199</strong> — service public gratuit, 24 h/24 et 7 j/7.
      </div>

      <h2><span className="num">01</span>Objet</h2>
      <p>
        Les présentes Conditions Générales d&apos;Utilisation (les « CGU ») ont pour objet de définir les
        modalités d&apos;accès et d&apos;utilisation du site <strong>{SITE.domainLabel}</strong> (le « Site »),
        qui permet de candidater au programme des <strong>Ambassadeurs Communautaires Étoile Bleue</strong>,
        volet citoyen du service d&apos;aide médicale urgente (le 199).
      </p>
      <p>
        L&apos;accès au Site et le dépôt d&apos;une candidature impliquent l&apos;acceptation pleine et entière
        des présentes CGU.
      </p>

      <h2><span className="num">02</span>Éditeur et hébergement</h2>
      <p>
        Le Site est édité sous la responsabilité de la <strong>{SITE.coordination}</strong>, relevant du{" "}
        <strong>{SITE.ministere}</strong> (République démocratique du Congo).
      </p>
      <p>
        Le Site est hébergé par <strong>Vercel Inc.</strong> et la base de données par{" "}
        <strong>Supabase</strong>. L&apos;infrastructure est mutualisée et localisée en{" "}
        {SITE.legal.hostingRegion}.
      </p>

      <h2><span className="num">03</span>Accès au service</h2>
      <p>
        Le Site est accessible gratuitement à toute personne disposant d&apos;un accès à Internet. Tous les
        coûts liés à l&apos;accès (matériel, connexion) sont à la charge de l&apos;utilisateur.
      </p>
      <p>
        L&apos;Éditeur s&apos;efforce d&apos;assurer la disponibilité du Site mais ne saurait être tenu
        responsable d&apos;une interruption, qu&apos;elle soit volontaire (maintenance) ou indépendante de sa
        volonté.
      </p>

      <h2><span className="num">04</span>Conditions de candidature</h2>
      <p>Pour candidater comme Ambassadeur Communautaire, l&apos;utilisateur déclare&nbsp;:</p>
      <ul>
        <li>être âgé d&apos;au moins <strong>18 ans</strong>&nbsp;;</li>
        <li>résider à Kinshasa&nbsp;;</li>
        <li>fournir des informations <strong>exactes, sincères et à jour</strong>&nbsp;;</li>
        <li>candidater en son nom propre et avec son propre numéro de contact.</li>
      </ul>
      <p>
        Toute candidature comportant des informations manifestement fausses, injurieuses ou frauduleuses
        pourra être écartée sans préavis. La candidature ne constitue ni une promesse d&apos;engagement, ni un
        contrat de travail&nbsp;: le programme repose sur un <strong>engagement volontaire</strong>.
      </p>

      <h2><span className="num">05</span>Comportement de l&apos;utilisateur</h2>
      <p>L&apos;utilisateur s&apos;engage à ne pas&nbsp;:</p>
      <ul>
        <li>perturber le fonctionnement du Site ou tenter d&apos;y accéder de manière non autorisée&nbsp;;</li>
        <li>soumettre de manière automatisée ou massive des candidatures&nbsp;;</li>
        <li>collecter les données d&apos;autres utilisateurs&nbsp;;</li>
        <li>usurper l&apos;identité d&apos;un tiers.</li>
      </ul>

      <h2><span className="num">06</span>Propriété intellectuelle</h2>
      <p>
        La marque « Étoile Bleue », les logos, textes, visuels et éléments graphiques du Site sont protégés.
        Toute reproduction ou utilisation, totale ou partielle, sans autorisation écrite préalable est
        interdite.
      </p>

      <h2><span className="num">07</span>Données personnelles</h2>
      <p>
        Les données collectées via le formulaire sont traitées conformément à notre{" "}
        <Link href="/confidentialite">Politique de confidentialité et de protection des données</Link>, qui
        détaille les finalités, la base légale, la durée de conservation et vos droits.
      </p>

      <h2><span className="num">08</span>Responsabilité</h2>
      <p>
        Le Site est un outil de candidature et de sensibilisation. Il ne se substitue en aucun cas au service
        d&apos;urgence <strong>199</strong>. L&apos;Éditeur ne saurait être tenu responsable des dommages
        résultant d&apos;une utilisation contraire aux présentes CGU.
      </p>

      <h2><span className="num">09</span>Modification des CGU</h2>
      <p>
        L&apos;Éditeur se réserve le droit de modifier les présentes CGU à tout moment. La version applicable
        est celle en vigueur au moment de l&apos;accès au Site. La date de dernière mise à jour figure en
        tête de page.
      </p>

      <h2><span className="num">10</span>Droit applicable et contact</h2>
      <p>
        Les présentes CGU sont régies par le droit de la <strong>République démocratique du Congo</strong>.
        Pour toute question relative au Site ou au programme, vous pouvez écrire à{" "}
        <a href={`mailto:${SITE.legal.contactEmail}`}>{SITE.legal.contactEmail}</a>.
      </p>

      <p style={{ marginTop: 32 }}>
        <Link href="/">← Retour à l&apos;accueil</Link>
      </p>
    </LegalShell>
  );
}
