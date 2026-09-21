# Diapositives : Pourquoi Claude Code va changer votre métier

7 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : l'essentiel de la vidéo se passe dans le terminal. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Pourquoi Claude Code va changer votre métier | **Module 1, Section 1, Chapitre 1.** Objectif : comprendre ce qui change, et lancer Claude Code. Plan : 1. Ce qui change. 2. Ce qui ne change pas. 3. Installer Claude Code. |
| 2 | 0:22 | Le constat | **Avant** : Idée, puis syntaxe, puis machine. **Maintenant** : Idée, puis Claude, puis résultat. Votre rôle : architecte et validateur. |
| 3 | 0:56 | Trois basculements | 1. La barrière technique s'effondre, pas les compétences. 2. La vitesse change d'ordre de grandeur. 3. Le métier devient un produit de bout en bout. Les trois lignes apparaissent l'une après l'autre. |
| 4 | 2:30 | Ce qui ne change pas | Haut : **Savoir cadrer, découper, vérifier.** Bas, l'exemple : audit d'IA pour un client de l'immobilier. **Avant** : plusieurs semaines, une équipe. **Après** : quelques jours, une personne. |
| 5 | 3:34 | Installer Claude Code | 1. `node --version` (Node.js 18 ou plus). 2. `npm install -g @anthropic-ai/claude-code`. 3. `claude` (dans le dossier de votre projet). |
| 6 | 6:32 | Deux blocages fréquents | **Installation coupée** : `npm uninstall -g @anthropic-ai/claude-code`, puis réinstaller. **Windows bloque les scripts** : `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`. |
| 7 | 8:02 | À retenir | Architecte et validateur, pas traducteur de syntaxe. L'effort se déplace, il ne disparaît pas. Une personne seule peut livrer un produit complet. **Prochaine vidéo** : le terminal et l'éditeur de code. |

## Version PowerPoint (2026-09-21)

- **Fichier** : `diapositives-chapitre-1.pptx`, dans ce dossier. 7 diapositives en 16:9, notes de l'orateur incluses (le moment du script sur chaque diapositive).
- **Fond** : l'image robot de Zézé sert de fond, recadrée et teintée différemment sur chaque diapositive, sous un voile sombre qui garde le texte lisible.
- **Logo** : le logo Vivier IA est **transparent** (sans carré blanc) sur toutes les diapositives. Son texte vert foncé et le vert de la clé sont éclaircis pour rester lisibles sur fond sombre, le point corail est inchangé. Petit en haut à droite (1,3 pouce) sur les diapositives 2 à 7, et en bas à droite sur la couverture (2,3 pouces), là où le fond est sombre.
- **Animations** : transition en fondu entre les diapositives, et apparitions animées (fondu, balayage depuis la gauche) synchronisées avec le script.

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Titre | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les trois pastilles l'une après l'autre |
  | 2 Constat | Clic 1 : la ligne « Maintenant ». Clic 2 : « Votre rôle » |
  | 3 Trois basculements | Un clic par carte (3 clics) |
  | 4 Ce qui ne change pas | Clic 1 : carte « Avant ». Clic 2 : carte « Après » |
  | 5 Installer | Un clic par commande (3 clics) |
  | 6 Deux blocages | Un clic par blocage (2 clics) |
  | 7 À retenir | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (3 clics) |

  Les clics sont indiqués dans les notes de l'orateur de chaque diapositive. 55 effets au total.
- **Polices** : Arial pour les titres, Calibri pour le texte, Courier New pour les commandes. Ce sont des polices présentes sur tout poste Windows, donc rien ne se décale à l'ouverture. Le deck en ligne (ci-dessous) garde Unbounded et Manrope.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les 55 effets et les transitions (comptage vérifié diapositive par diapositive). Chaque diapositive a été exportée en image et regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **Sources** : le contenu des diapositives est dans `diapositives.json`, et l'outil commun `../../../../_outils-video/` (image de fond, logo, constructeur) reconstruit le fichier avec `node construire-pptx.mjs`. Le fichier de ce dossier a été monté à la main, avant l'outil. Une reconstruction depuis le JSON donne le même nombre d'effets (55) et de clics (15), et les diapositives 2 et 6 sont identiques à l'image.

## Deck en ligne (2026-09-21)

- **Lien** : https://claude.ai/artifact/HDUgTHQY6QBhuEiRWCXEZ6 (privé : seul Zézé peut l'ouvrir tant qu'il ne le partage pas).
- **État** : produit après la validation de Zézé, **pas encore relu à l'écran**. À regarder et à ajuster avant l'enregistrement : longueurs de texte, apparition des éléments au clic, lisibilité en 1080p.
- **Typographie retenue** : Unbounded pour les titres et Manrope pour le texte, la convention déjà utilisée pour les decks de cours Vivier IA, plus JetBrains Mono pour les commandes. Le choix de la typographie de la plateforme, lui, reste non tranché.
- **Notes de l'orateur** : chaque diapositive porte, dans ses notes, le moment du script correspondant.
- Les diapositives ont été regroupées en 7 (le titre et le plan sont sur la première), comme dans le tableau ci-dessus.

## Prompt utilisé pour Claude Design

- **Contexte** : vidéo de formation pour les élèves de Vivier IA, Module 1, section 1, chapitre 1. Enregistrement d'écran avec voix off. Les diapositives encadrent une démonstration dans le terminal. Le texte exact de chaque diapositive est dans le tableau ci-dessus.
- **Objectif** : produire les 7 diapositives, au format 16:9, lisibles en vidéo 1080p, avec un texte court et de grands caractères.
- **Périmètre** : uniquement ces 7 diapositives. Pas de nouvelle image de fond, pas de texte ajouté ou reformulé. Les commandes s'affichent en police à chasse fixe, sur un fond sombre. Sur la diapositive 3, les trois lignes s'affichent l'une après l'autre. Sur la diapositive 2, la ligne « Maintenant » apparaît après la ligne « Avant ».
- **Autonomie** : produisez une première version et montrez-la avant toute déclinaison. Ne modifiez pas la charte : encre `#113832`, sarcelle `#2B8C82`, corail `#FF7A4D`, fond clair `#F2F7F5`. Typographie : Unbounded pour les titres, Manrope pour le texte, JetBrains Mono pour les commandes (convention des decks de cours Vivier IA).
