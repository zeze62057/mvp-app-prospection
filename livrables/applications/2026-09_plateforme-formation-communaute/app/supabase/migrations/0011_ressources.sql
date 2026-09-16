-- Ressources de la formation payante (outils, fichiers telechargeables,
-- glossaire) : reservees a l'acces payant, PAS a la communaute gratuite
-- (contrairement aux prompts, qui sont l'aimant a prospects gratuit,
-- voir migration 0010). Decision explicite de Zeze le 2026-09-16.

create table if not exists ressources (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  type text not null check (type in ('lien', 'fichier')),
  titre text not null,
  description text not null default '',
  url text,
  chemin_storage text,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

alter table ressources enable row level security;

create policy "membre payant lit les ressources de son espace"
  on ressources for select
  to authenticated
  using (public.a_acces_zone(auth.uid(), espace_id, 'payante'));

-- Pas de policy insert/update pour les membres : seul le chemin admin
-- (service_role, via server action ou route handler) peut creer une
-- ressource, meme logique que pour les videos de cours (migration 0009).

create table if not exists glossaire (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  terme text not null,
  definition text not null,
  ordre integer not null default 0
);

alter table glossaire enable row level security;

create policy "membre payant lit le glossaire de son espace"
  on glossaire for select
  to authenticated
  using (public.a_acces_zone(auth.uid(), espace_id, 'payante'));

insert into storage.buckets (id, name, public)
values ('ressources-fichiers', 'ressources-fichiers', false)
on conflict (id) do nothing;

drop policy if exists "lecture fichier ressource si acces payant" on storage.objects;
create policy "lecture fichier ressource si acces payant"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'ressources-fichiers'
    and exists (
      select 1 from ressources r
      where r.id::text = split_part(storage.objects.name, '/', 1)
        and public.a_acces_zone(auth.uid(), r.espace_id, 'payante')
    )
  );

-- Seed : outils reels cites dans le Module 1 (voir 01-fondations.md,
-- chapitres 2 a 4), jamais inventes.

insert into ressources (espace_id, type, titre, description, url, ordre)
select id, 'lien', 'Node.js', 'Prerequis pour installer Claude Code. Choisis la version LTS.', 'https://nodejs.org', 1
from espaces where slug = 'vivier-ia';

insert into ressources (espace_id, type, titre, description, url, ordre)
select id, 'lien', 'Claude Code', 'L''agent qui code pour toi. S''installe avec `npm install -g @anthropic-ai/claude-code`.', 'https://claude.com/claude-code', 2
from espaces where slug = 'vivier-ia';

insert into ressources (espace_id, type, titre, description, url, ordre)
select id, 'lien', 'Visual Studio Code', 'L''IDE pour naviguer visuellement dans les fichiers de ton projet.', 'https://code.visualstudio.com', 3
from espaces where slug = 'vivier-ia';

insert into ressources (espace_id, type, titre, description, url, ordre)
select id, 'lien', 'Git', 'Garde un historique reversible de ton projet, le filet de securite du code.', 'https://git-scm.com', 4
from espaces where slug = 'vivier-ia';

insert into ressources (espace_id, type, titre, description, url, ordre)
select id, 'lien', 'GitHub', 'Heberge et sauvegarde en ligne l''historique Git de ton projet.', 'https://github.com', 5
from espaces where slug = 'vivier-ia';

insert into ressources (espace_id, type, titre, description, url, ordre)
select id, 'lien', 'Vercel', 'Hebergement rapide et automatise pour les sites et applications web.', 'https://vercel.com', 6
from espaces where slug = 'vivier-ia';

insert into ressources (espace_id, type, titre, description, url, ordre)
select id, 'lien', 'OVH', 'Hebergeur pour les projets qui ont besoin d''un serveur dedie (backend n8n auto-heberge, par exemple).', 'https://ovh.com', 7
from espaces where slug = 'vivier-ia';

-- Seed : glossaire technique, definitions factuelles courtes ecrites pour
-- ce cours, pas tirees d'un fichier existant mais verifiables.

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'Agent (agentic coding)', 'Un programme IA (comme Claude Code) qui ne se contente pas de repondre, il execute des actions reelles : lire des fichiers, ecrire du code, lancer des commandes, tester le resultat.', 1
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'Prompt', 'Une instruction donnee a un agent IA en langage naturel. Sa qualite determine directement la qualite du resultat.', 2
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'Repository (depot)', 'Le dossier d''un projet suivi par Git, avec tout son historique de versions.', 3
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'Deploiement', 'L''operation qui rend un projet accessible en ligne, sur un vrai site web plutot que seulement sur ta machine.', 4
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'CLAUDE.md', 'Un fichier a la racine d''un projet qui donne a Claude Code le contexte permanent : qui tu es, les regles a suivre, les zones sensibles.', 5
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'Slash Command', 'Une commande personnalisee (du type /nom) qui declenche une suite d''actions predefinies dans Claude Code.', 6
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'Skill', 'Un savoir-faire reutilisable qu''on enseigne une fois a Claude Code, pour qu''il l''applique automatiquement a chaque fois que la situation se represente.', 7
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'MCP', 'Un protocole qui permet a Claude Code de se connecter a des services externes (Notion, Google Drive, n8n...) et d''agir dessus directement.', 8
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'API', 'Le point d''entree par lequel deux logiciels communiquent entre eux, par exemple ton application et un service de paiement.', 9
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'Webhook', 'Une notification automatique qu''un service envoie a un autre des qu''un evenement se produit (un paiement recu, par exemple).', 10
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'RLS (Row Level Security)', 'Une regle posee directement dans la base de donnees qui determine quelles lignes chaque utilisateur a le droit de lire ou modifier.', 11
from espaces where slug = 'vivier-ia';

insert into glossaire (espace_id, terme, definition, ordre)
select id, 'Migration', 'Un fichier qui decrit un changement precis de la structure de la base de donnees, applique une seule fois et garde comme historique.', 12
from espaces where slug = 'vivier-ia';
