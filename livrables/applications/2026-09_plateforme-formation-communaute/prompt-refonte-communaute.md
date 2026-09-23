# Prompt : refonte de la zone de contenu des communautés Vivier Academies

Prompt prêt à l'emploi pour Claude Code, écrit à partir de la construction réelle menée le 2026-09-23 (structure fidèle à une capture de référence NovaPulse, charte graphique Vivier IA conservée). Réutilisable tel quel pour refaire ce travail ailleurs, ou pour l'adapter à un futur troisième espace.

---

## a) Contexte

Vivier Academies héberge plusieurs formations, chacune dans son propre espace (`espaces`, colonnes `slug`/`nom`). Deux espaces existent : `vivier-ia` et `batisseur-pro`. Chaque espace a une communauté gratuite et une communauté payante, servies par deux gabarits génériques partagés par tous les espaces :

- `src/app/(membre)/[espace]/communaute/page.tsx`
- `src/app/(membre)/[espace]/communaute-payante/page.tsx`

Ne jamais coder une séparation par espace en dur : tout passe par le slug chargé depuis la base.

Charte graphique déjà présente dans `src/app/globals.css` : encre `#113832`, sarcelle `#2B8C82` / `#5FC7B8`, corail `#FF7A4D`, fond clair `#F2F7F5`, fond carte blanc, police de titre Fraunces (`font-display`), police technique Space Mono (`font-mono`).

Une capture d'écran d'une autre plateforme (NovaPulse) sert de référence de mise en page uniquement. Son nom, son logo, ses couleurs (violet/rose, sidebar sombre) et ses textes ne doivent jamais être repris.

## b) Objectif

Refaire la zone de contenu des deux communautés (composer, filtres, fil de posts, colonne de droite) pour qu'elle suive fidèlement la structure de la capture, avec la charte graphique déjà en place. Le menu ou l'en-tête existant de l'application (barre d'onglets Communauté/Membres/À propos/etc.) reste inchangé.

## c) Comportement attendu

**Ordre du contenu principal** : barre d'écriture (composer) → pastilles de filtre par catégorie → fil de posts. Ne pas ajouter de barre de recherche à cet endroit : celle de la capture appartient à l'en-tête global de l'application, hors périmètre. La recherche réelle déjà existante dans le fil se place après les pastilles, juste avant la liste des posts.

**Composer** : avatar de l'utilisateur + zone de texte cliquable ("Partagez une idée, une question, une actualité..."), puis une rangée de boutons Photo / Vidéo / Fichier / Lien avec le bouton Publier aligné à droite. Seul Photo doit être réellement fonctionnel (branché sur l'upload d'image déjà existant). Vidéo, Fichier et Lien s'affichent avec la même apparence mais sont désactivés, avec un message "Bientôt disponible" au survol et au clic (fonctionne aussi au tactile).

**Pastilles de catégories** : "Tout" plus les catégories réelles de l'espace, en pilules. Ne pas inventer de code couleur par thème s'il n'existe pas déjà en base.

**Carte de post** : avatar, pseudo, badge de statut réel (Expert ou niveau), temps écoulé, catégorie du post. Un post épinglé affiche un bandeau "Épinglé" en ruban flottant au-dessus de la carte (chevauchant le bord supérieur), pas dans la ligne d'en-tête. Le texte du post occupe la largeur à gauche ; s'il a une image, elle apparaît en vignette carrée à droite du texte dans le fil (et repasse en pleine largeur sous le texte sur la page de détail du post). Ligne du bas : bouton like réel, nombre de commentaires réel (lien vers le post), lien "Lire la suite →" aligné à droite. Un menu "..." en haut à droite de la carte regroupe les actions de gestion : modifier/supprimer pour l'auteur du post, écrire à/signaler pour les autres membres, épingler/désépingler pour un admin. Un élément HTML natif (`<details>`/`<summary>`) suffit pour ce menu, pas besoin de nouvelle dépendance JS.

**Colonne de droite**, dans cet ordre :
1. Carte de présentation de la communauté : bannière (photo uploadée par un admin, ou dégradé de la charte par défaut), photo et légende du fondateur, nom de l'espace, stats réelles (membres, élèves) avec une icône discrète devant chaque nombre, bouton "Inviter" qui copie le lien de la vitrine dans le presse-papiers, lien vers la vitrine publique.
2. Carte "Prochains événements" : 2 à 3 événements réels à venir du mois courant (masterclass et RDV existants), chacun avec une pastille de date (jour + mois) colorée par type, lien "Voir tout" vers le calendrier. État vide honnête ("Aucun événement pour le moment") si rien n'est prévu.
3. Carte "Top membres actifs" : classement réel par points déjà calculé (fonction `stats_communaute`), médaille sur le podium (🥇🥈🥉), lien "Voir tout" vers la liste des membres.
4. Les blocs déjà existants du gabarit (Naviguer, Membres ou À propos selon la zone) restent en place, sans être supprimés.
5. Un bloc décoratif "Ensemble, allons plus loin" en dégradé de la charte tout en bas, purement visuel (texte motivant, pas de lien ni de donnée).

Ce travail s'applique aux deux gabarits (communauté gratuite et payante), donc automatiquement aux deux espaces sans duplication de code.

L'accès à la communauté payante est déjà conditionné par `acces_payant.actif` : l'écran de blocage existant, avec son bouton réel vers le tunnel de paiement (`/[espace]/tunnel`), est à conserver tel quel, pas à refaire.

## d) Comportement en cas d'erreur ou de donnée manquante

Tout bloc de la colonne de droite qui fait sa propre lecture en base (en particulier les événements) doit isoler l'échec dans un `try/catch` local et afficher un message d'erreur visible dans le bloc concerné, sans jamais casser le reste de la page. Un état vide honnête ("Aucun événement pour le moment", etc.) doit rester distinct d'un état d'erreur. Interdiction absolue de donnée simulée (faux posts, faux membres, faux chiffres). Un bouton non branché est visuellement désactivé et le dit clairement, jamais un faux succès.

## e) Résultat attendu

Les deux pages de communauté mises à jour selon cette structure, avec la charte graphique existante. Vérification systématique par `npx tsc --noEmit` et `npx eslint <fichiers touchés>` sans erreur avant de considérer une étape terminée. Un compte rendu court : fichiers créés ou modifiés, modifications en base s'il y en a eu, liste des fonctions affichées mais désactivées.

## f) Points déjà tranchés (ne pas redemander)

- Fichiers exacts des deux communautés : `communaute/page.tsx` et `communaute-payante/page.tsx`, gabarits génériques partagés par tous les espaces.
- Statut Pro d'un membre : colonne `actif` de la table `acces_payant`.
- Destination du bouton d'accès réservé : `/[espace]/tunnel`, page déjà existante et fonctionnelle.

## g) Consigne de sécurité

Ne jamais inventer une clé, un identifiant, un nom de table ou de fichier, ni un comportement du code existant : explorer le projet pour les trouver plutôt que deviner. Signaler clairement tout point bloquant avant de continuer. Ne pas élargir le périmètre : ne toucher ni au menu, ni aux autres pages, ni aux données existantes.
