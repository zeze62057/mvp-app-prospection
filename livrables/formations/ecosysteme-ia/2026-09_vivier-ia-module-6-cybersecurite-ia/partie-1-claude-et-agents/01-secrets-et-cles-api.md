# Chapitre 1.1 : Secrets et clés API, où ils vivent, où ils ne vont jamais

> Module 6, Partie 1. État : **rédigé le 2026-09-25**. Sources officielles lues (liste en fin de chapitre). Les commandes Git et la règle de refus ont été testées en direct. Reste la relecture de Zézé.
> Rappel du cadre : tout ce chapitre se pratique sur **vos propres** projets. Aucun exercice n'a besoin de toucher le système de quelqu'un d'autre.

## Objectif

À la fin de ce chapitre, vous savez où ranger vos clés et vos mots de passe, comment empêcher qu'elles partent sur GitHub ou dans une conversation avec Claude, et quoi faire, dans l'ordre, le jour où l'une d'elles fuit.

**Public** : élève débutant à intermédiaire. **Lien avec les autres modules** : le Module 1 (Claude Code) pour les permissions, le Module 4 (RGPD et AI Act) pour les données personnelles. Les clés « publiques » et « serveur » d'une application web sont traitées au chapitre 2.8.

## Ce qu'est un secret

Un secret, c'est tout ce qui donne accès à quelque chose à la place de vous. Une clé d'API, un mot de passe, un jeton d'accès. Celui qui le possède peut agir en votre nom, et payer avec votre carte.

Une clé d'API se traite comme un mot de passe : on ne la partage pas.

## Les sept règles d'Anthropic

La page officielle d'Anthropic sur les bonnes pratiques pour les clés d'API donne sept recommandations. Les voici, dans l'ordre de la page.

1. **Ne partagez jamais votre clé.**
2. **Surveillez l'usage.** Regardez régulièrement les journaux et l'usage dans la console.
3. **Utilisez des variables d'environnement**, et ajoutez vos fichiers `.env` au fichier qui dit à Git d'ignorer des fichiers.
4. **Changez vos clés régulièrement.** L'exemple donné par la page : tous les 90 jours.
5. **Une clé par usage.** Une pour le développement, une pour les tests, une pour la production.
6. **Cherchez vos secrets dans vos dépôts.** Vérifiez régulièrement que rien n'a été envoyé par erreur.
7. **Utilisez un gestionnaire de clés** quand votre activité grandit. Il centralise le stockage et l'accès.

## Où vivent les secrets

**Règle simple : un secret vit dans un fichier local que Git ignore.** Jamais dans le code, jamais dans un message.

### Installation pratique

Trois vérifications à faire sur votre projet, dans le dossier du projet.

**1. Git ignore-t-il bien votre fichier de secrets ?**

```bash
git check-ignore -v .env
```

Si Git affiche une ligne avec le nom de la règle (par exemple `.gitignore:2:.env	.env`), le fichier est ignoré. Si la commande n'affiche rien, ajoutez `.env` à votre fichier `.gitignore`.

**2. Le fichier a-t-il déjà été envoyé un jour ?**

```bash
git log --all --oneline -- .env
```

Aucune ligne affichée : le fichier n'a jamais été enregistré. Si une ligne apparaît, une clé est peut-être dans l'historique : passez à la section « Le jour où une clé fuit ».

**3. Quels fichiers de secrets sont suivis par Git ?**

```bash
git ls-files | grep -i "\.env"
```

Vous ne devez voir que des modèles, comme `.env.example`. Un modèle contient les **noms** des variables, jamais leurs valeurs.

## Protéger vos secrets contre l'agent lui-même

Un agent comme Claude Code lit vos fichiers pour travailler. Il peut donc lire votre `.env`, puis en afficher un morceau à l'écran ou l'envoyer dans une conversation. Il faut le lui interdire.

La documentation de Claude Code décrit des **règles de refus**. Voici l'exemple exact de sa page de réglages, à mettre dans le fichier de réglages :

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

Ce que dit la documentation, et ce qu'il faut en retenir :

- Une règle de refus `Read` bloque les outils de lecture de fichiers de Claude, et aussi les commandes de fichier que Claude Code reconnaît dans le terminal, comme `cat`, `head`, `tail`.
- Elle ne bloque **pas** une commande qui lit des fichiers sans les nommer, par exemple `grep -r` lancé depuis le dossier qui contient le fichier. Elle ne bloque pas non plus un script qui ouvre lui-même les fichiers.
- Pour interdire l'accès à **tous** les processus, la documentation indique d'activer le **bac à sable** (`/sandbox`).
- Les réglages sont du JSON strict : un commentaire ou une virgule en trop provoque une erreur au démarrage.
- Les fichiers de réglages existent à plusieurs niveaux : entreprise, ligne de commande, projet local, projet partagé, utilisateur. Un niveau plus haut l'emporte sur un niveau plus bas.
- Pour vérifier vos réglages, la documentation propose la commande `/permissions`.

**À retenir.** Une règle de refus est une bonne première protection. Ce n'est pas un mur complet. Pour un vrai mur, on ajoute le bac à sable.

## Le jour où une clé fuit

Suivez cet ordre. La première action est de **révoquer**, pas de chercher qui a fait l'erreur.

1. **Révoquez la clé tout de suite.** Chez Anthropic : connectez-vous à la console, ouvrez la page des clés d'API depuis votre profil, ouvrez le menu à trois points à côté de la clé, choisissez « Delete API Key ».
2. **Créez une clé de remplacement** depuis la même page.
3. **Rangez la nouvelle clé** dans un endroit sûr (gestionnaire de secrets) et **jamais** dans le contrôle de version.
4. **Contactez le support** si vous voyez encore une activité suspecte.
5. **Nettoyez le dépôt.** La documentation de GitHub indique, pour retirer des données envoyées, l'outil `git filter-repo`, ou d'annuler les changements en local s'ils n'ont pas été envoyés. Elle indique aussi que la détection de secrets de GitHub peut servir à signaler et révoquer des identifiants.

La page d'Anthropic ne dit pas comment vérifier l'usage passé, ni s'il faut changer d'autres identifiants. Ne promettez donc pas à un client que ces étapes suffisent : vérifiez l'usage dans la console, et changez aussi les autres accès qui pouvaient se trouver au même endroit.

## Empêcher l'erreur avant qu'elle arrive

GitHub propose la **détection de secrets** et la **protection au push**. La documentation dit que la protection au push « prévient l'envoi de code contenant un secret détecté ». Elle se recommande sur vos dépôts. Consultez la page GitHub pour l'activer sur votre compte : l'emplacement exact dans l'interface change avec le temps, ne l'apprenez pas par cœur.

## Cas réel : un agent qui lit un fichier de secrets

Pendant la construction de la plateforme Vivier Academies, un assistant IA a lancé une commande qui lit la fin d'un fichier de secrets. Résultat : un fragment d'une clé s'est affiché à l'écran.

- **Gravité** : à évaluer sur le moment. Le fragment était partiel, mais la bonne question est toujours : la clé doit-elle être changée ? En cas de doute, on la change.
- **Cause** : la commande a lu le contenu du fichier au lieu de lister **seulement les noms** des variables.
- **Ce qui a bien marché** : la clé n'était pas dans le dépôt Git, et elle n'a jamais été collée dans une conversation.
- **Ce qu'on a changé** : la règle de travail est de ne lire que les **noms** des variables d'un fichier de secrets, jamais leurs valeurs. Une règle de refus `Read` sur `.env` aurait bloqué ce cas.

La leçon : un agent fait ce que vous lui laissez faire. Les permissions ne sont pas une formalité.

## Exercice sur votre propre projet (20 minutes)

Travaillez uniquement sur un projet qui est le vôtre.

1. Lancez les trois commandes de la section « Installation pratique ». **Signal de réussite** : `.env` est ignoré, il n'a jamais été enregistré, et seuls des modèles sont suivis.
2. Ajoutez les deux règles de refus à un fichier de réglages de **votre projet**, puis lancez `/permissions` pour les voir. **Signal de réussite** : les deux règles `Read` apparaissent.
3. Demandez à Claude Code de lire votre `.env`. **Signal de réussite** : il refuse. Si ce n'est pas le cas, relisez la section sur les niveaux de réglages.
4. Écrivez sur une feuille la liste de vos clés, où chacune est rangée, et quand vous les avez changées pour la dernière fois. **Signal de réussite** : chaque clé a un endroit, une date, et un usage unique.

## Vérifiez vos acquis

1. Une clé d'API est-elle plus proche d'un mot de passe ou d'un identifiant public ?
2. Quelle commande vous dit si Git ignore votre `.env` ?
3. Une règle de refus `Read` bloque-t-elle `grep -r` ? Quelle protection ajoutez-vous si vous voulez tout bloquer ?
4. Une clé a fuit. Quelle est la toute première action ?

Réponses : 1) un mot de passe. 2) `git check-ignore -v .env`. 3) Non. Le bac à sable. 4) La révoquer.

## Sources et vérifications (2026-09-25)

**Confirmé dans les pages officielles, lues en entier :**

- Anthropic, « API Key Best Practices: Keeping Your Keys Safe and Secure » : les sept recommandations, dont le rythme de 90 jours cité en exemple. https://support.claude.com/en/articles/9767949-api-key-best-practices-keeping-your-keys-safe-and-secure
- Anthropic, « What should I do if I suspect my API key has been compromised? » : les étapes de révocation. https://support.claude.com/en/articles/8384961-what-should-i-do-if-i-suspect-my-api-key-has-been-compromised
- Claude Code, « Security » : modèle de permissions, protections contre l'injection de prompt, bonnes pratiques, stockage des identifiants. https://code.claude.com/docs/en/security
- Claude Code, « Configure permissions » : règles de refus `Read`, exemples `Read(./.env)`, limites de ces règles, bac à sable. https://code.claude.com/docs/en/permissions
- Claude Code, « Settings files and precedence » : exemple de réglages, niveaux et priorité. https://code.claude.com/docs/en/settings
- GitHub, « Best practices for preventing data leaks in your organization » : détection de secrets, protection au push, `git filter-repo`. https://docs.github.com/en/code-security/getting-started/best-practices-for-preventing-data-leaks-in-your-organization

**À confirmer, donc NON enseigné dans ce chapitre :**

- Le partenariat entre Anthropic et GitHub qui désactiverait automatiquement une clé exposée dans un dépôt public : ce point n'est apparu que dans le résumé d'un moteur de recherche. La page officielle lue ne le mentionne pas. À vérifier avant de l'affirmer.
- Le comportement exact de Claude Code selon la version (certaines vérifications de refus dépendent de la version installée) : à tester sur la version de l'élève.

**Testé en direct le 2026-09-25** (fichier factice `.env.demo-formation`, valeur fausse, supprimé ensuite) :

- Lecture avec l'outil de lecture de Claude : **refusée**.
- `cat` du fichier dans le terminal : **refusé**.
- `grep -r` lancé depuis le dossier : **a affiché la valeur**. C'est exactement la limite annoncée par la documentation.
- Création du fichier par l'outil d'écriture : **refusée** aussi (la règle `Read` a bloqué l'écriture du même fichier).
- La règle a pris effet tout de suite après l'enregistrement du fichier de réglages, sans redémarrage. À revérifier sur d'autres versions.

Conclusion pour l'élève : la règle de refus ferme les deux chemins évidents, pas le chemin détourné. Le bac à sable reste nécessaire pour un vrai mur.
