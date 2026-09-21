# Enregistrement et mise en ligne : Le workflow Plan, Execute, Validate

Module 1, section 2, chapitre 3. Voir `01-script.md` et `02-diapositives.md`.

## 1. Checklist d'enregistrement

**La veille**
- Lire le script une fois à voix haute, chronomètre en main. Corriger le débit réel par rapport aux 140 mots par minute prévus.
- Tester le diaporama en mode présentation, avec les clics : `diapositives-chapitre-3.pptx`, 12 clics en tout.
- **Valider les points de la section 2 du script** avant d'enregistrer.
- Préparer une copie neuve du site de démonstration `livrables/formations/ecosysteme-ia/_ressources-demo/site-artisan`, copiée sous le nom `site` (les prompts de la fiche parlent du « dossier /site ») : `C:\demo-c\site`. Lancez Claude Code depuis `C:\demo-c`.
- Avoir sous la main, dans un fichier texte, les trois prompts de l'« Exemple bout en bout » de `02-methode-prompts.md` (partie 2) : « 1. Plan », « 2. Execute » (« Le plan me va, vas-y. », et sa version corrigée) et « 3. Validate ».
- **Répéter la démonstration entière**, en particulier la validation dans le navigateur : Claude Code peut ne pas pouvoir cliquer dans le menu (point 3 de la section 2 du script).
- Vérifier que Claude Code est installé et se lance dans un dossier (`claude`).

**Juste avant**
- Couper les notifications (assistant de concentration de Windows), fermer les onglets et applications inutiles.
- Écran en 1920 par 1080, bureau propre.
- Son : casque ou micro de qualité, pièce calme, test de une minute réécouté avant de commencer.
- VS Code : agrandir la police (Ctrl et `+`) et celle du terminal intégré, pour que le code se lise en 1080p.
- Ouvrir un terminal neuf, pour ne pas montrer l'historique d'une session précédente.
- Navigateur : fenêtre propre, sans onglet personnel ni favori visible, prête à afficher la page ouverte par Claude Code.

**Pendant**
- Dire à l'oral ce que vous faites avant de le faire.
- Si une démonstration échoue en direct, poursuivez si l'échec est instructif, sinon coupez et reprenez.
- Lire le plan de Claude Code à voix haute avant de répondre : c'est le geste que la vidéo enseigne.
- Si le plan contient une étape que vous ne voulez pas, utilisez la version corrigée du prompt de la fiche plutôt que de valider tel quel.
- Dites honnêtement ce que Claude Code a pu vérifier ou non dans le navigateur : ne prétendez pas qu'il a testé le menu s'il n'a fait qu'ouvrir la page.

## 2. Vérification des secrets, avant de lancer l'enregistrement

Rien de ceci ne doit apparaître à l'écran :
- une clé d'API, un mot de passe ou un jeton, y compris ceux de Chatllow, de Chariow ou d'un client ;
- un fichier `.env` ouvert dans l'éditeur ;
- votre adresse e-mail ou votre nom d'utilisateur dans un chemin de dossier ;
- une donnée client réelle, dans un onglet, un fichier récent ou le presse-papiers.

Vérifiez aussi la barre d'onglets du navigateur, les favoris et l'historique du terminal.

## 3. Quel outil pour enregistrer

**Attention : l'outil d'enregistrement intégré à la plateforme ne convient pas pour une voix off.** Il capture l'écran et le son du système, mais pas le micro. Enregistrez avec un logiciel qui capte le micro (OBS Studio est gratuit), puis envoyez le fichier sur la plateforme.

Enregistrez tout l'écran en une seule prise. Le montage se limite aux coupures d'attente.

## 4. Fiche à coller sur la plateforme

**Titre** : Le workflow Plan, Execute, Validate

**Description** : Plan, Execute, Validate : la structure centrale de l'Agentic Coding, en trois temps qui se répètent à chaque tâche. Découvrez pourquoi corriger au stade du plan coûte peu, pourquoi ne jamais supposer qu'un « c'est fait » est correct, et voyez les trois temps appliqués en direct sur un petit site.

**Points clés**
- Plan avant d'agir : cela permet de corriger tôt, donc pas cher.
- Execute : le travail réel, par étapes, mais pas la phase la plus déterminante.
- Validate : ne jamais supposer qu'une tâche annoncée terminée est automatiquement correcte.

**Durée** : à renseigner après l'enregistrement (estimation : 8 min 29 s avant montage).

## 5. Mise en ligne, guidée en direct

Cette étape se fait avec Claude, une étape à la fois. Ne la déroulez pas seul.

L'état des lieux de la plateforme, les deux limites de taille à lever avant le premier envoi réel, le choix « section ou chapitre » et les sept étapes prévues sont décrits dans `livrables/formations/ecosysteme-ia/2026-09_vivier-ia-module-1/videos/01-fondations/chapitre-1/03-enregistrement-et-mise-en-ligne.md` (section 5). Ils valent aussi pour cette vidéo. Le chantier d'envoi direct est cadré dans `livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md`.

Le passage du chapitre à `en ligne` dans `SUIVI-VIDEOS.md` reste une attestation de Zézé.
