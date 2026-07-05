import { createFileRoute } from "@tanstack/react-router";
import { MarketHeader } from "@/components/mock/MarketHeader";
import { ProductCard } from "@/components/mock/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/mock-data";
import { ChevronRight, Zap, Truck, Shield, Headphones } from "lucide-react";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/screens/home")({ component: Home });

const iconMap: Record<string, any> = Icons;

function Home() {
  return (
    <div className="surface-card overflow-hidden">
      <MarketHeader />
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <div className="navy-panel relative overflow-hidden rounded-2xl p-10 flex items-center min-h-[300px]">
            <div className="relative z-10 max-w-md">
              <span className="rounded-full bg-orange px-3 py-1 text-xs font-bold text-white">🔥 Ventes flash</span>
              <h1 className="mt-4 font-display text-4xl font-extrabold text-white leading-tight">
                Le meilleur du Sénégal,<br /><span className="text-orange-light">livré chez vous.</span>
              </h1>
              <p className="mt-3 text-white/70 max-w-sm">Achetez local, payez facile, livraison rapide partout.</p>
              <button className="btn-orange mt-6 rounded-xl px-6 py-3 text-sm font-semibold">Découvrir les offres</button>
            </div>
            <div className="absolute -right-8 -bottom-8 h-64 w-64 rounded-full bg-orange/40 blur-3xl" />
            <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-orange-light/20 blur-2xl" />
          </div>
          <div className="grid gap-4">
            <div className="rounded-2xl p-5 bg-gradient-to-br from-orange to-orange-light text-white">
              <p className="text-xs font-semibold opacity-80">Nouveau</p>
              <p className="font-display text-xl font-extrabold mt-1">Live shopping</p>
              <p className="text-xs opacity-80 mt-1">Achetez en direct avec les vendeurs</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold text-orange">-20%</p>
              <p className="font-display text-xl font-bold text-navy mt-1">Toute la Mode</p>
              <p className="text-xs text-muted-foreground mt-1">Jusqu'au 30 juin</p>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            [Truck, "Livraison rapide", "24-72h partout au Sénégal"],
            [Shield, "Paiement sécurisé", "Wave, OM, CB"],
            [Zap, "Retour facile", "14 jours pour changer d'avis"],
            [Headphones, "Support 7j/7", "En Wolof et Français"],
          ].map(([Ic, t, d]: any) => (
            <div key={t} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange/10"><Ic className="h-5 w-5 text-orange" /></div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{t}</p>
                <p className="text-xs text-muted-foreground truncate">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-navy">Catégories populaires</h2>
          <a className="text-sm text-orange font-semibold flex items-center gap-1">Voir tout <ChevronRight className="h-4 w-4" /></a>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((c, i) => {
            const Ic = iconMap[c.icon.charAt(0).toUpperCase() + c.icon.slice(1)] ?? Icons.Package;
            return (
              <div key={c.name} className="surface-card p-4 flex flex-col items-center gap-2 hover:shadow-elevated cursor-pointer transition-shadow">
                <div className={`grid h-14 w-14 place-items-center rounded-full ${i % 2 === 0 ? "bg-orange/10 text-orange" : "bg-navy/5 text-navy"}`}>
                  <Ic className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-navy text-center">{c.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trending products */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-navy">Produits tendance</h2>
          <a className="text-sm text-orange font-semibold flex items-center gap-1">Voir tout <ChevronRight className="h-4 w-4" /></a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRODUCTS.slice(0, 6).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <footer className="border-t border-border bg-muted/30 px-6 py-8 mt-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          {[
            ["SUNU MALL", ["À propos", "Carrières", "Presse"]],
            ["Support", ["FAQ", "Contact", "Livraison"]],
            ["Vendeurs", ["Devenir vendeur", "Abonnements", "Guide"]],
            ["Paiement", ["Wave", "Orange Money", "Carte bancaire"]],
          ].map(([t, items]: any) => (
            <div key={t}>
              <p className="font-display font-bold text-navy mb-3">{t}</p>
              <ul className="space-y-1 text-muted-foreground">
                {items.map((i: string) => <li key={i} className="hover:text-orange cursor-pointer">{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
