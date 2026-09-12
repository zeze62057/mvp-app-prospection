# Identité visuelle — Vivier IA

Charte graphique et logo de Vivier IA, l'école de l'IA en francophonie (anciennement "Entrepreneur Académie"), construits dans Claude Design.

## Le nom

**Vivier IA**. Choisi le 12 septembre 2026 après exploration de plusieurs pistes (Déclic, Essor IA, Baobab, Étincelle IA, Odyssée IA, Akili IA, Pépinière IA, Le Tremplin IA, La Relève IA), chacune vérifiée pour écarter les noms déjà pris dans le paysage très encombré des "Académie IA" francophones. Détail dans `context/HISTORY.md` (entrée du 12 septembre 2026).

**Vision associée** : l'école doit former ET recruter les meilleurs, un vivier de talents plutôt qu'une école grand public classique, sans fermer la porte à l'entrée.

## Le logo retenu : Banc

Un banc de poissons stylisés, un meneur en tête du groupe. Parmi 6 concepts explorés au total (3 pour l'ancien nom "Entrepreneur Académie", 3 pour "Vivier IA"), celui retenu après essai direct des couleurs sur des pastilles interactives dans Claude Design.

**Palette**
| Rôle | Couleur |
|---|---|
| Encre | `#113832` |
| Banc (poissons secondaires) | `#2B8C82` |
| Meneur (accent) | `#FF7A4D` |
| Fond clair | `#F2F7F5` |

**Typographie** : Unbounded (titres) + Manrope (texte courant)

**Tagline** : "Le vivier des talents IA francophones"

## Contenu de ce dossier

- `logo/` — le canvas Claude Design du logo retenu (`Main.dc.html`) avec les 2 pistes non retenues gardées pour référence sur une page "Explorations" (`Sceau.dc.html` : registre institutionnel navy/bronze, `ConceptLigature.dc.html` : wordmark seul fond sombre)
- `presentation-module1/` — le support de présentation du Module 1 (Écosystème Claude), 9 slides à l'identité Vivier IA, avec un petit robot en filigrane en ligne fine sur chaque slide

Ces fichiers `.dc.html` sont le code source des canvas Claude Design (format "Design Component"). Pour les rouvrir et les modifier, reconstruire le canvas avec le helper `seed-canvas.mjs` de la skill `design` (voir la skill pour le détail de la commande), puis publier via l'outil Artifact.

## Artefacts publiés (liens à jour au 12 septembre 2026)

- Logo Vivier IA : https://claude.ai/code/artifact/09e8daf9-8661-41bb-bb0a-67d96b7a7ed9
- Support Module 1 : https://claude.ai/code/artifact/d8f0e3e8-6709-4047-878a-b05ba2e28136

Ces liens pointent vers des Artifacts Claude, privés par défaut. Si les liens deviennent invalides ou si une nouvelle version doit être republiée, reconstruire à partir des fichiers `.dc.html` de ce dossier plutôt que de repartir de zéro.

## Statut

Logo final validé par Zézé. Support Module 1 construit à partir de `livrables/ecole/2026-09_entrepreneur-academie-module-1/`, relu (balises, accents, palette, canvas.json) sans problème détecté. Pas encore décliné sur d'autres supports (site, réseaux sociaux).
