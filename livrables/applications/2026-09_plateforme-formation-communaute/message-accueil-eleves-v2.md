# Message d'accueil, élèves après paiement (version 2, à relire)

> Remplace `message-accueil-eleves.md`, dont le texte « le contenu se déploie dans les prochaines semaines » est périmé : les sections de Vivier IA existent (accueil, installation des outils, cinq modules).
> Vouvoiement, phrases courtes. Aucune promesse sur ce qui n'existe pas : pas de vidéos de cours (elles ne sont pas enregistrées), pas de kits à télécharger (pas encore déposés), pas de Mobile Money.
> À mettre dans un nœud « Send Email » à la FIN du workflow de confirmation, jamais avant l'activation de l'accès.

## Variables n8n utilisées
- `{{ $json.pseudo }}` : renvoyé par la plateforme à la confirmation (repli si le prénom n'est pas disponible).
- `{{ $json.email }}` : adresse de l'élève, renvoyée par la plateforme.
- Lien de la plateforme : **à renseigner** (l'adresse publique n'est pas encore décidée : projet Vercel protégé, voir le suivi).

## Objet
Bienvenue chez Vivier IA, votre accès est activé

## Texte brut (toujours fournir cette version)
Bonjour {{ $json.pseudo }},

Votre paiement est confirmé et votre accès à la formation complète est activé. Merci pour votre confiance.

Pour bien démarrer, trois étapes, une dizaine de minutes :

1. Ouvrez la section « Bienvenue » : elle présente la formation et votre formateur.
2. Suivez « Installation des outils » : elle vous guide pas à pas pour préparer votre ordinateur.
3. Présentez-vous dans la communauté, pour que les autres membres vous connaissent.

Chaque chapitre se termine par un bloc « À faire maintenant » : un prompt ou une commande à copier, pour pratiquer tout de suite.

Accéder à la plateforme : [LIEN À RENSEIGNER]

Une question, un souci d'accès ? Répondez directement à cet e-mail.

Bienvenue à bord,
L'équipe Vivier IA

## Version HTML (même contenu)
```html
<p>Bonjour {{ $json.pseudo }},</p>
<p>Votre paiement est confirmé et votre accès à la formation complète est activé. Merci pour votre confiance.</p>
<p>Pour bien démarrer, trois étapes, une dizaine de minutes :</p>
<ol>
  <li>Ouvrez la section « Bienvenue » : elle présente la formation et votre formateur.</li>
  <li>Suivez « Installation des outils » : elle vous guide pas à pas pour préparer votre ordinateur.</li>
  <li>Présentez-vous dans la communauté, pour que les autres membres vous connaissent.</li>
</ol>
<p>Chaque chapitre se termine par un bloc « À faire maintenant » : un prompt ou une commande à copier, pour pratiquer tout de suite.</p>
<p><a href="[LIEN À RENSEIGNER]">Accéder à la plateforme</a></p>
<p>Une question, un souci d'accès ? Répondez directement à cet e-mail.</p>
<p>Bienvenue à bord,<br>L'équipe Vivier IA</p>
```

## Règles pour le faire correctement
1. **Dernier nœud du workflow** : l'accès est déjà activé quand l'e-mail part. Un échec d'envoi ne doit jamais défaire ni retarder l'activation.
2. **Nœud réglé sur « continuer en cas d'erreur »** (On Error : Continue). Le workflow d'erreur existant prévient Zézé si l'envoi échoue.
3. **Pas de doublon** : Chariow peut renvoyer le même événement. Vérifier dans les exécutions qu'un paiement ne déclenche qu'un seul e-mail.
4. **Identité d'envoi** : le SMTP actuel est un Gmail personnel (limite d'envoi par jour, expéditeur peu crédible). Suffisant pour démarrer, à changer pour une adresse de domaine quand le volume augmente.
5. **Aucun secret dans le message ni dans les journaux** : pas de mot de passe, pas de clé, pas de montant détaillé.
6. **Test sans vrai paiement** : rejouer le nœud d'envoi seul, avec les données d'une exécution passée et SA propre adresse, jamais celle d'un élève.
7. **Vérifier la réception** : boîte de réception ET courrier indésirable, sur au moins deux fournisseurs (Gmail et un autre).
