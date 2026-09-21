# Vidéo : Quand ça casse, debugger et vérifier

Module 1, section 2 « La Méthode », chapitre 4. Source : `02-methode.md`, chapitre 4.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait quoi faire face à une erreur : lire le message en entier, isoler le problème, demander un diagnostic avant de corriger. Il sait aussi pourquoi tester tôt coûte moins cher que tester tard.
- **Signal de réussite** : le guide de réussite (étape 2) n'attache pas d'action à ce chapitre. Le signal est de pouvoir décrire, devant une erreur, les trois réflexes dans l'ordre, sans demander directement « corrige ça ».
- **Prérequis de l'élève** : avoir suivi les chapitres 1 à 3 de la section 2.
- **Durée cible** : entre 3 et 5 minutes. Le chapitre est court et conceptuel : ni installation, ni commande.
- **Exemple concret qui porte la vidéo** : un formulaire d'intake qui refuse tous les e-mails valides, traité avec les trois réflexes.

## 2. Points à valider avec Zézé avant d'enregistrer

Le chapitre du cours ne renvoie ni à votre workspace, ni à vos projets, ni à vos clients : aucun passage n'a été remplacé. Deux points demandent votre décision. Les « tu » du cours deviennent des « vous ».

1. **Pas de démonstration à l'écran.** Le cours ne donne aucun prompt ni aucune commande pour ce chapitre (la fiche pratique ne couvre que les chapitres 2 et 3). La vidéo repose donc sur les 6 diapositives et la voix. Si vous voulez montrer un vrai diagnostic, il faut une vraie erreur et une demande de votre part : je n'en invente pas. **Piste, hors cours, à valider ou à écarter** : sur le site de démonstration (`_ressources-demo/site-artisan`), le lien « Nos réalisations » du menu pointe vers une ancre qui n'existe plus (`#galerie` au lieu de `#portfolio`). On pourrait demander à Claude Code : « Quand je clique sur "Nos réalisations" dans le menu, la page ne descend pas jusqu'à la section. Diagnostique d'abord la cause, sans rien modifier. » Ce prompt n'est pas dans le cours.
2. **Un mot défini à l'oral.** Le cours parle de « la console » sans l'expliquer. Le script ajoute « l'endroit où s'affichent les erreurs » pour ne laisser aucun terme sans définition, et « en production » devient « en ligne, utilisé par le client ».

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce dernier chapitre de la section sur la méthode. Aujourd'hui, un sujet que tout projet rencontre : quand ça casse. Nous verrons les trois réflexes face à une erreur. Un exemple. Puis pourquoi tester tôt coûte moins cher que tester tard. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:19 | Même avec une bonne méthode, un projet finit toujours par rencontrer une erreur. Quelque chose ne fonctionne pas comme prévu. Ce n'est pas un échec de la méthode. C'est une étape normale. Ce chapitre enseigne comment y réagir efficacement. Plutôt que comment l'éviter à tout prix, ce qui serait illusoire. | Diapositive 2 : la phrase apparaît seule. Le texte d'appui apparaît au clic. | Clic à « Ce n'est pas un échec de la méthode ». |
| 0:41 | Première étape : lire le message d'erreur en entier. Pas seulement la première ligne, ni l'impression générale qu'on en a. Claude Code lit et interprète des messages d'erreur techniques bien plus vite qu'un humain qui découvre le sujet. Mais il faut lui donner le message complet. Pas un résumé approximatif de ce qui est passé à l'écran. | Diapositive 3, clic 1 : la carte « Lire le message ». | Clic au début du paragraphe. |
| 1:05 | Deuxième étape : isoler le problème. Est-ce que cela casse partout, ou seulement dans un cas précis ? Un certain type de donnée. Une certaine action. Un certain moment. Cette information oriente énormément la recherche de la cause. Et elle évite de chercher au mauvais endroit. | Diapositive 3, clic 2 : la carte « Isoler le problème ». | Clic au début du paragraphe. |
| 1:25 | Troisième étape : demander à l'agent de diagnostiquer avant de corriger. Plutôt que de lui demander directement : corrige ça. Comprendre la cause évite de masquer un symptôme sans régler le vrai problème. Un problème qui peut revenir plus tard, sous une autre forme. Parfois plus difficile à repérer la seconde fois. | Diapositive 3, clic 3 : la carte « Diagnostiquer avant de corriger ». | Clic au début du paragraphe. |
| 1:47 | Un exemple. Sur le projet fil rouge, un formulaire d'intake refuse tous les e-mails valides. Premier réflexe : donner à Claude Code le message d'erreur complet, affiché dans la console, l'endroit où s'affichent les erreurs. Pas juste : ça marche pas. Deuxième réflexe : vérifier si cela casse pour tous les e-mails, ou seulement pour certains formats précis. Par exemple, ceux qui contiennent un plus. Troisième réflexe : demander à l'agent de diagnostiquer la règle de validation, avant de la corriger à l'aveugle. Sinon, un correctif rapide masque le symptôme, sans régler la vraie cause. | Diapositive 4, un clic par réflexe (3 clics). | Un clic au début de chaque réflexe. |
| 2:28 | Pourquoi tester tôt coûte moins cher que tester tard. Un projet livré à un client, qui casse une fois en production, c'est-à-dire en ligne et utilisé par le client, coûte beaucoup plus cher en confiance. Bien plus qu'un bug détecté et corrigé pendant la construction. D'où l'importance de tester régulièrement. À chaque étape du workflow Plan, Execute, Validate. Pas seulement à la toute fin, quand il est déjà trop tard pour changer une décision structurelle. | Diapositive 5, clic 1 : la carte « Pendant la construction ». Clic 2 : la carte « Une fois en production ». | Clic 1 à « un bug détecté et corrigé pendant la construction ». Clic 2 à « un projet livré à un client ». |
| 3:00 | Retenons trois points. Toujours donner le message d'erreur complet, jamais un résumé approximatif. Isoler avant de corriger : partout, ou cas précis ? Et diagnostiquer la cause réelle, pas seulement faire disparaître le symptôme visible. Dans la prochaine vidéo, nous ouvrons la section sur la maîtrise de l'outil, avec les premiers pas, les outils principaux et les permissions. À tout de suite. | Diapositive 6 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**482 mots prononcés**, soit environ 3,4 minutes de voix, plus 0 secondes de manipulation à l'écran. **Durée estimée : 3:27**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source : une erreur est une étape normale et non un échec de la méthode ; les trois étapes (lire le message en entier, isoler, diagnostiquer avant de corriger) avec leurs justifications ; l'exemple du formulaire qui refuse les e-mails valides (message complet, tous les formats ou certains seulement, par exemple avec un « + », diagnostic de la règle de validation) ; tester tôt coûte moins cher que tester tard ; les trois points clés. Écarts : les définitions ajoutées pour « console » et « en production » (point 2 de la section 2), et le renvoi à la section suivante pour la prochaine vidéo.
