export const CATEGORIES = [
  { name: "Téléphones", icon: "smartphone", count: 320, image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=300&auto=format&fit=crop" },
  { name: "Mode", icon: "shirt", count: 1200, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=300&auto=format&fit=crop" },
  { name: "Alimentation", icon: "utensils", count: 450, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300&auto=format&fit=crop" },
  { name: "Beauté", icon: "sparkles", count: 890, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=300&auto=format&fit=crop" },
  { name: "Maison", icon: "home", count: 340, image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=300&auto=format&fit=crop" },
  { name: "Informatique", icon: "laptop", count: 180, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300&auto=format&fit=crop" },
  { name: "Automobile", icon: "car", count: 220, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=300&auto=format&fit=crop" },
  { name: "Plus", icon: "package", count: 999 },
];

/** Maps a homepage category display name to the product `category` tag(s) it should show. */
export const CATEGORY_PRODUCT_MAP: Record<string, string[]> = {
  "Téléphones": ["Électronique"],
  "Mode": ["Mode & Boubou"],
  "Alimentation": ["Alimentation"],
  "Beauté": ["Beauté & Bien-être"],
  "Maison": ["Maison & Déco"],
  "Informatique": ["Informatique"],
  "Automobile": ["Automobile"],
  "Plus": [],
};

const ACCENTS: Record<string, string> = {
  à: "a", â: "a", ä: "a", á: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  î: "i", ï: "i",
  ô: "o", ö: "o",
  ù: "u", û: "u", ü: "u",
  ç: "c",
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((ch) => ACCENTS[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const SHOPS = [
  { id: "s1", name: "Sandaga Fashion", area: "Marché Sandaga, Plateau", category: "Mode & Boubou", rating: 4.8, orders: 1240 },
  { id: "s2", name: "Sen'Tech Almadies", area: "Almadies, Dakar", category: "Électronique", rating: 4.7, orders: 2180 },
  { id: "s3", name: "Baay Faal Cosmétiques", area: "Sacré-Cœur 3", category: "Beauté & Bien-être", rating: 4.9, orders: 890 },
  { id: "s4", name: "Casamance Bio", area: "Mermoz, Dakar", category: "Alimentation", rating: 4.8, orders: 640 },
  { id: "s5", name: "Auchan Grand-Yoff", area: "Grand-Yoff", category: "Alimentation", rating: 4.5, orders: 3120 },
  { id: "s6", name: "Yoff Sport Shop", area: "Yoff-Layène", category: "Sport", rating: 4.6, orders: 410 },
];

export type Boutique = {
  slug: string;
  nom: string;
  tagline: string;
  description: string;
  categorie: string;
  ville: string;
  adresse: string;
  telephone: string;
  email: string;
  logoInitials: string;
  logoIcon: string;
  logoColor: string;
  bannerImage: string;
  estOfficielle: boolean;
  estVerifiee: boolean;
  estNouvelle: boolean;
  note: number;
  nbAvis: number;
  nbAbonnes: string;
  avisPositifs: number;
  tempsReponse: string;
  dateOuverture: string;
  horaires: string;
};

export const BOUTIQUES: Boutique[] = [
  {
    slug: "sen-tech-almadies", nom: "Sen'Tech Almadies", tagline: "Vos produits tech préférés au meilleur prix !",
    description: "Sen'Tech Almadies est votre destination n°1 pour tous vos besoins en produits électroniques et accessoires. Nous offrons des produits de qualité, authentiques et au meilleur prix, avec une livraison rapide partout au Sénégal.",
    categorie: "Électronique", ville: "Dakar", adresse: "Route des Almadies, Dakar", telephone: "+221 77 123 45 67", email: "contact@sentech.sn",
    logoInitials: "ST", logoIcon: "Smartphone", logoColor: "#1E3A8A", bannerImage: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200&auto=format&fit=crop",
    estOfficielle: true, estVerifiee: true, estNouvelle: false,
    note: 4.7, nbAvis: 1256, nbAbonnes: "12.5K", avisPositifs: 98, tempsReponse: "2h", dateOuverture: "Mars 2022", horaires: "Lundi – Samedi : 08h – 20h · Dimanche : 10h – 18h",
  },
  {
    slug: "sandaga-fashion", nom: "Sandaga Fashion", tagline: "La mode sénégalaise authentique, du wax au boubou.",
    description: "Sandaga Fashion vous propose le meilleur de la mode africaine : boubous brodés, tissus wax authentiques, accessoires et chaussures. Confection soignée et livraison partout au Sénégal.",
    categorie: "Mode & Boubou", ville: "Dakar", adresse: "Marché Sandaga, Plateau", telephone: "+221 76 421 88 09", email: "contact@sandagafashion.sn",
    logoInitials: "SF", logoIcon: "Shirt", logoColor: "#F5560E", bannerImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
    estOfficielle: true, estVerifiee: true, estNouvelle: false,
    note: 4.8, nbAvis: 982, nbAbonnes: "8.2K", avisPositifs: 97, tempsReponse: "1h", dateOuverture: "Janvier 2021", horaires: "Lundi – Samedi : 09h – 21h",
  },
  {
    slug: "casamance-bio", nom: "Casamance Bio", tagline: "Le naturel et le bio, directement du terroir.",
    description: "Casamance Bio sélectionne pour vous des produits alimentaires bio et locaux : bissap, café Touba, kits de plats traditionnels. Des saveurs authentiques du Sénégal, livrées fraîches.",
    categorie: "Alimentation", ville: "Dakar", adresse: "Mermoz, Dakar", telephone: "+221 78 622 71 44", email: "contact@casamancebio.sn",
    logoInitials: "CB", logoIcon: "Leaf", logoColor: "#22C55E", bannerImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
    estOfficielle: false, estVerifiee: true, estNouvelle: false,
    note: 4.8, nbAvis: 876, nbAbonnes: "5.4K", avisPositifs: 96, tempsReponse: "3h", dateOuverture: "Mai 2022", horaires: "Lundi – Vendredi : 08h – 19h",
  },
  {
    slug: "baay-faal-cosmetiques", nom: "Baay Faal Cosmétiques", tagline: "La beauté au naturel, made in Sénégal.",
    description: "Baay Faal Cosmétiques propose des soins naturels : huile de karité pure, savon noir africain et produits de bien-être fabriqués localement. Beauté authentique et responsable.",
    categorie: "Beauté & Bien-être", ville: "Dakar", adresse: "Sacré-Cœur 3, Dakar", telephone: "+221 77 512 34 56", email: "contact@baayfaal.sn",
    logoInitials: "BF", logoIcon: "Sparkles", logoColor: "#DB2777", bannerImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    estOfficielle: true, estVerifiee: true, estNouvelle: false,
    note: 4.9, nbAvis: 754, nbAbonnes: "9.1K", avisPositifs: 99, tempsReponse: "1h", dateOuverture: "Février 2023", horaires: "Tous les jours : 09h – 20h",
  },
  {
    slug: "auchan-grand-yoff", nom: "Auchan Grand-Yoff", tagline: "Vos courses du quotidien, au meilleur prix.",
    description: "Auchan Grand-Yoff, votre grande surface en ligne : riz, produits frais et essentiels du quotidien. Un large choix livré rapidement chez vous.",
    categorie: "Alimentation", ville: "Dakar", adresse: "Grand-Yoff, Dakar", telephone: "+221 33 869 00 00", email: "contact@auchan-gy.sn",
    logoInitials: "AU", logoIcon: "ShoppingCart", logoColor: "#DC2626", bannerImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
    estOfficielle: true, estVerifiee: true, estNouvelle: false,
    note: 4.5, nbAvis: 3120, nbAbonnes: "24K", avisPositifs: 94, tempsReponse: "4h", dateOuverture: "Août 2020", horaires: "Tous les jours : 08h – 22h",
  },
  {
    slug: "yoff-sport-shop", nom: "Yoff Sport Shop", tagline: "Tout pour le sport et les supporters des Lions.",
    description: "Yoff Sport Shop équipe les sportifs et supporters : maillots officiels du Sénégal, ballons, accessoires de fitness. Vibrez pour les Lions avec du matériel de qualité.",
    categorie: "Sport", ville: "Dakar", adresse: "Yoff-Layène, Dakar", telephone: "+221 77 903 22 11", email: "contact@yoffsport.sn",
    logoInitials: "YS", logoIcon: "Dumbbell", logoColor: "#0EA5E9", bannerImage: "https://images.unsplash.com/photo-1580087433295-ab2600c1030e?q=80&w=1200&auto=format&fit=crop",
    estOfficielle: false, estVerifiee: true, estNouvelle: true,
    note: 4.6, nbAvis: 512, nbAbonnes: "3.8K", avisPositifs: 95, tempsReponse: "2h", dateOuverture: "Juin 2024", horaires: "Lundi – Samedi : 10h – 20h",
  },
];

export type BoutiqueReview = {
  id: number;
  client: string;
  initiales: string;
  note: number;
  commentaire: string;
  achatVerifie: boolean;
  date: string;
  reponseVendeur: string | null;
};

const REVIEW_POOL: BoutiqueReview[] = [
  { id: 1, client: "Mamadou B.", initiales: "MB", note: 5, commentaire: "Excellent service ! Livraison rapide et produit conforme à la description. Je recommande vivement cette boutique.", achatVerifie: true, date: "Il y a 2 jours", reponseVendeur: "Merci Mamadou pour votre confiance ! À très bientôt sur SUNU MALL." },
  { id: 2, client: "Awa N.", initiales: "AN", note: 5, commentaire: "Produit de très bonne qualité, exactement comme sur les photos. Vendeur à l'écoute et réactif.", achatVerifie: true, date: "Il y a 5 jours", reponseVendeur: null },
  { id: 3, client: "Cheikh D.", initiales: "CD", note: 4, commentaire: "Bon rapport qualité-prix. La livraison a pris un jour de plus que prévu mais rien de grave.", achatVerifie: true, date: "Il y a 1 semaine", reponseVendeur: "Merci pour votre retour, nous améliorons nos délais !" },
  { id: 4, client: "Fatou S.", initiales: "FS", note: 5, commentaire: "Ma boutique préférée sur Sunu Mall. Toujours des produits authentiques et un service impeccable.", achatVerifie: true, date: "Il y a 2 semaines", reponseVendeur: null },
  { id: 5, client: "Ibrahima F.", initiales: "IF", note: 4, commentaire: "Satisfait de mon achat. Emballage soigné. Je reviendrai.", achatVerifie: false, date: "Il y a 3 semaines", reponseVendeur: null },
];

export function getBoutique(slug: string): Boutique | undefined {
  return BOUTIQUES.find((b) => b.slug === slug);
}

export function getBoutiqueProducts(slug: string) {
  const b = getBoutique(slug);
  if (!b) return [];
  return PRODUCTS.filter((p) => p.shop === b.nom);
}

export function getBoutiqueCategories(slug: string) {
  const products = getBoutiqueProducts(slug);
  const map = new Map<string, number>();
  for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
  return [...map.entries()].map(([nom, compteur]) => ({ nom, compteur }));
}

export function getBoutiqueReviews(slug: string): BoutiqueReview[] {
  const b = getBoutique(slug);
  if (!b) return REVIEW_POOL;
  // Deterministic slice so each boutique shows a stable subset.
  const start = b.slug.charCodeAt(0) % 2;
  return [...REVIEW_POOL.slice(start), ...REVIEW_POOL.slice(0, start)];
}

/** Rating distribution (1★→5★) as percentages, derived deterministically from the boutique note. */
export function getRatingBreakdown(note: number): Record<number, number> {
  if (note >= 4.7) return { 5: 85, 4: 10, 3: 3, 2: 1, 1: 1 };
  if (note >= 4.4) return { 5: 72, 4: 18, 3: 6, 2: 2, 1: 2 };
  return { 5: 60, 4: 22, 3: 10, 2: 5, 1: 3 };
}

export type LiveStream = {
  id: string;
  boutiqueSlug: string;
  titre: string;
  viewers: string;
  likes: string;
  categorie: string;
  thumbnail: string;
  statut: "live" | "a_venir";
  populaire: boolean;
};

export const LIVE_STREAMS: LiveStream[] = [
  { id: "l1", boutiqueSlug: "sen-tech-almadies", titre: "Smartphones & Galaxy en promo !", viewers: "2.5K", likes: "1.2K", categorie: "Électronique", thumbnail: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=600&auto=format&fit=crop", statut: "live", populaire: true },
  { id: "l2", boutiqueSlug: "sandaga-fashion", titre: "Nouvelle collection wax été", viewers: "1.8K", likes: "940", categorie: "Mode & Boubou", thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop", statut: "live", populaire: true },
  { id: "l3", boutiqueSlug: "yoff-sport-shop", titre: "Équipement des Lions du Sénégal", viewers: "1.2K", likes: "780", categorie: "Sport", thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop", statut: "live", populaire: true },
  { id: "l4", boutiqueSlug: "auchan-grand-yoff", titre: "Offres courses du jour", viewers: "980", likes: "410", categorie: "Alimentation", thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop", statut: "live", populaire: false },
  { id: "l5", boutiqueSlug: "baay-faal-cosmetiques", titre: "Routine beauté au naturel", viewers: "876", likes: "530", categorie: "Beauté & Bien-être", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop", statut: "live", populaire: true },
  { id: "l6", boutiqueSlug: "casamance-bio", titre: "Produits bio en direct", viewers: "654", likes: "300", categorie: "Alimentation", thumbnail: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=600&auto=format&fit=crop", statut: "a_venir", populaire: false },
];

export const LIVE_CHAT = [
  { user: "Awa_Sn", initiales: "AS", text: "C'est combien le prix ?" },
  { user: "Moussa_221", initiales: "MO", text: "Livraison à Dakar ?" },
  { user: "Fatou_Beauté", initiales: "FB", text: "Tellement beau 😍😍" },
  { user: "Alioune_Pro", initiales: "AP", text: "Est-ce qu'il y a la garantie ?" },
];

export function getLiveStream(id: string) {
  return LIVE_STREAMS.find((l) => l.id === id);
}

export const PRODUCTS = [
  { id: "p1", name: "Infinix Hot 40 Pro — 256 Go", price: 129000, oldPrice: 155000, shop: "Sen'Tech Almadies", rating: 4.7, reviews: 342, stock: 24, badge: "-17%", sponsored: true, category: "Électronique", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop" },
  { id: "p2", name: "Boubou brodé Grand Sereer", price: 45000, shop: "Sandaga Fashion", rating: 4.9, reviews: 128, stock: 8, badge: "Nouveau", category: "Mode & Boubou", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop" },
  { id: "p3", name: "Bissap sec bio — 500g", price: 2500, shop: "Casamance Bio", rating: 4.8, reviews: 89, stock: 60, category: "Alimentation", image: "https://images.unsplash.com/photo-1579705745811-a32bef7856a3?q=80&w=600&auto=format&fit=crop" },
  { id: "p4", name: "Huile de karité pure — 250ml", price: 4500, shop: "Baay Faal Cosmétiques", rating: 4.9, reviews: 412, stock: 45, sponsored: true, category: "Beauté & Bien-être", image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600&auto=format&fit=crop" },
  { id: "p5", name: "Xiaomi Redmi Note 13 — 128 Go", price: 115000, oldPrice: 135000, shop: "Sen'Tech Almadies", rating: 4.6, reviews: 256, stock: 12, badge: "-15%", category: "Électronique", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop" },
  { id: "p6", name: "Tissu Wax authentique — 6 yards", price: 12000, shop: "Sandaga Fashion", rating: 4.7, reviews: 78, stock: 30, category: "Mode & Boubou", image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=600&auto=format&fit=crop" },
  { id: "p7", name: "Café Touba moulu — 250g", price: 1800, shop: "Casamance Bio", rating: 4.9, reviews: 210, stock: 120, category: "Alimentation", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop" },
  { id: "p8", name: "Chaussures Sabador cuir homme", price: 28000, oldPrice: 34000, shop: "Sandaga Fashion", rating: 4.5, reviews: 45, stock: 15, badge: "-18%", category: "Mode & Boubou", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop" },
  { id: "p9", name: "Ballon Coupe d'Afrique 2025", price: 8500, shop: "Yoff Sport Shop", rating: 4.6, reviews: 92, stock: 40, sponsored: true, category: "Sport", image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=600&auto=format&fit=crop" },
  { id: "p10", name: "Savon noir africain — pack 3", price: 3500, oldPrice: 4500, shop: "Baay Faal Cosmétiques", rating: 4.8, reviews: 187, stock: 55, badge: "-22%", category: "Beauté & Bien-être", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=600&auto=format&fit=crop" },
  { id: "p11", name: "Riz parfumé — sac 25 kg", price: 18500, shop: "Auchan Grand-Yoff", rating: 4.7, reviews: 640, stock: 200, category: "Alimentation", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop" },
  { id: "p12", name: "Kit mafé express — 4 personnes", price: 4200, shop: "Casamance Bio", rating: 4.8, reviews: 134, stock: 80, category: "Alimentation", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop" },
  { id: "p13", name: "Maillot de football Sénégal", price: 12000, oldPrice: 16000, shop: "Yoff Sport Shop", rating: 4.8, reviews: 234, stock: 56, badge: "-25%", category: "Sport", image: "https://images.unsplash.com/photo-1580087433295-ab2600c1030e?q=80&w=600&auto=format&fit=crop" },
  { id: "p14", name: "Ordinateur portable Dell Inspiron", price: 450000, oldPrice: 520000, shop: "Sen'Tech Almadies", rating: 4.5, reviews: 98, stock: 8, badge: "-13%", category: "Informatique", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop" },
  { id: "p15", name: "Set de bijoux traditionnels", price: 35000, shop: "Sandaga Fashion", rating: 4.9, reviews: 76, stock: 20, sponsored: true, category: "Mode & Boubou", image: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?q=80&w=600&auto=format&fit=crop" },
  { id: "p16", name: "Gombo frais — 1 kg", price: 1500, oldPrice: 2000, shop: "Auchan Grand-Yoff", rating: 4.7, reviews: 456, stock: 150, badge: "-25%", category: "Alimentation", image: "https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?q=80&w=600&auto=format&fit=crop" },
  { id: "p17", name: "Casque Bluetooth JBL", price: 35000, oldPrice: 45000, shop: "Sen'Tech Almadies", rating: 4.6, reviews: 187, stock: 32, badge: "-22%", category: "Électronique", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop" },
  { id: "p18", name: "Ensemble enfant wax", price: 15000, shop: "Sandaga Fashion", rating: 4.8, reviews: 67, stock: 25, category: "Enfants & Bébé", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop" },
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

/** Mock test accounts — frontend only, no real backend. */
export type TestAccount = {
  role: "client" | "vendeur" | "livreur" | "admin";
  name: string;
  email: string;
  password: string;
  redirect: string;
  label: string;
  description: string;
};

export const TEST_ACCOUNTS: TestAccount[] = [
  { role: "client", name: "Awa Ndiaye", email: "client@sunumall.sn", password: "client123", redirect: "/", label: "Client", description: "Acheteur — panier, favoris, commandes" },
  { role: "vendeur", name: "Ousmane Diop", email: "vendeur@sunumall.sn", password: "vendeur123", redirect: "/merchant", label: "Vendeur", description: "Boutique — produits, commandes, stats" },
  { role: "livreur", name: "Modou Ndiaye", email: "livreur@sunumall.sn", password: "livreur123", redirect: "/driver-dashboard", label: "Livreur", description: "Courses assignées, itinéraire" },
  { role: "admin", name: "Admin Sunu", email: "admin@sunumall.sn", password: "admin123", redirect: "/admin", label: "Admin", description: "Supervision de la marketplace" },
];

export function findTestAccount(email: string, password: string) {
  return TEST_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  );
}

export type Product = (typeof PRODUCTS)[number];

/** Discount percentage of a product, or 0 if no promo price. */
export function getDiscount(p: { price: number; oldPrice?: number }) {
  return p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
}

/** All products currently on promotion (with a strike-through old price). */
export function getPromoProducts() {
  return PRODUCTS.filter((p) => p.oldPrice);
}
