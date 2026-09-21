# Enregistrement et mise en ligne : Pourquoi Claude Code va changer votre métier

Module 1, section 1, chapitre 1. Voir `01-script.md` et `02-diapositives.md`.

## 1. Checklist d'enregistrement

**La veille**
- Lire le script une fois à voix haute, chronomètre en main. Corriger le débit réel par rapport aux 140 mots par minute prévus.
- Faire construire les 7 diapositives dans Claude Design (prompt dans `02-diapositives.md`, à valider avant lancement).
- Créer un dossier de démonstration vide et court, par exemple `C:\demo`. Un chemin court évite d'afficher votre nom d'utilisateur Windows.
- Désinstaller Claude Code de la machine d'enregistrement, pour rejouer l'installation depuis zéro : `npm uninstall -g @anthropic-ai/claude-code`. Vérifier ensuite que `claude --version` renvoie bien une erreur.
- Vérifier que Node.js 18 ou plus est installé (`node --version`).

**Juste avant**
- Couper les notifications (assistant de concentration de Windows), fermer les onglets et applications inutiles.
- Terminal : agrandir la police (Ctrl et molette dans Windows Terminal) pour que les commandes se lisent en 1080p.
- Écran en 1920 par 1080, bureau propre.
- Son : casque ou micro de qualité, pièce calme, test de une minute réécouté avant de commencer.
- Ouvrir un terminal neuf, pour ne pas montrer l'historique d'une session précédente.

**Pendant**
- Dire à l'oral ce que vous tapez avant de le taper.
- Si une commande échoue, ne coupez pas d'emblée : le chapitre porte justement sur ces blocages. Si l'échec n'est pas l'un des deux cas du cours, coupez et reprenez.
- L'attente de `npm install` peut être coupée au montage. Laissez-la tourner sans commenter.

## 2. Vérification des secrets, avant de lancer l'enregistrement

Rien de ceci ne doit apparaître à l'écran :
- une clé d'API, un mot de passe ou un jeton, y compris ceux de Chatllow, de Chariow ou d'un client ;
- un fichier `.env` ouvert dans l'éditeur ;
- l'adresse e-mail de votre compte à l'écran de connexion de Claude Code : utilisez un compte de démonstration, ou floutez-la au montage ;
- votre nom d'utilisateur dans un chemin de dossier ;
- une donnée client réelle, dans un onglet, un fichier récent ou le presse-papiers.

Vérifiez aussi la barre d'onglets du navigateur, les favoris et l'historique du terminal.

## 3. Quel outil pour enregistrer

**Attention : l'outil d'enregistrement intégré à la plateforme ne convient pas pour une voix off.** Il capture l'écran et le son du système, mais pas le micro. Enregistrez avec un logiciel qui capte le micro (OBS Studio est gratuit), puis envoyez le fichier sur la plateforme.

Pour une vidéo de type diaporama et terminal, enregistrez tout l'écran en une seule prise. Le montage se limite à couper l'attente d'installation.

## 4. Fiche à coller sur la plateforme

**Titre** : Pourquoi Claude Code va changer votre métier

**Description** : Comprenez ce que Claude Code change pour celui qui construit : vous décrivez, l'agent traduit, vous validez. Puis installez Claude Code et lancez-le sur votre ordinateur, en trois commandes.

**Points clés**
- Votre rôle : architecte et validateur, pas traducteur de syntaxe.
- L'effort se déplace, il ne disparaît pas.
- Une personne seule peut livrer un produit complet, du code au déploiement.
- Installer Claude Code : Node.js, `npm install -g @anthropic-ai/claude-code`, puis `claude`.

**Durée** : à renseigner après l'enregistrement (estimation : 8 min 35 s avant montage).

## 5. Mise en ligne, guidée en direct

Cette étape se fait avec Claude, une étape à la fois. Ne la déroulez pas seul.

**État des lieux de la plateforme** (vérifié dans le code le 2026-09-21) :
- Une vidéo par **section**, stockée dans un espace privé, lisible par les élèves qui ont un accès payant.
- Vous pouvez y envoyer un fichier vidéo (mp4, mov, webm) depuis `/admin`.

**Deux limites à lever avant d'envoyer une vraie vidéo**
1. **La taille passe par le serveur de la plateforme.** Le fichier est reçu en entier par la route `/api/admin/video`. Sur Vercel, ce type d'envoi est limité à **4,5 Mo par requête** (documentation Vercel, confirmée le 2026-09-21). Une vidéo de 8 minutes ne passera pas en ligne, alors qu'elle passe sur votre poste.
2. **Le stockage a sa propre limite par fichier.** Sur l'offre gratuite de Supabase, elle est de **50 Mo au maximum, non relevable** (documentation Supabase, confirmée le 2026-09-21). Une vidéo de 8 minutes en 1080p dépasse en général cette taille.

La solution est un envoi direct vers le stockage, par une adresse signée et de manière résumable, avec une limite relevée. Ce chantier est cadré dans `livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md`, avec les options et les décisions à prendre. Il doit être fait avant le premier envoi réel.

**Un choix à faire ensemble : section ou chapitre**
La section 1 contient 4 chapitres, donc 4 vidéos, mais la plateforme n'accepte qu'une vidéo par section. Deux options : une seule vidéo montée avec des repères horodatés par chapitre, ou un découpage de la section en quatre sections sur la plateforme. À trancher avec Zézé.

**Étapes prévues**
1. Vérifier dans `/admin` comment le Module 1 est découpé en sections.
2. Trancher entre repères horodatés et découpage en sections.
3. Lever les deux limites de taille (chantier à part).
4. Envoyer d'abord un fichier de test de quelques secondes, et vérifier qu'il se lit.
5. Envoyer la vraie vidéo.
6. Vérifier la lecture côté élève, avec un compte de test qui a un accès payant.
7. Passer le chapitre à `en ligne` dans `SUIVI-VIDEOS.md`. C'est Zézé qui l'atteste.
