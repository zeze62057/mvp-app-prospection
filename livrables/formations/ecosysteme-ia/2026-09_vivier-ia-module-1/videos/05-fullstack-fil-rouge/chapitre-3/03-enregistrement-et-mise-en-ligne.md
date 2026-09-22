# Enregistrement et mise en ligne : MCP Playwright, votre navigateur au service du dev

Module 1, section 5, chapitre 3. Voir `01-script.md` et `02-diapositives.md`.

## 1. Checklist d'enregistrement

**La veille**
- Lire le script une fois à voix haute, chronomètre en main. Corriger le débit réel par rapport aux 140 mots par minute prévus.
- Tester le diaporama en mode présentation, avec les clics : `diapositives-chapitre-3.pptx`, 10 clics en tout.
- **Valider les points de la section 2 du script** avant d'enregistrer.
- Reprendre le dossier `/alpha-conseil` créé au chapitre 1, ouvert dans Claude Code.
- Vérifier que le serveur MCP Playwright est bien connecté avant l'enregistrement.
- Avoir sous la main le prompt du chapitre 3 de `05-fullstack-fil-rouge-prompts.md`, à coller tel quel.

**Juste avant**
- Couper les notifications (assistant de concentration de Windows), fermer les onglets et applications inutiles.
- Écran en 1920 par 1080, bureau propre.
- Son : casque ou micro de qualité, pièce calme, test de une minute réécouté avant de commencer.
- VS Code : terminal en grande police, dossier `alpha-conseil` du chapitre 1 ouvert.
- Fermer les autres onglets ou fenêtres de navigateur, pour que le pilotage automatique de Playwright soit bien visible.

**Pendant**
- Dire à l'oral ce que vous faites avant de le faire.
- Si une démonstration échoue en direct, poursuivez si l'échec est instructif, sinon coupez et reprenez.
- Laisser Playwright ouvrir la page et remplir les champs sans intervenir.
- Si le message de confirmation ne s'affiche pas, ne pas cacher l'échec : c'est justement ce que l'outil sert à détecter.

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

**Titre** : MCP Playwright, votre navigateur au service du dev

**Description** : MCP Playwright donne à Claude Code la capacité de tester réellement une application, en pilotant un vrai navigateur. Testez-le en direct sur le formulaire d'Alpha Conseil.

**Points clés**
- Playwright pilote un vrai navigateur, exactement comme un utilisateur humain.
- Connecté via MCP, Claude Code peut tester réellement, pas seulement relire le code.
- Réduit le risque de découvrir des problèmes trop tard, au moment le plus coûteux.

**Durée** : à renseigner après l'enregistrement (estimation : 2 min 44 s avant montage).

## 5. Mise en ligne, guidée en direct

Cette étape se fait avec Claude, une étape à la fois. Ne la déroulez pas seul.

L'état des lieux de la plateforme, les deux limites de taille à lever avant le premier envoi réel, le choix « section ou chapitre » et les sept étapes prévues sont décrits dans `livrables/formations/ecosysteme-ia/2026-09_vivier-ia-module-1/videos/01-fondations/chapitre-1/03-enregistrement-et-mise-en-ligne.md` (section 5). Ils valent aussi pour cette vidéo. Le chantier d'envoi direct est cadré dans `livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md`.

Le passage du chapitre à `en ligne` dans `SUIVI-VIDEOS.md` reste une attestation de Zézé.
