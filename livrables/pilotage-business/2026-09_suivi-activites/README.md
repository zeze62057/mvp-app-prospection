# Suivi de tes 3 activités

Système de pilotage centralisé pour Chatllow, Vivier IA et Longrich, construit sur le principe vu au Module 1 (chapitre "Gérer votre propre business") : un seul endroit pour voir les trois activités, plutôt que trois suivis séparés et déconnectés.

## Contenu de ce dossier

- `facturation.md` — un tableau unique pour les trois activités (activité, client, montant, statut, date). Toute facturation passe par ce fichier, peu importe l'activité.
- `kpis-chatllow.md` — suivi hebdomadaire du cabinet de conseil IA (prospection, closing)
- `kpis-vivier-ia.md` — suivi hebdomadaire de l'école (leads, inscriptions, contenu)
- `kpis-longrich.md` — suivi hebdomadaire du marketing de réseau (recrutement, formation, ventes)

Chaque tableau a une ligne par semaine, jamais un total unique qui écrase l'historique. Ça permet de voir une tendance (une activité qui décroche) plutôt qu'une photo figée.

## Comment mettre à jour ces fichiers

Le plus simple : donne l'info brute à Claude Code et demande-lui de l'ajouter à la bonne ligne du bon fichier. Par exemple :

```
Cette semaine sur Chatllow : 12 prospects contactés, 3 rendez-vous obtenus,
1 proposition envoyée, 0 client signé. Ajoute une ligne à kpis-chatllow.md.
```

```
J'ai facturé 800 000 GNF à [client] pour Chatllow aujourd'hui, statut facturé.
Ajoute-le à facturation.md.
```

D'autres prompts prêts à l'emploi sont dans `livrables/ecole/ecosysteme-ia/2026-09_entrepreneur-academie-module-1/04-quotidien-prompts.md` (Chapitre 3).

## Comment relire le suivi

Une fois quelques semaines de données accumulées, demande une lecture transversale, par exemple :

```
Regarde kpis-chatllow.md, kpis-vivier-ia.md et kpis-longrich.md.
Y a-t-il une activité dont les chiffres décrochent sur les 3 dernières
semaines ? Donne-moi un résumé en 3 lignes, une par activité.
```

## Statut

Tableaux vides, prêts à être remplis. Structure à ajuster librement si une colonne manque ou si une activité a besoin d'indicateurs différents, ce sont des templates de départ, pas une structure figée.
