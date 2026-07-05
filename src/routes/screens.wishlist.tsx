import { createFileRoute } from "@tanstack/react-router";
import { MarketHeader } from "@/components/mock/MarketHeader";
import { PRODUCTS, fcfa } from "@/lib/mock-data";
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";

export const Route = createFileRoute("/screens/wishlist")({ component: Wishlist });

function Wishlist() {
  return (
    <div className="surface-card overflow-hidden">
      <MarketHeader />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy flex items-center gap-2">
              <Heart className="h-7 w-7 fill-orange text-orange" /> Ma Wishlist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{PRODUCTS.length} produits sauvegardés</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Partager
            </button>
            <button className="btn-orange rounded-lg px-4 py-2 text-sm font-semibold">Tout ajouter au panier</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCTS.map((p, i) => {
            const out = p.stock === 0;
            return (
              <div key={p.id} className="surface-card p-4 flex gap-4">
                <div className={`h-28 w-28 shrink-0 rounded-xl bg-gradient-to-br ${["from-navy to-navy-2","from-orange to-orange-light","from-navy-2 to-orange","from-orange-dark to-navy"][i % 4]} grid place-items-center text-white font-display font-bold text-xs text-center px-2`}>
                  {p.name.split(" ").slice(0, 2).join(" ")}
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <p className="text-xs text-muted-foreground">{p.shop}</p>
                  <p className="font-semibold text-navy line-clamp-2 leading-snug">{p.name}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-orange">{fcfa(p.price)}</span>
                    {p.oldPrice && <span className="text-xs line-through text-muted-foreground">{fcfa(p.oldPrice)}</span>}
                  </div>
                  {out && <span className="text-xs text-danger font-semibold mt-1">Rupture de stock</span>}
                  <div className="mt-auto pt-2 flex gap-2">
                    <button disabled={out} className={`flex-1 rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1 ${out ? "bg-muted text-muted-foreground cursor-not-allowed" : "btn-orange"}`}>
                      <ShoppingCart className="h-3.5 w-3.5" /> {out ? "Indisponible" : "Ajouter au panier"}
                    </button>
                    <button className="rounded-lg border border-border p-2 hover:bg-danger/10 text-muted-foreground hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
