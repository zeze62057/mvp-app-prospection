---
name: preparer-demo-formation
description: >-
  Aide Zézé à préparer une démonstration pratique en direct d'un chapitre ou
  d'une section d'un module de formation (Module 1 Écosystème Claude, Module
  2 n8n, ou tout futur module de Vivier IA), pour une vidéo YouTube ou une
  session live avec des apprenants. Transforme le contenu de cours déjà
  rédigé en script de démo actionnable : objectif, prérequis à préparer
  avant l'enregistrement, déroulé étape par étape avec ce qu'il faut dire et
  montrer, pièges à éviter en direct, durée estimée. Se déclenche quand
  Zézé demande de préparer une démo, une démonstration pratique, ou un
  script pour filmer un chapitre du cours.
---

# Skill : Préparer une démo de formation

## Mission

Transformer un chapitre déjà rédigé (Module 1, Module 2, ou un futur module) en un script de démonstration prêt à être joué en direct, devant une caméra ou devant des apprenants en présentiel. Ce skill ne produit jamais de nouveau contenu pédagogique : il s'appuie exclusivement sur ce qui existe déjà dans `livrables/ecole/`.

## Comment utiliser ce skill

### 1. Identifier le chapitre concerné

Demande à Zézé quel module et quelle section/chapitre il veut démontrer, si ce n'est pas déjà clair dans sa demande. Un skill de démo mal ciblé sur un mauvais chapitre est pire qu'une question de clarification.

### 2. Lire les sources avant d'écrire quoi que ce soit

Pour le chapitre identifié, lis en entier, dans cet ordre :
- Le chapitre lui-même, dans le fichier de section du module (`0X-nom-section.md`)
- La fiche de prompts associée si elle existe (`0X-nom-section-prompts.md`), elle contient déjà des prompts prêts à l'emploi, ne pas en réinventer d'autres
- La sous-section "Installation pratique" du chapitre si elle existe : c'est la base de ce qui doit être préparé avant l'enregistrement
- Pour le Module 1, `00-guide-de-reussite.md` : repère l'étape correspondante, son "à faire" concret et son "signal de passage", qui définissent ce que la démo doit prouver au public

Ne jamais inventer un exemple, une commande, ou un prompt qui ne provient pas de ces sources : le rôle du skill est de mettre en scène un contenu déjà validé, pas d'en créer un nouveau.

### 3. Produire le script de démo

Le script suit toujours cette structure :

1. **Objectif de la démo** : ce que le public doit comprendre ou voir fonctionner à la fin, en une phrase. Reprend le "signal de passage" du guide de réussite quand il existe.
2. **Prérequis à préparer avant l'enregistrement** : tout ce qui doit déjà exister ou être installé avant de lancer la caméra, pour ne pas perdre du temps en direct sur une installation lente ou aléatoire (comptes déjà créés, clé API déjà générée, projet déjà initialisé à un stade précis). Une installation longue (téléchargement, création de compte) se prépare avant, jamais en direct sauf si la démo porte justement sur l'installation elle-même.
3. **Déroulé étape par étape** : dans l'ordre exact où filmer/présenter, avec pour chaque étape ce qu'il faut montrer à l'écran et les points clés à dire, repris du chapitre source (reformulés pour l'oral, pas recopiés tels quels comme du texte écrit).
4. **Pièges à éviter en direct** : ce qui peut mal tourner pendant une démo live et comment l'anticiper. Toujours vérifier qu'aucune clé API, mot de passe, ou donnée sensible réelle n'apparaît à l'écran (utiliser des credentials de démonstration, jamais les vraies clés de production de Chatllow ou d'un client).
5. **Durée estimée** : une fourchette réaliste, en minutes.

### 4. Adapter selon le format

Une démo pour une vidéo YouTube (public large, débutants, pas de retour en direct possible) demande un rythme plus explicite et plus de contexte donné à l'oral qu'une démo en présentiel avec des apprenants (où les questions en direct permettent d'ajuster). Demande à Zézé le format visé si ce n'est pas précisé, ça change la façon de rédiger le déroulé.

## Ce que ce skill ne fait jamais

- Il n'invente pas de contenu pédagogique nouveau, il met en scène l'existant
- Il ne planifie pas la publication ou la stratégie de contenu YouTube (ça reste le rôle de l'agent `agent-linkedin` pour LinkedIn, ou d'une réflexion éditoriale séparée pour YouTube)
- Il ne remplace pas une répétition réelle : un script de démo se teste avant d'être joué devant un public, il ne garantit pas à lui seul que la démo se passera bien

## Si le chapitre n'a pas de section "Installation pratique" ni de fiche de prompts

Dis-le à Zézé plutôt que d'improviser des prérequis ou des prompts qui n'existent pas dans le cours. Propose soit de préparer la démo avec ce qui existe réellement (les explications et exemples concrets du chapitre), soit d'enrichir d'abord le chapitre source si un vrai manque est identifié.
