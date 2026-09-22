---
name: creer-video-formation
description: >-
  Prépare tout ce qu'il faut pour enregistrer la vidéo d'un chapitre du
  programme de formation écosystème IA de Zézé (Modules 1 à 5 de Vivier IA),
  destinée à ses élèves, en format écran filmé avec voix off. Pour un chapitre
  donné, produit le cadrage, le script parlé minuté avec plan d'écran, le plan
  des diapositives (PowerPoint animé, construit avec l'outil commun
  `_outils-video`), la checklist
  d'enregistrement, la fiche à coller sur la plateforme, puis guide la mise en
  ligne pas à pas. Se déclenche quand Zézé demande de créer, préparer ou
  scripter une vidéo de formation pour ses élèves, "la vidéo du chapitre X",
  ou "les vidéos du Module N". Ne fabrique jamais le fichier vidéo lui-même.
---

# Skill : Créer une vidéo de formation

## Mission

Pour un chapitre du programme écosystème IA, livrer à Zézé un dossier prêt à enregistrer : il n'a plus qu'à lancer l'enregistrement d'écran et à parler. Le skill ne produit pas de contenu pédagogique nouveau : il met en scène, à l'oral, un chapitre déjà rédigé et validé.

Ce skill réutilise les règles de `preparer-demo-formation` (ne rien inventer, préparer avant de filmer ce qui est long, jamais de vraie clé à l'écran) et la variante "Formation" de `livrables/transverse/methode-approche-projet.md` (relecture de fidélité au cours avant de valider). Il ne modifie pas `preparer-demo-formation`, qui reste le skill des démos live.

## Décisions actées (2026-09-21)

- **Format** : écran filmé avec voix off. Zézé montre l'outil à l'écran et commente. Les diapositives servent d'ouverture, de repères et de récapitulatif, pas de contenu principal.
- **Adresse aux élèves** : vouvoiement dans tout ce qui est dit à l'oral ("vous"), même si la plateforme tutoie.
- **Unité de travail** : un chapitre = une vidéo. Une section de cours contient plusieurs chapitres, et une vidéo de 30 minutes perd les élèves.
- **Périmètre** : les 5 modules de `livrables/formations/ecosysteme-ia/`. Le skill traite n'importe quelle section, chapitre par chapitre.
- **Livraison** : préparation et mise en ligne guidée. Le skill n'envoie jamais rien sur la plateforme sans l'accord de Zézé.
- **Diapositives** (2026-09-21) : un fichier PowerPoint animé, construit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir d'un `diapositives.json` par chapitre. Le format a été validé sur le chapitre 1. Plus de deck Claude Design, sauf demande expresse de Zézé.
- **Rythme de travail** (2026-09-21, mis à jour) : **chaque chapitre est traité séparément et en entier** (script, diapositives, fiches, suivi), jamais plusieurs chapitres mélangés dans un même fichier. Sur les chapitres 1 à 4, Zézé validait un chapitre avant le suivant. Il a ensuite demandé d'ajouter tous les chapitres restants : on enchaîne donc les chapitres dans l'ordre du programme, **section par section**, sans s'arrêter entre deux chapitres. Donnez de brefs points d'étape à la fin de chaque section (chapitres faits, points à valider les plus importants), et un bilan complet à la fin de la session. Les points à valider restent écrits dans chaque `01-script.md` : ils sont validés en bloc par Zézé, jamais escamotés parce qu'on enchaîne.
- **Exemples neutralisés** (2026-09-22) : toujours reprendre l'exemple déjà fourni dans la fiche pratique du chapitre (le site vitrine d'artisan), jamais une formulation générique inventée au cas par cas. C'est la pratique suivie depuis le chapitre 1, désormais actée.
- **Manipulation ou test hors cours** (2026-09-22) : si une démonstration ou un test paraît utile mais n'est ni dans le chapitre ni dans sa fiche pratique, ne jamais l'inventer ni l'exécuter. Le lister dans les "points à valider avec Zézé" du `01-script.md`, comme fait jusqu'ici, jamais improvisé ni passé sous silence.
- **Chapitres conceptuels** (2026-09-22) : pour un chapitre sans manipulation réelle à l'écran (mindset, RGPD, stratégie), diapositives seules par défaut, voix off dessus, sauf si le chapitre a réellement quelque chose à montrer (auquel cas le signaler et proposer un plan d'écran).
- **Rappel de la pratique** (2026-09-22) : chaque module a un `00-guide-de-reussite.md` avec un "à faire" et un "signal de passage" par section (pas par chapitre). Ne pas créer un fichier d'exercice par chapitre. À la place, la diapositive "prochaine étape" et le script de chaque chapitre rappellent en une ligne le "à faire" de la section en cours, tiré du guide de réussite du module, jamais inventé. Sur le dernier chapitre d'une section, rappeler le "signal de passage" complet de cette section.

## Comment utiliser ce skill

### Étape 0 : identifier le chapitre

Si Zézé ne l'a pas précisé, demandez le module, la section et le chapitre. S'il demande "les vidéos du Module N" ou "d'une section", proposez la liste des chapitres, faites-en valider l'ordre, puis traitez un chapitre à la fois. Ne préparez pas tout d'un bloc.

### Étape 1 : lire les sources, en entier

Avant d'écrire quoi que ce soit, lisez :
- le chapitre dans le fichier de section du module (`0X-nom-section.md`) ;
- la fiche de prompts associée (`0X-nom-section-prompts.md`) si elle existe : ses prompts sont prêts à l'emploi, n'en inventez pas d'autres ;
- la sous-section "Installation pratique" du chapitre, et ses pièges fréquents ;
- pour le Module 1, `00-guide-de-reussite.md` : l'étape correspondante donne le "à faire" concret et le "signal de passage" que la vidéo doit permettre d'atteindre ;
- `SUIVI-VIDEOS.md` (voir plus bas) pour voir ce qui existe déjà.

Ne jamais inventer un exemple, une commande, un chiffre ou un prompt absent de ces sources. Si le chapitre n'a pas d'exemple concret ou pas d'installation pratique alors que l'outil doit être installé, dites-le à Zézé : soit on enrichit d'abord le chapitre, soit on enregistre avec ce qui existe.

**Le cours est parfois écrit pour Zézé, pas pour des élèves.** Le premier essai l'a montré : le chapitre 1 du Module 1 parle à Zézé (« vu où tu veux aller, cabinet de conseil, école »), cite Chatllow et renvoie à des dossiers du workspace. Une vidéo publique ne doit contenir ni ses projets personnels, ni des chemins internes, ni ses clients. Repérez ces passages à la lecture. Neutralisez-les dans le script (« un consultant, un formateur ou un entrepreneur »), et listez chacun dans une section « Points à valider avec Zézé » du fichier `01-script.md`, avec le texte d'origine et la version proposée. Ne les modifiez jamais en silence, et ne changez rien d'autre sur le fond.

**Les prompts de la fiche pratique se copient tels quels, y compris leur tutoiement** : ils s'adressent à Claude Code, pas à l'élève. Quand la fiche mêle des exemples de Zézé (Chatllow, Kora, chemins de son workspace) et des exemples neutres (le site vitrine d'un artisan), gardez les neutres et écartez les autres.

**Repérez aussi les démonstrations qui touchent au poste ou aux secrets de Zézé.** Le chapitre 3 (Git) l'a montré : une commande de configuration globale écraserait son identité Git et afficherait son e-mail, un jeton GitHub est un secret qui ne s'affiche qu'une fois, et le cours ne donne aucune commande pour le premier commit (il renvoie à `/commit`, une commande de son workspace). Dans ce cas, montrez la commande sur une diapositive sans l'exécuter, ne créez aucun secret à l'écran, ne fabriquez aucune commande absente du cours, et listez le sujet dans les points à valider avec la demande proposée.

### Étape 2 : produire les livrables

Écrire dans `livrables/formations/ecosysteme-ia/<module>/videos/<section>/chapitre-<N>/` trois fichiers, plus `diapositives.json` et le PowerPoint qui en sort. **Lisez d'abord `livrables/formations/ecosysteme-ia/_outils-video/README.md`** : il donne les commandes, le format du JSON et les types de diapositives.

**`01-script.md`** contient :

1. **Cadrage** : objectif d'apprentissage en une phrase (repris du signal de passage quand il existe), prérequis de l'élève, durée cible entre 5 et 12 minutes selon la matière du chapitre, exemple concret du chapitre qui portera la vidéo.
2. **Points à valider avec Zézé** : les passages du cours adaptés pour des élèves (voir l'étape 1), avec le texte d'origine et la version proposée.
3. **Script minuté**, sous forme de tableau à quatre colonnes :

   | Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
   |---|---|---|---|

   Le tableau suit toujours ce fil : accroche, annonce du plan, points clés, démonstration de l'exemple concret, installation pratique si le chapitre en a une, erreurs fréquentes, récapitulatif, prochaine étape.

   Écrivez la colonne « Minute » sous la forme `{{t1}}`, `{{t2}}`... et notez le temps de manipulation à l'écran sous la forme `⏱ +30 s` dans la colonne « Action ». Le calcul des minutes se fait ensuite par `node minuter-script.mjs <chemin/01-script.md>` (dans `_outils-video`), jamais à la main.
4. **Durée estimée** : remplie par `minuter-script.mjs` (mots prononcés divisés par 140, rythme de voix off posée en français, plus le temps de manipulation). Vérifiez qu'elle tient dans la durée cible. Indiquez que 140 est une hypothèse à corriger après le premier enregistrement.

**`diapositives.json`** est la source des diapositives : 5 à 8 diapositives (titre du chapitre, objectif, plan, un point clé par diapositive, récapitulatif, prochaine étape), chacune avec son texte exact et des notes de l'orateur (moment du script, clics). Une diapositive ne contient rien que le script ne dise pas. Le format et les types de mise en page sont dans le README de l'outil. Construisez le PowerPoint avec `node construire-pptx.mjs`, corrigez les avertissements, puis vérifiez avec `verifier-pptx.ps1` (effets, clics, transitions, et alertes de mise en page : texte qui déborde, mot seul en fin de ligne). Corrigez chaque débordement. Un mot seul en fin de ligne se corrige en reformulant ou en coupant à la main avec `\n`. Puis générez la planche avec `node planche.mjs <dossier-du-chapitre>` et **regardez-la** (une image par chapitre) : les alertes ne voient pas tout. Ne retouchez jamais le `.pptx` à la main, modifiez le JSON et reconstruisez.

**En pratique, la partie mécanique tient en deux commandes.** On écrit à la main `01-script.md` (avec des `{{tN}}` et des `⏱ +N s`) et `diapositives.json` (avec les clés `bureau`, `fiche`, `preparation`, `secrets`... décrites dans le README de l'outil). Puis `node terminer-chapitre.mjs <dossier-du-chapitre>` (dans `_outils-video`) minute le script, construit le PowerPoint, le contrôle dans PowerPoint, produit la planche d'aperçu, écrit `02-diapositives.md` et `03-enregistrement-et-mise-en-ligne.md`, et copie le PowerPoint sur le Bureau. Enfin `node maj-suivi.mjs <dossier-du-chapitre> "notes"` met à jour `SUIVI-VIDEOS.md`. Relancez `terminer-chapitre` après chaque retouche. Les démonstrations qui ont besoin d'un projet de test utilisent `livrables/formations/ecosysteme-ia/_ressources-demo/` (site d'artisan fictif) : ne pas inventer de projet de démonstration.

**Copie sur le Bureau (demande de Zézé, 2026-09-21).** Zézé veut tout ce qui sert à enregistrer sur son Bureau, pas seulement le PowerPoint : `Bureau\Diapositives Vivier IA\Module <N> - Section <M> - <Nom de la section>\Chapitre <K>\` contient `Diapositives.pptx`, `Script.md`, `Enregistrement.md` et `Plan des diapositives.md`. À la racine de `Diapositives Vivier IA` : les outils (copie de consultation), le site de démonstration, le suivi et un `LISEZ-MOI.txt`. Tout cela est fait par `terminer-chapitre.mjs` (un chapitre) ou `synchroniser-bureau.mjs` (tout), grâce à la clé `bureau` du `diapositives.json`. Ce sont des copies : la source reste dans le projet. Si un fichier est ouvert dans PowerPoint et que la copie échoue, dites-le à Zézé. **Ne dites jamais que des « vidéos » ont été produites** : seuls les supports d'enregistrement le sont, Zézé enregistre lui-même.

**`02-diapositives.md`** contient le plan des diapositives (numéro, moment du script, titre, texte exact), le tableau des animations (ce qui apparaît à chaque clic) et ce qui a été contrôlé. Précisez que le déroulé animé n'a pas été joué en mode diaporama, sauf si c'est le cas.

**`03-enregistrement-et-mise-en-ligne.md`** contient :

1. **Checklist d'enregistrement** :
   - écran propre : notifications coupées, onglets inutiles fermés, zoom du terminal à 150 %, résolution 1080p ;
   - comptes et projet de démonstration déjà créés ;
   - test à blanc d'une minute, pour vérifier le son et la lisibilité ;
   - plan B si une démonstration échoue en direct (poursuivre, ou couper et reprendre) ;
   - **outil d'enregistrement** : celui de la plateforme capte l'écran et le son du système, pas le micro. Pour une voix off, enregistrez avec un logiciel qui capte le micro (OBS Studio est gratuit) et envoyez ensuite le fichier.
2. **Vérification des secrets** : aucune vraie clé d'API, aucun mot de passe, aucune donnée client réelle à l'écran. Utilisez des identifiants de démonstration, jamais ceux de Chatllow, de Chariow ou d'un client. Vérifiez aussi la barre d'onglets, l'historique du terminal et les fichiers `.env` ouverts.
3. **Fiche plateforme** prête à coller : titre de la vidéo, description en deux phrases, trois à cinq points clés, durée réelle à renseigner après l'enregistrement.

### Étape 3 : règles d'écriture du script parlé

Un script à l'oral n'est pas le cours recopié.
- **Phrases courtes**, une idée à la fois, vingt mots au plus. Pas de parenthèses imbriquées, elles ne se disent pas.
- **Vouvoiement** de bout en bout.
- **Un exemple concret** nommé par chapitre, repris du cours (le projet fil rouge, une activité réelle), jamais un principe seul.
- **Annoncez le plan** dans les trente premières secondes et **récapitulez** à la fin.
- **Commandes et noms d'outils** : donnez-les exactement comme dans le cours, et dites à l'oral ce qu'on tape avant de le taper.
- **Aucun terme technique sans définition** la première fois qu'il apparaît.
- **Ne surpromettez pas** : reprenez la section "ce que ça ne change pas" du cours quand elle existe.

### Étape 4 : relecture de fidélité

Avant de rendre le dossier, comparez le script au chapitre source, ligne à ligne : chaque affirmation, commande, chiffre et prompt du script doit se retrouver dans le cours. Signalez à Zézé tout ce que vous avez dû reformuler et tout écart avec le cours. La mise en scène change, le contenu ne change pas.

### Étape 5 : mise en ligne, guidée en direct

La plateforme Vivier Academies stocke **une vidéo par section**, dans un espace de stockage privé, lisible seulement par les élèves ayant un accès payant. L'admin permet d'envoyer un fichier vidéo, ou d'enregistrer l'écran (sans le micro).

**Deux limites de taille, confirmées dans la documentation Vercel et Supabase le 2026-09-21 (4,5 Mo par requête sur Vercel, 50 Mo par fichier sur l'offre gratuite de Supabase). Le chantier de correction est cadré dans `livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md` : consultez-le pour savoir s'il est fait, et revérifiez avant chaque premier envoi réel.** Détail : le fichier passe en entier par la route `/api/admin/video/[sectionId]` (sur Vercel, ce type d'envoi est limité à quelques mégaoctets, à confirmer dans la documentation), et le stockage Supabase limite la taille d'un fichier (50 Mo par défaut sur l'offre gratuite). Une vidéo de plusieurs minutes dépasse ces limites. Tant qu'un envoi direct par adresse signée et une limite relevée ne sont pas en place, dites-le à Zézé avant de le laisser envoyer, et proposez ce chantier séparément. Testez d'abord avec un fichier de quelques secondes.

Cette étape est une manipulation réelle sur les systèmes de Zézé : procédez **étape par étape, en direct**. Donnez une étape, attendez qu'il l'ait faite, vérifiez, puis passez à la suivante. Ne remettez jamais une liste d'instructions à dérouler seul.

Avant d'envoyer : vérifiez avec lui comment la section est découpée sur la plateforme. Si une section de cours contient plusieurs chapitres, choisissez ensemble entre une vidéo montée avec des repères horodatés par chapitre, ou un découpage de la section en plusieurs sections. Ne tranchez pas seul.

### Étape 6 : tenir le suivi à jour

Le fichier `livrables/formations/ecosysteme-ia/SUIVI-VIDEOS.md` liste chaque chapitre du programme avec son état : `à faire`, `script prêt`, `enregistré`, `en ligne`. Créez-le s'il n'existe pas. Mettez à jour la ligne du chapitre traité à la fin de chaque session, avec la date et la durée (estimée, puis réelle une fois connue). Le skill ne passe jamais un chapitre à `enregistré` ou `en ligne` de sa propre initiative : c'est Zézé qui l'atteste.

## Ce que ce skill ne fait jamais

- Il ne fabrique pas de fichier vidéo, et n'envoie rien sur la plateforme sans que Zézé le fasse avec lui.
- Il n'invente pas de contenu pédagogique, de commande, de prompt ni d'exemple : il met en scène l'existant.
- Il n'affiche, ne lit ni ne demande de vraie clé ou de mot de passe : jamais dans le chat, jamais à l'écran.
- Il ne remplace pas une répétition. Un script se teste à voix haute avant l'enregistrement.
- Il ne planifie pas la promotion des vidéos sur YouTube ou LinkedIn : ce sont d'autres sujets.
