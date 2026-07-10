export interface ScreenMeta {
  id: string;
  num: string;
  title: string;
  category: "Onboarding" | "Admin" | "Commerçant" | "Livreur" | "Marketplace" | "Checkout" | "Post-commande" | "Premium";
  device: "mobile" | "desktop" | "both";
  path: string;
}

export const SCREENS: ScreenMeta[] = [
  { id: "splash",              num: "01", title: "Splash Screen",              category: "Onboarding",     device: "mobile",  path: "/splash" },
  { id: "login",               num: "02", title: "Connexion",                  category: "Onboarding",     device: "both",    path: "/login" },
  { id: "register-client",     num: "03", title: "Inscription Client",         category: "Onboarding",     device: "both",    path: "/register-client" },
  { id: "register-merchant",   num: "04", title: "Inscription Commerçant",     category: "Onboarding",     device: "desktop", path: "/register-merchant" },
  { id: "verify-email",        num: "05", title: "Vérification Email",         category: "Onboarding",     device: "both",    path: "/verify-email" },
  { id: "admin",               num: "06", title: "Dashboard Administrateur",   category: "Admin",          device: "desktop", path: "/admin" },
  { id: "admin-managers",      num: "07", title: "Gestion des Administrateurs",category: "Admin",          device: "desktop", path: "/admin-managers" },
  { id: "admin-shops",         num: "08", title: "Validation des Boutiques",   category: "Admin",          device: "desktop", path: "/admin-shops" },
  { id: "create-shop",         num: "09", title: "Création d'une Boutique",    category: "Commerçant",     device: "desktop", path: "/create-shop" },
  { id: "merchant",            num: "10", title: "Dashboard Commerçant",       category: "Commerçant",     device: "desktop", path: "/merchant" },
  { id: "add-product",         num: "11", title: "Ajout de Produit",           category: "Commerçant",     device: "desktop", path: "/add-product" },
  { id: "catalog",             num: "12", title: "Gestion du Catalogue",       category: "Commerçant",     device: "desktop", path: "/catalog" },
  { id: "driver-login",        num: "13", title: "Connexion Livreur",          category: "Livreur",        device: "mobile",  path: "/driver-login" },
  { id: "driver-dashboard",    num: "14", title: "Courses du Livreur",         category: "Livreur",        device: "mobile",  path: "/driver-dashboard" },
  { id: "driver-delivery",     num: "15", title: "Détail d'une Course",        category: "Livreur",        device: "mobile",  path: "/driver-delivery" },
  { id: "home",                num: "16", title: "Accueil Marketplace",        category: "Marketplace",    device: "both",    path: "/home" },
  { id: "search",              num: "17", title: "Résultats de Recherche",     category: "Marketplace",    device: "desktop", path: "/search" },
  { id: "product",             num: "18", title: "Fiche Produit",              category: "Marketplace",    device: "both",    path: "/product" },
  { id: "wishlist",            num: "19", title: "Wishlist",                   category: "Marketplace",    device: "both",    path: "/wishlist" },
  { id: "cart",                num: "20", title: "Panier Multi-boutiques",     category: "Checkout",       device: "desktop", path: "/cart" },
  { id: "checkout-address",    num: "21", title: "Checkout — Adresse",         category: "Checkout",       device: "desktop", path: "/checkout-address" },
  { id: "checkout-delivery",   num: "22", title: "Checkout — Livraison",       category: "Checkout",       device: "desktop", path: "/checkout-delivery" },
  { id: "checkout-payment",    num: "23", title: "Checkout — Paiement",        category: "Checkout",       device: "desktop", path: "/checkout-payment" },
  { id: "order-confirmed",     num: "24", title: "Confirmation de Commande",   category: "Post-commande",  device: "both",    path: "/order-confirmed" },
  { id: "orders",              num: "25", title: "Historique des Commandes",   category: "Post-commande",  device: "desktop", path: "/orders" },
  { id: "notifications",       num: "26", title: "Notifications",              category: "Post-commande",  device: "mobile",  path: "/notifications" },
  { id: "tracking",            num: "27", title: "Suivi Livraison GPS",        category: "Post-commande",  device: "mobile",  path: "/tracking" },
  { id: "delivery-confirm",    num: "28", title: "Confirmation Livraison",     category: "Post-commande",  device: "mobile",  path: "/delivery-confirm" },
  { id: "subscriptions",       num: "29", title: "Abonnements",                category: "Premium",        device: "desktop", path: "/subscriptions" },
  { id: "analytics",           num: "30", title: "Dashboard Analytics Premium",category: "Premium",        device: "desktop", path: "/analytics" },
  { id: "live-sales",          num: "31", title: "Ventes en Temps Réel",       category: "Premium",        device: "desktop", path: "/live-sales" },
];
