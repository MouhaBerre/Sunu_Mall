"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CATEGORIES, CATEGORY_PRODUCT_MAP, PRODUCTS, fcfa, slugify } from "@/lib/mock-data";
import { SlidersHorizontal, Grid3x3, List, PackageSearch, LayoutGrid, BadgeCheck, Heart, ShoppingCart, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { useStore } from "@/store/useStore";

const iconMap: Record<string, any> = Icons;

function CategoryScreen() {
  const params = useParams<{ slug?: string }>();
  const category = CATEGORIES.find((c) => slugify(c.name) === params.slug);
  // "all" slug (or an unknown slug) shows every product.
  const isAll = params.slug === "all" || !category;
  const displayName = isAll ? "Toutes les catégories" : category!.name;
  const products = isAll
    ? PRODUCTS
    : PRODUCTS.filter((p) => (CATEGORY_PRODUCT_MAP[category!.name] ?? []).includes(p.category));
  const shops = [...new Set(products.map((p) => p.shop))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-[260px_1fr] gap-6 items-start">
      {/* ─── SIDEBAR ─── */}
      <aside className="space-y-4 lg:sticky lg:top-20">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <p className="font-display font-bold text-gray-800 px-4 pt-4 pb-2">Catégories</p>
          <nav className="pb-2">
            <Link
              href="/category/all"
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm border-l-2 transition-colors ${
                isAll
                  ? "border-orange bg-orange/5 text-orange font-semibold"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-orange"
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Toutes les catégories
            </Link>
            {CATEGORIES.map((c) => {
              const Ic = iconMap[c.icon.charAt(0).toUpperCase() + c.icon.slice(1)] ?? PackageSearch;
              const active = !isAll && c.name === category!.name;
              return (
                <Link
                  key={c.name}
                  href={`/category/${slugify(c.name)}`}
                  className={`flex items-center justify-between gap-2 px-4 py-2.5 text-sm border-l-2 transition-colors ${
                    active
                      ? "border-orange bg-orange/5 text-orange font-semibold"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-orange"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Ic className="h-4 w-4" /> {c.name}
                  </span>
                  <span className="text-xs text-gray-400">{c.count}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {products.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-4 w-4 text-navy" />
              <h3 className="font-display font-bold text-navy text-sm">Filtres</h3>
            </div>

            <FilterGroup label="Prix (FCFA)">
              <div className="flex gap-2">
                <input placeholder="Min" className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs" />
                <input placeholder="Max" className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs" />
              </div>
              <div className="relative pt-6">
                <div className="h-1 rounded-full bg-gray-100">
                  <div className="h-full w-2/3 rounded-full bg-orange" />
                </div>
                <span className="absolute left-4 -top-0 h-4 w-4 rounded-full bg-orange border-2 border-white shadow" />
                <span className="absolute left-2/3 -top-0 h-4 w-4 rounded-full bg-orange border-2 border-white shadow" />
              </div>
            </FilterGroup>

            <FilterGroup label="Boutique">
              {shops.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded" />
                  <span>{s}</span>
                </label>
              ))}
            </FilterGroup>

            <FilterGroup label="Note">
              {[5, 4, 3].map((n) => (
                <label key={n} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span className="flex gap-0.5 text-orange">{"★".repeat(n)}<span className="text-gray-200">{"★".repeat(5 - n)}</span></span>
                  <span className="text-xs text-gray-400">et +</span>
                </label>
              ))}
            </FilterGroup>

            <button className="w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 mt-1">Réinitialiser les filtres</button>
          </div>
        )}
      </aside>

      {/* ─── MAIN ─── */}
      <div>
        <nav className="text-xs text-gray-400 mb-2">
          <Link href="/" className="hover:text-orange">Accueil</Link> <span className="mx-1">/</span>{" "}
          {isAll ? (
            <span className="text-gray-700">Catégories</span>
          ) : (
            <>
              <Link href="/category/all" className="hover:text-orange">Catégories</Link> <span className="mx-1">/</span> <span className="text-gray-700">{displayName}</span>
            </>
          )}
        </nav>

        <div className={products.length > 0 ? "grid md:grid-cols-[1fr_360px] gap-5 items-stretch mb-5" : "mb-5"}>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-gray-900">{displayName}</h1>
            <p className="mt-2 text-sm text-gray-500 max-w-lg">
              {isAll
                ? "Parcourez tous les produits de SUNU MALL, toutes catégories confondues, livrés partout au Sénégal."
                : `Découvrez notre sélection ${displayName.toLowerCase()} au meilleur prix, livrée partout au Sénégal.`}
            </p>
          </div>

          {products.length > 0 && shops.length > 0 && (
            <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-2 p-5 text-white flex items-center justify-between gap-4 overflow-hidden">
              <div>
                <p className="font-display text-lg font-bold leading-snug">Les meilleures boutiques,<br /><span className="text-orange-light">aux meilleurs prix</span></p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {shops.slice(0, 4).map((s) => (
                    <span key={s} className="text-[11px] font-semibold bg-white/10 rounded-full px-2.5 py-1">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center text-center py-16 px-6">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-5">
              <PackageSearch className="h-9 w-9 text-gray-300" />
            </div>
            <h2 className="font-display text-xl font-bold text-gray-800">Aucun produit dans « {displayName} » pour l'instant</h2>
            <p className="text-gray-400 mt-2 max-w-sm">De nouveaux produits arrivent bientôt dans cette catégorie. En attendant, explorez le reste du catalogue.</p>
            <Link href="/search" className="btn-orange rounded-xl px-6 py-3 font-bold mt-6">Voir tous les produits</Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div className="inline-flex items-center rounded-xl border border-gray-100 bg-white p-1">
                <button className="rounded-lg bg-orange/10 text-orange text-sm font-semibold px-4 py-2">
                  Tous ({products.length})
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
                  <option>Trier : Pertinence</option><option>Prix croissant</option><option>Prix décroissant</option><option>Mieux notés</option>
                </select>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button className="p-2 bg-orange text-white"><Grid3x3 className="h-4 w-4" /></button>
                  <button className="p-2 bg-white text-gray-400"><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <CategoryProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-400">Affichage 1-{products.length} sur {products.length} produit{products.length > 1 ? "s" : ""}</p>
              <div className="flex items-center gap-1">
                <button disabled className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-300">←</button>
                <button className="rounded-lg px-3 py-1.5 text-sm bg-orange text-white font-semibold">1</button>
                <button disabled className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-300">→</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryProductCard({ product }: { product: (typeof PRODUCTS)[number] }) {
  const addToCart = useStore((state) => state.addToCart);
  const favorites = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const fav = favorites.includes(product.id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;
  const isNew = product.badge === "Nouveau";

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative bg-white rounded-xl border border-gray-100 hover:border-orange/40 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {discount ? (
          <span className="absolute left-2 top-2 rounded-md bg-danger px-2 py-0.5 text-[11px] font-bold text-white shadow">-{discount}%</span>
        ) : isNew ? (
          <span className="absolute left-2 top-2 rounded-md bg-success px-2 py-0.5 text-[11px] font-bold text-white shadow">NOUVEAU</span>
        ) : product.badge ? (
          <span className="absolute left-2 top-2 rounded-md bg-orange px-2 py-0.5 text-[11px] font-bold text-white shadow">{product.badge}</span>
        ) : null}

        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={fav}
          className="absolute right-2 top-2 h-8 w-8 grid place-items-center rounded-full bg-white shadow border border-gray-100 hover:border-orange transition-colors"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-orange text-orange" : "text-gray-400"}`} />
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[2.5em]">{product.name}</p>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`h-3 w-3 ${i <= Math.floor(product.rating) ? "fill-orange text-orange" : "text-gray-200 fill-gray-200"}`} />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-orange">{fcfa(product.price)}</span>
          {product.oldPrice && <span className="text-[11px] text-gray-400 line-through">{fcfa(product.oldPrice)}</span>}
        </div>

        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 truncate">
            {product.shop} <BadgeCheck className="h-3.5 w-3.5 text-navy shrink-0" />
          </span>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="h-8 w-8 shrink-0 grid place-items-center rounded-lg border border-orange text-orange hover:bg-orange hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function FilterGroup({ label, children }: any) {
  return (
    <div className="pb-4 mb-4 border-b border-gray-100 last:border-0">
      <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">{label}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export default CategoryScreen;
