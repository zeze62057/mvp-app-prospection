# Chapitre 1.3 : Permissions des outils et des agents, le moindre privilège

> Module 6, Partie 1. État : **rédigé le 2026-09-25**. Sources officielles lues (liste en fin de chapitre). Démo et règles testées en direct. Reste la relecture de Zézé.
> Rappel du cadre : tout ce chapitre se pratique sur **vos propres** réglages et sur un terrain factice avec de faux secrets.

## Objectif

À la fin de ce chapitre, vous savez donner à un agent **seulement** les accès dont il a besoin, écrire des règles de permission qui font ce que vous croyez, et connaître ce qu'elles ne bloquent pas.

**Public** : élève débutant à intermédiaire. **Liens** : chapitre 1.1 (règles de refus sur `.env`), chapitre 1.2 (injection de prompt : la vraie défense, c'est ce chapitre), Module 1 (Claude Code).

## Le principe

Le moindre privilège : un agent n'a que les accès nécessaires à sa tâche. Rien de plus.

Pourquoi. Le chapitre 1.2 l'a montré : on ne peut pas garantir qu'un agent n'obéira jamais à une instruction cachée. Si l'agent n'a pas l'accès, l'instruction ne peut rien faire. C'est la mesure 4 de l'OWASP (privilèges) et la recommandation de la documentation développeurs d'Anthropic : limiter l'accès de Claude aux données et actions sensibles.

## Les règles ne sont pas dans le prompt

La documentation le dit clairement : les règles de permission sont appliquées par Claude Code, **pas par le modèle**. Vos instructions dans un message ou dans `CLAUDE.md` changent ce que Claude *essaie* de faire. Elles ne changent pas ce que Claude Code *autorise*.

**Conséquence.** Écrire « ne lis jamais le .env » dans un fichier de consignes n'est pas une protection. Une règle `deny` dans les réglages en est une.

## Ce qui est demandé par défaut

En mode manuel, la documentation donne ce tableau :

| Type d'outil | Exemple | Accord demandé ? |
|---|---|---|
| Lecture seule | Lire un fichier, chercher | Non, dans le dossier de travail |
| Commandes du terminal | Exécuter une commande | Oui, sauf un ensemble de commandes en lecture seule |
| Modification de fichiers | Écrire, modifier | Oui |
| Lecture web | WebFetch | Oui, sauf des domaines de documentation pré-approuvés |
| Recherche web | WebSearch | Oui |

Le mot à retenir : **`grep`, `cat`, `ls`, `head`, `tail`, `find` font partie des commandes en lecture seule** qui tournent sans demande dans tous les modes. Ce sont les règles `Read` qui les surveillent, pas la demande d'accord. Cela explique le résultat du test plus bas.

## Les modes de permission

| Mode | Ce qui passe sans demande | Pour quoi faire |
|---|---|---|
| `default` (Manuel) | Les lectures | Travail sensible |
| `acceptEdits` | Lectures, modifications de fichiers, commandes de fichiers courantes (`mkdir`, `touch`, `mv`, `cp`) | Itérer sur du code que vous relisez |
| `plan` | Les lectures | Explorer avant de changer |
| `auto` | Presque tout, avec des vérifications de sécurité en arrière-plan | Longues tâches |
| `dontAsk` | Lectures et outils pré-approuvés, le reste est refusé | Scripts verrouillés |
| `bypassPermissions` | Tout | **Conteneurs et machines virtuelles isolés seulement** |

Deux faits importants :

- Sur les forfaits Pro, Max et Team, le mode de départ intégré est **auto** (versions récentes). Vérifiez dans quel mode vous travaillez.
- Les règles de refus s'appliquent **dans tous les modes**, y compris `bypassPermissions`.

Pour vous interdire le mode sans demandes, la documentation donne le réglage `permissions.disableBypassPermissionsMode` à `"disable"`.

## Écrire des règles

Trois familles : `allow` (autorise sans demande), `ask` (demande toujours), `deny` (interdit).

**Ordre d'évaluation : deny, puis ask, puis allow. La première qui correspond décide.** Une règle allow ne peut pas faire d'exception à une règle deny. Un refus, à n'importe quel niveau de réglages, ne peut être annulé par aucun autre niveau.

Exemple de la documentation :

```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Bash(git commit *)"],
    "deny": ["Bash(git push *)"]
  }
}
```

### Le joker `*`

- Placez le `*` **après** la sous-commande. `Bash(git log *)` autorise seulement `git log`. `Bash(git *)` autorise **toutes** les commandes git.
- Un `*` avant la fin, comme `Bash(git * main)`, couvre aussi des options. La documentation cite `git -c core.fsmonitor=<script> diff main`, qui fait exécuter un programme.
- L'espace avant le `*` compte : `Bash(ls *)` ne couvre pas `lsof`, `Bash(ls*)` oui.
- Les lanceurs comme `npx`, `docker exec`, `devbox run` exécutent leurs arguments : une règle sur le lanceur couvre tout ce qui suit. Écrivez la règle avec la commande complète.

### Les chemins de fichiers

Les règles `Read` et `Edit` suivent la syntaxe de `.gitignore`.

| Écriture | Sens |
|---|---|
| `//chemin` | Chemin absolu depuis la racine du disque |
| `~/chemin` | Depuis votre dossier personnel |
| `/chemin` | Relatif à la source des réglages (**pas** absolu) |
| `chemin` ou `./chemin` | Relatif au dossier courant |

Pièges de la documentation :

- `/Users/alice/fichier` n'est pas un chemin absolu. Utilisez `//Users/alice/fichier`.
- Sur Windows, `C:\Users\alice` devient `/c/Users/alice`. Pour couvrir les `.env` de tout le disque : `//c/**/.env`.
- Seules les règles `Edit(...)` et `Read(...)` sont consultées pour les fichiers. Une règle de chemin sur `Write`, `NotebookEdit` ou `Glob` est acceptée mais **jamais consultée**.
- Une règle `Read` en refus bloque aussi l'écriture au même endroit, y compris la création d'un fichier.
- Pour un refus, `Read(secrets/**)` couvre un dossier `secrets` à toute profondeur. Pour un allow, `Edit(src/**)` ne couvre que `src` à la racine.

### Ce qu'une règle Bash ne bloque pas

La documentation est nette : une règle deny ou ask Bash couvre la forme que Claude écrit d'habitude, et **n'est pas une frontière de sécurité autour du programme**.

| Règle | Arrête | N'arrête pas |
|---|---|---|
| `Bash(curl *)` | `curl https://example.com` | `/usr/bin/curl ...`, `sh -c 'curl ...'` |
| `Bash(rm *)` | `rm -rf build/` | `/bin/rm -rf build/`, `bash -c 'rm -rf build/'` |
| `Bash(git push *)` | `git push origin main` | `git -C . push origin main` |

Pour aller plus loin, la documentation propose deux outils : le **bac à sable** (application au niveau du système d'exploitation) et un **hook PreToolUse** (votre propre code qui inspecte la commande avant qu'elle parte). Un hook qui refuse (code de sortie 2) bloque l'appel même si une règle allow existait. Les règles deny et ask, elles, s'appliquent quoi que réponde un hook.

## Les agents : la liste d'outils

Un agent (sous-agent) déclare ses outils dans l'en-tête de son fichier.

- **Si le champ `tools` est absent, l'agent hérite de tous les outils disponibles.** C'est le cas par défaut.
- `tools: Read, Grep, Glob` = liste blanche : seulement ceux-là.
- `disallowedTools: Write, Edit` = liste noire : tout sauf ceux-là.
- Les outils venant d'un serveur MCP s'écrivent `mcp__<serveur>` ou `mcp__<serveur>__<outil>`. Les connecteurs de claude.ai apparaissent sous la forme `mcp__claude_ai_<serveur>__<outil>`.
- Un `disallowedTools` avec une commande, comme `Bash(git push *)`, retire **tout l'outil Bash**, pas seulement cette commande. Pour bloquer une commande précise, utilisez `permissions.deny` dans les réglages.
- Si aucun nom de la liste `tools` n'existe (fautes de frappe), Claude Code refuse de lancer l'agent (versions récentes).

Pour donner à un agent l'outil de créer des pages Notion mais pas de tout modifier, on liste seulement les outils Notion utiles. C'est ce qui a été fait pour l'agent LinkedIn (voir le cas réel).

## Le bac à sable

Le bac à sable limite ce que les commandes du terminal peuvent lire, écrire et joindre sur le réseau, **au niveau du système d'exploitation**, y compris pour leurs sous-processus. Il se lance avec `/sandbox`.

Ce que dit la documentation :

- Il fonctionne sur **macOS, Linux et WSL2**. **Windows natif n'est pas pris en charge** : sous Windows, il faut lancer Claude Code dans une distribution WSL2.
- Il ne s'applique qu'aux commandes du terminal. Les outils de lecture et d'écriture de Claude passent par le système de permissions.
- Il est complémentaire des règles : « même si une injection de prompt contourne la décision de Claude », les limites du bac à sable restent.
- Il n'est pas parfait : autoriser un domaine très large (par exemple github.com) peut ouvrir un chemin pour sortir des données. L'isolation réseau et l'isolation des fichiers sont toutes deux nécessaires.
- Les variables d'environnement du processus parent, dont d'éventuels secrets, sont héritées par défaut. Le réglage `sandbox.credentials` permet d'en retirer.

## Test en direct (2026-09-25)

Sur un dossier factice `secrets-demo/` avec un faux secret, et une règle `Read` en refus sur ce dossier. Système : Windows natif, donc **sans bac à sable**.

| Essai | Résultat |
|---|---|
| Lecture avec l'outil de lecture de Claude | **Refusée** |
| Écrire un fichier dans le dossier | **Refusé** |
| `cat` du fichier | **Refusé** |
| `grep -r` qui nomme le dossier | **Refusé** |
| `grep -r` lancé depuis l'intérieur du dossier | **Refusé** |
| `grep -r` lancé depuis le **dossier parent**, avec `.` | **A affiché le faux secret** |
| Script Node qui lit lui-même le fichier | **A affiché le faux secret** |
| Lire un fichier d'un autre dossier, non protégé | Autorisé |

Lecture : la règle ferme les chemins évidents et un `grep` qui nomme le dossier. Elle ne ferme pas un `grep` lancé depuis plus haut, ni un script. Cela correspond exactement à la limite que la documentation annonce. Sur cette machine, seul le bac à sable (WSL2) pourrait fermer ces deux derniers.

Ne généralisez pas : c'est un essai, sur une version de Claude Code, sur Windows. Refaites-le chez vous avec la démo.

## Cas réel : l'agent LinkedIn et les réglages du workspace

**L'agent LinkedIn** (voir le chapitre 1.2). Avant : pas de champ `tools`, donc tous les outils. Après la correction du 2026-09-25 : recherche web, lecture web, lecture et écriture de fichiers, création et lecture de pages Notion. Il n'a plus le terminal ni la possibilité d'appeler un autre agent.

Reste ouvert : la liste ne dit pas **où** il peut écrire. Une règle `Edit` dans les réglages du projet peut le cadrer, par exemple en refusant l'écriture dans les dossiers sensibles. À écrire et tester avec la démo.

**Les réglages locaux du workspace**, audités avec le script de la démo :

- `enableAllProjectMcpServers` était à `true` : d'après la documentation, tous les serveurs d'un fichier `.mcp.json` de projet sont approuvés sans demande. **Corrigé le 2026-09-25** : réglage retiré, seul le serveur nommé dans `enabledMcpjsonServers` (playwright) reste approuvé.
- Deux anciennes règles d'autorisation pointaient vers le dossier personnel d'un autre profil d'utilisateur Windows. **Supprimées le 2026-09-25.**
- Des règles d'un seul usage (un renommage de fichier, un script de test) traînent encore dans la liste. Une règle allow qui ne sert plus est un accès de trop : à nettoyer à la prochaine revue.
- La règle de refus sur `.env` n'est pas dans ce fichier mais dans `.claude/settings.json` : les règles de refus des fichiers s'additionnent. Le script signale donc un faux positif sur ce point si on l'exécute fichier par fichier.
- Le bac à sable n'existe pas sur cette machine (Windows natif).

## Ce que le chapitre ne couvre pas

- Les réglages gérés par une organisation (`managed settings`) : mentionnés par la documentation, ils s'adressent aux entreprises.
- Les hooks en détail : le chapitre dit ce qu'ils permettent, pas comment les écrire.
- Le classificateur du mode `auto` : la documentation décrit qu'il existe, ce chapitre n'affirme rien sur son taux de réussite.

## Démo et projet

- **Démo (30 minutes)** : un script qui audite des réglages (un exemple fragile, un corrigé, les vôtres), puis un terrain factice pour tester 8 demandes. Dossier : [demos/1.3-permissions-et-moindre-privilege](../demos/1.3-permissions-et-moindre-privilege/README.md).
- **Projet** : remplir la [matrice des accès](../demos/1.3-permissions-et-moindre-privilege/matrice-des-acces.md) de votre projet principal.

**Signal de réussite du chapitre** : vous avez audité vos réglages, testé au moins les 8 demandes du terrain, et vous savez dire quelles lignes votre configuration ne bloque pas.

## Vérifiez vos acquis

1. Une consigne dans `CLAUDE.md` peut-elle remplacer une règle `deny` ? Pourquoi ?
2. Dans quel ordre les règles allow, ask et deny sont-elles évaluées ? Une règle allow précise peut-elle faire exception à un deny large ?
3. Que donne un agent dont le fichier n'a pas de champ `tools` ?
4. `Bash(git *)` autorise quoi ?
5. Une règle `Read(./secrets/**)` arrête-t-elle un script Node qui ouvre `secrets/cle.txt` ? Que faut-il ajouter ?

Réponses : 1) Non. Les règles sont appliquées par Claude Code, pas par le modèle. 2) Deny, ask, allow ; non, un allow ne peut pas faire d'exception à un deny. 3) Tous les outils disponibles. 4) Toutes les commandes git. 5) Non. Le bac à sable, disponible sur macOS, Linux et WSL2 seulement.

## Sources et vérifications (2026-09-25)

**Confirmé dans les pages officielles, lues en entier ou dans les sections citées :**

- Claude Code, « Configure permissions » : tableau des outils, ordre deny/ask/allow, syntaxe des règles, jokers, chemins, limites des règles Bash, hooks, sous-agents, réglages et confiance. https://code.claude.com/docs/en/permissions
- Claude Code, « Choose a permission mode » : les six modes, mode de départ, actions jamais auto-approuvées. https://code.claude.com/docs/en/permission-modes
- Claude Code, « Configure the sandboxed Bash tool » : bac à sable, plateformes prises en charge, limites, identifiants. https://code.claude.com/docs/en/sandboxing
- Claude Code, « Create custom subagents » : champs de l'en-tête, `tools`, `disallowedTools`, motifs MCP. https://code.claude.com/docs/en/sub-agents
- Claude Code, « Settings reference » : `enableAllProjectMcpServers`, `enabledMcpjsonServers`, `permissions.defaultMode`, `disableBypassPermissionsMode`. https://code.claude.com/docs/en/settings-reference
- OWASP LLM01 et documentation développeurs d'Anthropic : voir le chapitre 1.2.

**Non enseigné (non vérifié) :**

- Le détail du classificateur du mode `auto` et son efficacité.
- Le comportement exact des refus sur les versions plus anciennes : plusieurs comportements cités dépendent de la version de Claude Code.
- L'écriture d'un hook PreToolUse : la page dédiée aux hooks n'a pas été lue.

**Testé le 2026-09-25 :**

- Le script d'audit sur un fichier fragile (2 erreurs, 8 attentions, 2 infos), un fichier corrigé (aucune erreur), un JSON invalide, un fichier introuvable, et les vrais réglages du workspace.
- Les règles de refus sur un dossier factice (tableau ci-dessus). Windows natif, une seule version de Claude Code, un seul essai.
