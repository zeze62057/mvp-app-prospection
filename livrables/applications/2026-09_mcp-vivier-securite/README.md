# MCP Vivier sécurité

Serveur MCP de diagnostic, **lecture seule**, pour la plateforme Vivier Academies. Aucun outil d'écriture.

## Mode d'emploi (5 lignes)
1. Copie `.env.example` en `.env`, remplis `N8N_URL` et `N8N_API_KEY` toi-même (jamais dans le chat), puis `npm install`.
2. Lance `npm test` : il doit finir par `OK`. Lance `node server.mjs` pour un client MCP local (Claude Desktop, Claude Code).
3. Demande : « audite le code », « quelles exécutions n8n ont échoué ? », « pourquoi l'exécution X a échoué ? ».
4. Chaque appel est écrit dans `journal.log` (heure, outil, arguments masqués, résultat).
5. **Coupure d'urgence** : crée un fichier vide nommé `REVOQUE` dans ce dossier, tout outil refuse aussitôt. Supprime-le pour rétablir.

## Outils (tous en lecture)
`n8n_lister_workflows`, `n8n_lire_workflow` (sans valeurs de credentials), `n8n_lister_executions`, `n8n_lire_execution` (cause d'échec nettoyée, jamais les données), `auditer_code_plateforme`.

## Actions automatiques autorisées
Aucune. Toute correction est une proposition, appliquée seulement après validation explicite.

## Limites connues
- Local (stdio) : marche avec Claude Desktop et Claude Code, **pas avec Cowork**, qui exige un serveur distant en HTTPS avec OAuth (phase suivante).
- L'audit est heuristique : il signale à vérifier, il ne prouve pas une faille.
- Lot base de données (rôle `mcp_diag`, migration 0051) pas encore fait.
