# Fiche pratique — Vrais prompts, Section 4 (Claude Code au quotidien)

> Compagnon de [04-quotidien.md](04-quotidien.md). Vrais prompts pour mettre en place un second brain, préparer un livrable professionnel, et suivre son propre business.

---

## Chapitre 1 — Second Brain

### Démarrer un second brain pour une nouvelle activité

À adapter au cas d'un apprenant qui lance, par exemple, son activité de coach en marketing de réseau :
```
Je veux mettre en place un second brain pour mon activité de coach en
marketing de réseau, sur le même principe que ce workspace : un fichier
CLAUDE.md qui explique qui je suis et comment tu dois m'aider, un
context/CONTEXT.md avec mes objectifs et mes projets en cours, et un
context/HISTORY.md pour tracer les décisions importantes au fil du
temps. Pose-moi les questions nécessaires pour remplir ces 3 fichiers
avec mes vraies informations, ne les invente pas.
```

### Recharger le contexte en début de session (équivalent d'un /prime)
```
Avant de commencer, lis CLAUDE.md, context/CONTEXT.md et
context/HISTORY.md en entier. Résume-moi en quelques lignes qui je suis,
où j'en suis sur mes projets actifs, et ce qui s'est passé lors de ma
dernière session. Attends ensuite mes instructions, ne lance rien de
toi-même.
```

### Détecter et proposer une mise à jour de contexte
```
Je viens de te dire que j'ai signé mon premier client. Est-ce le genre
de changement qui mériterait de mettre à jour context/CONTEXT.md et
d'ajouter une entrée dans context/HISTORY.md ? Si oui, propose-moi le
texte exact avant de l'écrire, je veux valider avant que tu modifies
le fichier.
```

---

## Chapitre 2 — Préparer vos livrables professionnels

### Générer une documentation client à partir d'un projet technique
```
Le site vitrine de Menuiserie Dubois est terminé côté technique. Rédige
une documentation destinée au client, non technique, qui explique :
comment modifier le contenu texte du site lui-même sans mon aide,
comment consulter les messages reçus via le formulaire de contact, et
qui contacter en cas de problème. Pas de jargon technique, ce document
doit être compréhensible par quelqu'un qui n'a jamais programmé.
```

### Traduire des fonctionnalités techniques en valeur pour un dirigeant
```
Voici la liste technique de ce qui a été livré sur ce projet : [colle
ici la liste de fonctionnalités]. Reformule cette liste en 4 ou 5
bénéfices concrets pour un dirigeant non technique, du type "vous gagnez
X" ou "vous n'avez plus besoin de Y", plutôt qu'une liste de
fonctionnalités techniques qu'il ne saura pas interpréter.
```

---

## Chapitre 3 — Gérer votre propre business

### Structurer un suivi de facturation simple
```
Aide-moi à structurer un suivi de facturation pour mes 3 activités
(Chatllow, Vivier IA, Longrich). Je veux un tableau (format
Markdown ou CSV, à ton choix) avec les colonnes : activité, client,
montant, statut (à facturer, facturé, payé), date. Propose-moi la
structure avant de créer le fichier, je veux valider les colonnes.
```

### Construire un tableau de suivi de KPIs
```
Crée un tableau de suivi pour mon activité Chatllow avec les indicateurs
suivants : nombre de prospects contactés cette semaine, nombre de rendez-
vous obtenus, nombre de propositions envoyées, nombre de clients signés.
Le tableau doit pouvoir être mis à jour facilement au fil des semaines,
avec une ligne par semaine plutôt qu'un seul total qui écrase l'historique.
```

### Générer un rapport d'activité régulier
```
À partir des données de context/HISTORY.md et du tableau de suivi de
KPIs, rédige un rapport d'activité de la semaine, avec ce qui a avancé
sur chaque projet, ce qui a été signé ou pas, et un point d'attention si
tu détectes qu'une activité stagne par rapport aux semaines précédentes.
```

---

## Exercice pour l'apprenant

Mets en place, même de façon minimale, un second brain pour un pan de ton activité que tu n'as pas encore structuré (ta chaîne YouTube, ton activité Longrich, ou autre). Utilise le premier prompt de cette fiche tel quel, en répondant honnêtement aux questions posées par l'agent plutôt qu'en survolant l'exercice.
