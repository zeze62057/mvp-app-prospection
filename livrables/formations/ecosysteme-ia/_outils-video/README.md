# Outils vidéo : diapositives PowerPoint et minutage du script

Outil commun à tous les chapitres du programme écosystème IA. Il transforme un fichier `diapositives.json` (un par chapitre) en PowerPoint animé, à la charte Vivier IA. Le format a été validé sur le chapitre 1 du Module 1 (2026-09-21).

## Principe

Un chapitre = un dossier `.../videos/<section>/chapitre-<N>/` qui contient :

| Fichier | Rôle |
|---|---|
| `01-script.md` | Cadrage, points à valider, script minuté |
| `diapositives.json` | Le contenu des diapositives (source unique) |
| `diapositives-chapitre-<N>.pptx` | Produit par l'outil, ne s'édite pas à la main |
| `02-diapositives.md` | Plan des diapositives, animations, contrôles faits |
| `03-enregistrement-et-mise-en-ligne.md` | Checklist, secrets, fiche plateforme, mise en ligne |

On modifie le JSON, puis on reconstruit. On ne retouche jamais le `.pptx` à la main : la retouche serait perdue à la prochaine construction.

## Installation (une seule fois)

```
cd livrables/formations/ecosysteme-ia/_outils-video
npm install
```

Dépendances : pptxgenjs, sharp, jszip. Le dossier `node_modules/` n'est pas versionné.

## La commande unique (à utiliser en pratique)

```
node terminer-chapitre.mjs <dossier-du-chapitre>
```

Elle enchaîne les quatre commandes ci-dessous, puis écrit `02-diapositives.md` et `03-enregistrement-et-mise-en-ligne.md` (`generer-fiches.mjs`) et copie le PowerPoint sur le Bureau (clé `bureau` du JSON). On écrit à la main seulement `01-script.md` et `diapositives.json`. À relancer après chaque retouche.

Clés optionnelles de `diapositives.json`, en plus de `sortie`, `titre`, `sujet` et `diapositives` :

| Clé | Contenu |
|---|---|
| `bureau` | `{ "dossier": "Module 1 - Section 2 - La Méthode", "nom": "Chapitre 1" }` : où copier le PowerPoint sur le Bureau |
| `fiche` | `{ "description": "...", "points": ["..."] }` : la fiche à coller sur la plateforme |
| `preparation`, `avant`, `pendant`, `apres`, `secrets` | listes de lignes ajoutées à la checklist d'enregistrement (la veille, juste avant, pendant, après) et à la vérification des secrets |
| `entre` | passages à l'écran sans diapositive (la démonstration) |
| `aVerifier` | points d'interface à revoir le jour de l'enregistrement |

Dans les `notes` des diapositives, `{{tN}}` est remplacé par l'heure de la N-ième ligne du tableau de `01-script.md` : on ne recopie jamais une heure à la main.

## Les quatre commandes

1. **Minuter le script** (remplit les `{{tN}}` et `{{duree_estimee}}` de `01-script.md`) :
   ```
   node minuter-script.mjs <chapitre>/01-script.md
   ```
   Le calcul compte les mots de la colonne « Ce que vous dites », à 140 mots par minute. Le temps de manipulation à l'écran s'écrit `⏱ +30 s` dans la colonne « Action » et y reste visible. La commande peut être relancée après chaque retouche du script : elle recalcule toutes les minutes, qu'elles soient encore des `{{tN}}` ou déjà des heures. Sur le chapitre 1 (minuté avant cette évolution), les marqueurs `⏱` ont été retirés : ne le relancez pas sans les remettre.

2. **Construire le PowerPoint** :
   ```
   node construire-pptx.mjs <chapitre>/diapositives.json
   ```
   Le fichier est écrit à côté du JSON, sous le nom donné par `sortie`. L'outil affiche des avertissements (titre trop long, commande trop longue, notes manquantes) : corrigez-les avant de continuer. Si PowerPoint a le fichier ouvert, la construction échoue (fichier verrouillé) : fermez-le d'abord.

3. **Vérifier avec PowerPoint** (Windows, PowerPoint installé) :
   ```
   powershell -NoProfile -ExecutionPolicy Bypass -File verifier-pptx.ps1 -Fichier <chemin complet du .pptx>
   ```
   Le script ouvre le fichier, compte par diapositive les effets (par clic, avec la précédente, après la précédente), la transition et la longueur des notes, puis exporte chaque diapositive en PNG dans un dossier `rendu/` à côté du fichier. Il signale aussi les **ALERTES** de mise en page : texte qui déborde de son cadre (toujours un vrai défaut), élément qui sort de la diapositive, titre sur plus de 3 lignes, mot seul en fin de ligne (parfois voulu). Il ne voit pas un titre qui touche le logo : regardez les images.

4. **Générer la planche d'aperçu** (une seule image pour tout le chapitre) :
   ```
   node planche.mjs <chapitre>
   ```
   Elle assemble les diapositives de `rendu/` en `rendu/planche.png`, à regarder en entier. Le dossier `rendu/` se régénère à volonté : ne le versionnez pas. `-ExecutionPolicy Bypass` ne s'applique qu'à cette commande et ne change pas le réglage de Windows.

Le déroulé animé n'est pas joué par ce contrôle : à tester en mode diaporama avant l'enregistrement.

## Format de `diapositives.json`

```json
{
  "sortie": "diapositives-chapitre-2.pptx",
  "titre": "Titre du chapitre",
  "sujet": "Vivier IA, Module 1, section 1, chapitre 2",
  "diapositives": [ { "type": "titre", ... }, { "type": "cartes", ... } ]
}
```

Balisage du texte, dans tous les champs : `*mot*` met le mot en couleur d'accent (corail), `\n` coupe la ligne. Les espaces insécables avant `: ; ? ! »` sont ajoutés automatiquement.

Chaque diapositive porte `notes` : le moment du script, ce qui se passe à chaque clic. L'outil avertit si elles manquent. Un champ optionnel `fond` force un recadrage précis du fond (sinon les 5 recettes alternent, et la dernière diapositive est teintée).

| `type` | Champs | Animation |
|---|---|---|
| `titre` (couverture) | `surtitre`, `titre` (coupez avec `\n` en 2 ou 3 lignes), `objectif`, `pastilles` (3 conseillées) | Tout seul à l'ouverture |
| `flux` | `surtitre`, `rangees` (1 ou 2), `phrase` (optionnelle). Une rangée : `etiquette`, `style` (`gris` ou `clair`), `boites` (chaînes, ou `{ "t": "...", "accent": true }`) | Rangée 1 visible, clic pour la rangée 2, clic pour la phrase |
| `cartes` | `surtitre`, `titre`, `cartes` (2 à 4 : `titre`, `texte`, `code` optionnel en liste de lignes) | Un clic par carte |
| `avant-apres` | `surtitre`, `titre`, `intro`, `avant` et `apres` (`etiquette`, `titre`, `texte`). Sert à toute comparaison de deux blocs, pas seulement avant et après | Un clic par carte |
| `commandes` | `surtitre`, `titre`, `lignes` (1 à 4 : `etiquette` et `commande` ou `detail`). Une ligne avec `detail` (texte) est regroupée dans un cadre discret ; une ligne avec `commande` s'affiche dans une boîte sombre en police à chasse fixe | Un clic par ligne |
| `points` | `surtitre`, `titre` (2 lignes), `points` (3 au plus avec `final`), `final` (annonce de la prochaine vidéo) | Titre seul, un clic par point, un clic pour `final` |
| `enonce` | `surtitre`, `enonce` (une grande phrase), `appui` (optionnel) | Phrase seule, un clic pour `appui` |

Exemples complets : `chapitre-1/diapositives.json` (7 diapositives, tous les types sauf `enonce`) et `chapitre-2/diapositives.json` (6 diapositives, dont `enonce`), dans `../2026-09_vivier-ia-module-1/videos/01-fondations/`.

## Charte et choix techniques

- **Couleurs** : encre `113832`, sarcelle `2B8C82`, corail `FF7A4D`, fond clair `F2F7F5`.
- **Polices** : Arial pour les titres, Calibri pour le texte, Courier New pour les commandes. Elles sont présentes sur tout poste Windows, donc rien ne se décale à l'ouverture chez Zézé. Ne pas les changer sans retester le rendu.
- **Fond** : `assets/fond-robot.jpg` (l'image fournie par Zézé), recadrée et teintée différemment d'une diapositive à l'autre, sous un voile sombre. La couverture utilise un dégradé.
- **Logo** : `assets/logo-vivier-ia.jpg`, rendu transparent par l'outil (texte et clé éclaircis, point corail conservé). Petit en haut à droite sauf sur la couverture, où il est en bas à droite.
- **Animations** : transition en fondu, puis apparitions (fondu ou balayage depuis la gauche) écrites directement dans le XML du fichier, avec les déclenchements « au clic », « avec la précédente » et « après la précédente ».
- **Limites connues** : deux rangées de cases au plus par diapositive `flux`, quatre lignes au plus pour `commandes`. Une commande de plus de 60 caractères déborde : coupez-la sur deux lignes ou passez par `detail`.

## Pour un nouveau chapitre

1. Écrire `01-script.md` avec des `{{tN}}` et des `⏱ +N s`, puis lancer `minuter-script.mjs`.
2. Écrire `diapositives.json` à partir du script : une diapositive par temps fort, jamais un texte que le script ne dit pas.
3. Construire, vérifier, regarder les images, corriger.
4. Écrire `02-diapositives.md` et `03-enregistrement-et-mise-en-ligne.md`.
5. Mettre à jour `SUIVI-VIDEOS.md`, puis **s'arrêter et faire valider par Zézé avant le chapitre suivant**.
