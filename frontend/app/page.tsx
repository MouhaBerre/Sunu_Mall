"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MarketHeader } from "@/components/mock/MarketHeader";
import { ProductCard } from "@/components/mock/ProductCard";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { PRODUCTS } from "@/lib/mock-data";
import {
  ArrowRight,
  ShoppingBag,
  Store,
  Bike,
  Shield,
  Sparkles,
  Truck,
  CreditCard,
  MapPin,
  Zap,
  Headphones,
  ChevronRight,
  Play,
  Clock,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";

const LIVE_SHOPS = [
  { name: "Samsung Sénégal", tag: "Découvrez les nouveaux", viewers: "1.2k", color: "from-blue-600 to-blue-800" },
  { name: "Jumia Fashion", tag: "Nouveautés Mode", viewers: "843", color: "from-orange to-orange-dark" },
  { name: "Chic Shop", tag: "Collection été 2024", viewers: "512", color: "from-pink-500 to-rose-600" },
  { name: "Tech World", tag: "Accessoires originaux", viewers: "2.1k", color: "from-gray-800 to-gray-900" },
];

const WHY_ITEMS = [
  { icon: Truck, title: "Livraison rapide", desc: "Méthode rapide au Sénégal" },
  { icon: Shield, title: "Paiement sécurisé", desc: "100% sécurisé" },
  { icon: Tag, title: "Meilleurs prix", desc: "Promotions chaque jour" },
  { icon: Headphones, title: "Support 24/7", desc: "Assistance dédiée" },
  { icon: Zap, title: "Satisfait ou remboursé", desc: "Politique de retour" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── HEADER ─── */}
      <MarketHeader />

      {/* ─── HERO ─── */}
      <section style={{ background: "linear-gradient(135deg, #FFF8F0 0%, #FFF3E8 40%, #FDEEDD 100%)" }} className="border-b border-orange/10">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14 grid md:grid-cols-[1fr_1fr] gap-10 items-center">

          {/* Left: Text */}
          <div className="fade-in-up">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Tout le Sénégal<br />
              <span className="text-orange">dans une seule</span><br />
              plateforme
            </h1>
            <p className="mt-4 text-gray-500 text-base leading-relaxed max-w-md">
              Achetez en toute confiance parmi des milliers de boutiques et faites-vous livrer partout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="btn-orange rounded-xl px-6 py-3 text-sm font-bold inline-flex items-center gap-2"
              >
                Découvrir les boutiques
              </Link>
              <Link
                href="/register-merchant"
                className="rounded-xl bg-navy text-white px-6 py-3 text-sm font-bold hover:bg-navy-2 transition-colors inline-flex items-center gap-2"
              >
                Créer ma boutique
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { icon: Truck, title: "Livraison rapide", sub: "partout au Sénégal" },
                { icon: Shield, title: "Paiement sécurisé", sub: "Wave, Orange Money, CB" },
                { icon: Headphones, title: "Support 24/7", sub: "Nous sommes là" },
              ].map(({ icon: Ic, title, sub }) => (
                <div key={title} className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Ic className="h-4 w-4 text-orange" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">{title}</p>
                    <p className="text-[11px] text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Shopping illustration */}
          <div className="relative flex items-end justify-center fade-in-up" style={{ animationDelay: "150ms" }}>
            <img
              src="/hero-illustration.png"
              alt="Sunu Mall marketplace illustration"
              className="w-full max-w-[520px] drop-shadow-2xl"
            />
          </div>
        </div>
      </section>
      {/* ─── CATÉGORIES POPULAIRES ─── */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-gray-800">Catégories populaires</h2>
          <Link href="/category" className="text-sm text-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Voir toutes <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryCarousel />
      </section>

      {/* ─── PRODUITS POPULAIRES ─── */}
      <section className="mx-auto max-w-7xl px-4 py-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-gray-800">Produits populaires</h2>
          <Link href="/search" className="text-sm text-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {PRODUCTS.slice(0, 6).map((p, i) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <ProductCard product={p} index={i} />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── MEILLEURES NOTES ─── */}
      <section className="mx-auto max-w-7xl px-4 py-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-orange text-orange" />
            <h2 className="font-display text-xl font-bold text-gray-800">Les mieux notés</h2>
          </div>
          <Link href="/search" className="text-sm text-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...PRODUCTS]
            .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
            .slice(0, 6)
            .map((p, i) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <ProductCard product={p} index={i} />
              </Link>
            ))}
        </div>
      </section>

      {/* ─── MEILLEURES VENTES ─── */}
      <section className="mx-auto max-w-7xl px-4 py-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange" />
            <h2 className="font-display text-xl font-bold text-gray-800">Meilleures ventes</h2>
          </div>
          <Link href="/search" className="text-sm text-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...PRODUCTS]
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, 6)
            .map((p, i) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <ProductCard product={p} index={i} />
              </Link>
            ))}
        </div>
      </section>

      {/* ─── LIVE SHOPPING + OFFRES FLASH ─── */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          {/* Live Shopping */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-gray-800">Live Shopping</h2>
                <span className="text-[11px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-white rounded-full"></span> LIVE
                </span>
              </div>
              <Link href="/search" className="text-sm text-orange font-semibold flex items-center gap-1">
                Voir tous les lives <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LIVE_SHOPS.map((shop) => (
                <div key={shop.name} className="relative rounded-xl overflow-hidden group cursor-pointer">
                  <div className={`bg-gradient-to-b ${shop.color} aspect-[3/4] flex flex-col items-center justify-end p-3`}>
                    {/* Viewers badge */}
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                    </span>
                    <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                      👁 {shop.viewers}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="relative text-white">
                      <p className="text-xs font-bold">{shop.name}</p>
                      <p className="text-[10px] text-white/70 mt-0.5">{shop.tag}</p>
                    </div>
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-white/90 grid place-items-center shadow-lg">
                      <Play className="h-4 w-4 text-orange fill-orange ml-0.5" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Offres Flash */}
          <div className="rounded-2xl bg-gradient-to-br from-orange to-orange-dark p-5 text-white flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 fill-white" />
                  <span className="font-display font-bold text-lg">Offres Flash</span>
                </div>
              </div>
              <span className="text-[11px] bg-white/20 px-2 py-1 rounded-lg font-bold">FLASH</span>
            </div>
            {/* Countdown */}
            <div className="mt-4 flex items-center gap-2 justify-center">
              {[["02", "h"], ["15", "m"], ["48", "s"]].map(([val, unit]) => (
                <div key={unit} className="flex items-center gap-1">
                  <div className="bg-white/20 rounded-lg px-2.5 py-1.5 font-display text-2xl font-extrabold">{val}</div>
                  <span className="text-white/70 text-sm">{unit}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 flex-1">
              {PRODUCTS.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-white/15 rounded-xl p-2">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-white/20 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{p.name}</p>
                    <p className="text-[10px] text-white/70">{p.price.toLocaleString("fr-FR")} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/search"
              className="mt-4 w-full bg-white text-orange font-bold text-sm text-center py-2.5 rounded-xl hover:bg-orange-50 transition-colors block"
            >
              Voir toutes les offres →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── POURQUOI SUNU MALL ─── */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-xl font-bold text-gray-800 text-center mb-6">
            Pourquoi choisir Sunu Mall ?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {WHY_ITEMS.map(({ icon: Ic, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-2 p-4">
                <div className="h-12 w-12 rounded-xl bg-orange/10 grid place-items-center">
                  <Ic className="h-6 w-6 text-orange" />
                </div>
                <p className="font-semibold text-sm text-gray-700">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ESPACES UTILISATEURS ─── */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-orange uppercase tracking-widest">Pour tout le monde</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-gray-800">Un espace pour chacun</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: ShoppingBag, title: "Client", desc: "Panier multi-boutiques, paiement Wave/OM/CB, suivi GPS.", path: "/", bg: "bg-orange/10", ic: "text-orange" },
            { icon: Store, title: "Commerçant", desc: "Gestion catalogue, livreurs affiliés, analytics.", path: "/merchant", bg: "bg-blue-50", ic: "text-blue-600" },
            { icon: Bike, title: "Livreur", desc: "Courses assignées, itinéraire, preuve de livraison.", path: "/driver-dashboard", bg: "bg-green-50", ic: "text-green-600" },
            { icon: Shield, title: "Administrateur", desc: "Validation boutiques, commissions, modération.", path: "/admin", bg: "bg-purple-50", ic: "text-purple-600" },
          ].map((r, i) => (
            <Link
              key={r.title}
              href={r.path}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-orange/30 hover:shadow-md transition-all fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`h-12 w-12 rounded-xl ${r.bg} ${r.ic} grid place-items-center`}>
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display font-bold text-gray-800">{r.title}</h3>
              <p className="mt-1 text-sm text-gray-400 leading-relaxed">{r.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-orange group-hover:gap-2 transition-all">
                Voir l'espace <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── ABONNEMENTS ─── */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-orange uppercase tracking-widest">Monétisation</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-gray-800">Un abonnement adapté à chaque boutique</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { name: "Standard", price: "Gratuit", quota: "20 produits", perks: ["Fonctionnalités de base", "Support par email"], featured: false },
              { name: "Premium", price: "15 000 F/mois", quota: "200 produits", perks: ["Statistiques avancées", "Meilleure visibilité", "Support prioritaire"], featured: true },
              { name: "Premium+", price: "35 000 F/mois", quota: "Illimité", perks: ["Dashboard analytics complet", "Ventes en temps réel", "Mise en avant prioritaire"], featured: false },
            ].map((p) => (
              <div key={p.name} className={`relative rounded-2xl p-6 border transition-all ${p.featured ? "bg-navy border-navy text-white shadow-xl scale-[1.02]" : "bg-white border-gray-100 hover:border-orange/30 hover:shadow-md"}`}>
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                    POPULAIRE
                  </span>
                )}
                <p className={`text-xs font-bold uppercase tracking-widest ${p.featured ? "text-orange-light" : "text-orange"}`}>{p.name}</p>
                <p className={`mt-2 font-display text-2xl font-extrabold ${p.featured ? "text-white" : "text-gray-800"}`}>{p.price}</p>
                <p className={`text-sm mt-1 ${p.featured ? "text-white/60" : "text-gray-400"}`}>{p.quota}</p>
                <ul className={`mt-4 space-y-2 text-sm ${p.featured ? "text-white/80" : "text-gray-600"}`}>
                  {p.perks.map((pk) => <li key={pk} className="flex items-center gap-2">✓ {pk}</li>)}
                </ul>
                <Link
                  href="/subscriptions"
                  className={`mt-5 block text-center rounded-xl py-2.5 text-sm font-bold transition-colors ${p.featured ? "btn-orange" : "border border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                >
                  Voir le détail
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Logo size={36} variant="white" />
              <p className="text-white/60 text-xs mt-3 leading-relaxed">La marketplace qui connecte le Sénégal.</p>
            </div>
            {[
              ["Plateforme", ["Accueil", "Catégories", "Boutiques", "Promotions"]],
              ["Support", ["FAQ", "Contact", "Aide livreurs"]],
              ["Vendeurs", ["Créer boutique", "Abonnements", "Guide vendeur"]],
              ["Paiement", ["Wave", "Orange Money", "Carte bancaire"]],
            ].map(([title, items]: any) => (
              <div key={title}>
                <p className="font-display font-bold text-sm mb-3">{title}</p>
                <ul className="space-y-2">
                  {items.map((item: string) => (
                    <li key={item} className="text-white/50 text-xs hover:text-orange cursor-pointer transition-colors">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>© 2026 SUNU MALL — Made in Dakar 🇸🇳</p>
            <div className="flex items-center gap-4">
              {["Mentions légales", "Politique de confidentialité", "Conditions d'utilisation"].map((t) => (
                <span key={t} className="hover:text-white cursor-pointer transition-colors">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
