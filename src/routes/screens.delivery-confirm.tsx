import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame, StatusBar } from "@/components/mock/PhoneFrame";
import { Check, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/screens/delivery-confirm")({ component: DeliveryConfirm });

function DeliveryConfirm() {
  const [rating, setRating] = useState(5);
  return (
    <div className="flex justify-center py-6">
      <PhoneFrame label="25 — Confirmation de livraison">
        <StatusBar />
        <div className="px-6 pt-6 pb-8 flex flex-col items-center text-center">
          <div className="relative">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-success/10">
              <Check className="h-14 w-14 text-success stroke-[3]" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-success/30 animate-ping" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-navy mt-6">Colis livré !</h1>
          <p className="text-sm text-muted-foreground mt-1">Commande #CMD-1246 remise à Aminata Fall</p>
          <p className="text-xs text-muted-foreground mt-3">📍 Cité Keur Gorgui, Villa N°23<br />🕒 25 juin 2026 — 15:47</p>
        </div>

        <div className="mx-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-navy grid place-items-center text-white font-display font-bold">M</div>
            <div>
              <p className="font-semibold text-navy">Modou Ndiaye</p>
              <p className="text-xs text-muted-foreground">Livreur</p>
            </div>
          </div>
          <p className="text-xs font-medium text-navy mt-4">Comment s'est passée la livraison ?</p>
          <div className="flex justify-center gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)}>
                <Star className={`h-8 w-8 ${n <= rating ? "fill-orange text-orange" : "text-muted"}`} />
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-semibold text-orange mt-2">Excellent !</p>
          <textarea rows={3} placeholder="Un mot pour Modou (optionnel)..." className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-orange resize-none" />
        </div>

        <div className="mx-4 mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-navy">Évaluer le vendeur</p>
          <p className="text-sm font-semibold text-navy mt-1">Tech World Dakar</p>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-5 w-5 ${n <= 4 ? "fill-orange text-orange" : "text-muted"}`} />)}
          </div>
        </div>

        <div className="px-4 pt-4 pb-6 space-y-2">
          <button className="btn-orange w-full rounded-xl py-3 text-sm font-bold">Envoyer mon avis</button>
          <button className="w-full rounded-xl border border-border bg-card py-3 text-sm font-semibold text-navy">Plus tard</button>
        </div>
      </PhoneFrame>
    </div>
  );
}
