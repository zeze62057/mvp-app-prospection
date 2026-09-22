# Vidéo : MCP, connecter Claude Code à votre écosystème

Module 1, section 3 « Maîtriser l'outil », chapitre 4. Sources : `03-maitriser-loutil.md`, chapitre 4, et `03-maitriser-loutil-prompts.md`, chapitre 4.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait ce que MCP résout, comment déclarer un serveur MCP, et connecte un serveur réel sur son projet.
- **Signal de réussite** : l'étape 3 du guide de réussite demande, si un MCP est connecté, « faire une action réelle dessus avec un périmètre explicite dans le prompt ». Le signal de passage de ce chapitre est un serveur MCP connecté, avec une action réelle effectuée dessus.
- **Prérequis de l'élève** : avoir suivi les chapitres 1 à 3 de la section 3, et le dossier de démonstration déjà créé au chapitre 3.
- **Durée cible** : entre 4 et 7 minutes. Chapitre plus court que les précédents de la section : MCP se résume à un principe et une installation en une commande, sans plusieurs mécanismes à comparer.
- **Exemple concret qui porte la vidéo** : connecter pour de vrai le serveur MCP Playwright (public, gratuit, sans compte ni clé) au projet de démonstration, puis lui demander d'ouvrir le site vitrine dans un navigateur.

## 2. Points à valider avec Zézé avant d'enregistrer

Le chapitre du cours est écrit pour Zézé, pas pour des élèves. Trois passages ont été remplacés, un est confirmé sans modification. Les « tu » du cours deviennent des « vous ».

1. **L'exemple d'usage du cours.** Le cours dit : « des cas d'usage comme ceux mis en place récemment dans ce workspace : un agent qui rédige des posts LinkedIn et les enregistre directement dans une base Notion, puis un second agent qui génère un visuel via Canva ». C'est votre automatisation réelle. Elle est reformulée en exemple hypothétique générique : un agent qui rédige du contenu et l'enregistre dans une base partagée, un second qui génère un visuel et l'attache au bon endroit. Notion et Canva restent cités comme noms d'outils (pas confidentiels en soi), mais plus comme « ce qui a été fait récemment dans ce workspace ».
2. **La phrase sur Playwright.** Le cours dit : « c'est exactement ce qui a été fait dans ce workspace pour connecter Playwright (chapitre 3 de la section 5) ». Reformulée en renvoi au futur chapitre du cours, sans dire « ce workspace » : « vous verrez à la section 5 comment ce même mécanisme connecte Claude Code à votre navigateur ».
3. **Les prompts de la fiche non utilisés dans cette vidéo.** La fiche propose des prompts Notion (« base Clients Chatllow »), Google Drive, n8n, Canva et Supabase (« projet Kora »). Chatllow et Kora sont vos noms réels. Aucun de ces prompts n'est utilisé dans le script : la démonstration filmée porte uniquement sur Playwright, l'exemple d'installation donné dans le cours lui-même, qui ne demande aucun compte ni nom réel.
4. **Confirmé sans modification** : le fichier `.mcp.json` et la commande `npx @playwright/mcp@latest` sont repris mot pour mot du cours (chapitre 4), ce n'est pas un test hors cours.

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce quatrième chapitre de la section sur la maîtrise de l'outil. Aujourd'hui, MCP : comment connecter Claude Code à des outils extérieurs à votre projet. Nous verrons ce que ça résout. Comment le déclarer. Et une connexion réelle, en direct. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:19 | Sans connexion externe, Claude Code ne travaille que sur ce qui est présent localement. Les fichiers de votre projet, rien d'autre. Or une grande partie du travail réel se passe ailleurs. Dans un outil comme Notion, une boîte mail, un tableur partagé, un outil de design. | Diapositive 2, clic 1 : la carte « Sans MCP ». | Clic à « Or une grande partie du travail ». |
| 0:39 | MCP veut dire Model Context Protocol. C'est le mécanisme qui connecte Claude Code à des outils extérieurs à votre projet local. Notion, Google Drive, une base de données, et bien d'autres. Une fois un serveur MCP connecté, l'agent peut lire et écrire directement dedans. Toujours avec votre autorisation préalable. | Diapositive 2, clic 2 : la carte « Avec MCP ». | Clic à « MCP veut dire ». |
| 1:00 | Un exemple. Un agent qui rédige du contenu, et l'enregistre directement dans une base partagée. Puis un second agent, qui génère un visuel, et l'attache automatiquement au bon endroit. Sans aucun copier-coller manuel entre les outils. C'est exactement ce que MCP permet. | Diapositive 3 : la carte « Rédiger et enregistrer » visible. Clic : la carte « Générer et attacher ». | Clic à « Puis un second agent ». |
| 1:18 | Passons à l'installation. Un serveur MCP se déclare dans un fichier point-m-c-p point-j-s-o-n, à la racine du projet. Il suffit d'y indiquer la commande qui lance ce serveur. Au prochain démarrage de Claude Code sur ce projet, une autorisation de connexion est demandée. Puis les outils du serveur deviennent disponibles. | Diapositive 4, un clic par ligne (3 clics). | Un clic à chaque ligne. |
| 1:39 | Je crée ce fichier dans le dossier de démonstration, celui du chapitre précédent. J'y colle exactement la configuration du serveur Playwright, comme dans le cours. Je relance Claude Code sur ce dossier. Une autorisation de connexion est demandée, je l'accepte. | VS Code en plein écran : création de `.mcp.json`, contenu collé, relance de Claude Code, invite d'autorisation. | Créer `.mcp.json` avec la configuration Playwright du cours. Relancer Claude Code. Accepter la connexion. ⏱ +40 s |
| 2:36 | Je demande maintenant à Claude Code d'ouvrir le site vitrine de démonstration, dans un vrai navigateur. C'est un nouvel outil, qui n'existait pas avant cette connexion. Je vérifie que la page s'ouvre bien, et qu'elle correspond au bon fichier. | VS Code et le navigateur ouvert côte à côte. | Demander l'ouverture du site vitrine dans le navigateur. Vérifier la page ouverte. ⏱ +30 s |
| 3:23 | Un point de vigilance grandit avec chaque connexion. Ne pas inventer une propriété qui n'existe pas dans un outil connecté. Ne pas modifier ce qui n'a pas été explicitement demandé. Et toujours vérifier qu'une action a réellement réussi, plutôt que de le supposer. | Diapositive 5, un clic par carte (3 clics). | Un clic par carte. |
| 3:41 | Retenons l'essentiel. MCP connecte Claude Code à des outils extérieurs au projet local. Il permet d'agir directement dedans, pas seulement de travailler en local. Et plus de connexions veut dire plus de vigilance sur le périmètre autorisé. Si vous avez déjà un MCP connecté, faites une action réelle dessus, avec un périmètre explicite dans votre prompt, exactement comme nous venons de le faire. Dans la prochaine vidéo, les Hooks, pour automatiser Claude Code. À tout de suite. | Diapositive 6 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**430 mots prononcés**, soit environ 3,1 minutes de voix, plus 70 secondes de manipulation à l'écran. **Durée estimée : 4:14**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de la démonstration (40 s et 30 s) sont des estimations : un temps de chargement plus long au premier lancement de Playwright se coupe au montage.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : le problème résolu par MCP (travail hors du projet local), la définition (Model Context Protocol, connexion à des outils extérieurs, autorisation préalable), l'installation (`.mcp.json`, la commande du serveur, l'autorisation au démarrage), le point de vigilance Windows sur `npx` et le PATH, et les trois règles de vigilance (ne pas inventer, ne pas modifier sans demande, vérifier). Écarts : l'exemple d'usage neutralisé (point 1), la phrase sur Playwright reformulée (point 2), les prompts Notion/Drive/n8n/Canva/Supabase de la fiche non utilisés (point 3).
