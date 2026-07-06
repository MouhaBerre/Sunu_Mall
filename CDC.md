SUNUMALL
UTILISATEURS 
Administrateur
L'administrateur est le super administrateur de la plateforme. Il dispose des attributs suivants : (id, nom, prénom, email, adresse, mot de passe, rôle).
Commerçant
Chaque commerçant dispose d'un compte avec les informations suivantes : (id, nom, prénom, numéro de téléphone, photo carte d’identité recto verso, adresse, rôle).
Livreur  
Chaque livreur dispose d'un compte avec les informations suivantes : (id, nom, prénom, mot de passe, numéro de téléphone, adresse, carte de d’identité, rôle).
Visiteur (client) 
Le visiteur un utilisateur non authentifié (c’est au moment de faire sa commande qu’il renseignera ses informations à savoir (nom, prénom, adresse numéro téléphone).  
NB : On distinguera 4 rôles authentifiés : ADMINISTRATEUR, COMMERCANT, CLIENT, LIVREUR.
Règles de Gestion des Comptes et Principales Fonctionnalités
	L'administrateur est l'acteur disposant du niveau de privilège le plus élevé dans le système.
	Chaque utilisateur peut s’authentifier avec son numéro de téléphone et son mot de passe.
	Seul l'administrateur est autorisé à valider ou rejeter une demande d'ouverture de boutique soumise par un commerçant.
	Seul l'administrateur peut suspendre ou supprimer un compte commerçant, client ou livreur.
	Le commerçant crée et gère les comptes de ses livreurs affiliés.
	Le client s’authentifie avec son numéro de téléphone.
	Chaque commerçant gère son propre catalogue produits (ajout, modification, suppression).
	Chaque commerçant affecte un livreur à chaque commande passée dans sa boutique.
	Un livreur est rattaché à un ou plusieurs commerçants ; il ne peut pas être affecté à une commande d'un commerçant auquel il n'est pas affilié.
	Le client peut passer des commandes dans plusieurs boutiques en même temps (panier multi-boutiques).
	Toute transaction de paiement doit être enregistrée dans une transaction respectant les propriétés ACID afin de garantir l'intégrité des données.
	La livraison ne peut être déclenchée qu'après confirmation du paiement.
	Le client reçoit des notifications en temps réel sur le statut de sa livraison (point de départ, en route et point d’arrivée, annulée).
	Si le client annule la commande (mise en place du politique de remboursement).
	Authentification OTP par téléphone lors de la création de compte du commerçant 
Relations Principales
	Chaque boutique appartient à un seul et unique commerçant.
	Une boutique contient zéro, un ou plusieurs produits.
	Chaque livreur est affilié à un ou plusieurs commandes.
	Chaque commande est assignée à un seul livreur.
	Chaque commande est passée par un seul client.
	Un client peut passer zéro, une ou plusieurs commandes.
	Chaque livreur peut prendre en charge zéro ou plusieurs commandes.
	Chaque livreur peut être affilié à un ou plusieurs commerçants.
	Chaque livreur peut effectuer zéro, une ou plusieurs livraisons.
	Chaque commande contient un ou plusieurs produits issus d'une même boutique.
	Chaque commande peut provenir d’un ou plusieurs boutiques.
	Chaque produit appartient à une seule ou plusieurs boutiques.
	Un client peut passer un ou plusieurs commandes.
	Chaque commande contient un ou plusieurs produits.
	Un commerçant peut ajouter un ou plusieurs produits.
	Un produit est affilié à un ou plusieurs commerçant. 
	Un produit est affilié à un ou plusieurs commandes.
	Un client est affilié à un livreur
	Le client reçoit les livraisons de ses commandes. 
Diagramme des Cas d'Utilisation
Administrateur
1.	Gérer les comptes utilisateurs (CRUD) ; impossible de consulter ou modifier les mots de passe
2.	Activer, suspendre ou supprimer un compte commerçant, client ou livreur
3.	Consulter les statistiques globales de la plateforme (ventes, commandes, utilisateurs actifs)
4.	Modérer les avis et signalements
Commerçant
1.	Créer et configurer sa boutique (nom, logo, bannière, description, catégorie)
2.	Gérer son catalogue produits (ajout, modification, suppression, gestion du stock)
3.	Gérer les comptes de ses livreurs affiliés (ajout, activation, désactivation)
4.	Consulter et traiter les commandes reçues
5.	Affecter un livreur à une commande
6.	Gérer ses promotions et codes de réduction
7.	Consulter son tableau de bord (chiffre d'affaires, commandes, produits les plus vendus)
8.	Communiquer avec les clients via la messagerie intégrée (live)
Visiteur (Client)
1.	Créer et gérer son compte personnel
2.	Parcourir les boutiques et rechercher des produits (par mot-clé, catégorie, prix, localisation)
3.	Consulter les fiches produites détaillées (Description et disponibilité du produit)
4.	Ajouter des produits au panier (multi-boutiques)
5.	Passer une commande et choisir le mode de paiement (Wave, Orange Money, carte bancaire)
6.	Suivre sa commande en temps réel
7.	Consulter l'historique de ses commandes
8.	Laisser un avis sur un produit ou une boutique
9.	Gérer sa liste de souhaits (Wishlist)
10.	Communiquer avec un commerçant via la messagerie intégrée (live)
Livreur
1.	Consulter les missions de livraison qui lui sont assignées
2.	Accepter ou refuser une mission de livraison selon sa disponibilité 
3.	Mettre à jour le statut de la livraison (Pris en charge, En route, Livré / Échec)
4.	Partager sa géolocalisation en temps réel avec le client
5.	Consulter l'historique de ses livraisons et le calcul de ses gains 

Politique de Livraison des commandes
________________________________________
1-Politique de Livraison, de Suivi et de Gestion des Retours
Politique de livraison
Zones de livraison
	La plateforme devra permettre de définir plusieurs zones de livraison. 
	Les frais de livraison seront calculés automatiquement selon la zone géographique. 
	Chaque boutique pourra proposer une ou plusieurs zones couvertes. 
________________________________________
2-Délais de livraison
Les délais estimatifs devront être communiqués au client avant la validation de la commande.
Ils varieront selon :
	la zone de livraison ; 
	la disponibilité du produit ; 
	le mode de livraison choisi. 
________________________________________
3-Modes de livraison
La plateforme devra proposer plusieurs modes de livraison tels que :
	livraison standard ; 
	livraison express ; 
	retrait en boutique (si disponible). 
________________________________________
4-Frais de livraison
Les frais de livraison seront calculés automatiquement selon :
	la zone de livraison ; 
	le mode de livraison choisi ; 
	les règles définies par le commerçant. 
________________________________________
5-Validation de la commande
Après réception d'une commande :
	le commerçant dispose de 24 à 48 heures pour accepter ou refuser la commande ; 
	tant que la commande n'est pas validée, elle reste au statut Précommande ; 
	une notification est envoyée au client après validation ou refus. 
________________________________________
6-Suivi des commandes
Le client pourra suivre sa commande en temps réel.
Les statuts de commande sont :
	Précommande 
	Préparation 
	Expédition 
	En cours de livraison 
	Livrée 
	Annulée 
	Retournée (si applicable) 
Chaque changement de statut déclenchera une notification.
________________________________________
7-Gestion des incidents de livraison
Client absent
Si le client est absent lors de la livraison :
	la commande est retournée au commerçant ; 
	le client pourra demander un remboursement du montant payé, à l'exception des frais de livraison ; 
	le remboursement sera effectué dans un délai maximal de 48 heures après validation. 
________________________________________
8-Colis perdu ou endommagé
En cas de perte ou de détérioration du colis imputable au transporteur :
	le client devra signaler le problème dans un délai maximal de 48 heures ; 
	une enquête sera ouverte ; 
	selon le résultat, un remplacement ou un remboursement sera effectué. 
________________________________________
9-Erreur sur la commande
Si le client reçoit un mauvais produit :
	remplacement du produit ; 
	ou remboursement intégral selon la décision du commerçant et la politique de retour. 
________________________________________
10-Adresse de livraison incorrecte
Lorsque l'adresse est erronée ou incomplète :
	le livreur tente de contacter le client ; 
	si la livraison reste impossible, la commande est retournée ; 
	les frais supplémentaires éventuels pourront être facturés au client. 
________________________________________
11-Politique de remboursement
Le remboursement pourra être effectué dans les cas suivants :
	commande annulée avant expédition ; 
	client absent (hors frais de livraison) ; 
	erreur de commande ; 
	produit perdu ou détérioré. 
Les remboursements seront effectués via le même moyen de paiement utilisé lors de l'achat (Wave, Orange Money ou carte bancaire), sauf décision contraire.
________________________________________
12-Notifications
La plateforme devra envoyer automatiquement des notifications lors :
	de la confirmation du paiement ; 
	de l'acceptation de la commande ; 
	de la préparation ; 
	de l'expédition ; 
	du départ du livreur ; 
	de l'arrivée du livreur ; 
	de la livraison ; 
	de l'annulation ; 
	du remboursement.


Système de gestion de la livraison
5.1 Objectif
Le système de livraison de SunuMall a pour objectif d'assurer une gestion efficace, sécurisée et traçable des livraisons entre les commerçants, les livreurs et les clients.
________________________________________
5.2 Fonctionnement général
1.	Le client passe une commande et effectue son paiement. 
2.	Le commerçant reçoit une notification de nouvelle commande. 
3.	Le commerçant dispose d'un délai de 24 à 48 heures pour confirmer ou refuser la commande. 
4.	Après validation, le commerçant prépare la commande et l'affecte à un livreur affilié. 
5.	Le livreur récupère le colis et met à jour les différents statuts de livraison. 
6.	Le client suit en temps réel l'évolution de sa commande jusqu'à sa réception. 
________________________________________
5.3 Conditions d'utilisation
a. Heures et dates de livraison
La plateforme devra permettre au client de sélectionner un créneau de livraison selon :
•	les jours disponibles ; 
•	les heures de livraison proposées ; 
•	la disponibilité du commerçant ; 
•	la disponibilité du livreur. 
________________________________________
b. Zones de livraison
Les zones de livraison devront être définies par la plateforme.
Les frais de livraison seront calculés automatiquement selon :
•	la zone géographique ; 
•	la distance entre la boutique et le client ; 
•	le mode de livraison choisi. 
________________________________________
c. Gestion des commandes multi-boutiques
Lorsqu'un client commande des produits provenant de plusieurs boutiques :
•	chaque boutique reçoit uniquement les produits qui lui appartiennent ; 
•	chaque commerçant prépare sa propre commande ; 
•	chaque commande peut être confiée à un livreur différent ou être regroupée selon des critères définis par la plateforme ; 
•	le client pourra suivre séparément l'état de chaque livraison. 
________________________________________
5.4 Suivi de la livraison
Le système devra permettre un suivi en temps réel.
Les différents statuts sont :
•	Précommande 
•	Préparation 
•	Prête à être récupérée 
•	Pris en charge par le livreur 
•	En cours de livraison 
•	Livrée 
•	Annulée 
•	Retournée 
À chaque changement de statut, une notification est envoyée au client.
________________________________________
5.5 Prévention des risques
Afin de garantir la qualité du service, la plateforme devra prévoir les mécanismes suivants :
•	vérification de l'identité des commerçants et des livreurs ; 
•	géolocalisation en temps réel des livreurs pendant la livraison ; 
•	confirmation de la réception de la commande par le client (code OTP ou signature électronique) ; 
•	historique complet des livraisons ; 
•	système de signalement en cas de perte, de retard ou de détérioration du colis ; 
•	gestion des remboursements conformément à la politique de retour. 
________________________________________
5.6 Interface de gestion de la livraison
Le système de gestion des livraisons s'inspirera des bonnes pratiques des plateformes de livraison telles que Yango, notamment pour :
•	l'affectation des livreurs ; 
•	le suivi GPS en temps réel ; 
•	les notifications automatiques ; 
•	l'affichage de l'itinéraire ; 
•	l'estimation du temps d'arrivée (ETA). 
________________________________________
6. Système de monétisation
6.1 Objectif
Le système de monétisation permettra à SunuMall de générer des revenus tout en offrant des services à valeur ajoutée aux commerçants et aux livreurs.
________________________________________
6.2 Commission sur les ventes
À chaque vente réalisée sur la plateforme, SunuMall prélèvera une commission sur le montant de la commande.
Le taux de commission pourra être fixé entre 5 % et 8 %, selon la politique commerciale de la plateforme.
________________________________________
6.3 Commission sur les livraisons
La plateforme prélèvera également une commission sur les frais de livraison.
Par exemple :
•	une partie des frais sera reversée au livreur ; 
•	la plateforme conservera une commission de gestion sur chaque livraison. 
Remarque : Je te déconseille de dire « 5 % pour le vendeur et 5 % pour le livreur » à ce stade. Il vaut mieux écrire que les taux de commission seront configurables par l'administrateur, ce qui vous permettra de les modifier sans changer le cahier des charges.
________________________________________
6.4 Mise en avant des produits
Les commerçants pourront payer pour promouvoir leurs produits ou leur boutique.
Les produits sponsorisés bénéficieront notamment :
•	d'un meilleur classement dans les résultats de recherche ; 
•	d'une meilleure visibilité sur la page d'accueil ; 
•	d'un badge « Sponsorisé » ou « Mis en avant ». 
________________________________________
6.5 Système d'abonnement
La plateforme proposera plusieurs formules d'abonnement destinées aux commerçants.
Offre Standard
•	accès aux fonctionnalités de base ; 
•	nombre limité de produits publiés. 
Offre Premium
•	augmentation du nombre de produits publiables ; 
•	statistiques avancées ; 
•	meilleure visibilité des produits ; 
•	accès prioritaire aux nouvelles fonctionnalités. 
Offre Premium+
•	publication d'un nombre plus élevé de produits ; 
•	tableau de bord analytique complet ; 
•	suivi en temps réel des ventes ; 
•	statistiques sur les produits les plus vendus ; 
•	statistiques sur les produits les mieux notés ; 
•	analyse des tendances de consommation sur SunuMall ; 
•	mise en avant prioritaire des produits. 
________________________________________
6.6 Tableau de bord analytique
Les commerçants abonnés aux offres Premium disposeront d'un tableau de bord permettant de consulter notamment :
•	les produits les plus vendus ; 
•	les produits les mieux notés ; 
•	les tendances de vente ; 
•	les statistiques de fréquentation.


