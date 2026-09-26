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

- Rendre avec le navigateur de test (outils Playwright). Marche éprouvée le 2026-09-25 :
  1. Servir le dossier `infographies/` depuis un serveur local temporaire lié à `127.0.0.1` (par exemple `python -m http.server 8765 --bind 127.0.0.1`, en arrière-plan). L'ouverture directe d'un fichier local (`file://`) n'a pas été essayée.
  2. `browser_resize` à la taille exacte du format, puis `browser_navigate` vers l'adresse locale du HTML.
  3. Mesurer avec `browser_evaluate` avant de capturer : `document.documentElement.scrollHeight` et `scrollWidth` ne dépassent pas la taille du format, marge du bas d'au moins 60 px, plus petite taille de texte d'au moins 28 px, polices réellement chargées (`document.fonts`, statut `loaded`).
  4. `browser_take_screenshot` avec `filename` (chemin relatif à la racine du workspace), `type: png`, `scale: css`.
  5. Fermer le navigateur (`browser_close`) et arrêter le serveur temporaire.
- **La fenêtre doit être plus large que le visuel** (par exemple 1300 px pour un visuel de 1280 px) quand la page est plus haute que la fenêtre : la barre de défilement mange environ 15 px de largeur utile, et une capture d'élément de 1280 px sort alors avec une **bande blanche de 15 px à droite**. Constaté le 2026-09-26 sur 31 vignettes : les contrôles de dimensions ne le voient pas.
- Après l'export, **contrôler les quatre bords** de chaque fichier (les 20 dernières colonnes et lignes ne doivent pas être claires sur un visuel sombre) en plus des dimensions et des doublons, puis regarder une **grille de tous les fichiers** et une version **réduite à 168 px** pour la lisibilité.
- Pour un lot, une page qui affiche tous les visuels avec un identifiant chacun, et une capture d'élément par identifiant (`target: '#id'`), est plus fiable que de recharger la page pour chaque fichier. Les captures d'un même lot peuvent être lancées ensemble.
- Ajustement automatique d'un titre : le critère est **3 lignes au plus** dans la boîte (hauteur maximale, largeur avec 1 px de tolérance), calculé **une fois les polices chargées** (`document.fonts.load(...)`). Comparer la hauteur du contenu à la hauteur calculée de la boîte échoue toujours de 2 à 4 px à cause des arrondis d'interligne.
- Un `favicon.ico` en erreur 404 dans la console vient du serveur local : sans importance.
- Fixer `overflow: hidden` sur `html` et `body` pour éviter les barres de défilement dans le rendu.
- Ouvrir le PNG obtenu et le regarder pour de vrai : texte coupé, débordement, police de repli, contraste, logo. Corriger puis refaire le rendu. Le premier rendu d'une infographie déborde souvent de quelques dizaines de pixels : ne pas s'en fier avant la mesure.
- Si le navigateur de test est indisponible, livrer l'HTML seul et le dire clairement. Ne jamais prétendre avoir vu un rendu qu'on n'a pas vu.

### 4. Livrer

Ranger dans `livrables/identites-visuelles/2026-09_vivier-ia-identite-visuelle/infographies/` :

- `lecons/`, `reseaux/` ou `plateforme/` selon l'usage
- `<nom-court>.png` et `<nom-court>.html` côte à côte

Terminer par un résumé court : usage, format, chemin des fichiers, ce qui a été vérifié à l'œil, ce qui ne l'a pas été, et les points d'alerte (police de repli, logo absent, taille à confirmer).
