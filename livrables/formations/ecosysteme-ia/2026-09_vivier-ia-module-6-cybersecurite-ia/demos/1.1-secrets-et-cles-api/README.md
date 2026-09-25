# Démo 1.1 : trouver et réparer des secrets mal rangés

Un projet factice a déjà fait les erreurs classiques. Vous les trouvez, vous les réparez, un script vérifie.
Tout est faux : aucune vraie clé, aucun réseau. Rien ne sort de votre machine.

**Prérequis** : Node.js et Git installés. Durée : 15 minutes.

## Fichiers

| Fichier | Rôle |
|---|---|
| `preparer.mjs` | Fabrique le projet factice, avec ses erreurs |
| `verifier.mjs` | Contrôle un projet et affiche OK ou ERREUR, sans jamais montrer une valeur secrète |
| `registre-des-secrets.md` | Modèle du projet à remplir (voir plus bas) |

## Étape 1 : fabriquer le projet

```bash
node preparer.mjs
```

Le script affiche le dossier créé. Ouvrez un terminal dedans.

## Étape 2 : chercher les erreurs vous-même

Lancez les trois commandes du chapitre 1.1 :

```bash
git check-ignore -v .env
git log --all --oneline -- .env
git ls-files | grep -i "\.env"
```

Notez ce que vous voyez. Puis regardez le fichier `app.js`. Il y a une quatrième erreur.

## Étape 3 : voir le verdict du script

```bash
node <chemin-de-la-demo>/verifier.mjs .
```

**Signal attendu** : 4 lignes ERREUR.

| Erreur | Ce que ça veut dire |
|---|---|
| `.env` n'est pas ignoré | Git peut l'envoyer sur GitHub |
| fichier de secrets suivi | Git le suit déjà |
| `.env` dans l'historique | Il a déjà été enregistré dans un commit |
| clé écrite en dur | La clé est dans le code lui-même |

## Étape 4 : réparer

Dans le projet de démo, dans cet ordre :

1. Remplacez la clé écrite en dur par la lecture d'une variable : `process.env.CLE_API`.
2. Ajoutez `.env` au `.gitignore`.
3. Retirez `.env` de Git sans le supprimer du disque : `git rm --cached .env`.
4. Ce projet n'a jamais été envoyé nulle part, donc refaites le commit : `git add -A` puis `git commit --amend`.

**Signal de réussite** : `node <chemin>/verifier.mjs .` affiche 4 lignes OK et « Bravo : projet propre ».

## À retenir : ce que la démo ne montre pas

- Dans la démo, on réécrit le commit parce que rien n'a été envoyé. **Si le dépôt a déjà été envoyé sur GitHub, ce n'est pas suffisant.** La clé est considérée comme connue : on la révoque d'abord (chapitre 1.1, section « Le jour où une clé fuit »).
- Le script cherche des motifs simples. Il ne remplace pas la détection de secrets de GitHub. Un script qui ne trouve rien ne prouve pas qu'il n'y a rien.

## Limites de sécurité de cette démo

- Le projet est créé dans le dossier temporaire de votre machine, hors de tout autre dépôt Git.
- Ne lancez `verifier.mjs` que sur vos propres projets.
