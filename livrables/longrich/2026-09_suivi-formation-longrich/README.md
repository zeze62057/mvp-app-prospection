# Suivi formation IA — Distributeurs Longrich

Outil interne pour suivre la progression des distributeurs Longrich formés à l'IA, vers l'objectif des 20 premiers distributeurs formés.

## But

Garder une trace claire de qui a été formé, sur quel module du programme, à quelle date, et avec quel niveau d'autonomie observé, plutôt que de le retenir de mémoire ou de le disperser dans des notes séparées.

## Prérequis

Aucun. Fichier HTML autonome, aucune dépendance.

## Comment lancer

Ouvrir `index.html` dans un navigateur.

## Statut

V1 : les données sont stockées dans le navigateur (localStorage), pas dans une base partagée. Un bouton d'export CSV permet de sauvegarder une copie régulièrement, en attendant un éventuel branchement à une vraie base de données (voir `⚠️ À valider`).

## ⚠️ Limite importante à connaître

Les données vivent uniquement dans le navigateur où tu les as saisies. Si tu vides les données de navigation, changes de navigateur, ou changes d'ordinateur, tu perds l'historique saisi ici, sauf si tu as exporté en CSV avant. Utilise le bouton d'export régulièrement tant qu'aucune base réelle n'est branchée.

## ⚠️ À valider avec Zézé

- Faut-il brancher cet outil à une vraie base de données (Supabase, comme Kora) pour ne plus dépendre du navigateur et pouvoir y accéder depuis plusieurs appareils ?
- Les 5 modules listés reprennent le skill `programme-ecosysteme-ia`. À ajuster si tu formes les distributeurs sur un contenu différent du programme complet (par exemple seulement les fondations, sans n8n).
- Faut-il un champ pour noter si le distributeur a effectivement commencé à utiliser l'IA dans son activité, au-delà de la formation suivie ?
