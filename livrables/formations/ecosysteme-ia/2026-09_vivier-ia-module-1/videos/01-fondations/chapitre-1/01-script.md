# Vidéo : Pourquoi Claude Code va changer votre métier

Module 1, section 1 « Les Fondations », chapitre 1. Source : `01-fondations.md`, chapitre 1.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait pourquoi son rôle passe de traducteur vers la machine à architecte et validateur, et il a lancé Claude Code sur son ordinateur.
- **Signal de réussite** : la commande `claude` démarre dans un dossier de projet. C'est la première action du guide de réussite (étape 1) : « lancer Claude Code sur un dossier vide ».
- **Prérequis de l'élève** : Node.js version 18 ou plus récente, une connexion internet stable, un compte Anthropic (ou Claude Pro ou Max).
- **Durée cible** : entre 8 et 10 minutes. Le chapitre mêle un changement de posture et une installation. Au-delà de 10 minutes, mieux vaut couper que d'allonger.
- **Exemple concret qui porte la vidéo** : l'audit d'intelligence artificielle pour un client de l'immobilier, avant et après Claude Code.

## 2. Points à valider avec Zézé avant d'enregistrer

Le chapitre du cours est écrit pour Zézé, pas pour des élèves. Trois passages ont été adaptés dans le script. Rien d'autre n'a été changé sur le fond.

1. **Le troisième basculement** dit dans le cours : « vu où tu veux aller (cabinet de conseil, école) » et « c'est exactement le modèle économique que Chatllow peut exploiter ». Ce texte s'adresse à Zézé. Dans le script, il devient : « pour un consultant, un formateur ou un entrepreneur ». Le fond est identique, la référence personnelle est retirée.
2. **L'exemple concret** cite « les starters construits dans ce workspace ». Ce lieu est interne. Le script garde l'exemple (un audit d'IA pour un client de l'immobilier) sans nommer le workspace ni les dossiers.
3. **Le renvoi** « chapitre 2 de la section suivante » devient « la section 2, consacrée à la méthode », pour que l'élève sache où aller. Cette section est bien `02-methode.md`.

Si Zézé préfère garder les références à Chatllow, à dire avant l'enregistrement. Il faut alors s'assurer qu'elles ont leur place dans une vidéo destinée aux élèves.

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans le Module 1. Aujourd'hui, une question simple : qu'est-ce que Claude Code change dans votre métier ? Nous verrons trois choses. Ce qui change. Ce qui ne change pas. Puis nous installerons Claude Code ensemble, pas à pas. À la fin, vous l'aurez lancé sur votre ordinateur. | Diapositive 1 (titre, objectif et plan). | Aucune. Sourire, ton posé. |
| 0:22 | Commençons par le constat. Jusqu'à récemment, pour créer une application, il fallait connaître un langage de programmation. Sa syntaxe. Sa structure. Ses bibliothèques. Le développeur traduisait une idée en instructions précises. C'est ce que la machine comprend. Avec Claude Code, cela change. Vous décrivez votre idée en langage naturel. Un agent d'intelligence artificielle, Claude, fait la traduction. Il exécute. Il teste. Il corrige. Votre rôle bascule. Vous n'êtes plus le traducteur vers la machine. Vous devenez l'architecte et le validateur. | Diapositive 2 : avant, idée puis syntaxe puis machine. Maintenant, idée puis Claude puis résultat. | Faire apparaître la deuxième ligne au moment de « Avec Claude Code, cela change ». |
| 0:56 | Premier basculement : la barrière technique s'effondre. Mais pas les compétences. Ne pas savoir écrire une ligne de Python ou de JavaScript n'est plus un mur. Attention : cela ne veut pas dire que tout devient facile. L'effort se déplace. Avant, vous appreniez une syntaxe. Maintenant, vous apprenez à cadrer un problème. À donner un contexte clair. À valider un résultat. C'est une autre compétence. Ce n'est pas une absence de compétence. | Diapositive 3, ligne 1 mise en avant. | Passer à la ligne suivante de la diapositive 3 à la fin du paragraphe. |
| 1:27 | Deuxième basculement : la vitesse change d'ordre de grandeur. Un projet qui demandait des semaines à une équipe peut se construire en quelques heures ou quelques jours. Cela vaut pour un produit simple à moyen, si la personne aux commandes sait cadrer et valider. Cela ne remplace pas un système bancaire critique. Mais cela couvre une immense partie des besoins d'un entrepreneur : des sites, des applications internes, des outils métier, des premières versions de produit. | Diapositive 3, ligne 2 mise en avant. | Passer à la ligne suivante à la fin du paragraphe. |
| 2:00 | Troisième basculement : le métier devient un produit de bout en bout. Claude Code ne se limite pas à écrire du code. Il vous accompagne du terminal jusqu'au déploiement. Il gère Git, l'hébergement, les tests. Une seule personne peut donc livrer un produit complet à un client, sans équipe technique derrière. Pour un consultant, un formateur ou un entrepreneur, c'est un modèle puissant : conseiller et exécuter, par la même personne. | Diapositive 3, ligne 3 mise en avant. | Aucune. |
| 2:30 | Un point important, pour ne pas survendre. Claude Code ne remplace pas votre jugement. Il exécute bien ce que vous lui demandez bien. Un mauvais cadrage produit un mauvais résultat, et il le produit vite. La compétence rare n'est donc pas de savoir coder. C'est de savoir cadrer, découper et vérifier. Nous y reviendrons en détail dans la section 2, consacrée à la méthode. | Diapositive 4, partie haute : « Savoir cadrer, découper, vérifier ». | Aucune. |
| 2:57 | Prenons un exemple. Un audit d'intelligence artificielle pour un client de l'immobilier. Avant, ce projet aurait demandé un développeur et un chef de projet, pendant plusieurs semaines. Avec Claude Code, une seule personne cadre l'audit. Elle décide des questions à poser et du rapport à produire. Elle écrit une instruction claire. Elle valide chaque étape. Et elle livre un outil fonctionnel en quelques jours. Le travail ne disparaît pas. Il change de nature. Moins de syntaxe. Plus de jugement sur ce qu'il faut construire et vérifier. | Diapositive 4, partie basse : avant (plusieurs semaines, une équipe) et après (quelques jours, une personne). | Aucune. |
| 3:34 | Passons à la pratique. Claude Code s'installe en ligne de commande. Il faut d'abord Node.js, en version 18 ou plus récente. Je vérifie dans le terminal avec la commande node tiret tiret version. Si Node.js n'est pas installé chez vous, téléchargez-le sur nodejs.org et choisissez la version LTS. | Diapositive 5, puis bascule sur le terminal en plein écran, police agrandie. | Taper `node --version` et laisser apparaître le numéro. |
| 4:15 | Ensuite, une seule commande : npm install tiret g arobase anthropic slash claude tiret code. Je la tape et je laisse tourner. | Terminal. | Taper `npm install -g @anthropic-ai/claude-code` et attendre la fin. Cette attente peut être coupée au montage. |
| 5:24 | Puis je lance Claude Code en tapant claude, à l'intérieur du dossier de mon projet. Ici, un dossier vide. À la première utilisation, une connexion à votre compte Anthropic est demandée. Suivez simplement les instructions affichées à l'écran. Ces étapes sont identiques sur Windows, Mac et Linux, tant que Node.js est présent. | Terminal : lancement de `claude` dans un dossier vide, écran de connexion. | Taper `claude`. Masquer ou flouter l'adresse e-mail du compte à l'écran de connexion. |
| 6:32 | Deux blocages reviennent souvent. Ce ne sont pas des échecs personnels. Premier cas : l'installation coupée en cours de route. Si votre connexion flanche, l'installation peut sembler terminée, mais rester incomplète. La commande claude tiret tiret version renvoie alors une erreur. Ne relancez pas par-dessus. Désinstallez avec npm uninstall tiret g, puis le même nom de paquet, et réinstallez quand la connexion est stable. | Diapositive 6 avec les deux blocages, ou terminal si vous les montrez en vrai. | Optionnel : montrer `claude --version`. Ne pas provoquer de coupure réelle. |
| 7:14 | Second cas, sous Windows. PowerShell affiche : l'exécution de scripts est désactivée sur ce système. C'est une protection par défaut, pas un défaut de Claude Code. La commande Get-ExecutionPolicy tiret List montre une politique Undefined pour l'utilisateur. La correction : Set-ExecutionPolicy, tiret Scope CurrentUser, tiret ExecutionPolicy RemoteSigned. Elle autorise les scripts locaux. Elle n'autorise pas n'importe quel script téléchargé sans signature. La sécurité reste réelle. | Diapositive 6 (commande à l'écran), ou PowerShell si vous enregistrez sous Windows. | Si Windows : taper `Get-ExecutionPolicy -List`. Ne pas modifier la politique de votre poste pendant l'enregistrement. |
| 8:02 | Dans les deux cas, le réflexe est le même : lire le message d'erreur en entier, diagnostiquer, puis corriger. Pas recommencer à l'aveugle. Retenons trois points. Votre rôle : architecte et validateur, pas traducteur de syntaxe. L'effort se déplace, il ne disparaît pas. Et une personne seule peut livrer un produit complet, du code au déploiement. Dans la prochaine vidéo, nous découvrirons le terminal et l'éditeur de code, votre nouvel espace de travail. À tout de suite. | Diapositive 7 : récapitulatif et prochaine vidéo. | Aucune. |

## 4. Durée estimée

**828 mots prononcés**, soit environ 5,9 minutes de voix, plus 160 secondes de manipulation à l'écran. **Durée estimée : 8:35**, avant coupes au montage. L'attente de l'installation (60 secondes prévues) peut être raccourcie.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel, et mettez à jour ce skill pour les prochains chapitres.

## 5. Relecture de fidélité

Chaque affirmation, commande et chiffre du script a été comparé au chapitre source : Node.js 18 ou plus, version LTS, `npm install -g @anthropic-ai/claude-code`, `claude` lancé dans le dossier du projet, connexion à un compte Anthropic ou Claude Pro ou Max, identique sur Windows, Mac et Linux, installation coupée puis `npm uninstall -g`, politique d'exécution PowerShell et sa correction `RemoteSigned`, trois points clés. Les trois adaptations sont listées dans la section 2.

Écart de forme : les commandes sont épelées à l'oral (« tiret tiret version »). Elles sont écrites exactement dans la colonne « Action » et sur les diapositives.
