# Ateliers pratiques

> Cinq ateliers qui appliquent concrètement les principes des sections précédentes, sur des cas réels transposables à ton activité.

## Atelier 1 : Paramétrer les LLM

### Ce qu'il faut vérifier avant tout usage professionnel d'un fournisseur IA

Chaque fournisseur (Anthropic, OpenAI, Google, vus au Module 3, section 3) a sa propre politique sur l'usage des données envoyées : certains n'utilisent jamais les données de l'API pour entraîner leurs modèles par défaut (c'est le cas d'Anthropic sur son API), d'autres ont des politiques différentes selon l'offre choisie (gratuite vs professionnelle). Vérifier cette politique précise avant tout usage avec des données client est un réflexe non négociable, pas un détail secondaire.

### Le message système comme premier filtre de conformité

Au-delà de la politique du fournisseur, le message système (Module 3, section 4) peut lui-même poser une contrainte explicite : interdire à l'IA de répéter ou de stocker une information sensible reçue dans la conversation, demander de signaler une donnée qui semble trop sensible pour le traitement prévu plutôt que de la traiter silencieusement.

### Installation pratique

**Vérifier la politique de rétention de données d'un fournisseur**
1. Pour Anthropic : consulter la page de politique de confidentialité de la Console API (console.anthropic.com), section usage des données.
2. Repérer précisément si l'offre utilisée entraîne ou non les modèles sur les données envoyées, et pendant combien de temps les données sont conservées avant suppression.
3. Documenter ce point dans le brief du projet (section 3 de ce module), pour qu'il soit vérifié une fois, pas redécouvert à chaque nouveau projet.

**Points clés**
- Vérifier la politique de rétention et d'entraînement de chaque fournisseur avant tout usage avec des données client
- Le message système peut lui-même poser une contrainte explicite de confidentialité
- Documenter ce point une fois dans le brief du projet, pas le redécouvrir à chaque nouveau projet

---

## Atelier 2 : Nettoyer la donnée

### Ce que "nettoyer" veut dire dans ce contexte

Nettoyer une donnée avant de l'envoyer à un LLM signifie retirer ou masquer les informations identifiantes qui ne sont pas strictement nécessaires à la tâche demandée, principe direct de la minimisation vue en section 1 de ce module.

### La technique de l'anonymisation par substitution

Remplacer un nom réel par un identifiant générique ("Client A" plutôt que le vrai nom), une adresse précise par une zone géographique large, avant l'envoi au modèle, puis remapper le résultat vers les vraies informations une fois la réponse obtenue. Cette technique protège la donnée pendant le traitement IA lui-même, l'étape la plus exposée.

### Installation pratique

**Nettoyer un jeu de données avant traitement IA**
1. Identifier les colonnes ou champs contenant une donnée identifiante (nom, email, téléphone) dans le jeu de données à traiter.
2. Avec un nœud Set (Module 2, section 2) dans n8n, remplacer ces champs par un identifiant généré (un simple compteur ou un UUID), tout en gardant une table de correspondance séparée et sécurisée.
3. Envoyer uniquement la version anonymisée au nœud IA, puis remapper le résultat vers les vraies identités uniquement à la toute fin du workflow, dans un nœud isolé avec un accès restreint.

**Points clés**
- Nettoyer une donnée signifie retirer ou masquer ce qui n'est pas strictement nécessaire à la tâche, avant l'envoi au modèle
- L'anonymisation par substitution protège la donnée pendant l'étape la plus exposée (le traitement IA lui-même)
- Garder la table de correspondance séparée, avec un accès restreint, tout au long du workflow

---

## Atelier 3 : Traitement et évaluation de CV

### Le lien direct avec la solution déjà vue au Module 3

Cet atelier reprend la solution "Traitement des candidatures" (Module 3, section 9, chapitre 2), avec cette fois le prisme spécifique de la conformité : quelles données du CV peuvent être traitées, lesquelles doivent être ignorées ou masquées, et comment documenter les critères de tri pour pouvoir les justifier en cas de question.

### Ce qu'il faut exclure du traitement automatique

Une photo (source de biais liés à l'apparence), une date de naissance précise (source de biais lié à l'âge), une mention d'origine ou de situation familiale non pertinente pour le poste : ces éléments, même s'ils apparaissent sur le CV, ne devraient jamais entrer dans les critères de tri automatique, conformément au point de vigilance déjà soulevé au Module 3.

### Installation pratique

**Construire un pipeline de tri de CV conforme**
1. Un Information Extractor (Module 2, section 3) extrait uniquement les champs pertinents pour le poste : compétences, expérience, disponibilité.
2. Exclure explicitement de l'extraction les champs sensibles listés ci-dessus, même s'ils sont présents dans le document source.
3. Documenter les critères de classement utilisés dans une note accessible, pour pouvoir répondre à une question sur "pourquoi cette candidature a été écartée" si elle se pose un jour.

**Points clés**
- Cet atelier reprend la solution du Module 3 avec le prisme spécifique de la conformité
- Photo, date de naissance précise, origine ou situation familiale : à exclure systématiquement des critères de tri automatique
- Documenter les critères de classement permet de justifier une décision de tri si la question se pose

---

## Atelier 4 : Sécuriser un LLM en Cloud

### Les trois couches de sécurité à vérifier

**L'authentification** : une clé API dédiée par projet, jamais une clé partagée entre plusieurs usages différents (même principe que les credentials n8n, Module 2, section 1). **Le stockage de la clé** : jamais en clair dans un fichier de code ou un message, toujours en variable d'environnement (Module 2, section 5) ou dans un gestionnaire de credentials dédié. **Les accès** : limiter qui peut consulter ou modifier les identifiants de connexion à un fournisseur IA, pas seulement qui peut les utiliser.

### Le cas particulier d'un déploiement pour un client sensible

Pour un client CAC40 avec des exigences de confidentialité renforcées, certains fournisseurs proposent des offres avec engagement contractuel de non-rétention ou de traitement dans une zone géographique précise. Vérifier l'existence de cette option et son coût avant de s'engager sur un projet avec ce type d'exigence.

### Installation pratique

**Vérifier la configuration de sécurité d'une clé API existante**
1. Dans le dashboard du fournisseur (par exemple console.anthropic.com), vérifier qu'une clé API dédiée existe pour chaque projet, et non une clé unique réutilisée partout.
2. Vérifier que cette clé vit uniquement dans une variable d'environnement (fichier `.env.local` non commité, ou équivalent) et jamais dans un fichier suivi par Git, exactement la même discipline que pour les clés d'une base de données ou d'un service de paiement.
3. Révoquer immédiatement toute clé qui n'est plus utilisée par aucun projet actif, plutôt que de la laisser traîner.

**Points clés**
- Trois couches à vérifier : authentification dédiée par projet, stockage jamais en clair, accès restreint aux identifiants eux-mêmes
- Pour un client sensible, vérifier l'existence d'une offre avec engagement contractuel de non-rétention ou de zone géographique précise
- Révoquer une clé API inutilisée plutôt que de la laisser traîner, même discipline que pour toute credential

---

## Atelier 5 : Extraction d'informations pertinentes depuis une image

### Le cas d'usage : la vision multimodale au service de la conformité

Le Module 2 (section 3, chapitre 9) a introduit la capacité multimodale (vision, audio, PDF). Appliquée ici, cette capacité permet d'extraire uniquement l'information pertinente d'un document image (un justificatif, une pièce d'identité) sans stocker l'image source elle-même plus longtemps que nécessaire.

### Le principe : extraire puis supprimer, pas conserver par défaut

Une fois l'information pertinente extraite d'une image (par exemple, la date d'expiration d'un document, sans conserver le document entier), l'image source devrait être supprimée si elle n'a pas de raison légale ou contractuelle d'être conservée. Conserver systématiquement toutes les images par défaut, "au cas où", va à l'encontre du principe de minimisation vu en section 1.

### Installation pratique

**Extraire une information précise d'une image sans conserver le document source**
1. Envoyer l'image à un modèle multimodal avec un prompt précis sur l'information recherchée uniquement (par exemple "extrais uniquement la date d'expiration visible sur ce document, rien d'autre").
2. Stocker uniquement le champ extrait dans la base de données, jamais l'image elle-même par défaut.
3. Si l'image doit être conservée pour une raison précise (obligation légale, litige potentiel), la stocker séparément avec un accès restreint et une durée de conservation définie à l'avance, pas indéfiniment.

**Points clés**
- La vision multimodale permet d'extraire une information précise sans conserver le document source dans son entièreté
- Le principe : extraire puis supprimer, la conservation par défaut "au cas où" va à l'encontre de la minimisation
- Si une conservation est nécessaire, elle se fait avec un accès restreint et une durée définie à l'avance

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi vérifier la politique de rétention de données d'un fournisseur est-il un réflexe non négociable ?
2. Comment fonctionne la technique d'anonymisation par substitution ?
3. Cite 3 champs à exclure systématiquement d'un pipeline de tri de CV automatique.
4. Cite les 3 couches de sécurité à vérifier pour un LLM en cloud.
5. Quel est le principe à appliquer après extraction d'une information depuis une image ?

### Réflexion (synthèse de fin de module)
6. Choisis un des 5 ateliers et explique en une phrase comment tu l'appliquerais concrètement sur un projet réel de ton activité.
7. En repensant à l'ensemble du Module 4, quel réflexe te semble le plus facilement transformable en argument de vente face à un client CAC40 ?
