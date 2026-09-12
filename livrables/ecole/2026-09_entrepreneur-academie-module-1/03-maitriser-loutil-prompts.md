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

### Un Skill pour formaliser toute une méthode de livraison client

Un Skill peut aller plus loin qu'un savoir-faire ponctuel : il peut encapsuler ta méthode complète de livraison pour un type de projet récurrent (par exemple tous tes futurs sites vitrines d'artisans), ce qui en fait un vrai starter réutilisable au sens du chapitre 4 de la section 6.
```
Crée un Skill nommé "nouveau-projet-vitrine" qui, pour chaque nouveau
client de ce type, suit dans l'ordre : création du CLAUDE.md avec les
informations du client, import de la maquette Claude Design si elle
existe déjà, puis rappel du gabarit à 4 éléments (contexte, objectif,
périmètre, autonomie) avant chaque tâche de construction, et enfin la
checklist de livraison (fonctionnel, sécurité, handoff) avant de
considérer le projet terminé.
```
Point de vigilance : un Skill comme celui-ci garantit que Claude suit le bon ordre et les bonnes étapes de ta méthode, il ne dispense jamais des points de validation Plan/Execute/Validate à l'intérieur de chaque tâche. Un Skill qui livrerait tout un projet client sans aucun arrêt pour ta validation irait à l'encontre du principe même de l'Agentic Coding vu au chapitre 1 de la Méthode. Si le projet a plusieurs missions vraiment distinctes (rédaction, visuels, tests), ce sont plutôt des sub-agents (chapitre 1 de la section 7) qu'il faut envisager en complément, pas un seul Skill qui ferait tout.

### Cas réel tiré de ce workspace

Ce n'est pas qu'une idée théorique, le besoin existe déjà dans ce workspace. `livrables/applications/` contient trois variantes du même starter, un générateur d'audit IA : `2026-09_generateur-audit-ia-chatllow` (l'original, documenté dans son fichier `METHODE.md`), `2026-09_generateur-audit-ia-immobilier` et `2026-09_generateur-audit-ia-hotellerie`, chacune dérivée de l'original en adaptant les champs et les opportunités générées au secteur visé, sans changer la structure du code (formulaire, génération du rapport, impression).

Chaque nouvelle variante a jusqu'ici été recréée "à la main" en demandant de dériver le starter existant. C'est exactement le moment où un Skill devient pertinent : dès qu'une même méthode se répète une 3e fois, ça vaut la peine de la formaliser plutôt que de continuer à la refaire de mémoire.
```
Crée un Skill nommé "nouveau-secteur-audit-ia" qui, quand je lui donne
un nouveau secteur (par exemple "coiffure et beauté"), dérive un nouveau
générateur d'audit IA sur le modèle de
livrables/applications/2026-09_generateur-audit-ia-chatllow : même
structure de code (formulaire, génération du rapport en JavaScript,
impression en PDF), mais avec les champs du formulaire et les
opportunités IA générées reformulés pour ce secteur précis. Le skill
doit créer le nouveau dossier dans livrables/applications/ en suivant
la convention de nommage du workspace, et me signaler dans un
README.md les points "⚠️ À valider avec Zézé" propres à ce secteur,
exactement comme pour les starters immobilier et hôtellerie déjà
existants.
```
Ce Skill ne remplace pas ta validation finale : il fait gagner le temps de reconstruire la méthode à chaque fois, mais le résultat pour un nouveau secteur reste à relire avant de l'utiliser en rendez-vous commercial, au même titre que les variantes immobilier et hôtellerie qui ont chacune leurs points "à valider" non tranchés.

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

### Se connecter à Google Drive

Le chapitre cite Google Drive parmi les écosystèmes accessibles via MCP. Même logique de périmètre explicite que pour Notion :
```
Connecte-toi à Google Drive via MCP et cherche le document de brief
envoyé par le client Menuiserie Dubois (cherche par nom "Menuiserie
Dubois" ou "brief"). Lis son contenu et résume-moi en 5 lignes les
informations utiles pour démarrer le projet. Ne modifie ni ne déplace
aucun fichier, tu es uniquement en lecture pour cette tâche.
```

### Se connecter à n8n

Utile quand une automatisation déjà en place doit être consultée ou déclenchée depuis Claude Code, plutôt que recréée à la main :
```
Connecte-toi à n8n via MCP et cherche s'il existe déjà un workflow
lié à l'envoi de notifications pour les nouvelles soumissions du
formulaire de contact. Si un workflow correspondant existe, montre-moi
son état actuel (actif ou non, dernière exécution). Ne crée ni ne
modifie rien pour l'instant, donne-moi juste ce diagnostic.
```

### Se connecter à Canva

C'est exactement le cas d'usage réel de ce workspace, où un agent génère un visuel LinkedIn via Canva et l'attache à une page Notion :
```
Connecte-toi à Canva via MCP et génère une affiche au format post
LinkedIn à partir du texte suivant : [titre et accroche du post]. Reste
dans la charte graphique déjà utilisée pour les posts précédents si tu
peux la retrouver, n'invente pas une nouvelle identité visuelle sans me
le signaler.
```

### Se connecter à une base de données

Pour un projet comme Kora, déjà branché sur Supabase :
```
Connecte-toi à la base Supabase du projet Kora et montre-moi, en
lecture seule, la liste des prospects au statut "Nouveau" créés cette
semaine. N'effectue aucune écriture ni modification sur la base pour
cette tâche, uniquement une lecture.
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
