# Prompt Claude Design, MVP App Prospection MLM

> Livrable produit le 2026-09-07. À copier-coller dans Claude Design.
> Contexte : application de prospection en marketing de réseau pour BONJOUR et sa
> lignée de filleuls. Base de données Supabase. Trois écrans à générer.

---

Conçois le design de trois écrans d'une application web de prospection pour le
marketing de réseau, sur un seul canvas organisé en sections.

## Concept

Un agent commercial gère un portefeuille de prospects. Chaque prospect avance dans
un pipeline à sept étapes, de la prise de contact jusqu'au closing. L'agent suit
l'historique de ses échanges avec chaque prospect. En parallèle, une page publique
présente l'opportunité et capte de nouveaux prospects via un formulaire, qui entrent
automatiquement dans le pipeline au statut "Nouveau".

## Pipeline de statuts, à afficher partout où un statut apparaît

1. Nouveau
2. Contacté
3. Dans le tunnel
4. Intéressé
5. En négociation
6. Closé gagné
7. Closé perdu

Chaque statut a son badge de couleur, cohérent d'un écran à l'autre. "Closé gagné"
en vert, "Closé perdu" en rouge ou gris, les cinq autres en dégradé de progression.

## Cible et contraintes

- Utilisateurs : agents de marketing de réseau, pas des experts techniques.
- Interface en français.
- Marché Guinée et Afrique de l'Ouest francophone. Trafic surtout sur smartphone Android, connexions parfois lentes.
- Priorité mobile pour la landing page publique. Les tableaux de bord agent sont pensés desktop d'abord, mais doivent rester lisibles sur mobile.

## Direction visuelle

Moderne et épuré, proche de Shopify et Stripe. Beaucoup de blanc, espaces généreux,
cartes à coins arrondis, ombres douces. Une seule couleur d'accent, le reste en gris
neutres et texte quasi noir. Typographie sans-serif nette, titres en gras.
Iconographie linéaire simple. Composants cohérents et réutilisables sur tous les
écrans : barre de navigation, carte prospect, badges de statut, boutons primaire et
secondaire, champs de formulaire, cellule de timeline. Contrastes et tailles de
texte accessibles.

## Écrans à produire

### Section A. Tableau de bord agent (desktop en priorité, plus une variante mobile)

- En-tête : nom de l'agent connecté (BONJOUR), bouton primaire "Ajouter un prospect".
- Bandeau de compteurs : un compteur par étape du pipeline (nombre de prospects dans chaque statut).
- Barre d'outils : champ de recherche, filtre par statut.
- Liste des prospects de l'agent : pour chaque ligne, nom du prospect, moyen de contact, badge de statut visible, date du dernier contact, indication si le prospect vient du formulaire public ou d'un ajout manuel.
- État vide : message et bouton "Ajouter un prospect" quand la liste est vide.

### Section B. Vue détail d'un prospect (desktop en priorité, plus une variante mobile)

- En-tête : nom du prospect, badge de statut courant, sélecteur permettant de changer le statut vers l'une des sept valeurs.
- Bloc informations de contact : téléphone, email.
- Bloc historique de suivi : timeline verticale antéchronologique qui mélange les interactions (appel, message, rendez-vous, relance, note) et les changements de statut, chacun horodaté et attribué à un agent.
- Bouton "Ajouter une interaction" ouvrant un formulaire court : type d'interaction, texte libre.

### Section C. Landing page publique, tunnel de capture (mobile en priorité, plus une variante desktop)

- Hero : accroche sur l'opportunité de marketing de réseau, visuel, bouton qui fait défiler vers le formulaire.
- Bloc bénéfices : trois à quatre arguments courts.
- Section "Comment ça marche" en trois étapes.
- Formulaire de capture : nom, téléphone, email, bouton "Être recontacté". Note de design : la soumission crée un prospect au statut "Nouveau" côté application.
- Écran ou état de confirmation après envoi : message de remerciement, prochaine étape annoncée.

## Contenu réaliste à utiliser

- Agent connecté : BONJOUR.
- Prospects : Fatoumata Diallo, Ibrahima Barry, Aïssatou Camara, Mamadou Sylla, Kadiatou Bah.
- Exemples d'interactions : "Appel passé, pas de réponse", "Message WhatsApp envoyé avec la vidéo de présentation", "Rendez-vous fixé samedi 15h".
- Exemples de dates de dernier contact : il y a 2 jours, il y a 1 semaine.
- Nom de l'application : remplace [NOM] par un nom court et mémorisable.

## Format de sortie

Un canvas unique, une zone par section (A, B, C). Artboards desktop en 1440 de large
pour les sections A et B, artboards mobile en 390 de large pour la section C et pour
les variantes mobile de A et B. Ajoute une petite planche de composants et de
couleurs : les sept badges de statut, boutons, champs de formulaire, une cellule de
timeline.

---

## ⚠️ À valider

- **Tableau de bord : liste ou kanban.** Le brief demande une "liste de ses prospects avec statut visible". Faut-il une simple liste ou tableau, ou une vue kanban avec une colonne par statut et des cartes déplaçables ? Le prompt part sur une liste avec filtres.
- **Charte graphique.** Réutiliser l'accent vert du projet e-commerce de Zézé, ou définir une identité visuelle propre à l'app de prospection ? Le prompt laisse la couleur d'accent ouverte.
- **Écrans de compte.** Faut-il maquetter la connexion et l'inscription de l'agent, ou est-ce hors périmètre du design à ce stade ?
- **Nombre de landing pages.** Une seule page publique, ou une par agent avec un contenu personnalisable ?
- **Champs du formulaire public.** Le prompt reprend nom, téléphone, email. À confirmer, en cohérence avec les champs de contact du schéma.
- **Vue équipe.** Faut-il, dans la maquette, une vue agrégée pour un chef de lignée qui voit les prospects de sa downline, ou seulement la vue d'un agent sur son propre portefeuille ?
- **Détail des bénéfices et étapes de la landing.** Le contenu marketing exact (arguments, wording de l'accroche) n'est pas fourni. Le prompt demande des placeholders réalistes à remplacer.
