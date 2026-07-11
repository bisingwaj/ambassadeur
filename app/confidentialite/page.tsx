import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/site/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Étoile Bleue collecte, utilise et protège vos données personnelles dans le cadre du recrutement des Ambassadeurs Communautaires.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <LegalShell
      title="Politique de confidentialité et de protection des données"
      subtitle="Nous nous engageons à protéger vos données personnelles. Cette politique explique quelles données nous collectons, pourquoi, combien de temps, et quels sont vos droits."
      updated={SITE.legal.lastUpdated}
    >
      <div className="note">
        En résumé&nbsp;: nous ne collectons que les informations nécessaires à l&apos;étude de votre
        candidature d&apos;ambassadeur. Elles sont <strong>stockées localement sur les serveurs du
        Ministère</strong> (hébergement souverain, on-premise), <strong>ni vendues, ni utilisées à des fins
        publicitaires</strong> par le Ministère. Le site utilise en revanche des cookies de mesure et de
        marketing tiers (Google&nbsp;Analytics et pixel Meta) — voir «&nbsp;Cookies&nbsp;».
      </div>

      <h2><span className="num">01</span>Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données est la <strong>{SITE.coordination}</strong>, relevant du{" "}
        <strong>{SITE.ministere}</strong> (République démocratique du Congo).
      </p>
      <p>
        Pour toute question ou pour exercer vos droits&nbsp;:{" "}
        <a href={`mailto:${SITE.legal.contactEmail}`}>{SITE.legal.contactEmail}</a>.
      </p>

      <h2><span className="num">02</span>Données que nous collectons</h2>
      <p>Lorsque vous déposez une candidature, nous collectons&nbsp;:</p>
      <table>
        <thead>
          <tr><th>Catégorie</th><th>Données</th></tr>
        </thead>
        <tbody>
          <tr><td>Identité</td><td>Nom et prénom, genre, tranche d&apos;âge</td></tr>
          <tr><td>Localisation</td><td>Commune, quartier, avenue et numéro de parcelle (Kinshasa)</td></tr>
          <tr><td>Contact</td><td>Adresse e-mail, numéro WhatsApp</td></tr>
          <tr><td>Profil</td><td>Langues parlées, domaines d&apos;aide, aisance à l&apos;oral, notions de secourisme, expérience, disponibilités</td></tr>
          <tr><td>Champs libres</td><td>Terrains/publics connus, idées de sensibilisation (facultatifs)</td></tr>
          <tr><td>Techniques</td><td>Date et heure d&apos;envoi, type de navigateur (pour la sécurité)</td></tr>
        </tbody>
      </table>
      <p>
        Nous ne collectons <strong>aucune donnée sensible</strong> (opinions, santé, religion…) et ne vous en
        demandons pas. Merci de ne pas en communiquer dans les champs libres.
      </p>

      <h2><span className="num">03</span>Finalités et base légale</h2>
      <p>Vos données sont utilisées exclusivement pour&nbsp;:</p>
      <ul>
        <li>étudier et sélectionner les candidatures au programme des Ambassadeurs Communautaires&nbsp;;</li>
        <li>vous recontacter (principalement par WhatsApp) au sujet de votre candidature&nbsp;;</li>
        <li>organiser la formation et le déploiement des ambassadeurs retenus&nbsp;;</li>
        <li>établir des statistiques agrégées et anonymes de pilotage de la campagne.</li>
      </ul>
      <p>
        La base légale du traitement est votre <strong>consentement</strong>, recueilli au moment de
        l&apos;envoi du formulaire, ainsi que l&apos;exécution d&apos;une mission d&apos;intérêt public
        (déploiement d&apos;un service public d&apos;urgence).
      </p>

      <h2><span className="num">04</span>Destinataires</h2>
      <p>Vos données sont accessibles uniquement&nbsp;:</p>
      <ul>
        <li>aux membres <strong>habilités</strong> de la Coordination et de l&apos;équipe Étoile Bleue en charge du recrutement, au sein du Ministère.</li>
      </ul>
      <p>
        Vos <strong>données de candidature</strong> ne sont <strong>jamais vendues ni cédées</strong> et
        restent sous le contrôle exclusif du Ministère. Les seuls services tiers utilisés sont
        <strong> Google&nbsp;Analytics</strong> et le <strong>pixel Meta (Facebook)</strong>, limités à la
        mesure d&apos;audience et au marketing du site&nbsp;: ils ne traitent pas le contenu de vos candidatures
        (voir «&nbsp;Cookies&nbsp;»).
      </p>

      <h2><span className="num">05</span>Hébergement souverain</h2>
      <p>
        Le site et la base de données sont <strong>hébergés en propre (on-premise)</strong> sur{" "}
        {SITE.legal.hosting}. Vos <strong>données de candidature</strong> et toutes les données sensibles sont
        <strong> stockées localement</strong> sur ces serveurs&nbsp;: elles ne quittent pas le territoire
        national et ne sont transmises à aucun tiers. Seules la <strong>mesure d&apos;audience et le marketing</strong>
        {" "}du site s&apos;appuient sur Google&nbsp;Analytics et le pixel Meta (Facebook), qui traitent des données
        de navigation en dehors de la RDC — <strong>sans jamais inclure le contenu de vos candidatures</strong>
        {" "}(voir «&nbsp;Cookies&nbsp;»).
      </p>

      <h2><span className="num">06</span>Durée de conservation</h2>
      <p>
        Vos données sont conservées pendant <strong>{SITE.legal.retention}</strong>, puis supprimées ou
        anonymisées. Les données des ambassadeurs retenus sont conservées le temps de leur engagement.
        Vous pouvez demander la suppression de vos données à tout moment (voir « Vos droits »).
      </p>

      <h2><span className="num">07</span>Sécurité</h2>
      <p>Nous mettons en œuvre des mesures techniques et organisationnelles adaptées&nbsp;:</p>
      <ul>
        <li>chiffrement des échanges (HTTPS/TLS) sur l&apos;ensemble du site&nbsp;;</li>
        <li>accès à la base restreint et protégé par authentification (règles de sécurité au niveau des lignes)&nbsp;;</li>
        <li>séparation stricte entre le site public et l&apos;espace d&apos;administration&nbsp;;</li>
        <li>journalisation et principe du moindre privilège pour les personnes habilitées.</li>
      </ul>

      <h2><span className="num">08</span>Cookies</h2>
      <p>
        Le site déploie ses balises de mesure via <strong>Google&nbsp;Tag&nbsp;Manager</strong> et utilise des
        cookies de <strong>mesure d&apos;audience et de marketing</strong> fournis par des services tiers&nbsp;:
      </p>
      <ul>
        <li><strong>Google&nbsp;Analytics</strong> — mesure d&apos;audience agrégée (pages vues, type d&apos;appareil, provenance)&nbsp;;</li>
        <li><strong>pixel Meta (Facebook)</strong> — mesure de la performance de nos campagnes et diffusion de <strong>publicités ciblées</strong> sur les plateformes de Meta (Facebook, Instagram).</li>
      </ul>
      <p>
        Ces outils déposent des cookies et transmettent des données de navigation à Google et à Meta,
        susceptibles de les traiter <strong>hors de la RDC</strong>. Ces données <strong>n&apos;incluent pas le
        contenu de votre candidature</strong>. Vous pouvez refuser ou limiter ces cookies via les réglages de
        votre navigateur, le module de désactivation de Google&nbsp;Analytics
        (<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a>)
        et vos préférences publicitaires Meta. Par ailleurs, l&apos;espace d&apos;administration réservé (non
        accessible au public) dépose un cookie strictement nécessaire à l&apos;authentification des personnes
        habilitées.
      </p>

      <h2><span className="num">09</span>Vos droits</h2>
      <p>Conformément au cadre applicable, vous disposez des droits suivants sur vos données&nbsp;:</p>
      <ul>
        <li><strong>Accès</strong> — obtenir une copie des données vous concernant&nbsp;;</li>
        <li><strong>Rectification</strong> — corriger des informations inexactes&nbsp;;</li>
        <li><strong>Effacement</strong> — demander la suppression de vos données&nbsp;;</li>
        <li><strong>Opposition et retrait du consentement</strong> — à tout moment, sans conséquence sur la légalité des traitements déjà effectués.</li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez à{" "}
        <a href={`mailto:${SITE.legal.contactEmail}`}>{SITE.legal.contactEmail}</a>. Nous répondons dans un
        délai raisonnable et pourrons vous demander de justifier votre identité.
      </p>

      <h2><span className="num">10</span>Cadre légal</h2>
      <p>
        Le présent traitement est réalisé dans le respect de la législation de la République démocratique du
        Congo relative à la protection des données à caractère personnel, notamment le{" "}
        <strong>Code du numérique</strong> (Ordonnance-loi n°&nbsp;23/010 du 13 mars 2023), et s&apos;inspire
        des standards internationaux de protection des données.
      </p>

      <h2><span className="num">11</span>Modification de la politique</h2>
      <p>
        Cette politique peut évoluer. Toute modification sera publiée sur cette page avec une date de mise à
        jour actualisée. La version en vigueur est celle affichée ci-dessus.
      </p>

      <p style={{ marginTop: 32 }}>
        <Link href="/">← Retour à l&apos;accueil</Link> · <Link href="/conditions">Conditions d&apos;utilisation</Link>
      </p>
    </LegalShell>
  );
}
