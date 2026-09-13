# Vivier Academies — Plateforme de formation et communauté

Voir `CADRAGE.md` pour le cadrage complet du projet (objectif, cible, architecture, priorités, points à trancher).

## Maquette (étape 3 du pipeline)

Prototype cliquable construit dans Claude Design, pour l'espace **Vivier IA** (premier espace construit, voir `CADRAGE.md` section 5).

**Écrans couverts** :
- `maquette/Main.dc.html` — vitrine publique : hero avec terminal Claude Code, section fondateur, preuve communautaire (posts illustratifs)
- `maquette/Communaute.dc.html` — fil de la communauté gratuite, inspiré de Skool (vote, tags de catégorie, niveaux, classement)
- `maquette/Tunnel.dc.html` — tunnel de paiement Mobile Money (Orange Money / MTN Money)

Palette et typographie reprises de l'identité Vivier IA déjà validée (`livrables/ecole/2026-09_vivier-ia-identite-visuelle/`) : encre `#113832`, sarcelle `#2B8C82`/`#5FC7B8`, corail `#FF7A4D`, fond clair `#F2F7F5`, Unbounded + Manrope, plus Space Mono pour les détails techniques (terminal, badges).

Les témoignages et posts de communauté affichés sont des **exemples illustratifs**, explicitement marqués comme tels dans la maquette, pas de vrais retours d'apprenants.

## Artefact publié

Prototype cliquable : https://claude.ai/code/artifact/ee58a73a-d593-4750-9fad-df10a83b9cfb

Pour rouvrir et modifier : reconstruire le canvas avec le helper `seed-canvas.mjs` de la skill `design` à partir des fichiers de `maquette/`, puis republier via l'outil Artifact sur cette même URL.

## Statut

Maquette en cours de validation avec Zézé. Écrans restants à concevoir : page individuelle de progression de l'élève, communauté payante (exercices et interactions entre élèves). Photo réelle de Zézé à intégrer (emplacement placeholder présent sur la vitrine).
