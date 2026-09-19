# CLAUDE.md — Plateforme Chatllow

Ce fichier guide Claude Code pendant la construction réelle de ce projet. Le cadrage complet (objectif, cible, décisions, points ouverts) est dans `CADRAGE.md`, à lire en entier si un doute apparaît : ce fichier n'en est qu'un résumé opérationnel, pas un remplacement.

## Qui et pourquoi

Projet de Zézé Bilivogui. Chatllow est son cabinet de conseil IA, sans client signé à ce jour. Cette plateforme est le premier point d'entrée public du cabinet : un **diagnostic IA interactif en libre-service** pour capter un dirigeant qui compare activement plusieurs cabinets IA (cible : décideur CAC40 ou grand compte comparable), et un **espace client** pour le suivi de mission une fois un client signé.

Priorité explicite : construire de la crédibilité générale pour du trafic froid, pas convertir en urgence un prospect déjà chaud. Aucun délai de lancement.

## Ce qui ne se discute pas sans repasser par un cadrage

- **Deux briques, une seule identité** : diagnostic public et espace client vivent sous la même marque Chatllow, pas deux produits distincts.
- **Le diagnostic restitue une recommandation de pilote concret**, jamais un score abstrait ou un rapport générique (tranché le 2026-09-16, voir CADRAGE.md section 8).
- **Après le diagnostic** : email systématique du résultat, plus option de prise de RDV intégrée — les deux, pas l'un ou l'autre.
- **Une vitrine classique précède le diagnostic** (accueil, présentation du cabinet, preuves) : le diagnostic n'est pas la porte d'entrée directe du site.
- **Ne jamais fabriquer de fausses preuves sociales** (logos clients, témoignages, chiffres inventés) : Chatllow n'a pas encore de client signé, la crédibilité vient de la méthode et du fondateur, jamais d'une preuve sociale fictive.
- **Le générateur d'audit interne existant** (`livrables/chatllow/2026-09_generateur-audit-ia-chatllow/`) reste un outil séparé, rempli par Zézé après un RDV déjà obtenu. Ne pas le fusionner avec le diagnostic public sans décision explicite.
- **Distinction avec Vivier Academies** : la future page de présentation Chatllow mentionnée dans le cadrage de Vivier Academies (`livrables/vivier-ia/2026-09_plateforme-formation-communaute/CADRAGE.md`) est un objet plus léger, pour une audience déjà captive. Ne pas la confondre avec cette plateforme autonome.
- **Registre et ton** : vouvoiement systématique, cible un décideur qui compare des cabinets déjà établis. Une mention de confidentialité des réponses est requise partout où le diagnostic collecte de l'information sur l'entreprise du visiteur.

## Identité visuelle

**Tranchée le 2026-09-16.** Piste "Signal net" retenue parmi 5 explorées (voir `livrables/chatllow/2026-09_chatllow-identite-visuelle/`, canvas Claude Design — les 4 pistes non retenues restent sur la page "Explorations", ne pas les supprimer).

- Encre `#14161F`, indigo `oklch(62% 0.19 250)`, fond crème texturé `#F6F1E9` (grain subtil en overlay, ajouté le 2026-09-16 après inspiration visuelle de iapreneurs.com)
- Typographie : Space Grotesk (titres/marque), IBM Plex Sans (texte courant), IBM Plex Mono (détails techniques), Instrument Serif italique (accent ponctuel sur un mot-clé dans les titres, ex. "en premier")
- Mini-mark : deux carrés arrondis superposés (encre + indigo)
- Boutons en pilule (rounded-full) avec flèche &rarr;, plutôt que rectangles arrondis
- **Important** : le ton reste sobre CAC40 (pas de storytelling perso hype, pas de fausse preuve sociale) même si le style visuel s'est inspiré d'un site plus "creator" — voir CADRAGE.md, décision du 2026-09-16

## Maquette

Maquette cliquable dans `maquette/` (5 fichiers `.dc.html` + `canvas.json`), publiée sur https://claude.ai/artifact/SXszYatMDdVfJZYoRJLAyN.

Écrans : `Main` (accueil/vitrine), `Diagnostic` (questionnaire à 3 questions, navigation par état), `Restitution` (recommandation de pilote + envoi email + RDV), `RDV` (choix de créneau), `EspaceClient` (onglets Suivi de mission / Livrables / Échanges).

Les infos entre crochets (`[nom du client]`, `[date]`) sont des placeholders, jamais des données réelles inventées.

## Stack technique

**Tranchée le 2026-09-16** : Next.js (React) + Supabase (Postgres, Auth, RLS, Storage), comme Vivier Academies (`2026-09_plateforme-formation-communaute`). Cohérent pour l'espace client authentifié (comptes, RLS, stockage des livrables) et pour rester dans un outillage déjà maîtrisé dans ce workspace.

## Répartition produit / automatisation

**Produit (Claude Code)** : diagnostic interactif, espace client authentifié.

**Automatisation (n8n)** : tranché et opérationnel depuis le 2026-09-17 — le workflow "Chatllow — Notification diagnostic complété" (`jM4k2kLw3wbXFM2c` sur l'instance n8n de Zézé) reçoit un webhook depuis `/api/notifier-diagnostic` à chaque diagnostic terminé, et envoie un email à Zézé (email du lead, pilote recommandé, résumé des réponses). Envoi via un nœud **Send Email (SMTP)**, pas Gmail OAuth — cette instance n8n est auto-hébergée sans app Google préconfigurée, un credential SMTP avec mot de passe d'application Gmail est plus simple. Workflow actif, testé en production.

## Avant toute manipulation technique réelle

Annoncer le prompt (contexte, objectif, périmètre, autonomie) avant de construire ou modifier quelque chose de structurant, et attendre la validation de Zézé. Pour toute installation ou configuration touchant un vrai compte ou service externe, guider étape par étape en direct, jamais une liste à exécuter seul.
