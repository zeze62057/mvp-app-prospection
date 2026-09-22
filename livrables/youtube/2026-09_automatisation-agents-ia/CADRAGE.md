# Cadrage — Équipe d'agents IA pour automatiser la chaîne YouTube

Date du cadrage : 2026-09-22

## 1. Type de projet

Aucune variante documentée dans `livrables/transverse/methode-approche-projet.md` ne correspond exactement à ce projet : ce n'est ni une automatisation n8n (l'outil n'est pas n8n), ni une application/SaaS à construire (Zézé n'écrit pas le code, il adopte un outil tiers existant), ni un fullstack Claude Code + n8n.

Décision actée avec Zézé : on emprunte la grille de la variante **Automatisation (n8n / workflow)**, en l'adaptant. Le repo tiers `darkzOGx/youtube-automation-agent` (auto-hébergé, licence MIT) joue le rôle que jouerait normalement un canevas n8n : c'est lui qui orchestre le pipeline (Content Strategy → Script Writer → Thumbnail/SEO en parallèle → Production → Review → Publishing → Analytics, avec boucle de rétroaction vers le premier agent). `methode-approche-projet.md` n'est pas modifié pour l'instant, cette adaptation reste propre à ce projet.

## 2. Objectif

Faire tourner un pipeline auto-hébergé qui prend en charge la production complète d'une vidéo YouTube de vulgarisation IA, de la recherche de sujet jusqu'à la publication programmée, avec apprentissage en boucle à partir des performances des vidéos précédentes. Objectif concret immédiat : permettre à Zézé de publier ses 20 premières vidéos sans devoir tout produire lui-même à la main.

## 3. Cible

Double lecture, à ne pas confondre :
- **Utilisateur de l'outil** : Zézé lui-même, seul aux commandes de la supervision et de la validation.
- **Audience finale de la chaîne** : entrepreneurs, créateurs de contenu, indépendants et décideurs francophones intéressés par l'IA et l'écosystème Claude, non-développeurs, avec une résonance particulière en Afrique francophone. (Niche et audience validées telles quelles par Zézé, non retravaillées à ce cadrage.)

## 4. Problème réel résolu

Zézé n'a pas le temps de produire seul une vidéo par semaine sur la durée (recherche de sujet, script, voix, visuels, montage, SEO, publication) en plus de Chatllow, Vivier IA et Longrich. Le vrai problème n'est pas "manquer d'idées de vidéos", c'est l'absence de bande passante pour exécuter tout le cycle de production à un rythme régulier. L'outil doit combler ce manque de capacité d'exécution, pas remplacer le jugement de Zézé sur le fond (niche, ton, validation avant publication restent chez lui).

## 5. Priorité

Si tout ne peut pas être automatisé d'un coup : **la production vidéo complète en premier** (montage, voix, visuels). C'est la partie que Zézé ne peut pas faire lui-même à la main de façon soutenable. En attendant que cette brique soit fiable, il peut continuer à trouver les sujets et écrire les scripts lui-même si besoin, ce sont les étapes où il peut le plus facilement compenser manuellement.

## 6. Répartition produit / automatisation (rôle joué par la variante n8n)

Le repo fait à la fois la "plomberie" (orchestration entre agents, appels API) et une bonne partie du "produit" (génération de script, de voix, de visuels, montage), ce qui ne correspond pas à la séparation nette Claude Code / n8n habituelle. Les points de contrôle humain déjà intégrés à l'outil, confirmés valables pour ce projet :

- Niche, audience, sujets : sous contrôle humain (verrouillés en amont par Zézé)
- Ton, format, longueur, direction de marque du script : sous contrôle humain
- Choix du fournisseur IA : sous contrôle humain → **Gemini** retenu (texte + TTS gratuits ; visuels en dégradés de repli tant qu'il n'y a pas de budget payant pour de la génération d'image/vidéo)
- Confidentialité et calendrier de publication : sous contrôle humain
- Approbation avant toute publication : obligatoire, pas d'auto-publication

Déclencheur du cycle : programmation hebdomadaire (Schedule), pas un déclenchement manuel à la demande. Voir section 8 pour le risque que ça pose.

## 7. Périmètre

**Inclus dans cette première version :**
- Installation et connexion du repo aux vrais identifiants YouTube de Zézé dès le départ (pas de compte de test intermédiaire, décision assumée par Zézé)
- Fournisseur IA : Gemini uniquement (texte + TTS), budget 0€/mois
- Visuels : dégradés de repli par défaut (pas de génération d'image/vidéo payante tant qu'il n'y a pas de budget)
- Cadence cible : 1 vidéo programmée par semaine
- Revue humaine obligatoire avant chaque publication (Review Studio), budget de temps réel : moins d'1h/semaine

**Hors périmètre pour cette première version :**
- Tout budget payant (visuels IA de meilleure qualité, autres fournisseurs que Gemini)
- Personnalisation ou fork du code du repo tiers (pas prévu à ce stade, adoption telle quelle)

## 8. Contraintes connues et risque à surveiller

- **Budget : 0€/mois.** Le pipeline tourne entièrement sur le gratuit (Gemini texte + TTS, visuels en dégradés). À anticiper : la qualité des visuels restera limitée tant qu'aucun budget n'est ouvert pour un fournisseur de génération d'image/vidéo.
- **Temps de supervision : moins d'1h/semaine**, pour une cadence de **1 vidéo programmée par semaine**, avec validation humaine obligatoire à chaque cycle. Ce point a été signalé explicitement à Zézé comme un risque de tension : moins d'1h laisse peu de marge si une vidéo générée nécessite plusieurs allers-retours de correction avant validation, ou si Zézé est indisponible une semaine donnée. Zézé a maintenu son choix de cadence en connaissance de cause, ce n'est pas à moi de trancher à sa place. À surveiller une fois l'outil en usage réel : si le temps de revue dépasse systématiquement 1h, soit la cadence baisse, soit le niveau d'automatisation (moins de correction manuelle nécessaire) doit augmenter.
- **Aucune date fixe pour la première vidéo publiée** : dès que l'installation est validée, sans pression de délai.
- **Confiance envers l'outil tiers** : Zézé est à l'aise pour connecter directement ses vrais identifiants YouTube dès l'installation (open source MIT, auto-hébergé, pas de compte de test demandé).

## 9. Points encore à trancher avant la construction/installation

- **Miniatures et titres générés par l'outil vs 100% manuels** : pas tranché explicitement. Par défaut, l'outil peut les générer sous la revue humaine standard (comme le reste du pipeline). À confirmer avec Zézé avant l'installation réelle : veut-il garder cette étape entièrement manuelle malgré tout, ou accepte-t-il la génération automatique avec revue ?
- **Suivi du risque cadence/temps de validation** (section 8) : pas un point à trancher maintenant, mais un signal à observer une fois l'outil en usage réel.

## 10. Nom de la chaîne YouTube

Tranché le 2026-09-22 : **Vivier IA**, le même nom que l'école. Zézé a d'abord proposé « Vivier Académie », mais a choisi de reprendre « Vivier IA » pour ne pas créer deux marques proches et concurrentes dans son propre écosystème. Configuré dans `CHANNEL_NAME` du `.env` du projet installé (`Mes Projets/youtube-automation-agent/`).

---

Ce brief couvre l'étape 1 (cadrage initial) du pipeline. Prochaine étape si Zézé valide : étape 2 (nom/identité de la chaîne, en parallèle ou après), puis étape 5 (construction/installation), en suivant la manipulation technique réelle étape par étape en direct avec lui (installation sur son poste, connexion des identifiants YouTube, configuration Gemini), comme le prévoit la méthode pour toute manipulation touchant à son infrastructure ou ses comptes.
