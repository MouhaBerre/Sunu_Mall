"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductCard } from "@/components/mock/ProductCard";
import {
  getBoutique, getBoutiqueProducts, getBoutiqueCategories, getBoutiqueReviews, getRatingBreakdown, fcfa,
} from "@/lib/mock-data";
import { ChevronRight, Clock, Star, MapPin, Phone, Mail, BadgeCheck } from "lucide-react";

function BoutiqueHomeScreen() {
  const { slug } = useParams<{ slug: string }>();
  const boutique = getBoutique(slug);
  if (!boutique) return null;

  const products = getBoutiqueProducts(slug);
  const offers = products.filter((p) => p.oldPrice);
  const populaires = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const nouveautes = products.filter((p) => p.badge === "Nouveau").concat(products).slice(0, 5);
  const categories = getBoutiqueCategories(slug);
  const reviews = getBoutiqueReviews(slug);
  const breakdown = getRatingBreakdown(boutique.note);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* ─── MAIN ─── */}
      <div className="space-y-8">
        {/* Offres spéciales */}
        {offers.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold text-gray-800">Offres spéciales</h3>
              <Link href={`/boutiques/${slug}/promotions`} className="text-sm text-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Voir toutes les offres <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {offers.map((p) => {
                const discount = Math.round(((p.oldPrice! - p.price) / p.oldPrice!) * 100);
                return (
                  <Link key={p.id} href={`/product/${p.id}`} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:border-orange/40 hover:shadow-md transition-all">
                    <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                      {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                      <span className="absolute left-1 top-1 rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">-{discount}%</span>
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{p.name}</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-orange">{fcfa(p.price)}</span>
                        <span className="text-[11px] text-gray-400 line-through">{fcfa(p.oldPrice!)}</span>
                      </div>
                      <span className="mt-auto text-[11px] text-danger flex items-center gap-1"><Clock className="h-3 w-3" /> Fin dans 02h : 45m : 18s</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Produits populaires */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-bold text-gray-800">Produits populaires</h3>
            <Link href={`/boutiques/${slug}/produits`} className="text-sm text-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Voir tous les produits <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {populaires.map((p, i) => (
              <Link key={p.id} href={`/product/${p.id}`}><ProductCard product={p} index={i} /></Link>
            ))}
          </div>
        </section>

        {/* Nouveautés */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-bold text-gray-800">Nouveautés</h3>
            <Link href={`/boutiques/${slug}/produits`} className="text-sm text-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Voir toutes les nouveautés <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {nouveautes.map((p, i) => (
              <Link key={p.id + "-n" + i} href={`/product/${p.id}`}><ProductCard product={p} index={i} /></Link>
            ))}
          </div>
        </section>
      </div>

      {/* ─── SIDEBAR ─── */}
      <aside className="space-y-4 lg:sticky lg:top-20">
        {/* À propos */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="font-display font-bold text-navy mb-3">À propos de la boutique</h4>
          <p className="text-sm text-gray-500 leading-relaxed">{boutique.description}</p>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-orange shrink-0" /> {boutique.adresse}</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange shrink-0" /> {boutique.telephone}</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-orange shrink-0" /> {boutique.email}</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-orange shrink-0" /> {boutique.horaires}</p>
          </div>
          <Link href={`/boutiques/${slug}/a-propos`} className="mt-4 inline-flex items-center gap-1 text-sm text-orange font-semibold hover:gap-2 transition-all">
            Voir plus d'informations <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Catégories */}
        {categories.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-navy">Catégories de la boutique</h4>
              <Link href={`/boutiques/${slug}/produits`} className="text-xs text-orange font-semibold">Voir tout</Link>
            </div>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.nom} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{c.nom}</span>
                  <span className="text-gray-400">{c.compteur}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Avis */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display font-bold text-navy">Avis des clients</h4>
            <Link href={`/boutiques/${slug}/avis`} className="text-xs text-orange font-semibold">Voir tous les avis</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-display text-4xl font-extrabold text-navy">{boutique.note}</p>
              <div className="flex gap-0.5 justify-center text-orange">{"★".repeat(Math.round(boutique.note))}</div>
              <p className="text-[11px] text-gray-400 mt-1">Basé sur {boutique.nbAvis} avis</p>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n} className="flex items-center gap-2 text-[11px]">
                  <span className="text-gray-400 w-3">{n}</span>
                  <Star className="h-3 w-3 fill-orange text-orange" />
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-orange rounded-full" style={{ width: `${breakdown[n]}%` }} />
                  </div>
                  <span className="text-gray-400 w-7 text-right">{breakdown[n]}%</span>
                </div>
              ))}
            </div>
          </div>
          {reviews[0] && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-navy/10 text-navy grid place-items-center text-xs font-bold">{reviews[0].initiales}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    {reviews[0].client}
                    {reviews[0].achatVerifie && <span className="text-[10px] text-success flex items-center gap-0.5"><BadgeCheck className="h-3 w-3" /> Achat vérifié</span>}
                  </p>
                  <div className="flex gap-0.5 text-orange text-xs">{"★".repeat(reviews[0].note)}</div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{reviews[0].commentaire}</p>
              <p className="mt-1 text-[11px] text-gray-400">{reviews[0].date}</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default BoutiqueHomeScreen;
