-- Journal des actions sensibles d'un admin : qui a supprime quel contenu, promu quel compte, retire
-- quel membre, et quand (decision du 2026-09-24, lots 2 et 3 des pouvoirs d'administration).
--
-- Lecture et ecriture reservees au service_role (actions serveur deja protegees par une
-- verification de role admin) : RLS active SANS aucune policy, et les droits de la table sont
-- retires a anon et authenticated. Un membre ne peut donc ni lire ni forger une ligne du journal.
--
-- admin_id passe a null si le compte de l'admin est supprime : la ligne du journal reste.
-- detail : extrait du contenu supprime ou description courte, jamais un secret.

create table if not exists journal_admin (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references profils (id) on delete set null,
  action text not null check (length(action) between 1 and 60),
  cible_type text not null check (length(cible_type) between 1 and 40),
  cible_id uuid,
  espace_id uuid references espaces (id) on delete set null,
  detail text not null default '' check (length(detail) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists journal_admin_created_idx on journal_admin (created_at desc);

alter table journal_admin enable row level security;

revoke all on journal_admin from anon, authenticated;
