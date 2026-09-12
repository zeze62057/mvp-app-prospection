# Section 2 — 🎛️ n8n avancé

> Fiche pratique associée : [02-n8n-avance-prompts.md](02-n8n-avance-prompts.md).

## Chapitre 1 : Les APIs et le nœud HTTP Request

### Le nœud le plus universel de n8n

Vu en introduction à la section 1, HTTP Request mérite d'être approfondi : c'est le nœud qui permet de se connecter à n'importe quel service ayant une API, même sans nœud n8n dédié pour ce service précis. Maîtriser ce nœud en profondeur, c'est débloquer l'accès à des milliers de services que les nœuds spécifiques ne couvrent jamais tous.

### Lire une documentation d'API avant de configurer le nœud

La configuration d'un HTTP Request (méthode GET/POST/PUT/DELETE, en-têtes, authentification, corps de la requête) dépend entièrement de ce que l'API attend. Le réflexe à installer : ouvrir la documentation du service visé avant de toucher au nœud, repérer l'endpoint exact, le type d'authentification demandé (clé dans l'en-tête, jeton Bearer, OAuth), et la structure attendue du corps de requête. Configurer à l'aveugle en devinant produit des erreurs qui ressemblent à des bugs n8n alors que c'est une mauvaise lecture de la doc.

### Authentification et pagination, les deux pièges classiques

L'authentification mal configurée est la cause la plus fréquente d'un HTTP Request qui échoue immédiatement (erreur 401 ou 403) : vérifier si n8n propose une credential dédiée pour ce service avant de tout faire à la main dans les en-têtes. La pagination est le second piège : une API qui limite les résultats par page nécessite une boucle explicite (souvent un nœud Loop ou un sous-workflow récursif) pour tout récupérer, un oubli fréquent qui fait croire que "l'API ne renvoie pas tout" alors que seule la première page a été lue.

### Toujours tester sur un seul appel avant de généraliser

Avant de brancher un HTTP Request sur une liste de cent éléments, le tester sur un seul appel isolé : ça confirme que l'authentification, l'URL et la structure de réponse sont correctes, avant de multiplier les appels et de rendre le diagnostic d'une erreur beaucoup plus difficile à isoler.

**Points clés**
- HTTP Request débloque l'accès à n'importe quel service avec une API, même sans nœud dédié
- Lire la documentation de l'API avant de configurer, pas deviner la structure attendue
- Authentification et pagination sont les deux pièges les plus fréquents, à vérifier systématiquement
- Tester sur un seul appel avant de généraliser à une liste complète

---

## Chapitre 2 : Manipulation des données

### Les expressions, le langage de n8n pour référencer une donnée

Une expression, écrite entre doubles accolades `{{ }}`, permet de référencer dynamiquement une donnée produite par un nœud précédent, plutôt que de taper une valeur fixe. `{{ $json.email }}` récupère le champ "email" de l'élément courant, `{{ $node["Nom du nœud"].json.champ }}` récupère une donnée d'un nœud plus en amont, pas seulement le précédent immédiat.

### Le nœud Set (Edit Fields), le couteau suisse du façonnage

Le nœud Set sert à ajouter, renommer, ou recalculer des champs avant de les transmettre à l'étape suivante. C'est le nœud qu'on utilise le plus souvent pour adapter la forme des données d'un service à ce qu'attend le service suivant dans le workflow, sans avoir besoin d'écrire du code.

### Travailler avec plusieurs éléments à la fois

n8n traite nativement des listes d'éléments ("items"), pas un seul à la fois. Un nœud placé après un HTTP Request qui renvoie 50 résultats s'exécute automatiquement sur les 50, sans boucle explicite à écrire dans la plupart des cas. Comprendre quand n8n répète automatiquement une opération sur chaque item, et quand il faut au contraire une logique explicite (agréger, compter, dédupliquer), évite de mal interpréter un résultat inattendu.

### Agréger, transformer, dédupliquer

Au-delà du Set, des nœuds dédiés existent pour des opérations courantes sur des listes : Aggregate (regrouper plusieurs items en un seul tableau), Remove Duplicates (dédupliquer selon un champ), Sort (trier). Connaître leur existence évite de réinventer cette logique dans un nœud Code à chaque fois.

**Points clés**
- Les expressions `{{ }}` référencent dynamiquement une donnée produite ailleurs dans le workflow
- Le nœud Set façonne les données sans code, l'outil à utiliser par défaut
- n8n traite nativement des listes d'items, une opération s'applique souvent automatiquement à chacun
- Aggregate, Remove Duplicates, Sort : des nœuds dédiés existent avant de penser au Code

---

## Chapitre 3 : Données binaires

### La séparation entre données JSON et données binaires

n8n distingue deux types de contenu pour chaque item : le `$json` (texte, nombres, structures classiques) et le `$binary` (fichiers : images, PDF, tout contenu non textuel). Cette séparation explique un piège fréquent : une opération qui manipule uniquement le `$json` d'un item peut faire disparaître le fichier binaire qui l'accompagnait, sans message d'erreur visible.

### Lire et écrire du binaire

Un fichier arrive généralement dans le `$binary` sous un nom de propriété (souvent `data` par défaut), référencé ensuite par son nom dans les nœuds qui en ont besoin (envoyer une pièce jointe, l'uploader vers un service). Vérifier ce nom de propriété est la première chose à faire quand un nœud censé utiliser un fichier ne trouve "rien" à envoyer.

### Le piège du nœud Merge qui perd le binaire

Un Merge entre deux branches, mal configuré, peut garder le `$json` des deux côtés mais perdre le `$binary` d'un des deux flux. C'est une cause fréquente de workflows où "le fichier a disparu entre deux nœuds" sans erreur explicite. La vérification à faire : inspecter l'onglet binaire du résultat après chaque Merge impliquant un fichier, pas seulement l'onglet JSON.

### Cas d'usage courants

Envoyer une pièce jointe par email, uploader une image vers un CDN ou un stockage cloud, extraire du texte d'un PDF pour le traiter ensuite : ces cas reviennent souvent, et chacun implique de savoir précisément où se trouve le binaire à cet instant du workflow.

**Points clés**
- `$json` et `$binary` sont deux contenus séparés pour un même item, une opération sur l'un n'affecte pas forcément l'autre
- Vérifier le nom de la propriété binaire avant de chercher pourquoi un fichier "n'est pas trouvé"
- Le Merge est la cause la plus fréquente de perte silencieuse d'un fichier binaire
- Envoi de pièce jointe, upload d'image, extraction de PDF : les cas d'usage les plus courants

---

## Chapitre 4 : Organisation des workflows & sous-workflows

### Pourquoi extraire une logique répétée

Dès qu'une même séquence de nœuds se retrouve dans plusieurs workflows (vérifier un email, formater une adresse, notifier une équipe), elle mérite d'être extraite en sous-workflow, appelé ensuite via le nœud Execute Workflow. C'est le même principe que les starters réutilisables vu en Module 1 : construire une fois, réutiliser ensuite sans reconstruire.

### Entrées typées, la discipline qui évite les sous-workflows fragiles

Un sous-workflow bien conçu définit clairement ce qu'il attend en entrée (quels champs, dans quel format), plutôt que de supposer implicitement la structure reçue. Sans cette discipline, un sous-workflow fonctionne par hasard tant que l'appelant lui envoie exactement la même forme de données, et casse silencieusement au premier appelant différent.

### Le choix entre exécution "each" et "all"

Un sous-workflow peut être appelé une fois par élément de la liste reçue ("each"), ou une seule fois avec la liste entière ("all"). Ce choix dépend de la nature de la tâche : une vérification individuelle (valider un email) se prête à "each", une opération globale (calculer une moyenne sur l'ensemble) demande "all".

### Nommer pour qu'on retrouve un sous-workflow

Un sous-workflow se nomme de façon descriptive et orientée verbe ("Vérifier-Email-Prospect" plutôt que "Sous-workflow 3"), pour qu'il soit repérable dans une liste de workflows qui grandit avec le temps, exactement comme la convention de nommage des dossiers de projets vue en Module 1.

**Points clés**
- Extraire une logique répétée en sous-workflow évite de reconstruire la même chose dans chaque workflow
- Définir des entrées typées évite qu'un sous-workflow casse silencieusement avec un appelant différent
- Choisir "each" pour une opération par élément, "all" pour une opération globale sur la liste
- Nommer un sous-workflow de façon descriptive, verbe en premier

---

## Chapitre 5 : Gestion des erreurs

### Une erreur silencieuse coûte plus cher qu'une erreur visible

Un workflow qui échoue sans que personne ne le sache (pas de notification, pas de log consulté) peut rester cassé pendant des jours avant d'être découvert, souvent au moment le plus gênant. La discipline à installer : chaque workflow important doit rendre ses échecs visibles, pas seulement fonctionner quand tout va bien.

### Les mécanismes disponibles dans n8n

**Continue on Fail** : une option par nœud qui laisse le workflow continuer même si ce nœud précis échoue, utile quand un échec partiel n'est pas bloquant pour le reste. **Retry on Fail** : retente automatiquement un nœud en cas d'échec, pertinent pour des erreurs transitoires (réseau, service temporairement indisponible), pas pour une erreur de configuration qui se reproduira identiquement. **Error Trigger** : un workflow séparé, déclenché automatiquement quand un autre workflow échoue, pour centraliser la notification ou le traitement des erreurs plutôt que de le répéter dans chaque workflow.

### Concevoir des échecs qui préviennent quelqu'un

Un Error Trigger relié à une notification (email, Slack, un message vers une équipe) transforme un échec silencieux en signal exploitable. C'est l'équivalent, côté n8n, de la checklist de livraison du Module 1 : prévoir l'échec fait partie de la construction, pas un ajout de confort après coup.

### Distinguer une erreur transitoire d'une erreur de fond

Avant d'activer un Retry automatique, se demander si l'échec a une chance réelle de se résoudre seul (un service tiers temporairement surchargé) ou s'il révèle un problème de fond (une mauvaise configuration, une donnée mal formée) qui se reproduira à l'identique. Retenter automatiquement une erreur de fond masque le problème plus qu'il ne le résout.

**Points clés**
- Un échec silencieux coûte plus cher qu'un échec visible, rendre les erreurs visibles fait partie de la construction
- Continue on Fail, Retry on Fail, Error Trigger : trois mécanismes à combiner selon le cas
- Un Error Trigger relié à une notification transforme un échec silencieux en signal exploitable
- Retenter automatiquement n'a de sens que pour une erreur transitoire, pas pour un problème de fond

---

## Chapitre 6 : Astuces avancées + atelier demandes commerciales

### Mise en situation : automatiser le traitement des demandes commerciales entrantes

Cette mise en situation combine plusieurs chapitres de la section pour un cas concret et directement transposable à Chatllow : un formulaire de contact envoie une demande, et le workflow doit qualifier, router, et notifier sans intervention manuelle systématique.

### Le déroulé du workflow type

**1.** Un Webhook reçoit la demande (nom, entreprise, besoin décrit). **2.** Un nœud Set normalise les champs (format de l'email, suppression des espaces superflus). **3.** Un appel HTTP Request (ou un nœud IA, vu en section 3) qualifie la demande selon des critères simples (taille d'entreprise mentionnée, urgence exprimée). **4.** Un IF ou un Switch route vers la bonne suite selon cette qualification : une notification immédiate à l'équipe commerciale pour une demande chaude, un ajout dans un CRM ou une base pour une demande à suivre plus tard. **5.** Un Error Trigger couvre l'ensemble, pour ne jamais perdre silencieusement une demande entrante, le pire scénario possible pour ce type de workflow.

### Astuces qui font la différence sur la durée

Pinner des données de test représentatives de vrais cas (une demande urgente, une demande vague) pour valider chaque branche du routage sans attendre une vraie demande de chaque type. Nommer chaque branche du Switch selon le scénario qu'elle couvre, pas selon un numéro. Revisiter ce workflow après les premières semaines d'usage réel : les critères de qualification posés au départ sont presque toujours à ajuster une fois confrontés à de vraies demandes.

### Ce que cet atelier illustre du module

Cette mise en situation mobilise le trigger Webhook (section 1), la manipulation de données (chapitre 2), potentiellement un sous-workflow si la qualification est réutilisée ailleurs (chapitre 4), et la gestion d'erreur (chapitre 5) : la preuve que ces briques, séparées pour l'apprentissage, se combinent toujours ensemble sur un cas réel.

**Points clés**
- Un workflow de qualification commerciale combine trigger, normalisation, qualification, routage, et gestion d'erreur
- Ne jamais laisser un Error Trigger absent sur ce type de workflow : perdre silencieusement une demande entrante est le pire scénario
- Les critères de qualification posés au départ sont presque toujours à ajuster après les premières semaines d'usage réel

---

## Questions pour les apprenants

### Compréhension
1. Quelles sont les deux causes les plus fréquentes d'échec d'un HTTP Request, et comment les prévenir ?
2. À quoi servent les expressions `{{ }}` dans n8n ?
3. Pourquoi un fichier binaire peut-il "disparaître" après un nœud Merge, sans erreur visible ?
4. Qu'est-ce qui distingue un appel de sous-workflow en mode "each" d'un appel en mode "all" ?
5. Cite les 3 mécanismes de gestion d'erreur vus dans ce chapitre, et leur usage respectif.

### Réflexion
6. Reprends le workflow de qualification commerciale de l'atelier : propose un critère de qualification adapté à une demande reçue pour Chatllow, différent de ceux donnés en exemple.
7. Un sous-workflow fonctionne parfaitement depuis 3 mois, puis casse dès qu'un nouveau workflow l'appelle avec une donnée légèrement différente. Quel principe du chapitre 4 aurait évité ça ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : authentification mal configurée et pagination non gérée ; prévenir en lisant la doc de l'API et en vérifiant la credential dédiée avant de configurer à la main
- Q2 : référencer dynamiquement une donnée produite par un autre nœud, plutôt que taper une valeur fixe
- Q3 : un Merge mal configuré peut conserver le `$json` des deux branches mais perdre le `$binary` de l'une d'elles
- Q4 : "each" appelle le sous-workflow une fois par élément de la liste, "all" l'appelle une seule fois avec la liste entière
- Q5 : Continue on Fail (le workflow continue malgré l'échec d'un nœud), Retry on Fail (retente automatiquement, pour une erreur transitoire), Error Trigger (workflow séparé déclenché sur échec, pour centraliser la notification)
- Q6 : pas de réponse unique, évaluer la pertinence du critère proposé par rapport à un vrai scénario Chatllow
- Q7 : définir des entrées typées (ce que le sous-workflow attend précisément), plutôt que de supposer implicitement la structure reçue
