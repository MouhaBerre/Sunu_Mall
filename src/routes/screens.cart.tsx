import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketHeader } from "@/components/mock/MarketHeader";
import { fcfa } from "@/lib/mock-data";
import { Store, Minus, Plus, Trash2, Tag, ShieldCheck, Truck } from "lucide-react";

export const Route = createFileRoute("/screens/cart")({ component: Cart });

const SHOPS = [
  {
    name: "Sandaga Fashion",
    area: "Marché Sandaga, Plateau",
    delivery: 1500,
    eta: "24-48h",
    items: [
      { n: "Boubou brodé Grand Sereer", p: 45000, q: 1 },
      { n: "Tissu Wax authentique — 6 yards", p: 12000, q: 2 },
    ],
  },
  {
    name: "Sen'Tech Almadies",
    area: "Almadies, Dakar",
    delivery: 2000,
    eta: "24h",
    items: [{ n: "Infinix Hot 40 Pro — 256 Go", p: 129000, q: 1 }],
  },
  {
    name: "Casamance Bio",
    area: "Mermoz, Dakar",
    delivery: 1200,
    eta: "48h",
    items: [
      { n: "Bissap sec bio — 500g", p: 2500, q: 2 },
      { n: "Café Touba moulu — 250g", p: 1800, q: 3 },
    ],
  },
];

function Cart() {
  const subtotal = SHOPS.flatMap((s) => s.items).reduce((a, i) => a + i.p * i.q, 0);
  const delivery = SHOPS.reduce((a, s) => a + s.delivery, 0);
  const total = subtotal + delivery;
  return (
    <div className="surface-card overflow-hidden fade-in-up">
      <MarketHeader />
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
            {SHOPS.map((s, idx) => {
              const shopTotal = s.items.reduce((a, i) => a + i.p * i.q, 0);
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
                      <p className="text-[10px] text-muted-foreground">Sous-total boutique</p>
                      <p className="font-display font-extrabold text-navy">{fcfa(shopTotal)}</p>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {s.items.map((it, i) => (
                      <div key={i} className="flex items-center gap-4 p-5">
                        <div className={`h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br ${["from-navy to-navy-2","from-orange to-orange-light","from-orange-dark to-navy"][i % 3]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-navy line-clamp-1">{it.n}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Truck className="h-3 w-3" /> Livraison sous {s.eta}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-lg border border-border">
                              <button className="p-1.5 hover:bg-muted rounded-l-lg"><Minus className="h-3 w-3" /></button>
                              <span className="px-3 text-sm font-semibold tabular-nums">{it.q}</span>
                              <button className="p-1.5 hover:bg-muted rounded-r-lg"><Plus className="h-3 w-3" /></button>
                            </div>
                            <button className="text-xs text-muted-foreground hover:text-danger flex items-center gap-1"><Trash2 className="h-3 w-3" /> Retirer</button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange">{fcfa(it.p * it.q)}</p>
                          <p className="text-xs text-muted-foreground">{fcfa(it.p)} × {it.q}</p>
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
              <Row label={`Sous-total (${SHOPS.reduce((a,s)=>a+s.items.length,0)} articles)`} value={fcfa(subtotal)} />
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
            <Link to="/screens/checkout-address" className="btn-orange block text-center rounded-xl py-3 text-sm font-bold mt-4">
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
