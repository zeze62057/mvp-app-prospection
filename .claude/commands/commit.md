# /commit

> Commande pour créer un commit Git propre à partir des changements en cours.

---

## Mission

Quand je lance `/commit`, exécute la séquence suivante :

### Étape 1 : Faire le point sur les changements

Lance en parallèle :
- `git status`
- `git diff` (changements non indexés)
- `git diff --staged` (changements déjà indexés)
- `git log --oneline -5` (pour caler le style des messages précédents)

Si le workspace n'est pas un dépôt Git, signale-le et propose de lancer `git init` d'abord. Ne fais rien d'autre.

Si aucun changement n'est à committer, dis-le simplement et arrête-toi là.

### Étape 2 : Contrôle de sécurité secrets

Avant toute chose, vérifie qu'aucun fichier sensible n'est sur le point d'être committé :
- `git status --short` ne doit montrer ni `.env`, ni `.env.*` (sauf `.env.example`), ni `*.key`, ni `*.pem`
- En cas de doute, lance `git check-ignore -v .env`

Si un fichier sensible apparaît dans les fichiers suivis ou indexés, ARRÊTE-TOI, préviens-moi clairement, et propose de l'ajouter au `.gitignore` ou de le désindexer avec `git rm --cached`. Ne committe jamais tant que ce n'est pas réglé.

### Étape 3 : Proposer un plan de commit

Analyse les changements et regroupe-les logiquement.

- Si tout va ensemble : propose **un seul commit**.
- Si les changements couvrent des sujets distincts : propose **plusieurs commits** avec le découpage des fichiers.

Présente le plan avant d'agir :

```
Voici ce que je vais committer :

Commit 1 : [message proposé]
  Fichiers : [liste]

Commit 2 (si besoin) : [message proposé]
  Fichiers : [liste]

Tu valides ?
```

### Étape 4 : Exécuter

Une fois validé :
1. `git add` uniquement les fichiers concernés par chaque commit (jamais `git add -A` à l'aveugle si un fichier sensible traîne)
2. Crée le commit avec le message validé
3. Le message de commit doit se terminer par :

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

4. Ne fais JAMAIS `git push` de toi-même. Attends que je le demande explicitement.

### Étape 5 : Confirmer

Annonce le résultat :

```
C'est fait.
- [hash court] [message] ([n] fichiers)

Rien n'a été poussé. Dis-moi si tu veux que je fasse un git push.
```

---

## Format des messages de commit

- Première ligne : résumé court à l'impératif, en français, 70 caractères max
  Exemple : `Ajoute le dossier livrables et la config des secrets`
- Si utile, une ligne vide puis un corps qui explique le pourquoi, pas le comment
- Un préfixe de type est optionnel (`feat:`, `fix:`, `docs:`, `chore:`), à utiliser seulement si je le demande

---

## Règles importantes

- Ne committe jamais sans avoir présenté un plan et reçu validation
- Contrôle de sécurité secrets systématique avant chaque commit
- Jamais de `git push` sans demande explicite de ma part
- Jamais `--no-verify` ni contournement de hook
- Pas de tirets longs (em dashes) dans les messages
- Communication en français systématique
