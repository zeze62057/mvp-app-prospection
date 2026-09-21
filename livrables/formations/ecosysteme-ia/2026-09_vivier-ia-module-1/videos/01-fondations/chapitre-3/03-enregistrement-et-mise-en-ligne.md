# Enregistrement et mise en ligne : Git et GitHub, le filet de sécurité du code

Module 1, section 1, chapitre 3. Voir `01-script.md` et `02-diapositives.md`.

## 1. Checklist d'enregistrement

**La veille**
- Lire le script une fois à voix haute, chronomètre en main. Corriger le débit réel par rapport aux 140 mots par minute prévus.
- Tester le diaporama en mode présentation, avec les clics : `diapositives-chapitre-3.pptx`, 20 clics en tout.
- **Valider les 4 points de la section 2 du script.** Le point 2 (la demande à taper à Claude Code) conditionne la démonstration.
- Créer un dossier de démonstration **nouveau**, avec un seul petit fichier dedans, par exemple `C:\demo3`. Il ne doit pas être déjà un dépôt Git : le premier commit doit se faire sous vos yeux. Un chemin court évite d'afficher votre nom d'utilisateur Windows.
- Décider de l'état de départ de Git : il est déjà installé sur votre poste, et sa configuration (nom et adresse e-mail) est déjà faite. Ne rejouez ni l'installation ni la configuration à l'écran : montrez seulement la page git-scm.com et les diapositives.
- **Ne pas modifier la configuration globale de Git.** Les commandes `git config --global` écraseraient votre identité. Si vous tenez à les exécuter, utilisez un profil Windows de démonstration.
- Vérifier ce que le commit de démonstration affichera : le nom et l'adresse e-mail de l'auteur apparaissent dans l'historique. Utilisez un compte de démonstration, ou floutez au montage.
- Ne pas connecter le dossier de démonstration à un vrai dépôt GitHub sans avoir décidé du déroulé (point 2 de la section 2 du script).

**Juste avant**
- Couper les notifications (assistant de concentration de Windows), fermer les onglets et applications inutiles.
- Écran en 1920 par 1080, bureau propre.
- VS Code : agrandir la police (Ctrl et `+`) et celle du terminal intégré, pour que tout se lise en 1080p.
- Ouvrir un terminal neuf dans VS Code, pour ne pas montrer l'historique d'une session précédente.
- Navigateur : ouvrir `git-scm.com` et `github.com` dans une fenêtre propre, **déconnecté de votre vrai compte GitHub**, ou connecté à un compte de démonstration.
- Son : casque ou micro de qualité, pièce calme, test de une minute réécouté avant de commencer.

**Pendant**
- Dire à l'oral ce que vous faites avant de le faire.
- Pour le premier commit : lire à voix haute ce que Claude Code propose avant de valider. C'est exactement le réflexe que la vidéo enseigne.
- Ne poussez rien. Le chapitre insiste sur la validation avant un push : ne la contredisez pas à l'écran.
- Si Claude Code propose autre chose qu'un simple commit (une commande que vous ne comprenez pas, un fichier inattendu), refusez, coupez et reprenez.

## 2. Vérification des secrets, avant de lancer l'enregistrement

Rien de ceci ne doit apparaître à l'écran :
- **un jeton d'accès personnel GitHub**, ni à sa création, ni dans une commande, ni dans un fichier. Ne créez aucun jeton pendant l'enregistrement ;
- une clé d'API, un mot de passe ou un jeton, y compris ceux de Chatllow, de Chariow ou d'un client ;
- un fichier `.env` ouvert dans l'éditeur, ou présent dans le dossier de démonstration ;
- votre adresse e-mail : compte GitHub, configuration Git (`git config --global --list` l'affiche), auteur d'un commit, ou écran de connexion de Claude Code ;
- votre nom d'utilisateur dans un chemin de dossier (barre de titre de VS Code, invite du terminal) ;
- des dépôts privés dans votre liste GitHub, une donnée client réelle, ou le presse-papiers.

Vérifiez aussi la barre d'onglets du navigateur, les favoris et l'historique du terminal.

## 3. Quel outil pour enregistrer

**Attention : l'outil d'enregistrement intégré à la plateforme ne convient pas pour une voix off.** Il capture l'écran et le son du système, mais pas le micro. Enregistrez avec un logiciel qui capte le micro (OBS Studio est gratuit), puis envoyez le fichier sur la plateforme.

Enregistrez tout l'écran en une seule prise. Le montage se limite aux coupures d'attente.

## 4. Fiche à coller sur la plateforme

**Titre** : Git et GitHub, le filet de sécurité du code

**Description** : Comprenez pourquoi Git et GitHub protègent votre projet : chaque état du code est gardé en mémoire, et vous pouvez revenir en arrière si une modification casse quelque chose. Découvrez les trois réflexes à prendre, installez Git, puis faites votre premier commit avec Claude Code.

**Points clés**
- Git garde un historique réversible du projet.
- GitHub héberge et sécurise cet historique en ligne.
- Trois réflexes : committer souvent, écrire des messages clairs, pousser vers GitHub.
- Vous validez toujours avant de pousser : jamais un réflexe automatique.

**Durée** : à renseigner après l'enregistrement (estimation : 6 min 29 s avant montage).

## 5. Mise en ligne, guidée en direct

Cette étape se fait avec Claude, une étape à la fois. Ne la déroulez pas seul.

L'état des lieux de la plateforme, les deux limites de taille à lever avant le premier envoi réel, le choix « section ou chapitre » et les sept étapes prévues sont décrits dans `../chapitre-1/03-enregistrement-et-mise-en-ligne.md` (section 5). Ils valent aussi pour cette vidéo. Le chantier d'envoi direct est cadré dans `livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md`.

Le passage du chapitre à `en ligne` dans `SUIVI-VIDEOS.md` reste une attestation de Zézé.
