# Projet 1.2 : règles pour un agent qui lit du contenu extérieur

Pour **un agent ou une automatisation qui est la vôtre**. Une page par agent. Aucune valeur secrète.

## 1. D'où vient le contenu extérieur ?

Listez tout ce que l'agent lit et que vous n'avez pas écrit vous-même.

| Source | Qui peut y écrire ? | Exemple |
|---|---|---|
| (exemple) pages web trouvées par une recherche | n'importe qui | article piégé |
|  |  |  |
|  |  |  |

Sources typiques : pages web, e-mails reçus, documents envoyés par un client, résultats d'un outil, fichiers téléchargés, messages de formulaire.

## 2. Que peut faire l'agent ?

| Accès de l'agent | Nécessaire ? (oui/non) | Si un texte caché le détournait, le pire serait... |
|---|---|---|
| Lire mes fichiers |  |  |
| Écrire ou modifier des fichiers |  |  |
| Lancer des commandes |  |  |
| Envoyer des messages ou e-mails |  |  |
| Écrire dans un outil (base de données, Notion, réseaux sociaux) |  |  |
| Accéder à des clés ou mots de passe |  |  |

Règle : retirez tout accès marqué « non nécessaire ». Une injection réussie ne peut pas utiliser un accès qui n'existe pas.

## 3. Mes règles

- [ ] Le contenu extérieur est traité comme **des données**, jamais comme des ordres. Cette règle est écrite dans les consignes de l'agent.
- [ ] Les actions à risque (envoi, publication, suppression, paiement) demandent **mon accord** avant d'être faites.
- [ ] L'agent qui lit le web n'a pas accès à mes secrets ni à mes fichiers privés.
- [ ] Je relis ce que l'agent produit avant de le publier.
- [ ] J'ai testé mon agent avec la page de la démo 1.2 et noté le résultat.

## 4. Mon test

| Date | Contenu piégé utilisé | L'agent a obéi ? | Signalé à l'utilisateur ? | Ce que je change |
|---|---|---|---|---|
|  |  |  |  |  |

**Livrable** : cette page remplie pour un de vos agents.
