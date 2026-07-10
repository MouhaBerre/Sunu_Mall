"use client";

import Link from "next/link";
import { PRODUCTS, fcfa } from "@/lib/mock-data";
import { Heart, ShoppingCart, Trash2, Share2, ShoppingBag } from "lucide-react";
import { useStore } from "@/store/useStore";

function Wishlist() {
  const addToCart = useStore((s) => s.addToCart);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const items = PRODUCTS.filter((p) => favorites.includes(p.id));

  const remove = (id: string) => toggleFavorite(id);
  const addAll = () => items.filter((p) => p.stock !== 0).forEach((p) => addToCart(p));
  const share = () => {
    if (typeof navigator !== "undefined") {
      if (navigator.share) navigator.share({ title: "Ma Wishlist SUNU MALL", url: window.location.href }).catch(() => {});
      else navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="surface-card overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy flex items-center gap-2">
              <Heart className="h-7 w-7 fill-orange text-orange" /> Ma Wishlist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{items.length} produit{items.length > 1 ? "s" : ""} sauvegardé{items.length > 1 ? "s" : ""}</p>
          </div>
          {items.length > 0 && (
            <div className="flex gap-2">
              <button onClick={share} className="rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Partager
              </button>
              <button onClick={addAll} className="btn-orange rounded-lg px-4 py-2 text-sm font-semibold">Tout ajouter au panier</button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-navy">Votre wishlist est vide</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">Ajoutez des produits à vos favoris pour les retrouver ici.</p>
            <Link href="/search" className="btn-orange rounded-xl px-6 py-3 font-bold mt-6">Découvrir les produits</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((p) => {
              const out = p.stock === 0;
              return (
                <div key={p.id} className="surface-card p-5 flex gap-5">
                  <Link href={`/product/${p.id}`} className="h-28 w-28 shrink-0 rounded-xl overflow-hidden bg-gray-50 grid place-items-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-gray-300" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="text-xs text-muted-foreground">{p.shop}</p>
                    <Link href={`/product/${p.id}`} className="font-semibold text-navy line-clamp-2 leading-snug hover:text-orange">{p.name}</Link>
                    <div className="mt-1 flex items-baseline gap-3">
                      <span className="text-lg font-bold text-orange">{fcfa(p.price)}</span>
                      {p.oldPrice && <span className="text-xs line-through text-muted-foreground">{fcfa(p.oldPrice)}</span>}
                    </div>
                    {out && <span className="text-xs text-danger font-semibold mt-1">Rupture de stock</span>}
                    <div className="mt-auto pt-2 flex gap-2">
                      <button
                        onClick={() => addToCart(p)}
                        disabled={out}
                        className={`flex-1 rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1 ${out ? "bg-muted text-muted-foreground cursor-not-allowed" : "btn-orange"}`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> {out ? "Indisponible" : "Ajouter au panier"}
                      </button>
                      <button onClick={() => remove(p.id)} aria-label="Retirer" className="rounded-lg border border-border p-2 hover:bg-danger/10 text-muted-foreground hover:text-danger">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
