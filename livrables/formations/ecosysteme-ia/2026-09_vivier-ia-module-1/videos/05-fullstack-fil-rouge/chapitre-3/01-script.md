# Vidéo : MCP Playwright, votre navigateur au service du dev

Module 1, section 5 « Le Fullstack, projet fil rouge », chapitre 3 sur 6. Sources : `05-fullstack-fil-rouge.md`, chapitre 3, et `05-fullstack-fil-rouge-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait ce qu'apporte MCP Playwright pour la phase Validate, et a fait tester réellement une page par Claude Code, pas juste relire le code.
- **Prérequis de l'élève** : avoir suivi le chapitre 1 de cette section (dossier `/alpha-conseil` créé, avec son formulaire simple). Le serveur MCP Playwright doit être connecté (vu en section 3, chapitre 4).
- **Durée cible** : entre 5 et 8 minutes.
- **Exemple concret qui porte la vidéo** : le formulaire d'intake simple d'Alpha Conseil, construit au chapitre 1, testé ici avec Playwright.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Le cours cite « un cabinet comme Chatllow »**, à neutraliser :
   - Texte d'origine : « ce qui couvre la grande majorité des livraisons qu'un cabinet comme Chatllow produira. »
   - Version proposée : « ce qui couvre la grande majorité des livraisons qu'un cabinet de conseil produira. »
2. **Démonstration réelle confirmée** : le prompt de la fiche (tester le formulaire avec Playwright) est repris mot pour mot, mais joué sur le formulaire simple du chapitre 1 (4 champs, message de confirmation), pas sur une version avec stockage JSON qui n'existe qu'à partir du chapitre 4. C'est cohérent avec le cours : le formulaire d'intake « complet » avec stockage n'est construit qu'au chapitre 4.
3. **MCP Playwright doit être déjà connecté** avant l'enregistrement (vu en section 3, chapitre 4 du module). Vérifier la connexion avant de commencer.

## 3. Script minuté

Rythme retenu : 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce troisième chapitre du projet fil rouge. Un outil qui change la nature de la validation : MCP Playwright, votre navigateur au service du développement. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:12 | Playwright pilote un navigateur web de façon automatisée : ouvrir une page, cliquer, remplir un formulaire, vérifier ce qui s'affiche réellement. Connecté à Claude Code via MCP, il donne à l'agent la capacité de tester comme le ferait un utilisateur humain. | Diapositive 2 (une phrase, avec un appui). | Un clic pour l'appui. |
| 0:30 | C'est un changement de nature pour la phase Validate vue en section 2. Sans cet outil : "je crois que ça marche parce que le code semble correct". Avec Playwright : "j'ai vérifié en ouvrant réellement la page, et en observant le résultat produit". | Diapositive 3 (avant-après : relecture du code contre test réel). | Aucune. |
| 0:49 | Mettons ça en pratique. Le formulaire d'Alpha Conseil, construit au premier chapitre, est terminé selon Claude Code. Avant de le considérer comme fait, je lui demande d'utiliser Playwright pour l'ouvrir réellement, remplir les 4 champs, et vérifier que le message de confirmation s'affiche. | VS Code en plein écran : le prompt collé, puis Claude Code qui pilote le navigateur et rapporte ce qu'il observe. | Coller le prompt de la fiche (tester avec Playwright), dans le dossier `/alpha-conseil`. Observer le navigateur piloté automatiquement. ⏱ +45 s |
| 1:52 | Claude Code me montre ce qu'il a observé à l'écran, pas seulement "le code a l'air correct". Pour ce projet fil rouge, cet outil va valider chaque phase de build avant de la considérer comme terminée : le formulaire, le dashboard, la page de statut. | Diapositive 4 (une phrase, avec un appui). | Un clic pour l'appui. |
| 2:12 | Cette capacité de test automatisé dépasse ce seul projet : c'est une compétence transférable à tout projet avec une interface, ce qui couvre la grande majorité des livraisons qu'un cabinet de conseil produira. | Diapositive 5, un clic par carte (2 clics). | Un clic par carte. |
| 2:26 | Retenons l'essentiel. Playwright pilote un vrai navigateur. Connecté via MCP, Claude Code teste réellement, sans supposer. Ça réduit le risque de découvrir un problème au moment le plus coûteux. Prochaine vidéo : la phase 1, le formulaire d'intake client. À tout de suite. | Diapositive 6 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**278 mots prononcés**, soit environ 2,0 minutes de voix, plus 45 secondes de manipulation à l'écran. **Durée estimée : 2:44**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Le temps de démonstration (45 s) est une estimation.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : ce que fait Playwright, le changement de nature pour Validate, son usage précis dans le fil rouge, la compétence transférable. Écart : « cabinet comme Chatllow » neutralisé en « cabinet de conseil » (point 1). Le prompt de démonstration est joué sur le formulaire simple du chapitre 1, pas sur une version avec stockage qui n'existe pas encore à ce stade du cours (point 2).
