"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { getBoutique, getBoutiqueReviews, getRatingBreakdown } from "@/lib/mock-data";
import { Star, BadgeCheck, CornerDownRight } from "lucide-react";

function BoutiqueAvisScreen() {
  const { slug } = useParams<{ slug: string }>();
  const boutique = getBoutique(slug);
  const reviews = getBoutiqueReviews(slug);
  const [filter, setFilter] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!boutique) return null;
  const breakdown = getRatingBreakdown(boutique.note);
  const shown = filter ? reviews.filter((r) => r.note === filter) : reviews;

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
      {/* Summary + form */}
      <aside className="space-y-4 lg:sticky lg:top-20">
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
          <p className="font-display text-5xl font-extrabold text-navy">{boutique.note}</p>
          <div className="flex gap-0.5 justify-center text-orange text-lg mt-1">{"★".repeat(Math.round(boutique.note))}<span className="text-gray-200">{"★".repeat(5 - Math.round(boutique.note))}</span></div>
          <p className="text-xs text-gray-400 mt-1">Basé sur {boutique.nbAvis} avis</p>
          <div className="mt-4 space-y-1.5 text-left">
            {[5, 4, 3, 2, 1].map((n) => (
              <button key={n} onClick={() => setFilter(filter === n ? null : n)} className={`flex items-center gap-2 text-xs w-full ${filter === n ? "font-semibold" : ""}`}>
                <span className="text-gray-400 w-3">{n}</span>
                <Star className="h-3 w-3 fill-orange text-orange" />
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-orange rounded-full" style={{ width: `${breakdown[n]}%` }} />
                </div>
                <span className="text-gray-400 w-7 text-right">{breakdown[n]}%</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="font-display font-bold text-navy mb-3">Laisser un avis</h4>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} aria-label={`${n} étoile${n > 1 ? "s" : ""}`} onClick={() => setRating(n)}>
                <Star className={`h-6 w-6 ${n <= rating ? "fill-orange text-orange" : "text-gray-200"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec cette boutique..."
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange resize-none"
          />
          <button className="btn-orange w-full rounded-lg py-2.5 text-sm font-bold mt-3">Publier mon avis</button>
          <p className="text-[11px] text-gray-400 mt-2 text-center">Seuls les achats vérifiés peuvent être notés.</p>
        </div>
      </aside>

      {/* Reviews list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-gray-800">
            {shown.length} avis{filter ? ` · ${filter}★` : ""}
          </h3>
          {filter && <button onClick={() => setFilter(null)} className="text-sm text-orange font-semibold">Tout afficher</button>}
        </div>

        <div className="space-y-4">
          {shown.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-navy/10 text-navy grid place-items-center text-sm font-bold">{r.initiales}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    {r.client}
                    {r.achatVerifie && <span className="text-[10px] text-success flex items-center gap-0.5"><BadgeCheck className="h-3 w-3" /> Achat vérifié</span>}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="flex gap-0.5 text-orange text-xs">{"★".repeat(r.note)}<span className="text-gray-200">{"★".repeat(5 - r.note)}</span></span>
                    <span className="text-[11px] text-gray-400">{r.date}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{r.commentaire}</p>
              {r.reponseVendeur && (
                <div className="mt-3 ml-4 rounded-lg bg-gray-50 border border-gray-100 p-3">
                  <p className="text-xs font-semibold text-navy flex items-center gap-1"><CornerDownRight className="h-3.5 w-3.5" /> Réponse de {boutique.nom}</p>
                  <p className="mt-1 text-sm text-gray-500">{r.reponseVendeur}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BoutiqueAvisScreen;
