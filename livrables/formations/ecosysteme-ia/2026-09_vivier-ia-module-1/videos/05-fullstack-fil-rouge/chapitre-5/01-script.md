# Vidéo : Build Phase 2, dashboard de suivi

Module 1, section 5 « Le Fullstack, projet fil rouge », chapitre 5 sur 6. Sources : `05-fullstack-fil-rouge.md`, chapitre 5, et `05-fullstack-fil-rouge-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève a construit un dashboard qui reste utilisable à plus grande échelle, pas seulement pour une démonstration avec 3 ou 4 lignes.
- **Prérequis de l'élève** : avoir suivi le chapitre 4 de cette section (dossier `/alpha-conseil` avec le formulaire et son fichier JSON).
- **Durée cible** : entre 6 et 9 minutes.
- **Exemple concret qui porte la vidéo** : le dashboard d'Alpha Conseil, qui lit les données du formulaire d'intake construit au chapitre précédent.
- **Continuité** : cette vidéo upgrade encore le dossier `/alpha-conseil`. Le résultat est réutilisé au chapitre 6.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Aucune référence à Chatllow ou à Zézé dans ce chapitre** : rien à neutraliser.
2. **Démonstration réelle confirmée** : les 2 prompts de la fiche (cadrer le dashboard, puis vérifier à 50 entrées avec Playwright) sont repris mot pour mot et joués en direct, dans l'ordre, sur le dossier `/alpha-conseil`.
3. **Le résultat de Claude Code n'est pas prévisible** : répéter la démonstration avant l'enregistrement pour caler le minutage, en particulier la génération des 50 entrées de test.

## 3. Script minuté

Rythme retenu : 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce cinquième chapitre du projet fil rouge. Deuxième brique : un dashboard qui visualise et suit les données collectées par le formulaire d'intake. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:12 | Cette phase pose des enjeux différents. Organiser une quantité d'informations croissante, avec des filtres, une recherche, un tri pertinent. Représenter un état qui évolue, comme un statut et son historique. Et penser l'usage quotidien, pas une démonstration ponctuelle. | Diapositive 2, un clic par carte (3 clics). | Un clic par carte. |
| 0:28 | C'est précisément ici que la notion de produit qui "scale", vue en section 3, prend tout son sens. Un dashboard pensé pour 10 lignes fonctionne différemment, dans sa conception même, d'un dashboard pensé pour en accueillir plusieurs centaines. | Diapositive 3 (avant-après : 10 lignes contre plusieurs centaines). | Aucune. |
| 0:44 | Cadrons le dashboard avec Claude Code. Contexte : les données d'intake sont dans le fichier JSON de la phase 1. Objectif : lister chaque demande, avec recherche par entreprise, filtre par budget, et un statut modifiable. Pensé pour rester lisible avec 200 demandes. | VS Code en plein écran : le prompt collé, puis Claude Code qui construit le dashboard. | Coller le premier prompt de la fiche (cadrage du dashboard), dans le dossier `/alpha-conseil`. Laisser Claude Code construire. ⏱ +50 s |
| 1:53 | Un dashboard qui marche avec 3 entrées de test ne prouve rien. Je demande à Claude Code de générer 50 entrées réalistes, puis d'ouvrir le dashboard avec Playwright pour vérifier que la recherche et les filtres fonctionnent à ce volume. | VS Code : le prompt collé, puis Playwright qui teste le dashboard avec 50 entrées. | Coller le deuxième prompt (générer 50 entrées, tester avec Playwright). Observer le résultat. ⏱ +45 s |
| 2:55 | Anticiper cette croissance dès la construction évite une refonte coûteuse plus tard, quand le volume aura effectivement grandi. La phase 2 est terminée, testée à une échelle réaliste. Prochaine vidéo : la phase 3, la page de statut et la livraison finale. À tout de suite. | Diapositive 4 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**232 mots prononcés**, soit environ 1,7 minutes de voix, plus 95 secondes de manipulation à l'écran. **Durée estimée : 3:14**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de démonstration (50 s, 45 s) sont des estimations : la génération de 50 entrées peut prendre plus ou moins de temps.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : le rôle de cette deuxième brique, les enjeux différents de la phase 1, le lien avec la notion de "scale" de la section 3, les 2 prompts de démonstration repris mot pour mot. Aucun écart : ce chapitre ne cite ni Zézé ni Chatllow, rien à neutraliser.
