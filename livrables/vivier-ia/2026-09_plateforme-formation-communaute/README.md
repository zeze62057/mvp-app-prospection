# Vivier Academies — Plateforme de formation et communauté

Voir `CADRAGE.md` pour le cadrage complet du projet (objectif, cible, architecture, priorités, points à trancher).

## Maquette (étape 3 du pipeline)

Prototype cliquable construit dans Claude Design, pour l'espace **Vivier IA** (premier espace construit, voir `CADRAGE.md` section 5).

**Écrans couverts** (trio complet Vivier IA + extensions + premières vitrines Bâtisseur Pro) :
- `maquette/Main.dc.html` — vitrine publique Vivier IA : hero avec terminal Claude Code, section fondateur, preuve communautaire, bandeau offre de lancement, inspiré de iapreneurs.com
- `maquette/Communaute.dc.html` — fil de la communauté gratuite, inspiré de Skool (vote, tags de catégorie, niveaux, classement, lead magnet sur vidéo)
- `maquette/Tunnel.dc.html` — tunnel de paiement Mobile Money (Orange Money / MTN Money)
- `maquette/Progression.dc.html` — page individuelle de progression de l'élève (modules, anneau de progression, streak, formulaire de témoignage)
- `maquette/CommunautePayante.dc.html` — communauté payante : exercice de la semaine, badge Expert, carte de recrutement d'experts, posts avec pièces jointes et lead magnet
- `maquette/Prompts.dc.html` — bibliothèque de prompts de la communauté gratuite (filtres, cartes copiables)
- `maquette/BatisseurProFormation.dc.html` — vitrine Bâtisseur Pro, angle formation (méthode Go Pro)
- `maquette/BatisseurProReseau.dc.html` — vitrine Bâtisseur Pro, angle recrutement d'équipe

Palette reprise de l'identité Vivier IA déjà validée (`livrables/vivier-ia/2026-09_vivier-ia-identite-visuelle/`) : encre `#113832`, sarcelle `#2B8C82`/`#5FC7B8`, corail `#FF7A4D`, fond clair `#F2F7F5`. Typographie de la maquette : **Fraunces** (titres) + **Public Sans** (texte courant) + **Space Mono** (détails techniques, terminal) — différente d'Unbounded + Manrope utilisés ailleurs dans la marque Vivier IA (logo, decks de cours). Ce choix n'est pas encore étendu au reste de la marque, voir `CLAUDE.md`.

Les témoignages et posts de communauté affichés sont des **exemples illustratifs**, explicitement marqués comme tels dans la maquette, pas de vrais retours d'apprenants.

## Artefact publié

Prototype cliquable : https://claude.ai/code/artifact/ee58a73a-d593-4750-9fad-df10a83b9cfb

Pour rouvrir et modifier : reconstruire le canvas avec le helper `seed-canvas.mjs` de la skill `design` à partir des fichiers de `maquette/`, puis republier via l'outil Artifact sur cette même URL.

## Statut

Trio Vivier IA complet et validé, plus des extensions (bibliothèque de prompts, badge Expert, lead magnets, offre de lancement) et les deux premières vitrines Bâtisseur Pro. Photo réelle de Zézé à intégrer (emplacements placeholder présents sur les vitrines).

Décisions de fond notées mais volontairement pas encore construites, en attente d'un cadrage dédié (voir `CADRAGE.md`) :
- Paiement en plusieurs tranches (1, 2 ou 3 fois)
- Prix des formations modifiables par un admin
- Création facilitée d'un nouveau "compte espace" avec les mêmes paramètres pour de futures formations
- Possibilité pour les prospects de créer leur propre communauté sur la plateforme (pivot potentiel du modèle produit)
