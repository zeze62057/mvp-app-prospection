# Section 3 — ⚙️ Déployer sans barrières

## Chapitre 1 : Bonnes pratiques

### "Sans barrières" ne veut pas dire "sans contrainte"

Le titre de cette section peut prêter à confusion : "déployer sans barrières" ne signifie pas ignorer la conformité pour aller plus vite, ça signifie l'intégrer dès la conception pour qu'elle ne devienne jamais un blocage de dernière minute qui retarde ou annule un déploiement déjà avancé.

### Le principe "privacy by design" appliqué à un projet IA

Penser la conformité dès le cadrage du projet (Module 1, gabarit à 4 éléments) plutôt qu'en fin de construction coûte beaucoup moins cher que de devoir retravailler un système déjà construit pour le mettre en conformité après coup. Le périmètre d'un brief de projet (Module 3, section 7) devrait explicitement inclure la classification des données concernées (section 2 de ce module).

### Les réflexes à installer dès le déploiement

Minimiser dès la conception (ne collecter et ne transmettre à un modèle IA que ce qui est strictement nécessaire à la tâche), documenter les choix faits (quelles données, pourquoi, où elles vont), et prévoir dès le départ comment répondre à une demande d'accès ou de suppression d'une personne concernée, plutôt que de le découvrir en urgence le jour où la demande arrive.

### Exemple concret

Pour un audit Chatllow chez un client CAC40, intégrer un point de conformité dans le brief initial (chapitre 2 de la section 7 du Module 3) évite qu'un service juridique interne bloque le projet en cours de route, après que l'essentiel de la construction ait déjà été fait.

**Points clés**
- "Sans barrières" veut dire intégrer la conformité dès la conception, pas l'ignorer pour aller plus vite
- Penser la conformité dès le cadrage coûte beaucoup moins cher que de la rajouter après coup
- Minimiser, documenter, et prévoir la réponse aux demandes des personnes concernées : trois réflexes à installer dès le déploiement

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi "déployer sans barrières" ne veut-il pas dire "ignorer la conformité" ?
2. Pourquoi intégrer la conformité dès le cadrage coûte-t-il moins cher que de la rajouter après coup ?
3. Cite les 3 réflexes de bonnes pratiques évoqués dans ce chapitre.

### Réflexion
4. Reprends le gabarit à 4 éléments du Module 1 (contexte, objectif, périmètre, autonomie) : à quel élément précis rattacherais-tu naturellement la classification des données d'un projet ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : ça signifie intégrer la conformité dès la conception pour qu'elle ne bloque jamais un déploiement déjà avancé, pas l'ignorer
- Q2 : retravailler un système déjà construit pour le mettre en conformité après coup coûte beaucoup plus cher que de l'intégrer dès le départ
- Q3 : minimiser dès la conception, documenter les choix faits, prévoir la réponse aux demandes d'accès ou de suppression
- Q4 : le périmètre, puisqu'il délimite précisément quelles données et quels cas sont couverts par le projet
