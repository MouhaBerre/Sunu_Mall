"use client";

import Link from "next/link";
import { fcfa } from "@/lib/mock-data";
import { Store, Minus, Plus, Trash2, Tag, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import { useStore } from "@/store/useStore";

function Cart() {
  const cart = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const shopsMap = cart.reduce((acc, item) => {
    if (!acc[item.shop]) {
      acc[item.shop] = { name: item.shop, area: "Dakar", delivery: 1500, eta: "24-48h", items: [] };
    }
    acc[item.shop].items.push(item);
    return acc;
  }, {} as Record<string, any>);

  const SHOPS = Object.values(shopsMap);

  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const delivery = SHOPS.reduce((a, s) => a + s.delivery, 0);
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-navy">Votre panier est vide</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">Découvrez nos produits et ajoutez-les à votre panier pour passer commande.</p>
          <Link href="/search" className="btn-orange rounded-xl px-6 py-3 font-bold mt-6">Continuer mes achats</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy">Mon panier</h1>
            <p className="text-sm text-muted-foreground mt-1">
              <b className="text-navy">{SHOPS.length} boutiques</b> · commandez en une seule fois, chaque boutique livre séparément.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 border border-success/30 px-3 py-1.5">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="text-xs font-semibold text-success">Paiement sécurisé — transaction ACID</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
          <div className="space-y-5">
            {SHOPS.map((s: any, idx: number) => {
              const shopTotal = s.items.reduce((a: number, i: any) => a + i.price * i.quantity, 0);
              return (
                <div key={s.name} className="surface-card overflow-hidden fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-orange/5 to-transparent px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-orange/15 grid place-items-center">
                        <Store className="h-4 w-4 text-orange" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-navy leading-tight">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground">{s.area}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-muted-foreground">Sous-total boutique</p>
                      <p className="font-display font-extrabold text-navy">{fcfa(shopTotal)}</p>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {s.items.map((it: any, i: number) => (
                      <div key={it.id} className="flex items-center gap-4 p-5">
                        {it.image ? (
                          <img src={it.image} alt={it.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <div className={`h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br ${["from-navy to-navy-2","from-orange to-orange-light","from-navy-2 to-orange"][i % 3]}`} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-navy line-clamp-1">{it.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Truck className="h-3 w-3" /> Livraison sous {s.eta}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-lg border border-border">
                              <button onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))} className="p-1.5 hover:bg-muted rounded-l-lg"><Minus className="h-3 w-3" /></button>
                              <span className="px-3 text-sm font-semibold tabular-nums">{it.quantity}</span>
                              <button onClick={() => updateQuantity(it.id, it.quantity + 1)} className="p-1.5 hover:bg-muted rounded-r-lg"><Plus className="h-3 w-3" /></button>
                            </div>
                            <button onClick={() => removeFromCart(it.id)} className="text-xs text-muted-foreground hover:text-danger flex items-center gap-1"><Trash2 className="h-3 w-3" /> Retirer</button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange">{fcfa(it.price * it.quantity)}</p>
                          <p className="text-xs text-muted-foreground">{fcfa(it.price)} × {it.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-2.5 text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5" /> Frais de livraison boutique
                    </span>
                    <span className="font-bold text-navy">{fcfa(s.delivery)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="surface-card p-6 h-fit sticky top-6 fade-in-up" style={{ animationDelay: "240ms" }}>
            <h3 className="font-display font-bold text-navy">Récapitulatif</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label={`Sous-total (${cart.reduce((acc, it) => acc + it.quantity, 0)} articles)`} value={fcfa(subtotal)} />
              <Row label={`Livraison (${SHOPS.length} boutiques)`} value={fcfa(delivery)} />
              <Row label="Remise" value="- 0 FCFA" muted />
              <div className="my-3 border-t border-border" />
              <div className="flex items-baseline justify-between">
                <span className="font-display font-bold text-navy">Total</span>
                <span className="font-display text-2xl font-extrabold text-orange">{fcfa(total)}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <Tag className="h-4 w-4 text-orange" />
                <input placeholder="Code promo" className="flex-1 bg-transparent text-xs outline-none" />
              </div>
              <button className="rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted">Appliquer</button>
            </div>
            <Link href="/checkout-address" className="btn-orange block text-center rounded-xl py-3 text-sm font-bold mt-4">
              Passer commande
            </Link>
            <p className="text-[10px] text-muted-foreground text-center mt-2">💳 Wave · Orange Money · Carte bancaire</p>
            <div className="mt-4 rounded-lg bg-muted/60 p-3 text-[11px] text-muted-foreground leading-relaxed">
              🚚 La livraison est déclenchée automatiquement après confirmation du paiement. Chaque boutique affecte son propre livreur.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return <div className={`flex items-baseline justify-between ${muted ? "text-muted-foreground" : ""}`}><span>{label}</span><span className="font-semibold text-navy">{value}</span></div>;
}

export default Cart;
