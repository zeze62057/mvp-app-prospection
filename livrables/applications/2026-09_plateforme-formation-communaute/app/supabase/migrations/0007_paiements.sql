-- Suivi des tentatives de paiement. La creation de session et la
-- verification du paiement Chariow sont orchestrees par n8n (jamais
-- geres directement dans le produit, voir CADRAGE.md section 6) : cette
-- table est juste la trace cote produit, alimentee par nos actions et
-- par le webhook /api/webhooks/paiement que n8n appelle en retour.

create table if not exists paiements (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references profils (id) on delete cascade,
  espace_id uuid not null references espaces (id) on delete cascade,
  montant integer not null,
  devise text not null default 'GNF',
  statut text not null default 'en_attente' check (statut in ('en_attente', 'confirme', 'echoue')),
  reference_chariow text,
  created_at timestamptz not null default now(),
  confirme_at timestamptz
);

alter table paiements enable row level security;

create policy "un membre voit ses propres paiements"
  on paiements for select
  using (auth.uid() = profil_id);

create policy "un membre initie son propre paiement"
  on paiements for insert
  with check (auth.uid() = profil_id);

-- Pas de policy update pour les membres : seul le webhook (service_role,
-- appele par n8n apres verification du paiement Chariow) peut confirmer
-- ou echouer un paiement.
