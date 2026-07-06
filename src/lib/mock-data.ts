export const CATEGORIES = [
  { name: "Mode & Boubou", icon: "shirt" },
  { name: "Électronique", icon: "smartphone" },
  { name: "Beauté & Bien-être", icon: "sparkles" },
  { name: "Maison & Déco", icon: "home" },
  { name: "Sport", icon: "dumbbell" },
  { name: "Informatique", icon: "laptop" },
  { name: "Alimentation", icon: "utensils" },
  { name: "Enfants & Bébé", icon: "baby" },
];

export const SHOPS = [
  { id: "s1", name: "Sandaga Fashion", area: "Marché Sandaga, Plateau", category: "Mode & Boubou", rating: 4.8, orders: 1240 },
  { id: "s2", name: "Sen'Tech Almadies", area: "Almadies, Dakar", category: "Électronique", rating: 4.7, orders: 2180 },
  { id: "s3", name: "Baay Faal Cosmétiques", area: "Sacré-Cœur 3", category: "Beauté & Bien-être", rating: 4.9, orders: 890 },
  { id: "s4", name: "Casamance Bio", area: "Mermoz, Dakar", category: "Alimentation", rating: 4.8, orders: 640 },
  { id: "s5", name: "Auchan Grand-Yoff", area: "Grand-Yoff", category: "Alimentation", rating: 4.5, orders: 3120 },
  { id: "s6", name: "Yoff Sport Shop", area: "Yoff-Layène", category: "Sport", rating: 4.6, orders: 410 },
];

export const PRODUCTS = [
  { id: "p1", name: "Infinix Hot 40 Pro — 256 Go", price: 129000, oldPrice: 155000, shop: "Sen'Tech Almadies", rating: 4.7, reviews: 342, stock: 24, badge: "-17%", sponsored: true },
  { id: "p2", name: "Boubou brodé Grand Sereer", price: 45000, shop: "Sandaga Fashion", rating: 4.9, reviews: 128, stock: 8, badge: "Nouveau" },
  { id: "p3", name: "Bissap sec bio — 500g", price: 2500, shop: "Casamance Bio", rating: 4.8, reviews: 89, stock: 60 },
  { id: "p4", name: "Huile de karité pure — 250ml", price: 4500, shop: "Baay Faal Cosmétiques", rating: 4.9, reviews: 412, stock: 45, sponsored: true },
  { id: "p5", name: "Xiaomi Redmi Note 13 — 128 Go", price: 115000, oldPrice: 135000, shop: "Sen'Tech Almadies", rating: 4.6, reviews: 256, stock: 12, badge: "-15%" },
  { id: "p6", name: "Tissu Wax authentique — 6 yards", price: 12000, shop: "Sandaga Fashion", rating: 4.7, reviews: 78, stock: 30 },
  { id: "p7", name: "Café Touba moulu — 250g", price: 1800, shop: "Casamance Bio", rating: 4.9, reviews: 210, stock: 120 },
  { id: "p8", name: "Chaussures Sabador cuir homme", price: 28000, shop: "Sandaga Fashion", rating: 4.5, reviews: 45, stock: 15 },
  { id: "p9", name: "Ballon Coupe d'Afrique 2025", price: 8500, shop: "Yoff Sport Shop", rating: 4.6, reviews: 92, stock: 40, sponsored: true },
  { id: "p10", name: "Savon noir africain — pack 3", price: 3500, shop: "Baay Faal Cosmétiques", rating: 4.8, reviews: 187, stock: 55 },
  { id: "p11", name: "Riz parfumé — sac 25 kg", price: 18500, shop: "Auchan Grand-Yoff", rating: 4.7, reviews: 640, stock: 200 },
  { id: "p12", name: "Kit mafé express — 4 personnes", price: 4200, shop: "Casamance Bio", rating: 4.8, reviews: 134, stock: 80 },
];

export const SHOPS_PENDING = [
  { name: "Ndar Beauté (Saint-Louis)", category: "Beauté & Bien-être", owner: "Aïssatou Ba", phone: "+221 77 512 34 56", date: "24/06/2026", status: "En attente" },
  { name: "Thiès Digital Market", category: "Électronique", owner: "Mamadou Diop", phone: "+221 76 421 88 09", date: "24/06/2026", status: "En attente" },
  { name: "Kaolack Épices & Saveurs", category: "Alimentation", owner: "Fatou Ndiaye", phone: "+221 78 622 71 44", date: "23/06/2026", status: "En attente" },
  { name: "Ziguinchor Artisanat", category: "Maison & Déco", owner: "Awa Sarr", phone: "+221 77 890 11 22", date: "22/06/2026", status: "En attente" },
];

export const ADMINS = [
  { name: "Ousmane Sall", email: "ousmane.sall@sunumall.sn", role: "Super Admin", status: "Actif" },
  { name: "Aminata Fall", email: "aminata.fall@sunumall.sn", role: "Admin", status: "Actif" },
  { name: "Moussa Guèye", email: "moussa.gueye@sunumall.sn", role: "Modérateur", status: "Actif" },
  { name: "Fatou Ndiaye", email: "fatou.ndiaye@sunumall.sn", role: "Support client", status: "Inactif" },
];

export const DRIVERS = [
  { id: "d1", name: "Modou Ndiaye", phone: "+221 77 512 88 44", zone: "Plateau · Médina", shops: ["Sandaga Fashion", "Sen'Tech Almadies"], deliveries: 342, rating: 4.9, status: "En course" },
  { id: "d2", name: "Cheikh Diallo", phone: "+221 76 210 55 32", zone: "Almadies · Yoff", shops: ["Sen'Tech Almadies"], deliveries: 218, rating: 4.8, status: "Disponible" },
  { id: "d3", name: "Ibrahima Sarr", phone: "+221 78 402 91 08", zone: "Parcelles · Guédiawaye", shops: ["Auchan Grand-Yoff", "Casamance Bio"], deliveries: 156, rating: 4.7, status: "Disponible" },
  { id: "d4", name: "Abdou Kane", phone: "+221 77 903 22 11", zone: "Pikine · Rufisque", shops: ["Auchan Grand-Yoff"], deliveries: 89, rating: 4.6, status: "Hors ligne" },
];

export const ORDERS_RECENT = [
  { id: "#CMD-1248", client: "Aminata Fall", date: "25/06/2026", total: 36000, status: "Livrée", driver: "Modou Ndiaye" },
  { id: "#CMD-1247", client: "Ousmane Sall", date: "24/06/2026", total: 19500, status: "Livrée", driver: "Cheikh Diallo" },
  { id: "#CMD-1246", client: "Fatou Ndiaye", date: "23/06/2026", total: 43000, status: "En cours", driver: "Modou Ndiaye" },
  { id: "#CMD-1245", client: "Mamadou Diop", date: "22/06/2026", total: 12500, status: "En cours", driver: "Ibrahima Sarr" },
  { id: "#CMD-1244", client: "Aïssatou Ba", date: "20/06/2026", total: 28000, status: "Annulée", driver: "—" },
];

export const NOTIFICATIONS = [
  { id: 1, type: "order", title: "Commande livrée", text: "Votre commande #CMD-1248 a été livrée par Modou.", time: "Il y a 5 min", read: false },
  { id: 2, type: "promo", title: "Promo -20% Sandaga Fashion", text: "Le week-end : -20% sur tous les boubous brodés.", time: "Il y a 1 h", read: false },
  { id: 3, type: "delivery", title: "Livreur en route", text: "Modou est en route vers Cité Keur Gorgui.", time: "Il y a 2 h", read: true },
  { id: 4, type: "system", title: "Nouveau live shopping", text: "Sandaga Fashion démarre un live dans 15 min.", time: "Hier", read: true },
];

export const ADDRESSES = [
  { label: "Domicile", line: "Cité Keur Gorgui, Villa N°23", city: "Dakar", zone: "Sacré-Cœur 3" },
  { label: "Bureau", line: "Immeuble Fahd, Place de l'Indépendance", city: "Dakar", zone: "Plateau" },
];

export const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
