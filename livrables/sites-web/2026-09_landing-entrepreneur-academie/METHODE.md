# Comment ce projet a été construit

> Journal de méthode, rédigé pour montrer concrètement l'application du Module 1 (Écosystème Claude) sur un cas réel. Utile comme matériel pédagogique pour Entrepreneur Académie.

## Étape 1 — Plan

Le cadrage a repris les mêmes 4 éléments que le projet précédent (contexte, objectif précis, périmètre, autonomie), avec une différence notable : la leçon tirée du projet 1 sur l'emplacement des fichiers a été appliquée dès la formulation du plan, pas corrigée après coup. C'est exactement l'idée du chapitre "Quand ça casse, debugger et vérifier" (section 2) et de la logique d'amélioration continue : une erreur identifiée une fois ne doit pas se reproduire à l'identique.

- **Objectif précis** : présenter la promesse d'Entrepreneur Académie et capter l'intérêt de visiteurs via une liste d'attente, pas vendre directement (pas de prix ni de date de lancement définis à ce stade).
- **Contexte** : école encore en conception, un seul module de contenu réellement rédigé (le Module 1).
- **Périmètre** : front-end statique, formulaire de capture qui n'envoie pas encore réellement les données quelque part (pas de backend branché).
- **Emplacement** : `livrables/sites-web/`, parce que c'est une page publique destinée à être visitée par des tiers, contrairement au générateur d'audit qui est un outil interne. Cette distinction (public vs interne) est directement celle posée par les README des dossiers `sites-web/` et `applications/`.

## Étape 2 — Execute

Un point de méthode spécifique à ce projet, issu directement du chapitre "Ce que vous pouvez vendre (et ce que vous ne devriez pas)" (section 6) : la page affiche honnêtement le statut réel de chaque module du programme ("Disponible" pour le Module 1, "Bientôt" pour les 4 autres), plutôt que de présenter un programme complet qui n'existe pas encore. C'est une application directe de la règle "vendre ce que la méthode permet réellement de livrer, pas ce que l'enthousiasme laisse imaginer".

Le contenu des 5 modules affichés reprend fidèlement le skill `programme-ecosysteme-ia` du workspace, pour rester cohérent avec la seule source de vérité existante sur le programme, plutôt que d'inventer un contenu différent pour la page.

## Étape 3 — Validate

Même limite que le projet précédent : pas de MCP Playwright disponible, donc relecture manuelle du code plutôt qu'un test réel en navigateur. Vérifié en particulier : le comportement du formulaire de liste d'attente (masquage du formulaire, affichage du message de confirmation), et la cohérence des styles à largeur réduite (responsive), un point que le projet 1 n'avait pas à traiter aussi finement puisqu'il ciblait un usage interne sur ordinateur.

## Ce que ce projet illustre du Module 1

- Section 2 (La Méthode) : une leçon tirée d'un projet précédent, appliquée en amont plutôt que redécouverte
- Section 3 (Maîtriser l'outil) : structure de projet cohérente avec les conventions déjà en place dans le workspace
- Section 6 (Le Business) : transparence sur ce qui est réellement prêt, appliquée à un contenu commercial et pas seulement en théorie
