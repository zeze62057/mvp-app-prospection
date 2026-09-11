# Comment ce projet a été construit

> Journal de méthode, rédigé pour montrer concrètement l'application du Module 1 (Écosystème Claude) sur un cas réel. Utile comme matériel pédagogique pour Entrepreneur Académie.

## Étape 1 — Plan

Avant d'écrire une seule ligne de code, le besoin a été cadré selon les 4 éléments enseignés au chapitre "L'art de donner des instructions à Claude Code" (section 2) :

- **Objectif précis** : un formulaire qui capture des informations sur une entreprise prospect et génère un compte-rendu d'audit IA structuré, utilisable en rendez-vous commercial Chatllow.
- **Contexte** : pas de client réel signé à ce stade, l'outil sert d'abord à démontrer la valeur de Chatllow en rendez-vous, pas à traiter de vraies données confidentielles.
- **Périmètre** : front-end statique uniquement pour cette V1, explicitement pas de base de données ni de backend, pour ne pas complexifier un besoin qui n'existe pas encore.
- **Emplacement dans le projet** : ici, le plan initial proposait `livrables/cabinet/`. Erreur repérée avant d'exécuter : le `README.md` de `cabinet/` précise lui-même que les outils internes réutilisables vont dans `applications/`. C'est une application directe du chapitre "Structurer son projet" (section 3) : vérifier la structure existante avant d'agir, plutôt que de supposer. Le plan a été corrigé en conséquence, avant toute exécution.

## Étape 2 — Execute

Construction en un seul fichier HTML autonome (structure, style, logique), sans dépendance externe ni outil de build, conformément au chapitre "Le terminal et l'IDE" et à l'esprit "zéro friction pour lancer" du module : ouvrir le fichier dans un navigateur suffit.

La génération du rapport repose sur une logique de templates conditionnels en JavaScript (pas d'appel à un modèle IA) : le texte du rapport change selon les réponses données au formulaire (secteur, taille, niveau de maturité IA, tâches identifiées). Ce choix a été fait pour rester dans le périmètre posé à l'étape Plan (aucun backend, aucune clé d'API à gérer), tout en produisant un résultat déjà utile.

## Étape 3 — Validate

Limite assumée et annoncée honnêtement : le MCP Playwright (vu au chapitre dédié de la section 5) n'est pas disponible dans cet environnement de travail. La validation n'a donc pas pu être un vrai test en conditions réelles dans un navigateur, contrairement à ce que le module recommande comme meilleure pratique.

À la place, une relecture manuelle rigoureuse du code a été faite : correspondance de tous les identifiants entre le formulaire HTML et le script JavaScript, vérification que les balises sont bien fermées, contrôle de la règle d'impression qui masque le formulaire au moment d'exporter en PDF. Ce n'est pas équivalent à un test réel, et ça a été dit clairement plutôt que de prétendre à une validation plus forte qu'elle ne l'était. Le test réel en navigateur a été délégué à Zézé.

## Ce que ce projet illustre du Module 1

- Section 2 (La Méthode) : le workflow Plan/Execute/Validate appliqué à une tâche réelle, pas seulement en théorie
- Section 3 (Maîtriser l'outil) : vérifier la structure du projet avant d'agir plutôt que de supposer
- Section 6 (Le Business) : un outil pensé dès le départ comme livrable de démonstration, pas comme un exercice isolé
