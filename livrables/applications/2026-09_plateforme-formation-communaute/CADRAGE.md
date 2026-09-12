# Cadrage — Plateforme d'hébergement des élèves + communauté

Date du cadrage : 2026-09-12

## 1. Type de projet

Application / SaaS (variante Kora), **combinée** à la variante Fullstack (Claude Code + n8n).

La combinaison est confirmée, pas supposée : la communauté (forum, chat, flux social) est entièrement intégrée au produit, sans n8n. Mais le passage paiement → activation du compte élève est explicitement orchestré via n8n (décision de Zézé), ce qui active la variante Fullstack pour cette partie précise du projet.

## 2. Objectif

Construire une plateforme qui héberge le contenu de formation déjà rédigé (Modules écosystème IA pour Vivier IA, programme marketing-réseau pour Longrich) derrière un accès payant (Mobile Money), avec des espaces communautaires natifs (forum, chat, flux social) intégrés au produit, sans dépendre d'un outil externe type Discord ou WhatsApp.

Construction voulue de façon incrémentale ("on développe petit à petit"), pas en un seul bloc : c'est une contrainte de méthode explicite pour ce projet, à respecter dès le découpage des lots de construction (étape 5 du pipeline).

## 3. Cible

Deux publics distincts, non mélangés :
- Les apprenants du programme écosystème IA, sous la marque Vivier IA
- Les distributeurs Longrich formés par Zézé

Chacun a son propre espace de contenu et sa propre communauté. Pas de communauté mixte.

## 4. Problème réel résolu

Le contenu existe déjà (Modules 1/2 écosystème IA, programme MLM complet). L'enjeu n'est pas de le rendre accessible (un LMS basique suffirait), mais de créer un lieu qui retient les élèves/distributeurs après la consommation du contenu et qui crée un effet de communauté renforçant la marque (Vivier IA, Chatllow, Longrich). Sans la couche communautaire, la plateforme ne serait qu'un hébergement de contenu de plus.

## 5. Priorité

L'accès fiable au contenu (comptes, paiement, consultation des modules) passe avant la couche communautaire. Confirmé et renforcé par la volonté explicite de Zézé de développer petit à petit : le premier lot construit doit être le socle LMS (paiement → accès → contenu), la communauté vient dans un lot ultérieur une fois ce socle stable.

## 6. Répartition produit / automatisation

**Produit (Claude Code)** :
- Comptes élèves et gestion des accès
- Hébergement et consultation du contenu (Modules écosystème IA, programme Longrich)
- Forum, chat et flux social intégrés nativement à la plateforme (pas d'intégration vers un outil externe)

**Automatisation (n8n)** :
- Événement déclencheur : paiement reçu via Mobile Money (Orange Money ou MTN Money)
- n8n reçoit la confirmation de paiement et orchestre l'activation du compte élève côté produit (création/déblocage de l'accès, probablement notification de bienvenue)
- Le détail technique de captation du paiement Mobile Money (agrégateur, API disponible en Guinée) reste à investiguer à l'étape de construction, pas à trancher ici

Cette répartition est explicite et actée : rien ne doit être construit qui la contredise sans repasser par un cadrage.

## 7. Périmètre

**Probable en V1** (premier lot incrémental) :
- Comptes payants activés via Mobile Money (Orange/MTN) et n8n
- Deux espaces de contenu séparés (Vivier IA / Longrich)
- Consultation des modules déjà rédigés

**Vient après**, dans un lot ultérieur, une fois le socle ci-dessus stable :
- Forum, chat, flux social (communauté)

**Hors périmètre explicite** : pas encore défini par Zézé (voir points à trancher).

## 8. Contraintes connues

- Paiement en Mobile Money (Orange Money, MTN Money), spécifique au marché guinéen : contrainte technique et marché à anticiper dès la construction du socle
- Construction volontairement incrémentale, pas de "tout en un bloc" : contrainte de méthode explicite
- Aucun délai de lancement communiqué pour l'instant
- Aucune contrainte de budget communiquée

## 9. Points encore à trancher

- **Une plateforme avec deux espaces, ou deux projets distincts** partageant un starter technique commun (comme les générateurs d'audit sectoriels de Chatllow). Zézé n'a pas tranché, à valider avant l'étape 3 (maquette) car ça change l'architecture et l'organisation du dossier
- **Relation avec le portail existant** `livrables/sites-web/2026-09_portail-academie/` : reste une vitrine publique qui coexiste avec cette plateforme privée, ou est remplacé/absorbé
- **Identité** : la plateforme hérite de l'identité Vivier IA déjà existante, adopte une identité neutre qui contient les deux communautés, ou chaque espace garde l'identité de sa marque d'origine (Vivier IA / Longrich)
- **Délai de lancement** : aucune date connue pour l'instant
- **Hors périmètre explicite pour la V1** : à définir avec Zézé (paiement Mobile Money dès la V1 confirmé, mais d'autres exclusions comme version mobile, modération avancée, etc. restent ouvertes)
- **Détail technique de l'intégration Mobile Money** : quel agrégateur ou API utiliser pour capter les paiements Orange Money / MTN Money en Guinée, à creuser à l'étape de construction
- **Découpage précis des lots incrémentaux** : au-delà du grand principe "contenu avant communauté", le détail des petits lots successifs reste à définir au moment de l'étape 5 (gabarit à 4 éléments par tâche)

## Historique du cadrage

Cadrage mené par échanges successifs avec Zézé le 2026-09-12. Questions posées et réponses obtenues :
- Nature de la communauté → entièrement intégrée au produit (forum, chat, flux), pas d'outil externe
- Périmètre du contenu → deux communautés séparées, Vivier IA et Longrich
- Accès → après paiement, pas d'inscription gratuite validée manuellement
- Priorité → accès au contenu avant interaction communautaire
- Paiement et automatisation → Mobile Money (Orange/MTN), orchestré via n8n
- Construction → incrémentale, petit à petit
- Emplacement → `livrables/applications/2026-09_plateforme-formation-communaute/`

Non tranché à ce stade : relation au portail existant, identité, délai, hors périmètre détaillé, architecture une/deux plateformes.
