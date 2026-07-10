"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getBoutique, getBoutiqueProducts, fcfa } from "@/lib/mock-data";
import { Clock, Tag, ShoppingCart } from "lucide-react";
import { useStore } from "@/store/useStore";

function BoutiquePromotionsScreen() {
  const { slug } = useParams<{ slug: string }>();
  const boutique = getBoutique(slug);
  const addToCart = useStore((s) => s.addToCart);
  const promos = getBoutiqueProducts(slug).filter((p) => p.oldPrice);

  if (!boutique) return null;

  if (promos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 py-16 text-center flex flex-col items-center">
        <Tag className="h-10 w-10 text-gray-300 mb-3" />
        <p className="font-display text-lg font-bold text-gray-800">Aucune promotion en cours</p>
        <p className="text-gray-400 mt-1 text-sm">Revenez bientôt, cette boutique prépare de nouvelles offres.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-r from-orange to-orange-light p-5 text-white mb-6 flex items-center gap-3">
        <Tag className="h-8 w-8" />
        <div>
          <p className="font-display text-xl font-extrabold">Promotions en cours</p>
          <p className="text-sm text-white/90">{promos.length} offre{promos.length > 1 ? "s" : ""} à ne pas manquer chez {boutique.nom}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {promos.map((p) => {
          const discount = Math.round(((p.oldPrice! - p.price) / p.oldPrice!) * 100);
          return (
            <div key={p.id} className="rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-all flex flex-col">
              <Link href={`/product/${p.id}`} className="relative aspect-[16/10] bg-gray-50 overflow-hidden block">
                {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                <span className="absolute left-2 top-2 rounded-md bg-danger px-2 py-0.5 text-xs font-bold text-white">-{discount}%</span>
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link href={`/product/${p.id}`} className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-orange">{p.name}</Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-orange">{fcfa(p.price)}</span>
                  <span className="text-xs text-gray-400 line-through">{fcfa(p.oldPrice!)}</span>
                </div>
                <span className="mt-2 text-xs text-danger flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Se termine dans 02j : 14h : 32m</span>
                <button
                  onClick={() => addToCart(p)}
                  className="btn-orange mt-3 rounded-lg py-2 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" /> Ajouter au panier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoutiquePromotionsScreen;
