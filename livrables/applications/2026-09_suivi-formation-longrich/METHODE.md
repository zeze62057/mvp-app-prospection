# Comment ce projet a été construit

> Journal de méthode, rédigé pour montrer concrètement l'application du Module 1 (Écosystème Claude) sur un cas réel. Utile comme matériel pédagogique pour Entrepreneur Académie.

## Étape 1 — Plan

- **Objectif précis** : suivre la progression des distributeurs Longrich formés à l'IA (qui, sur quel module, à quelle date, avec quel niveau d'autonomie), vers l'objectif concret déjà fixé de 20 distributeurs formés.
- **Contexte** : à bien distinguer de Kora, qui gère la prospection des filleuls, pas le suivi de formation. C'est une vérification de périmètre similaire à celle faite au projet 1 (ne pas dupliquer ce qui existe déjà ailleurs dans le workspace, ni le confondre avec un outil au rôle voisin mais différent).
- **Périmètre** : stockage local dans le navigateur (localStorage) pour cette V1, pas de base partagée entre appareils ou personnes.
- **Emplacement** : `livrables/applications/`, outil interne réutilisable, pas une page publique.

## Étape 2 — Execute

Deux décisions de conception prises pendant la construction, et signalées explicitement plutôt que silencieuses :

**Le comptage des 20 distributeurs se fait sur des noms uniques, pas sur le nombre total de formations.** Un distributeur formé sur 2 modules compte une seule fois vers l'objectif. Ce choix découle directement de l'objectif tel que formulé dans `context/CONTEXT.md` ("former 20 distributeurs Longrich"), pas d'un nombre de sessions. C'est une application du chapitre "L'art de donner des instructions à Claude Code" côté inverse : interpréter fidèlement un objectif déjà donné, et le signaler pour validation plutôt que de trancher silencieusement.

**Un bouton d'export CSV a été ajouté, alors qu'il n'était pas demandé dans le plan initial.** Ce n'est pas un ajout de fonctionnalité gratuit : le localStorage a une limite connue et sérieuse (les données peuvent être perdues si le navigateur est vidé ou changé), et le chapitre "Ce que vous pouvez vendre" insiste sur le fait de ne jamais laisser un utilisateur dans une situation de risque non signalé. L'export CSV est le filet de sécurité minimal face à cette limite, pas une fonctionnalité de confort.

## Étape 3 — Validate

Même limite que les deux projets précédents concernant Playwright, avec un point de vérification supplémentaire propre à cet outil : le comportement de `localStorage` a été revérifié dans le code (lecture avec gestion d'erreur, écriture avec message d'alerte en cas d'échec), pour éviter qu'une perte de données silencieuse ne se produise sans que l'utilisateur en soit informé. C'est une application concrète du chapitre "Quand ça casse, debugger et vérifier" : anticiper le cas d'échec plutôt que de supposer que le stockage fonctionnera toujours.

## Ce que ce projet illustre du Module 1

- Section 2 (La Méthode) : interpréter fidèlement un objectif existant plutôt que d'en inventer un nouveau
- Section 3 (Maîtriser l'outil) : ne pas dupliquer un outil existant (Kora) qui a un rôle voisin mais différent
- Section 6 (Le Business) : signaler une limite technique réelle (localStorage) plutôt que de la laisser découvrir après coup, et proposer un filet de sécurité minimal (export CSV) en réponse
