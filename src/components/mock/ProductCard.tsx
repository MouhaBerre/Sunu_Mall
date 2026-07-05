import { Star, Heart } from "lucide-react";
import { fcfa } from "@/lib/mock-data";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  shop: string;
  rating: number;
  reviews: number;
  badge?: string;
}

const GRADIENTS = [
  "from-[#0A163A] to-[#142A5E]",
  "from-[#FF8C00] to-[#FFA31A]",
  "from-[#142A5E] to-[#FF8C00]",
  "from-[#F26A00] to-[#0A163A]",
  "from-[#0A163A] to-[#F26A00]",
  "from-[#FFA31A] to-[#142A5E]",
];

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const grad = GRADIENTS[index % GRADIENTS.length];
  return (
    <div className="surface-card overflow-hidden group cursor-pointer transition-shadow hover:shadow-elevated">
      <div className={`relative aspect-square bg-gradient-to-br ${grad} grid place-items-center`}>
        <span className="font-display text-3xl font-extrabold text-white/90">
          {product.name.split(" ").slice(0, 2).join(" ")}
        </span>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-orange px-2.5 py-1 text-[11px] font-bold text-white">
            {product.badge}
          </span>
        )}
        <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 backdrop-blur">
          <Heart className="h-4 w-4 text-navy" />
        </button>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs text-muted-foreground truncate">{product.shop}</p>
        <p className="text-sm font-semibold text-navy line-clamp-2 leading-snug min-h-[2.5em]">{product.name}</p>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-orange text-orange" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-orange">{fcfa(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{fcfa(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
