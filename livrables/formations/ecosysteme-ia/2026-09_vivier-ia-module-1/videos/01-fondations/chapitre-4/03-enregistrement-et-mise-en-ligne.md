# Enregistrement et mise en ligne : Vercel et OVH, mettre en ligne en quelques minutes

Module 1, section 1, chapitre 4. Voir `01-script.md` et `02-diapositives.md`.

## 1. Checklist d'enregistrement

**La veille**
- Lire le script une fois à voix haute, chronomètre en main. Corriger le débit réel par rapport aux 140 mots par minute prévus.
- Tester le diaporama en mode présentation, avec les clics : `diapositives-chapitre-4.pptx`, 15 clics en tout.
- **Valider les 4 points de la section 2 du script.** Le point 3 (démonstration réelle et demande à Claude Code) conditionne la suite. Le point 1 (l'Afrique chez OVH) demande une vérification sur le site d'OVH.
- **Préparer la page de démonstration.** Créez un dossier nouveau, par exemple `C:\demo4`, et demandez à Claude Code (demande à valider, point 3) : « Crée une page HTML minimale avec un titre et une phrase. » Relisez le fichier créé : aucun nom, aucune adresse, aucun lien personnel dedans.
- **Créer le dépôt de démonstration** sur un compte GitHub de démonstration, et y envoyer la page. Le chapitre 3 n'a pas montré cette connexion : c'est de la préparation, pas de la vidéo.
- **Créer un compte Vercel de démonstration**, connecté à ce compte GitHub. Vérifiez qu'il n'affiche ni votre nom, ni votre adresse e-mail réelle, ni un de vos domaines.
- Faire une **répétition complète** : ajouter le projet dans Vercel, valider la configuration par défaut, attendre le déploiement, ouvrir l'adresse. Notez le temps réel (l'estimation du script est de 90 secondes de manipulation). Puis supprimez le projet Vercel de la répétition, pour rejouer l'ajout à l'écran.
- Vérifier les libellés : « Add New Project » existe-t-il encore tel quel sur Vercel ? Corrigez la diapositive 5 sinon.
- Repérer, sur le site d'OVH, la page des offres (hébergement web, VPS) à montrer à 5:05. **Ne créez pas de compte, ne commandez rien, ne saisissez aucune information de paiement.**

**Juste avant**
- Couper les notifications (assistant de concentration de Windows), fermer les onglets et applications inutiles.
- Écran en 1920 par 1080, bureau propre.
- Navigateur : fenêtre propre, **connectée uniquement aux comptes de démonstration** (GitHub, Vercel). Aucun autre compte, aucun favori personnel visible, aucun gestionnaire de mots de passe ouvert.
- Zoom du navigateur à 125 ou 150 % pour que le tableau de bord de Vercel se lise en 1080p.
- Son : casque ou micro de qualité, pièce calme, test de une minute réécouté avant de commencer.

**Pendant**
- Dire à l'oral ce que vous faites avant de le faire.
- Si le déploiement échoue ou traîne, ne coupez pas d'emblée : lisez l'erreur affichée par Vercel, c'est instructif. Si l'échec vient de votre préparation, coupez et reprenez.
- L'attente du déploiement peut être raccourcie au montage.
- Ne montrez ni la page de facturation, ni les réglages du compte, ni la liste de vos autres projets.

**Après l'enregistrement**
- **Supprimez le projet Vercel de démonstration et le dépôt GitHub de démonstration.** L'adresse obtenue est publique tant que le projet existe.
- Ne gardez pas de jeton ni de connexion inutile entre les deux comptes de démonstration.

## 2. Vérification des secrets, avant de lancer l'enregistrement

Rien de ceci ne doit apparaître à l'écran :
- une clé d'API, un mot de passe ou un jeton, y compris ceux de Chatllow, de Chariow ou d'un client ;
- une variable d'environnement de Vercel (l'écran « Environment Variables » peut afficher des secrets) : ne pas l'ouvrir ;
- un fichier `.env` ouvert dans l'éditeur, ou présent dans le dossier de démonstration ;
- votre adresse e-mail ou votre nom : compte GitHub, compte Vercel, autorisation d'accès de Vercel à GitHub ;
- vos projets Vercel réels, vos dépôts privés, vos domaines, ou une donnée client ;
- toute information de paiement ou d'identité chez OVH ;
- votre nom d'utilisateur dans un chemin de dossier.

Vérifiez aussi la barre d'onglets du navigateur, les favoris et l'historique.

## 3. Quel outil pour enregistrer

**Attention : l'outil d'enregistrement intégré à la plateforme ne convient pas pour une voix off.** Il capture l'écran et le son du système, mais pas le micro. Enregistrez avec un logiciel qui capte le micro (OBS Studio est gratuit), puis envoyez le fichier sur la plateforme.

Enregistrez tout l'écran en une seule prise. Le montage se limite aux coupures d'attente, par exemple le déploiement.

## 4. Fiche à coller sur la plateforme

**Titre** : Vercel et OVH, mettre en ligne en quelques minutes

**Description** : Un projet n'est livré que lorsqu'il est accessible en ligne. Découvrez Vercel et OVH, apprenez à choisir entre les deux selon votre projet, puis déployez une page sur Vercel jusqu'à obtenir une adresse publique.

**Points clés**
- Vercel : rapide, automatisé, adapté aux projets web standards.
- OVH : plus de contrôle, adapté aux besoins d'infrastructure spécifiques.
- Chaque `git push` sur la branche principale redéploie le site automatiquement sur Vercel.
- Un projet n'est livré que lorsqu'il est accessible en ligne.

**Durée** : à renseigner après l'enregistrement (estimation : 6 min 15 s avant montage).

## 5. Mise en ligne, guidée en direct

Cette étape se fait avec Claude, une étape à la fois. Ne la déroulez pas seul.

L'état des lieux de la plateforme, les deux limites de taille à lever avant le premier envoi réel, le choix « section ou chapitre » et les sept étapes prévues sont décrits dans `../chapitre-1/03-enregistrement-et-mise-en-ligne.md` (section 5). Ils valent aussi pour cette vidéo. Le chantier d'envoi direct est cadré dans `livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md`.

Ce chapitre est le dernier de la section 1 : les quatre vidéos (chapitres 1 à 4) peuvent être montées avec des repères par chapitre, ou envoyées comme quatre sections séparées, à trancher ensemble.

Le passage du chapitre à `en ligne` dans `SUIVI-VIDEOS.md` reste une attestation de Zézé.
