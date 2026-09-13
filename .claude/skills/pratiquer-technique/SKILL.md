---
name: pratiquer-technique
description: >-
  Guide Zézé à travers la pratique réelle d'un chapitre technique d'un
  module de formation (Module 1 Écosystème Claude, Module 2 n8n, ou tout
  futur module), pour qu'il monte lui-même en compétence, pas pour préparer
  une démonstration destinée à un public. Fait faire l'action concrète du
  chapitre en direct, étape par étape, vérifie que ça fonctionne réellement
  avant de continuer, et ne passe à l'étape suivante qu'une fois le signal
  de réussite atteint. Se déclenche quand Zézé veut pratiquer, s'entraîner,
  ou monter en compétence sur un chapitre ou une section précise, ou dit
  explicitement que c'est pour lui, pas pour ses élèves ou pour une vidéo.
---

# Skill : Pratiquer une compétence technique

## Mission

Faire pratiquer réellement à Zézé le contenu d'un chapitre technique, pas seulement le lui expliquer. Ce skill applique directement le principe de guidage en direct : une étape à la fois, avec vérification avant de passer à la suivante, jamais une liste d'instructions à dérouler seul de son côté.

## Différence avec `preparer-demo-formation`

Ne pas confondre les deux :
- `pratiquer-technique` (ce skill) : Zézé pratique pour lui-même, monte en compétence réelle, personne ne le regarde, l'objectif est qu'il sache refaire seul ensuite.
- `preparer-demo-formation` : Zézé prépare un script pour montrer quelque chose à un public (vidéo YouTube, session live avec des apprenants).

Si le contexte n'indique pas clairement lequel des deux est visé, demande.

## Comment utiliser ce skill

### 1. Identifier le chapitre ou la compétence à pratiquer

Demande quel module, quelle section, quel chapitre si ce n'est pas déjà clair. Une pratique sans cible précise se disperse.

### 2. Lire les sources avant de commencer

- Le chapitre concerné dans son fichier de section
- Sa sous-section "Installation pratique" si elle existe : c'est la base de l'exercice
- La fiche de prompts associée si elle existe (`0X-nom-section-prompts.md`)
- Pour le Module 1, l'étape correspondante de `00-guide-de-reussite.md` : le "à faire" concret et le "signal de passage" définissent ce que la pratique doit prouver

Ne jamais faire pratiquer une action ou une commande qui n'est pas dans ces sources. Si le chapitre visé n'a pas d'action concrète documentée, le dire à Zézé plutôt que d'improviser un exercice non validé.

### 3. Dérouler la pratique, une étape à la fois

Applique ici la même discipline que pour toute manipulation technique réelle sur les systèmes de Zézé : jamais une liste complète d'un coup.

1. Annonce la prochaine étape concrète à faire (une seule à la fois).
2. Laisse Zézé l'exécuter réellement (ou exécute-la avec lui via les outils disponibles quand c'est pertinent).
3. Vérifie le résultat avant de continuer : demande ce qu'il observe, ou vérifie toi-même si l'outil le permet (lire un fichier créé, tester une commande, ouvrir une page). Ne jamais supposer qu'une étape a réussi sans un signe concret.
4. Si quelque chose ne fonctionne pas comme attendu, on reste sur cette étape et on diagnostique avant d'avancer, exactement le réflexe du Module 1 (section 2, chapitre 4, "Quand ça casse, debugger et vérifier").
5. Une fois toutes les étapes faites, compare au signal de passage du guide de réussite (s'il existe) pour confirmer que la compétence est acquise, pas seulement que les commandes ont été tapées.

### 4. À la fin

Résume ce qui a été concrètement accompli et acquis, pas ce qui a été expliqué. Si le signal de passage officiel n'est pas encore atteint (par exemple parce qu'il couvre plusieurs chapitres et qu'on n'en a pratiqué qu'un), le dire clairement et proposer la suite logique.

## Ce que ce skill ne fait jamais

- Il ne remplace pas la pratique par une explication théorique, même détaillée
- Il ne passe jamais à l'étape suivante sans vérification concrète de la précédente
- Il n'invente pas d'exercice qui ne provient pas du contenu de cours déjà rédigé
