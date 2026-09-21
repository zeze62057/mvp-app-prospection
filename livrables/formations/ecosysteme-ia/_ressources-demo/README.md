# Ressources de démonstration des vidéos

Petits projets fictifs, fournis pour que Zézé puisse enregistrer les démonstrations des vidéos sans rien inventer. Ils ne sont pas dans le cours : ils ont été écrits pour coller aux prompts des fiches pratiques.

## site-artisan

Site vitrine fictif d'un menuisier (`index.html`, `style.css`). Il correspond au « mini-projet fictif : un site vitrine pour un artisan » de la fiche `02-methode-prompts.md`, et contient volontairement ce que ses prompts supposent :

| Ce que le prompt suppose | Où c'est dans le site |
|---|---|
| Une section « Nos réalisations » et une palette de couleurs dans `style.css` (à ne pas toucher) | `#portfolio` dans `index.html`, variables `:root` dans `style.css` |
| Pas encore de moyen de contacter l'artisan (Exemple 1, formulaire de contact) | Aucun formulaire, aucun lien Contact |
| Un menu de navigation qui déborde à 375 px de large (Exemple 2) | `nav` en `display: flex` avec `white-space: nowrap` et 6 liens |
| Un lien « Nos réalisations » qui pointe vers une ancre renommée (Exemple 3) | Le lien pointe vers `#galerie`, alors que la section s'appelle `#portfolio` |
| Un menu de navigation commun, pour la page Tarifs (chapitre 3) | Le `nav` du `header` |

**Avant chaque enregistrement**, copiez le dossier `site-artisan` sous le nom `site`, à l'intérieur d'un dossier de démonstration neuf (par exemple `C:\demo-a\site`), et lancez Claude Code depuis le dossier parent (`C:\demo-a`) : les prompts de la fiche parlent du « dossier /site ». Cela repart d'un état propre et ne modifie pas l'original. Après une démonstration, ne recopiez rien vers `site-artisan`.
