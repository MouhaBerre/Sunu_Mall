import { createFileRoute } from "@tanstack/react-router";
import { MarketHeader } from "@/components/mock/MarketHeader";
import { fcfa } from "@/lib/mock-data";
import { Store, Minus, Plus, Trash2, Tag } from "lucide-react";

export const Route = createFileRoute("/screens/cart")({ component: Cart });

const SHOPS = [
  { name: "Boutique Tech World", items: [{ n: "Casque Bluetooth X1", p: 18500, q: 1 }, { n: "Chargeur USB-C 30W", p: 8500, q: 2 }] },
  { name: "Boutique Fashion Dakar", items: [{ n: "Sac à main cuir", p: 19000, q: 1 }] },
];

function Cart() {
  const subtotal = SHOPS.flatMap((s) => s.items).reduce((a, i) => a + i.p * i.q, 0);
  const delivery = 2000;
  const total = subtotal + delivery;
  return (
    <div className="surface-card overflow-hidden">
      <MarketHeader />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-navy mb-6">Mon panier</h1>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
          <div className="space-y-5">
            {SHOPS.map((s) => {
              const shopTotal = s.items.reduce((a, i) => a + i.p * i.q, 0);
              return (
                <div key={s.name} className="surface-card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-orange" />
                      <span className="font-display font-bold text-navy">{s.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Sous-total : <b className="text-navy">{fcfa(shopTotal)}</b></span>
                  </div>
                  <div className="divide-y divide-border">
                    {s.items.map((it, i) => (
                      <div key={i} className="flex items-center gap-4 p-5">
                        <div className={`h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br ${["from-navy to-navy-2","from-orange to-orange-light","from-orange-dark to-navy"][i % 3]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-navy line-clamp-1">{it.n}</p>
                          <p className="text-xs text-muted-foreground mt-1">Livraison sous 24-48h</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-lg border border-border">
                              <button className="p-1.5"><Minus className="h-3 w-3" /></button>
                              <span className="px-3 text-sm font-semibold tabular-nums">{it.q}</span>
                              <button className="p-1.5"><Plus className="h-3 w-3" /></button>
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
                </div>
              );
            })}
          </div>

          <aside className="surface-card p-6 h-fit sticky top-6">
            <h3 className="font-display font-bold text-navy">Récapitulatif</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Sous-total" value={fcfa(subtotal)} />
              <Row label="Livraison" value={fcfa(delivery)} />
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
              <button className="rounded-lg border border-border px-3 text-xs font-semibold">Appliquer</button>
            </div>
            <button className="btn-orange w-full rounded-xl py-3 text-sm font-bold mt-4">Passer commande</button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">Paiement sécurisé · Wave · OM · CB</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: any) {
  return <div className={`flex items-baseline justify-between ${muted ? "text-muted-foreground" : ""}`}><span>{label}</span><span className="font-semibold text-navy">{value}</span></div>;
}
