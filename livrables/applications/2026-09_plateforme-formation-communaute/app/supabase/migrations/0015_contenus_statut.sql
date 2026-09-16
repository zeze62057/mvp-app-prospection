-- Statut de publication pour les articles (voir migration 0014). Les
-- articles sont maintenant rediges en brouillon par un skill (veille actu
-- IA, voir .claude/skills/contenu-vivier-ia/) et valides manuellement par
-- Zeze dans /admin avant de devenir visibles aux membres (decision du
-- 2026-09-16 : jamais de publication automatique).

alter table contenus add column if not exists statut text not null default 'brouillon'
  check (statut in ('brouillon', 'publie'));

-- La policy de lecture existante (migration 0014) ne filtre pas par
-- statut : on la resserre ici pour que les membres ne voient jamais un
-- brouillon, seul le service_role (admin) y a acces en brouillon.
drop policy if exists "membre approuve lit le contenu de son espace" on contenus;
create policy "membre approuve lit le contenu publie de son espace"
  on contenus for select
  to authenticated
  using (statut = 'publie' and public.a_acces_zone(auth.uid(), espace_id, 'gratuite'));
