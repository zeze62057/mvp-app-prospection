# Enregistrement et mise en ligne : MCP, connecter Claude Code à votre écosystème

Module 1, section 3, chapitre 4. Voir `01-script.md` et `02-diapositives.md`.

## 1. Checklist d'enregistrement

**La veille**
- Lire le script une fois à voix haute, chronomètre en main. Corriger le débit réel par rapport aux 140 mots par minute prévus.
- Tester le diaporama en mode présentation, avec les clics : `diapositives-chapitre-4.pptx`, 14 clics en tout.
- **Valider les points de la section 2 du script** avant d'enregistrer.
- Reprendre le dossier de démonstration créé au chapitre 3 (par exemple `C:\demo-g`), qui contient déjà `.claude/commands` et `.claude/skills`. Le fichier `.mcp.json` vient s'ajouter au même projet.
- Avoir sous la main la configuration exacte du cours (chapitre 4 de `03-maitriser-loutil.md`) : le contenu du `.mcp.json` à créer, mot pour mot.
- Vérifier que Node.js est installé et que `npx` est accessible dans le PATH : sinon la connexion échoue par timeout, sans message clair (point de vigilance du cours).
- Prévoir de fermer et rouvrir Claude Code après la création du fichier, pour déclencher la demande d'autorisation.

**Juste avant**
- Couper les notifications (assistant de concentration de Windows), fermer les onglets et applications inutiles.
- Écran en 1920 par 1080, bureau propre.
- Son : casque ou micro de qualité, pièce calme, test de une minute réécouté avant de commencer.
- VS Code : garder le même dossier de démonstration ouvert que le chapitre précédent, avec le terminal en grande police.
- Vérifier la connexion internet : `npx` télécharge le serveur Playwright au tout premier lancement.

**Pendant**
- Dire à l'oral ce que vous faites avant de le faire.
- Si une démonstration échoue en direct, poursuivez si l'échec est instructif, sinon coupez et reprenez.
- Montrer l'invite d'autorisation de connexion telle qu'elle apparaît réellement, sans la couper au montage : c'est un moment pédagogique important.
- Si la connexion échoue par timeout, montrez-le et diagnostiquez à voix haute : c'est exactement le point de vigilance Windows du chapitre.

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

**Titre** : MCP, connecter Claude Code à votre écosystème

**Description** : MCP connecte Claude Code à des outils extérieurs à votre projet. Comprenez ce qu'il résout, comment déclarer un serveur, et connectez-en un pour de vrai, avec une action réelle à la clé.

**Points clés**
- MCP connecte Claude Code à des services externes au projet local.
- Un serveur se déclare dans un fichier .mcp.json, à la racine du projet.
- Plus de connexions veut dire plus de vigilance sur le périmètre autorisé.

**Durée** : à renseigner après l'enregistrement (estimation : 4 min 14 s avant montage).

## 5. Mise en ligne, guidée en direct

Cette étape se fait avec Claude, une étape à la fois. Ne la déroulez pas seul.

L'état des lieux de la plateforme, les deux limites de taille à lever avant le premier envoi réel, le choix « section ou chapitre » et les sept étapes prévues sont décrits dans `livrables/formations/ecosysteme-ia/2026-09_vivier-ia-module-1/videos/01-fondations/chapitre-1/03-enregistrement-et-mise-en-ligne.md` (section 5). Ils valent aussi pour cette vidéo. Le chantier d'envoi direct est cadré dans `livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md`.

Le passage du chapitre à `en ligne` dans `SUIVI-VIDEOS.md` reste une attestation de Zézé.
