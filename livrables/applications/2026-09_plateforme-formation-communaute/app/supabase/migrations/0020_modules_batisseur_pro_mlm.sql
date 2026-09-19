-- Programme marketing de reseau complet pour Batisseur Pro (decision de
-- Zeze le 2026-09-17) : Module 1 (IA appliquee au marketing de reseau,
-- voir 0019) reste en premier, les 8 parties du programme marketing de
-- reseau (skill programme-marketing-reseau) arrivent en Modules 2 a 9.
-- Comme pour les migrations precedentes, seuls les titres sont stockes
-- en base ; le contenu reel est livre par video, enregistree ensuite
-- par Zeze via l'outil admin.

insert into modules (espace_id, ordre, titre)
select id, 2, 'Module 2 — Creer les bases du succes en marketing de reseau' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 3, 'Module 3 — Developper une equipe incroyable' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 4, 'Module 4 — Passer de la theorie a la pratique' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 5, 'Module 5 — Leadership pratique en MLM' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 6, 'Module 6 — Savoir guider et faire grandir ses equipes' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 7, 'Module 7 — Communication de leader' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 8, 'Module 8 — Leadership & croissance' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 9, 'Module 9 — Leadership de haut niveau' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

-- Module 2 — Partie I (13 chapitres)
insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'Identifier son Pourquoi'),
  (2, 'Comprendre l''industrie du MLM'),
  (3, 'Developper l''etat d''esprit du succes'),
  (4, 'Adopter l''attitude d''un leader'),
  (5, 'Creer une liste de noms renouvelee a l''infini'),
  (6, 'Parrainez efficacement'),
  (7, 'Comprendre l''importance de l''edification en MLM'),
  (8, 'Creer un puissant dossier de demarrage'),
  (9, 'Savoir utiliser les SMS et les messageries'),
  (10, 'Atelier Live : maitriser l''art du closing'),
  (11, 'Maitriser l''art de l''invitation'),
  (12, 'Savoir presenter son produit et son opportunite'),
  (13, 'Maitriser le suivi, le follow-up')
) as s(ordre, titre) on true
where m.ordre = 2
on conflict (module_id, ordre) do nothing;

-- Module 3 — Partie II (11 chapitres)
insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'Eradiquer la procrastination'),
  (2, 'Elaborer un plan journalier de developpement efficace'),
  (3, 'Rester en phase 1'),
  (4, 'Comment coacher efficacement ses equipes'),
  (5, 'La clef est dans le taprooting'),
  (6, 'Les clefs d''un home meeting reussi'),
  (7, 'Savoir utiliser efficacement les reseaux sociaux'),
  (8, 'Travailler et obtenir des resultats avec le marche froid'),
  (9, 'Partir a la conquete d''une ville'),
  (10, 'Passage a l''action : atelier d''appel geant en Live'),
  (11, 'Savoir promouvoir les evenements')
) as s(ordre, titre) on true
where m.ordre = 3
on conflict (module_id, ordre) do nothing;

-- Module 4 — Partie III (6 chapitres)
insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'Journee terrain : communication et street marketing'),
  (2, 'Mise en pratique des scripts de prospection'),
  (3, 'Travail en binome : approche, pitch, objections'),
  (4, 'Challenge terrain : objectif rendez-vous ou contacts'),
  (5, 'Debriefings et feedbacks collectifs'),
  (6, 'Celebration et ancrage des victoires')
) as s(ordre, titre) on true
where m.ordre = 4
on conflict (module_id, ordre) do nothing;

-- Module 5 — Partie IV (4 chapitres)
insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'Comprendre son role de leader'),
  (2, 'La difference entre un parrain et un leader'),
  (3, 'Le vrai role du leadership en marketing de reseau'),
  (4, 'Pourquoi les gens te suivent (et quand ils arretent de le faire)')
) as s(ordre, titre) on true
where m.ordre = 5
on conflict (module_id, ordre) do nothing;

-- Module 6 — Partie V (4 chapitres)
insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'Creer un systeme de duplication simple et clair'),
  (2, 'Identifier et developper ses batisseurs'),
  (3, 'Animer des reunions d''equipe puissantes (Zoom, live, presentiel)'),
  (4, 'Donner du feedback sans casser la motivation')
) as s(ordre, titre) on true
where m.ordre = 6
on conflict (module_id, ordre) do nothing;

-- Module 7 — Partie VI (4 chapitres)
insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'L''art de parler avec impact (storytelling, voix, posture)'),
  (2, 'Creer une vision claire que l''equipe peut suivre'),
  (3, 'Savoir motiver sans manipuler'),
  (4, 'Gerer les conflits et les personnalites difficiles dans l''equipe')
) as s(ordre, titre) on true
where m.ordre = 7
on conflict (module_id, ordre) do nothing;

-- Module 8 — Partie VII (4 chapitres)
insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'Savoir deleguer sans perdre le controle'),
  (2, 'Detecter les futurs leaders et les former efficacement'),
  (3, 'Creer une culture d''equipe forte et engagee'),
  (4, 'Gerer l''energie, pas juste le temps : rester aligne sur la duree')
) as s(ordre, titre) on true
where m.ordre = 8
on conflict (module_id, ordre) do nothing;

-- Module 9 — Partie VIII (4 chapitres)
insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'Elever ton identite de leader au service d''une mission'),
  (2, 'Devenir une reference dans ton reseau'),
  (3, 'Passer du management d''equipe a la vision d''organisation'),
  (4, 'Batir un heritage, pas juste un bonus')
) as s(ordre, titre) on true
where m.ordre = 9
on conflict (module_id, ordre) do nothing;
