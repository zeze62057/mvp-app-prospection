# Section 2 — 🧠 La Méthode

## Chapitre 1 : Agentic Coding vs Vibe Coding, la vraie différence

### Le constat de départ

Deux façons de travailler avec une IA générative de code circulent en ce moment, et les confondre mène à des projets fragiles. Beaucoup de démonstrations impressionnantes vues en ligne relèvent en réalité de la première, pas de la seconde, ce qui crée une attente irréaliste chez ceux qui débutent.

### Le Vibe Coding, ce que c'est vraiment

Le Vibe Coding consiste à demander des résultats à l'IA au fil de l'eau, sans plan, en itérant à l'instinct ("fais un truc qui ressemble à ça", "ajoute un bouton là"), sans structure ni vérification systématique. Ça marche très bien pour un prototype jetable ou une démonstration rapide, parce que l'objectif est de voir vite à quoi quelque chose pourrait ressembler, pas de construire quelque chose de durable.

Le problème apparaît quand ce mode de travail est utilisé pour un projet destiné à un client ou à un usage réel. Rien ne garantit la cohérence d'ensemble (deux fonctionnalités ajoutées séparément peuvent se contredire), la sécurité (une donnée sensible peut se retrouver exposée sans que personne ne l'ait décidé consciemment), ou la maintenabilité dans le temps (personne, pas même celui qui l'a construit, ne sait plus exactement pourquoi telle décision a été prise trois semaines plus tard).

### L'Agentic Coding, la discipline derrière l'outil

L'Agentic Coding consiste à traiter Claude Code comme un agent autonome à qui on confie un objectif clair, avec un plan, des étapes vérifiables, et des points de validation. L'agent peut explorer le projet, prendre des décisions techniques dans un périmètre défini, mais toujours dans un cadre que tu as posé en amont. Ce n'est pas plus lent que le Vibe Coding sur la durée, c'est plus lent au tout début (le temps de cadrer) et beaucoup plus rapide ensuite, parce qu'on évite les retours en arrière coûteux.

### Ce que ça implique pour toi concrètement

La différence n'est pas l'outil utilisé, c'est la discipline autour. Deux personnes avec exactement le même Claude Code peuvent produire un résultat solide ou un résultat bancal, selon qu'elles pratiquent l'un ou l'autre. Pour un projet perso ou une idée à tester, le Vibe Coding a toute sa place. Pour un livrable qui portera ton nom professionnellement, ou celui de Chatllow, l'Agentic Coding n'est pas négociable.

**Points clés**
- Vibe Coding : rapide, sans structure, bon pour prototyper, dangereux pour livrer
- Agentic Coding : objectif clair, plan, vérification, adapté à un vrai livrable client
- La discipline fait la différence, pas l'outil ni sa puissance apparente

---

## Chapitre 2 : L'art de donner des instructions à Claude Code

### Pourquoi ce chapitre est le plus important du module

Une instruction bien formulée détermine la qualité du résultat plus que n'importe quel autre facteur, plus que la puissance du modèle, plus que le temps passé. C'est la compétence qui remplace directement l'apprentissage d'un langage de programmation évoqué au chapitre 1 de la section précédente.

### Les quatre éléments d'une bonne instruction

Une bonne instruction contient en général :
- **Le contexte** : dans quel projet, pour qui, avec quelles contraintes existantes. Sans ça, l'agent part d'une feuille blanche mentale à chaque fois.
- **L'objectif précis** : ce qui doit être vrai une fois la tâche terminée, pas seulement "améliore ça". Un objectif précis se vérifie, un objectif vague se discute indéfiniment.
- **Le périmètre** : ce qui est concerné, et surtout ce qui ne doit pas être touché. C'est souvent l'élément oublié, et celui qui cause le plus de dégâts quand il manque : l'agent modifie quelque chose qui fonctionnait très bien et qu'on ne voulait pas voir changer.
- **Le niveau d'autonomie souhaité** : est-ce que l'agent doit demander avant d'agir sur un point sensible, ou peut-il avancer seul jusqu'à un certain point. Ce niveau peut varier selon la confiance acquise sur un projet donné.

### L'erreur classique, et pourquoi elle coûte cher

Une instruction floue ("rends ça plus beau", "corrige le bug") sans dire où regarder ni ce que "mieux" veut dire concrètement force l'agent à deviner. Il devine parfois bien, parfois mal, et le débutant en tire souvent la mauvaise conclusion ("l'IA n'est pas fiable") alors que le problème vient de l'instruction, pas de l'agent.

### Le réflexe à adopter

Une bonne pratique consiste à donner l'instruction comme on la donnerait à un collègue compétent mais qui découvre le projet pour la première fois aujourd'hui. Il n'a pas le contexte dans sa tête, il faut le lui donner explicitement. Cette image mentale simple évite la plupart des instructions trop courtes ou trop implicites.

**Points clés**
- Contexte, objectif précis, périmètre, niveau d'autonomie : les quatre éléments non négociables
- Une instruction floue produit un résultat approximatif, ce n'est pas "la faute de l'IA"
- Écrire comme pour un collègue compétent qui découvre le projet aujourd'hui

---

## Chapitre 3 : Le workflow Plan, Execute, Validate

### La structure centrale de l'Agentic Coding

C'est le cœur méthodologique de tout ce module, en trois temps qui se répètent à chaque tâche, petite ou grande.

**Plan.** Avant d'agir, l'agent (ou toi-même) pose un plan des étapes à suivre pour atteindre l'objectif. Ce plan doit être lisible et compréhensible sans connaissance technique poussée, puisque c'est à ce moment précis que tu peux corriger la direction avant que du travail soit réellement fait. Une erreur repérée au stade du plan coûte quelques secondes à corriger. La même erreur repérée après exécution coûte le temps de tout reconstruire.

**Execute.** Une fois le plan validé, l'agent exécute les étapes, une à une ou par blocs cohérents. C'est la phase où le code est réellement écrit, modifié, testé. C'est aussi la phase la plus spectaculaire à regarder, mais la moins déterminante pour la qualité finale si les deux autres étapes sont mal faites.

**Validate.** À la fin, ou à des points intermédiaires pour les tâches longues, on vérifie que le résultat correspond bien à l'objectif posé au départ. Ça peut être un test manuel (ouvrir l'application, cliquer, vérifier), une vérification automatisée, ou une relecture ciblée du résultat produit.

### Les deux raccourcis dangereux

L'erreur classique est de sauter l'étape Plan et de foncer directement dans l'exécution parce que ça semble plus rapide, ou de sauter Validate en supposant que si l'agent annonce "c'est fait", c'est nécessairement correct. Les deux raccourcis créent le même risque de fond : découvrir un problème bien plus tard, au pire moment possible, quand il coûte beaucoup plus cher à corriger qu'au moment où il est apparu.

### Pourquoi ce workflow s'applique à toute taille de tâche

Pour une tâche petite, le Plan peut tenir en une phrase mentale et le Validate en un coup d'œil rapide. Pour une tâche large (comme le projet fil rouge de la section 5), chaque étape mérite un vrai temps dédié. Le principe reste identique à toutes les échelles, seule sa durée change.

**Points clés**
- Plan avant d'agir : ça permet de corriger tôt, donc pas cher
- Execute : le travail réel, par étapes, pas la phase la plus déterminante
- Validate : ne jamais supposer qu'une tâche annoncée "terminée" est automatiquement correcte

---

## Chapitre 4 : Quand ça casse, debugger et vérifier

### Le réflexe à avoir, pas la peur à éviter

Même avec une bonne méthode, un projet finit toujours par rencontrer une erreur : quelque chose ne fonctionne pas comme prévu. Ce n'est pas un échec de la méthode, c'est une étape normale. Ce chapitre enseigne comment y réagir efficacement plutôt que comment l'éviter à tout prix, ce qui serait illusoire.

### Les trois étapes face à une erreur

**1. Lire le message d'erreur en entier**, pas seulement la première ligne ou l'impression générale qu'on en a. Claude Code peut lire et interpréter des messages d'erreur techniques bien plus vite qu'un humain qui découvre le sujet, mais il faut lui donner le message complet, pas un résumé approximatif de ce qu'on a vu passer à l'écran.

**2. Isoler le problème.** Est-ce que ça casse partout, ou seulement dans un cas précis (un certain type de donnée, une certaine action, un certain moment) ? Cette information oriente énormément la recherche de la cause, et évite de chercher au mauvais endroit.

**3. Demander à l'agent de diagnostiquer avant de corriger**, plutôt que de lui demander directement "corrige ça". Comprendre la cause évite de masquer un symptôme sans régler le vrai problème, qui peut revenir plus tard sous une autre forme, parfois plus difficile à repérer la seconde fois.

### Pourquoi tester tôt coûte moins cher que tester tard

Un projet livré à un client qui "casse" une fois en production coûte beaucoup plus cher en confiance qu'un bug détecté et corrigé pendant la phase de construction. D'où l'importance de tester régulièrement, à chaque étape du workflow Plan-Execute-Validate, pas seulement à la toute fin du projet quand il est déjà trop tard pour changer une décision structurelle.

**Points clés**
- Toujours donner le message d'erreur complet, jamais un résumé approximatif
- Isoler avant de corriger : partout ou cas précis ?
- Diagnostiquer la cause réelle, pas seulement faire disparaître le symptôme visible

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
