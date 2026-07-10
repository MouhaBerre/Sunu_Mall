"use client";

import { useMemo, useState } from "react";
import { BOUTIQUES, getBoutiqueProducts } from "@/lib/mock-data";
import { BoutiqueCard } from "@/components/boutique/BoutiqueCard";
import Link from "next/link";
import { Search, Grid3x3, List, BadgeCheck } from "lucide-react";

type Tab = "toutes" | "officielles" | "nouvelles";
type Sort = "populaires" | "mieux_notes" | "recents";

const CATEGORY_FILTERS = [...new Set(BOUTIQUES.map((b) => b.categorie))];

function BoutiquesScreen() {
  const [tab, setTab] = useState<Tab>("toutes");
  const [sort, setSort] = useState<Sort>("populaires");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);

  const boutiques = useMemo(() => {
    let list = [...BOUTIQUES];
    if (tab === "officielles") list = list.filter((b) => b.estOfficielle);
    if (tab === "nouvelles") list = list.filter((b) => b.estNouvelle);
    if (category) list = list.filter((b) => b.categorie === category);
    if (minRating) list = list.filter((b) => b.note >= minRating);
    if (query.trim()) list = list.filter((b) => b.nom.toLowerCase().includes(query.trim().toLowerCase()));

    if (sort === "mieux_notes") list.sort((a, b) => b.note - a.note);
    else if (sort === "recents") list.sort((a, b) => Number(b.estNouvelle) - Number(a.estNouvelle));
    else list.sort((a, b) => b.nbAvis - a.nbAvis);
    return list;
  }, [tab, sort, query, category, minRating]);

  const reset = () => { setCategory(null); setMinRating(null); setQuery(""); setTab("toutes"); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-[280px_1fr] gap-6 items-start">
      {/* ─── SIDEBAR FILTRES ─── */}
      <aside className="bg-white rounded-xl border border-gray-100 p-5 lg:sticky lg:top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-gray-800">Filtres</h3>
          <button onClick={reset} className="text-xs font-semibold text-orange hover:underline">Réinitialiser</button>
        </div>

        <FilterGroup label="Rechercher une boutique">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom de la boutique..."
              className="w-full rounded-lg border border-gray-200 pl-3 pr-9 py-2 text-sm outline-none focus:border-orange"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </FilterGroup>

        <FilterGroup label="Catégories">
          <button
            onClick={() => setCategory(null)}
            className={`flex w-full items-center gap-2 text-sm py-1 ${category === null ? "text-orange font-semibold" : "text-gray-600 hover:text-orange"}`}
          >
            <span className={`h-3.5 w-3.5 rounded border ${category === null ? "border-orange bg-orange" : "border-gray-300"}`} /> Toutes les catégories
          </button>
          {CATEGORY_FILTERS.map((c) => {
            const count = BOUTIQUES.filter((b) => b.categorie === c).reduce((n, b) => n + getBoutiqueProducts(b.slug).length, 0);
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(active ? null : c)}
                className={`flex w-full items-center justify-between gap-2 text-sm py-1 ${active ? "text-orange font-semibold" : "text-gray-600 hover:text-orange"}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-3.5 w-3.5 rounded border ${active ? "border-orange bg-orange" : "border-gray-300"}`} /> {c}
                </span>
                <span className="text-xs text-gray-400">{count}</span>
              </button>
            );
          })}
        </FilterGroup>

        <FilterGroup label="Type de boutique">
          {([["officielles", "Boutiques officielles"], ["nouvelles", "Nouvelles boutiques"]] as [Tab, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(tab === value ? "toutes" : value)}
              className={`flex items-center gap-2 text-sm py-1 ${tab === value ? "text-orange font-semibold" : "text-gray-600 hover:text-orange"}`}
            >
              <span className={`h-3.5 w-3.5 rounded border ${tab === value ? "border-orange bg-orange" : "border-gray-300"}`} />
              <span className="flex items-center gap-1">{label}{value === "officielles" && <BadgeCheck className="h-3.5 w-3.5 text-navy" />}</span>
            </button>
          ))}
        </FilterGroup>

        <FilterGroup label="Évaluation">
          {[5, 4, 3, 2].map((n) => (
            <button
              key={n}
              onClick={() => setMinRating(minRating === n ? null : n)}
              className={`flex items-center gap-2 text-sm py-1 ${minRating === n ? "font-semibold" : ""}`}
            >
              <span className={`h-3.5 w-3.5 rounded border ${minRating === n ? "border-orange bg-orange" : "border-gray-300"}`} />
              <span className="flex gap-0.5 text-orange">{"★".repeat(n)}<span className="text-gray-200">{"★".repeat(5 - n)}</span></span>
              <span className="text-xs text-gray-400">et plus</span>
            </button>
          ))}
        </FilterGroup>

        <button className="btn-orange w-full rounded-xl py-2.5 text-sm font-bold mt-1">Voir les {boutiques.length} boutiques</button>
      </aside>

      {/* ─── MAIN ─── */}
      <div>
        <nav className="text-xs text-gray-400 mb-2">
          <Link href="/" className="hover:text-orange">Accueil</Link> <span className="mx-1">/</span> <span className="text-gray-700">Boutiques</span>
        </nav>

        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-gray-900">Toutes les boutiques</h1>
            <p className="mt-1 text-sm text-gray-500">Découvrez nos meilleures boutiques partenaires</p>
          </div>
          <p className="text-sm text-gray-400">{boutiques.length} boutique{boutiques.length > 1 ? "s" : ""} trouvée{boutiques.length > 1 ? "s" : ""}</p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="inline-flex items-center gap-1 rounded-xl border border-gray-100 bg-white p-1">
            {([["toutes", "Toutes les boutiques"], ["officielles", "Boutiques officielles"], ["nouvelles", "Nouvelles boutiques"]] as [Tab, string][]).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`rounded-lg text-sm font-semibold px-4 py-2 flex items-center gap-1 transition-colors ${tab === value ? "bg-orange/10 text-orange" : "text-gray-500 hover:text-orange"}`}
              >
                {label}{value === "officielles" && <BadgeCheck className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Trier par :</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
            >
              <option value="populaires">Plus populaires</option>
              <option value="mieux_notes">Mieux notées</option>
              <option value="recents">Plus récentes</option>
            </select>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button aria-label="Vue grille" className="p-2 bg-orange text-white"><Grid3x3 className="h-4 w-4" /></button>
              <button aria-label="Vue liste" className="p-2 bg-white text-gray-400"><List className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        {boutiques.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
            <p className="font-display text-lg font-bold text-gray-800">Aucune boutique ne correspond à vos filtres</p>
            <button onClick={reset} className="btn-orange rounded-xl px-6 py-3 font-bold mt-4">Réinitialiser les filtres</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {boutiques.map((b) => <BoutiqueCard key={b.slug} boutique={b} />)}
            </div>
            <div className="mt-8 flex items-center justify-center gap-1">
              <button disabled className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-300">←</button>
              <button className="rounded-lg px-3 py-1.5 text-sm bg-orange text-white font-semibold">1</button>
              <button disabled className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-300">→</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">{label}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export default BoutiquesScreen;
