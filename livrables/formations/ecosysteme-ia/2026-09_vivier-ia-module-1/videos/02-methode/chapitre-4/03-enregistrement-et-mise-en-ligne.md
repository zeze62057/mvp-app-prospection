# Enregistrement et mise en ligne : Quand ça casse, debugger et vérifier

Module 1, section 2, chapitre 4. Voir `01-script.md` et `02-diapositives.md`.

## 1. Checklist d'enregistrement

**La veille**
- Lire le script une fois à voix haute, chronomètre en main. Corriger le débit réel par rapport aux 140 mots par minute prévus.
- Tester le diaporama en mode présentation, avec les clics : `diapositives-chapitre-4.pptx`, 13 clics en tout.
- **Valider les points de la section 2 du script** avant d'enregistrer.
- Aucune installation ni démonstration : la vidéo repose sur les diapositives et la voix (point 1 de la section 2 du script).
- Si vous ajoutez la démonstration proposée au point 1, préparer une copie neuve du site `_ressources-demo/site-artisan` sous le nom `site` (`C:\demo-d\site`) et répéter le passage.

**Juste avant**
- Couper les notifications (assistant de concentration de Windows), fermer les onglets et applications inutiles.
- Écran en 1920 par 1080, bureau propre.
- Son : casque ou micro de qualité, pièce calme, test de une minute réécouté avant de commencer.

**Pendant**
- Dire à l'oral ce que vous faites avant de le faire.
- Si une démonstration échoue en direct, poursuivez si l'échec est instructif, sinon coupez et reprenez.

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

**Titre** : Quand ça casse, debugger et vérifier

**Description** : Tout projet finit par rencontrer une erreur : c'est une étape normale. Apprenez les trois réflexes face à une erreur (lire le message en entier, isoler le problème, demander un diagnostic avant de corriger) et pourquoi tester tôt coûte moins cher que tester tard.

**Points clés**
- Toujours donner le message d'erreur complet, jamais un résumé approximatif.
- Isoler avant de corriger : partout ou cas précis ?
- Diagnostiquer la cause réelle, pas seulement faire disparaître le symptôme visible.

**Durée** : à renseigner après l'enregistrement (estimation : 3 min 27 s avant montage).

## 5. Mise en ligne, guidée en direct

Cette étape se fait avec Claude, une étape à la fois. Ne la déroulez pas seul.

L'état des lieux de la plateforme, les deux limites de taille à lever avant le premier envoi réel, le choix « section ou chapitre » et les sept étapes prévues sont décrits dans `livrables/formations/ecosysteme-ia/2026-09_vivier-ia-module-1/videos/01-fondations/chapitre-1/03-enregistrement-et-mise-en-ligne.md` (section 5). Ils valent aussi pour cette vidéo. Le chantier d'envoi direct est cadré dans `livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md`.

Le passage du chapitre à `en ligne` dans `SUIVI-VIDEOS.md` reste une attestation de Zézé.
