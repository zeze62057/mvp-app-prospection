# Section 1 — 🧱 Les Fondations

## Chapitre 1 : Pourquoi Claude Code va changer votre métier

### Le constat de départ

Jusqu'à il y a peu, écrire du code demandait de connaître la syntaxe, la structure du langage, les bibliothèques. Le rôle du développeur (ou de la personne qui "code") était de traduire une idée en instructions précises que la machine comprend.

Claude Code change ce qui se passe entre l'idée et le résultat. Tu ne traduis plus l'idée en syntaxe toi-même, tu la décris en langage naturel, et un agent IA (Claude) fait la traduction, exécute, teste, corrige. Ton rôle bascule de "traducteur vers la machine" à "architecte et validateur".

### Ce que ça change concrètement pour ton métier

Trois basculements à comprendre, dans l'ordre :

**1. La barrière technique s'effondre, pas les compétences.**
Ne pas savoir écrire une ligne de Python ou de JavaScript n'est plus un mur infranchissable pour construire une application. Mais attention, ça ne veut pas dire que tout devient facile sans effort. Ça veut dire que l'effort se déplace : au lieu d'apprendre une syntaxe, tu dois apprendre à bien cadrer un problème, à donner un contexte clair, à valider un résultat. C'est une autre compétence, pas une absence de compétence.

**2. La vitesse de production change d'ordre de grandeur.**
Un projet qui prenait des semaines avec une équipe de développeurs peut, pour un produit simple à moyen, se construire en heures ou en jours avec Claude Code, si la personne aux commandes sait cadrer et valider. Ça ne remplace pas un système critique bancaire, mais ça couvre une immense partie de ce que des entrepreneurs comme toi ont besoin : sites, applications internes, outils métier, MVP.

**3. Le métier devient "produit de bout en bout", pas juste "code".**
C'est le point le plus important pour toi personnellement, vu où tu veux aller (cabinet de conseil, école). Claude Code ne se limite pas à écrire du code, il t'accompagne du terminal jusqu'au déploiement (Git, hébergement, tests). Ça veut dire qu'une seule personne, toi, peut aujourd'hui livrer un produit complet à un client, sans équipe technique derrière. C'est exactement le modèle économique que Chatllow peut exploiter : conseil ET exécution, par la même personne, à un coût que peu de cabinets traditionnels peuvent égaler.

### Ce que ça ne change pas (important pour ne pas survendre)

Claude Code ne remplace pas le jugement. Il exécute bien ce qu'on lui demande bien. Un mauvais cadrage produit un mauvais résultat, rapidement. La compétence qui devient rare et précieuse n'est donc pas "savoir coder", c'est "savoir cadrer, découper, vérifier". C'est tout l'objet du chapitre 2 de la section suivante, "L'art de donner des instructions à Claude Code".

### Pourquoi ce chapitre ouvre le module

Ce chapitre n'enseigne encore aucun outil. Son rôle est de repositionner mentalement l'apprenant avant de toucher quoi que ce soit : on ne vient pas ici "apprendre à coder", on vient apprendre à diriger un agent qui code. Si un apprenant garde le réflexe de vouloir tout comprendre ligne par ligne comme un développeur classique, il va se fatiguer inutilement et sous-exploiter l'outil.

**Points clés**
- Ton rôle : architecte et validateur, pas traducteur syntaxique
- L'effort se déplace, il ne disparaît pas
- Une personne seule peut livrer un produit complet, du code au déploiement

---

## Chapitre 2 : Le terminal et l'IDE, votre nouvel espace de travail

Deux environnements composent ton poste de travail avec Claude Code.

**Le terminal** est l'endroit où Claude Code s'exécute. Ce n'est pas juste une fenêtre noire intimidante, c'est le canal de conversation avec l'agent : tu écris ce que tu veux, Claude Code répond, agit, te montre ce qu'il a fait. Tu n'as pas besoin de mémoriser des commandes complexes, l'agent les utilise pour toi. Ton travail est de lire ce qu'il propose et de valider ou corriger.

**L'IDE** (environnement de développement, comme VS Code) est l'endroit où tu vois et navigues dans les fichiers du projet : le code généré, la structure des dossiers, les fichiers de configuration. Claude Code peut s'intégrer directement dans l'IDE (extension), ce qui te permet de voir les changements en contexte, fichier par fichier, plutôt que seulement en texte dans le terminal.

La bonne pratique de débutant : garde les deux ouverts en parallèle. Le terminal pour diriger l'agent, l'IDE pour inspecter visuellement ce qui a été produit. Tu n'as pas besoin de savoir écrire du code dans l'IDE, seulement de savoir t'y repérer : quel fichier fait quoi, où se trouve telle fonctionnalité.

**Points clés**
- Terminal = canal de conversation et d'action avec l'agent
- IDE = fenêtre d'inspection visuelle du projet
- Se repérer suffit, pas besoin d'écrire le code soi-même

---

## Chapitre 3 : Git et GitHub, le filet de sécurité du code

Git est un système qui garde en mémoire chaque état du projet dans le temps, sous forme de "commits" (des photos datées du code à un instant donné). GitHub est la plateforme en ligne qui héberge ces historiques et permet de les partager, sauvegarder, et collaborer dessus.

Pourquoi c'est un filet de sécurité : si Claude Code fait une modification qui casse quelque chose, ou si tu changes d'avis sur une direction prise, tu peux revenir à un état antérieur du projet. Sans Git, une erreur ou une mauvaise manipulation peut être irréversible. Avec Git, presque rien n'est perdu définitivement.

Trois réflexes à installer dès le départ :
- Committer régulièrement, à chaque étape stable du projet, pas seulement à la fin
- Écrire des messages de commit clairs, qui expliquent le pourquoi du changement, pas juste "modif"
- Pousser (push) vers GitHub pour avoir une sauvegarde hors de ta machine

Claude Code peut lui-même proposer et exécuter des commits pour toi, mais la validation finale (surtout avant un push) doit rester une décision consciente de ta part, jamais un réflexe automatique non contrôlé.

**Points clés**
- Git garde un historique réversible du projet
- GitHub héberge et sécurise cet historique en ligne
- Committer souvent, avec des messages clairs, valider avant de pousser

---

## Chapitre 4 : Vercel et OVH, mettre en ligne en quelques minutes

Une fois un projet construit, il doit être accessible sur internet pour qu'un client ou un utilisateur puisse s'en servir. C'est le rôle de l'hébergement et du déploiement.

**Vercel** est une plateforme d'hébergement pensée pour les sites et applications web modernes, avec un déploiement souvent automatisé dès qu'un changement est poussé sur GitHub. Elle est particulièrement adaptée aux projets rapides à mettre en ligne, aux MVP, aux sites vitrines et applications front-end.

**OVH** est un hébergeur plus traditionnel, notamment utile quand le projet a besoin d'un serveur dédié, d'une base de données auto-hébergée, ou de contraintes spécifiques (données hébergées en Europe ou en Afrique selon les besoins du client, coûts maîtrisés sur la durée).

Le choix entre les deux dépend du projet : Vercel pour la rapidité et la simplicité d'un déploiement web standard, OVH ou un hébergeur équivalent quand le projet a des besoins d'infrastructure plus larges (comme un backend n8n auto-hébergé, vu dans le module Fullstack).

Ce chapitre est aussi le moment où l'apprenant comprend qu'un projet n'est "livré" que lorsqu'il est en ligne et accessible, pas seulement quand le code fonctionne en local sur sa machine.

**Points clés**
- Vercel : rapide, automatisé, adapté aux projets web standards
- OVH : plus de contrôle, adapté aux besoins d'infrastructure spécifiques
- Un projet n'est livré que lorsqu'il est accessible en ligne

---

## Questions pour les apprenants

### Compréhension
1. Que change concrètement Claude Code dans le rôle de celui qui construit un produit numérique ?
2. À quoi sert le terminal, à quoi sert l'IDE ? Pourquoi les utiliser en parallèle ?
3. Pourquoi dit-on que Git est un "filet de sécurité" ? Que se passerait-il sans lui ?
4. Dans quel cas choisir Vercel, dans quel cas choisir OVH ?

### Réflexion
5. Un apprenant pousse du code sur GitHub sans avoir vérifié le résultat en local. Quel risque prend-il, et quel réflexe du chapitre 3 aurait pu l'éviter ?
6. Pour un projet que tu imagines (le tien, ou celui d'un futur client Chatllow), lequel de Vercel ou OVH te semble le plus adapté, et pourquoi ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : bascule de traducteur syntaxique à architecte/validateur, le cadrage devient la compétence clé
- Q2 : terminal = diriger l'agent, IDE = inspecter visuellement ; les deux ensemble donnent contrôle et visibilité
- Q3 : permet de revenir en arrière si une modification casse quelque chose ; sans Git, les erreurs peuvent être irréversibles
- Q4 : Vercel pour un déploiement web rapide et standard, OVH quand il faut plus de contrôle d'infrastructure (serveur dédié, backend auto-hébergé comme n8n)
- Q5 : risque de casser la version partagée/sauvegardée du projet ; committer et vérifier avant de pousser
- Q6 : pas de bonne réponse unique, évaluer la cohérence du raisonnement avec les besoins du projet cité
