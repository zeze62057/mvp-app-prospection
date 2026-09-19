-- Bibliotheque de prompts (voir maquette/Prompts.dc.html, ecran deja
-- valide). Contenu reserve a la communaute gratuite (haut de tunnel,
-- voir CADRAGE.md section 2), donc acces 'gratuite' comme le reste de la
-- communaute gratuite, pas 'payante' comme les modules de formation.
-- Categories alignees sur les filtres deja dessines dans la maquette :
-- Fondations, Methode, Quotidien, Business.

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  categorie text not null check (categorie in ('fondations', 'methode', 'quotidien', 'business')),
  titre text not null,
  contenu text not null,
  ordre integer not null default 0
);

alter table prompts enable row level security;

create policy "membre approuve lit les prompts de son espace"
  on prompts for select
  to authenticated
  using (public.a_acces_zone(auth.uid(), espace_id, 'gratuite'));

-- Seed : prompts reels tires des fiches pratiques du Module 1 (voir
-- livrables/vivier-ia/cours/ecosysteme-ia/2026-09_vivier-ia-module-1/),
-- jamais inventes. Selection volontairement resserree a une base pour
-- debutant, pas la bibliotheque complete du cours.

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'fondations', 'Premier projet avec Claude Code',
  'Crée un dossier vide nommé "mon-premier-projet", initialise Claude Code dedans, et demande-lui de créer un fichier README.md qui explique ce que fait ce dossier.',
  1
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'methode', 'Instruction complète (gabarit 4 éléments)',
  'Contexte : [ton projet]. Objectif : [ce qui doit être vrai à la fin]. Périmètre : [ce qui ne doit pas changer]. Autonomie : [ce que l''agent peut décider seul].',
  1
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'methode', 'Demander un plan avant de coder',
  'Avant de coder, propose-moi un plan pour [ta tâche]. Contexte : [projet, fichiers concernés, état actuel]. Objectif : [ce qui doit être vrai une fois terminé]. Ne code rien pour l''instant, donne-moi juste les étapes que tu comptes suivre.',
  2
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'methode', 'Valider un travail annoncé "terminé"',
  'Montre-moi la liste des fichiers modifiés ou créés. Ensuite, teste réellement le résultat (ouvre-le dans le navigateur, remplis un formulaire avec des données de test...) et confirme-moi que ça fonctionne, ne suppose jamais que "c''est fait" veut dire "c''est bon".',
  3
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'quotidien', 'Démarrer un second brain pour une activité',
  'Je veux mettre en place un second brain pour mon activité de [ton activité], sur le même principe que ce workspace : un fichier CLAUDE.md qui explique qui je suis et comment tu dois m''aider, un context/CONTEXT.md avec mes objectifs et mes projets en cours, et un context/HISTORY.md pour tracer les décisions importantes. Pose-moi les questions nécessaires pour remplir ces 3 fichiers avec mes vraies informations, ne les invente pas.',
  1
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'quotidien', 'Recharger le contexte en début de session',
  'Avant de commencer, lis CLAUDE.md, context/CONTEXT.md et context/HISTORY.md en entier. Résume-moi en quelques lignes qui je suis, où j''en suis sur mes projets actifs, et ce qui s''est passé lors de ma dernière session. Attends ensuite mes instructions, ne lance rien de toi-même.',
  2
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'quotidien', 'Suivi de facturation multi-activités',
  'Aide-moi à structurer un suivi de facturation pour mes activités. Je veux un tableau avec les colonnes : activité, client, montant, statut, date. Propose-moi la structure avant de créer le fichier, je veux valider les colonnes.',
  3
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'business', 'Traduire une opportunité en mission cadrée',
  'Contexte : [client, situation actuelle]. Objectif : [ce que l''outil doit faire concrètement]. Périmètre : [ce qui est concerné] / [ce qui reste fait à la main pour l''instant]. Autonomie : tu peux proposer la structure technique, mais je veux valider avant mise en service réelle.',
  1
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'business', 'Rédiger une proposition client personnalisée',
  'Voici le rapport ou diagnostic réalisé pour [client] (colle-le ici). J''ai choisi de proposer en pilote [le pilote choisi], pas les autres pistes identifiées pour l''instant. Rédige une proposition courte (une demi-page) à envoyer au client : le constat en une phrase, le pilote proposé avec un délai réaliste, et une ouverture claire vers une phase 2 possible, sans s''y engager dès maintenant.',
  2
from espaces where slug = 'vivier-ia';

insert into prompts (espace_id, categorie, titre, contenu, ordre)
select id, 'business', 'Tableau de suivi de KPIs',
  'Crée un tableau de suivi pour mon activité avec les indicateurs suivants : [tes indicateurs, ex. prospects contactés, rendez-vous obtenus, propositions envoyées, clients signés]. Le tableau doit pouvoir être mis à jour facilement au fil des semaines, avec une ligne par semaine plutôt qu''un seul total qui écrase l''historique.',
  3
from espaces where slug = 'vivier-ia';
