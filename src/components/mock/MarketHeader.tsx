"use client";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { Search, Heart, ShoppingCart, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useStore, type UserRole } from "@/store/useStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Accueil", href: "/", active: true },
  { label: "Catégories", href: "/category" },
  { label: "Boutiques", href: "/boutiques" },
  { label: "Live Shopping", href: "/live-shopping", badge: "LIVE" },
  { label: "Promotions", href: "/promotions" },
  { label: "À propos", href: "/catalog" },
  { label: "Aide", href: "/catalog" },
];

const ROLE_HOME: Record<UserRole, { label: string; href: string }> = {
  client: { label: "Mes commandes", href: "/orders" },
  vendeur: { label: "Mon tableau de bord", href: "/merchant" },
  livreur: { label: "Mes livraisons", href: "/driver-dashboard" },
  admin: { label: "Administration", href: "/admin" },
};

export function MarketHeader({ query = "" }: { query?: string; transparent?: boolean }) {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const favorites = useStore((state) => state.favorites);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const favCount = favorites.length;

  const [q, setQ] = useState(query);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      {/* Top bar */}
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo size={60} />
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center max-w-4xl ml-6 sm:ml-10">
          <div className="flex w-full rounded-lg border border-gray-200 overflow-hidden shadow-sm focus-within:border-orange focus-within:ring-2 focus-within:ring-orange/20 transition-all">
            <Link href="/category" className="hidden sm:flex items-center gap-1 px-3 border-r border-gray-200 text-sm text-gray-600 whitespace-nowrap hover:bg-gray-50 transition-colors">
              Toutes les catégories <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1" />
            </Link>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit, boutique..."
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-700 placeholder-gray-400"
            />
            <button type="submit" className="px-5 py-2.5 bg-orange text-white text-sm font-semibold hover:bg-orange-dark transition-colors flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:block">Rechercher</span>
            </button>
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* Favoris */}
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 px-2 py-1 relative group">
            <div className="relative">
              <Heart className={`h-5 w-5 transition-colors ${favCount > 0 ? "fill-orange text-orange" : "text-gray-500 group-hover:text-orange"}`} />
              {favCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-orange text-[10px] text-white grid place-items-center font-bold">
                  {favCount}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 hidden sm:block">Favoris</span>
          </Link>

          {/* Panier */}
          <Link href="/cart" className="flex flex-col items-center gap-0.5 px-2 py-1 relative group">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-500 group-hover:text-orange transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-orange text-[10px] text-white grid place-items-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 hidden sm:block">Panier</span>
          </Link>

          {/* Mon compte */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <span className="h-6 w-6 rounded-full bg-navy grid place-items-center text-white text-[11px] font-bold">{user.name.charAt(0)}</span>
                <span className="text-sm text-gray-700 hidden sm:block max-w-[90px] truncate">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {accountOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-100 bg-white shadow-lg z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-navy truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link href={ROLE_HOME[user.role].href} onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy hover:bg-gray-50">
                      <LayoutDashboard className="h-4 w-4" /> {ROLE_HOME[user.role].label}
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 border-t border-gray-100">
                      <LogOut className="h-4 w-4" /> Se déconnecter
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors group">
              <User className="h-4 w-4 text-gray-500 group-hover:text-orange" />
              <span className="text-sm text-gray-600 hidden sm:block">Mon compte</span>
            </Link>
          )}
        </div>
      </div>

      {/* Nav bar */}
      <nav className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors",
                link.active
                  ? "border-orange text-orange font-semibold"
                  : "border-transparent text-gray-600 hover:text-orange hover:border-orange/40"
              )}
            >
              {link.label}
              {link.badge && (
                <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
