# Section 2 — 🧠 La Méthode

## Chapitre 1 : Agentic Coding vs Vibe Coding, la vraie différence

Deux façons de travailler avec une IA générative de code circulent, et les confondre mène à des projets fragiles.

Le **Vibe Coding** consiste à demander des résultats à l'IA au fil de l'eau, sans plan, en itérant à l'instinct ("fais un truc qui ressemble à ça", "ajoute un bouton là"), sans structure ni vérification systématique. Ça marche pour un prototype jetable ou une démonstration rapide. Ça ne tient pas pour un projet destiné à un client, parce que rien ne garantit la cohérence d'ensemble, la sécurité, ou la maintenabilité dans le temps.

L'**Agentic Coding** consiste à traiter Claude Code comme un agent autonome à qui on confie un objectif clair, avec un plan, des étapes vérifiables, et des points de validation. L'agent peut explorer le projet, prendre des décisions techniques dans un périmètre défini, mais toujours dans un cadre que tu as posé en amont.

La différence n'est pas l'outil utilisé, c'est la discipline autour. Deux personnes avec le même Claude Code peuvent produire un résultat solide ou un résultat bancal, selon qu'elles pratiquent l'un ou l'autre.

**Points clés**
- Vibe Coding : rapide, sans structure, bon pour prototyper, dangereux pour livrer
- Agentic Coding : objectif clair, plan, vérification, adapté à un vrai livrable client
- La discipline fait la différence, pas l'outil

---

## Chapitre 2 : L'art de donner des instructions à Claude Code

Une instruction bien formulée détermine la qualité du résultat plus que n'importe quel autre facteur. Ce chapitre pose la méthode.

Une bonne instruction contient en général :
- **Le contexte** : dans quel projet, pour qui, avec quelles contraintes existantes
- **L'objectif précis** : ce qui doit être vrai une fois la tâche terminée, pas seulement "améliore ça"
- **Le périmètre** : ce qui est concerné, et surtout ce qui ne doit pas être touché
- **Le niveau d'autonomie souhaité** : est-ce que l'agent doit demander avant d'agir sur un point sensible, ou peut-il avancer seul jusqu'à un certain point

Une erreur fréquente de débutant : donner une instruction floue ("rends ça plus beau", "corrige le bug") sans dire où regarder ni ce que "mieux" veut dire concrètement. Résultat : l'agent devine, et devine parfois mal.

Une bonne pratique : donner l'instruction comme on la donnerait à un collègue compétent mais qui découvre le projet pour la première fois. Il n'a pas le contexte dans sa tête, il faut le lui donner.

**Points clés**
- Contexte, objectif précis, périmètre, niveau d'autonomie
- Une instruction floue produit un résultat approximatif, pas un mauvais résultat "de la faute de l'IA"
- Écrire comme pour un collègue compétent qui découvre le projet

---

## Chapitre 3 : Le workflow Plan, Execute, Validate

C'est la structure de travail centrale de l'Agentic Coding, en trois temps.

**Plan** : avant d'agir, l'agent (ou toi-même) pose un plan des étapes à suivre pour atteindre l'objectif. Ce plan doit être lisible et compréhensible sans connaissance technique poussée, puisque c'est à ce moment que tu peux corriger la direction avant que du travail soit fait.

**Execute** : une fois le plan validé, l'agent exécute les étapes, une à une ou par blocs cohérents. C'est la phase où le code est réellement écrit, modifié, testé.

**Validate** : à la fin (ou à des points intermédiaires pour les tâches longues), on vérifie que le résultat correspond bien à l'objectif posé au départ. Ça peut être un test manuel (ouvrir l'application, cliquer, vérifier), une vérification automatisée, ou une relecture du code produit.

L'erreur classique est de sauter l'étape Plan et de foncer directement dans l'exécution, ou de sauter Validate en supposant que si l'agent dit "c'est fait", c'est nécessairement correct. Les deux raccourcis créent le même risque : découvrir un problème bien plus tard, quand il coûte plus cher à corriger.

**Points clés**
- Plan avant d'agir : ça permet de corriger tôt, pas cher
- Execute : le travail réel, par étapes
- Validate : ne jamais supposer qu'une tâche annoncée "terminée" est automatiquement correcte

---

## Chapitre 4 : Quand ça casse, debugger et vérifier

Même avec une bonne méthode, un projet finit par rencontrer une erreur : quelque chose ne fonctionne pas comme prévu. Ce chapitre enseigne le réflexe à avoir, pas la peur à éviter.

Trois étapes face à une erreur :
1. **Lire le message d'erreur en entier**, pas seulement la première ligne. Claude Code peut lire et interpréter des messages d'erreur techniques bien plus vite qu'un humain qui découvre le sujet, mais il faut lui donner le message complet, pas un résumé approximatif de ce qu'on a vu passer.
2. **Isoler le problème** : est-ce que ça casse partout, ou seulement dans un cas précis ? Cette information oriente énormément la recherche de la cause.
3. **Demander à l'agent de diagnostiquer avant de corriger**, plutôt que de lui demander directement "corrige ça". Comprendre la cause évite de masquer un symptôme sans régler le vrai problème, qui peut revenir plus tard sous une autre forme.

Un projet livré à un client qui "casse" une fois en production coûte beaucoup plus cher en confiance qu'un bug détecté et corrigé pendant la phase de construction. D'où l'importance de tester régulièrement, pas seulement à la toute fin.

**Points clés**
- Toujours donner le message d'erreur complet
- Isoler avant de corriger : partout ou cas précis ?
- Diagnostiquer la cause, pas seulement faire disparaître le symptôme

---

## Questions pour les apprenants

### Compréhension
1. Quelle est la vraie différence entre Vibe Coding et Agentic Coding, si ce n'est pas l'outil utilisé ?
2. Cite les quatre éléments d'une bonne instruction à Claude Code.
3. Explique les trois temps du workflow Plan, Execute, Validate.
4. Pourquoi ne faut-il jamais demander directement "corrige ça" sans diagnostic préalable ?

### Réflexion
5. Un apprenant construit un prototype qu'il montre uniquement à lui-même pour tester une idée. Le Vibe Coding est-il acceptable ici ? Justifie.
6. Reprends une instruction floue typique ("améliore le design du site") et reformule-la en instruction complète selon les 4 éléments du chapitre 2.

### Éléments de correction (réservé à l'enseignant)
- Q1 : la discipline autour de l'outil (plan, vérification, cadre) fait la différence, pas l'outil lui-même
- Q2 : contexte, objectif précis, périmètre, niveau d'autonomie souhaité
- Q3 : Plan = poser les étapes avant d'agir, Execute = réaliser le travail, Validate = vérifier la correspondance au besoin
- Q4 : parce qu'on risque de masquer un symptôme sans traiter la cause réelle, qui peut réapparaître
- Q5 : oui, acceptable pour un prototype jetable non destiné à un tiers, pas pour un livrable client
- Q6 : évaluer la présence des 4 éléments (contexte du site, ce que "amélioré" veut dire précisément, quelles pages/sections concernées, niveau d'autonomie accordé)
