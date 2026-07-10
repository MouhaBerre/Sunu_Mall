"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getBoutique, getBoutiqueProducts } from "@/lib/mock-data";
import { Radio, Play, Users, Calendar, Bell } from "lucide-react";

function BoutiqueLiveScreen() {
  const { slug } = useParams<{ slug: string }>();
  const boutique = getBoutique(slug);
  const products = getBoutiqueProducts(slug);
  if (!boutique) return null;

  const featured = products[0];

  const upcoming = [
    { titre: `Nouveautés ${boutique.categorie}`, date: "Aujourd'hui · 18h00", viewers: "En direct", live: true },
    { titre: "Déstockage & bons plans", date: "Demain · 20h30", viewers: "Programmé", live: false },
    { titre: "Session questions-réponses", date: "Samedi · 16h00", viewers: "Programmé", live: false },
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* Live player */}
      <div>
        <div className="relative rounded-2xl overflow-hidden bg-navy aspect-video">
          {featured?.image && <img src={featured.image} alt="" className="w-full h-full object-cover opacity-60" />}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-white" /> EN DIRECT
          </span>
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
            <Users className="h-3.5 w-3.5" /> 1.2k spectateurs
          </span>
          <button className="absolute inset-0 grid place-items-center">
            <span className="h-16 w-16 rounded-full bg-white/90 grid place-items-center shadow-lg hover:scale-110 transition-transform">
              <Play className="h-7 w-7 text-orange fill-orange ml-1" />
            </span>
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="font-display text-lg font-bold">Nouveautés {boutique.categorie} — en direct</p>
            <p className="text-sm text-white/70">{boutique.nom} vous présente ses derniers produits</p>
          </div>
        </div>

        {featured && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
              {featured.image && <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-orange">🔴 Produit présenté en direct</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{featured.name}</p>
            </div>
            <Link href={`/product/${featured.id}`} className="btn-orange rounded-lg px-4 py-2 text-sm font-bold whitespace-nowrap">Acheter</Link>
          </div>
        )}
      </div>

      {/* Schedule */}
      <aside className="space-y-4 lg:sticky lg:top-20">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="font-display font-bold text-navy mb-3 flex items-center gap-2"><Radio className="h-4 w-4 text-orange" /> Programme des lives</h4>
          <ul className="space-y-3">
            {upcoming.map((u) => (
              <li key={u.titre} className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${u.live ? "bg-red-500/10 text-red-500" : "bg-navy/5 text-navy"}`}>
                  {u.live ? <Radio className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{u.titre}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">{u.date} · {u.viewers}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-lg border border-orange text-orange py-2 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-orange/5">
            <Bell className="h-4 w-4" /> M'alerter des prochains lives
          </button>
        </div>
      </aside>
    </div>
  );
}

export default BoutiqueLiveScreen;
