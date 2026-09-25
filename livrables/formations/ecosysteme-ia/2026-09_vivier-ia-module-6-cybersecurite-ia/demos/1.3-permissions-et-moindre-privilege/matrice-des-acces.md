# Projet 1.3 : ma matrice des accès

Pour **vos propres** agents et votre propre projet. Aucune valeur secrète dans ce fichier.

## 1. Un agent par ligne

| Agent ou session | Ce qu'il doit faire | Outils dont il a besoin | Outils que je retire | Lit du contenu extérieur ? (oui/non) |
|---|---|---|---|---|
| (exemple) agent de veille | Lire des articles, écrire un brouillon | Recherche web, lecture web, écriture d'un fichier | Terminal, autres agents | oui |
|  |  |  |  |  |
|  |  |  |  |  |

Règle : si l'agent lit du contenu extérieur (chapitre 1.2), il ne garde pas d'outil qui agit sur vos fichiers ou vos comptes au-delà de sa tâche.

## 2. Mes règles de refus (projet)

| Ce que je protège | Règle | Fichier de réglages |
|---|---|---|
| Fichiers de secrets | `Read(./.env)`, `Read(./.env.*)` |  |
| Dossier de secrets | `Read(./secrets/**)` |  |
| Commandes que je veux voir passer par mon accord | `Bash(git push *)` |  |
|  |  |  |

## 3. Mes règles d'autorisation (allow)

Chaque règle doit être **la commande exacte** ou une famille étroite. Écrivez pourquoi.

| Règle allow | Pourquoi | Trop large ? |
|---|---|---|
|  |  |  |

## 4. Mode et isolation

- Mode de permission utilisé au quotidien : _______
- Je désactive le mode sans demandes (`disableBypassPermissionsMode`) : oui / non
- Mon système : macOS, Linux, WSL2 (bac à sable possible) ou Windows natif (pas de bac à sable) : _______
- Serveurs MCP de projet : je nomme ceux que j'approuve au lieu de tous les approuver : oui / non

## 5. Vérification

- [ ] `node auditer-reglages.mjs` lancé sur chaque fichier de réglages, résultat noté
- [ ] Terrain factice testé : les 8 lignes du tableau remplies
- [ ] Ligne 7 et 8 : je sais ce que ma configuration ne bloque pas

**Livrable** : cette matrice remplie pour votre projet principal.
