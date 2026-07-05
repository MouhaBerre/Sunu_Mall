import { createFileRoute } from "@tanstack/react-router";
import { MarketHeader } from "@/components/mock/MarketHeader";
import { ProductCard } from "@/components/mock/ProductCard";
import { PRODUCTS } from "@/lib/mock-data";
import { SlidersHorizontal, Grid3x3, List } from "lucide-react";

export const Route = createFileRoute("/screens/search")({ component: SearchResults });

function SearchResults() {
  return (
    <div className="surface-card overflow-hidden">
      <MarketHeader query="casque bluetooth" />
      <div className="mx-auto max-w-7xl px-6 py-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Résultats pour « casque bluetooth »</h1>
          <p className="text-sm text-muted-foreground">52 résultats trouvés</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option>Trier : Pertinence</option><option>Prix croissant</option><option>Prix décroissant</option><option>Mieux notés</option>
          </select>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button className="p-2 bg-orange text-white"><Grid3x3 className="h-4 w-4" /></button>
            <button className="p-2 bg-card text-muted-foreground"><List className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10 grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="surface-card p-5 h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-4 w-4 text-navy" />
            <h3 className="font-display font-bold text-navy">Filtres</h3>
          </div>

          <FilterGroup label="Prix (FCFA)">
            <div className="flex gap-2">
              <input placeholder="Min" className="w-full rounded-lg border border-border px-2 py-1.5 text-xs" />
              <input placeholder="Max" className="w-full rounded-lg border border-border px-2 py-1.5 text-xs" />
            </div>
            <div className="relative pt-6">
              <div className="h-1 rounded-full bg-border">
                <div className="h-full w-2/3 rounded-full bg-orange" />
              </div>
              <span className="absolute left-4 -top-0 h-4 w-4 rounded-full bg-orange border-2 border-white shadow" />
              <span className="absolute left-2/3 -top-0 h-4 w-4 rounded-full bg-orange border-2 border-white shadow" />
            </div>
          </FilterGroup>

          <FilterGroup label="Boutique">
            {["Tech World Dakar", "GameZone SN", "Audio Sénégal", "Fitness Dakar"].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-navy">
                <input type="checkbox" className="rounded" />
                <span>{s}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup label="Note">
            {[5, 4, 3].map((n) => (
              <label key={n} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span className="flex gap-0.5">{"★".repeat(n)}<span className="text-muted-foreground">{"★".repeat(5 - n)}</span></span>
                <span className="text-xs text-muted-foreground">et +</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup label="Livraison">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Express 24h</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Gratuite</label>
          </FilterGroup>

          <button className="w-full rounded-lg border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-muted mt-2">Réinitialiser les filtres</button>
        </aside>

        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...PRODUCTS, ...PRODUCTS.slice(0, 4)].map((p, i) => <ProductCard key={i} product={p} index={i} />)}
          </div>
          <div className="mt-8 flex justify-center gap-1">
            {[1, 2, 3, "...", 8].map((n) => (
              <button key={n} className={`rounded-lg px-3 py-1.5 text-sm ${n === 1 ? "bg-navy text-white" : "border border-border bg-card"}`}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: any) {
  return (
    <div className="pb-4 mb-4 border-b border-border last:border-0">
      <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">{label}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
