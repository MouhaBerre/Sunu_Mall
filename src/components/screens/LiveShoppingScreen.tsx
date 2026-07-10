"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LIVE_STREAMS, LIVE_CHAT, getBoutique, getBoutiqueProducts, fcfa,
  type LiveStream,
} from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import {
  Eye, Heart, Send, BadgeCheck, ShoppingBag, Play, Video, MessageSquare, ShoppingCart, ShieldCheck,
  Smartphone, Shirt, Utensils, Dumbbell, Sparkles, LayoutGrid,
} from "lucide-react";

type Tab = "tous" | "populaires" | "a_venir";

const LIVE_CATEGORIES = [
  { label: "Tous les lives", icon: LayoutGrid, value: null },
  { label: "Électronique", icon: Smartphone, value: "Électronique" },
  { label: "Mode & Boubou", icon: Shirt, value: "Mode & Boubou" },
  { label: "Alimentation", icon: Utensils, value: "Alimentation" },
  { label: "Beauté & Bien-être", icon: Sparkles, value: "Beauté & Bien-être" },
  { label: "Sport", icon: Dumbbell, value: "Sport" },
];

const STEPS = [
  { icon: Video, title: "Regardez un live", desc: "Découvrez des produits en direct" },
  { icon: MessageSquare, title: "Posez vos questions", desc: "Interagissez avec le vendeur en temps réel" },
  { icon: ShoppingCart, title: "Ajoutez au panier", desc: "Sélectionnez et ajoutez vos produits" },
  { icon: ShieldCheck, title: "Payez en sécurité", desc: "Recevez votre commande rapidement" },
];

function LiveShoppingScreen() {
  const [activeId, setActiveId] = useState(LIVE_STREAMS[0].id);
  const [tab, setTab] = useState<Tab>("tous");
  const [category, setCategory] = useState<string | null>(null);
  const addToCart = useStore((s) => s.addToCart);

  const active = LIVE_STREAMS.find((l) => l.id === activeId)!;
  const activeBoutique = getBoutique(active.boutiqueSlug);
  const featured = getBoutiqueProducts(active.boutiqueSlug).slice(0, 5);
  const liveNow = LIVE_STREAMS.filter((l) => l.statut === "live");

  const grid = useMemo(() => {
    let list = LIVE_STREAMS;
    if (tab === "populaires") list = list.filter((l) => l.populaire);
    else if (tab === "a_venir") list = list.filter((l) => l.statut === "a_venir");
    if (category) list = list.filter((l) => l.categorie === category);
    return list;
  }, [tab, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid xl:grid-cols-[240px_1fr_320px] gap-6 items-start">
        {/* ─── LEFT ─── */}
        <aside className="space-y-4 order-2 xl:order-1">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> En direct maintenant</span>
              <span className="text-xs bg-white/15 rounded-full px-2 py-0.5">{liveNow.length}</span>
            </div>
            <ul className="p-2">
              {liveNow.map((l) => {
                const b = getBoutique(l.boutiqueSlug);
                const active2 = l.id === activeId;
                return (
                  <li key={l.id}>
                    <button onClick={() => setActiveId(l.id)} className={`w-full flex items-center gap-2.5 rounded-lg p-2 text-left transition-colors ${active2 ? "bg-orange/5" : "hover:bg-gray-50"}`}>
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                        <img src={l.thumbnail} alt={b?.nom} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-800 flex items-center gap-1 truncate">
                          {b?.nom}<span className="text-[9px] font-bold bg-red-500 text-white px-1 rounded">LIVE</span>
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">{l.titre}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5 shrink-0"><Eye className="h-3 w-3" /> {l.viewers}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="p-2 pt-0">
              <button className="w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">Voir plus de lives</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="font-display font-bold text-gray-800 mb-3">Catégories Live</h4>
            <nav className="space-y-1">
              {LIVE_CATEGORIES.map((c) => {
                const active2 = category === c.value;
                return (
                  <button key={c.label} onClick={() => setCategory(c.value)} className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${active2 ? "bg-orange/5 text-orange font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-orange"}`}>
                    <c.icon className="h-4 w-4" /> {c.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ─── CENTER ─── */}
        <div className="order-1 xl:order-2 space-y-6">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="text-orange">TikTok</span> Live Shopping
            </h1>
            <p className="text-sm text-gray-500">Découvrez des produits en direct et achetez instantanément</p>
          </div>

          {/* Player */}
          <div className="relative rounded-2xl overflow-hidden bg-navy aspect-video">
            <img src={active.thumbnail} alt={activeBoutique?.nom} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

            <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white">LIVE</span>

            {/* Streamer header */}
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 pr-3 pl-1 py-1">
              <span className="h-8 w-8 rounded-full grid place-items-center text-white text-xs font-bold" style={{ backgroundColor: activeBoutique?.logoColor }}>
                {activeBoutique?.logoInitials}
              </span>
              <div className="text-white">
                <p className="text-xs font-semibold flex items-center gap-1">{activeBoutique?.nom} <BadgeCheck className="h-3 w-3" /></p>
                <p className="text-[10px] text-white/70">{active.viewers} spectateurs</p>
              </div>
            </div>

            {/* Chat overlay */}
            <div className="absolute left-4 bottom-16 space-y-2 max-w-xs hidden sm:block">
              {LIVE_CHAT.map((c) => (
                <div key={c.user} className="flex items-start gap-2">
                  <span className="h-6 w-6 rounded-full bg-white/20 text-white grid place-items-center text-[9px] font-bold shrink-0">{c.initiales}</span>
                  <div className="rounded-lg bg-black/40 px-2.5 py-1 text-white">
                    <p className="text-[10px] font-semibold text-orange-light">{c.user}</p>
                    <p className="text-[11px]">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div className="absolute left-4 right-4 bottom-4 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-full bg-black/40 px-4 py-2">
                <input placeholder="Ajouter un commentaire..." className="flex-1 bg-transparent text-sm text-white placeholder-white/60 outline-none" />
                <button aria-label="Envoyer" className="text-white"><Send className="h-4 w-4" /></button>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-2 text-white text-sm"><Heart className="h-4 w-4 fill-red-500 text-red-500" /> {active.likes}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 flex items-center gap-1">
            {([["tous", "Tous les lives"], ["populaires", "Populaires"], ["a_venir", "À venir"]] as [Tab, string][]).map(([value, label]) => (
              <button key={value} onClick={() => setTab(value)} className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${tab === value ? "border-orange text-orange font-semibold" : "border-transparent text-gray-500 hover:text-orange"}`}>{label}</button>
            ))}
          </div>

          {/* Live grid */}
          {grid.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-12 text-center text-gray-500">Aucun live pour ce filtre.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {grid.map((l) => <LiveCard key={l.id} live={l} onClick={() => l.statut === "live" && setActiveId(l.id)} />)}
            </div>
          )}

          {/* Comment ça marche */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-display text-lg font-bold text-gray-800 mb-4">Comment ça marche ?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-9 w-9 rounded-full bg-orange/10 text-orange grid place-items-center"><s.icon className="h-4 w-4" /></span>
                    <span className="text-xs font-bold text-gray-300">0{i + 1}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                  <p className="text-xs text-gray-400 leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Devenez vendeur live */}
          <section className="rounded-2xl bg-gradient-to-r from-pink-100 to-orange/10 p-6 flex items-center justify-between gap-4 overflow-hidden">
            <div>
              <h3 className="font-display text-xl font-extrabold text-gray-900">Devenez vendeur live</h3>
              <p className="text-sm text-gray-600 mt-1 max-w-xs">Boostez vos ventes grâce au live shopping.</p>
              <Link href="/register-merchant" className="btn-orange inline-block rounded-xl px-5 py-2.5 text-sm font-bold mt-4">Créer un live</Link>
            </div>
            <div className="hidden sm:grid place-items-center h-24 w-24 rounded-2xl bg-white/60 shrink-0">
              <Video className="h-10 w-10 text-orange" />
            </div>
          </section>
        </div>

        {/* ─── RIGHT : Produits en vedette ─── */}
        <aside className="order-3 xl:sticky xl:top-20">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h4 className="font-display font-bold text-navy flex items-center gap-1.5"><ShoppingBag className="h-4 w-4 text-orange" /> Produits en vedette</h4>
              <span className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-400" />
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-orange text-[10px] text-white grid place-items-center font-bold">{featured.length}</span>
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {featured.map((p) => (
                <li key={p.id} className="p-3 flex items-center gap-3">
                  <Link href={`/product/${p.id}`} className="h-12 w-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${p.id}`} className="text-xs font-semibold text-gray-800 line-clamp-1 hover:text-orange">{p.name}</Link>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{p.shop}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-bold text-orange">{fcfa(p.price)}</span>
                      {p.oldPrice && <span className="text-[10px] text-gray-400 line-through">{fcfa(p.oldPrice)}</span>}
                    </div>
                  </div>
                  <button onClick={() => addToCart(p)} className="btn-orange rounded-lg px-3 py-1.5 text-xs font-bold shrink-0">Acheter</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LiveCard({ live, onClick }: { live: LiveStream; onClick: () => void }) {
  const b = getBoutique(live.boutiqueSlug);
  const CatIcon = { "Électronique": Smartphone, "Mode & Boubou": Shirt, "Alimentation": Utensils, "Beauté & Bien-être": Sparkles, "Sport": Dumbbell }[live.categorie] ?? LayoutGrid;
  return (
    <button onClick={onClick} className="group text-left bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-orange/40 hover:shadow-lg transition-all">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img src={live.thumbnail} alt={b?.nom} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={`absolute left-2 top-2 flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${live.statut === "live" ? "bg-red-500" : "bg-navy"}`}>
          {live.statut === "live" ? <><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE</> : "À VENIR"}
        </span>
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white"><Eye className="h-3 w-3" /> {live.viewers}</span>
        <span className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="h-12 w-12 rounded-full bg-white/90 grid place-items-center"><Play className="h-5 w-5 text-orange fill-orange ml-0.5" /></span>
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">{b?.nom} <BadgeCheck className="h-3.5 w-3.5 text-navy" /></p>
        <p className="text-xs text-gray-400 line-clamp-1">{live.titre}</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange/10 text-orange text-[10px] font-semibold px-2 py-0.5"><CatIcon className="h-3 w-3" /> {live.categorie}</span>
      </div>
    </button>
  );
}

export default LiveShoppingScreen;
