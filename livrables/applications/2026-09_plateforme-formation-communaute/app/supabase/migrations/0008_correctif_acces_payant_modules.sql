-- Correctif de securite : modules, sections, progression et temoignages
-- verifiaient l'acces 'gratuite' (simple adhesion approuvee a la communaute
-- gratuite) au lieu de 'payante'. Consequence reelle : n'importe quel
-- membre approuve dans la communaute gratuite pouvait lire les 5 modules
-- complets et marquer sa progression sans jamais payer, alors que
-- CADRAGE.md section 5 place explicitement la consultation des modules
-- du cote de l'acces payant, avant la communaute payante.

drop policy if exists "membre approuve lit les modules de son espace" on modules;
create policy "membre payant lit les modules de son espace"
  on modules for select
  using (public.a_acces_zone(auth.uid(), espace_id, 'payante'));

drop policy if exists "membre approuve lit les sections de son espace" on sections;
create policy "membre payant lit les sections de son espace"
  on sections for select
  using (
    exists (
      select 1 from modules m
      where m.id = sections.module_id
        and public.a_acces_zone(auth.uid(), m.espace_id, 'payante')
    )
  );

drop policy if exists "un membre marque sa propre progression" on progression;
create policy "un membre payant marque sa propre progression"
  on progression for insert
  with check (
    profil_id = auth.uid()
    and exists (
      select 1 from sections s
      join modules m on m.id = s.module_id
      where s.id = progression.section_id
        and public.a_acces_zone(auth.uid(), m.espace_id, 'payante')
    )
  );

drop policy if exists "un membre envoie son propre temoignage" on temoignages;
create policy "un membre payant envoie son propre temoignage" on temoignages for insert
  with check (
    profil_id = auth.uid()
    and public.a_acces_zone(auth.uid(), espace_id, 'payante')
  );
