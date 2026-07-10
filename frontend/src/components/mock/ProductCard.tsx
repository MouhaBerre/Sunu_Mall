"use client";

import { Star, Heart, Plus, ShoppingCart } from "lucide-react";
import { fcfa } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  shop: string;
  rating: number;
  reviews: number;
  badge?: string;
  image?: string;
  stock?: number;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addToCart = useStore((state) => state.addToCart);
  const favorites = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const fav = favorites.includes(product.id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-orange/40 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col">
      {/* Image zone */}
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

        {/* Badge promo */}
        {discount && (
          <span className="absolute left-2 top-2 rounded-md bg-orange px-2 py-0.5 text-[11px] font-bold text-white shadow">
            -{discount}%
          </span>
        )}
        {product.badge && !discount && (
          <span className="absolute left-2 top-2 rounded-md bg-orange px-2 py-0.5 text-[11px] font-bold text-white shadow">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={fav}
          className="absolute right-2 top-2 h-8 w-8 grid place-items-center rounded-full bg-white shadow border border-gray-100 hover:border-orange transition-colors"
        >
          <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-orange text-orange" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="text-[11px] text-gray-400 truncate">{product.shop}</p>
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[2.5em]">{product.name}</p>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i <= Math.floor(product.rating) ? "fill-orange text-orange" : "text-gray-200 fill-gray-200"}`}
            />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">({product.reviews})</span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div>
            <span className="text-base font-bold text-orange">{fcfa(product.price)}</span>
            {product.oldPrice && (
              <span className="block text-[11px] text-gray-400 line-through">{fcfa(product.oldPrice)}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="h-8 w-8 grid place-items-center rounded-lg bg-orange text-white shadow hover:bg-orange-dark transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
