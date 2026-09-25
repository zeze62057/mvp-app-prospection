---
name: infographe-vivier
description: Produit des infographies aux couleurs de Vivier IA, en HTML/SVG rendu en PNG. Trois usages : A) résumé visuel d'une leçon ou d'une méthode pour les élèves, B) visuels réseaux (LinkedIn, TikTok, miniature YouTube), C) images de la plateforme Vivier Academies (vitrines, bannières). Se déclenche quand Zézé demande "fais une infographie", "un visuel pour cette leçon", "une miniature YouTube", "l'image de la vitrine", ou équivalent. Ne publie jamais rien. Ne remplace pas agent-infographe (posts LinkedIn dans Canva et Notion).
---

# Skill : Infographe Vivier IA

## Mission

Fabriquer des infographies fidèles à l'identité de Vivier IA, à partir d'un contenu réel (texte d'une leçon, brief de Zézé). Chaque visuel est construit en HTML/SVG à la taille exacte, rendu en PNG, puis regardé avant d'être montré.

Source de la charte : `livrables/identites-visuelles/2026-09_vivier-ia-identite-visuelle/README.md`. La relire si un doute apparaît.

## Charte

| Rôle | Valeur |
|---|---|
| Encre (texte, fonds sombres) | `#113832` |
| Teal | `#2B8C82`, ou `#5FC7B8` sur fond sombre |
| Accent (un seul par visuel) | corail `#FF7A4D` |
| Fond clair | `#F2F7F5` |
| Titres | Unbounded |
| Texte | Manrope |

Polices chargées depuis Google Fonts dans l'HTML. Les polices Fraunces, Public Sans et Space Mono sont celles de l'interface de la plateforme, pas des infographies (choix du 2026-09-25, à confirmer si Zézé tranche autrement).

Logo : la Clé (anneau et point d'accès). Extraire son SVG de `livrables/identites-visuelles/2026-09_vivier-ia-identite-visuelle/logo/Main.dc.html`. Ne jamais le redessiner, le déformer ni changer ses couleurs. Si l'extraction échoue, laisser la place vide et le dire.

## Ce qui ne change jamais

- Le texte vient de la leçon ou du brief de Zézé. Aucun chiffre, témoignage, prix, résultat ou fait inventé.
- Une infographie porte une seule idée. Phrases courtes, accents corrects, pas de tirets longs.
- Aucun visage ni personnage inventé, aucune fausse capture d'écran présentée comme réelle.
- Jamais le mot "Longrich" sur un visuel de Bâtisseur Pro.
- Aucune publication : ni sur la plateforme, ni sur un réseau social, ni dans Notion. Le skill livre des fichiers, Zézé décide de la suite.
- Ne jamais toucher à `agent-infographe`, à la base Notion "Posts rédigés" ni au kit Canva.

## Formats

| Usage | Format | Taille |
|---|---|---|
| A. Leçon | Portrait, ou paysage pour un schéma large | 1080 x 1350, ou 1600 x 900 |
| B. LinkedIn | Portrait | 1080 x 1350 |
| B. TikTok | Vertical | 1080 x 1920 |
| B. Miniature YouTube | Paysage | 1280 x 720 |
| C. Plateforme | Selon le code | Lire le code avant de produire |

Pour l'usage C : chercher dans `livrables/applications/2026-09_plateforme-formation-communaute/app/src` la taille et le chemin exacts attendus (par exemple `/vitrines/<espace>/hero.jpg`, dans `app/public/vitrines/`). Ne jamais deviner une taille. Ne pas écrire dans `app/public/` sans l'accord de Zézé : livrer d'abord dans le dossier des infographies.

## Déroulé

### 1. Brief, au gabarit à 4 éléments

Avant de construire, présenter à Zézé et attendre sa validation :

- **Contexte** : d'où vient le contenu (leçon, module, brief), pour quel public.
- **Objectif** : l'idée unique que l'infographie doit faire passer.
- **Périmètre** : usage (A, B ou C), format et taille, texte exact affiché, ce qui est exclu.
- **Autonomie** : ce que le skill fait seul (construire, rendre, corriger) et ce qui demande son accord.

Pour un ajustement mineur d'un visuel déjà validé, pas besoin de refaire tout le brief.

### 2. Construire

- Un seul fichier HTML autonome, à la taille exacte du format (`width` et `height` fixes sur le conteneur, marges de sécurité d'au moins 60 px).
- Fond clair `#F2F7F5` pour un visuel de leçon, fond encre `#113832` pour un visuel d'accroche réseau.
- Hiérarchie : un titre Unbounded, 3 à 5 blocs courts en Manrope, un seul accent corail. Contraste texte et fond suffisant, texte jamais sous 28 px sur un format 1080.
- Aucun texte dans une image raster : tout en HTML ou SVG.

### 3. Rendre en PNG et regarder

- Rendre avec le navigateur de test (outils Playwright) : ouvrir le HTML, régler la fenêtre à la taille exacte, capturer. Si l'ouverture directe d'un fichier local est refusée, le servir depuis un petit serveur local temporaire (à arrêter ensuite).
- Ouvrir le PNG obtenu et le regarder pour de vrai : texte coupé, débordement, police de repli, contraste, logo. Corriger puis refaire le rendu.
- Si le navigateur de test est indisponible, livrer l'HTML seul et le dire clairement. Ne jamais prétendre avoir vu un rendu qu'on n'a pas vu.

### 4. Livrer

Ranger dans `livrables/identites-visuelles/2026-09_vivier-ia-identite-visuelle/infographies/` :

- `lecons/`, `reseaux/` ou `plateforme/` selon l'usage
- `<nom-court>.png` et `<nom-court>.html` côte à côte

Terminer par un résumé court : usage, format, chemin des fichiers, ce qui a été vérifié à l'œil, ce qui ne l'a pas été, et les points d'alerte (police de repli, logo absent, taille à confirmer).
