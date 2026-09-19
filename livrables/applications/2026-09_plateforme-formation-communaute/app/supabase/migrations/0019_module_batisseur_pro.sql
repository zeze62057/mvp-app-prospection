-- Premier module de cours pour Batisseur Pro (voir CADRAGE.md, decision de
-- Zeze le 2026-09-16 : structure de l'espace creee en 0018, contenu de
-- cours ajoute separement). Titres repris du module croise deja redige
-- livrables/formations/marketing-reseau/2026-09_vivier-ia-module-ia-marketing-reseau/
-- (4 chapitres). Comme pour Vivier IA (0005_progression.sql), seuls les
-- titres sont stockes en base : le contenu reel est livre par video,
-- enregistree ensuite par Zeze via l'outil admin.

insert into modules (espace_id, ordre, titre)
select id, 1, 'Module 1 — IA appliquee au marketing de reseau' from espaces where slug = 'batisseur-pro'
on conflict (espace_id, ordre) do nothing;

insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'batisseur-pro'
join (values
  (1, 'Pourquoi croiser IA et marketing de reseau'),
  (2, 'L''IA pour prospecter, parrainer et closer'),
  (3, 'L''IA pour coacher et faire grandir son equipe'),
  (4, 'L''IA pour la communication de leader')
) as s(ordre, titre) on true
where m.ordre = 1
on conflict (module_id, ordre) do nothing;
