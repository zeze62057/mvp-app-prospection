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
- **Approbation manuelle bloquante uniquement pour la communauté gratuite** : le reste du parcours (accès payant) ne dépend jamais d'une validation humaine.

Nuance sur l'ordre de construction : la maquette peut couvrir Bâtisseur Pro par anticipation (deux vitrines déjà dessinées), ce n'est qu'un exercice visuel. La **construction réelle** (code) de Bâtisseur Pro reste après celle de Vivier IA, sans exception.

## Maquette et identité visuelle

Maquette cliquable dans `maquette/` (8 fichiers `.dc.html` + `canvas.json`), publiée sur https://claude.ai/code/artifact/ee58a73a-d593-4750-9fad-df10a83b9cfb.

Écrans : `Main` (vitrine Vivier IA), `Communaute` (communauté gratuite), `Tunnel` (paiement), `Progression` (page individuelle élève), `CommunautePayante`, `Prompts` (bibliothèque de prompts), `BatisseurProFormation` et `BatisseurProReseau` (deux premières vitrines Bâtisseur Pro, angles différents).

Fonctionnalités notables déjà dans la maquette, à ne pas oublier en construction : badge et recrutement "Expert" dans la communauté payante, lead magnets sur les vignettes vidéo (communauté gratuite et payante), formulaire pour qu'un élève poste lui-même un témoignage (page de progression), bandeau d'offre de lancement sur la vitrine.

Palette reprise de l'identité Vivier IA : encre `#113832`, sarcelle `#2B8C82` / `#5FC7B8`, corail `#FF7A4D`, fond clair `#F2F7F5`.

Typographie de la maquette : **Fraunces** (titres) + **Public Sans** (texte courant) + **Space Mono** (détails techniques, terminal). Point non tranché à ce jour : cette typographie diffère de celle du reste de la marque Vivier IA (logo et decks de cours en Unbounded + Manrope). Ne pas supposer que l'un des deux systèmes typographiques a remplacé l'autre tant que Zézé n'a pas explicitement tranché lequel s'applique où.

## Décisions de fond notées, pas encore cadrées

Ces idées ont été exprimées par Zézé pendant la maquette, volontairement pas construites tant qu'elles n'ont pas leur propre cadrage (elles touchent l'architecture ou le modèle produit, pas juste l'écran) :

- **Paiement en plusieurs tranches** (1, 2 ou 3 fois) : remettrait en cause l'automatisation n8n actuelle, pensée pour un paiement unique = une activation
- **Prix des formations modifiables par un admin** plutôt que codés en dur
- **Création facilitée d'un nouvel espace** (compte formation) qui hérite automatiquement des mêmes paramètres que les espaces existants
- **Les prospects pourraient créer leur propre communauté sur la plateforme** : pivot potentiel important, de "l'académie de Zézé" vers "une plateforme multi-créateurs". Ne jamais construire ça sans une discussion de cadrage dédiée, ça change fondamentalement le modèle de données et la répartition produit/automatisation posée plus haut

Si Zézé redemande une de ces briques, proposer explicitement de la cadrer d'abord (comme pour le reste du projet), plutôt que de la construire directement sur simple demande.

## Stack technique

Pas encore choisie. À trancher explicitement en tout début de construction (étape 5), avec Zézé, avant d'écrire la moindre ligne de code. Ne pas présumer qu'elle reprendra celle de Kora (`2026-09_app-prospection-mlm`, statique HTML/JS + Supabase) : c'est une possibilité à évaluer, pas un choix acté.

## Contraintes connues

- Paiement Mobile Money (Orange Money, MTN Money), marché guinéen
- Version mobile requise dès la V1, pas une évolution ultérieure
- Lecture vidéo intégrée requise dès la V1
- Exigence esthétique explicite : la plateforme est pensée pour être largement promue, le soin visuel compte directement pour l'acquisition

## Avant toute manipulation technique réelle

Annoncer le prompt (contexte, objectif, périmètre, autonomie) avant de construire ou modifier quelque chose de structurant, et attendre la validation de Zézé. Pour toute installation ou configuration touchant un vrai compte ou service externe (Mobile Money, hébergement, etc.), guider étape par étape en direct, jamais une liste à exécuter seul.
