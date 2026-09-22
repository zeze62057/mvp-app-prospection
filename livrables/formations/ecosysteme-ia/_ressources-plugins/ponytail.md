# Ponytail

> Plugin réellement installé et vérifié dans ce workspace le 21 septembre 2026. Sert d'exemple concret pour le chapitre 3 de la section 7 du Module 1 (« Plugins et Extensions »).

## Ce que fait ce plugin

Ponytail pousse Claude Code vers la solution la plus simple qui fonctionne : d'abord se demander si le besoin existe vraiment (YAGNI), puis réutiliser ce qui existe déjà dans le projet, puis la bibliothèque standard, puis une fonction native de la plateforme, avant d'écrire du code neuf. Ça se traduit concrètement par du code plus court et moins de dépendances ajoutées sans raison.

Il propose 3 niveaux d'intensité : `lite` (construit ce qui est demandé, signale l'alternative plus simple), `full` (le niveau par défaut, applique l'échelle ci-dessus), et `ultra` (conteste la demande elle-même avant de construire).

## Pourquoi vérifier avant d'installer un plugin

Un plugin exécute du code sur ta machine, à chaque session ou à chaque message. Avant de l'installer, la démarche suivie ici :

1. **Identifier le vrai dépôt.** Une recherche a d'abord fait remonter deux noms de dépôt différents pour le même plugin. Un nom presque identique à celui du dépôt légitime est un piège classique : toujours vérifier lequel a la licence, les étoiles, et l'activité réelle avant d'installer.
2. **Lire le code des hooks avant d'installer, pas après.** Ponytail déclare 3 hooks (`SessionStart`, `SubagentStart`, `UserPromptSubmit`). Chacun a été ouvert et lu en entier : aucun appel réseau, seulement des écritures dans des fichiers locaux (un indicateur d'état, un fichier de configuration), rien qui touche à des données sensibles.
3. **Vérifier ce qui est réellement écrit sur le disque.** Un fichier `.ponytail-active` dans le dossier de configuration de Claude Code, et éventuellement un fichier de préférence par défaut. Rien d'autre.

Ce sont les mêmes réflexes que ceux vus au chapitre 1 de cette section (le système de permissions) : lire ce qui est proposé, comprendre l'impact concret, avant de valider.

## Installation pratique

Ce workspace tourne dans l'extension Claude Code de VS Code, où la commande `/plugin` n'est pas reconnue. L'installation est donc passée par l'exécutable de Claude Code embarqué dans l'extension, en ligne de commande :

```
claude plugin marketplace add DietrichGebert/ponytail
claude plugin install ponytail@ponytail
```

Si `/plugin` fonctionne dans ton environnement (Claude Code en ligne de commande, hors extension), les deux commandes équivalentes sont :

```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

Vérifier l'installation avec `claude plugin list` (ou l'équivalent dans ton environnement) : le plugin doit apparaître avec le statut `enabled`.

## Utiliser Ponytail au quotidien

| Commande | Effet |
|---|---|
| `/ponytail` | Affiche le niveau actif |
| `/ponytail lite` / `full` / `ultra` | Change de niveau pour la session |
| `/ponytail default <niveau>` | Change le niveau par défaut, pour toutes les prochaines sessions |
| `/ponytail-review` | Revue de code centrée sur la sur-ingénierie |
| `/ponytail-audit` | Audit de tout un dépôt, ce qui pourrait être supprimé ou simplifié |
| `/ponytail-debt` | Liste les raccourcis volontaires laissés dans le code (commentaires `ponytail:`) |
| `/ponytail-help` | Fiche de référence complète |

Pour le désactiver, dire simplement « stop ponytail » ou « normal mode ».

## Ce que ça change, et ce que ça ne change pas

Ponytail change la façon dont le code est écrit (plus court, moins de dépendances). Il ne change ni la langue, ni le ton des réponses, ni les autres consignes déjà données par ailleurs (dans un `CLAUDE.md` par exemple). Les deux se combinent normalement.

## Points de vigilance

- Un plugin actif s'applique à **tous** tes projets une fois installé au niveau utilisateur, pas seulement à celui où tu l'as installé.
- Toujours relire le code des hooks d'un plugin avant de l'installer, même s'il vient d'un dépôt populaire : la popularité ne remplace pas la vérification.
- Vérifier le nom exact du dépôt, en particulier s'il a été trouvé par une recherche plutôt que donné directement par une source de confiance.
