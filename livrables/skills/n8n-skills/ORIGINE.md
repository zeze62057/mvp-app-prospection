# Skills n8n (tiers) : origine et décisions d'installation

Installés le 2026-09-25 par copie manuelle, après lecture. Ce fichier garde la trace de ce qui a été lu, gardé et écarté.

## Source

- Dépôt : https://github.com/czlonkowski/n8n-skills (auteur : Romuald Członkowski)
- Version lue : 1.35.0, commit `19cd793f4789e3ef9c657ccf26e097f641a77df0` (2026-09-16)
- Licence : MIT (copie dans `LICENSE`). Les scripts de hooks du dépôt reprennent du code d'un dépôt n8n-io sous licence Apache 2.0. Ces scripts ne sont **pas** installés.
- Attention : d'autres dépôts portent le même nom (copies d'autres comptes). Seul celui de l'auteur ci-dessus a été lu.

## Ce qui a été lu

| Partie du dépôt | Lecture | Résultat |
|---|---|---|
| Manifestes du plugin, `mcp.json`, `.mcp.json.example`, `hooks.json`, `build.sh` | En entier | Rien de malveillant. Voir les risques ci-dessous |
| 10 scripts de hooks (`.sh`) | En entier | Ils injectent des rappels dans le contexte et écrivent des marqueurs dans le dossier temporaire. Aucun réseau, aucun accès aux fichiers du projet |
| 9 skills gardés (51 fichiers Markdown, 651 Ko) | Analyse par script (contenu caché, phrases d'injection, domaines, commandes à risque) et lecture des descriptions et d'un skill complet | Aucun contenu caché, aucune commande dangereuse. Le détecteur de la démo 1.2 signale seulement des mentions normales de « system prompt ». Domaines cités : exemples (`example.com`), documentation n8n, site de l'auteur |
| Les 6 autres skills | Descriptions lues | Écartés, voir ci-dessous |

**Limite honnête :** les 651 Ko de skills n'ont pas été relus ligne par ligne. Ce sont des instructions en texte : elles influencent l'agent, elles n'exécutent rien elles-mêmes.

## Ce qui est installé (9 skills dans `.claude/skills/`)

`n8n-expression-syntax`, `n8n-code-javascript`, `n8n-code-python`, `n8n-code-tool`, `n8n-error-handling`, `n8n-binary-and-data`, `n8n-subworkflows`, `n8n-agents`, `n8n-workflow-patterns`.

Ce sont des connaissances sur n8n lui-même (syntaxe d'expressions, nœuds Code, gestion d'erreurs, agents IA, sous-workflows, motifs d'architecture). Elles ne dépendent pas d'un serveur MCP précis.

## Ce qui est écarté, et pourquoi

| Élément | Raison |
|---|---|
| Le plugin complet et ses hooks | Les hooks ciblent les outils d'un autre serveur (`n8n_create_workflow`, etc.), pas ton connecteur. Ils n'apporteraient rien, et ils exécutent des scripts à chaque session |
| `mcp.json` (serveur distant `api.n8n-mcp.com`) | Un serveur tiers hébergé recevrait les données de ton instance. À ne connecter que sur décision explicite, après lecture de sa politique de données |
| `n8n-self-hosting` | Déploie n8n sur un serveur par SSH (scripts, Docker, HTTPS). Pouvoir trop large pour ton besoin actuel |
| `n8n-mcp-tools-expert`, `n8n-multi-instance`, `using-n8n-mcp-skills` | Écrits pour les outils d'un autre serveur MCP, ils décriraient des outils que tu n'as pas |
| `n8n-node-configuration`, `n8n-validation-expert` | Partiellement liés aux outils de cet autre serveur. À reconsidérer plus tard, après lecture complète |

## Limite à connaître

Certains passages des 9 skills gardés citent les outils de l'autre serveur (`n8n_update_partial_workflow`, `get_node`...). Ton connecteur a d'autres noms (`update_workflow`, `create_workflow_from_code`...). L'agent doit transposer. Ne pas se fier à ces noms d'outils dans les skills.

## Pour désinstaller

Supprimer les 9 dossiers `.claude/skills/n8n-*` listés ci-dessus.
