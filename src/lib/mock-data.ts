export const CATEGORIES = [
  { name: "Mode", icon: "shirt" },
  { name: "Électronique", icon: "smartphone" },
  { name: "Beauté", icon: "sparkles" },
  { name: "Maison", icon: "home" },
  { name: "Sport", icon: "dumbbell" },
  { name: "Informatique", icon: "laptop" },
  { name: "Alimentaire", icon: "utensils" },
  { name: "Enfants", icon: "baby" },
];

export const PRODUCTS = [
  { id: "p1", name: "Casque Bluetooth Sans Fil Pro", price: 18500, oldPrice: 25000, shop: "Tech World Dakar", rating: 4.8, reviews: 234, stock: 15, badge: "-26%" },
  { id: "p2", name: "Casque Gaming RGB Ultra", price: 22000, shop: "GameZone SN", rating: 4.6, reviews: 128, stock: 8 },
  { id: "p3", name: "Casque Sport Étanche", price: 15900, shop: "Fitness Dakar", rating: 4.7, reviews: 89, stock: 22, badge: "Nouveau" },
  { id: "p4", name: "Casque Studio Premium", price: 32000, shop: "Audio Sénégal", rating: 4.9, reviews: 412, stock: 5 },
  { id: "p5", name: "Montre Connectée X1", price: 25000, shop: "Tech World Dakar", rating: 4.5, reviews: 156, stock: 12 },
  { id: "p6", name: "Sac à Main Cuir Femme", price: 19000, shop: "Fashion Dakar", rating: 4.8, reviews: 78, stock: 18 },
  { id: "p7", name: "Chaussures Sport Running", price: 20000, shop: "Fitness Dakar", rating: 4.6, reviews: 210, stock: 0 },
  { id: "p8", name: "Lunettes de Soleil Aviator", price: 7000, shop: "Fashion Dakar", rating: 4.4, reviews: 45, stock: 30 },
];

export const SHOPS_PENDING = [
  { name: "Boutique Fashion Dakar", category: "Mode", owner: "Aminata Fall", date: "24/06/2026", status: "En attente" },
  { name: "TechWorld Sénégal", category: "Électronique", owner: "Ousmane Diop", date: "24/06/2026", status: "En attente" },
  { name: "Maison & Déco", category: "Maison", owner: "Fatou Ndiaye", date: "23/06/2026", status: "En attente" },
  { name: "Beauty Center", category: "Beauté", owner: "Awa Sarr", date: "22/06/2026", status: "En attente" },
];

export const ADMINS = [
  { name: "Ousmane Diop", email: "ousmane@sunumall.sn", role: "Super Admin", status: "Actif" },
  { name: "Aminata Fall", email: "aminata@sunumall.sn", role: "Admin", status: "Actif" },
  { name: "Moussa Gueye", email: "moussa@sunumall.sn", role: "Modérateur", status: "Actif" },
  { name: "Fatou Ndiaye", email: "fatou@sunumall.sn", role: "Support", status: "Inactif" },
];

export const ORDERS_RECENT = [
  { id: "#CMD-1248", date: "25/06/2026", total: 36000, status: "Livrée" },
  { id: "#CMD-1247", date: "24/06/2026", total: 19500, status: "Livrée" },
  { id: "#CMD-1246", date: "23/06/2026", total: 43000, status: "En cours" },
  { id: "#CMD-1245", date: "22/06/2026", total: 12500, status: "En cours" },
  { id: "#CMD-1244", date: "20/06/2026", total: 28000, status: "Annulée" },
];

export const NOTIFICATIONS = [
  { id: 1, type: "order", title: "Commande livrée", text: "Votre commande #CMD-1248 a été livrée.", time: "Il y a 5 min", read: false },
  { id: 2, type: "promo", title: "Promo -20% sur la Mode", text: "Profitez de -20% sur toute la catégorie Mode.", time: "Il y a 1 h", read: false },
  { id: 3, type: "delivery", title: "Livreur en route", text: "Modou est en route vers votre adresse.", time: "Il y a 2 h", read: true },
  { id: 4, type: "system", title: "Nouveau live shopping", text: "Fashion Dakar démarre un live dans 15 min.", time: "Hier", read: true },
];

export const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
