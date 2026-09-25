# Projet 1.1 : mon registre des secrets

Pour **un projet qui est le vôtre**. Une ligne par secret. Ne notez **jamais** la valeur, seulement où elle vit.

Consigne : listez tout ce qui donne accès à quelque chose (clés d'API, mots de passe de base de données, jetons d'hébergeur, clé du prestataire de paiement, jeton d'une automatisation).

| Nom du secret | Sert à | Où il est rangé | Un par usage ? (dev / test / prod) | Dernier changement | Prochain changement |
|---|---|---|---|---|---|
| (exemple) CLE_API_CLAUDE | Appeler Claude depuis mon appli | `.env` local, gestionnaire de l'hébergeur | oui, une clé par environnement | 2026-09-01 | 2026-11-30 |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## Vérifications à cocher

- [ ] `git check-ignore -v .env` affiche une règle
- [ ] `git log --all --oneline -- .env` n'affiche rien
- [ ] `git ls-files | grep -i "\.env"` n'affiche que des modèles
- [ ] `node verifier.mjs <mon-projet>` affiche « projet propre »
- [ ] Les règles `deny` sur `.env` sont dans mes réglages Claude Code
- [ ] Aucune clé n'a été collée dans une conversation avec une IA
- [ ] J'ai une date de changement pour chaque clé

## Plan si une clé fuit

1. Quelle clé ? _______
2. Où la révoquer ? (lien de la console) _______
3. Qui prévenir ? _______
4. Où ranger la nouvelle ? _______

**Livrable** : ce fichier rempli, sans aucune valeur secrète.
