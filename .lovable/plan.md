
# Refonte SUNU MALL — v2

Objectif : passer la maquette d'une V1 fonctionnelle à une V2 **premium, réaliste, et 100% alignée sur le cahier des charges** (4 rôles, panier multi-boutiques, workflow commande complet, monétisation).

## 1. Design premium (transversal)

- **Nouveau système d'ombres et de dégradés** dans `src/styles.css` : ombres colorées navy/orange, dégradés de fond hero, effet "glass" sur les cartes premium.
- **Micro-interactions** via classes utilitaires : `hover-lift` (cartes qui se soulèvent), `fade-in-up` à l'apparition, boutons orange avec effet de brillance au hover, transitions douces sur toute la navigation entre écrans.
- **Skeletons animés** sur les listes de produits/commandes pour donner l'impression d'app réelle.
- **Illustrations légères** (SVG inline) pour les états vides (panier vide, pas de notifications, boutique en attente).

## 2. Contenu sénégalais réaliste

Remplacer `mock-data.ts` par des données crédibles :
- **Boutiques réelles-plausibles** : "Tech World Dakar" → *Dakar Digital Store*, *Sandaga Fashion*, *Auchan Grand-Yoff*, *Le Petit Marché de Grand-Yoff*, *Baay Faal Cosmétiques*, *Casamance Bio*, *Sen'Tech Almadies*.
- **Produits typiques** : bissap, café Touba, tissu wax, boubou brodé, mafé kit, thiéboudienne surgelé, Infinix Hot 40, Itel A70, chaussures Sabador, montres CFA, huile de karité, savon noir.
- **Prix FCFA réalistes** (500 à 450 000 FCFA), **noms wolof/français**, **adresses Dakar** (Plateau, Almadies, Yoff, Ouakam, Mermoz, Sacré-Cœur, Parcelles Assainies, Guédiawaye, Pikine, Rufisque).
- **Clients** : Aminata Fall, Ousmane Sall, Fatou Ndiaye, Mamadou Diop, Aïssatou Ba.
- **Livreurs** : Modou Ndiaye, Cheikh Diallo, Ibrahima Sarr.

## 3. Nouveau rôle : LIVREUR (+3 écrans)

Absent des 28 écrans initiaux. Ajout de :
- **`/screens/driver-login`** — Connexion livreur par téléphone + mot de passe.
- **`/screens/driver-dashboard`** — Liste des courses assignées, statut (en attente / en cours / livrée), gains du jour, boutiques affiliées.
- **`/screens/driver-delivery`** — Détail d'une course : client, adresse GPS, articles, bouton "Démarrer" → "En route" → "Livré" + capture de signature/photo.

## 4. Écrans à refondre selon le CDC

- **Panier (`cart`)** : regroupement visuel **par boutique** (multi-boutiques), frais de livraison par boutique, total consolidé — élément clé du CDC.
- **Dashboard commerçant** : ajout d'un onglet **"Mes livreurs"** (créer/gérer les livreurs affiliés) et **"Affecter livreur"** sur chaque commande.
- **Dashboard admin** : ajout d'un panneau **"Commissions"** (taux vente 5-8% et taux livraison configurables), et actions **suspendre/supprimer** sur les comptes.
- **Recherche & Accueil** : badge **"Sponsorisé"** orange sur les produits mis en avant, tri "Sponsorisés d'abord".
- **Abonnements** : quotas de produits explicites par offre (Standard : 20 produits, Premium : 200, Premium+ : illimité), tableau comparatif clair.
- **Suivi GPS** : 4 statuts alignés CDC (point de départ / en route / point d'arrivée / annulée) + notifications temps réel visuelles.
- **Confirmation commande** : mention "livraison déclenchée après paiement confirmé" + statut ACID visible.

## 5. Landing d'accueil (page `/`)

Refonte de la galerie des 28 écrans en vraie **landing SUNU MALL** : hero avec baseline "La marketplace du Sénégal", 3 sections rôles (Client / Commerçant / Livreur), section abonnements, puis la galerie d'écrans en bas comme showcase du design.

## Ce qui NE change pas

- Reste 100% frontend/maquette, aucun backend (comme demandé initialement).
- Charte graphique conservée : navy `#0A163A`, orange `#FF8C00`, border-radius 12px, Poppins/Inter.
- Framework : TanStack Start (Next.js non supporté sur Lovable).

## Livrable

**31 écrans** au total (28 initiaux améliorés + 3 livreur), landing refondue, mock-data 100% sénégalaise, animations douces partout.

---

Dis-moi si je lance, ou si tu veux qu'on retire/ajuste quelque chose (par ex. démarrer par les écrans livreur + panier multi-boutiques seulement).
