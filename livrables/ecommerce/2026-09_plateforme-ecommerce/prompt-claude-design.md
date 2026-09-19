# Prompt Claude Design, plateforme e-commerce multi-vendeurs

> Livrable produit le 2026-09-06. A copier-coller dans Claude Design.
> Contexte : marketplace bien-etre pour la Guinee et l'Afrique de l'Ouest, avec creation de boutiques pour vendeurs et distributeurs Longrich.

---

Conçois le design complet d'une plateforme e-commerce multi-vendeurs (marketplace + créateur de boutiques), sur un seul canvas organisé en sections.

## Concept
Plateforme qui a deux faces :
1. Une marketplace grand public où les acheteurs parcourent et achètent des produits de bien-être.
2. Un outil qui permet à n'importe qui (particulier, distributeur, petite entreprise) de créer sa propre boutique en ligne en quelques minutes et de vendre sur la marketplace.
Le propriétaire de la plateforme a lui-même une boutique et gère l'ensemble via un back-office admin.
Angle spécifique : beaucoup de vendeurs sont des distributeurs d'un réseau de vente directe (type Longrich), donc chaque distributeur a sa boutique personnelle, un lien de parrainage et un suivi de commissions.

## Cible et contraintes marché
- Marché principal : Guinée et Afrique de l'Ouest francophone. Interface en français.
- Trafic très majoritairement sur smartphone Android, connexions parfois lentes. Priorité au mobile pour la marketplace et la landing, desktop pour les dashboards.
- Moyens de paiement à afficher : Orange Money, MTN MoMo, et paiement à la livraison. Carte bancaire en option secondaire.
- Prix affichés en francs guinéens (GNF), exemples : 45 000 GNF, 120 000 GNF, 850 000 GNF.
- Livraison Conakry (Kaloum, Ratoma, Matam) et régions (Kindia, Kankan, N'Zérékoré).

## Direction visuelle
Moderne et épuré, style proche de Shopify et Stripe. Beaucoup de blanc, espaces généreux, cartes à coins arrondis, ombres douces et discrètes. Une seule couleur d'accent, un vert bien-être (autour de #1CA66B), le reste en gris neutres et texte quasi noir. Typographie sans-serif nette, titres en gras. Iconographie linéaire simple. Composants cohérents et réutilisables sur tous les écrans : barre de navigation, carte produit, badges de statut, boutons primaire et secondaire, champs de formulaire, tableaux. Contrastes et tailles de texte accessibles.

## Écrans à produire

### Section A. Storefront acheteur (maquettes mobile en priorité, plus desktop pour l'accueil et la fiche produit)
- Accueil marketplace : barre de recherche, catégories bien-être, produits populaires, boutiques en vedette, bandeau de réassurance (paiement mobile money, livraison, retours).
- Page catégorie et résultats de recherche : filtres (catégorie, prix, boutique, note), tri, grille de produits.
- Fiche produit : galerie photos, prix et variantes, encart vendeur (nom de boutique, note, lien vers la boutique), boutons ajouter au panier et acheter, description, avis clients, produits similaires.
- Vitrine publique d'une boutique vendeur : bannière, logo, présentation, note globale, catalogue du vendeur, bouton contacter.
- Panier.
- Tunnel de commande : adresse de livraison, choix du mode de paiement (Orange Money, MTN MoMo, paiement à la livraison), récapitulatif, écran de confirmation de commande.

### Section B. Dashboard vendeur
- Onboarding création de boutique : nom, logo, description, catégorie, coordonnées, numéro mobile money pour recevoir les paiements.
- Vue d'ensemble : chiffre d'affaires du mois, commandes en attente, produits actifs, note moyenne, graphique des ventes sur 30 jours.
- Gestion des produits : liste avec stock et statut, écran d'ajout ou d'édition d'un produit (photos, prix, stock, variantes, catégorie).
- Commandes : liste avec statuts (à préparer, expédiée, livrée), vue détail d'une commande.
- Personnalisation de la vitrine : bannière, couleur, mise en avant de produits.
- Espace distributeur : lien de parrainage à partager, liste des filleuls, commissions du mois, niveau atteint.

### Section C. Admin plateforme
- Tableau de bord global : volume d'affaires total, nombre de boutiques, commandes, commissions générées, courbe de croissance.
- File de validation des nouvelles boutiques à approuver ou refuser.
- Liste des vendeurs et boutiques avec filtres et statut.
- Commissions et versements : règles de commission, historique des paiements aux vendeurs.
- Litiges et signalements.

### Section D. Landing d'inscription vendeur
- Hero avec accroche du type "Ouvre ta boutique en ligne en 5 minutes" et bouton d'inscription.
- Bénéfices clés : encaissement par mobile money, aucune compétence technique, visibilité sur la marketplace.
- Fonctionnement en 3 étapes.
- Témoignages de vendeurs et de distributeurs.
- Tarifs et commission de la plateforme.
- FAQ.
- Bloc d'appel à l'action final.

## Contenu réaliste à utiliser
Boutiques : "Bien-être Conakry", "Santé Nature Kankan", "La Boutique de Mariama".
Produits : thé détox, dentifrice aux herbes, savon exfoliant, sérum visage, ceinture chauffante lombaire, complément alimentaire, matelas énergétique.
Clients : Fatoumata, Ibrahima, Aïssatou, Mamadou.
Nom de la plateforme : remplace [NOM] par un nom court et mémorisable.

## Format de sortie
Un canvas unique, une colonne ou une zone par section (A, B, C, D). Artboards desktop en 1440 de large et artboards mobile en 390 de large pour les écrans marketing et acheteur. Montre aussi une petite planche de composants et de couleurs.

---

## Notes d'utilisation

- Périmètre large. Si Claude Design cale, traiter les sections une par une, en commençant par A (storefront) et D (landing).
- Nom de la plateforme encore à choisir. Pistes courtes : Baraka, Longa, Yelen, Soko, Fasa.
