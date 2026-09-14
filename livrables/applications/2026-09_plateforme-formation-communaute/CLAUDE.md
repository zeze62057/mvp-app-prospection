# CLAUDE.md — Vivier Academies

Ce fichier guide Claude Code pendant la construction réelle de ce projet. Le cadrage complet (objectif, cible, décisions, points ouverts) est dans `CADRAGE.md`, à lire en entier si un doute apparaît : ce fichier n'en est qu'un résumé opérationnel, pas un remplacement.

## Qui et pourquoi

Projet de Zézé Bilivogui. Vivier Academies est la plateforme qui héberge plusieurs formations de Zézé, chacune dans son propre **espace** (contenu + communauté gratuite + communauté payante + page individuelle de progression). Les deux premiers espaces prévus : **Vivier IA** (écosystème Claude, construit en premier) et **Bâtisseur Pro** (marketing de réseau, générique, ne jamais afficher "Longrich").

## Ce qui ne se discute pas sans repasser par un cadrage

- **Une seule plateforme, espaces génériques** : ne jamais coder une séparation Vivier IA / Bâtisseur Pro en dur. Un espace est un concept réutilisable (un identifiant, des données et une communauté filtrées par cet identifiant), pensé pour qu'un futur troisième espace s'ajoute sans réécrire l'architecture.
- **Ordre de construction** : le trio complet (communauté gratuite → communauté payante → page individuelle) se construit intégralement pour Vivier IA avant de toucher à Bâtisseur Pro.
- **Répartition produit / automatisation** : les comptes, le contenu, les communautés et la page individuelle sont dans le produit (Claude Code). Le passage paiement Mobile Money → activation de compte est orchestré par n8n, jamais géré directement dans le produit.
- **Approbation manuelle** : uniquement pour rejoindre la communauté gratuite. L'accès à la formation payante reste automatique dès le paiement reçu, jamais soumis à validation manuelle.
- **Priorité** : accès fiable au contenu avant la communauté payante. Construction incrémentale voulue par Zézé, pas de gros lot monolithique.

## Maquette et identité visuelle

Maquette cliquable dans `maquette/` (fichiers `.dc.html` + `canvas.json`), publiée sur https://claude.ai/code/artifact/ee58a73a-d593-4750-9fad-df10a83b9cfb.

Palette reprise de l'identité Vivier IA : encre `#113832`, sarcelle `#2B8C82` / `#5FC7B8`, corail `#FF7A4D`, fond clair `#F2F7F5`.

Typographie de la maquette : **Fraunces** (titres) + **Public Sans** (texte courant) + **Space Mono** (détails techniques, terminal). Point non tranché à ce jour : cette typographie diffère de celle du reste de la marque Vivier IA (logo et decks de cours en Unbounded + Manrope). Ne pas supposer que l'un des deux systèmes typographiques a remplacé l'autre tant que Zézé n'a pas explicitement tranché lequel s'applique où.

## Stack technique

Pas encore choisie. À trancher explicitement en tout début de construction (étape 5), avec Zézé, avant d'écrire la moindre ligne de code. Ne pas présumer qu'elle reprendra celle de Kora (`2026-09_app-prospection-mlm`, statique HTML/JS + Supabase) : c'est une possibilité à évaluer, pas un choix acté.

## Contraintes connues

- Paiement Mobile Money (Orange Money, MTN Money), marché guinéen
- Version mobile requise dès la V1, pas une évolution ultérieure
- Lecture vidéo intégrée requise dès la V1
- Exigence esthétique explicite : la plateforme est pensée pour être largement promue, le soin visuel compte directement pour l'acquisition

## Avant toute manipulation technique réelle

Annoncer le prompt (contexte, objectif, périmètre, autonomie) avant de construire ou modifier quelque chose de structurant, et attendre la validation de Zézé. Pour toute installation ou configuration touchant un vrai compte ou service externe (Mobile Money, hébergement, etc.), guider étape par étape en direct, jamais une liste à exécuter seul.
