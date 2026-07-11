# Étoile Bleue — Plateforme Ambassadeurs Communautaires

Site de campagne + formulaire de candidature + **dashboard d'administration**, pour le recrutement de la Cohorte 01 des Ambassadeurs Communautaires Étoile Bleue (service d'urgence 199, Kinshasa).

Construit avec **Next.js 15 (App Router)**, **TypeScript**, **Tailwind v4**, **Supabase** (Postgres + Auth), déployable sur **Vercel**.

---

## 🗂️ Ce qui est inclus

| Partie | Route | Description |
|---|---|---|
| Accueil | `/` | Landing éditoriale, mobile-first, SEO + OpenGraph, compteur de cohorte en direct |
| Candidature | `/candidature` | Formulaire en 17 questions (une par écran), validation, clavier |
| Confirmation | `/confirmation` | Accusé de réception + référence `EB01-XXXXX` + invitation WhatsApp |
| **Dashboard admin** | `/admin` | **Protégé.** Liste, stats, filtres, recherche, détail, changement de statut, export CSV |
| Connexion admin | `/admin/login` | Authentification Supabase (e-mail + mot de passe) |

Le dashboard **n'est lié nulle part** depuis le site public et est marqué `noindex`.

---

## 🚀 Démarrage local

```bash
npm install
cp .env.example .env        # puis renseigne les valeurs Supabase
npm run dev                 # http://localhost:3000
```

> Sans Supabase configuré, le site public fonctionne en **mode démo** (les candidatures ne sont pas enregistrées, une référence temporaire est renvoyée) et le dashboard affiche « Configuration requise ».

---

## 🗄️ Configurer Supabase (5 min)

1. Crée un projet sur [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → colle le contenu de [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   Ça crée la table `candidatures`, la sécurité (RLS) et la séquence de références.
3. **Authentication → Users → Add user** : crée le compte admin (e-mail + mot de passe). C'est l'accès à `/admin`.
4. *(Recommandé)* **Authentication → Providers → Email** : désactive « Enable sign-ups » pour empêcher toute auto-inscription.
5. **Project Settings → API** : récupère les 3 valeurs pour ton `.env` :

```bash
NEXT_PUBLIC_SUPABASE_URL=...        # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # anon public
SUPABASE_SERVICE_ROLE_KEY=...       # service_role (SECRET)
```

### Modèle de sécurité
- Le **public n'accède jamais** directement à la base.
- Les candidatures sont insérées **côté serveur** (`/api/candidatures`) avec la clé `service_role` — jamais exposée au navigateur.
- Le dashboard lit/écrit en tant qu'**admin authentifié** ; la RLS bloque tout le reste.

---

## ▲ Déploiement sur Vercel

1. Pousse le dépôt sur GitHub (ou GitLab/Bitbucket).
2. Sur [vercel.com](https://vercel.com) → **Add New → Project** → importe le dépôt (framework détecté : Next.js).
3. **Settings → Environment Variables** : ajoute les mêmes variables que dans `.env`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_COHORTE_BASE`, `NEXT_PUBLIC_COHORTE_OBJECTIF`).
4. **Deploy.** Vercel construit et met en ligne automatiquement.
5. Branche ton domaine (ex. `ambassadeurs.009.cd`) dans **Settings → Domains**, et mets `NEXT_PUBLIC_SITE_URL` à la même valeur.

Les anciennes URLs `/index.html`, `/candidature.html`, `/confirmation.html` sont redirigées (voir `vercel.json`).

---

## ⚙️ Variables d'environnement

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (connexion admin) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé secrète serveur (insertion + lecture dashboard) |
| `NEXT_PUBLIC_SITE_URL` | URL publique (OpenGraph, sitemap) |
| `NEXT_PUBLIC_COHORTE_BASE` | Base ajoutée au compteur affiché (« X / 500 ») |
| `NEXT_PUBLIC_COHORTE_OBJECTIF` | Objectif de la cohorte (défaut 500) |

---

## 📊 Utiliser le dashboard (outil de profilage & analyse)

- **Se connecter** : `/admin/login` avec le compte créé dans Supabase.
- **Vue d'ensemble** (`/admin`) : KPI (total, score moyen, communes couvertes /24, % dispo soir+WE), courbe de tendance, **couverture des 24 communes**, répartitions (langues, domaines, âges, disponibilité), distribution des scores et **top candidats**. Graphiques SVG maison (palette validée accessibilité/CVD).
- **Score de fit** (0–100, transparent) calculé pour chaque candidat sur 4 facteurs équilibrés : **Disponibilité · Compétences · Aisance à l'oral · Couverture langues/zone**. Des **tags** en sont dérivés (Secouriste, Orateur, Multilingue, Zone prioritaire…). Voir `lib/scoring.ts`.
- **Candidatures** (`/admin/candidatures`) : filtres combinés (statut, commune, langue, domaine, disponibilité, **bande de score**, recherche), tri par colonne/score, **sélection multiple + changement de statut groupé**, pagination.
- **Profil** (`/admin/candidatures/[id]`) : jauge de score détaillée par facteur, tags, boutons WhatsApp / e-mail, toutes les réponses.
- **Export CSV** : respecte le filtre courant ; inclut **score + les 4 composantes + tags** ; UTF-8 + BOM (Excel).

### 📱 Saisie du téléphone
Le formulaire impose le préfixe **+243** et **exactement 9 chiffres** (mobile RDC, commençant par 8 ou 9), formatés `8XX XXX XXX` en direct. Stockage canonique `+243XXXXXXXXX`. Validé côté client **et** serveur. Voir `lib/format.ts`.

---

## ⚡ Performance & mobile

- **Rendu serveur** (SSR/SSG) → excellent SEO, partage social (OpenGraph/Twitter), JSON-LD `GovernmentService`.
- **Polices auto-hébergées** (woff2) — aucune requête tierce, aucun décalage de mise en page.
- **Typographie fluide** via `clamp()` : gros titres et textes réduits s'adaptent au mobile sans point de rupture brutal.
- **JS minimal** : la landing charge ~115 kB (First Load) ; l'interactivité (apparition au scroll, compteurs, FAQ) est progressive.
- **`prefers-reduced-motion`** respecté.

---

## 🔒 Sécurité

Mesures en place (vérifiées de bout en bout) :

- **Next.js 15.5.x** (correctifs de sécurité, dont le contournement d'autorisation du middleware).
- **En-têtes de sécurité** globaux (`next.config.ts`) : `Content-Security-Policy`, `Strict-Transport-Security` (HSTS preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. `X-Powered-By` retiré.
- **Pas d'injection SQL** : tout passe par le client Supabase paramétré ; les filtres du dashboard sont appliqués en JavaScript, aucune interpolation de requête.
- **XSS** : React échappe toutes les sorties (vérifié avec une charge `<img onerror>` → rendue échappée). Aucun `dangerouslySetInnerHTML` sur des données utilisateur (seul le JSON-LD statique en utilise).
- **Injection CSV/formule** neutralisée à l'export (préfixe des cellules `= + - @`).
- **Validation stricte côté serveur** (`/api/candidatures`) : chaque réponse « choix » doit appartenir à la liste autorisée, longueurs plafonnées, tableaux filtrés — une commune ou une valeur hors-liste est rejetée (400).
- **Honeypot anti-bot** (champ invisible `website`) sur le formulaire public.
- **Anti open-redirect** sur la connexion admin (le paramètre `next` n'accepte qu'un chemin `/admin…`).
- **RLS Supabase** : le public n'accède jamais à la table ; lecture/écriture réservées aux admins authentifiés ; insertions serveur via `service_role`. La fonction de référence est révoquée pour les rôles publics.
- **Secrets** : `SUPABASE_SERVICE_ROLE_KEY` uniquement côté serveur (jamais `NEXT_PUBLIC`), `.env` ignoré par git.

**À faire côté plateforme** : activer le pare-feu / la limitation de débit (Vercel Firewall ou Cloudflare) devant `/api/candidatures` pour la protection anti-abus à grande échelle. Note : `npm audit` signale 2 vulnérabilités « moderate » **de build** dans le `postcss` interne à Next (stringify CSS) — sans impact à l'exécution, corrigées par les futures versions de Next.

## 📄 Pages légales

- `/conditions` — Conditions Générales d'Utilisation.
- `/confidentialite` — Politique de confidentialité et de protection des données (RGPD-like + Code du numérique RDC).

⚠️ **À confirmer par la Coordination / le DPO avant mise en ligne** (dans `lib/site.ts` → `SITE.legal`) : l'adresse de contact `contactEmail`, la durée de conservation `retention`, et la région d'hébergement `hostingRegion` (voir Supabase → Project Settings → région du projet). Ces textes sont solides et conformes aux standards, mais doivent être validés juridiquement.

## 🧱 Structure

```
app/
  layout.tsx            Racine : polices, métadonnées SEO/OpenGraph
  page.tsx              Landing (10 sections + CTA)
  candidature/          Formulaire (client)
  confirmation/         Accusé de réception
  admin/                Dashboard protégé (layout + login + liste + détail + actions)
  api/
    candidatures/       POST public (validation + insertion serveur)
    export/             GET CSV (protégé)
  sitemap.ts, robots.ts
components/
  site/                 Header, Footer, interactions landing
  form/                 CandidatureForm
  admin/                StatusBadge, StatusControl
lib/
  site.ts               Constantes campagne
  questions.ts          Les 17 questions + 24 communes + FAQ
  types.ts              Modèle Candidature + statuts
  supabase/             Clients serveur / navigateur
supabase/schema.sql     À exécuter dans Supabase
_original/              Fichiers HTML d'origine (référence, non déployés)
```

---

## 🔌 Brancher un e-mail / notification (optionnel)

Dans `app/api/candidatures/route.ts`, après l'`insert` réussi, tu peux appeler un service
(Resend, un webhook WhatsApp, etc.) pour notifier l'équipe ou le candidat. Le point d'entrée est déjà isolé.

---

© 2026 Étoile Bleue — Kinshasa, RDC · Le 199, le bon réflexe.
