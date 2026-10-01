-- Verification de la regle d'acces aux prompts (migration 0051).
-- A coller dans l'editeur SQL de Supabase APRES la migration 0051, puis cliquer sur Run.
--
-- TOUT EST ANNULE A LA FIN : le script cree de faux comptes et de faux prompts, les teste, puis se termine volontairement
-- par une erreur qui annule tout. Une ERREUR ROUGE EST DONC NORMALE : elle contient le resultat.
--   - le message commence par « TOUT PASSE » : la regle fonctionne ;
--   - le message commence par « ECHEC » : lire la liste qui suit, et NE PAS appliquer la migration 0052.
-- Rien ne reste dans la base : ni compte, ni adhesion, ni prompt.

do $verif$
declare
  v_espace uuid;
  u_gratuit uuid := gen_random_uuid();
  u_payant uuid := gen_random_uuid();
  u_aucun uuid := gen_random_uuid();
  total_gratuits int; total_payants int; total_tous int;
  g_total int; g_payants int; g_test_g int; g_test_p int;
  p_total int; p_test_g int; p_test_p int;
  a_total int; anon_total int;
  cat_refusee boolean := false; acces_refuse boolean := false;
  echecs text[] := '{}';
  rapport text;
begin
  select id into v_espace from public.espaces where slug = 'vivier-ia';
  if v_espace is null then raise exception 'ECHEC : l''espace vivier-ia est introuvable'; end if;

  -- Faux comptes (le declencheur d'inscription cree leur profil) et leurs acces.
  insert into auth.users (id, email, aud, role, instance_id) values
    (u_gratuit, 'verif-gratuit@test.invalid', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
    (u_payant,  'verif-payant@test.invalid',  'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
    (u_aucun,   'verif-aucun@test.invalid',   'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000');
  insert into public.adhesions (profil_id, espace_id, statut) values (u_gratuit, v_espace, 'approuve');
  insert into public.acces_payant (profil_id, espace_id, actif) values (u_payant, v_espace, true);

  -- Un prompt de chaque niveau, pour tester sans dependre du contenu de la migration 0052.
  insert into public.prompts (espace_id, categorie, acces, titre, contenu, ordre) values
    (v_espace, 'design_maquettes', 'gratuite', 'VERIF gratuit', 'x', 999),
    (v_espace, 'codex_migration',  'payante',  'VERIF payant',  'x', 999);

  -- Ce que la base contient reellement (lu avec les droits d'administrateur, la regle d'acces ne s'applique pas).
  select count(*) filter (where acces = 'gratuite'), count(*) filter (where acces = 'payante'), count(*)
    into total_gratuits, total_payants, total_tous
    from public.prompts where espace_id = v_espace;

  -- 1. Membre GRATUIT : doit voir tous les prompts gratuits, aucun prompt payant.
  perform set_config('request.jwt.claims', json_build_object('sub', u_gratuit, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*), count(*) filter (where acces = 'payante'),
         count(*) filter (where titre = 'VERIF gratuit'), count(*) filter (where titre = 'VERIF payant')
    into g_total, g_payants, g_test_g, g_test_p
    from public.prompts where espace_id = v_espace;
  reset role;

  -- 2. Eleve PAYANT : doit tout voir.
  perform set_config('request.jwt.claims', json_build_object('sub', u_payant, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*), count(*) filter (where titre = 'VERIF gratuit'), count(*) filter (where titre = 'VERIF payant')
    into p_total, p_test_g, p_test_p
    from public.prompts where espace_id = v_espace;
  reset role;

  -- 3. Compte SANS acces : ne doit rien voir.
  perform set_config('request.jwt.claims', json_build_object('sub', u_aucun, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into a_total from public.prompts where espace_id = v_espace;
  reset role;

  -- 4. Visiteur non connecte : ne doit rien voir (un refus d'acces compte comme « rien vu »).
  begin
    set local role anon;
    select count(*) into anon_total from public.prompts where espace_id = v_espace;
  exception when others then
    anon_total := 0;
  end;
  reset role;

  -- 5. La base refuse une categorie inconnue et un niveau d'acces inconnu.
  begin
    insert into public.prompts (espace_id, categorie, acces, titre, contenu, ordre) values (v_espace, 'categorie_inconnue', 'gratuite', 'VERIF c', 'x', 1);
  exception when check_violation then cat_refusee := true; end;
  begin
    insert into public.prompts (espace_id, categorie, acces, titre, contenu, ordre) values (v_espace, 'codex_migration', 'secret', 'VERIF a', 'x', 1);
  exception when check_violation then acces_refuse := true; end;

  -- Resultats
  if g_test_g <> 1 then echecs := array_append(echecs, 'le membre gratuit ne voit pas un prompt gratuit'); end if;
  if g_test_p <> 0 or g_payants <> 0 then echecs := array_append(echecs, 'le membre gratuit VOIT des prompts payants'); end if;
  if g_total <> total_gratuits then echecs := array_append(echecs, format('le membre gratuit voit %s prompts au lieu de %s', g_total, total_gratuits)); end if;
  if p_test_g <> 1 or p_test_p <> 1 then echecs := array_append(echecs, 'l''eleve payant ne voit pas tous les niveaux'); end if;
  if p_total <> total_tous then echecs := array_append(echecs, format('l''eleve payant voit %s prompts au lieu de %s', p_total, total_tous)); end if;
  if a_total <> 0 then echecs := array_append(echecs, 'un compte sans acces voit des prompts'); end if;
  if anon_total <> 0 then echecs := array_append(echecs, 'un visiteur non connecte voit des prompts'); end if;
  if not cat_refusee then echecs := array_append(echecs, 'une categorie inconnue est acceptee'); end if;
  if not acces_refuse then echecs := array_append(echecs, 'un niveau d''acces inconnu est accepte'); end if;

  rapport := format('en base : %s gratuits + %s payants (dont 1 de chaque pour le test) | gratuit voit %s, payant voit %s, sans acces voit %s, visiteur voit %s',
                    total_gratuits, total_payants, g_total, p_total, a_total, anon_total);

  -- Erreur volontaire : elle annule TOUT ce que ce script a cree.
  raise exception '%', case when cardinality(echecs) = 0
    then 'TOUT PASSE (tout est annule) : ' || rapport
    else 'ECHEC : ' || array_to_string(echecs, ' ; ') || ' | ' || rapport end;
end
$verif$;
