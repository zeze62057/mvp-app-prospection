# Vidéo : Premiers pas, outils principaux et permissions

Module 1, section 3 « Maîtriser l'outil », chapitre 1. Sources : `03-maitriser-loutil.md`, chapitre 1, et `03-maitriser-loutil-prompts.md`, chapitre 1.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève comprend que Claude Code agit par des outils précis, que le système de permission est un principe de sécurité et non une gêne, évite les deux excès (tout accepter, tout refuser) et adopte le réflexe « lire, comprendre l'impact, décider ».
- **Signal de réussite** : l'étape 3 du guide de réussite porte sur CLAUDE.md, les skills et le MCP. Pour ce chapitre, le signal est de savoir dire, devant une action proposée, si elle est sûre ou sensible, et de savoir rendre son niveau d'autonomie explicite dans une instruction.
- **Prérequis de l'élève** : avoir terminé la section 2.
- **Durée cible** : entre 5 et 8 minutes.
- **Exemple concret qui porte la vidéo** : Claude Code propose de supprimer un fichier qui paraît inutilisé, alors qu'il est référencé par la configuration de déploiement.

## 2. Points à valider avec Zézé avant d'enregistrer

Le chapitre du cours ne renvoie pas à votre workspace : aucun passage n'a été remplacé. Deux points demandent votre décision. Les « tu » du cours deviennent des « vous » ; en revanche, le prompt de la fiche pratique reste tel quel (il s'adresse à Claude Code).

1. **La démonstration.** Le cours n'en prévoit pas pour ce chapitre. Le script montre seulement le prompt d'autonomie de la fiche pratique, collé tel quel dans Claude Code, sur le site fictif `_ressources-demo/site-artisan` (copié sous le nom `site`, voir son `README.md`). Ce site n'est pas dans le cours. Pour montrer une vraie demande d'autorisation (une lecture libre, puis une écriture qui demande une validation), il faudrait deux demandes que le cours ne contient pas : je n'en invente pas. À vous de les fournir si vous voulez cette démonstration.
2. **L'interface des autorisations.** Le cours ne décrit pas l'écran de demande d'autorisation de Claude Code, qui peut changer d'une version à l'autre. Le script n'en cite aucun libellé. Si vous le montrez, décrivez ce que vous voyez à l'écran plutôt que de lire un mode d'emploi.

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans cette troisième section, consacrée à la maîtrise de l'outil. Premier chapitre : comment Claude Code agit concrètement, et le système de permission. Nous verrons les outils de Claude Code. Pourquoi les permissions sont une protection. Les deux excès à éviter. Et le réflexe à construire. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:21 | Claude Code agit sur votre machine par le biais d'outils précis. Lire un fichier. En écrire un. Exécuter une commande. Chercher dans le projet. Naviguer dans une structure de dossiers. Chaque outil a un rôle délimité. Ce n'est pas une intelligence qui agirait en général sur votre machine, sans contrôle. | Diapositive 2, un clic par outil (4 clics). | Un clic à chaque outil cité. |
| 0:42 | Chaque action sensible peut demander votre validation avant de s'exécuter. Ce n'est pas une gêne, ajoutée par prudence excessive. C'est un principe de sécurité fondamental, construit dans l'outil. Une action réversible et sans risque peut se faire librement, sans ralentir le travail. Par exemple, lire un fichier, ou chercher un mot dans le code. Une action à impact plus large, ou irréversible, mérite votre validation explicite. Supprimer un fichier. Exécuter une commande qui modifie des données. Pousser du code en ligne, visible par d'autres. Parce que revenir en arrière serait coûteux, ou impossible. | Diapositive 3, clic 1 : la carte « Action sûre ». Clic 2 : la carte « Action sensible ». | Clic 1 à « Une action réversible ». Clic 2 à « Une action à impact plus large ». |
| 1:22 | Un exemple. Claude Code propose de supprimer un fichier qui semble inutilisé, dans un projet client. Une lecture rapide de la proposition montre que ce fichier est en fait référencé par la configuration de déploiement Vercel. Vous refusez l'action, et vous demandez une vérification. Vous évitez ainsi une panne de mise en ligne. À l'inverse, une simple lecture de fichier, ou une recherche dans le code, ne présente aucun risque. Valider ce type d'action sans y réfléchir longuement ne pose aucun problème. | Diapositive 4 : la ligne « Une action sensible » est visible. Clic : la ligne « Une action sûre ». | Clic à « À l'inverse ». |
| 1:57 | Comprendre ce système évite deux excès symétriques. Le premier : tout accepter sans lire. Cela annule l'intérêt de la permission, puisque vous devenez un simple bouton oui automatique. Le second : tout refuser, par méfiance excessive. Cela ralentit inutilement le travail, et vous fait perdre le bénéfice de vitesse que Claude Code apporte. | Diapositive 5, clic 1 : « Tout accepter ». Clic 2 : « Tout refuser ». | Clic 1 à « Le premier ». Clic 2 à « Le second ». |
| 2:20 | Le bon réflexe, à installer dès vos premiers pas, tient en trois gestes. Lire ce qui est proposé. Comprendre l'impact concret : qu'est-ce qui change si je dis oui, est-ce réversible ? Puis décider. Ce réflexe devient rapide avec l'expérience. Mais il ne doit jamais disparaître, même sur un projet que vous connaissez bien. | Diapositive 6, un clic par geste (3 clics). | Un clic à chaque geste. |
| 2:43 | Vous pouvez aussi rendre le niveau d'autonomie explicite, dans l'instruction elle-même. C'est le quatrième élément du gabarit, vu en section 2. Voici un exemple, sur le petit site de l'artisan. Je colle ce cadre. Claude Code peut modifier librement les fichiers du dossier site. Mais si une action touche à la configuration Git, à un fichier point env, ou à quoi que ce soit qui pousserait du contenu en ligne, il s'arrête et me demande confirmation. | VS Code en plein écran : le terminal avec Claude Code, le prompt d'autonomie collé, puis la réponse de Claude Code. | Ouvrir la copie du site sous le nom `site`. Lancer `claude`. Coller le prompt du chapitre 1 de la fiche (section 3). Lire la réponse de Claude Code à voix haute. ⏱ +40 s |
| 3:56 | Retenons trois points. Chaque outil a un rôle précis : lire, écrire, exécuter, chercher. Les actions sensibles demandent une validation explicite, les actions sûres non. Et lire avant de valider : ni confiance aveugle, ni méfiance systématique. Dans la prochaine vidéo, nous verrons CLAUDE.md, le cerveau de votre projet. À tout de suite. | Diapositive 7 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**510 mots prononcés**, soit environ 3,6 minutes de voix, plus 40 secondes de manipulation à l'écran. **Durée estimée : 4:19**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : les outils précis et leur rôle délimité ; la permission comme principe de sécurité ; actions libres et actions à valider ; l'exemple de la suppression d'un fichier référencé par Vercel ; les deux excès ; le réflexe en trois gestes ; les trois points clés ; le prompt d'autonomie de la fiche, repris mot pour mot. Écart : la démonstration se limite à ce prompt (point 1).
