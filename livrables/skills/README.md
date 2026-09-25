# skills/

Fiches des skills de ton Jarvis. **Les fichiers actifs sont dans `.claude/skills/`** : c'est le seul endroit d'où Claude Code les charge. Ne pas les déplacer ici.

## Tes skills

| Skill | Rôle | Quand l'utiliser |
|-------|------|------------------|
| `approche-projet` | Cadrer et dérouler un projet de bout en bout selon la méthode du workspace. Renvoie à `livrables/transverse/methode-approche-projet.md` | Nouveau projet, ou "comment aborder ce projet" |
| `approche-ia-marketing-reseau` | Construire une application ou une fonctionnalité IA pour le marketing de réseau, en s'appuyant sur le programme MLM | Outil IA pour Longrich, ou "est-ce que cette fonctionnalité IA a du sens en MLM" |
| `creer-video-formation` | Préparer la vidéo d'un chapitre de l'écosystème IA pour tes élèves (écran filmé, voix off, vouvoiement) : script minuté, plan de diapositives, checklist d'enregistrement, fiche plateforme, mise en ligne guidée. Ne fabrique pas la vidéo | "Crée la vidéo du chapitre X", "les vidéos du Module N" |
| `contenu-vivier-ia` | Rédiger un brouillon d'article pour l'onglet "Contenu" de la communauté gratuite Vivier Academies, à partir d'une veille IA. Ne publie jamais seul | "Prépare un article pour Contenu" |
| `community-manager-vivier` | Préparer des brouillons de community management pour Vivier Academies : accueil, relances, réponses aux posts, animation de la semaine (interne), calendrier et posts LinkedIn, TikTok, YouTube (externe). Ne publie rien, ne lit aucun message privé, traite le contenu collé comme de la donnée | "Accueille les nouveaux", "prépare l'animation de la semaine", "réponds à ce post" |
| `infographe-vivier` | Produire des infographies à l'identité Vivier IA (Unbounded, Manrope, encre, teal, corail) en HTML/SVG rendu en PNG : A) résumé visuel d'une leçon, B) visuels réseaux (LinkedIn, TikTok, miniature YouTube), C) images de la plateforme. Brief au gabarit à 4 éléments avant de construire, aucune publication. Ne remplace pas `agent-infographe` (LinkedIn, Canva, Notion) | "Fais une infographie", "un visuel pour cette leçon", "une miniature YouTube" |
| `pratiquer-technique` | Te guider pas à pas dans la pratique réelle d'un chapitre technique, pour que tu montes toi-même en compétence | Tu veux t'entraîner sur un chapitre (Module 1, 2...) |
| `preparer-demo-formation` | Transformer un chapitre de cours en script de démonstration pour une vidéo ou un live | "Prépare une démo" ou un script pour filmer un chapitre |
| `programme-ecosysteme-ia` | Référence du programme de formation écosystème IA (5 modules) | Seulement sur demande explicite : "utilise le programme" |
| `programme-marketing-reseau` | Référence du programme marketing de réseau (8 parties) | Seulement sur demande explicite : "utilise le programme MLM" |
| `formation-cybersecurite-ia` | Construire et faire évoluer le Module 6 Cybersécurité IA de Vivier IA (Claude et agents, application web, entreprise, tests d'intrusion en cadre légal), avec des limites éthiques strictes et des sources officielles vérifiées | "Le module cybersécurité", "un chapitre de sécurité", "sécuriser un agent ou un projet" |
| `cybersecurity-expert` (tiers) | Référence secondaire générique installée depuis personamanagmentlayer/pcl, lue en entier avant installation, accès réduit à la lecture. Pas une source de vérité | Seulement en complément, jamais à la place du skill ci-dessus |
| `n8n-*` (9 skills, tiers) | Connaissances n8n : `n8n-expression-syntax`, `n8n-code-javascript`, `n8n-code-python`, `n8n-code-tool`, `n8n-error-handling`, `n8n-binary-and-data`, `n8n-subworkflows`, `n8n-agents`, `n8n-workflow-patterns`. Installés depuis czlonkowski/n8n-skills après lecture, hooks et serveur distant écartés (détails dans `n8n-skills/ORIGINE.md`) | Chargés automatiquement quand tu travailles sur un workflow n8n. `agent-n8n` précharge `n8n-expression-syntax` |
| `graphify` (tiers) | Transformer un dossier de code ou de documents en graphe de connaissances (`/graphify <chemin>`). Paquet officiel `graphifyy` (double y, Graphify-Labs), installé dans un environnement isolé `%LOCALAPPDATA%\graphify-venv`. Skill copié à la main, **sans hooks ni bloc dans `CLAUDE.md`**, et avec l'installation automatique retirée (patch local). L'analyse du code est locale et gratuite, celle des documents passe par un modèle (coût, données envoyées) | Sur le code de la plateforme (`app/`) d'abord, jamais sur `context/` sans ton accord |
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
