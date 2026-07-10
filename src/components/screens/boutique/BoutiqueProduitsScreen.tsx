"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/mock/ProductCard";
import { getBoutique, getBoutiqueProducts, getBoutiqueCategories } from "@/lib/mock-data";
import { Grid3x3, List, PackageSearch } from "lucide-react";

type Sort = "recents" | "prix_asc" | "prix_desc";

function BoutiqueProduitsScreen() {
  const { slug } = useParams<{ slug: string }>();
  const boutique = getBoutique(slug);
  const all = getBoutiqueProducts(slug);
  const cats = getBoutiqueCategories(slug);
  const [cat, setCat] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("recents");

  const products = useMemo(() => {
    let list = cat ? all.filter((p) => p.category === cat) : all;
    list = [...list];
    if (sort === "prix_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "prix_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [all, cat, sort]);

  if (!boutique) return null;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCat(null)}
            className={`rounded-lg text-sm font-semibold px-4 py-2 ${cat === null ? "bg-orange/10 text-orange" : "bg-white border border-gray-200 text-gray-500 hover:text-orange"}`}
          >
            Tous ({all.length})
          </button>
          {cats.map((c) => (
            <button
              key={c.nom}
              onClick={() => setCat(cat === c.nom ? null : c.nom)}
              className={`rounded-lg text-sm font-semibold px-4 py-2 ${cat === c.nom ? "bg-orange/10 text-orange" : "bg-white border border-gray-200 text-gray-500 hover:text-orange"}`}
            >
              {c.nom} ({c.compteur})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
            <option value="recents">Trier : Récents</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
          </select>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button aria-label="Vue grille" className="p-2 bg-orange text-white"><Grid3x3 className="h-4 w-4" /></button>
            <button aria-label="Vue liste" className="p-2 bg-white text-gray-400"><List className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center flex flex-col items-center">
          <PackageSearch className="h-10 w-10 text-gray-300 mb-3" />
          <p className="font-display text-lg font-bold text-gray-800">Aucun produit dans cette catégorie</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {products.map((p, i) => (
            <Link key={p.id} href={`/product/${p.id}`}><ProductCard product={p} index={i} /></Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default BoutiqueProduitsScreen;
