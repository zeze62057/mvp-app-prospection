@@ SECTION d3ce0bca-6dff-4d41-9f93-91211b948abc  Les Fondations

@@ CHAPITRE 1
### À faire maintenant : installer et lancer Claude Code

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
```

@@ CHAPITRE 2
### À faire maintenant : ouvrir ton espace de travail

Ouvre VS Code dans le dossier de ton projet. Depuis le terminal, dans ce dossier :

```bash
code .
```

Si la commande `code` n'est pas reconnue, ouvre VS Code, puis choisis « Fichier », « Ouvrir le dossier ».

Ouvre ensuite le terminal intégré (menu Terminal, puis « New Terminal »), lance `claude`, et colle ce prompt :

```prompt
Liste les fichiers et les dossiers de ce projet. Pour chacun, explique en une phrase à quoi il sert. Ne modifie rien.
```

Tu vois la réponse dans le terminal. Ouvre ensuite dans l'éditeur un des fichiers cités pour vérifier ce que Claude a dit.

@@ CHAPITRE 3
### À faire maintenant : mettre Git en route

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

Tu dois recevoir un plan à valider, et rien n'est commité tant que tu n'as pas répondu.

@@ CHAPITRE 4
### À faire maintenant : préparer la mise en ligne

Avant de déployer, vérifie que le projet se construit sans erreur sur ta machine :

```bash
npm run build
```

Si la commande affiche une erreur, copie le message **en entier** et utilise le prompt de debug du chapitre 4 de la section « La Méthode ».

Puis demande à Claude Code de préparer le déploiement :

```prompt
Prépare ce projet pour un déploiement sur Vercel. Vérifie que le build fonctionne. Liste les variables d'environnement à renseigner dans Vercel, sans écrire aucune valeur secrète. Dis-moi ce qu'il faut cliquer dans Vercel, étape par étape. Ne déploie rien toi-même.
```

Dans Vercel : « Add New Project », choisis ton dépôt GitHub, valide la configuration proposée. Chaque `git push` sur la branche principale redéploie ensuite le site.

@@ SECTION db8298cf-58a8-4f42-8320-c502e4a72948  La Methode

@@ CHAPITRE 1
### À faire maintenant : choisir entre prototype et livrable

Avant de commencer un projet, colle ce prompt. Remplace ce qui est entre crochets :

```prompt
Je veux construire : [décris ton projet en une ou deux phrases].
Dis-moi d'abord si c'est un prototype jetable ou un livrable pour un vrai usage. Pose-moi les questions qui te manquent pour trancher. Ensuite, propose la façon de travailler adaptée : vite et à l'instinct pour un prototype, avec un plan et des vérifications pour un livrable. N'écris aucun code pour l'instant.
```

Tu dois recevoir des questions, puis une méthode adaptée. Réponds, puis valide avant qu'il commence.

@@ CHAPITRE 2
### À faire maintenant : écrire une instruction complète

Copie ce modèle, puis remplace chaque ligne entre crochets. Il contient les quatre éléments du chapitre.

```prompt
Contexte : je travaille sur [nom du projet], pour [qui], avec ces contraintes : [contraintes].
Objectif : à la fin, ceci doit être vrai : [résultat précis et vérifiable].
Périmètre : tu peux modifier [fichiers ou zones concernés]. Ne touche pas à [ce qui doit rester intact].
Autonomie : propose-moi ton plan et attends mon accord avant d'agir sur [point sensible].
```

Tu dois obtenir un plan qui respecte ton périmètre. Si la réponse sort du cadre, ajoute la règle manquante et relance.

@@ CHAPITRE 3
### À faire maintenant : appliquer Plan, Execute, Validate

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

Tu dois recevoir un compte rendu honnête, avec ce qui n'a pas pu être vérifié.

@@ CHAPITRE 4
### À faire maintenant : diagnostiquer une erreur

Quand quelque chose casse, colle le message **en entier**. Remplace la zone entre crochets :

```prompt
Voici le message d'erreur complet :
[colle ici tout le message, sans le résumer]

Ne corrige pas encore. D'abord : 1) explique la cause en termes simples, 2) dis si l'erreur arrive partout ou seulement dans un cas précis, 3) propose une correction et dis ce qu'elle change. Attends mon accord avant de modifier quoi que ce soit.
```

Tu dois recevoir un diagnostic avant toute correction. Valide, puis demande la correction.

@@ SECTION 10a89d0b-5822-4598-a71e-4524aeca1be6  Maitriser l'outil

@@ CHAPITRE 1
### À faire maintenant : régler comment Claude te demande l'autorisation

Colle ce prompt au début d'une session :

```prompt
Pour lire un fichier ou chercher dans le projet, avance sans me demander. Avant toute action qui modifie, supprime ou envoie quelque chose, explique ce que tu vas faire, ce qui change, et si on peut revenir en arrière. Attends mon accord.
```

Tu dois voir Claude te demander une validation avant chaque action sensible. Lis la proposition avant de répondre.

@@ CHAPITRE 2
### À faire maintenant : créer le CLAUDE.md de ton projet

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

Tu dois retrouver ces règles appliquées dès la prochaine session. Relance `claude` et pose une question pour le vérifier.

@@ CHAPITRE 3
### À faire maintenant : créer un Slash Command et un Skill

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

La `description` est ce qui permet à Claude de savoir quand utiliser le skill. Écris-la avec soin.

@@ CHAPITRE 4
### À faire maintenant : connecter un serveur MCP

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

Tu dois voir le serveur dans la liste. Si la connexion échoue par timeout, vérifie que `npx` est accessible depuis le terminal.

@@ CHAPITRE 5
### À faire maintenant : poser ton premier hook

Demande à Claude Code de le configurer. C'est le chemin le plus fiable :

```prompt
Configure un hook PreToolUse dans .claude/settings.json qui bloque toute modification du fichier .env. Montre-moi la configuration complète avant de l'écrire. Après l'avoir écrite, teste-la en essayant de modifier .env, et dis-moi si le blocage a fonctionné.
```

Tu dois voir une tentative de modification refusée. Si rien n'est bloqué, redemande en collant le message obtenu.

@@ CHAPITRE 6
### À faire maintenant : poser une arborescence propre

```prompt
Propose une arborescence pour ce projet. Elle doit séparer clairement : le code, la documentation, la configuration, et les livrables finis. Montre-la sous forme d'arbre, avec une phrase par dossier. Attends ma validation avant de déplacer ou de renommer le moindre fichier.
```

Tu dois recevoir un arbre de dossiers à valider. Corrige-le avant de dire oui.

@@ CHAPITRE 7
### À faire maintenant : garder les coûts sous contrôle

```prompt
Tâche : [décris la tâche].
Découpe-la en étapes vérifiables. Dis-moi laquelle sera la plus lourde. Traite une seule étape à la fois et arrête-toi après chacune. Ne lis et ne modifie que les fichiers réellement concernés.
```

Tu dois recevoir un découpage court. Valide-le, puis avance étape par étape.

@@ SECTION 8c117912-17f4-4926-8115-6422ca447552  Claude Code au quotidien

@@ CHAPITRE 1
### À faire maintenant : monter ton second brain

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

Au début de chaque session, tape `/prime`. Tu dois recevoir ton résumé, sans rien réexpliquer.

@@ CHAPITRE 2
### À faire maintenant : préparer un livrable pour un client

```prompt
Je livre [nom du projet] à [type de client]. Prépare deux documents. 1) Une documentation d'usage : ce qui a été fait, comment l'utiliser au quotidien, que faire en cas de problème. 2) Une note pour le dirigeant, sans aucun mot technique : ce que ça lui apporte, en phrases courtes, avec un exemple concret de sa journée. Montre-moi les deux avant de les enregistrer.
```

Tu dois recevoir deux textes distincts. Relis le second comme si tu étais le dirigeant.

@@ CHAPITRE 3
### À faire maintenant : suivre ton activité

```prompt
Crée un fichier de suivi pour mon activité. Il doit contenir : un tableau de facturation unique pour toutes mes activités, et un tableau de KPIs par semaine pour chacune (prospects contactés, rendez-vous obtenus, chiffre d'affaires). Pose-moi d'abord la liste de mes activités et les chiffres que je veux suivre. Montre-moi la structure avant de l'enregistrer.
```

Ensuite, mets à jour d'une phrase, par exemple :

```prompt
Cette semaine sur [activité] : [nombre] prospects contactés, [nombre] rendez-vous. Mets à jour la bonne ligne du fichier de suivi.
```

Tu dois voir une seule ligne modifiée, la bonne. Vérifie-la avant de continuer.
