-- Bibliotheque de prompts lisible aussi par les eleves payants (decision du 2026-09-24).
--
-- Jusqu'ici (0010) : lecture reservee aux membres approuves de la communaute gratuite (haut de
-- tunnel). Un eleve qui a un acces payant sans avoir jamais demande l'adhesion gratuite (acces
-- accorde a la main, paiement direct) ne voyait pas la bibliotheque. Il peut desormais la lire.
--
-- est_membre_espace (0030) = adhesion gratuite approuvee OU acces payant actif. Aucun droit
-- d'ecriture n'est ajoute, et un utilisateur sans acces, comme anon, ne voit toujours rien.

drop policy if exists "membre approuve lit les prompts de son espace" on prompts;

create policy "membre gratuit ou payant lit les prompts de son espace"
  on prompts for select
  to authenticated
  using (public.est_membre_espace(auth.uid(), espace_id));
