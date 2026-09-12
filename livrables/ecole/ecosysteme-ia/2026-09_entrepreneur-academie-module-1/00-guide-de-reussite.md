# Fiche pratique — Réussir le Module 1

> Ce n'est pas un résumé du cours, c'est un chemin. Les 7 sections du module contiennent la théorie et les questions de compréhension. Cette fiche dit dans quel ordre les pratiquer, avec quoi, et à quel signal concret on sait qu'on peut passer à la suite. Prérequis : avoir Claude Code installé et accessible.

## Le piège à éviter avant de commencer

Le même piège que le module dénonce dès le chapitre 1 de la section 2 (Vibe Coding vs Agentic Coding) existe côté apprentissage : lire les 7 sections d'une traite, trouver ça clair, et penser que c'est acquis. Ce n'est pas le cas. Une notion comprise en lisant et une notion pratiquée sur un vrai cas sont deux choses différentes, et c'est la seconde qui compte. Chaque étape ci-dessous a une action concrète associée, pas seulement une lecture.

---

## Étape 1 — Les Fondations (section 1)

**À lire** : les 4 chapitres, en entier une seule fois.

**À faire, pas seulement lire** :
- Ouvrir un terminal et l'IDE côte à côte, et lancer Claude Code sur un dossier vide
- Faire un premier commit Git sur ce dossier, même avec un seul fichier dedans
- Déployer n'importe quoi de minimal sur Vercel (une seule page suffit), juste pour vivre le trajet complet du code jusqu'à une URL accessible

**Signal de passage à l'étape suivante** : tu as une URL publique qui fonctionne, obtenue par toi-même de bout en bout, même si le contenu de la page est insignifiant.

---

## Étape 2 — La Méthode (section 2)

**À lire** : les 4 chapitres.

**À faire** : utiliser [02-methode-prompts.md](02-methode-prompts.md). Choisis un petit projet (le site vitrine d'exemple ou un vrai besoin perso), et pratique dans l'ordre :
1. Écrire une instruction floue, l'envoyer, observer le résultat approximatif
2. Réécrire la même instruction avec les 4 éléments (contexte, objectif, périmètre, autonomie)
3. Refaire une tâche en 3 temps explicites : Plan (demandé et lu avant tout code), Execute, Validate

**Signal de passage** : tu as vécu au moins une fois la différence entre une instruction floue et une instruction complète sur le même besoin, pas juste lu l'exemple du cours.

---

## Étape 3 — Maîtriser l'outil (section 3)

**À lire** : les 7 chapitres. C'est la section la plus dense en outils concrets, ne pas la survoler.

**À faire** : utiliser [03-maitriser-loutil-prompts.md](03-maitriser-loutil-prompts.md) sur le projet démarré à l'étape 2.
- Créer un vrai CLAUDE.md pour ce projet
- Créer au moins un Slash Command ou un Skill, même simple
- Si tu as un MCP connecté (Notion, Google Drive...), faire une action réelle dessus avec un périmètre explicite dans le prompt
- Vérifier l'arborescence du projet et la corriger si elle ne tiendrait pas à 10x sa taille actuelle

**Signal de passage** : ton projet a un CLAUDE.md à jour, et tu as créé au moins un Skill ou Slash Command qui fonctionne réellement, pas seulement en théorie.

---

## Étape 4 — Claude Code au quotidien (section 4)

**À lire** : les 3 chapitres.

**À faire** : utiliser [04-quotidien-prompts.md](04-quotidien-prompts.md).
- Mettre en place, même en version minimale, un second brain pour un pan de ta propre activité (Chatllow, YouTube, ou Longrich) : un CLAUDE.md, un CONTEXT.md, un HISTORY.md
- Générer un exemple de documentation client non technique à partir d'un projet réel ou fictif
- Construire un tableau de suivi (KPIs ou facturation) pour une de tes activités réelles

**Signal de passage** : tu as un second brain fonctionnel sur au moins une de tes activités réelles, que tu peux recharger avec un prompt du type "lis mes fichiers de contexte et résume où j'en suis".

---

## Étape 5 — Le Fullstack, projet fil rouge (section 5)

**À lire** : les 6 chapitres. C'est la section où tout ce qui précède converge, elle mérite le plus de temps de pratique réelle.

**À faire** : utiliser [05-fullstack-fil-rouge-prompts.md](05-fullstack-fil-rouge-prompts.md) et construire les 3 phases (intake, dashboard, statut), sur le scénario Alpha Conseil ou sur un cas réel à toi (un projet Chatllow, ou une adaptation pour Kora).
- Ne pas sauter la phase de test Playwright avant de considérer une phase terminée
- Faire les 3 phases dans l'ordre, pas en parallèle : chaque phase s'appuie sur la précédente

**Signal de passage** : les 3 phases fonctionnent ensemble, testées réellement (pas juste "le code a l'air bon"), sur un projet que tu pourrais montrer à quelqu'un.

---

## Étape 6 — Le Business (section 6)

**À lire** : les 4 chapitres.

**À faire** :
- Écrire ta propre checklist de livraison (fonctionnel, sécurité, handoff) et l'appliquer réellement au projet fil rouge de l'étape 5, pas juste la lire
- Lister ce que, dans ce projet fil rouge, pourrait devenir un starter réutilisable pour un futur client Chatllow ou Longrich, en le généralisant (sans rien de confidentiel dedans)

**Signal de passage** : tu as une checklist de livraison écrite et déjà testée sur un projet, plus une idée concrète de starter que tu pourrais réutiliser.

---

## Étape 7 — Hacks & vidéos bonus (section 7)

**À lire** : les 3 chapitres, seulement une fois les étapes 1 à 6 pratiquées, pas avant. Ce sont des raffinements, pas des fondations : les lire trop tôt disperse l'attention avant que la base soit vraiment acquise.

**À faire** : pas d'action obligatoire ici. C'est le moment de repérer, dans ta propre activité, un premier candidat à un sub-agent ou une connexion MCP au-delà de n8n, sans forcément le construire tout de suite.

---

## Auto-évaluation de fin de module

Le module est réellement acquis, pas seulement lu, si tu peux répondre oui aux 5 points suivants :
1. Tu as un projet réel (même petit) avec un CLAUDE.md à jour et une arborescence propre
2. Tu as vécu au moins une fois le cycle complet Plan, Execute, Validate sur une vraie tâche, pas un exemple de cours
3. Tu as un second brain fonctionnel sur au moins un pan de ton activité réelle
4. Tu as livré, même à toi-même, un mini-projet à 3 briques testé de bout en bout (le fil rouge ou un équivalent)
5. Tu peux expliquer en une phrase à un futur apprenant d'Entrepreneur Académie la différence entre Vibe Coding et Agentic Coding, sans relire le cours

Si un de ces points est non, la bonne réaction n'est pas de continuer vers le module suivant, c'est de revenir à l'étape correspondante et de la pratiquer réellement avant d'avancer.

---

## Erreurs fréquentes à éviter

- **Lire les 7 sections d'affilée sans rien pratiquer entre deux** : la compréhension théorique retombe vite sans usage réel derrière
- **Sauter l'étape 5 (fil rouge) ou la faire à moitié** : c'est la section où la méthode se prouve sur un cas concret, pas un chapitre optionnel
- **Lire la section 7 (bonus) en premier par curiosité** : elle suppose les fondations acquises, elle crée de la confusion si elle est lue trop tôt
- **Pratiquer uniquement sur les exemples fictifs des fiches de prompts** sans jamais les transposer sur un projet réel à toi : l'exercice final de chaque fiche prompts existe justement pour ça, ne pas le sauter
