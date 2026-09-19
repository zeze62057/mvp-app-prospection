# Portail Entrepreneur Académie

Portail de navigation public pour les deux parcours d'Entrepreneur Académie : Écosystème IA et Marketing de réseau.

## But

Donner une vue d'ensemble des deux parcours et de leurs modules, avec un statut clair (disponible en aperçu, verrouillé après paiement, ou pas encore rédigé), et capter l'intérêt de visiteurs qui veulent un accès anticipé.

## Prérequis

Aucun. HTML/CSS/JS statiques.

## Comment lancer

Ouvrir `index.html` dans un navigateur.

## Arborescence

```
index.html
assets/
├── css/styles.css   # tous les styles, partagés si d'autres pages s'ajoutent
├── js/main.js       # onglets, modal de déblocage, formulaire d'intérêt
└── images/          # vide pour l'instant, prêt à recevoir des visuels
```

Convention pour toute future page : un fichier `.html` à la racine par page, qui réutilise `assets/css/styles.css` et `assets/js/main.js` (à découper en plusieurs fichiers CSS/JS si un jour un seul devient trop gros).

## Statut

V1 : portail de navigation statique, sans compte utilisateur, sans système de paiement réel. Les modules déjà rédigés (Module 1 Écosystème Claude, les 8 parties du programme Marketing de réseau, le module croisé) affichent leur sommaire réel, mais le contenu complet des leçons n'est pas exposé publiquement ici : c'est délibéré, tant qu'aucun système de paiement n'est branché, pour ne pas donner un accès gratuit à du contenu qui doit être payant.

## ⚠️ À valider avec Zézé

- Quels modules doivent rester réellement gratuits en aperçu (le Module 1 est affiché "Disponible" par défaut ici, à confirmer) ?
- Système de paiement à brancher plus tard (Stripe, mobile money, autre) et système de compte élève pour donner l'accès réel une fois payé.
- Faut-il exposer un extrait (1 chapitre gratuit par module) plutôt qu'un simple résumé, pour donner un avant-goût plus concret ?
