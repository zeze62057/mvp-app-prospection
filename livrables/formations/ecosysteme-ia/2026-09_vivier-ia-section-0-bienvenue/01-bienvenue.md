# Section 0 — 👋 Bienvenue

> Fiche pratique associée : [01-bienvenue-prompts.md](01-bienvenue-prompts.md), le prompt pour installer ton assistant personnel.

## Chapitre 1 : Présentation de la formation

### Ce que Vivier IA cherche à faire

Vivier IA n'est pas une école de plus qui empile des vidéos sur l'intelligence artificielle. L'ambition est de former et de recruter les meilleurs : un vivier de talents, pas seulement un public qui consomme du contenu. Ça change ce qu'on attend de toi : pas juste regarder, pratiquer, et progresser jusqu'à un niveau qui a une vraie valeur, pour toi ou pour ceux qui pourraient te confier un projet.

### Une formation construite sur l'écosystème Claude

Tout ce que tu vas apprendre ici s'appuie sur Claude Code, l'outil que tu es probablement déjà en train d'utiliser pour suivre cette formation. Ce n'est pas un hasard : le meilleur moyen de maîtriser un outil, c'est de l'utiliser dès le premier jour, pas seulement d'en entendre parler.

### Les 5 modules du programme

1. **Écosystème Claude** — la fondation. Comment livrer un vrai produit avec Claude Code, du terminal jusqu'à la mise en ligne, et en faire quelque chose de réutilisable.
2. **n8n** — l'automatisation. Comment connecter des outils entre eux et construire des agents qui travaillent pour toi.
3. **Mindset Early Adopter & Business IA** — la posture. Comment penser et te positionner pour saisir une opportunité encore tôt dans son cycle, et commencer à trouver des clients.
4. **RGPD et AI Act** — la conformité. Comment transformer la réglementation en argument de confiance plutôt qu'en contrainte.
5. **Lemlist et prospection froide** — l'acquisition. Comment remplir un carnet de clients par la prospection email.

Ils sont présentés dans cet ordre parce que c'est celui qui construit le plus solidement, une base technique avant l'usage commercial. Ce n'est pas une obligation rigide : si un module précis répond à un besoin urgent que tu as déjà identifié, tu peux t'y rendre directement. Le chapitre suivant t'aide à faire ce choix.

### Comment tu vas vivre cette formation

Tu ne vas pas juste regarder des vidéos dans le vide. La plateforme est construite autour d'une communauté : une partie gratuite pour découvrir, une partie payante pour aller plus loin avec des exercices et des échanges avec d'autres apprenants, et un espace personnel où tu vois ta propre progression avancer module après module.

**Points clés**
- L'ambition de Vivier IA est de former et de recruter, pas seulement d'informer
- La formation elle-même utilise l'outil qu'elle enseigne, dès le premier jour
- 5 modules, dans un ordre pensé pour construire une base avant l'usage commercial, mais pas rigide

---

## Chapitre 2 : Comment bien suivre la formation

### Le piège que tu vas rencontrer, tôt ou tard

Ce piège existe dans n'importe quel module : lire ou regarder une vidéo, trouver ça clair, et penser que c'est acquis. Ce n'est jamais le cas. Une notion comprise en la regardant et une notion pratiquée sur un cas réel, même petit, sont deux choses différentes. C'est la seconde qui compte, et c'est elle qui te distinguera de quelqu'un qui a juste "suivi la formation" sans jamais construire quoi que ce soit avec.

### Une vidéo, puis un vrai geste

Chaque chapitre de chaque module a une vidéo courte, et une fiche de pratique associée avec de vrais prompts, pas des exemples abstraits. La méthode qui fonctionne : regarder la vidéo, puis reproduire l'exercice sur un projet à toi, même minuscule, avant de passer au chapitre suivant. Regarder trois vidéos d'affilée sans rien pratiquer entre deux te donnera l'impression d'avancer vite, mais la compréhension retombera dès que tu voudras réellement t'en servir.

### Un signal, pas une case à cocher

Certains modules te donnent un "signal de passage" : une preuve concrète que tu peux passer à la suite, pas juste le fait d'avoir terminé de lire. Un signal de passage typique ressemble à ceci : tu as une URL publique qui fonctionne, obtenue par toi-même de bout en bout, même si le contenu est insignifiant. Si tu n'as pas ce signal, la bonne réaction n'est pas de continuer quand même, c'est de reprendre la partie qui manque.

### Utiliser la communauté, pas juste la consulter

Si tu bloques sur un exercice, ou si un résultat te surprend, c'est le bon moment pour en parler dans la communauté plutôt que d'insister seul pendant une heure. Poster où tu en es sert aussi à autre chose : ça t'oblige à formuler clairement ce que tu as fait, ce qui aide souvent à voir soi-même où ça coince.

### Ton rythme, pas un délai imposé

Il n'y a pas de date limite fixée pour terminer cette formation. Mais "à ton rythme" ne veut pas dire "quand j'y penserai" : une régularité modeste et tenue dans la durée fait plus progresser qu'une semaine intensive suivie de deux mois sans y toucher.

**Points clés**
- Une vidéo sans pratique derrière ne construit rien de durable
- Un signal de passage est une preuve concrète, pas une case cochée
- La communauté sert à débloquer une vraie difficulté, pas seulement à être consultée en silence

---

## Chapitre 3 : Installer votre assistant personnel

### Pourquoi commencer par ça

Avant même d'entrer dans le détail du premier module, il y a un geste qui va rendre tout le reste plus facile : mettre en place ton propre assistant personnel avec Claude Code. Un espace qui te connaît, garde en mémoire ton contexte, et t'aide sans que tu aies à tout réexpliquer à chaque fois. Tu vas t'en servir pour suivre ta progression dans cette formation, mais aussi, si tu le souhaites, pour bien plus large que ça, ton activité, tes projets, ton quotidien.

### Comment ça fonctionne concrètement

Le principe tient en trois fichiers, que Claude Code sait lire automatiquement : un fichier qui dit qui tu es et comment tu veux qu'on te parle, un fichier de contexte qui détaille ta situation et tes objectifs, et un journal qui garde la trace de ce qui a été fait et décidé au fil du temps. Tu n'as pas besoin de les écrire toi-même : tu réponds à quelques questions, et c'est Claude Code qui les remplit pour toi.

### Une installation guidée, en une seule commande

Vivier IA te fournit un module d'installation tout prêt, le Kit Starter Vivier Academies. Dans Claude Code, une seule commande suffit : `/install module-installs/kit-starter-vivier-academies`. Elle lance une courte interview de 5 questions : qui tu es, ce que tu fais, ce qui t'amène à cette formation, tes objectifs, et comment tu préfères qu'on communique avec toi. Une fois les réponses données, les trois fichiers sont créés, et ton assistant est immédiatement opérationnel.

### Un workspace organisé dès le premier jour

Le kit ne s'arrête pas à l'assistant. Il crée aussi un dossier `projets/`, séparé de `context/`. `context/` reste la mémoire de ton assistant, `projets/` devient l'endroit où tu construiras tout ce que tu pratiqueras au fil de la formation, à commencer par le fil rouge du Module 1. Cette séparation, un espace pour la mémoire et un espace pour le travail, est le premier réflexe d'organisation que tu prends, avant même d'avoir commencé le premier module.

### Ce que ça change dès la prochaine session

Sans cet assistant, chaque nouvelle session avec Claude Code repart de zéro. Avec lui, une seule commande en début de session, ou même simplement le fait d'ouvrir le dossier, lui permet de retrouver qui tu es, où tu en es dans la formation, et ce qui a été fait la dernière fois. Tu retrouveras ce principe en détail plus loin dans le programme, avec des usages qui vont bien au-delà du simple suivi de cette formation.

### Ce qui n'est pas grave si ça arrive

Tes premières réponses seront sans doute imparfaites, ou incomplètes. Ce n'est pas grave : ces fichiers ne sont pas figés, tu pourras les corriger et les enrichir au fil de l'eau, exactement comme tu le ferais avec des notes personnelles qui s'affinent avec le temps.

**Points clés**
- Trois fichiers suffisent : qui tu es, ton contexte, ton historique
- Une interview guidée les remplit pour toi, tu n'as rien à écrire à la main
- Ce n'est pas figé : ça s'enrichit et se corrige au fil de la formation

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi Vivier IA se présente-t-il comme un "vivier de talents" plutôt qu'une école grand public classique ?
2. Cite les 5 modules du programme, dans l'ordre proposé.
3. Qu'est-ce qu'un "signal de passage", et en quoi diffère-t-il du simple fait d'avoir terminé de lire un chapitre ?
4. Quels sont les trois fichiers de ton assistant personnel, et à quoi sert chacun ?

### Réflexion
5. Regarde les 5 modules du programme. Y en a-t-il un qui répond à un besoin que tu as déjà, aujourd'hui ? Si oui, lequel, et pourquoi ?
6. Une fois ton assistant personnel installé, relis les trois fichiers créés. Est-ce qu'ils te représentent fidèlement ? Qu'est-ce que tu changerais ou ajouterais dès maintenant ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : l'objectif est de former ET de recruter les meilleurs, pas seulement d'informer un public large
- Q2 : Écosystème Claude, n8n, Mindset Early Adopter & Business IA, RGPD et AI Act, Lemlist et prospection froide
- Q3 : une preuve concrète et vérifiable qu'une compétence est acquise, pas seulement le fait d'avoir consulté le contenu
- Q4 : qui tu es et comment te parler, ton contexte et tes objectifs, l'historique de ce qui a été fait et décidé
- Q5/Q6 : pas de réponse unique, évaluer la cohérence avec la situation réelle de l'apprenant
