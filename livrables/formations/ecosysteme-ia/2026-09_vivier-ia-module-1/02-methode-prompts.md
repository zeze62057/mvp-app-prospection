# Fiche pratique — Vrais prompts, Chapitres 2 et 3

> Compagnon de [02-methode.md](02-methode.md). Ici, pas de théorie : uniquement des prompts réels, à copier-coller tels quels dans Claude Code pour s'entraîner. Chaque exemple est construit sur un mini-projet fictif (un site vitrine pour un artisan) pour rester concret, mais la structure s'applique à n'importe quel projet.

---

## Partie 1 — Chapitre 2 : L'art de donner des instructions

Rappel des 4 éléments à tenir : contexte, objectif précis, périmètre, niveau d'autonomie.

### Exemple 1 — Ajouter une fonctionnalité

**Instruction floue (à éviter)**
```
Ajoute un formulaire de contact sur le site.
```
Pourquoi ça pose problème : aucune indication sur où le placer, quels champs, ce qu'il doit se passer à l'envoi, ni si l'agent peut toucher au design existant.

**Instruction complète (à viser)**
```
Contexte : le site vitrine de l'artisan (dossier /site, page index.html et
style.css). Il n'y a pas encore de moyen pour un visiteur de nous contacter.

Objectif : ajouter un formulaire de contact en bas de la page d'accueil,
avec les champs nom, email, message. À l'envoi, afficher un message de
confirmation à l'écran (pas besoin de connecter un vrai envoi d'email pour
l'instant, on simule juste l'envoi côté front).

Périmètre : uniquement la page index.html et un nouveau fichier
contact.js si besoin. Ne touche pas à la section "Nos réalisations" ni
à la palette de couleurs déjà en place dans style.css.

Autonomie : tu peux choisir la structure HTML du formulaire et le style
en cohérence avec le reste du site sans me demander, mais montre-moi le
résultat avant de considérer que c'est terminé.
```

### Exemple 2 — Corriger un problème visuel

**Instruction floue (à éviter)**
```
Le site est moche sur mobile, corrige ça.
```

**Instruction complète (à viser)**
```
Contexte : le site vitrine (/site/index.html), testé sur un iPhone en
largeur d'écran normale (375px environ).

Objectif : le menu de navigation en haut de page déborde de l'écran et
oblige à scroller horizontalement. Une fois corrigé, le menu doit tenir
dans la largeur de l'écran, quitte à passer en menu empilé ou en icône
hamburger si besoin.

Périmètre : uniquement le CSS et le HTML du menu de navigation (section
<nav> et les règles associées dans style.css). Le reste de la mise en
page mobile n'est pas concerné pour l'instant.

Autonomie : choisis la solution technique (menu empilé, hamburger, ou
autre) que tu juges la plus simple et cohérente avec le design actuel,
et explique-moi ton choix en une phrase une fois fait.
```

### Exemple 3 — Instruction courte mais complète (petite tâche)

Pour une tâche vraiment petite, les 4 éléments tiennent en 2 à 3 lignes, pas besoin d'un pavé :
```
Dans /site/index.html, le lien "Nos réalisations" du menu pointe vers
une ancre qui n'existe plus (#galerie a été renommée #portfolio). Corrige
uniquement ce lien, ne touche à rien d'autre dans le menu.
```

### Gabarit réutilisable

À garder sous la main et à remplir pour toute tâche qui dépasse une ligne :
```
Contexte : [projet, fichiers concernés, état actuel]
Objectif : [ce qui doit être vrai une fois terminé, vérifiable]
Périmètre : [ce qui est concerné] / [ce qu'il ne faut surtout pas toucher]
Autonomie : [ce que l'agent peut décider seul] / [ce qu'il doit valider avec moi avant]
```

### Avant le gabarit : et la maquette ?

Ce gabarit couvre la phase de construction avec Claude Code, pas la phase de design. Pour un projet avec une vraie interface (pas un simple ajustement), la maquette vient avant, généralement dans Claude Design (voir le chapitre 1 de la section 5, "De Lovable à Claude Code", qui décrit le même principe avec un autre outil de prototypage). Une fois la maquette validée, elle nourrit le premier élément du gabarit, le Contexte, plutôt que d'ajouter un 5e élément :
```
Contexte : implémentation du canvas Claude Design "[nom du canvas]" déjà
validé par le client (fichier dans context/import/). Reprends la
structure et le style de ce canvas, ne réinvente pas le design.
```
Processus complet : maquette dans Claude Design, import de la maquette dans `context/import/`, puis gabarit et cycle Plan/Execute/Validate en référençant la maquette dans le Contexte.

---

## Partie 2 — Chapitre 3 : Le workflow Plan, Execute, Validate

### Exemple bout en bout — ajouter une page "Tarifs"

**1. Plan.** On demande explicitement un plan avant toute exécution :
```
Avant de coder, propose-moi un plan pour ajouter une page "Tarifs" au
site vitrine de l'artisan. Contexte : /site contient déjà index.html et
style.css, avec un menu de navigation commun en haut de chaque page.
Objectif : une nouvelle page tarifs.html accessible depuis le menu,
listant 3 formules avec prix et description, dans le même style visuel
que le reste du site. Ne code rien pour l'instant, donne-moi juste les
étapes que tu comptes suivre.
```
Ce que ça permet : lire les étapes proposées et corriger avant qu'une seule ligne soit écrite. Exemple de correction possible à ce stade : "Étape 3, ne crée pas de nouveau fichier CSS, réutilise style.css existant."

**2. Execute.** Une fois le plan validé :
```
Le plan me va, vas-y.
```
ou, si une étape a été corrigée avant validation :
```
Le plan me va sauf l'étape 3 : réutilise style.css existant plutôt que
d'en créer un nouveau. Le reste est bon, vas-y.
```

**3. Validate.** Une fois l'exécution terminée, on ne suppose pas que "c'est fait" veut dire "c'est bon" :
```
Montre-moi la liste des fichiers modifiés ou créés. Ensuite, ouvre
tarifs.html dans le navigateur pour vérifier que le menu de navigation
fonctionne bien depuis cette nouvelle page et que le style est cohérent
avec index.html.
```

### Exemple de prompt de validation seul (pour une tâche déjà "terminée" par l'agent)

Utile quand l'agent annonce qu'une tâche est finie et qu'on veut vérifier avant de passer à la suite :
```
Avant de continuer, vérifie toi-même que le formulaire de contact
fonctionne réellement : remplis les 3 champs avec des données de test et
confirme que le message de confirmation s'affiche bien. Dis-moi si tu as
pu le tester ou si une vérification manuelle de ma part est nécessaire.
```

### Exemple pour une tâche large (mini projet fil rouge)

Pour une tâche qui touche plusieurs fichiers ou plusieurs jours de travail, le Plan mérite d'être écrit, pas seulement demandé oralement :
```
Je veux refondre entièrement la page d'accueil du site vitrine : nouvelle
structure de sections, nouveau texte d'accroche, nouvelle galerie photo.
Avant de commencer, écris-moi un plan détaillé étape par étape (pas de
code), avec pour chaque étape ce qui sera livré et comment je pourrai le
vérifier. On validera le plan section par section avant que tu passes à
l'exécution.
```

---

## Partie 3 — Exemple complet, du gabarit au Validate

Les deux parties précédentes montrent des prompts isolés. Voici comment ils s'enchaînent réellement sur une seule tâche, du début à la fin, avec à chaque étape pourquoi on fait ce qu'on fait.

**Scénario** : un client fictif, le restaurant Le Bambou, a déjà un site vitrine simple (`/lebambou/index.html`, `/lebambou/style.css`). Il demande un formulaire de réservation.

### Étape 1 — Remplir le gabarit dans sa tête avant d'écrire quoi que ce soit

- Contexte : site existant, dossier `/lebambou`, pas de système de réservation actuellement
- Objectif : un formulaire (nom, date, heure, nombre de personnes) qui envoie une demande, avec confirmation à l'écran
- Périmètre : uniquement ce formulaire, pas touche au menu ni à la page "Notre carte"
- Autonomie : Claude peut choisir la structure technique, mais validation avant de considérer que c'est fini

Cette étape ne se saute jamais. La sauter, c'est le moment où une instruction floue s'écrit sans qu'on s'en rende compte.

### Étape 2 — Le prompt Plan
```
Avant de coder, propose-moi un plan pour ajouter un formulaire de
réservation sur le site du restaurant Le Bambou (dossier /lebambou,
index.html et style.css existants, pas de système de réservation actuel).

Objectif : un formulaire avec les champs nom, date, heure, nombre de
personnes, qui affiche un message de confirmation à l'envoi (pas besoin
d'un vrai envoi d'email pour l'instant, on simule côté front).

Périmètre : uniquement l'ajout de ce formulaire. Ne touche pas au menu
de navigation ni à la page "Notre carte".

Autonomie : tu choisis la structure technique, mais ne code rien pour
l'instant, donne-moi juste les étapes que tu comptes suivre.
```
On demande explicitement un plan, pas du code. C'est le moment le moins cher pour corriger une mauvaise direction.

**Réponse typique de l'agent (fictive)** : plan en 4 étapes, dont une étape 4 "ajouter un lien Réserver dans le menu de navigation".

### Étape 3 — Lire le plan et corriger avant l'exécution

L'étape 4 du plan touche au menu de navigation, alors que le périmètre disait explicitement de ne pas y toucher. C'est repéré avant que du code soit écrit :
```
Le plan me va sauf l'étape 4 : n'ajoute pas de lien dans le menu de
navigation existant, le formulaire sera accessible uniquement par un
bouton "Réserver" déjà présent en haut de la page d'accueil. Le reste
est bon, vas-y.
```
Corriger à ce stade coûte une phrase. Découvrir le lien en trop après exécution aurait coûté de défaire un travail déjà fait.

### Étape 4 — Execute

L'agent exécute les étapes restantes. Rien à écrire de spécial ici, c'est la phase la moins déterminante pour la qualité, à condition que les deux autres phases soient bien faites.

### Étape 5 — Le prompt Validate
```
Montre-moi la liste des fichiers modifiés ou créés. Ensuite, ouvre
index.html dans le navigateur, remplis le formulaire de réservation
avec des données de test (nom, une date, une heure, 4 personnes),
et confirme-moi que le message de confirmation s'affiche bien à l'envoi.
```
On ne se contente jamais d'un "c'est fait". On demande une preuve concrète, un test réellement effectué, pas une supposition.

### Ce que cet exemple illustre

- Le gabarit (étape 1) évite l'instruction floue dès le départ
- Le Plan (étape 2) rend visible la direction avant tout code
- La correction (étape 3) est peu coûteuse parce qu'elle arrive tôt
- Le Validate (étape 5) empêche de livrer au client quelque chose jamais réellement testé

C'est la même mécanique à appliquer sur un vrai projet, en remplaçant le contenu du gabarit par la réalité du projet.

---

## Exercice pour l'apprenant

Reprends un projet perso ou fictif que tu as sous la main. Pour une tâche que tu veux réellement faire :
1. Écris d'abord l'instruction floue que tu aurais spontanément tapée
2. Réécris-la avec le gabarit à 4 éléments de la Partie 1
3. Lance-la en 3 temps (Plan, Execute, Validate) comme dans la Partie 2, en écrivant chaque prompt avant de l'envoyer

Garde tes 3 versions (floue, complète, en 3 temps) : c'est la meilleure façon de sentir la différence sur un cas réel plutôt que sur un exemple de cours.
