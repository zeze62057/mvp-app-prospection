# agents/

Fiches des agents de ton Jarvis. **Les fichiers actifs sont dans `.claude/agents/`** : c'est le seul endroit d'où Claude Code les charge. Ne pas les déplacer ici.

| Agent | Rôle | Quand le lancer | Fichier actif |
|-------|------|-----------------|---------------|
| `agent-cadrage-projet` | Mène l'étape 1 (cadrage) de la méthode d'approche de projet : pose les questions, identifie le type de projet, écrit un brief de cadrage. Ne construit ni ne code rien | Nouveau projet à cadrer avant de construire : "cadre ce projet", "lance le cadrage" | `.claude/agents/agent-cadrage-projet.md` |
| `agent-linkedin` | Crée des posts LinkedIn prêts à publier pour ton compte personnel (vulgarisation IA en français), avec veille IA et plusieurs angles au choix. Objectif : générer des prospects qualifiés | Batch de posts, post ponctuel, repurpose d'une vidéo YouTube | `.claude/agents/agent-linkedin.md` |
| `agent-infographe` | Génère l'affiche visuelle d'un post LinkedIn déjà rédigé et l'attache à sa ligne dans la base Notion "Posts rédigés" | Après `agent-linkedin` et ta relecture (une invocation par post), avec l'URL ou l'id d'une ligne | `.claude/agents/agent-infographe.md` |
| `agent-n8n` | Diagnostique un raccordement n8n cassé (identifiants, données entre nœuds, webhooks, IA) et prépare la correction en brouillon. Ne publie et n'exécute jamais : tu le fais toi-même | Un workflow échoue, un raccordement ne passe pas, un nouveau workflow à construire en brouillon. Nécessite le connecteur n8n connecté | `.claude/agents/agent-n8n.md` |

## Chaînage

`agent-linkedin` rédige les posts et te donne les liens Notion. Tu relis, puis tu lances `agent-infographe` pour l'affiche de chacun. Le chaînage automatique a été retiré le 2026-09-25 : `agent-linkedin` lit le web (contenu non fiable), il ne doit pas déclencher un autre agent sans ton accord. Ses outils sont limités : recherche et lecture web, lecture et écriture de fichiers, création de pages Notion.

## Fichiers liés

- Mémoire de `agent-linkedin` : `livrables/transverse/linkedin-memoire-agent.md`
- Méthode suivie par `agent-cadrage-projet` : `livrables/transverse/methode-approche-projet.md`

## Ajouter un agent

Créer le fichier dans `.claude/agents/`, puis ajouter une ligne dans ce tableau.
