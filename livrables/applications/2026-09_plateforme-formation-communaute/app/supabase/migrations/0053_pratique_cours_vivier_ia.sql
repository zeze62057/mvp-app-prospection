-- Blocs « À faire maintenant » dans les chapitres de Vivier IA : prompts et commandes à copier.
-- GENERE par scripts/generer-pratique-cours.mjs depuis supabase/contenu/pratique/ : ne pas modifier à la main.
--
-- Ajoute du contenu à la fin de chaque chapitre concerné, sans rien retirer. Idempotent : un bloc déjà présent
-- n'est pas ajouté une seconde fois, et rien ne change si le repère de chapitre est absent ou ambigu.
-- Les blocs de code sont affichés en cartes avec bouton Copier par la page de leçon.

-- Section d3ce0bca-6dff-4d41-9f93-91211b948abc, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : installer et lancer Claude Code

Fais ces étapes dans l'ordre. Chaque carte se copie en un clic.

**Étape 1.** Vérifie que Node.js est installé (version 18 ou plus récente) :

```bash
node --version
```

Tu dois voir un numéro de version, par exemple `v20.11.0`. Si le terminal ne reconnaît pas la commande, installe la version LTS sur nodejs.org, puis ferme et rouvre le terminal.

**Étape 2.** Installe Claude Code :

```bash
npm install -g @anthropic-ai/claude-code
```

**Étape 3.** Place-toi dans le dossier de ton projet, puis lance Claude Code :

```bash
cd mon-projet
claude
```

Remplace `mon-projet` par le nom de ton dossier. À la première utilisation, suis la connexion affichée à l'écran.

**Étape 4.** Fais ton premier test. Colle ce prompt dans Claude Code :

```prompt
Explique-moi en 5 phrases simples ce que tu peux faire dans ce dossier. Ne modifie rien et ne supprime rien.
```

Tu dois obtenir une réponse en français, sans aucun fichier modifié.

**Si l'installation a été coupée** (erreur du type « binaire natif non installé »), repars propre :

```bash
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code
```

**Si Windows bloque l'exécution des scripts** (erreur PowerShell « l'exécution de scripts est désactivée »), regarde d'abord la politique actuelle :

```powershell
Get-ExecutionPolicy -List
```

Puis autorise les scripts locaux pour ton compte seulement :

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```$b$;
  v_repere text := $r$### À faire maintenant : installer et lancer Claude Code$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'd3ce0bca-6dff-4d41-9f93-91211b948abc';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section d3ce0bca-6dff-4d41-9f93-91211b948abc, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'd3ce0bca-6dff-4d41-9f93-91211b948abc';
end
$m$;

-- Section d3ce0bca-6dff-4d41-9f93-91211b948abc, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : ouvrir ton espace de travail

Ouvre VS Code dans le dossier de ton projet. Depuis le terminal, dans ce dossier :

```bash
code .
```

Si la commande `code` n'est pas reconnue, ouvre VS Code, puis choisis « Fichier », « Ouvrir le dossier ».

Ouvre ensuite le terminal intégré (menu Terminal, puis « New Terminal »), lance `claude`, et colle ce prompt :

```prompt
Liste les fichiers et les dossiers de ce projet. Pour chacun, explique en une phrase à quoi il sert. Ne modifie rien.
```

Tu vois la réponse dans le terminal. Ouvre ensuite dans l'éditeur un des fichiers cités pour vérifier ce que Claude a dit.$b$;
  v_repere text := $r$### À faire maintenant : ouvrir ton espace de travail$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'd3ce0bca-6dff-4d41-9f93-91211b948abc';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section d3ce0bca-6dff-4d41-9f93-91211b948abc, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'd3ce0bca-6dff-4d41-9f93-91211b948abc';
end
$m$;

-- Section d3ce0bca-6dff-4d41-9f93-91211b948abc, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : mettre Git en route

**Une seule fois**, juste après l'installation de Git. Remplace par ton nom et ton email :

```bash
git --version
git config --global user.name "Ton Nom"
git config --global user.email "ton.email@exemple.com"
```

**Pour chaque nouveau projet**, dans le dossier du projet :

```bash
git init
git add .
git commit -m "Premier commit"
```

**Pour envoyer sur GitHub**, après avoir créé un dépôt vide sur github.com. Remplace l'adresse par celle de ton dépôt :

```bash
git branch -M main
git remote add origin https://github.com/ton-compte/ton-depot.git
git push -u origin main
```

GitHub demande un jeton d'accès personnel à la place du mot de passe. Ne le colle jamais dans un prompt ni dans un fichier du projet.

**Avant le premier commit**, demande à Claude Code de vérifier les secrets :

```prompt
Avant tout commit, vérifie qu'aucun fichier secret (.env, clés d'API, mots de passe) n'est dans ce projet. Si .env existe, ajoute-le au fichier .gitignore. Puis propose-moi un plan de commit avec un message clair qui explique le pourquoi. Attends ma validation avant de committer. Ne fais aucun push.
```

Tu dois recevoir un plan à valider, et rien n'est commité tant que tu n'as pas répondu.$b$;
  v_repere text := $r$### À faire maintenant : mettre Git en route$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'd3ce0bca-6dff-4d41-9f93-91211b948abc';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section d3ce0bca-6dff-4d41-9f93-91211b948abc, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'd3ce0bca-6dff-4d41-9f93-91211b948abc';
end
$m$;

-- Section d3ce0bca-6dff-4d41-9f93-91211b948abc, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : préparer la mise en ligne

Avant de déployer, vérifie que le projet se construit sans erreur sur ta machine :

```bash
npm run build
```

Si la commande affiche une erreur, copie le message **en entier** et utilise le prompt de debug du chapitre 4 de la section « La Méthode ».

Puis demande à Claude Code de préparer le déploiement :

```prompt
Prépare ce projet pour un déploiement sur Vercel. Vérifie que le build fonctionne. Liste les variables d'environnement à renseigner dans Vercel, sans écrire aucune valeur secrète. Dis-moi ce qu'il faut cliquer dans Vercel, étape par étape. Ne déploie rien toi-même.
```

Dans Vercel : « Add New Project », choisis ton dépôt GitHub, valide la configuration proposée. Chaque `git push` sur la branche principale redéploie ensuite le site.$b$;
  v_repere text := $r$### À faire maintenant : préparer la mise en ligne$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'd3ce0bca-6dff-4d41-9f93-91211b948abc';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section d3ce0bca-6dff-4d41-9f93-91211b948abc, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'd3ce0bca-6dff-4d41-9f93-91211b948abc';
end
$m$;

-- Section db8298cf-58a8-4f42-8320-c502e4a72948, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : choisir entre prototype et livrable

Avant de commencer un projet, colle ce prompt. Remplace ce qui est entre crochets :

```prompt
Je veux construire : [décris ton projet en une ou deux phrases].
Dis-moi d'abord si c'est un prototype jetable ou un livrable pour un vrai usage. Pose-moi les questions qui te manquent pour trancher. Ensuite, propose la façon de travailler adaptée : vite et à l'instinct pour un prototype, avec un plan et des vérifications pour un livrable. N'écris aucun code pour l'instant.
```

Tu dois recevoir des questions, puis une méthode adaptée. Réponds, puis valide avant qu'il commence.$b$;
  v_repere text := $r$### À faire maintenant : choisir entre prototype et livrable$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'db8298cf-58a8-4f42-8320-c502e4a72948';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section db8298cf-58a8-4f42-8320-c502e4a72948, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'db8298cf-58a8-4f42-8320-c502e4a72948';
end
$m$;

-- Section db8298cf-58a8-4f42-8320-c502e4a72948, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire une instruction complète

Copie ce modèle, puis remplace chaque ligne entre crochets. Il contient les quatre éléments du chapitre.

```prompt
Contexte : je travaille sur [nom du projet], pour [qui], avec ces contraintes : [contraintes].
Objectif : à la fin, ceci doit être vrai : [résultat précis et vérifiable].
Périmètre : tu peux modifier [fichiers ou zones concernés]. Ne touche pas à [ce qui doit rester intact].
Autonomie : propose-moi ton plan et attends mon accord avant d'agir sur [point sensible].
```

Tu dois obtenir un plan qui respecte ton périmètre. Si la réponse sort du cadre, ajoute la règle manquante et relance.$b$;
  v_repere text := $r$### À faire maintenant : écrire une instruction complète$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'db8298cf-58a8-4f42-8320-c502e4a72948';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section db8298cf-58a8-4f42-8320-c502e4a72948, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'db8298cf-58a8-4f42-8320-c502e4a72948';
end
$m$;

-- Section db8298cf-58a8-4f42-8320-c502e4a72948, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : appliquer Plan, Execute, Validate

Utilise ces trois prompts, dans l'ordre, pour toute tâche.

**1. Plan.** Avant d'agir :

```prompt
Tâche : [décris la tâche].
Avant de modifier quoi que ce soit, propose-moi un plan en étapes courtes, lisible sans connaissance technique. Dis ce que tu vas toucher et ce que tu ne vas pas toucher. Attends mon accord.
```

**2. Execute.** Après avoir validé le plan :

```prompt
Le plan est validé. Exécute l'étape 1 seulement, puis arrête-toi et dis-moi ce que tu as fait.
```

**3. Validate.** À la fin :

```prompt
Vérifie que le résultat correspond à l'objectif de départ. Teste réellement (ouvre, lance, essaie) au lieu de relire le code. Dis-moi ce qui marche, ce qui ne marche pas, et ce que tu n'as pas pu vérifier.
```

Tu dois recevoir un compte rendu honnête, avec ce qui n'a pas pu être vérifié.$b$;
  v_repere text := $r$### À faire maintenant : appliquer Plan, Execute, Validate$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'db8298cf-58a8-4f42-8320-c502e4a72948';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section db8298cf-58a8-4f42-8320-c502e4a72948, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'db8298cf-58a8-4f42-8320-c502e4a72948';
end
$m$;

-- Section db8298cf-58a8-4f42-8320-c502e4a72948, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : diagnostiquer une erreur

Quand quelque chose casse, colle le message **en entier**. Remplace la zone entre crochets :

```prompt
Voici le message d'erreur complet :
[colle ici tout le message, sans le résumer]

Ne corrige pas encore. D'abord : 1) explique la cause en termes simples, 2) dis si l'erreur arrive partout ou seulement dans un cas précis, 3) propose une correction et dis ce qu'elle change. Attends mon accord avant de modifier quoi que ce soit.
```

Tu dois recevoir un diagnostic avant toute correction. Valide, puis demande la correction.$b$;
  v_repere text := $r$### À faire maintenant : diagnostiquer une erreur$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'db8298cf-58a8-4f42-8320-c502e4a72948';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section db8298cf-58a8-4f42-8320-c502e4a72948, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'db8298cf-58a8-4f42-8320-c502e4a72948';
end
$m$;

-- Section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : régler comment Claude te demande l'autorisation

Colle ce prompt au début d'une session :

```prompt
Pour lire un fichier ou chercher dans le projet, avance sans me demander. Avant toute action qui modifie, supprime ou envoie quelque chose, explique ce que tu vas faire, ce qui change, et si on peut revenir en arrière. Attends mon accord.
```

Tu dois voir Claude te demander une validation avant chaque action sensible. Lis la proposition avant de répondre.$b$;
  v_repere text := $r$### À faire maintenant : régler comment Claude te demande l'autorisation$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
end
$m$;

-- Section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : créer le CLAUDE.md de ton projet

Demande à Claude Code de le préparer avec toi :

```prompt
Crée un fichier CLAUDE.md à la racine de ce projet. Avant de l'écrire, pose-moi les questions dont tu as besoin : qui je suis, l'objectif du projet, les conventions à suivre, les zones sensibles à ne jamais modifier sans mon accord, et la structure des dossiers. Montre-moi le contenu avant de l'enregistrer.
```

Ou copie ce modèle dans un fichier nommé `CLAUDE.md`, puis remplis-le :

```markdown
# Mon projet

## Qui je suis
[ton rôle, ton activité]

## Objectif du projet
[ce que le projet doit permettre]

## Comment travailler avec moi
- Réponds en français, avec des phrases courtes.
- Propose un plan avant d'agir et attends mon accord.

## Zones sensibles
- Ne modifie jamais le fichier .env.
- [autre zone à protéger]

## Structure
- [dossier] : [ce qu'il contient]
```

Tu dois retrouver ces règles appliquées dès la prochaine session. Relance `claude` et pose une question pour le vérifier.$b$;
  v_repere text := $r$### À faire maintenant : créer le CLAUDE.md de ton projet$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
end
$m$;

-- Section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : créer un Slash Command et un Skill

**Un Slash Command.** Crée le dossier, puis le fichier :

```bash
mkdir -p .claude/commands
```

Sous PowerShell, utilise plutôt :

```powershell
New-Item -ItemType Directory -Force .claude/commands
```

Crée le fichier `.claude/commands/point-du-matin.md` avec ce contenu :

```markdown
Fais le point de contexte de la session :
1. Lis CLAUDE.md.
2. Résume en 5 lignes l'état du projet et la prochaine étape.
3. Liste ce qui est en cours et ce qui bloque.
Ne modifie aucun fichier.
```

Lance ensuite `/point-du-matin` dans Claude Code. Tu dois recevoir le résumé en 5 lignes.

**Un Skill.** Crée le dossier `.claude/skills/mon-skill/` et, dedans, un fichier `SKILL.md` :

```markdown
---
name: mon-skill
description: Dis ici, en une phrase claire, quand ce skill doit être utilisé.
---

# Mon skill

Explique la méthode : les étapes, les règles, les pièges à éviter.
```

La `description` est ce qui permet à Claude de savoir quand utiliser le skill. Écris-la avec soin.$b$;
  v_repere text := $r$### À faire maintenant : créer un Slash Command et un Skill$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
end
$m$;

-- Section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : connecter un serveur MCP

Crée un fichier `.mcp.json` à la racine du projet avec ce contenu :

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Relance Claude Code dans ce dossier. Il demande l'autorisation de se connecter : accepte. Vérifie ensuite la connexion :

```bash
claude mcp list
```

Puis colle ce prompt :

```prompt
Liste les serveurs MCP connectés et les outils qu'ils offrent. N'exécute rien, dis-moi seulement ce qui est disponible.
```

Tu dois voir le serveur dans la liste. Si la connexion échoue par timeout, vérifie que `npx` est accessible depuis le terminal.$b$;
  v_repere text := $r$### À faire maintenant : connecter un serveur MCP$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
end
$m$;

-- Section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : poser ton premier hook

Demande à Claude Code de le configurer. C'est le chemin le plus fiable :

```prompt
Configure un hook PreToolUse dans .claude/settings.json qui bloque toute modification du fichier .env. Montre-moi la configuration complète avant de l'écrire. Après l'avoir écrite, teste-la en essayant de modifier .env, et dis-moi si le blocage a fonctionné.
```

Tu dois voir une tentative de modification refusée. Si rien n'est bloqué, redemande en collant le message obtenu.$b$;
  v_repere text := $r$### À faire maintenant : poser ton premier hook$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
end
$m$;

-- Section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 6
do $m$
declare
  v_bloc text := $b$### À faire maintenant : poser une arborescence propre

```prompt
Propose une arborescence pour ce projet. Elle doit séparer clairement : le code, la documentation, la configuration, et les livrables finis. Montre-la sous forme d'arbre, avec une phrase par dossier. Attends ma validation avant de déplacer ou de renommer le moindre fichier.
```

Tu dois recevoir un arbre de dossiers à valider. Corrige-le avant de dire oui.$b$;
  v_repere text := $r$### À faire maintenant : poser une arborescence propre$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 7 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 7 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 6. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
end
$m$;

-- Section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 7
do $m$
declare
  v_bloc text := $b$### À faire maintenant : garder les coûts sous contrôle

```prompt
Tâche : [décris la tâche].
Découpe-la en étapes vérifiables. Dis-moi laquelle sera la plus lourde. Traite une seule étape à la fois et arrête-toi après chacune. Ne lis et ne modifie que les fichiers réellement concernés.
```

Tu dois recevoir un découpage court. Valide-le, puis avance étape par étape.$b$;
  v_repere text := $r$### À faire maintenant : garder les coûts sous contrôle$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 8 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 8 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10a89d0b-5822-4598-a71e-4524aeca1be6, chapitre 7. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10a89d0b-5822-4598-a71e-4524aeca1be6';
end
$m$;

-- Section 8c117912-17f4-4926-8115-6422ca447552, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : monter ton second brain

```prompt
Crée mon second brain dans ce dossier avec trois fichiers : CLAUDE.md (qui je suis et comment collaborer avec moi), contexte.md (mon contexte détaillé, mes objectifs, mes projets) et journal.md (ce qui est fait et décidé, avec la date). Avant d'écrire, pose-moi les questions nécessaires, une série à la fois. Montre-moi chaque fichier avant de l'enregistrer.
```

Crée ensuite le fichier `.claude/commands/prime.md` avec ce contenu :

```markdown
Charge mon contexte pour cette session :
1. Lis CLAUDE.md, contexte.md et journal.md.
2. Résume en 5 lignes : mes objectifs, mes projets en cours, la dernière décision notée.
3. Demande-moi sur quoi je veux avancer aujourd'hui.
Ne modifie aucun fichier.
```

Au début de chaque session, tape `/prime`. Tu dois recevoir ton résumé, sans rien réexpliquer.$b$;
  v_repere text := $r$### À faire maintenant : monter ton second brain$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '8c117912-17f4-4926-8115-6422ca447552';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 8c117912-17f4-4926-8115-6422ca447552, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '8c117912-17f4-4926-8115-6422ca447552';
end
$m$;

-- Section 8c117912-17f4-4926-8115-6422ca447552, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : préparer un livrable pour un client

```prompt
Je livre [nom du projet] à [type de client]. Prépare deux documents. 1) Une documentation d'usage : ce qui a été fait, comment l'utiliser au quotidien, que faire en cas de problème. 2) Une note pour le dirigeant, sans aucun mot technique : ce que ça lui apporte, en phrases courtes, avec un exemple concret de sa journée. Montre-moi les deux avant de les enregistrer.
```

Tu dois recevoir deux textes distincts. Relis le second comme si tu étais le dirigeant.$b$;
  v_repere text := $r$### À faire maintenant : préparer un livrable pour un client$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '8c117912-17f4-4926-8115-6422ca447552';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 8c117912-17f4-4926-8115-6422ca447552, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '8c117912-17f4-4926-8115-6422ca447552';
end
$m$;

-- Section 8c117912-17f4-4926-8115-6422ca447552, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : suivre ton activité

```prompt
Crée un fichier de suivi pour mon activité. Il doit contenir : un tableau de facturation unique pour toutes mes activités, et un tableau de KPIs par semaine pour chacune (prospects contactés, rendez-vous obtenus, chiffre d'affaires). Pose-moi d'abord la liste de mes activités et les chiffres que je veux suivre. Montre-moi la structure avant de l'enregistrer.
```

Ensuite, mets à jour d'une phrase, par exemple :

```prompt
Cette semaine sur [activité] : [nombre] prospects contactés, [nombre] rendez-vous. Mets à jour la bonne ligne du fichier de suivi.
```

Tu dois voir une seule ligne modifiée, la bonne. Vérifie-la avant de continuer.$b$;
  v_repere text := $r$### À faire maintenant : suivre ton activité$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '8c117912-17f4-4926-8115-6422ca447552';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 8c117912-17f4-4926-8115-6422ca447552, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '8c117912-17f4-4926-8115-6422ca447552';
end
$m$;

-- Section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : passer du prototype à la production

Tu as une maquette faite dans un outil de prototypage. Colle ce prompt, avec une capture ou une description de ta maquette :

```prompt
J'ai validé une maquette de [nom du projet] dans un outil de prototypage. Elle ne partira pas en production : elle sert seulement de référence visuelle.
Reconstruis l'écran [nom de l'écran] avec une vraie validation des données, un vrai stockage et une sécurité réelle. Avant de coder, propose-moi un plan et liste ce que tu gardes de la maquette et ce que tu changes. Attends mon accord.
```

Tu dois recevoir un plan qui sépare l'apparence (gardée) et le fonctionnement (reconstruit).$b$;
  v_repere text := $r$### À faire maintenant : passer du prototype à la production$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
end
$m$;

-- Section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : répartir produit et automatisations

```prompt
Mon projet : [décris-le en deux phrases].
Fais deux listes. 1) Ce qui doit être construit dans le code de l'application : ce que l'utilisateur voit et utilise. 2) Ce qui doit être automatisé avec n8n : envois d'emails, notifications, synchronisations, rapports planifiés. Pour chaque ligne, explique en une phrase pourquoi elle va dans cette liste. N'écris pas de code.
```

Tu dois obtenir deux listes justifiées. Relis-les : une automatisation modifiable sans redéployer va du côté n8n.$b$;
  v_repere text := $r$### À faire maintenant : répartir produit et automatisations$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
end
$m$;

-- Section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : brancher Playwright et tester pour de vrai

Si ce n'est pas déjà fait, crée le fichier `.mcp.json` à la racine du projet :

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Relance Claude Code et accepte la connexion. Puis colle ce prompt :

```prompt
Lance l'application en local. Avec Playwright, ouvre la page [adresse locale], remplis le formulaire avec des données de test, envoie-le, puis vérifie ce qui s'affiche vraiment à l'écran. Teste aussi un cas invalide (un email mal écrit). Dis-moi ce que tu as observé, pas ce que le code laisse supposer.
```

Tu dois recevoir un compte rendu de ce qui a été observé dans le navigateur, y compris le cas invalide.$b$;
  v_repere text := $r$### À faire maintenant : brancher Playwright et tester pour de vrai$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
end
$m$;

-- Section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : construire le formulaire d'intake

Commence par le plan :

```prompt
Construis la phase 1 de mon projet : un formulaire d'intake pour [type de client].
Avant de coder : 1) propose les champs à demander, avec une phrase pour justifier chacun (pas un de plus que nécessaire), 2) décris la validation de chaque champ, 3) dis où les données seront enregistrées et ce qui se passe après l'envoi. Attends mon accord.
```

Après ton accord, passe à la construction et à la vérification :

```prompt
Construis le formulaire selon le plan validé. Puis, avec Playwright, teste-le : un envoi valide, un email invalide, un champ obligatoire vide. Dis-moi le résultat de chaque test.
```

Tu dois voir trois résultats de test : un envoi accepté et deux refus clairs.$b$;
  v_repere text := $r$### À faire maintenant : construire le formulaire d'intake$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
end
$m$;

-- Section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : construire le dashboard de suivi

```prompt
Construis la phase 2 : un dashboard qui affiche les données collectées par le formulaire. Il doit avoir : un statut par ligne, un historique des changements de statut, une recherche, un tri et un filtre par statut. Il doit rester lisible avec plusieurs centaines de lignes.
Avant de coder, propose la structure des données et la disposition de l'écran. Attends mon accord.
```

Après validation et construction, demande la vérification :

```prompt
Avec Playwright, ouvre le dashboard avec des données de test. Vérifie la recherche, le tri, le filtre et le changement de statut. Dis-moi ce qui marche et ce qui ne marche pas.
```

Tu dois recevoir une liste des fonctions vérifiées une par une.$b$;
  v_repere text := $r$### À faire maintenant : construire le dashboard de suivi$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
end
$m$;

-- Section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 6
do $m$
declare
  v_bloc text := $b$### À faire maintenant : finir la page de statut et livrer

```prompt
Construis la phase 3 : une page de statut qui permet à un client de suivre l'avancement de sa demande, sans voir les données des autres clients. Elle doit être claire et rassurante. Avant de coder, dis comment le client accède à sa page et ce qu'il peut y voir. Attends mon accord.
```

Puis, avant de livrer, lance la vérification complète :

```prompt
Fais la vérification finale de tout le parcours avec Playwright : formulaire, dashboard, page de statut. Vérifie aussi qu'aucune clé ni aucun mot de passe n'apparaît dans le code. Écris ensuite un guide d'une page qui explique au client comment utiliser sa page de statut. Dis-moi ce que tu n'as pas pu vérifier.
```

Tu dois recevoir un compte rendu complet et un guide client prêt à relire.$b$;
  v_repere text := $r$### À faire maintenant : finir la page de statut et livrer$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 7 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 7 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 10ed64cb-1b4b-41e2-8acf-be2407148a82, chapitre 6. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '10ed64cb-1b4b-41e2-8acf-be2407148a82';
end
$m$;

-- Section 7c1f1590-8ec8-44e8-8608-1bc0991d7f67, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : passer la checklist de livraison

```prompt
Je livre [nom du projet] à [client]. Passe la checklist de livraison et réponds à chaque point par « fait », « à faire » ou « non vérifié » :
1) Fonctionnement : le parcours utilisateur complet est testé en conditions réelles.
2) Sécurité : aucune clé, aucun mot de passe, aucun fichier .env dans le code ni dans l'historique Git. Les accès sont limités aux bonnes personnes.
3) Transmission : les accès du client sont configurés, la documentation d'utilisation existe, un contact est indiqué.
Ne corrige rien pour l'instant. Donne-moi seulement l'état de chaque point.
```

Tu dois recevoir un tableau honnête, avec les points non vérifiés signalés.$b$;
  v_repere text := $r$### À faire maintenant : passer la checklist de livraison$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7c1f1590-8ec8-44e8-8608-1bc0991d7f67';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7c1f1590-8ec8-44e8-8608-1bc0991d7f67, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7c1f1590-8ec8-44e8-8608-1bc0991d7f67';
end
$m$;

-- Section 7c1f1590-8ec8-44e8-8608-1bc0991d7f67, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : faire évoluer un projet livré

```prompt
Un client me demande : [décris la demande].
Avant de modifier quoi que ce soit : 1) relis CLAUDE.md et résume la structure du projet, 2) dis quelles parties du système cette demande touche (exports, calculs, écrans liés), 3) propose un plan et une estimation du risque. Attends mon accord.
```

Après la modification, garde une trace :

```prompt
Ajoute une entrée au journal du projet : la date, la demande du client, ce qui a été changé, et les fichiers touchés.
```

Tu dois recevoir une analyse d'impact avant la moindre modification.$b$;
  v_repere text := $r$### À faire maintenant : faire évoluer un projet livré$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7c1f1590-8ec8-44e8-8608-1bc0991d7f67';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7c1f1590-8ec8-44e8-8608-1bc0991d7f67, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7c1f1590-8ec8-44e8-8608-1bc0991d7f67';
end
$m$;

-- Section 7c1f1590-8ec8-44e8-8608-1bc0991d7f67, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : rendre une promesse tenable

```prompt
Voici la promesse que je veux faire à un client : « [colle ta promesse] ».
Dis-moi si elle est tenable avec une méthode Plan, Execute, Validate. Signale ce qui est risqué (garantie de résultat, délai, périmètre flou). Puis réécris-la en une version honnête que je peux tenir, avec un premier palier testable.
```

Tu dois recevoir ta promesse corrigée, avec ce qui a été retiré et pourquoi.$b$;
  v_repere text := $r$### À faire maintenant : rendre une promesse tenable$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7c1f1590-8ec8-44e8-8608-1bc0991d7f67';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7c1f1590-8ec8-44e8-8608-1bc0991d7f67, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7c1f1590-8ec8-44e8-8608-1bc0991d7f67';
end
$m$;

-- Section 7c1f1590-8ec8-44e8-8608-1bc0991d7f67, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : transformer un projet en starter

```prompt
Je veux transformer ce projet client en starter réutilisable.
1) Liste tout ce qui est propre à ce client (noms, données, textes, couleurs, clés). 2) Propose comment le généraliser sans copier aucune information confidentielle. 3) Écris un fichier STARTER.md : à quoi sert ce starter, pour quel type de besoin, et pour quels cas il n'est pas adapté. Ne modifie aucun fichier avant mon accord.
```

Tu dois recevoir une liste de ce qui est confidentiel et un plan de généralisation.$b$;
  v_repere text := $r$### À faire maintenant : transformer un projet en starter$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7c1f1590-8ec8-44e8-8608-1bc0991d7f67';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7c1f1590-8ec8-44e8-8608-1bc0991d7f67, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7c1f1590-8ec8-44e8-8608-1bc0991d7f67';
end
$m$;

-- Section a68f9b49-ad81-4daf-a867-5bca00a20489, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : créer ton premier sub-agent

Un sub-agent est un fichier dans le dossier `.claude/agents/`. Demande à Claude Code de le créer avec toi :

```prompt
Crée un sub-agent dans .claude/agents/ nommé [nom], dédié uniquement à [sa mission unique, par exemple rédiger des posts]. Écris son périmètre : ce qu'il fait, ce qu'il ne fait jamais, et ses garde-fous (ne jamais inventer une information, ne jamais dire qu'une action a réussi sans l'avoir vérifiée). Montre-moi le fichier avant de l'enregistrer.
```

Tu dois voir un fichier court et précis. Teste-le ensuite :

```prompt
Utilise le sub-agent [nom] pour [une petite tâche de test]. Dis-moi ce qu'il a fait.
```$b$;
  v_repere text := $r$### À faire maintenant : créer ton premier sub-agent$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'a68f9b49-ad81-4daf-a867-5bca00a20489';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section a68f9b49-ad81-4daf-a867-5bca00a20489, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'a68f9b49-ad81-4daf-a867-5bca00a20489';
end
$m$;

-- Section a68f9b49-ad81-4daf-a867-5bca00a20489, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : choisir l'architecture selon le besoin

```prompt
Mon projet : [décris-le]. Mon besoin d'automatisation : [décris-le].
Compare trois options : 1) Claude Code seul, 2) Claude Code connecté à des services par MCP, 3) Claude Code avec n8n. Pour chacune, dis ce qu'elle apporte et ce qu'elle complique. Recommande-en une, pour ce besoin précis, en deux phrases. Ne choisis pas n8n par défaut.
```

Tu dois recevoir une recommandation argumentée, pas un choix d'habitude.$b$;
  v_repere text := $r$### À faire maintenant : choisir l'architecture selon le besoin$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'a68f9b49-ad81-4daf-a867-5bca00a20489';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section a68f9b49-ad81-4daf-a867-5bca00a20489, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'a68f9b49-ad81-4daf-a867-5bca00a20489';
end
$m$;

-- Section a68f9b49-ad81-4daf-a867-5bca00a20489, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : installer et évaluer un plugin

Ces commandes se tapent **dans Claude Code**, pas dans le terminal.

Voir et parcourir les plugins disponibles :

```claude
/plugin
```

Ajouter la marketplace communautaire :

```claude
/plugin marketplace add anthropics/claude-plugins-community
```

Ajouter la marketplace de démonstration :

```claude
/plugin marketplace add anthropics/claude-code
```

Installer un plugin, en remplaçant les deux noms :

```claude
/plugin install nom-du-plugin@nom-de-la-marketplace
```

Avant d'installer, regarde trois choses dans l'onglet « Discover » : le coût en contexte, la date de dernière mise à jour, et la liste de ce que le plugin va installer. N'installe jamais un plugin dont tu ne connais pas la source.

Pour te faire aider à évaluer :

```prompt
Je pense installer le plugin [nom]. Aide-moi à décider : qu'ajoute-t-il (commands, agents, skills, hooks, serveurs MCP) ? Répond-il à un besoin réel de mon projet ? Quels risques prend-on en l'installant ? Ne l'installe pas, donne-moi seulement ton avis.
```$b$;
  v_repere text := $r$### À faire maintenant : installer et évaluer un plugin$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'a68f9b49-ad81-4daf-a867-5bca00a20489';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section a68f9b49-ad81-4daf-a867-5bca00a20489, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'a68f9b49-ad81-4daf-a867-5bca00a20489';
end
$m$;

-- Section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : lancer n8n sur ton ordinateur

Pour apprendre et tester, sans rien payer. Il faut Node.js, déjà installé au Module 1. Dans un terminal :

```bash
npx n8n
```

Attends que le terminal affiche une adresse, puis ouvre-la dans ton navigateur :

```text
http://localhost:5678
```

Tu dois voir l'écran de création de compte de n8n. Cette version locale sert à apprendre, pas à travailler avec de vrais clients.

Pour lire un workflow sans le construire, demande de l'aide :

```prompt
Explique-moi ce workflow n8n comme à un débutant : quel est son déclencheur, quelles transformations il fait sur la donnée, et quelle est sa sortie. Voici sa description : [décris ou colle le workflow].
```$b$;
  v_repere text := $r$### À faire maintenant : lancer n8n sur ton ordinateur$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
end
$m$;

-- Section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : bien nommer et cadrer tes credentials

```prompt
Je vais créer des credentials dans n8n pour ces services : [liste des services].
Pour chacun, propose : 1) un nom clair (service + usage), 2) les permissions minimales à demander, 3) ce que je dois faire pour la supprimer proprement si je n'en ai plus besoin. N'écris et ne demande aucune clé secrète : je les colle moi-même dans n8n.
```

Tu dois recevoir une liste de noms et de permissions. Colle toi-même les clés dans n8n, jamais dans le chat.$b$;
  v_repere text := $r$### À faire maintenant : bien nommer et cadrer tes credentials$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
end
$m$;

-- Section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : tester un Webhook et planifier une exécution

Dans n8n, ajoute un nœud Webhook et clique sur « Listen for test event ». Puis, dans un terminal, envoie une requête de test. Remplace `<url-du-webhook>` par l'adresse de test affichée :

```bash
curl -X POST <url-du-webhook> -H "Content-Type: application/json" -d "{\"nom\": \"Test\"}"
```

n8n doit afficher la donnée reçue dans l'éditeur.

Pour planifier une exécution avec une expression cron, par exemple chaque lundi à 9 h :

```text
0 9 * * 1
```

Pour t'aider à choisir un trigger :

```prompt
Je veux automatiser : [décris le processus].
Quel trigger n8n correspond à l'événement réel (Webhook, Schedule, App Trigger ou Manual) ? Explique ton choix en deux phrases et dis pourquoi les trois autres conviennent moins.
```$b$;
  v_repere text := $r$### À faire maintenant : tester un Webhook et planifier une exécution$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
end
$m$;

-- Section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : choisir les bons nœuds

```prompt
Mon automatisation : [décris-la].
Liste les nœuds n8n dont j'ai besoin, dans l'ordre, parmi HTTP Request, Set, IF, Merge et NoOp. Pour chaque nœud, dis ce qu'il fait ici en une phrase. Dis aussi si le nœud Code est vraiment nécessaire : propose d'abord une solution sans code.
```

Tu dois recevoir une suite de nœuds, avec une solution sans code quand c'est possible.$b$;
  v_repere text := $r$### À faire maintenant : choisir les bons nœuds$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
end
$m$;

-- Section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 6
do $m$
declare
  v_bloc text := $b$### À faire maintenant : appliquer les bons réflexes

```prompt
Voici mon workflow n8n : [décris les nœuds dans l'ordre].
Propose : 1) un nom clair pour chaque nœud (ce qu'il fait), 2) des données de test réalistes à épingler (pin data), sans aucune vraie donnée client, 3) le texte d'une note autocollante qui documente le workflow : à quoi il sert, ce qu'il déclenche, ce qu'il ne faut pas toucher.
```

Tu dois recevoir des noms, des données fictives et une note prête à coller dans n8n.$b$;
  v_repere text := $r$### À faire maintenant : appliquer les bons réflexes$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 7 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 7 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 11c9f4f0-428a-460e-a926-33bdc05ce4e9, chapitre 6. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '11c9f4f0-428a-460e-a926-33bdc05ce4e9';
end
$m$;

-- Section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : ton premier appel d'API

Ajoute un nœud **HTTP Request**, méthode **GET**, et colle cette adresse. Elle renvoie une liste de faux utilisateurs :

```text
https://jsonplaceholder.typicode.com/users
```

Exécute le nœud : la liste s'affiche dans n8n. Pour vérifier un corps de requête, utilise ce service qui renvoie ce qu'on lui envoie :

```text
https://httpbin.org/post
```

Pour une vraie API, fais d'abord lire la documentation :

```prompt
Je veux appeler l'API de [service]. Lis la documentation officielle et dis-moi : l'adresse à appeler, la méthode, l'authentification demandée, les paramètres obligatoires, et comment la pagination fonctionne. N'invente rien : si une information n'est pas dans la documentation, dis-le.
```$b$;
  v_repere text := $r$### À faire maintenant : ton premier appel d'API$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '599598eb-7048-4b2b-9011-72a33e20a136';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '599598eb-7048-4b2b-9011-72a33e20a136';
end
$m$;

-- Section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : façonner tes données

```prompt
J'ai ces données en entrée dans n8n : [colle un exemple fictif].
Je veux obtenir : [décris le résultat voulu]. Propose la configuration du nœud Set (Edit Fields) champ par champ, avec les expressions {{ }} nécessaires. N'utilise le nœud Code que si c'est impossible autrement.
```

Tu dois recevoir une liste de champs avec leurs expressions, à recopier dans le nœud.$b$;
  v_repere text := $r$### À faire maintenant : façonner tes données$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '599598eb-7048-4b2b-9011-72a33e20a136';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '599598eb-7048-4b2b-9011-72a33e20a136';
end
$m$;

-- Section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : retrouver un fichier perdu

```prompt
Dans mon workflow n8n, un fichier (donnée binaire) disparaît ou n'est pas trouvé après le nœud [nom du nœud]. Voici l'enchaînement des nœuds : [décris-le].
Vérifie dans cet ordre : 1) le nom de la propriété binaire, 2) un nœud Merge qui perd le binaire, 3) un nœud qui ne transmet que le JSON. Dis-moi lequel est le plus probable et comment le corriger.
```$b$;
  v_repere text := $r$### À faire maintenant : retrouver un fichier perdu$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '599598eb-7048-4b2b-9011-72a33e20a136';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '599598eb-7048-4b2b-9011-72a33e20a136';
end
$m$;

-- Section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : extraire un sous-workflow

```prompt
Dans mes workflows n8n, je répète cette logique : [décris-la].
Propose un sous-workflow : 1) un nom qui commence par un verbe, 2) les entrées typées qu'il reçoit, 3) ce qu'il renvoie, 4) le mode d'exécution à choisir, « each » ou « all », et pourquoi.
```$b$;
  v_repere text := $r$### À faire maintenant : extraire un sous-workflow$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '599598eb-7048-4b2b-9011-72a33e20a136';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '599598eb-7048-4b2b-9011-72a33e20a136';
end
$m$;

-- Section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : ne plus rater une erreur

Dans n8n :
1. Crée un workflow séparé nommé `Alertes erreurs`.
2. Ajoute-y un nœud **Error Trigger**, suivi d'un email ou d'un message Slack.
3. Dans le workflow à surveiller, ouvre « Settings » et choisis `Alertes erreurs` dans « Error Workflow ».

Puis rédige le message d'alerte :

```prompt
Écris le message d'alerte d'un workflow d'erreurs n8n. Il doit dire : quel workflow a échoué, à quelle heure, quel nœud a échoué, et le message d'erreur. Donne-moi le texte avec les expressions {{ }} de n8n à utiliser pour chaque information.
```$b$;
  v_repere text := $r$### À faire maintenant : ne plus rater une erreur$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '599598eb-7048-4b2b-9011-72a33e20a136';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '599598eb-7048-4b2b-9011-72a33e20a136';
end
$m$;

-- Section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 6
do $m$
declare
  v_bloc text := $b$### À faire maintenant : atelier des demandes commerciales

```prompt
Conçois le workflow n8n qui traite les demandes commerciales entrantes. Le déroulé : un trigger, la normalisation des données, la qualification (chaud, tiède, froid), le routage vers la bonne personne, et la gestion d'erreur avec un Error Trigger. Pour chaque étape, donne le nœud à utiliser et sa configuration. Propose les critères de qualification en précisant qu'ils seront à ajuster après les premières semaines.
```

Tu dois recevoir un workflow étape par étape, avec les critères de qualification.$b$;
  v_repere text := $r$### À faire maintenant : atelier des demandes commerciales$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 7 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '599598eb-7048-4b2b-9011-72a33e20a136';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 7 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 599598eb-7048-4b2b-9011-72a33e20a136, chapitre 6. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '599598eb-7048-4b2b-9011-72a33e20a136';
end
$m$;

-- Section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : brancher un modèle d'IA

**Un modèle cloud.** Crée une clé API sur le site du fournisseur, puis colle-la **toi-même** dans n8n : menu « Credentials », « Add Credential », choisis Anthropic ou OpenAI. Ne colle jamais la clé dans le chat.

**Un modèle local avec Ollama.** Après avoir installé Ollama (ollama.com), télécharge un modèle :

```bash
ollama pull llama3
```

Dans n8n, le nœud Ollama se connecte par défaut à cette adresse :

```text
http://localhost:11434
```

Change-la si Ollama tourne sur une autre machine que n8n.

Pour choisir entre cloud et local :

```prompt
Mon cas : [décris l'usage]. Mes contraintes : sensibilité des données [faible/moyenne/forte], volume [par jour], budget [montant], rapidité attendue [secondes].
Recommande cloud, local, ou un mélange, en trois lignes. Dis ce que je dois vérifier dans les conditions du fournisseur avant de lui envoyer des données.
```$b$;
  v_repere text := $r$### À faire maintenant : brancher un modèle d'IA$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
end
$m$;

-- Section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire un message système

Copie ce modèle et remplis-le. Il se colle dans le champ « message système » d'un nœud IA.

```text
Rôle : tu es [rôle précis, par exemple assistant de qualification des demandes commerciales].

Ce que tu fais : [la tâche, en une ou deux phrases].

Format de sortie : réponds uniquement avec [le format exact, par exemple un JSON avec les champs « niveau » et « raison »].

Si tu n'es pas sûr : dis-le clairement. N'invente jamais une information. Si la demande sort de ton rôle, réponds « hors périmètre ».
```

Pour le faire améliorer :

```prompt
Voici mon message système n8n : [colle-le]. Relis-le : le rôle est-il clair, le format de sortie est-il précis, la conduite en cas d'incertitude est-elle écrite ? Propose une version améliorée, sans l'allonger inutilement.
```$b$;
  v_repere text := $r$### À faire maintenant : écrire un message système$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
end
$m$;

-- Section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : choisir un nœud spécialisé

```prompt
Ma tâche récurrente : [décris-la].
Dis-moi quel nœud IA n8n convient le mieux : Basic LLM Chain, Text Classifier, Information Extractor ou Summarization Chain. Explique en deux phrases pourquoi un agent complet serait ici inutile, ou dans quel cas il deviendrait nécessaire.
```$b$;
  v_repere text := $r$### À faire maintenant : choisir un nœud spécialisé$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
end
$m$;

-- Section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 6
do $m$
declare
  v_bloc text := $b$### À faire maintenant : concevoir un agent de support

```prompt
Conçois un agent IA de support client dans n8n pour [activité]. Décris : 1) le modèle et son message système, 2) la mémoire, en précisant qu'elle est limitée à chaque session pour ne jamais mélanger deux conversations, 3) les tools dont il a besoin, 4) quand il passe la main à un humain. Ne construis rien : donne-moi le plan à valider.
```$b$;
  v_repere text := $r$### À faire maintenant : concevoir un agent de support$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 7 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 7 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 6. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
end
$m$;

-- Section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 7
do $m$
declare
  v_bloc text := $b$### À faire maintenant : décrire un tool pour un agent

L'agent choisit un tool d'après son nom et sa description. Copie ce modèle :

```text
Nom : [verbe + objet, par exemple chercher_commande]

Description : utilise ce tool quand [situation précise]. Il reçoit [les informations attendues]. Il renvoie [ce qu'il rend]. Ne l'utilise pas pour [cas à exclure].
```

Pour contrôler tes tools :

```prompt
Voici les tools de mon agent n8n avec leurs descriptions : [colle-les]. Y en a-t-il qui se ressemblent, qui sont vagues, ou en trop ? Propose une version plus courte et plus précise.
```$b$;
  v_repere text := $r$### À faire maintenant : décrire un tool pour un agent$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 8 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 8 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 7. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
end
$m$;

-- Section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 8
do $m$
declare
  v_bloc text := $b$### À faire maintenant : lancer une base vectorielle pour ton RAG

Pour tester en local, il faut Docker. Lance Qdrant :

```bash
docker run -p 6333:6333 qdrant/qdrant
```

Il est ensuite accessible à cette adresse :

```text
http://localhost:6333
```

Pour préparer ton RAG :

```prompt
Je construis un RAG avec n8n sur ces documents : [décris-les]. Propose : 1) comment découper les documents en morceaux en respectant leurs limites naturelles (titres, paragraphes), 2) la taille de morceau à tester au départ, 3) cinq questions de test dont je connais la réponse pour vérifier la qualité.
```$b$;
  v_repere text := $r$### À faire maintenant : lancer une base vectorielle pour ton RAG$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 9 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 9 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9c9fda01-544e-40af-877c-c4453b9a4794, chapitre 8. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9c9fda01-544e-40af-877c-c4453b9a4794';
end
$m$;

-- Section 71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : découper en agents spécialisés

```prompt
Mon système d'agents doit gérer : [décris les demandes à traiter].
Découpe-le en agents spécialisés. Pour chacun : sa mission unique, son message système en trois phrases, et ce qu'il ne doit jamais faire. Puis écris les règles communes à tous : le ton, quand passer la main à un humain, le format des réponses.
```

Tu dois recevoir une équipe d'agents avec des règles communes écrites noir sur blanc.$b$;
  v_repere text := $r$### À faire maintenant : découper en agents spécialisés$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3';
end
$m$;

-- Section 71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire le message système du routeur

Copie ce modèle :

```text
Tu es un routeur. Tu ne traites jamais la demande toi-même.
Lis le message reçu et réponds uniquement par l'un de ces mots :
- COMMERCIAL : demande de devis, de prix ou d'offre
- CONTACT : demande d'information générale ou de coordonnées
- RDV : demande de rendez-vous
- AUTRE : tout le reste
Si tu hésites, réponds AUTRE.
```

Adapte les trois destinations à ton projet, puis teste :

```prompt
Voici le message système de mon routeur : [colle-le]. Invente dix messages clients variés, dont trois ambigus et deux hors sujet. Dis vers quelle destination chacun serait envoyé et signale les cas où le routeur risque de se tromper.
```$b$;
  v_repere text := $r$### À faire maintenant : écrire le message système du routeur$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3';
end
$m$;

-- Section 71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : valider l'assemblage

```prompt
Prépare un plan de test pour mon système multi-agents. Propose vingt messages réalistes et variés (formulations différentes, fautes, messages courts, messages ambigus). Pour chacun, indique le résultat attendu. Ajoute ensuite la checklist de livraison : fonctionnement, sécurité, transmission au client.
```

Tu dois recevoir une grille de test à dérouler message par message.$b$;
  v_repere text := $r$### À faire maintenant : valider l'assemblage$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3';
end
$m$;

-- Section 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : installer Docker

Sous Windows et Mac, télécharge Docker Desktop sur docker.com et installe-le comme une application normale. Sous Linux, le script d'installation officiel :

```bash
curl -fsSL https://get.docker.com | sh
```

Vérifie ensuite que Docker répond :

```bash
docker --version
```

Pour préparer un déploiement de production, demande-le explicitement :

```prompt
Je veux déployer n8n en production sur un VPS avec Docker. Donne-moi la checklist complète étape par étape : Docker Compose, HTTPS automatique, variables d'environnement pour les secrets, accès restreint. Ne laisse aucune configuration permissive de développement. Avance une étape à la fois et attends mon accord.
```$b$;
  v_repere text := $r$### À faire maintenant : installer Docker$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9fa0470c-fc31-4c92-89bd-8cc55b8b70c3';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9fa0470c-fc31-4c92-89bd-8cc55b8b70c3';
end
$m$;

-- Section 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : sécuriser et surveiller

```prompt
Audite la sécurité de mon instance n8n auto-hébergée. Vérifie : HTTPS actif, accès restreint (qui peut ouvrir l'interface), webhooks publics validés, secrets hors du code. Puis propose un health check simple relié à une alerte, pour être prévenu immédiatement en cas de panne. Donne-moi la liste de ce que je dois vérifier moi-même, point par point.
```$b$;
  v_repere text := $r$### À faire maintenant : sécuriser et surveiller$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9fa0470c-fc31-4c92-89bd-8cc55b8b70c3';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9fa0470c-fc31-4c92-89bd-8cc55b8b70c3';
end
$m$;

-- Section 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : sauvegarder ton n8n

Ces commandes s'exécutent depuis l'instance n8n elle-même :

```bash
n8n export:workflow --all --output=backup-workflows.json
n8n export:credentials --all --output=backup-credentials.json
```

Attention : le fichier des credentials contient tes accès. Garde-le dans un stockage privé, **hors du serveur n8n**, et ne le mets jamais sur GitHub ni dans un chat.

Pour planifier la sauvegarde :

```prompt
Propose une routine de sauvegarde pour mon n8n : ce qu'il faut sauvegarder (workflows, credentials, données d'exécution si nécessaire), à quelle fréquence, où stocker les copies, et comment tester une restauration. N'écris aucun mot de passe dans la réponse.
```$b$;
  v_repere text := $r$### À faire maintenant : sauvegarder ton n8n$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9fa0470c-fc31-4c92-89bd-8cc55b8b70c3';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9fa0470c-fc31-4c92-89bd-8cc55b8b70c3';
end
$m$;

-- Section 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : essayer Redis en local

Pour tester rapidement Redis avant de l'intégrer à ton fichier `docker-compose.yml` :

```bash
docker run -p 6379:6379 redis
```

En production, Redis rejoint le même `docker-compose.yml` que n8n et ses workers.

```prompt
Mon n8n traite environ [nombre] exécutions par jour. Dis-moi honnêtement si le mode queue avec Redis et plusieurs workers est justifié maintenant, ou s'il vaut mieux attendre. Donne les chiffres qui devraient me faire changer d'avis.
```$b$;
  v_repere text := $r$### À faire maintenant : essayer Redis en local$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '9fa0470c-fc31-4c92-89bd-8cc55b8b70c3';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '9fa0470c-fc31-4c92-89bd-8cc55b8b70c3';
end
$m$;

-- Section adfd2908-a9bc-4038-a315-c1ee937be410, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire ton brief

```prompt
Contexte : [ton activité et le processus candidat].
Objectif : à la fin, ceci doit être vrai : [résultat mesurable].
Périmètre : ce qui est inclus : [liste]. Ce qui reste hors périmètre : [liste].
Autonomie : propose-moi le plan et attends mon accord avant de construire.

Aide-moi à choisir le bon processus à automatiser en premier : récurrent, chronophage, à faible risque d'erreur. Compare mes candidats et recommande-en un. Puis écris le brief complet.
```

Tu dois recevoir un processus recommandé et un brief à valider.$b$;
  v_repere text := $r$### À faire maintenant : écrire ton brief$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'adfd2908-a9bc-4038-a315-c1ee937be410';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section adfd2908-a9bc-4038-a315-c1ee937be410, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'adfd2908-a9bc-4038-a315-c1ee937be410';
end
$m$;

-- Section adfd2908-a9bc-4038-a315-c1ee937be410, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : construire le MVP

```prompt
Mon brief : [colle le brief].
Construis d'abord le chemin principal seulement, sans les cas particuliers. Dis-moi comment les données existantes entrent dans le système : import ponctuel ou flux continu. Prépare dix jeux de données de test réalistes et imparfaits (champ manquant, doublon, faute de frappe), sans aucune vraie donnée client.
```$b$;
  v_repere text := $r$### À faire maintenant : construire le MVP$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'adfd2908-a9bc-4038-a315-c1ee937be410';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section adfd2908-a9bc-4038-a315-c1ee937be410, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'adfd2908-a9bc-4038-a315-c1ee937be410';
end
$m$;

-- Section adfd2908-a9bc-4038-a315-c1ee937be410, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : livrer l'agent de bout en bout

```prompt
Assemble les briques de mon projet en un agent automatisé de bout en bout. Puis passe la checklist de livraison : fonctionnement testé sur des cas variés, sécurité (aucun secret exposé, accès limités), transmission au client (documentation, accès, contact). Réponds par « fait », « à faire » ou « non vérifié » à chaque point, et propose comment documenter le projet pour qu'il devienne un starter.
```$b$;
  v_repere text := $r$### À faire maintenant : livrer l'agent de bout en bout$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'adfd2908-a9bc-4038-a315-c1ee937be410';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section adfd2908-a9bc-4038-a315-c1ee937be410, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'adfd2908-a9bc-4038-a315-c1ee937be410';
end
$m$;

-- Section 244dab35-ef6a-4b5f-876b-2d1029b989a7, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : mettre à jour sans casser

```prompt
Je dois mettre à jour n8n. Écris la procédure : 1) sauvegarder les workflows et les credentials, 2) tester la mise à jour sur une autre instance que la production, 3) vérifier les workflows critiques après la mise à jour, 4) comment revenir en arrière si quelque chose casse. Ajoute une proposition de dossiers et de tags pour ranger mes workflows, et la liste de ceux à archiver.
```$b$;
  v_repere text := $r$### À faire maintenant : mettre à jour sans casser$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '244dab35-ef6a-4b5f-876b-2d1029b989a7';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 244dab35-ef6a-4b5f-876b-2d1029b989a7, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '244dab35-ef6a-4b5f-876b-2d1029b989a7';
end
$m$;

-- Section 244dab35-ef6a-4b5f-876b-2d1029b989a7, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : faire la revue périodique

```prompt
Prépare ma checklist de revue mensuelle de n8n : credentials inutilisées ou trop larges, workflows inactifs à désactiver ou archiver, erreurs récurrentes, workflows qui ont cessé de fonctionner sans bruit. Pour chaque point, dis où regarder dans n8n et ce qui doit m'alerter.
```$b$;
  v_repere text := $r$### À faire maintenant : faire la revue périodique$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '244dab35-ef6a-4b5f-876b-2d1029b989a7';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 244dab35-ef6a-4b5f-876b-2d1029b989a7, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '244dab35-ef6a-4b5f-876b-2d1029b989a7';
end
$m$;

-- Section 244dab35-ef6a-4b5f-876b-2d1029b989a7, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : inspecter un template avant de l'utiliser

```prompt
J'ai trouvé ce template n8n dans la communauté : [colle son contenu ou sa description].
Avant que je l'importe, inspecte-le : quels nœuds il contient, quelles credentials et quelles permissions il demande, s'il appelle des adresses externes, et ce qui est plus large que nécessaire. Dis-moi s'il est sûr de l'importer et ce que je dois retirer.
```$b$;
  v_repere text := $r$### À faire maintenant : inspecter un template avant de l'utiliser$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '244dab35-ef6a-4b5f-876b-2d1029b989a7';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 244dab35-ef6a-4b5f-876b-2d1029b989a7, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '244dab35-ef6a-4b5f-876b-2d1029b989a7';
end
$m$;

-- Section 7f755d31-8c66-404b-a473-9c13cbc1d9ee, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : passer à l'action cette semaine

```prompt
Je veux devenir un Early Adopter de l'IA dans mon activité : [décris-la en une phrase].
Propose-moi une première action concrète, faisable en moins de deux heures cette semaine, avec l'IA, sur une vraie tâche de mon quotidien. Dis ce que je dois préparer, ce que je dois faire, et comment je saurai que ça a marché.
```

Tu dois recevoir une action unique et vérifiable. Fais-la avant de lire la suite.$b$;
  v_repere text := $r$### À faire maintenant : passer à l'action cette semaine$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7f755d31-8c66-404b-a473-9c13cbc1d9ee';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7f755d31-8c66-404b-a473-9c13cbc1d9ee, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7f755d31-8c66-404b-a473-9c13cbc1d9ee';
end
$m$;

-- Section 7f755d31-8c66-404b-a473-9c13cbc1d9ee, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : construire ton plan d'apprentissage

```prompt
Je veux apprendre l'IA par un vrai projet : [décris le projet].
Découpe mon apprentissage en quatre étapes, du plus simple au plus complexe, chacune avec un petit livrable concret. Ne me donne pas de liste de cours : donne-moi ce que je dois construire à chaque étape.
```$b$;
  v_repere text := $r$### À faire maintenant : construire ton plan d'apprentissage$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7f755d31-8c66-404b-a473-9c13cbc1d9ee';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7f755d31-8c66-404b-a473-9c13cbc1d9ee, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7f755d31-8c66-404b-a473-9c13cbc1d9ee';
end
$m$;

-- Section 7f755d31-8c66-404b-a473-9c13cbc1d9ee, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : tester une croyance limitante

```prompt
Ma croyance : « [écris-la, par exemple : je ne suis pas technique] ».
Aide-moi à la tester, sans me faire de grands discours. Propose-moi une petite expérience de 30 minutes avec les outils IA d'aujourd'hui, qui me donne une preuve concrète pour ou contre cette croyance.
```

Tu dois recevoir une expérience courte. Le résultat compte plus que l'argument.$b$;
  v_repere text := $r$### À faire maintenant : tester une croyance limitante$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7f755d31-8c66-404b-a473-9c13cbc1d9ee';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7f755d31-8c66-404b-a473-9c13cbc1d9ee, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7f755d31-8c66-404b-a473-9c13cbc1d9ee';
end
$m$;

-- Section 7f755d31-8c66-404b-a473-9c13cbc1d9ee, chapitre 6
do $m$
declare
  v_bloc text := $b$### À faire maintenant : s'entraîner à échouer sans risque

```prompt
Propose-moi un petit exercice où je peux me tromper sans aucune conséquence réelle : un projet jetable de [outil ou sujet]. Dis-moi à l'avance trois erreurs probables, et comment les corriger. À la fin, aide-moi à noter ce que chaque échec m'a appris.
```$b$;
  v_repere text := $r$### À faire maintenant : s'entraîner à échouer sans risque$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 7 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7f755d31-8c66-404b-a473-9c13cbc1d9ee';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 7 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7f755d31-8c66-404b-a473-9c13cbc1d9ee, chapitre 6. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7f755d31-8c66-404b-a473-9c13cbc1d9ee';
end
$m$;

-- Section 961d2995-3e24-453e-9d45-7efc5ba71f2f, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : repérer tes opportunités

```prompt
Voici mes tâches de la semaine : [liste-les].
Évalue chacune avec trois critères : 1) prend-elle un temps disproportionné, 2) sa logique est-elle déjà standardisée, 3) est-elle liée à un résultat business direct. Classe-les de la meilleure opportunité à la moins bonne, avec une phrase d'explication. Recommande la première à automatiser.
```

Tu dois recevoir un classement argumenté. Choisis une seule tâche pour commencer.$b$;
  v_repere text := $r$### À faire maintenant : repérer tes opportunités$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '961d2995-3e24-453e-9d45-7efc5ba71f2f';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 961d2995-3e24-453e-9d45-7efc5ba71f2f, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '961d2995-3e24-453e-9d45-7efc5ba71f2f';
end
$m$;

-- Section a5fef6b2-517b-4d78-ac4f-48d8a4f2a69e, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : choisir un fournisseur pour ton projet

```prompt
Mon projet : [décris-le]. Mes critères : qualité sur ma tâche, coût, confidentialité des données, écosystème d'outils.
Compare trois fournisseurs d'IA générative pour ce projet. Pour chaque critère, donne une note simple et une phrase. Ne t'appuie que sur des informations que tu peux justifier, et dis-moi ce que je dois vérifier moi-même sur leurs sites officiels.
```$b$;
  v_repere text := $r$### À faire maintenant : choisir un fournisseur pour ton projet$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'a5fef6b2-517b-4d78-ac4f-48d8a4f2a69e';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section a5fef6b2-517b-4d78-ac4f-48d8a4f2a69e, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'a5fef6b2-517b-4d78-ac4f-48d8a4f2a69e';
end
$m$;

-- Section 4e554826-0583-49d6-bbd4-78d7ed7e4d48, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : améliorer un prompt

```prompt
Voici un prompt que j'utilise : [colle-le].
Améliore-le avec ces quatre éléments : le contexte, l'objectif précis, le périmètre, le niveau d'autonomie. Ajoute le format de sortie, le ton, et un exemple concret. Montre-moi la version améliorée et explique en trois lignes ce qui a changé.
```

Tu dois recevoir un prompt plus précis. Teste les deux versions et compare les résultats.$b$;
  v_repere text := $r$### À faire maintenant : améliorer un prompt$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '4e554826-0583-49d6-bbd4-78d7ed7e4d48';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 4e554826-0583-49d6-bbd4-78d7ed7e4d48, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '4e554826-0583-49d6-bbd4-78d7ed7e4d48';
end
$m$;

-- Section 4e554826-0583-49d6-bbd4-78d7ed7e4d48, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire ton prompt système

Copie ce modèle et remplis-le. Il se colle au début d'une conversation ou dans les instructions d'un assistant :

```text
Rôle : tu es [rôle précis].

Contraintes permanentes :
- Réponds en [langue], avec des phrases courtes.
- Ton : [ton voulu].
- Format : [format voulu].

Si tu n'es pas sûr : dis-le. N'invente jamais un chiffre ni une source.
```$b$;
  v_repere text := $r$### À faire maintenant : écrire ton prompt système$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '4e554826-0583-49d6-bbd4-78d7ed7e4d48';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 4e554826-0583-49d6-bbd4-78d7ed7e4d48, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '4e554826-0583-49d6-bbd4-78d7ed7e4d48';
end
$m$;

-- Section 1dad4dfd-19ea-4adc-bfd0-9071a1bf6ea0, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : définir ton objectif principal

```prompt
Mon profil : [salarié / entrepreneur / formateur / consultant, ou un mélange]. Ma situation : [décris-la].
Pose-moi cinq questions, une à la fois, pour trouver mon objectif principal avec l'IA dans les douze prochains mois. À la fin, formule-le en une phrase mesurable.
```$b$;
  v_repere text := $r$### À faire maintenant : définir ton objectif principal$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '1dad4dfd-19ea-4adc-bfd0-9071a1bf6ea0';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 1dad4dfd-19ea-4adc-bfd0-9071a1bf6ea0, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '1dad4dfd-19ea-4adc-bfd0-9071a1bf6ea0';
end
$m$;

-- Section 1dad4dfd-19ea-4adc-bfd0-9071a1bf6ea0, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire ton plan d'action

```prompt
Mon objectif : [colle ta phrase mesurable].
Transforme-le en plan d'action : des étapes réalistes avec une date, un résultat vérifiable pour chacune, et un rendez-vous de révision toutes les deux semaines. Ne dépasse pas sept étapes.
```

Tu dois recevoir un plan daté. Mets les dates dans ton agenda aujourd'hui.$b$;
  v_repere text := $r$### À faire maintenant : écrire ton plan d'action$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '1dad4dfd-19ea-4adc-bfd0-9071a1bf6ea0';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 1dad4dfd-19ea-4adc-bfd0-9071a1bf6ea0, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '1dad4dfd-19ea-4adc-bfd0-9071a1bf6ea0';
end
$m$;

-- Section 1a08d4d7-7b60-4d92-92d0-245b31d1c378, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : noter tes tâches répétitives

```prompt
Aide-moi à repérer ce que je peux automatiser. Pose-moi des questions sur ma semaine type : ce que je fais chaque jour, ce que je refais souvent à l'identique, ce que je n'aime pas faire. Puis liste mes trois tâches les plus répétitives, et décris la plus simple en étapes numérotées, comme un processus.
```$b$;
  v_repere text := $r$### À faire maintenant : noter tes tâches répétitives$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '1a08d4d7-7b60-4d92-92d0-245b31d1c378';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 1a08d4d7-7b60-4d92-92d0-245b31d1c378, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '1a08d4d7-7b60-4d92-92d0-245b31d1c378';
end
$m$;

-- Section 1a08d4d7-7b60-4d92-92d0-245b31d1c378, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : imaginer ton premier agent

```prompt
Je veux découvrir les agents IA avec un exemple simple. Propose-moi un agent avec un seul tool, utile pour [mon activité]. Décris : sa mission, son tool, et deux questions de test : une qui doit déclencher le tool, une qui ne le doit pas. Ne construis rien, donne-moi le plan.
```$b$;
  v_repere text := $r$### À faire maintenant : imaginer ton premier agent$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '1a08d4d7-7b60-4d92-92d0-245b31d1c378';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 1a08d4d7-7b60-4d92-92d0-245b31d1c378, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '1a08d4d7-7b60-4d92-92d0-245b31d1c378';
end
$m$;

-- Section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : préparer l'onboarding d'un client

```prompt
Je démarre avec un nouveau client : [activité du client]. Prépare mon premier échange : une liste de questions pour comprendre qui il est, ce qu'il attend, son niveau d'usage actuel de l'IA, et comment nous allons communiquer (fréquence, canal, interlocuteur). Classe les questions par ordre d'importance.
```$b$;
  v_repere text := $r$### À faire maintenant : préparer l'onboarding d'un client$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
end
$m$;

-- Section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : cadrer le projet

```prompt
Contexte : mon client est [client], avec ces contraintes : [contraintes].
Objectif : [résultat attendu et mesurable].
Périmètre : inclus : [liste]. Hors périmètre : [liste].
Autonomie : propose le cadrage et attends mon accord.

Aide-moi à vérifier que ce projet est pertinent : le bénéfice dépasse-t-il clairement l'effort de construction ? Quel est le volume et l'impact réels ? Réponds par oui ou non avec trois raisons.
```$b$;
  v_repere text := $r$### À faire maintenant : cadrer le projet$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
end
$m$;

-- Section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : définir ton MVP et ta V1

```prompt
Pour ce projet : [décris-le].
Sépare clairement : 1) le MVP, qui couvre seulement le chemin principal pour valider l'idée, 2) la V1, qui ajoute la robustesse et les cas particuliers. Pour le MVP, donne un critère de réussite simple et la date à laquelle je le montre au client. Ne planifie la V1 qu'après.
```$b$;
  v_repere text := $r$### À faire maintenant : définir ton MVP et ta V1$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
end
$m$;

-- Section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : tester et optimiser après l'usage

```prompt
Mon projet est en ligne depuis [durée]. Prépare ma revue : les données d'usage à regarder, les points qui ont pu casser sans bruit, les trois questions à poser au client, et les optimisations à envisager d'après ce que j'observe. Demande-moi d'abord les chiffres réels avant de proposer quoi que ce soit.
```$b$;
  v_repere text := $r$### À faire maintenant : tester et optimiser après l'usage$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
end
$m$;

-- Section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : livrer ton premier projet

```prompt
Je livre mon premier projet à [client]. Prépare : 1) la checklist de livraison (fonctionnement, sécurité, transmission), 2) un guide d'utilisation d'une page pour le client, 3) un message de remise professionnel et court. Puis propose comment demander un témoignage au client, sans l'obliger.
```$b$;
  v_repere text := $r$### À faire maintenant : livrer ton premier projet$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 23c4e805-2a54-4c2f-9e8b-d82db488e8f9, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '23c4e805-2a54-4c2f-9e8b-d82db488e8f9';
end
$m$;

-- Section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : formuler ton offre et choisir ton tarif

```prompt
Mon service : [décris-le]. Ma cible : [qui].
Écris mon offre en une phrase qu'un non-spécialiste comprend. Puis compare trois logiques de tarification : au projet, à l'heure, à l'abonnement. Dis laquelle convient le mieux à ce service et pourquoi. Ne donne pas de prix inventé : demande-moi mes coûts et mon temps.
```$b$;
  v_repere text := $r$### À faire maintenant : formuler ton offre et choisir ton tarif$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
end
$m$;

-- Section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire ta liste et ton message chaud

```prompt
Aide-moi à cartographier mes contacts chauds : pose-moi des questions pour retrouver les personnes que je connais, directement ou indirectement, qui pourraient avoir besoin de mon service. Puis écris un message court, naturel et sincère pour les contacter, sans phrase de vendeur. Deux versions : une pour un proche, une pour une connaissance.
```$b$;
  v_repere text := $r$### À faire maintenant : écrire ta liste et ton message chaud$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
end
$m$;

-- Section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : préparer une accroche de prospection froide

```prompt
Ma cible : [type de prospect]. Mon offre : [une phrase].
Écris trois accroches d'email à froid de quatre lignes maximum. Chacune doit parler d'un problème précis de cette cible, pas de moi. Évite toute personnalisation de façade. Termine chaque message par une question simple. Ajoute une phrase qui permet au destinataire de ne plus recevoir mes messages.
```$b$;
  v_repere text := $r$### À faire maintenant : préparer une accroche de prospection froide$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
end
$m$;

-- Section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : planifier ton contenu

```prompt
Je veux attirer des clients avec du contenu sur [sujet]. Propose un plan de huit contenus (vidéos ou posts) qui répondent chacun à une question réelle de mes prospects. Pour chacun : le titre, la question à laquelle il répond, et l'action que je propose à la fin.
```$b$;
  v_repere text := $r$### À faire maintenant : planifier ton contenu$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
end
$m$;

-- Section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 6
do $m$
declare
  v_bloc text := $b$### À faire maintenant : assembler ta machine d'acquisition

```prompt
Combine trois canaux pour mon activité : le warm outreach, l'outbound et l'inbound. Pour chacun, donne : une action hebdomadaire de moins d'une heure, un chiffre à suivre, et un seuil qui me dit qu'il faut changer quelque chose. Présente le tout en un tableau d'une page.
```$b$;
  v_repere text := $r$### À faire maintenant : assembler ta machine d'acquisition$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 7 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 7 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 6. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
end
$m$;

-- Section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 7
do $m$
declare
  v_bloc text := $b$### À faire maintenant : préparer un appel découverte

```prompt
Prépare mon appel découverte avec [type de client]. Donne : dix questions ouvertes pour comprendre son besoin, des phrases de reformulation à utiliser, la structure de l'appel en cinq temps, et comment proposer ma solution seulement à la fin, en la reliant à ce qu'il a dit. Ajoute les signes qui montrent que je ne dois pas vendre à ce client.
```$b$;
  v_repere text := $r$### À faire maintenant : préparer un appel découverte$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 8 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 8 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 7. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
end
$m$;

-- Section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 8
do $m$
declare
  v_bloc text := $b$### À faire maintenant : choisir ce qu'on systématise

```prompt
Voici mes étapes d'acquisition : [liste-les].
Classe chaque étape : « à automatiser », « à garder humaine » ou « pas encore, je dois d'abord la rôder ». Pour celles à automatiser, dis quel outil du Module 2 pourrait s'en charger. Ne propose pas de déléguer une étape que je n'ai pas encore documentée.
```$b$;
  v_repere text := $r$### À faire maintenant : choisir ce qu'on systématise$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 9 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 9 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 0f5a7f6a-f5e6-4e32-b401-e12980560b00, chapitre 8. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '0f5a7f6a-f5e6-4e32-b401-e12980560b00';
end
$m$;

-- Section 3558f709-612c-42cf-87c8-cda002a25a0e, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : concevoir un générateur de contrat

```prompt
Conçois un générateur de contrat pour [type de contrat]. Décris : 1) le formulaire des informations variables du client, 2) le prompt système stable qui produit le contrat, 3) l'étape obligatoire de relecture humaine avant envoi, 4) la liste des clauses sensibles à faire relire par un juriste. Précise que le résultat n'est pas un avis juridique.
```$b$;
  v_repere text := $r$### À faire maintenant : concevoir un générateur de contrat$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '3558f709-612c-42cf-87c8-cda002a25a0e';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 3558f709-612c-42cf-87c8-cda002a25a0e, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '3558f709-612c-42cf-87c8-cda002a25a0e';
end
$m$;

-- Section 3558f709-612c-42cf-87c8-cda002a25a0e, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : concevoir le tri de candidatures

```prompt
Conçois le traitement de candidatures pour le poste de [poste]. Décris : les champs à extraire, les critères de classement, et la décision finale qui reste humaine. Liste ensuite les critères à ne jamais utiliser (photo, date de naissance précise, origine, situation familiale) et comment vérifier l'absence de biais avant la mise en service.
```$b$;
  v_repere text := $r$### À faire maintenant : concevoir le tri de candidatures$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '3558f709-612c-42cf-87c8-cda002a25a0e';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 3558f709-612c-42cf-87c8-cda002a25a0e, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '3558f709-612c-42cf-87c8-cda002a25a0e';
end
$m$;

-- Section 3558f709-612c-42cf-87c8-cda002a25a0e, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : concevoir un agent de réservation

```prompt
Conçois un agent IA de réservation pour [activité]. Décris : les messages qu'il comprend, les informations qu'il demande, le tool qui vérifie l'agenda, et le message de confirmation explicite qu'il envoie après chaque réservation. Prévois le cas où l'agenda est plein et le cas où le client change d'avis.
```$b$;
  v_repere text := $r$### À faire maintenant : concevoir un agent de réservation$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '3558f709-612c-42cf-87c8-cda002a25a0e';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 3558f709-612c-42cf-87c8-cda002a25a0e, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '3558f709-612c-42cf-87c8-cda002a25a0e';
end
$m$;

-- Section 3558f709-612c-42cf-87c8-cda002a25a0e, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : choisir entre no-code et Claude Code

```prompt
Mon besoin : [décris-le]. Dis-moi si un outil no-code suffit ou s'il faut Claude Code. Justifie avec trois critères : la logique métier spécifique, les intégrations précises nécessaires, et l'évolution prévue. Donne ta recommandation en deux phrases.
```$b$;
  v_repere text := $r$### À faire maintenant : choisir entre no-code et Claude Code$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '3558f709-612c-42cf-87c8-cda002a25a0e';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 3558f709-612c-42cf-87c8-cda002a25a0e, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '3558f709-612c-42cf-87c8-cda002a25a0e';
end
$m$;

-- Section 370e3a36-1bdc-4591-bee5-08789494cd5d, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : situer ton projet face au RGPD et à l'AI Act

```prompt
Mon projet IA : [décris-le : quelles données, quel usage, quels utilisateurs].
Dis-moi : 1) quelles données personnelles il traite, 2) les points du RGPD qui s'appliquent (minimisation, information, base légale, droits des personnes), 3) le niveau de risque probable du système selon l'AI Act. Termine par la liste des questions à poser à un juriste. Précise que ceci n'est pas un avis juridique.
```$b$;
  v_repere text := $r$### À faire maintenant : situer ton projet face au RGPD et à l'AI Act$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '370e3a36-1bdc-4591-bee5-08789494cd5d';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 370e3a36-1bdc-4591-bee5-08789494cd5d, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '370e3a36-1bdc-4591-bee5-08789494cd5d';
end
$m$;

-- Section 114cf66b-f748-4ab0-a91d-5986c51752de, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : repérer les données à risque

```prompt
Voici la liste des données que mon projet manipule : [liste-les, sans coller de vraies données].
Pour chacune, évalue l'impact d'une fuite sur la personne concernée et signale celles qui sont des catégories sensibles du RGPD (santé, origine, opinions, orientation). Classe-les de la plus à la moins risquée.
```$b$;
  v_repere text := $r$### À faire maintenant : repérer les données à risque$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '114cf66b-f748-4ab0-a91d-5986c51752de';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 114cf66b-f748-4ab0-a91d-5986c51752de, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '114cf66b-f748-4ab0-a91d-5986c51752de';
end
$m$;

-- Section 114cf66b-f748-4ab0-a91d-5986c51752de, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : cartographier et classer tes flux

```prompt
Voici les flux de données de mon projet : [décris d'où vient la donnée, où elle passe, où elle est stockée].
Fais un tableau : le flux, le niveau (public, interne, confidentiel ou sensible), la mesure de protection adaptée. Signale les flux sur-protégés et ceux qui ne sont pas assez protégés.
```$b$;
  v_repere text := $r$### À faire maintenant : cartographier et classer tes flux$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '114cf66b-f748-4ab0-a91d-5986c51752de';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 114cf66b-f748-4ab0-a91d-5986c51752de, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '114cf66b-f748-4ab0-a91d-5986c51752de';
end
$m$;

-- Section 47d7607c-4857-48c1-a5b0-93a3b8195c6f, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : intégrer la conformité dès le cadrage

```prompt
Ajoute une section « conformité » au brief de mon projet : [colle le brief].
Elle doit contenir : les données minimales strictement nécessaires, la durée de conservation de chacune, comment on répond à une personne qui demande l'accès ou la suppression de ses données, et ce qui est documenté. Garde-la sur une page.
```$b$;
  v_repere text := $r$### À faire maintenant : intégrer la conformité dès le cadrage$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '47d7607c-4857-48c1-a5b0-93a3b8195c6f';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 47d7607c-4857-48c1-a5b0-93a3b8195c6f, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '47d7607c-4857-48c1-a5b0-93a3b8195c6f';
end
$m$;

-- Section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : vérifier la politique du fournisseur

```prompt
Je vais envoyer des données de clients à [fournisseur d'IA]. Cherche dans sa documentation officielle : si mes données servent à entraîner ses modèles selon mon offre, combien de temps elles sont conservées, et s'il existe une option de non-rétention. Donne le lien de chaque source. Si une information n'est pas dans la documentation, dis-le au lieu de supposer.
```

Note ensuite la réponse dans le brief du projet, pour ne plus la chercher.$b$;
  v_repere text := $r$### À faire maintenant : vérifier la politique du fournisseur$r$;
  v_fin_chapitre text := $f$

---

## Atelier 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Atelier 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
end
$m$;

-- Section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : anonymiser avant l'IA

```prompt
Voici la structure de mes données : [liste des colonnes, sans valeurs réelles].
Propose : 1) quelles colonnes sont identifiantes, 2) comment les remplacer par un identifiant généré dans un nœud Set de n8n, 3) comment garder la table de correspondance séparée avec un accès restreint, 4) comment remettre les vraies identités uniquement à la fin, dans un nœud isolé.
```$b$;
  v_repere text := $r$### À faire maintenant : anonymiser avant l'IA$r$;
  v_fin_chapitre text := $f$

---

## Atelier 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Atelier 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
end
$m$;

-- Section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : trier des CV de façon conforme

```prompt
Je trie des CV pour le poste de [poste]. Écris : 1) la liste des champs à extraire (compétences, expérience, disponibilité), 2) la liste des champs à exclure même s'ils sont dans le document, 3) la grille de classement, 4) une note qui explique les critères, pour pouvoir justifier une décision si on me la demande.
```$b$;
  v_repere text := $r$### À faire maintenant : trier des CV de façon conforme$r$;
  v_fin_chapitre text := $f$

---

## Atelier 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Atelier 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
end
$m$;

-- Section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : contrôler tes clés d'API

Fais ces vérifications **toi-même**, sans coller aucune clé dans le chat :

1. Dans le tableau de bord du fournisseur, vérifie qu'une clé existe par projet.
2. Vérifie qu'elle est seulement dans `.env.local` et jamais dans un fichier suivi par Git.
3. Révoque toute clé qui ne sert plus.

Pour vérifier ton dépôt :

```prompt
Cherche dans ce projet et dans son historique Git toute clé d'API, mot de passe ou jeton écrit en clair. Ne les affiche pas en entier : donne seulement le fichier, la ligne et les quatre premiers caractères. Vérifie que .env et .env.local sont bien dans .gitignore.
```$b$;
  v_repere text := $r$### À faire maintenant : contrôler tes clés d'API$r$;
  v_fin_chapitre text := $f$

---

## Atelier 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Atelier 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
end
$m$;

-- Section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : extraire sans conserver

```prompt
Je veux extraire une seule information d'une image : [laquelle, par exemple la date d'expiration]. Écris le prompt à envoyer au modèle, qui demande seulement cette information et rien d'autre. Puis décris le stockage : on garde uniquement le champ extrait, jamais l'image, sauf obligation précise avec accès restreint et durée de conservation définie.
```$b$;
  v_repere text := $r$### À faire maintenant : extraire sans conserver$r$;
  v_fin_chapitre text := $f$

---

## Atelier 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Atelier 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section ed0fd05b-9655-4847-b741-1e2ed59ddb63, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = 'ed0fd05b-9655-4847-b741-1e2ed59ddb63';
end
$m$;

-- Section 7f344169-3542-47ab-aaa0-25b08b02cc75, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : choisir ton outil de prospection

```prompt
Je veux prospecter par email à froid : [volume par mois], pour [cible]. Compare Lemlist, Instantly, Smartlead et Apollo avec trois critères : délivrabilité, intégration avec mes outils, coût selon mon volume. Ne cite aucun prix de mémoire : dis-moi de les vérifier sur leurs sites officiels.
```$b$;
  v_repere text := $r$### À faire maintenant : choisir ton outil de prospection$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7f344169-3542-47ab-aaa0-25b08b02cc75';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7f344169-3542-47ab-aaa0-25b08b02cc75, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7f344169-3542-47ab-aaa0-25b08b02cc75';
end
$m$;

-- Section 7f344169-3542-47ab-aaa0-25b08b02cc75, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : préparer ton domaine d'envoi

```prompt
Je configure Lemlist avec le domaine [domaine d'envoi]. Explique-moi simplement à quoi servent SPF, DKIM et DMARC. Puis donne la procédure pour les ajouter chez mon hébergeur DNS, en me disant de copier les valeurs exactes que Lemlist me fournit, sans les modifier. Termine par comment vérifier que tout est valide.
```

Les valeurs des enregistrements viennent de Lemlist. Copie-les depuis Lemlist, ne les invente pas.$b$;
  v_repere text := $r$### À faire maintenant : préparer ton domaine d'envoi$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7f344169-3542-47ab-aaa0-25b08b02cc75';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7f344169-3542-47ab-aaa0-25b08b02cc75, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7f344169-3542-47ab-aaa0-25b08b02cc75';
end
$m$;

-- Section 7f344169-3542-47ab-aaa0-25b08b02cc75, chapitre 5
do $m$
declare
  v_bloc text := $b$### À faire maintenant : planifier le warm-up

```prompt
Prépare mon calendrier de warm-up : au moins 2 à 3 semaines sans aucune campagne réelle, avec un contrôle du score de réputation chaque semaine. Puis propose un volume d'envoi progressif pour les premières semaines de campagne. Dis-moi quels signaux m'obligent à ralentir.
```$b$;
  v_repere text := $r$### À faire maintenant : planifier le warm-up$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 6 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '7f344169-3542-47ab-aaa0-25b08b02cc75';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 6 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 7f344169-3542-47ab-aaa0-25b08b02cc75, chapitre 5. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '7f344169-3542-47ab-aaa0-25b08b02cc75';
end
$m$;

-- Section 00621a73-6bf1-4698-a75e-1ffa165d1de5, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire ta séquence d'emails

```prompt
Contexte : je prospecte [cible] pour [mon offre].
Objectif : obtenir [action, par exemple un appel de 15 minutes].
Écris une séquence de quatre emails : une accroche, deux relances qui apportent chacune une information nouvelle, et un message de clôture respectueux. Chaque email fait cinq lignes maximum. Ajoute dans chacun une phrase qui permet de se désinscrire.
```$b$;
  v_repere text := $r$### À faire maintenant : écrire ta séquence d'emails$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '00621a73-6bf1-4698-a75e-1ffa165d1de5';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 00621a73-6bf1-4698-a75e-1ffa165d1de5, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '00621a73-6bf1-4698-a75e-1ffa165d1de5';
end
$m$;

-- Section 00621a73-6bf1-4698-a75e-1ffa165d1de5, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : définir tes filtres de recherche

```prompt
Je cherche des prospects pour [offre]. Propose les filtres précis à appliquer dans People Database : fonction, secteur, taille d'entreprise, zone géographique. Ajoute les filtres d'exclusion qui évitent le nettoyage manuel ensuite. Mon but est la qualité de la liste, pas son volume.
```$b$;
  v_repere text := $r$### À faire maintenant : définir tes filtres de recherche$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '00621a73-6bf1-4698-a75e-1ffa165d1de5';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 00621a73-6bf1-4698-a75e-1ffa165d1de5, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '00621a73-6bf1-4698-a75e-1ffa165d1de5';
end
$m$;

-- Section 00621a73-6bf1-4698-a75e-1ffa165d1de5, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : lancer une campagne test

```prompt
Prépare le lancement de ma première campagne test : une liste de 20 à 50 prospects maximum, une séquence validée, un volume quotidien faible cohérent avec mon warm-up. Donne la checklist avant le lancement et les chiffres à regarder chaque jour pendant la première semaine : ouvertures, réponses, rebonds.
```$b$;
  v_repere text := $r$### À faire maintenant : lancer une campagne test$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '00621a73-6bf1-4698-a75e-1ffa165d1de5';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 00621a73-6bf1-4698-a75e-1ffa165d1de5, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '00621a73-6bf1-4698-a75e-1ffa165d1de5';
end
$m$;

-- Section 00621a73-6bf1-4698-a75e-1ffa165d1de5, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : suivre les réponses

```prompt
Crée mon Tracking Sheet : les colonnes à suivre pour chaque prospect (nom, entreprise, date du dernier message, statut chaud, tiède ou froid, prochaine action). Puis écris trois modèles de réponse : à un prospect intéressé, à un prospect qui demande plus d'informations, à un prospect qui refuse poliment.
```$b$;
  v_repere text := $r$### À faire maintenant : suivre les réponses$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '00621a73-6bf1-4698-a75e-1ffa165d1de5';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 00621a73-6bf1-4698-a75e-1ffa165d1de5, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '00621a73-6bf1-4698-a75e-1ffa165d1de5';
end
$m$;

-- Section 28ef214e-a12c-4581-9d42-fbfd71adcebd, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : contrôler une campagne IA

```prompt
Je lance une campagne personnalisée par IA. Écris le prompt qui génère la phrase de personnalisation à partir de données réelles du prospect (entreprise, poste, actualité publique). Il doit refuser d'inventer : si une donnée manque, il écrit une phrase neutre. Ajoute ma checklist de relecture d'un échantillon de vingt messages avant le lancement complet.
```$b$;
  v_repere text := $r$### À faire maintenant : contrôler une campagne IA$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '28ef214e-a12c-4581-9d42-fbfd71adcebd';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 28ef214e-a12c-4581-9d42-fbfd71adcebd, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '28ef214e-a12c-4581-9d42-fbfd71adcebd';
end
$m$;

-- Section 28ef214e-a12c-4581-9d42-fbfd71adcebd, chapitre 2
do $m$
declare
  v_bloc text := $b$### À faire maintenant : monter un test A/B

```prompt
Je veux tester l'objet de mon email. Propose deux versions de l'objet qui ne changent qu'un seul élément. Dis-moi la taille minimale de chaque groupe, la durée du test, et le chiffre qui décide du gagnant. Ne propose pas de tester plusieurs choses à la fois.
```$b$;
  v_repere text := $r$### À faire maintenant : monter un test A/B$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 3 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '28ef214e-a12c-4581-9d42-fbfd71adcebd';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 3 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 28ef214e-a12c-4581-9d42-fbfd71adcebd, chapitre 2. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '28ef214e-a12c-4581-9d42-fbfd71adcebd';
end
$m$;

-- Section 28ef214e-a12c-4581-9d42-fbfd71adcebd, chapitre 3
do $m$
declare
  v_bloc text := $b$### À faire maintenant : écrire une personnalisation conditionnelle

```prompt
Je veux un message qui change selon le prospect : [décris la condition, par exemple secteur A ou secteur B]. Lis la documentation officielle de Lemlist sur la syntaxe liquid et écris la phrase conditionnelle correspondante. Si tu n'es pas certain de la syntaxe exacte, dis-le et renvoie-moi à la page de la documentation.
```$b$;
  v_repere text := $r$### À faire maintenant : écrire une personnalisation conditionnelle$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 4 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '28ef214e-a12c-4581-9d42-fbfd71adcebd';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 4 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 28ef214e-a12c-4581-9d42-fbfd71adcebd, chapitre 3. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '28ef214e-a12c-4581-9d42-fbfd71adcebd';
end
$m$;

-- Section 28ef214e-a12c-4581-9d42-fbfd71adcebd, chapitre 4
do $m$
declare
  v_bloc text := $b$### À faire maintenant : construire un scénario multicanal

```prompt
Construis un scénario sur trois canaux : email, LinkedIn, appel. Précise l'ordre, les délais entre chaque étape, et les branches selon le comportement du prospect : a ouvert sans répondre, a cliqué, n'a rien fait. Chaque canal doit ajouter une information nouvelle, pas répéter le message précédent.
```$b$;
  v_repere text := $r$### À faire maintenant : construire un scénario multicanal$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 5 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '28ef214e-a12c-4581-9d42-fbfd71adcebd';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 5 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 28ef214e-a12c-4581-9d42-fbfd71adcebd, chapitre 4. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '28ef214e-a12c-4581-9d42-fbfd71adcebd';
end
$m$;

-- Section 59dfa9b7-a7a9-4237-8874-c1e098a3fb4a, chapitre 1
do $m$
declare
  v_bloc text := $b$### À faire maintenant : nettoyer ta liste avant l'envoi

```prompt
Voici la structure de ma liste de prospects : [colonnes, sans données réelles]. Propose le nettoyage à faire avant l'import dans Lemlist : doublons, emails invalides, champs vides, formats incohérents. Si je veux collecter de nouvelles données par scraping, liste d'abord ce que je dois vérifier : les conditions d'utilisation du site et le RGPD, car une donnée publique reste soumise à ces règles.
```$b$;
  v_repere text := $r$### À faire maintenant : nettoyer ta liste avant l'envoi$r$;
  v_fin_chapitre text := $f$

---

## Chapitre 2 :$f$;
  v_fin_dernier text := $q$

---

## Questions pour les apprenants$q$;
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '59dfa9b7-a7a9-4237-8874-c1e098a3fb4a';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position($c$## Chapitre 2 :$c$ in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section 59dfa9b7-a7a9-4237-8874-c1e098a3fb4a, chapitre 1. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\n\n' || v_bloc || v_fin) where id = '59dfa9b7-a7a9-4237-8874-c1e098a3fb4a';
end
$m$;
