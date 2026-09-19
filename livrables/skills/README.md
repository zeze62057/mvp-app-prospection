# skills/

Fiches des skills de ton Jarvis. **Les fichiers actifs sont dans `.claude/skills/`** : c'est le seul endroit d'où Claude Code les charge. Ne pas les déplacer ici.

## Tes skills

| Skill | Rôle | Quand l'utiliser |
|-------|------|------------------|
| `approche-projet` | Cadrer et dérouler un projet de bout en bout selon la méthode du workspace. Renvoie à `livrables/transverse/methode-approche-projet.md` | Nouveau projet, ou "comment aborder ce projet" |
| `approche-ia-marketing-reseau` | Construire une application ou une fonctionnalité IA pour le marketing de réseau, en s'appuyant sur le programme MLM | Outil IA pour Longrich, ou "est-ce que cette fonctionnalité IA a du sens en MLM" |
| `contenu-vivier-ia` | Rédiger un brouillon d'article pour l'onglet "Contenu" de la communauté gratuite Vivier Academies, à partir d'une veille IA. Ne publie jamais seul | "Prépare un article pour Contenu" |
| `pratiquer-technique` | Te guider pas à pas dans la pratique réelle d'un chapitre technique, pour que tu montes toi-même en compétence | Tu veux t'entraîner sur un chapitre (Module 1, 2...) |
| `preparer-demo-formation` | Transformer un chapitre de cours en script de démonstration pour une vidéo ou un live | "Prépare une démo" ou un script pour filmer un chapitre |
| `programme-ecosysteme-ia` | Référence du programme de formation écosystème IA (5 modules) | Seulement sur demande explicite : "utilise le programme" |
| `programme-marketing-reseau` | Référence du programme marketing de réseau (8 parties) | Seulement sur demande explicite : "utilise le programme MLM" |
| `recherche-actualites` | Veille personnalisée filtrée selon ton contexte. Son nom interne est `recherche-actualites-contextualisees` | "Fais-moi un point sur les actualités", ou la commande `/morning` |

## Skills installés de l'extérieur

Ces deux skills viennent de Supabase (installés avec `skills-lock.json`). Ne pas les modifier à la main.

| Skill | Quand l'utiliser |
|-------|------------------|
| `supabase` | Toute tâche Supabase : base, auth, RLS, Edge Functions, CLI, débogage |
| `supabase-postgres-best-practices` | Avant d'écrire ou de modifier quoi que ce soit dans une base Postgres : schéma, migrations, index, requêtes lentes |

Fichiers actifs : `.claude/skills/<nom-du-skill>/SKILL.md`.

## Ajouter un skill

Créer le dossier dans `.claude/skills/` avec son `SKILL.md`, puis ajouter une ligne dans ce tableau.
