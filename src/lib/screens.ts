export interface ScreenMeta {
  id: string;
  num: string;
  title: string;
  category: "Onboarding" | "Admin" | "Commerçant" | "Livreur" | "Marketplace" | "Checkout" | "Post-commande" | "Premium";
  device: "mobile" | "desktop" | "both";
  path: string;
}

export const SCREENS: ScreenMeta[] = [
  { id: "splash",              num: "01", title: "Splash Screen",              category: "Onboarding",     device: "mobile",  path: "/screens/splash" },
  { id: "login",               num: "02", title: "Connexion",                  category: "Onboarding",     device: "both",    path: "/screens/login" },
  { id: "register-client",     num: "03", title: "Inscription Client",         category: "Onboarding",     device: "both",    path: "/screens/register-client" },
  { id: "register-merchant",   num: "04", title: "Inscription Commerçant",     category: "Onboarding",     device: "desktop", path: "/screens/register-merchant" },
  { id: "verify-email",        num: "05", title: "Vérification Email",         category: "Onboarding",     device: "both",    path: "/screens/verify-email" },
  { id: "admin",               num: "06", title: "Dashboard Administrateur",   category: "Admin",          device: "desktop", path: "/screens/admin" },
  { id: "admin-managers",      num: "07", title: "Gestion des Administrateurs",category: "Admin",          device: "desktop", path: "/screens/admin-managers" },
  { id: "admin-shops",         num: "08", title: "Validation des Boutiques",   category: "Admin",          device: "desktop", path: "/screens/admin-shops" },
  { id: "create-shop",         num: "09", title: "Création d'une Boutique",    category: "Commerçant",     device: "desktop", path: "/screens/create-shop" },
  { id: "merchant",            num: "10", title: "Dashboard Commerçant",       category: "Commerçant",     device: "desktop", path: "/screens/merchant" },
  { id: "add-product",         num: "11", title: "Ajout de Produit",           category: "Commerçant",     device: "desktop", path: "/screens/add-product" },
  { id: "catalog",             num: "12", title: "Gestion du Catalogue",       category: "Commerçant",     device: "desktop", path: "/screens/catalog" },
  { id: "driver-login",        num: "13", title: "Connexion Livreur",          category: "Livreur",        device: "mobile",  path: "/screens/driver-login" },
  { id: "driver-dashboard",    num: "14", title: "Courses du Livreur",         category: "Livreur",        device: "mobile",  path: "/screens/driver-dashboard" },
  { id: "driver-delivery",     num: "15", title: "Détail d'une Course",        category: "Livreur",        device: "mobile",  path: "/screens/driver-delivery" },
  { id: "home",                num: "16", title: "Accueil Marketplace",        category: "Marketplace",    device: "both",    path: "/screens/home" },
  { id: "search",              num: "17", title: "Résultats de Recherche",     category: "Marketplace",    device: "desktop", path: "/screens/search" },
  { id: "product",             num: "18", title: "Fiche Produit",              category: "Marketplace",    device: "both",    path: "/screens/product" },
  { id: "wishlist",            num: "19", title: "Wishlist",                   category: "Marketplace",    device: "both",    path: "/screens/wishlist" },
  { id: "cart",                num: "20", title: "Panier Multi-boutiques",     category: "Checkout",       device: "desktop", path: "/screens/cart" },
  { id: "checkout-address",    num: "21", title: "Checkout — Adresse",         category: "Checkout",       device: "desktop", path: "/screens/checkout-address" },
  { id: "checkout-delivery",   num: "22", title: "Checkout — Livraison",       category: "Checkout",       device: "desktop", path: "/screens/checkout-delivery" },
  { id: "checkout-payment",    num: "23", title: "Checkout — Paiement",        category: "Checkout",       device: "desktop", path: "/screens/checkout-payment" },
  { id: "order-confirmed",     num: "24", title: "Confirmation de Commande",   category: "Post-commande",  device: "both",    path: "/screens/order-confirmed" },
  { id: "orders",              num: "25", title: "Historique des Commandes",   category: "Post-commande",  device: "desktop", path: "/screens/orders" },
  { id: "notifications",       num: "26", title: "Notifications",              category: "Post-commande",  device: "mobile",  path: "/screens/notifications" },
  { id: "tracking",            num: "27", title: "Suivi Livraison GPS",        category: "Post-commande",  device: "mobile",  path: "/screens/tracking" },
  { id: "delivery-confirm",    num: "28", title: "Confirmation Livraison",     category: "Post-commande",  device: "mobile",  path: "/screens/delivery-confirm" },
  { id: "subscriptions",       num: "29", title: "Abonnements",                category: "Premium",        device: "desktop", path: "/screens/subscriptions" },
  { id: "analytics",           num: "30", title: "Dashboard Analytics Premium",category: "Premium",        device: "desktop", path: "/screens/analytics" },
  { id: "live-sales",          num: "31", title: "Ventes en Temps Réel",       category: "Premium",        device: "desktop", path: "/screens/live-sales" },
];
