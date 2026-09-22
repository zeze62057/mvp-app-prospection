# Vidéo : Build Phase 1, formulaire d'intake client

Module 1, section 5 « Le Fullstack, projet fil rouge », chapitre 4 sur 6. Sources : `05-fullstack-fil-rouge.md`, chapitre 4, et `05-fullstack-fil-rouge-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève a construit la vraie phase 1 du projet fil rouge (formulaire d'intake avec stockage et validation), en suivant le cycle Plan, Execute, Validate.
- **Prérequis de l'élève** : avoir suivi les chapitres 1 et 3 de cette section (dossier `/alpha-conseil`, MCP Playwright connecté).
- **Durée cible** : entre 7 et 10 minutes.
- **Exemple concret qui porte la vidéo** : le formulaire d'intake d'Alpha Conseil, cette fois avec un vrai stockage JSON et une vraie validation, à la place de la version simple du chapitre 1.
- **Continuité** : cette vidéo upgrade le dossier `/alpha-conseil` des chapitres 1 et 3. Le résultat est réutilisé dans les chapitres 5 et 6.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Aucune référence à Chatllow ou à Zézé dans ce chapitre** : rien à neutraliser, le texte source est déjà neutre.
2. **Démonstration réelle confirmée** : les 3 prompts de la fiche (Plan, validation du plan, test avec Playwright) sont repris mot pour mot et joués en direct, dans l'ordre, sur le dossier `/alpha-conseil`.
3. **Le résultat de Claude Code n'est pas prévisible** (nombre d'étapes du plan, structure exacte du code) : répéter la démonstration avant l'enregistrement pour caler le minutage.

## 3. Script minuté

Rythme retenu : 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce quatrième chapitre du projet fil rouge. Premier vrai bloc de construction : le formulaire d'intake, le tout premier point de contact structuré entre un prospect et votre système. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:14 | Cette phase enseigne trois choses. Cadrer précisément les champs nécessaires, ni plus ni moins. Structurer la validation : un email doit ressembler à un email, un champ obligatoire doit l'être réellement. Et connecter le formulaire à la suite du système. | Diapositive 2, un clic par carte (3 clics). | Un clic par carte. |
| 0:31 | C'est une excellente première brique, pour trois raisons. Elle est autonome, testable seule. Elle est concrète, le résultat est immédiatement visible. Et elle est représentative des enjeux du module : cadrage clair, validation rigoureuse, connexion réfléchie. | Diapositive 3 (une phrase, avec un appui). | Un clic pour l'appui. |
| 0:47 | Construisons-la avec le cycle vu en section 2 : Plan, Execute, Validate. Je demande d'abord un plan, sans coder : les champs nom, entreprise, besoin, budget estimé, un stockage en JSON local pour l'instant, et un message de confirmation. | VS Code en plein écran : le prompt Plan collé, puis le plan proposé par Claude Code, lu à l'écran. | Coller le premier prompt de la fiche (Plan), dans le dossier `/alpha-conseil`. Lire le plan proposé, sans encore valider. ⏱ +40 s |
| 1:43 | Le plan me convient. Je le valide d'un mot, et Claude Code exécute. | VS Code : le prompt de validation collé, puis Claude Code qui construit le formulaire. | Coller le deuxième prompt (« le plan me va, vas-y »). Laisser Claude Code construire. ⏱ +45 s |
| 2:34 | Dernière étape, Validate : je demande de tester avec Playwright, comme vu au chapitre 3, avec des données réalistes, et de confirmer que l'entrée apparaît bien dans le fichier JSON une fois le formulaire soumis. | VS Code : le prompt de test collé, puis Playwright qui remplit le formulaire et Claude Code qui vérifie le fichier JSON. | Coller le troisième prompt (test Playwright et vérification JSON). Observer la confirmation. ⏱ +40 s |
| 3:29 | La phase 1 est terminée, testée de bout en bout, pas seulement codée. Dans la prochaine vidéo, la phase 2 : le dashboard qui va afficher et suivre ces données. À tout de suite. | Diapositive 4 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**230 mots prononcés**, soit environ 1,6 minutes de voix, plus 125 secondes de manipulation à l'écran. **Durée estimée : 3:44**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de démonstration (40 s, 45 s, 40 s) sont des estimations : la vitesse de génération de Claude Code varie, surtout pour le plan et la construction.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : le rôle de cette première brique, les 3 choses enseignées, les 3 raisons d'en faire la première brique, les 3 prompts de démonstration repris mot pour mot dans l'ordre Plan, Execute, Validate. Aucun écart : ce chapitre ne cite ni Zézé ni Chatllow, rien à neutraliser.
