"use client";

import Link from "next/link";
import { useState } from "react";
import type { Boutique } from "@/lib/mock-data";
import { getBoutiqueProducts } from "@/lib/mock-data";
import { Star, Heart, BadgeCheck, MapPin, Store } from "lucide-react";
import * as Icons from "lucide-react";

const iconMap: Record<string, any> = Icons;

export function BoutiqueCard({ boutique }: { boutique: Boutique }) {
  const [fav, setFav] = useState(false);
  const nbProduits = getBoutiqueProducts(boutique.slug).length;
  const LogoIcon = iconMap[boutique.logoIcon] ?? Store;

  return (
    <Link
      href={`/boutiques/${boutique.slug}`}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-orange/40 hover:shadow-lg transition-all flex flex-col"
    >
      {/* Banner */}
      <div className="relative h-28 overflow-hidden bg-navy/5">
        <img
          src={boutique.bannerImage}
          alt={boutique.nom}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.preventDefault(); setFav((v) => !v); }}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute right-2 top-2 h-8 w-8 grid place-items-center rounded-full bg-white/95 shadow hover:scale-110 transition-transform"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-orange text-orange" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center -mt-8 px-4 pb-4 text-center flex-1">
        <div className="h-16 w-16 rounded-full grid place-items-center bg-white ring-4 ring-white shadow-md">
          <div
            className="h-full w-full rounded-full grid place-items-center text-white"
            style={{ backgroundColor: boutique.logoColor }}
          >
            <LogoIcon className="h-7 w-7" strokeWidth={2.2} />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1">
          <h3 className="font-display font-bold text-gray-800 group-hover:text-orange transition-colors">{boutique.nom}</h3>
          {boutique.estVerifiee && <BadgeCheck className="h-4 w-4 text-navy shrink-0" />}
        </div>
        <p className="text-xs text-gray-400">{boutique.categorie}</p>

        <div className="mt-1.5 flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-orange text-orange" />
          <span className="font-semibold text-gray-700">{boutique.note}</span>
          <span className="text-xs text-gray-400">({boutique.nbAvis} avis)</span>
        </div>

        <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {boutique.ville}, Sénégal · {nbProduits} produits
        </p>

        <span className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 group-hover:border-orange group-hover:text-orange group-hover:bg-orange/5 transition-colors">
          Voir la boutique
        </span>
      </div>
    </Link>
  );
}
