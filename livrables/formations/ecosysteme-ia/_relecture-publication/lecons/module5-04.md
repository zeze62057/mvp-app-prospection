# Aller plus loin

## Chapitre 1 : Data — scraping, enrichissement & nettoyage

### Quand People Database ne suffit plus

People Database (section 2, chapitre 2) couvre bien une recherche standard. Un besoin plus spécifique (un critère très précis non disponible dans l'outil, une source de données propriétaire à l'activité) demande alors du scraping ou un enrichissement externe, une étape plus avancée que la recherche intégrée de base.

### Le scraping, ce que c'est et ses limites

Le scraping extrait automatiquement des données publiques d'un site web (un annuaire professionnel, un site d'entreprise) pour construire une liste de prospects. Cette pratique doit respecter les conditions d'utilisation du site concerné et le RGPD (Module 4) sur les données personnelles collectées, ce n'est pas une zone sans règle sous prétexte que la donnée est publique.

### L'enrichissement, compléter une donnée partielle

Une liste de prospects avec seulement un nom et une entreprise peut être enrichie (trouver l'email professionnel, le poste exact, la taille de l'entreprise) via des outils dédiés qui croisent plusieurs sources, avant l'import dans Lemlist pour une campagne.

### Le nettoyage, la dernière étape avant utilisation

Une liste enrichie contient presque toujours des doublons, des emails invalides, ou des entrées incomplètes. Nettoyer avant l'envoi (dédupliquer, vérifier la validité des emails) protège directement la délivrabilité travaillée au chapitre 5 de la section 1 : envoyer à des adresses invalides en masse dégrade la réputation du domaine d'envoi.

### Le point de connexion avec n8n

Un workflow n8n (Module 2) peut automatiser tout ce pipeline : appeler un outil d'enrichissement via HTTP Request, dédupliquer avec un nœud dédié, vérifier la validité des emails, puis pousser la liste nettoyée directement dans Lemlist via son API, sans manipulation manuelle répétitive à chaque nouvelle campagne.

**Points clés**
- Le scraping et l'enrichissement vont au-delà de People Database quand un besoin plus spécifique se présente
- Le scraping doit respecter les conditions d'utilisation du site et le RGPD, la donnée publique n'échappe pas à ces règles
- Nettoyer une liste avant envoi (doublons, emails invalides) protège directement la délivrabilité déjà travaillée en section 1
- n8n peut automatiser tout ce pipeline, de l'enrichissement au nettoyage jusqu'à l'import dans Lemlist

---

## Questions pour les apprenants

### Compréhension
1. Dans quel cas le scraping ou l'enrichissement externe devient-il nécessaire, au-delà de People Database ?
2. Pourquoi le scraping de données publiques n'échappe-t-il pas au RGPD ?
3. Pourquoi nettoyer une liste avant l'envoi protège-t-il directement la délivrabilité ?
4. Comment n8n peut-il automatiser ce pipeline de bout en bout ?

### Réflexion (synthèse de fin de module)
5. En repensant à l'ensemble du Module 5, quelle étape (warm-up, séquence, personnalisation, ou data) te semble la plus déterminante pour le succès d'une campagne de prospection ? Pourquoi ?
