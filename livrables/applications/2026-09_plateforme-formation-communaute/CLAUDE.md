# CLAUDE.md — Vivier Academies

Ce fichier guide Claude Code pendant la construction réelle de ce projet. Le cadrage complet (objectif, cible, décisions, points ouverts) est dans `CADRAGE.md`, à lire en entier si un doute apparaît : ce fichier n'en est qu'un résumé opérationnel, pas un remplacement.

## Qui et pourquoi

Projet de Zézé Bilivogui. Vivier Academies est la plateforme qui héberge plusieurs formations de Zézé, chacune dans son propre **espace** (contenu + communauté gratuite + communauté payante + page individuelle de progression). Les deux premiers espaces prévus : **Vivier IA** (écosystème Claude, construit en premier) et **Bâtisseur Pro** (marketing de réseau, générique, ne jamais afficher "Longrich").

## Ce qui ne se discute pas sans repasser par un cadrage

- **Une seule plateforme, espaces génériques** : ne jamais coder une séparation Vivier IA / Bâtisseur Pro en dur. Un espace est un concept réutilisable (un identifiant, des données et une communauté filtrées par cet identifiant), pensé pour qu'un futur troisième espace s'ajoute sans réécrire l'architecture.
- **Ordre de construction** : le trio complet (communauté gratuite → communauté payante → page individuelle) se construit intégralement pour Vivier IA avant de toucher à Bâtisseur Pro.
- **Répartition produit / automatisation** : les comptes, le contenu, les communautés et la page individuelle sont dans le produit (Claude Code). Le passage paiement Mobile Money → activation de compte est orchestré par n8n, jamais géré directement dans le produit.
- **Approbation manuelle** : uniquement pour rejoindre la communauté gratuite. L'accès à la formation payante reste automatique dès le paiement reçu, jamais soumis à validation manuelle.
- **Paiement unique, jamais en tranches** (tranché le 2026-09-14) : un seul versement Mobile Money par formation, une seule activation. Ne jamais construire de suivi de versements partiels sans un nouveau cadrage explicite.
- **Prix modifiable par un admin, à tout moment** (tranché le 2026-09-14) : le prix de chaque espace est un réglage administrable, jamais une valeur codée en dur dans le produit.
- **Outil admin "créer une nouvelle formation"** (tranché le 2026-09-14) : un bouton en libre-service pour que Zézé crée lui-même un nouvel espace avec les mêmes paramètres structurels que les espaces existants, sans redemander de développement à chaque fois. À construire dès la V1, même si le premier usage réel n'arrive qu'au 3e espace.
- **Priorité** : accès fiable au contenu avant la communauté payante. Construction incrémentale voulue par Zézé, pas de gros lot monolithique.
- **Approbation manuelle bloquante uniquement pour la communauté gratuite** : le reste du parcours (accès payant) ne dépend jamais d'une validation humaine.

Nuance sur l'ordre de construction : la maquette peut couvrir Bâtisseur Pro par anticipation (deux vitrines déjà dessinées), ce n'est qu'un exercice visuel. La **construction réelle** (code) de Bâtisseur Pro reste après celle de Vivier IA, sans exception.

## Maquette et identité visuelle

Maquette cliquable dans `maquette/` (8 fichiers `.dc.html` + `canvas.json`), publiée sur https://claude.ai/code/artifact/ee58a73a-d593-4750-9fad-df10a83b9cfb.

Écrans : `Main` (vitrine Vivier IA), `Communaute` (communauté gratuite), `Tunnel` (paiement), `Progression` (page individuelle élève), `CommunautePayante`, `Prompts` (bibliothèque de prompts), `BatisseurProFormation` et `BatisseurProReseau` (deux premières vitrines Bâtisseur Pro, angles différents).

Fonctionnalités notables déjà dans la maquette, à ne pas oublier en construction : badge et recrutement "Expert" dans la communauté payante, lead magnets sur les vignettes vidéo (communauté gratuite et payante), formulaire pour qu'un élève poste lui-même un témoignage (page de progression), bandeau d'offre de lancement sur la vitrine.

Palette reprise de l'identité Vivier IA : encre `#113832`, sarcelle `#2B8C82` / `#5FC7B8`, corail `#FF7A4D`, fond clair `#F2F7F5`.

Typographie de la maquette : **Fraunces** (titres) + **Public Sans** (texte courant) + **Space Mono** (détails techniques, terminal). Point non tranché à ce jour : cette typographie diffère de celle du reste de la marque Vivier IA (logo et decks de cours en Unbounded + Manrope). Ne pas supposer que l'un des deux systèmes typographiques a remplacé l'autre tant que Zézé n'a pas explicitement tranché lequel s'applique où.

## Décisions de fond, toutes tranchées ou écartées au 2026-09-14

Toutes les idées de fond notées pendant la maquette ont été cadrées. Rien n'attend plus de décision de ce type ; seuls des détails d'exécution technique restent à préciser en construction (voir `CADRAGE.md` section 9).

**Écarté le 2026-09-14** : l'idée que les prospects puissent créer leur propre communauté sur la plateforme. Trois lectures possibles avaient été proposées à Zézé (système d'ambassadeurs façon Kora, sous-groupes internes à la communauté Vivier IA, ou vrai statut de créateur multi-tenant), il a préféré la retirer plutôt que de trancher pour l'instant. Ne pas la reproposer sans qu'il la relance lui-même.

**Le paiement en plusieurs tranches a aussi été écarté**, et le prix admin ainsi que l'outil de création de formation ont été tranchés (voir "Ce qui ne se discute pas sans repasser par un cadrage" ci-dessus).

## Stack technique

**Tranchée le 2026-09-14** : Next.js (React) + Supabase (Postgres, Auth, RLS, Storage). Contrairement à Kora (`2026-09_app-prospection-mlm`, statique HTML/JS + Supabase), un vrai framework est justifié ici par la taille réelle du produit (communautés, panneau admin, architecture à espaces génériques, page de progression).

**Vidéos** : deux sources à supporter, embed YouTube (simple, pour le contenu déjà utilisé en prospection) et upload direct sur la plateforme. Pour les vidéos uploadées, commencer avec Supabase Storage + lecteur vidéo natif (pas de service de streaming spécialisé type Mux/Cloudflare Stream en V1, ça se justifie seulement à un vrai volume, à migrer plus tard si besoin).

## Contraintes connues

- Paiement Mobile Money (Orange Money, MTN Money), marché guinéen
- Version mobile requise dès la V1, pas une évolution ultérieure
- Lecture vidéo intégrée requise dès la V1
- Exigence esthétique explicite : la plateforme est pensée pour être largement promue, le soin visuel compte directement pour l'acquisition

## Avant toute manipulation technique réelle

Annoncer le prompt (contexte, objectif, périmètre, autonomie) avant de construire ou modifier quelque chose de structurant, et attendre la validation de Zézé. Pour toute installation ou configuration touchant un vrai compte ou service externe (Mobile Money, hébergement, etc.), guider étape par étape en direct, jamais une liste à exécuter seul.
