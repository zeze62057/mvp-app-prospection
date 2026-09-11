# Fiche pratique — Vrais prompts, Section 3 (Maîtriser l'outil)

> Compagnon de [03-maitriser-loutil.md](03-maitriser-loutil.md). Un prompt réel par chapitre technique, à copier-coller et adapter. Exemple fil conducteur : le même site vitrine d'artisan que dans la fiche de la section 2, pour rester cohérent d'une fiche à l'autre.

---

## Chapitre 1 — Permissions

Pas de prompt à part ici : le bon réflexe, c'est de rendre le niveau d'autonomie explicite dans l'instruction elle-même (4e élément du gabarit vu en section 2).
```
Tu peux modifier librement les fichiers du dossier /site sans me demander.
En revanche, si une action touche à la configuration Git, à un fichier .env,
ou à quoi que ce soit qui pousserait du contenu en ligne, arrête-toi et
demande-moi confirmation avant d'agir.
```

---

## Chapitre 2 — CLAUDE.md

### Créer un CLAUDE.md pour un nouveau projet client
```
Je démarre un nouveau projet pour un client : un site vitrine pour un
artisan menuisier. Crée un fichier CLAUDE.md à la racine du projet qui
contienne : qui est le client (nom fictif "Menuiserie Dubois", basé en
Normandie), l'objectif du site (présenter le savoir-faire, donner envie
de demander un devis), les conventions à suivre (HTML/CSS/JS simple,
sans framework, mobile-first), et une zone signalée comme sensible :
ne jamais modifier les tarifs indiqués sur le site sans validation
explicite du client.
```

### Mettre à jour un CLAUDE.md existant après un changement de contexte
```
Le client a finalement décidé d'ajouter une boutique en ligne pour vendre
des petits objets en bois, en plus du site vitrine. Mets à jour le
CLAUDE.md pour refléter ce nouvel objectif, sans supprimer les
informations déjà présentes sur le projet initial.
```

---

## Chapitre 3 — Skills et Slash Commands

### Créer un Slash Command pour une tâche répétitive
```
Crée un Slash Command /nouveau-client qui, à chaque fois que je le lance
avec un nom d'artisan en argument, génère un dossier projet avec la
structure suivante : /site (vide), un CLAUDE.md pré-rempli avec le nom
donné en argument, et un README.md qui liste les prochaines étapes types
d'un projet vitrine.
```

### Créer un Skill pour un savoir-faire plus large
```
Crée un Skill nommé "audit-site-vitrine" qui, quand je lui demande
d'auditer un site vitrine existant, vérifie systématiquement : la
présence d'un formulaire de contact fonctionnel, la cohérence du menu
de navigation, le temps de chargement approximatif de la page d'accueil,
et l'affichage correct sur mobile. Le skill doit me rendre un rapport
structuré avec ce qui va et ce qui doit être corrigé, pas juste corriger
sans me montrer le diagnostic.
```

---

## Chapitre 4 — MCP

### Utiliser un MCP connecté avec un périmètre explicite
```
Connecte-toi à la base Notion "Clients Chatllow" via MCP et crée une
nouvelle page pour le client Menuiserie Dubois, avec les propriétés
Nom, Statut ("Prospect"), et Date de premier contact (aujourd'hui).
N'utilise que les propriétés qui existent déjà dans la base, n'en
invente aucune. Si une information me manque pour remplir un champ
obligatoire, demande-moi avant de deviner.
```

### Vérifier qu'une action MCP a réellement fonctionné
```
Une fois la page créée dans Notion, relis-la pour me confirmer que les
3 propriétés sont bien renseignées comme demandé. Ne me dis pas
seulement "c'est fait", montre-moi ce que la page contient réellement.
```

---

## Chapitre 5 — Hooks

### Mettre en place un hook de vérification avant commit
```
Configure un hook qui s'exécute avant chaque commit Git sur ce projet
et qui bloque le commit si un fichier .env ou toute clé d'API en clair
est sur le point d'être ajouté. Explique-moi ensuite en une phrase
comment le désactiver temporairement si j'en ai vraiment besoin un jour.
```

---

## Chapitre 6 — Structurer son projet

### Demander un audit de l'arborescence actuelle
```
Regarde l'arborescence actuelle du projet du site vitrine. Dis-moi si
elle reste lisible telle quelle si le projet passe de 5 fichiers à 50
(plusieurs pages, plusieurs types de contenus, des images en grand
nombre). Si ce n'est pas le cas, propose-moi une nouvelle structure de
dossiers avant de déplacer quoi que ce soit.
```

### Faire exécuter une réorganisation après validation
```
La structure que tu proposes me va. Réorganise les fichiers en
conséquence, et mets à jour tous les chemins d'accès (liens CSS, images,
scripts) qui seraient cassés par ce déplacement.
```

---

## Chapitre 7 — Gérer les coûts

### Découper une grosse tâche en étapes vérifiables
```
Je veux refondre entièrement le site vitrine (nouvelle structure,
nouveau contenu, nouvelle galerie). Plutôt que de tout faire d'un coup,
découpe ce travail en 4 ou 5 étapes indépendantes que je peux valider
une par une, pour éviter de devoir tout recommencer si une direction
ne me convient pas en cours de route.
```

---

## Exercice pour l'apprenant

Choisis un chapitre de cette section que tu n'as pas encore pratiqué sur un vrai projet (CLAUDE.md, un Skill, un hook...). Écris le prompt correspondant pour TON projet réel, lance-le, puis note en 2-3 lignes ce qui a changé dans ta façon de travailler avec l'agent une fois cet élément en place.
