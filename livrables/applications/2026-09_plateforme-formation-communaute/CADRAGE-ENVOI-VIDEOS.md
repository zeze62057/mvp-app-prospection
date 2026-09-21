# Cadrage : envoi des vidéos de cours vers la plateforme

Date : 2026-09-21. Statut : brouillon de cadrage, à valider par Zézé avant toute construction. Ce document ne construit rien. Il complète `CADRAGE.md` sans le remplacer.

## 1. Pourquoi ce chantier

Zézé prépare les vidéos de formation de l'écosystème IA avec le skill `creer-video-formation` : 123 chapitres, environ 9 minutes chacun. Aujourd'hui, l'envoi d'une vidéo sur la plateforme ne peut pas fonctionner pour une vraie vidéo en ligne. Ce chantier lève ce blocage avant que la première vidéo soit enregistrée.

**Type de projet** : application (variante SaaS) déjà en construction. Ce chantier ajoute une capacité à un produit existant, il ne crée pas de nouveau projet.

## 2. Ce qui existe

- Une colonne `sections.video_path` et un espace de stockage privé `videos-cours` (migration 0009). La lecture suit la règle d'accès payant : seuls les élèves payants lisent la vidéo.
- Une route admin `/api/admin/video/[sectionId]` qui reçoit le fichier en entier (`request.arrayBuffer()`), le téléverse dans le stockage avec la clé de service, puis renseigne `video_path`.
- Un composant admin qui enregistre l'écran (`getDisplayMedia`) ou accepte un fichier existant.
- Le nom du fichier stocké est fixe : `<id de la section>.webm`, quel que soit le vrai format.

## 3. Les limites, confirmées dans la documentation

| Limite | Valeur | Source |
|---|---|---|
| Corps d'une requête vers une fonction Vercel | **4,5 Mo maximum**, sinon erreur 413 `FUNCTION_PAYLOAD_TOO_LARGE` | Documentation Vercel, « Vercel Functions Limits », mise à jour le 2026-08-24 |
| Taille d'un fichier dans Supabase Storage, offre gratuite | **50 Mo maximum, non relevable** | Documentation Supabase, « Limits » |
| Taille d'un fichier, offres payantes | Relevable jusqu'à 500 Go, réglage global puis par bucket | Documentation Supabase, « Limits » |
| Envoi de gros fichiers | Supabase recommande l'envoi résumable (TUS) au-delà de 6 Mo | Documentation Supabase, « Standard Uploads » |

**Conséquence.** Le mode actuel d'envoi (le fichier passe par le serveur) échoue en ligne dès 4,5 Mo. Une vidéo de 9 minutes pèse de 50 à 150 Mo selon la qualité. Il faut donc envoyer **directement du navigateur vers le stockage**, sans passer par le serveur de la plateforme.

**Point non vérifié** : la durée de validité d'une adresse d'envoi signée. Ma mémoire la situe à 2 heures, la documentation consultée ne le confirme pas. À vérifier avant de construire.

## 4. Deux réalités à regarder en face

1. **L'offre gratuite de Supabase ne suffit pas.** Le plafond de 50 Mo par fichier oblige à compresser fortement, et 123 vidéos représentent plusieurs gigaoctets (123 vidéos de 60 Mo, soit environ 7 Go). Le quota de stockage et de trafic de l'offre gratuite est à vérifier dans le tableau de bord de Zézé : je ne l'ai pas confirmé.
2. **Deux connexions fragiles.** Zézé envoie depuis Conakry, et ses élèves regarderont souvent sur données mobiles. Un envoi de 100 Mo à 2 Mbps montant dure environ 7 minutes : l'envoi résumable n'est pas un luxe, il évite de tout recommencer à chaque coupure. Côté élève, une vidéo de 100 Mo en 1080p coûte cher en données : une qualité de 720p à faible débit est plus adaptée.

## 5. Options

| Option | Principe | Avantages | Limites |
|---|---|---|---|
| **A. Envoi direct vers Supabase, offre payante** | Adresse signée + envoi résumable, limite de fichier relevée | Reste dans l'architecture actuelle, accès payant déjà en place, aucun nouveau prestataire | Coût mensuel de l'offre payante, lecture progressive (pas de qualité adaptative) |
| **B. Envoi direct, offre gratuite** | Même mécanisme, mais chaque vidéo compressée à 50 Mo au plus | Aucun coût | Qualité limitée, risque de dépasser le stockage gratuit avec 123 vidéos |
| **C. Hébergeur vidéo externe** (Bunny Stream, Mux, Cloudflare Stream...) | La plateforme stocke un identifiant, l'hébergeur diffuse | Qualité adaptative selon la connexion de l'élève, lecture fluide sur mobile | Nouveau prestataire et nouveau coût, contrôle d'accès à reconstruire avec l'hébergeur |

Un hébergeur qui rend la vidéo accessible par simple lien (par exemple une vidéo YouTube non répertoriée) est écarté : il contredit la règle « lisible seulement par les élèves payants ».

**Recommandation : option A, avec un passage possible à C plus tard.** Elle règle le blocage sans changer l'architecture, et le cadrage initial prévoyait déjà d'attendre un vrai volume avant de passer à un service de diffusion spécialisé. Si l'expérience des élèves sur mobile s'avère mauvaise, C devient le chantier suivant.

## 6. Ce qui serait construit (option A)

1. **Réglage du stockage**, fait avec Zézé en direct : vérifier l'offre Supabase, relever la limite globale de taille de fichier, fixer la limite du bucket `videos-cours` et n'y autoriser que les types vidéo.
2. **Route d'autorisation** : `POST /api/admin/video/[sectionId]/autoriser`. Elle vérifie que l'appelant est admin et renvoie une adresse d'envoi signée, un petit message JSON très en dessous de 4,5 Mo.
3. **Envoi direct** depuis le navigateur vers le stockage, résumable, avec barre de progression, annulation et reprise après coupure.
4. **Route de confirmation** : `POST /api/admin/video/[sectionId]/confirmer`. Elle vérifie que le fichier existe bien dans le stockage, contrôle sa taille et son type, puis seulement alors renseigne `video_path`. Le serveur ne fait jamais confiance au navigateur.
5. **Remplacement d'une vidéo** : l'ancien fichier est supprimé quand une nouvelle version est confirmée.
6. **Option du micro** dans l'outil d'enregistrement intégré (aujourd'hui il capte l'écran et le son du système, pas le micro), si Zézé le souhaite.

**Hors périmètre** : compression automatique côté serveur, sous-titres, qualité adaptative, statistiques de visionnage.

## 7. Tests prévus

- Un fichier de quelques secondes, puis un fichier de plus de 6 Mo (envoi résumable).
- Un fichier au-dessus de la limite : message d'erreur clair, rien d'enregistré.
- Une coupure de connexion pendant l'envoi : reprise sans tout recommencer.
- Un non-admin : refus. Un élève payant : lecture. Un membre gratuit : refus.
- Test complet **en ligne** sur Vercel, pas seulement en local, car c'est en ligne que la limite de 4,5 Mo s'applique.

## 8. Décisions à prendre par Zézé

1. **Offre Supabase** : gratuite ou payante ? La recommandation A suppose l'offre payante.
2. **Qualité visée** : 720p léger pour les données mobiles des élèves (recommandé), ou 1080p ?
3. **Micro dans l'outil intégré** : oui, ou tu enregistres toujours avec un logiciel externe ?
4. **Ordre** : ce chantier avant l'enregistrement de la première vidéo (recommandé), ou en parallèle ?

## 9. Prompt proposé, à annoncer avant construction

- **Contexte** : plateforme Vivier Academies (Next.js et Supabase), migration 0009 pour le stockage privé des vidéos, route `/api/admin/video/[sectionId]` qui reçoit le fichier en entier.
- **Objectif** : permettre à l'admin d'envoyer une vidéo de plusieurs dizaines de Mo, en ligne, avec reprise après coupure, et de la lire côté élève payant.
- **Périmètre** : les sections 2 à 6 ci-dessus. Pas de compression serveur, pas de sous-titres, pas de changement du contrôle d'accès des élèves.
- **Autonomie** : migration testée en transaction annulée avec de vrais rôles, puis appliquée après l'accord de Zézé. Réglage du stockage guidé étape par étape en direct. Un commit par lot, aucun `git push` sans demande. Test en ligne obligatoire avant de déclarer le chantier terminé.
