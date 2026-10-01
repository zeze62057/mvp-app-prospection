-- Début de formation : « Présentation du formateur » et « Installation des outils », avant le Module 1 de Vivier IA.
-- GENERE par scripts/generer-section-0.mjs depuis supabase/contenu/section-0/ : ne pas modifier à la main.
--
-- Ordre final : Bienvenue (-2), Présentation du formateur (-1), Installation des outils (0), puis les sections 1 à 7.
-- Additif et idempotent : « Bienvenue » est déplacée une seule fois, chaque nouvelle section n'est créée que
-- si sa place est libre, aucune section de contenu existante n'est modifiée. Appliquer 0054 avant celle-ci.

update sections set ordre = -2
where ordre = 0 and titre = 'Bienvenue'
  and module_id = (select m.id from modules m join espaces e on e.id = m.espace_id where e.slug = 'vivier-ia' and m.ordre = 1);

insert into sections (module_id, ordre, titre, contenu)
select m.id, -1, 'Présentation du formateur', $f$## Chapitre 1 : Qui est ton formateur

### Zézé Bilivogui, fondateur de Vivier IA

Zézé Bilivogui a créé Vivier IA. Il n'a pas grandi dans le code : il a grandi en Guinée Forestière. Le déclic n'est pas venu d'une formation d'informatique classique. Il est venu du moment où il a commencé à utiliser Claude Code sur de vrais projets, avant de tout comprendre en théorie, et où il a appris la méthode en marchant, projet après projet.

### Pourquoi cette histoire compte pour toi

Elle te dit une chose simple : tu n'as pas besoin d'un parcours technique pour commencer. La posture compte plus que le diplôme. Si ton formateur a appris en pratiquant sur des besoins réels, tu peux le faire aussi, avec une méthode qui t'évite ses détours.

### Ce qu'il fait aujourd'hui

Il accompagne des entreprises dans l'usage de l'IA, et il forme celles et ceux qui veulent construire avec elle. Vivier IA réunit les deux : ce qu'il enseigne ici est ce qu'il pratique.

### Ce que tu peux attendre de lui

Une pédagogie centrée sur la pratique. Chaque chapitre te fait faire un vrai geste. Les outils changent vite, donc la formation insiste sur la méthode, qui reste valable quand les outils évoluent.

**Points clés**
- Le formateur n'est pas venu du code : il a appris en pratiquant sur de vrais projets
- La posture compte plus que le diplôme
- Ce qu'il enseigne ici est ce qu'il pratique

### À faire maintenant : te présenter à la communauté

La meilleure façon de commencer est de te présenter. Colle ce prompt dans Claude Code ou dans ton assistant. Remplace ce qui est entre crochets :

```prompt
Aide-moi à écrire ma présentation pour la communauté Vivier IA, en cinq lignes maximum. Voici les éléments : mon prénom : [prénom]. Ce que je fais : [activité]. Pourquoi je suis ici : [ce que je veux obtenir de la formation]. Mon premier projet en tête : [projet, même flou].
Écris-la simple, sincère, sans mots compliqués. Termine par une question que je pose aux autres membres.
```

Tu dois recevoir un court texte à poster dans la communauté. Relis-le, change ce qui ne te ressemble pas, puis publie-le.

---

## Chapitre 2 : Comment il enseigne

### Une vidéo courte, un vrai geste

Chaque chapitre a une vidéo courte et un bloc « À faire maintenant ». La vidéo explique, le bloc te fait faire. Tu n'apprends vraiment que quand tu as fait.

### Honnête sur ce qui marche et ce qui ne marche pas

La formation te dit ce que la méthode permet réellement de livrer, et ce qu'il ne faut pas promettre. Elle ne vend pas de résultat garanti. Un résultat vient d'un travail régulier, avec une vérification à chaque étape.

### Un outil qui évolue, une méthode qui reste

Claude Code et les outils autour changent chaque mois. Tu n'as pas à tout mémoriser. Tu apprends à cadrer un problème, à tester, à vérifier avant d'avancer. Cette méthode reste utile quand les outils changent.

### Poser tes questions

Si tu bloques, ou si un résultat te surprend, pose ta question dans la communauté. Colle le message d'erreur en entier et dis où tu en es. C'est le bon réflexe, et il aide aussi les autres.

**Points clés**
- Une vidéo pour comprendre, un bloc pour pratiquer
- Honnêteté : pas de résultat promis, une méthode qui se vérifie
- Les questions se posent dans la communauté, avec l'erreur en entier

### À faire maintenant : écrire ton engagement

```prompt
Je veux m'engager sur la formation Vivier IA. Aide-moi à écrire un engagement de trois lignes, réaliste : ce que je fais chaque semaine, ce que je veux avoir construit dans trois mois, et la personne à qui je rendrai des comptes. Ne me propose rien d'irréaliste. Pose-moi d'abord deux questions sur mes disponibilités.
```

Tu dois recevoir un engagement court et tenable. Garde-le sous les yeux.

---

## Questions pour les apprenants

### Compréhension
1. Qu'est-ce que le parcours du formateur t'apprend sur le fait de commencer sans formation technique ?
2. Quelle est la différence entre regarder une vidéo et pratiquer un chapitre ?
3. Pourquoi la formation insiste-t-elle sur la méthode plus que sur les outils ?

### Réflexion
4. Qu'est-ce qui te retient de commencer aujourd'hui ? Comment ce chapitre répond-il à ce frein ?
5. Quelle question aimerais-tu poser au formateur ? Écris-la dans la communauté.$f$
from modules m
join espaces e on e.id = m.espace_id
where e.slug = 'vivier-ia' and m.ordre = 1
on conflict (module_id, ordre) do nothing;

insert into sections (module_id, ordre, titre, contenu)
select m.id, 0, 'Installation des outils', $o$## Chapitre 1 : Les outils dont tu as besoin

### Une petite boîte à outils, installée une seule fois

Pour suivre la formation, tu as besoin de six outils. Tu les installes une fois, dans cet ordre, et ils te servent pour tous les modules. Compte une heure, sans te presser.

1. **Node.js** : le moteur qui permet d'installer Claude Code.
2. **Claude Code** : l'agent qui code pour toi. C'est l'outil central de la formation.
3. **Visual Studio Code** : la fenêtre où tu vois les fichiers de ton projet.
4. **Git** : l'historique de ton projet, ton filet de sécurité.
5. **GitHub** : l'endroit où cet historique est sauvegardé en ligne.
6. **Vercel** : l'endroit où ton projet est mis en ligne.

### Ce que tu n'as pas besoin de faire

Tu n'as pas besoin de comprendre comment chaque outil fonctionne à l'intérieur. Tu as seulement besoin qu'il soit installé et qu'il réponde. Chaque outil a un petit test à la fin du chapitre : si le test passe, tu es prêt.

### Un conseil pour la suite

Si une étape bloque, ne recommence pas au hasard. Lis le message d'erreur en entier, puis demande de l'aide dans la communauté en le collant tel quel. C'est exactement le réflexe enseigné au Module 1.

**Points clés**
- Six outils, installés une seule fois, dans un ordre précis
- Chaque outil a un test simple pour vérifier qu'il fonctionne
- En cas de blocage : lire l'erreur en entier, puis demander de l'aide

### À faire maintenant : préparer ton dossier de travail

Crée un dossier neuf pour ta formation, par exemple `formation-vivier-ia`, et ouvre un terminal dedans. Sur Windows, ouvre le dossier dans l'Explorateur, puis tape `cmd` dans la barre d'adresse et appuie sur Entrée.

Pour savoir quel système tu utilises, colle ce prompt dans n'importe quel assistant IA :

```prompt
J'utilise [Windows, Mac ou Linux]. Je vais installer Node.js, Claude Code, Visual Studio Code, Git, un compte GitHub et un compte Vercel pour suivre une formation. Dis-moi les trois pièges les plus fréquents pour mon système, et comment les éviter. Réponds en cinq lignes maximum.
```

Tu dois recevoir trois pièges concrets, adaptés à ton système.

---

## Chapitre 2 : Installer Node.js et Claude Code

### Pourquoi Node.js d'abord

Claude Code s'installe avec une commande qui a besoin de Node.js. Sans lui, la commande ne fonctionne pas. Il faut la version 18 ou plus récente.

### Les deux installations

Tu installes Node.js une fois, puis Claude Code avec une seule commande. À la première utilisation de Claude Code, une connexion à ton compte est demandée : suis simplement les instructions affichées à l'écran.

Ces étapes sont les mêmes sur Windows, Mac et Linux, tant que Node.js est présent.

**Points clés**
- Node.js d'abord, version 18 ou plus récente, de préférence la version LTS
- Claude Code s'installe ensuite en une seule commande
- Après l'installation, ferme et rouvre le terminal

### À faire maintenant : installer et tester

**Étape 1.** Installe Node.js. Va sur nodejs.org et choisis la version **LTS**. Lance l'installateur avec les options proposées. Ferme puis rouvre ton terminal.

**Étape 2.** Vérifie que Node.js répond :

```bash
node --version
```

Tu dois voir un numéro de version, par exemple `v20.11.0`.

**Étape 3.** Installe Claude Code :

```bash
npm install -g @anthropic-ai/claude-code
```

**Étape 4.** Vérifie que Claude Code répond :

```bash
claude --version
```

Tu dois voir un numéro de version.

**Étape 5.** Lance-le dans ton dossier de formation :

```bash
claude
```

Suis la connexion affichée à l'écran. Pour sortir, tape `/exit`.

**Si l'installation a été coupée** (erreur du type « binaire natif non installé »), repars propre :

```bash
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code
```

**Si Windows bloque les scripts** (erreur PowerShell « l'exécution de scripts est désactivée »), regarde d'abord la politique actuelle :

```powershell
Get-ExecutionPolicy -List
```

Puis autorise les scripts locaux pour ton compte seulement :

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Si `node` ou `npx` restent introuvables après l'installation, ferme et rouvre le terminal, ou redémarre l'ordinateur. C'est presque toujours un problème de PATH qui n'a pas été mis à jour.

---

## Chapitre 3 : Installer Visual Studio Code et Git

### Deux outils pour voir et pour protéger

**Visual Studio Code** est la fenêtre où tu vois les fichiers que Claude Code crée et modifie. Tu n'as pas besoin d'y écrire du code : tu t'en sers pour t'y repérer.

**Git** garde une photo datée de ton projet à chaque étape. Si quelque chose casse, tu reviens à une version qui marchait.

**Points clés**
- VS Code sert à voir ce que Claude Code a fait, pas à écrire du code toi-même
- Git garde un historique réversible de ton projet
- Git se configure une seule fois, juste après l'installation

### À faire maintenant : installer et configurer

**Visual Studio Code.** Télécharge-le sur code.visualstudio.com et installe-le comme une application normale. Ouvre ensuite ton dossier de formation depuis le terminal :

```bash
code .
```

Si la commande `code` n'est pas reconnue, ouvre VS Code, puis choisis « Fichier », « Ouvrir le dossier ».

**Git.** Sous Windows, télécharge l'installateur sur git-scm.com et garde les options proposées. Sous Mac, tape la commande ci-dessous : macOS propose d'installer les outils nécessaires si Git est absent. Sous Linux (Debian ou Ubuntu), utilise `sudo apt install git`.

```bash
git --version
```

Tu dois voir un numéro de version.

**Configure Git une seule fois.** Remplace par ton nom et ton email :

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton.email@exemple.com"
```

---

## Chapitre 4 : Créer tes comptes GitHub et Vercel

### Un compte pour sauvegarder, un compte pour publier

**GitHub** héberge l'historique de ton projet en ligne. C'est ta sauvegarde hors de ton ordinateur.

**Vercel** met ton projet en ligne en quelques minutes. Le plus simple est de t'y connecter directement avec ton compte GitHub.

### Un point de sécurité à retenir

GitHub ne demande pas ton mot de passe classique pour envoyer du code : il demande un **jeton d'accès personnel**. Ce jeton donne accès à ton compte. Ne le colle jamais dans un prompt, dans un fichier du projet, ni dans une conversation.

**Points clés**
- GitHub sauvegarde ton historique, Vercel met ton projet en ligne
- Connecte-toi à Vercel avec ton compte GitHub pour aller plus vite
- Un jeton d'accès ne se partage jamais : ni prompt, ni fichier, ni chat

### À faire maintenant : créer les deux comptes

**GitHub.** Crée un compte gratuit sur github.com.

**Vercel.** Crée un compte gratuit sur vercel.com, en choisissant la connexion avec GitHub.

**Le jeton GitHub, le moment venu.** Quand tu enverras ton premier projet, GitHub te demandera un jeton. Tu le crées dans « Settings », puis « Developer settings », puis « Personal access tokens ». Garde-le dans un gestionnaire de mots de passe.

Pour qu'une IA t'aide sans jamais voir ton jeton :

```prompt
Je vais envoyer mon premier projet sur GitHub. Explique-moi, étape par étape, comment créer un dépôt vide et comment m'authentifier avec un jeton d'accès personnel. Ne me demande jamais de te donner le jeton : je le saisis moi-même dans le terminal. Avance une étape à la fois et attends mon accord.
```

Tu dois recevoir des étapes à suivre une à une, sans qu'on te demande ton jeton.

---

## Chapitre 5 : Vérifier que tout fonctionne

### Un seul contrôle pour tout valider

Avant de passer au Module 1, fais un contrôle complet. Si les cinq commandes répondent, ton poste est prêt.

**Points clés**
- Cinq commandes suffisent pour valider toute l'installation
- Une commande qui ne répond pas indique l'outil à reprendre
- Ne passe au Module 1 que quand tout répond

### À faire maintenant : le contrôle final

Dans ton terminal, lance ces commandes une par une :

```bash
node --version
npm --version
git --version
claude --version
code --version
```

Tu dois voir un numéro de version pour chacune. Si l'une renvoie une erreur, reprends le chapitre de l'outil concerné.

Puis fais vérifier l'ensemble par Claude Code :

```prompt
Vérifie mon poste de travail pour la formation Vivier IA. Lance les commandes node --version, npm --version, git --version et claude --version. Dis-moi pour chacune si elle répond, et ce qui manque. Vérifie aussi que Git connaît mon nom et mon email (git config --global --get user.name et user.email). Ne modifie rien : donne-moi seulement un état des lieux.
```

Tu dois recevoir un état des lieux point par point. Quand tout est au vert, tu peux commencer le Module 1.

---

## Questions pour les apprenants

### Compréhension
1. Quels sont les six outils à installer, et à quoi sert chacun ?
2. Pourquoi faut-il installer Node.js avant Claude Code ?
3. Pourquoi ne doit-on jamais coller un jeton GitHub dans un prompt ?

### Réflexion
4. Quel outil t'a posé le plus de difficulté ? Que ferais-tu différemment si tu devais le réinstaller ?
5. Décris en deux phrases ce que tu pourrais construire avec cette boîte à outils.$o$
from modules m
join espaces e on e.id = m.espace_id
where e.slug = 'vivier-ia' and m.ordre = 1
on conflict (module_id, ordre) do nothing;
