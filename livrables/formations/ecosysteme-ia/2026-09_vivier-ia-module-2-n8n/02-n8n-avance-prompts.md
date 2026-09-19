# Fiche pratique — Vrais prompts, n8n avancé

> Compagnon de [02-n8n-avance.md](02-n8n-avance.md). Des prompts réels pour demander à Claude Code de construire ou auditer un workflow n8n, en s'appuyant sur la skill `using-n8n-mcp-skills` déjà disponible dans cet environnement.

---

## Configurer un HTTP Request sur une vraie API

```
J'ai besoin d'un nœud HTTP Request dans n8n pour récupérer la liste des
contacts depuis [nom du service, avec un lien vers sa documentation API].
Avant de configurer quoi que ce soit, lis la documentation de
l'authentification et de la pagination de cette API, et dis-moi ce que tu
as compris avant de créer le nœud. Teste d'abord sur un seul appel, pas
sur toute la liste d'un coup.
```

## Extraire une logique répétée en sous-workflow

```
J'ai la même séquence de vérification d'email qui revient dans 3
workflows différents. Crée un sous-workflow "Verifier-Email-Prospect"
qui prend un email en entrée, vérifie son format, et renvoie un champ
"email_valide" (true/false). Définis clairement ce que ce sous-workflow
attend en entrée, pour que les 3 workflows appelants puissent l'utiliser
sans ambiguïté. N'oublie pas de mettre à jour les 3 workflows pour qu'ils
appellent ce sous-workflow plutôt que de garder leur propre copie.
```

## Ajouter une gestion d'erreur qui prévient réellement

```
Ce workflow de qualification de demandes commerciales n'a aucune
gestion d'erreur : si un nœud échoue, la demande est perdue sans que
personne ne le sache. Ajoute un Error Trigger qui envoie une
notification [email ou Slack, précise le canal] dès qu'un échec se
produit, avec le contenu de la demande concernée pour qu'on puisse la
traiter manuellement si besoin. Vérifie explicitement que ce filet de
sécurité fonctionne en simulant un échec, ne te contente pas de
supposer que la configuration est correcte.
```

---

## Exercice pour l'apprenant

Reprends le workflow de qualification commerciale de l'atelier (chapitre 6). Écris les 3 prompts ci-dessus adaptés à ce workflow précis, dans l'ordre : d'abord la configuration de l'appel API de qualification, puis l'extraction d'une partie réutilisable en sous-workflow, puis la gestion d'erreur. Lance-les réellement sur une instance n8n si tu en as une, sinon garde-les prêts pour quand tu en auras besoin.
