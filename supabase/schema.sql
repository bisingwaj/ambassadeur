-- ════════════════════════════════════════════════════════════════════════
--  Étoile Bleue — Ambassadeurs Communautaires
--  Schéma Supabase / PostgreSQL
--  À exécuter dans : Supabase → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════════════

-- ── Table des candidatures ──────────────────────────────────────────────
create table if not exists public.candidatures (
  id           uuid primary key default gen_random_uuid(),
  ref          text unique not null,
  created_at   timestamptz not null default now(),
  status       text not null default 'nouveau'
                 check (status in ('nouveau','en_revue','accepte','refuse')),

  nom          text not null,
  prenom       text,
  age          text,
  commune      text,
  quartier     text,
  langues      text[],
  email        text,
  tel          text,
  secteurs     text[],
  parole       text,
  secourisme   text,
  experience   text,
  soir         text,
  weekend      text,
  formation    text,
  jours        text,
  publics      text,
  idees        text,
  consent      boolean not null default false,
  meta         jsonb
);

create index if not exists candidatures_created_at_idx on public.candidatures (created_at desc);
create index if not exists candidatures_status_idx     on public.candidatures (status);
create index if not exists candidatures_commune_idx    on public.candidatures (commune);

-- ── Row Level Security ──────────────────────────────────────────────────
-- Principe :
--   • Le public N'A AUCUN accès direct à la table.
--   • Les candidatures sont insérées côté serveur avec la clé service_role
--     (qui contourne la RLS) via /api/candidatures.
--   • Le dashboard admin lit / met à jour en tant qu'utilisateur authentifié.
alter table public.candidatures enable row level security;

drop policy if exists "admin_read"   on public.candidatures;
drop policy if exists "admin_update" on public.candidatures;
drop policy if exists "admin_delete" on public.candidatures;

create policy "admin_read"   on public.candidatures
  for select to authenticated using (true);

create policy "admin_update" on public.candidatures
  for update to authenticated using (true) with check (true);

create policy "admin_delete" on public.candidatures
  for delete to authenticated using (true);

-- ── Séquence de référence lisible : EB01-00001, EB01-00002, ... ─────────
create sequence if not exists public.candidature_ref_seq start 1;

create or replace function public.next_candidature_ref()
returns text
language sql
volatile
as $$
  select 'EB01-' || lpad(nextval('public.candidature_ref_seq')::text, 5, '0');
$$;

-- Durcissement : seule la clé service_role (côté serveur) doit générer une
-- référence. On retire l'accès aux rôles publics pour éviter tout abus de la
-- séquence via l'API REST.
revoke execute on function public.next_candidature_ref() from anon, authenticated, public;
revoke usage, select on sequence public.candidature_ref_seq from anon, authenticated, public;

-- ════════════════════════════════════════════════════════════════════════
--  APRÈS avoir exécuté ce script :
--  1. Crée le compte admin : Authentication → Users → Add user
--     (email + mot de passe). Ce sera l'accès au dashboard /admin.
--  2. (Optionnel) Authentication → Providers → désactive "Enable sign-ups"
--     pour empêcher toute auto-inscription.
-- ════════════════════════════════════════════════════════════════════════
