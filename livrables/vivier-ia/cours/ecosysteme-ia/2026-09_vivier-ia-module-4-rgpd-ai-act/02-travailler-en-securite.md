# Section 2 — 🔍 Travailler en Sécurité

## Chapitre 1 : Identifier les données à risques

### Toutes les données ne se valent pas en sensibilité

Une donnée à risque n'est pas seulement "une donnée personnelle" au sens large, c'est une donnée dont la fuite ou le mauvais usage aurait un impact réel sur la personne concernée. Un nom seul dans un annuaire public est peu sensible, ce même nom associé à un état de santé, une orientation, ou une situation financière l'est beaucoup plus.

### Les catégories qui demandent une vigilance renforcée

Les données dites "sensibles" au sens du RGPD (santé, origine, opinions politiques ou religieuses, orientation sexuelle) demandent un traitement particulièrement rigoureux. Au-delà de cette liste officielle, toute donnée financière, tout identifiant unique (numéro de sécurité sociale, passeport), et toute donnée d'un mineur méritent la même vigilance renforcée en pratique.

### Exemple concret

Un projet Chatllow qui traite des CV pour un client (Module 3, section 9) manipule des données à risque modéré à élevé selon leur contenu : nom, parcours, mais potentiellement aussi des informations de santé si un candidat les mentionne (une absence longue expliquée, un handicap déclaré), qui demandent alors une vigilance renforcée immédiate.

**Points clés**
- Une donnée à risque se juge par l'impact réel d'une fuite sur la personne, pas seulement par sa nature "personnelle" générale
- Les catégories sensibles du RGPD (santé, origine, opinions, orientation) demandent une vigilance renforcée systématique
- Un même document (un CV) peut contenir des données de sensibilité très différente selon son contenu réel

---

## Chapitre 2 : Cartographier et classifier les usages

### Pourquoi cartographier avant de sécuriser

Sécuriser sans avoir d'abord cartographié revient à protéger au hasard : une cartographie liste précisément quelles données entrent dans un système, d'où elles viennent, où elles sont stockées, qui y a accès, et pour combien de temps. Sans cette vue d'ensemble, un point faible peut rester invisible jusqu'à l'incident.

### Une classification simple à trois niveaux

**Public** : une donnée déjà accessible publiquement, peu de contrainte. **Interne** : une donnée qui circule dans l'organisation mais pas au-delà, contrainte modérée. **Confidentiel/sensible** : une donnée à risque au sens du chapitre précédent, contrainte maximale (chiffrement, accès restreint, traçabilité des consultations). Classer chaque flux de données selon ces trois niveaux avant de choisir les mesures de sécurité adaptées évite de sur-protéger le public ou de sous-protéger le sensible.

### Exemple concret

Pour le récapitulatif hebdomadaire Longrich (Module 2, section 6), la liste des distributeurs et leurs coordonnées relève du niveau "interne" : elle circule dans l'organisation mais ne devrait jamais être publiée ou partagée hors de ce cadre sans consentement explicite.

**Points clés**
- Cartographier avant de sécuriser évite de protéger au hasard et de laisser un point faible invisible
- Classification à 3 niveaux : public, interne, confidentiel/sensible, chacun avec ses propres mesures adaptées
- Classer chaque flux de données évite de sur-protéger le public ou de sous-protéger le sensible

---

## Questions pour les apprenants

### Compréhension
1. Sur quoi se juge le niveau de risque réel d'une donnée, au-delà de sa nature "personnelle" générale ?
2. Cite 3 catégories de données sensibles au sens du RGPD.
3. Pourquoi cartographier avant de sécuriser ?
4. Quels sont les 3 niveaux de la classification proposée dans ce chapitre ?

### Réflexion
5. Cartographie rapidement un flux de données réel de ton activité (Chatllow ou Longrich) : d'où vient la donnée, où va-t-elle, qui y a accès, quel niveau de classification lui donnerais-tu ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : l'impact réel qu'aurait une fuite ou un mauvais usage sur la personne concernée
- Q2 : santé, origine, opinions politiques ou religieuses, orientation sexuelle (3 au choix)
- Q3 : sans vue d'ensemble des flux de données, un point faible peut rester invisible jusqu'à l'incident
- Q4 : public, interne, confidentiel/sensible
- Q5 : pas de réponse unique, évaluer la précision et la cohérence de la classification proposée
