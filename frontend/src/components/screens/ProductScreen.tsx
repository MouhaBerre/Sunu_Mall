"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ProductCard } from "@/components/mock/ProductCard";
import { PRODUCTS, fcfa } from "@/lib/mock-data";
import { Star, Heart, Share2, Shield, Truck, RotateCcw, Check, ShoppingCart } from "lucide-react";
import { useStore } from "@/store/useStore";

function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const p = PRODUCTS.find((item) => item.id === params.id) ?? PRODUCTS[0];
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : null;
  const addToCart = useStore((state) => state.addToCart);
  const favorites = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const fav = favorites.includes(p.id);
  const related = PRODUCTS.filter((item) => item.id !== p.id).slice(0, 5);

  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(0);

  const addQtyToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(p);
  };
  const buyNow = () => {
    addQtyToCart();
    router.push("/cart");
  };
  return (
    <div className="surface-card overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          Accueil <span className="mx-1">/</span> {p.category} <span className="mx-1">/</span> <span className="text-navy">{p.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl bg-muted grid place-items-center relative overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-3xl font-extrabold text-navy/40 px-6 text-center">{p.name}</span>
              )}
              {discount && (
                <span className="absolute left-4 top-4 rounded-full bg-orange px-3 py-1 text-xs font-bold text-white">-{discount}%</span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square rounded-lg overflow-hidden bg-gradient-to-br ${["from-navy to-navy-2","from-orange to-orange-light","from-navy-2 to-orange","from-orange-dark to-navy","from-navy to-orange"][i]} ${i === 0 ? "ring-2 ring-orange" : ""}`}>
                  {i === 0 && p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-semibold text-orange">{p.shop}</p>
            <h1 className="font-display text-3xl font-bold text-navy mt-1">{p.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => <Star key={i} className={`h-4 w-4 ${i <= Math.floor(p.rating) ? "fill-orange text-orange" : "text-muted"}`} />)}
                <span className="ml-1 text-sm font-semibold">{p.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({p.reviews} avis)</span>
              <span className="text-sm text-success font-semibold flex items-center gap-1"><Check className="h-3 w-3" />{p.stock} en stock</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold text-orange">{fcfa(p.price)}</span>
              {p.oldPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{fcfa(p.oldPrice)}</span>
                  <span className="rounded-full bg-orange/10 px-2 py-0.5 text-xs font-bold text-orange">Vous économisez {fcfa(p.oldPrice - p.price)}</span>
                </>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold text-navy mb-2">Couleur</p>
              <div className="flex gap-2">
                {["#0A163A","#FF8C00","#F26A00","#111"].map((c, i) => (
                  <button
                    key={c}
                    onClick={() => setColor(i)}
                    aria-label={`Couleur ${i + 1}`}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${color === i ? "border-orange ring-2 ring-orange/30 scale-110" : "border-border"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-muted rounded-l-xl">-</button>
                <span className="px-4 text-sm font-semibold tabular-nums">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 hover:bg-muted rounded-r-xl">+</button>
              </div>
              <button onClick={addQtyToCart} className="btn-orange flex-1 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
                <ShoppingCart className="h-4 w-4" /> Ajouter au panier
              </button>
              <button onClick={() => toggleFavorite(p.id)} aria-label="Favori" aria-pressed={fav} className="rounded-xl border border-border p-3 hover:bg-muted">
                <Heart className={`h-4 w-4 ${fav ? "fill-orange text-orange" : ""}`} />
              </button>
              <button
                onClick={() => { if (navigator.share) navigator.share({ title: p.name, url: window.location.href }).catch(() => {}); else navigator.clipboard?.writeText(window.location.href); }}
                aria-label="Partager"
                className="rounded-xl border border-border p-3 hover:bg-muted"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            <button onClick={buyNow} className="mt-3 w-full rounded-xl border-2 border-orange text-orange py-3 text-sm font-bold hover:bg-orange/5">Acheter maintenant</button>

            <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
              {[[Truck, "Livraison 24h"], [Shield, "Garantie 1 an"], [RotateCcw, "Retour 14j"]].map(([Ic, t]: any) => (
                <div key={t} className="rounded-lg border border-border p-3 flex flex-col items-center gap-1 text-center">
                  <Ic className="h-4 w-4 text-orange" /><span className="font-medium text-navy">{t}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h3 className="font-display font-bold text-navy mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Profitez d'un son d'une qualité inégalée avec le Casque Bluetooth Sans Fil Pro. Autonomie 20h, réduction de bruit active, confort optimal, compatibilité universelle. Livré avec pochette de transport et câble USB-C.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h3 className="font-display text-xl font-bold text-navy mb-4">Vous aimerez aussi</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {related.map((item, i) => (
              <Link key={item.id} href={`/product/${item.id}`}>
                <ProductCard product={item} index={i} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetail;
