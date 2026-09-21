# Lancer vos premières campagnes

## Chapitre 1 : Créer sa séquence d'emails de prospection avec l'IA

### Le rôle de l'IA dans la rédaction d'une séquence

L'IA génère un premier jet de séquence à partir d'une description de l'offre et de la cible, ce qui accélère la rédaction, mais le prompt système et le gabarit à 4 éléments (Module 1 et Module 3, section 4) restent nécessaires pour obtenir un résultat exploitable plutôt qu'un texte générique.

### La structure d'une séquence efficace

Un premier email court qui accroche sur un problème précis du prospect, une relance à quelques jours d'intervalle qui apporte une information nouvelle (pas juste "je relance"), et un dernier message qui referme la porte proprement si aucune réponse n'arrive, plutôt que de continuer indéfiniment.

### Exemple concret

Pour une séquence ciblant des décideurs CAC40, un premier email pourrait accrocher sur un constat précis ("la majorité des entreprises de votre secteur n'ont pas encore structuré leur transformation IA"), suivi d'une relance qui apporte une preuve concrète (un cas client, un chiffre), avant un dernier message de clôture.

**Points clés**
- L'IA accélère la rédaction d'une séquence, mais un bon prompt (gabarit à 4 éléments) reste nécessaire pour un résultat exploitable
- Une séquence efficace accroche, relance avec une information nouvelle, puis referme proprement sans insister indéfiniment
- Chaque message doit apporter quelque chose de nouveau, pas seulement répéter la demande précédente

---

## Chapitre 2 : Créer sa première base de données via People Database

### Ce que People Database permet de faire

People Database recherche des prospects selon des critères précis (secteur, taille d'entreprise, poste occupé), directement dans l'interface Lemlist, sans avoir besoin d'un outil externe de scraping pour une première campagne simple.

### Filtrer avant d'exporter, pas après

La qualité d'une base de prospects dépend directement de la précision des filtres appliqués au moment de la recherche. Exporter une liste large et filtrer après coup demande plus de travail manuel et introduit plus d'erreurs qu'une recherche bien filtrée dès le départ.

### Exemple concret

Pour un cabinet de conseil, une recherche People Database viserait des décideurs (poste : direction générale, direction transformation digitale) dans des entreprises d'une taille correspondant au CAC40 ou à des grands comptes équivalents, plutôt qu'une liste générique de "décideurs" sans filtre de secteur ou de taille.

**Points clés**
- People Database recherche des prospects selon des critères précis directement dans Lemlist
- Filtrer précisément dès la recherche évite un travail manuel de nettoyage après coup
- La qualité d'une base dépend de la précision des filtres appliqués, pas seulement du volume obtenu

---

## Chapitre 3 : Créer et lancer sa première campagne (de A à Z)

### Le déroulé complet, du prospect au premier envoi

Importer ou rechercher la liste de prospects (chapitre 2), créer la séquence de messages (chapitre 1), configurer le rythme d'envoi (volume quotidien raisonnable, jamais un envoi massif d'un coup), et lancer la campagne en surveillant les premiers résultats de près.

### Pourquoi démarrer petit sur une première campagne

Une première campagne devrait tester la séquence sur un petit volume de prospects avant de généraliser, exactement le même principe que le MVP avant la V1 (Module 3, section 7) : valider que la séquence fonctionne réellement (taux d'ouverture correct, pas de plainte spam) avant d'exposer une base entière à un message qui n'a pas encore fait ses preuves.

### Installation pratique

**Lancer une première campagne test**
1. Dans Lemlist, créer une nouvelle campagne, y associer une liste de 20 à 50 prospects maximum pour ce premier test.
2. Configurer la séquence rédigée au chapitre 1, avec un volume d'envoi quotidien faible (quelques dizaines maximum, cohérent avec le score de warm-up atteint).
3. Lancer la campagne et surveiller quotidiennement le taux d'ouverture et de réponse pendant la première semaine, avant de décider d'élargir la liste.

**Points clés**
- Le déroulé complet : liste de prospects, séquence de messages, rythme d'envoi raisonnable, puis lancement
- Démarrer sur un petit volume applique le même principe que MVP avant V1, valider avant de généraliser
- Surveiller de près les premiers résultats avant d'élargir la campagne à toute la base

---

## Chapitre 4 : La suite, répondre aux emails, Tracking Sheet & CRM

### Ce qui se passe une fois les premières réponses reçues

Une campagne ne s'arrête jamais au moment de l'envoi : le suivi des réponses (qualifier chaud/froid, comme vu au Module 2, section 2, chapitre 6, sur la qualification commerciale) détermine la suite de la relation avec chaque prospect qui a répondu.

### Le rôle du Tracking Sheet et du CRM

Un Tracking Sheet centralise le statut de chaque prospect en cours de conversation, pour ne jamais perdre le fil d'un échange. Un CRM va plus loin en structurant tout le cycle de vie du prospect (une application de prospection en marketing de réseau applique exactement ce principe).

### Le point de connexion avec l'automatisation déjà vue

Un webhook n8n (Module 2) peut connecter Lemlist à un CRM ou à une base Supabase automatiquement dès qu'une réponse arrive, évitant une saisie manuelle répétitive à chaque nouvelle réponse.

**Points clés**
- Le suivi des réponses (qualification chaud/froid) détermine la suite de la relation avec chaque prospect
- Le Tracking Sheet centralise le statut de chaque conversation, le CRM structure le cycle de vie complet
- n8n peut automatiser la connexion entre Lemlist et un CRM dès qu'une réponse arrive, sans saisie manuelle répétitive

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi le prompt système reste-t-il nécessaire même quand l'IA génère la séquence ?
2. Pourquoi filtrer précisément dès la recherche People Database plutôt qu'après coup ?
3. Quel principe déjà vu au Module 3 justifie de démarrer une première campagne sur un petit volume ?
4. Donne un exemple d'outil qui illustre le principe d'un CRM appliqué à un besoin de prospection.

### Réflexion (synthèse de fin de section)
5. Rédige les grandes lignes (pas le texte complet) d'une séquence de 3 messages pour une campagne de ton activité, en identifiant ce que chaque message apporte de nouveau.
