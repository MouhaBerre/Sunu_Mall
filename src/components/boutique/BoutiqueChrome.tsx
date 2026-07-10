"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { getBoutique, getBoutiqueProducts } from "@/lib/mock-data";
import { Star, BadgeCheck, Heart, Share2, MessageSquare, MapPin, Home, Package, Tag, Radio, Star as StarIcon, Info, Store } from "lucide-react";
import * as Icons from "lucide-react";

const iconMap: Record<string, any> = Icons;

const TABS = [
  { key: "", label: "Accueil", icon: Home },
  { key: "produits", label: "Tous les produits", icon: Package },
  { key: "promotions", label: "Promotions", icon: Tag },
  { key: "live", label: "Live Shopping", icon: Radio, badge: "LIVE" },
  { key: "avis", label: "Avis", icon: StarIcon },
  { key: "a-propos", label: "À propos", icon: Info },
];

export function BoutiqueChrome({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug: string }>();
  const pathname = usePathname();
  const [following, setFollowing] = useState(false);
  const boutique = getBoutique(params.slug);

  if (!boutique) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-800">Boutique introuvable</h1>
        <p className="text-gray-400 mt-2">Cette boutique n'existe pas ou a été retirée.</p>
        <Link href="/boutiques" className="btn-orange inline-block rounded-xl px-6 py-3 font-bold mt-6">Voir toutes les boutiques</Link>
      </div>
    );
  }

  const base = `/boutiques/${boutique.slug}`;
  const nbProduits = getBoutiqueProducts(boutique.slug).length;
  const LogoIcon = iconMap[boutique.logoIcon] ?? Store;
  const activeKey = pathname === base ? "" : pathname.replace(`${base}/`, "").split("/")[0];

  const stats = [
    { value: String(nbProduits), label: "Produits" },
    { value: `${boutique.avisPositifs}%`, label: "Avis positifs" },
    { value: boutique.nbAbonnes, label: "Abonnés" },
    { value: boutique.tempsReponse, label: "Temps de réponse" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <nav className="text-xs text-gray-400 mb-3">
        <Link href="/" className="hover:text-orange">Accueil</Link> <span className="mx-1">/</span>
        <Link href="/boutiques" className="hover:text-orange">Boutiques</Link> <span className="mx-1">/</span>
        <span className="text-gray-700">{boutique.nom}</span>
      </nav>

      {/* ─── BANNER ─── */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="relative h-44 md:h-52">
          <img src={boutique.bannerImage} alt={boutique.nom} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-8">
          <div className="text-white max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold">{boutique.nom}</h1>
              {boutique.estOfficielle && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange/90 px-2.5 py-1 text-[11px] font-bold">
                  <BadgeCheck className="h-3.5 w-3.5" /> Boutique Officielle
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-white/80">{boutique.tagline}</p>
            <div className="mt-3 hidden sm:flex flex-wrap gap-4 text-[11px] text-white/70">
              <span>🚚 Livraison rapide</span>
              <span>✅ Produits authentiques</span>
              <span>🔒 Paiement sécurisé</span>
              <span>🎧 Support 24/7</span>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-2">
            <button
              onClick={() => setFollowing((v) => !v)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-colors ${following ? "bg-orange text-white" : "bg-white text-navy hover:bg-gray-100"}`}
            >
              <Heart className={`h-4 w-4 ${following ? "fill-white" : ""}`} /> {following ? "Suivi" : "Suivre"}
            </button>
            <button className="rounded-lg bg-white/15 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-white/25 transition-colors">
              <Share2 className="h-4 w-4" /> Partager
            </button>
          </div>
        </div>
      </div>

      {/* ─── PROFILE HEADER ─── */}
      <div className="relative bg-white rounded-2xl border border-gray-100 -mt-6 mx-3 md:mx-6 px-5 md:px-8 pt-8 pb-5 shadow-sm">
        <div className="absolute -top-10 left-6 md:left-8 h-20 w-20 rounded-full grid place-items-center bg-white ring-4 ring-white shadow">
          <div
            className="h-full w-full rounded-full grid place-items-center text-white"
            style={{ backgroundColor: boutique.logoColor }}
          >
            <LogoIcon className="h-9 w-9" strokeWidth={2.2} />
          </div>
        </div>

        <div className="ml-24 md:ml-28 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-xl font-bold text-navy">{boutique.nom}</h2>
              {boutique.estVerifiee && <BadgeCheck className="h-5 w-5 text-navy" />}
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm flex-wrap">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-orange text-orange" />
                <span className="font-semibold text-gray-700">{boutique.note}</span>
                <span className="text-gray-400">({boutique.nbAvis} avis)</span>
              </span>
              <span className="text-gray-400">· {boutique.nbAbonnes} abonnés</span>
            </div>
            <p className="mt-1 text-xs text-gray-400 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">{boutique.categorie}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Ouvert depuis {boutique.dateOuverture}</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-lg font-extrabold text-navy">{s.value}</p>
                <p className="text-[11px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          <button className="btn-orange rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Contacter la boutique
          </button>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="mt-4 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 min-w-max px-1">
          {TABS.map((t) => {
            const href = t.key ? `${base}/${t.key}` : base;
            const active = activeKey === t.key;
            const Ic = t.icon;
            return (
              <Link
                key={t.key || "accueil"}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  active ? "border-orange text-orange font-semibold" : "border-transparent text-gray-500 hover:text-orange"
                }`}
              >
                <Ic className="h-4 w-4" /> {t.label}
                {t.badge && <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">{t.badge}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="py-6">{children}</div>
    </div>
  );
}
