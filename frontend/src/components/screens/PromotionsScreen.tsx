"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getPromoProducts, getDiscount, fcfa, type Product } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import {
  Tag, Zap, Percent, Truck, BadgeDollarSign, Sparkles, Clock, Heart, ShoppingCart,
} from "lucide-react";

type PromoType = "toutes" | "flash" | "reductions" | "livraison" | "cashback" | "nouveautes";

const TYPES: { key: PromoType; label: string; icon: any; color: string }[] = [
  { key: "toutes", label: "Toutes les offres", icon: Tag, color: "text-orange" },
  { key: "flash", label: "Offres Flash", icon: Zap, color: "text-yellow-500" },
  { key: "reductions", label: "Réductions", icon: Percent, color: "text-blue-600" },
  { key: "livraison", label: "Livraison gratuite", icon: Truck, color: "text-gray-500" },
  { key: "cashback", label: "Cashback", icon: BadgeDollarSign, color: "text-green-600" },
  { key: "nouveautes", label: "Nouveautés", icon: Sparkles, color: "text-purple-600" },
];

const CAT_PROMOS = [
  { name: "Électronique", max: 40, tag: "Électronique", image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?q=80&w=400&auto=format&fit=crop" },
  { name: "Mode & Boubou", max: 60, tag: "Mode & Boubou", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop" },
  { name: "Beauté & Bien-être", max: 50, tag: "Beauté & Bien-être", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop" },
  { name: "Alimentation", max: 35, tag: "Alimentation", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop" },
  { name: "Sport", max: 45, tag: "Sport", image: "https://images.unsplash.com/photo-1580087433295-ab2600c1030e?q=80&w=400&auto=format&fit=crop" },
];

function isCashback(p: Product) { return parseInt(p.id.replace("p", ""), 10) % 2 === 0; }
function isFreeShip(p: Product) { return p.price >= 25000; }

function PromotionsScreen() {
  const [type, setType] = useState<PromoType>("toutes");
  const [category, setCategory] = useState<string | null>(null);
  const promoProducts = getPromoProducts();

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of promoProducts) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return [...map.entries()].map(([nom, count]) => ({ nom, count }));
  }, [promoProducts]);

  const filtered = useMemo(() => {
    let list = promoProducts;
    if (type === "flash") list = list.filter((p) => getDiscount(p) >= 20);
    else if (type === "livraison") list = list.filter(isFreeShip);
    else if (type === "cashback") list = list.filter(isCashback);
    else if (type === "nouveautes") list = list.filter((p) => p.badge === "Nouveau" || getDiscount(p) >= 22);
    if (category) list = list.filter((p) => p.category === category);
    return list;
  }, [promoProducts, type, category]);

  const flashDeals = [...promoProducts].sort((a, b) => getDiscount(b) - getDiscount(a)).slice(0, 4);

  const reset = () => { setType("toutes"); setCategory(null); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="text-xs text-gray-400 mb-3">
        <Link href="/" className="hover:text-orange">Accueil</Link> <span className="mx-1">/</span> <span className="text-gray-700">Promotions</span>
      </nav>

      <div className="grid xl:grid-cols-[260px_1fr_300px] gap-6 items-start">
        {/* ─── SIDEBAR FILTRES ─── */}
        <aside className="bg-white rounded-xl border border-gray-100 p-5 xl:sticky xl:top-20 order-2 xl:order-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-800">Filtres</h3>
            <button onClick={reset} className="text-xs font-semibold text-orange hover:underline">Réinitialiser</button>
          </div>

          <FilterGroup label="Type de promotion">
            {TYPES.map((t) => {
              const active = type === t.key;
              return (
                <button key={t.key} onClick={() => setType(t.key)} className={`flex items-center gap-2 text-sm py-1 w-full ${active ? "text-orange font-semibold" : "text-gray-600 hover:text-orange"}`}>
                  <span className={`h-3.5 w-3.5 rounded border ${active ? "border-orange bg-orange" : "border-gray-300"}`} />
                  <span className="flex items-center gap-1">{t.label}<t.icon className={`h-3.5 w-3.5 ${t.color}`} /></span>
                </button>
              );
            })}
          </FilterGroup>

          <FilterGroup label="Catégories">
            <button onClick={() => setCategory(null)} className={`flex w-full items-center gap-2 text-sm py-1 ${category === null ? "text-orange font-semibold" : "text-gray-600 hover:text-orange"}`}>
              <span className={`h-3.5 w-3.5 rounded border ${category === null ? "border-orange bg-orange" : "border-gray-300"}`} /> Toutes
            </button>
            {categories.map((c) => {
              const active = category === c.nom;
              return (
                <button key={c.nom} onClick={() => setCategory(active ? null : c.nom)} className={`flex w-full items-center justify-between gap-2 text-sm py-1 ${active ? "text-orange font-semibold" : "text-gray-600 hover:text-orange"}`}>
                  <span className="flex items-center gap-2"><span className={`h-3.5 w-3.5 rounded border ${active ? "border-orange bg-orange" : "border-gray-300"}`} /> {c.nom}</span>
                  <span className="text-xs text-gray-400">{c.count}</span>
                </button>
              );
            })}
          </FilterGroup>

          <FilterGroup label="Réduction">
            <div className="relative pt-1 pb-2">
              <div className="h-1 rounded-full bg-gray-100"><div className="h-full w-full rounded-full bg-orange" /></div>
              <span className="absolute left-0 -top-0.5 h-4 w-4 rounded-full bg-orange border-2 border-white shadow" />
              <span className="absolute right-0 -top-0.5 h-4 w-4 rounded-full bg-orange border-2 border-white shadow" />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400"><span>0%</span><span>100%</span></div>
          </FilterGroup>

          <FilterGroup label="Localisation">
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"><option>Toutes les villes</option><option>Dakar</option><option>Thiès</option><option>Saint-Louis</option></select>
          </FilterGroup>

          <button className="btn-orange w-full rounded-xl py-2.5 text-sm font-bold">Voir les {filtered.length} promotions</button>
        </aside>

        {/* ─── CENTER ─── */}
        <div className="order-1 xl:order-2 space-y-6">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-orange-dark p-8 md:p-10">
            <div className="relative z-10 max-w-md">
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Super Offres<br /><span className="text-orange">du Moment !</span>
              </h1>
              <p className="mt-3 text-sm text-white/70">Des réductions incroyables sur des milliers de produits. Ne manquez pas ces offres à durée limitée.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center">
              <div className="rounded-2xl bg-gradient-to-br from-orange to-orange-light px-6 py-4 text-center text-white shadow-orange-lg rotate-3">
                <p className="text-[11px] font-semibold">JUSQU'À</p>
                <p className="font-display text-5xl font-extrabold leading-none">70%</p>
                <p className="text-[11px] font-semibold">DE RÉDUCTION</p>
              </div>
            </div>
            <Clock className="absolute right-40 top-6 h-24 w-24 text-orange/20 hidden lg:block" />
          </div>

          {/* Type cards */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {TYPES.map((t) => {
              const active = type === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`rounded-xl border bg-white p-3 flex flex-col items-center gap-2 transition-all ${active ? "border-orange ring-1 ring-orange/30 shadow-sm" : "border-gray-100 hover:border-orange/40"}`}
                >
                  <span className={`h-9 w-9 rounded-full grid place-items-center bg-gray-50 ${t.color}`}><t.icon className="h-4 w-4" /></span>
                  <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Promotions populaires */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-gray-800">Promotions populaires</h2>
              <span className="text-sm text-orange font-semibold">{filtered.length} offre{filtered.length > 1 ? "s" : ""}</span>
            </div>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 py-14 text-center">
                <p className="font-display font-bold text-gray-700">Aucune promotion pour ce filtre</p>
                <button onClick={reset} className="btn-orange rounded-xl px-5 py-2.5 text-sm font-bold mt-4">Réinitialiser</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filtered.map((p) => <PromoCard key={p.id} product={p} />)}
              </div>
            )}
          </section>

          {/* Promotions par catégories */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-gray-800">Promotions par catégories</h2>
              <Link href="/category/all" className="text-sm text-orange font-semibold">Voir toutes</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {CAT_PROMOS.map((c) => (
                <Link key={c.name} href={`/promotions?cat=${encodeURIComponent(c.tag)}`} onClick={(e) => { e.preventDefault(); setCategory(c.tag); }} className="group relative rounded-xl overflow-hidden aspect-[3/4]">
                  <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                    <div>
                      <p className="font-display font-bold text-sm leading-tight">{c.name}</p>
                      <p className="text-[11px] text-white/80">Jusqu'à</p>
                      <p className="font-display text-2xl font-extrabold text-orange-light">-{c.max}%</p>
                    </div>
                    <span className="rounded-lg bg-white/90 text-gray-800 text-[11px] font-semibold text-center py-1.5 group-hover:bg-orange group-hover:text-white transition-colors">Voir les offres</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ─── RIGHT RAIL ─── */}
        <aside className="order-3 space-y-4 xl:sticky xl:top-20">
          {/* Offres Flash */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-display font-bold text-navy flex items-center gap-1"><Zap className="h-4 w-4 text-orange" /> Offres Flash</h4>
              <span className="text-xs text-orange font-semibold">Voir tout</span>
            </div>
            <p className="text-[11px] text-danger font-semibold flex items-center gap-1 mb-2"><Clock className="h-3 w-3" /> Fin dans</p>
            <div className="flex gap-1.5 mb-3">
              {[["02", "Jours"], ["15", "Heures"], ["48", "Min"], ["36", "Sec"]].map(([v, l]) => (
                <div key={l} className="flex-1 rounded-lg border border-gray-100 py-1.5 text-center">
                  <p className="font-display font-bold text-navy text-sm">{v}</p>
                  <p className="text-[9px] text-gray-400">{l}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-3">
              {flashDeals.map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.id}`} className="flex items-center gap-2.5 group">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">{p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-orange">{p.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-orange">{fcfa(p.price)}</span>
                        <span className="text-[10px] text-gray-400 line-through">{fcfa(p.oldPrice!)}</span>
                      </div>
                    </div>
                    <span className="rounded-md bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white shrink-0">-{getDiscount(p)}%</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button className="mt-3 w-full rounded-lg border border-orange text-orange py-2 text-xs font-semibold hover:bg-orange/5">Voir toutes les offres flash</button>
          </div>

          {/* Livraison gratuite */}
          <div className="rounded-xl bg-gradient-to-br from-orange to-orange-light p-5 text-white">
            <Truck className="h-7 w-7" />
            <p className="font-display text-lg font-extrabold mt-2 leading-tight">Livraison gratuite</p>
            <p className="text-sm text-white/90">sur vos commandes à partir de 25 000 FCFA</p>
            <button onClick={() => setType("livraison")} className="mt-3 rounded-lg bg-white text-orange px-4 py-2 text-sm font-bold">J'en profite</button>
          </div>

          {/* Cashback */}
          <div className="rounded-xl bg-gradient-to-br from-navy to-navy-2 p-5 text-white">
            <BadgeDollarSign className="h-7 w-7 text-orange-light" />
            <p className="font-display text-lg font-extrabold mt-2 leading-tight">Cashback jusqu'à 10%</p>
            <p className="text-sm text-white/70">sur vos achats. Payez moins, achetez plus !</p>
            <button onClick={() => setType("cashback")} className="mt-3 rounded-lg bg-orange text-white px-4 py-2 text-sm font-bold">Découvrir</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PromoCard({ product }: { product: Product }) {
  const addToCart = useStore((s) => s.addToCart);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const fav = favorites.includes(product.id);
  const discount = getDiscount(product);
  const sold = product.stock ?? 0;
  const remaining = Math.max(6, Math.round(sold * 0.4));
  const soldPct = Math.min(90, 100 - Math.round((remaining / (sold || 1)) * 40));

  return (
    <Link href={`/product/${product.id}`} className="group bg-white rounded-xl border border-gray-100 hover:border-orange/40 hover:shadow-lg transition-all overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
        <span className="absolute left-2 top-2 rounded-md bg-danger px-2 py-0.5 text-[11px] font-bold text-white shadow">-{discount}%</span>
        {isFreeShip(product) && <span className="absolute left-2 bottom-2 rounded bg-success px-1.5 py-0.5 text-[10px] font-bold text-white">Livraison gratuite</span>}
        <button onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }} aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"} aria-pressed={fav} className="absolute right-2 top-2 h-8 w-8 grid place-items-center rounded-full bg-white shadow border border-gray-100 hover:text-orange">
          <Heart className={`h-4 w-4 ${fav ? "fill-orange text-orange" : "text-gray-400"}`} />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[2.5em]">{product.name}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-orange">{fcfa(product.price)}</span>
          <span className="text-[11px] text-gray-400 line-through">{fcfa(product.oldPrice!)}</span>
        </div>
        <div className="mt-1">
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-orange rounded-full" style={{ width: `${soldPct}%` }} /></div>
          <p className="text-[10px] text-gray-400 mt-1">{remaining} ventes restantes</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[11px] text-danger flex items-center gap-1"><Clock className="h-3 w-3" /> Fin dans 02j</span>
          <button onClick={(e) => { e.preventDefault(); addToCart(product); }} aria-label="Ajouter au panier" className="h-8 w-8 grid place-items-center rounded-lg border border-orange text-orange hover:bg-orange hover:text-white transition-all">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pb-4 mb-4 border-b border-gray-100 last:border-0">
      <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">{label}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export default PromotionsScreen;
