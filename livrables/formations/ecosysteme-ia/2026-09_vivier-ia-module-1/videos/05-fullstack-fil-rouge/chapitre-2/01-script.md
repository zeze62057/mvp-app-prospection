# Vidéo : L'architecture fullstack n8n + Claude Code

Module 1, section 5 « Le Fullstack, projet fil rouge », chapitre 2 sur 6. Sources : `05-fullstack-fil-rouge.md`, chapitre 2, et `05-fullstack-fil-rouge-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait répartir un projet entre Claude Code (le produit) et n8n (les automatisations), et a fait clarifier cette répartition par Claude Code sur le projet Alpha Conseil.
- **Prérequis de l'élève** : avoir suivi le chapitre 1 de cette section (dossier `/alpha-conseil` créé). Aucun outil supplémentaire à installer.
- **Durée cible** : entre 6 et 9 minutes.
- **Exemple concret qui porte la vidéo** : le formulaire d'intake et le dashboard d'Alpha Conseil, déjà utilisés comme fil conducteur.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Le cours cite « notifier Zézé sur Slack ou par email »**, à neutraliser :
   - Texte d'origine : « Notifier Zézé sur Slack ou par email qu'un nouveau lead vient d'arriver. »
   - Version proposée : « Vous notifier, vous ou votre équipe, par Slack ou par email, qu'un nouveau lead vient d'arriver. »
2. **Le cours cite « un client CAC40 »**, à neutraliser :
   - Texte d'origine : « Un client CAC40 va vouloir, au fil du temps, ajuster ses processus métier... »
   - Version proposée : « Un client grand compte va vouloir, au fil du temps, ajuster ses processus métier... »
3. **Démonstration réelle confirmée** : le prompt de la fiche (clarifier la répartition Claude Code / n8n) est repris mot pour mot et joué en direct dans le dossier `/alpha-conseil` du chapitre 1. C'est une démonstration de discussion : aucun fichier n'est créé ou modifié dans cette vidéo.

## 3. Script minuté

Rythme retenu : 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce deuxième chapitre du projet fil rouge. Le projet Alpha Conseil combine deux briques complémentaires : Claude Code, et n8n. Voyons comment elles se répartissent le travail. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:13 | Claude Code construit l'application elle-même : l'interface, la logique métier, la base de données. n8n orchestre les automatisations et connecte les systèmes externes : emails, notifications, synchronisation entre outils, appels à une IA pour un traitement en tâche de fond. | Diapositive 2 (avant-après : Claude Code contre n8n). | Aucune. |
| 0:30 | Ce qui est directement visible et utilisé par l'utilisateur final est construit dans le code, avec toute la rigueur que ça demande. Ce qui relève de la plomberie entre systèmes est géré par n8n, de façon visuelle, modifiable sans redéployer le code. | Diapositive 3, un clic par carte (2 clics). | Un clic par carte. |
| 0:48 | Sur le formulaire d'intake d'Alpha Conseil : Claude Code construit les champs, la validation, l'enregistrement. Une fois soumis, n8n envoie un email de confirmation au prospect, vous notifie par Slack, ajoute la ligne dans un CRM, et peut qualifier le lead avec une IA. | Diapositive 4 (cartes : les automatisations candidates). | Un clic par carte. |
| 1:07 | Mettons ça en pratique. Je demande à Claude Code de clarifier cette répartition pour Alpha Conseil : quelles automatisations candidates pour n8n, et pourquoi chacune relève de n8n plutôt que d'être codée directement dans l'application. | VS Code en plein écran : le prompt collé, puis la réponse de Claude Code à l'écran. | Coller le prompt de la fiche (clarifier la répartition Claude Code / n8n), dans le dossier `/alpha-conseil`. Lire la liste proposée. ⏱ +45 s |
| 2:07 | C'est particulièrement adapté à un cabinet de conseil visant des clients grands comptes : chaque ajustement de processus métier se fait dans le workflow visuel, sans nouveau développement facturé ni redéploiement. | Diapositive 5 (une phrase, avec un appui). | Un clic pour l'appui. |
| 2:21 | Retenons l'essentiel. Claude Code construit le produit, n8n orchestre les automatisations. Séparer les deux facilite la maintenance future. Dans la prochaine vidéo, MCP Playwright, votre navigateur au service du développement. À tout de suite. | Diapositive 6 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**257 mots prononcés**, soit environ 1,8 minutes de voix, plus 45 secondes de manipulation à l'écran. **Durée estimée : 2:35**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Le temps de démonstration (45 s) est une estimation.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : les deux briques complémentaires, la logique de répartition, les exemples sur l'intake et le dashboard, pourquoi c'est adapté à un cabinet de conseil. Écarts : « notifier Zézé » neutralisé en « vous notifier » (point 1), « client CAC40 » neutralisé en « client grand compte » (point 2). L'exemple du dashboard (rapport hebdomadaire automatique) n'est pas repris dans le script parlé faute de temps, mais reste dans le cours source, non contredit.
