---
name: approche-projet
description: >-
  Guide pour cadrer et dérouler un projet de bout en bout selon la méthode
  du workspace (cadrage, identité si besoin, maquette Claude Design,
  CLAUDE.md, gabarit à 4 éléments + cycle Plan/Execute/Validate, validation
  réelle, livraison, suivi, capitalisation), avec des variantes par type de
  projet (site vitrine, application ou SaaS, automatisation n8n, audit ou
  conseil Chatllow, formation, branding). Se déclenche quand Zézé démarre
  un nouveau projet ou demande explicitement "comment aborder ce projet",
  "quelle méthode pour ce projet", "aide-moi à cadrer ce projet", "lance la
  méthode d'approche de projet". La référence complète et à jour est
  livrables/cabinet/methode-approche-projet.md, ce skill n'en est que le
  déclencheur et le guide d'application.
---

# Skill : Approche Projet

## Mission

Aider Zézé à cadrer et dérouler n'importe quel projet de ce workspace selon une méthode cohérente, du cadrage initial jusqu'à la capitalisation en starter réutilisable. Se déclenche quand il démarre un nouveau projet, ou sur demande explicite.

## Comment utiliser ce skill

1. **Lis d'abord `livrables/cabinet/methode-approche-projet.md` en entier, à chaque déclenchement.** C'est la référence complète et à jour. Ce skill n'en est que le point d'entrée : ne jamais réciter une version mémorisée qui pourrait être obsolète si le fichier a évolué depuis.
2. **Identifie le type de projet** parmi ceux déjà couverts dans le fichier (site vitrine / landing page, application ou SaaS, automatisation n8n, audit ou conseil IA type Chatllow, formation ou contenu pédagogique, branding ou identité visuelle). Si le projet ne correspond clairement à aucun type existant, dis-le à Zézé et propose d'ajouter une nouvelle variante au fichier de référence plutôt que d'improviser silencieusement une méthode non documentée.
3. **Déroule le pipeline générique en l'adaptant** selon la variante identifiée : quelles étapes s'allègent, se renforcent, s'ajoutent, ou ne s'appliquent pas pour ce type précis de projet.
4. **Avance étape par étape avec Zézé, pas tout d'un coup** : le cadrage d'abord (poser les questions nécessaires plutôt que supposer), puis seulement ensuite identité et maquette si le projet en a besoin, puis CLAUDE.md, puis la construction tâche par tâche avec le gabarit à 4 éléments et le cycle Plan, Execute, Validate.

## Ce qui ne change jamais, quel que soit le type de projet

- Le cadrage avant l'exécution, et la validation réelle avant de considérer une tâche finie, ne se sautent jamais
- Le handoff à la livraison est la partie la plus souvent négligée sous la pression d'un délai ; il se traite avec le même soin que le reste
- La capitalisation en starter réutilisable ne se fait jamais en exposant une information confidentielle d'un projet ou d'un client précédent

## Faire évoluer la méthode

Si un nouveau type de projet récurrent apparaît, ou si une étape du pipeline générique s'avère mal adaptée à l'usage réel, propose à Zézé de mettre à jour `livrables/cabinet/methode-approche-projet.md` plutôt que de garder l'ajustement seulement dans la conversation en cours. Ce fichier reste la source de vérité ; ce skill doit toujours y renvoyer, jamais s'en détacher ni en diverger silencieusement.
