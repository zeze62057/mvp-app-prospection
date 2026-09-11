# Générateur d'audit IA — Chatllow

Outil interne pour produire, en rendez-vous ou juste après, un compte-rendu d'audit IA structuré et professionnel à partir d'informations recueillies sur une entreprise prospect.

## But

Aider à démontrer la valeur de Chatllow en rendez-vous commercial : remplir un court formulaire pendant ou juste après l'échange avec un prospect, obtenir un rapport structuré prêt à envoyer, sans repartir d'une page blanche à chaque fois.

## Prérequis

Aucun. Fichier HTML autonome, aucune installation, aucune dépendance.

## Comment lancer

Ouvrir `index.html` dans un navigateur. Rien d'autre à faire.

## Statut

V1 : front-end statique uniquement. Formulaire, génération du rapport dans la page, impression navigateur (Ctrl+P / Cmd+P) pour obtenir un PDF. Pas de sauvegarde, pas de base de données, pas de branchement Notion à ce stade (voir `⚠️ À valider` ci-dessous).

## ⚠️ À valider avec Zézé

- Charte graphique Chatllow : ce prototype utilise une palette bleu/gris sobre par défaut, aucune charte officielle Chatllow n'existe dans ce workspace à ce jour. À remplacer si une charte existe déjà ou est créée.
- Faut-il sauvegarder les audits générés quelque part (Notion, fichier local) plutôt que de les regénérer à chaque fois ?
- Les champs du formulaire sont un premier jet, à ajuster selon ce qui est réellement utile en rendez-vous.
