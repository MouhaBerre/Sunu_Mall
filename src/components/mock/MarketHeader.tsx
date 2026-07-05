import { Logo } from "@/components/brand/Logo";
import { Search, Heart, ShoppingCart, Bell, User } from "lucide-react";

export function MarketHeader({ query = "" }: { query?: string }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-6">
        <Logo size={40} />
        <div className="flex-1 max-w-2xl">
          <div className="flex rounded-xl border border-border overflow-hidden shadow-card">
            <input
              defaultValue={query}
              placeholder="Rechercher un produit, boutique, catégorie..."
              className="flex-1 bg-card px-4 py-2.5 text-sm outline-none"
            />
            <button className="btn-orange px-5 flex items-center gap-2 text-sm font-semibold">
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconBtn><Heart className="h-4 w-4" /></IconBtn>
          <IconBtn><Bell className="h-4 w-4" /></IconBtn>
          <IconBtn count={3}><ShoppingCart className="h-4 w-4" /></IconBtn>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">
            <User className="h-4 w-4" />
            <span>Compte</span>
          </button>
        </div>
      </div>
      <nav className="mx-auto max-w-7xl px-6 pb-3 flex items-center gap-6 text-sm">
        <span className="font-semibold text-navy">Catégories</span>
        <span className="text-muted-foreground hover:text-navy cursor-pointer">Boutiques</span>
        <span className="text-muted-foreground hover:text-navy cursor-pointer">Promotions</span>
        <span className="text-muted-foreground hover:text-navy cursor-pointer">Nouveautés</span>
        <span className="text-muted-foreground hover:text-navy cursor-pointer">Live shopping</span>
        <span className="ml-auto text-orange font-semibold">🚚 Livraison gratuite &gt; 20 000 FCFA</span>
      </nav>
    </header>
  );
}

function IconBtn({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <button className="relative rounded-lg border border-border p-2 hover:bg-muted">
      {children}
      {count !== undefined && (
        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-orange text-[10px] text-white grid place-items-center font-bold">{count}</span>
      )}
    </button>
  );
}
