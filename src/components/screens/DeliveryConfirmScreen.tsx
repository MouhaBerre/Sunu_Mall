"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/mock/DashboardShell";
import {
  LayoutDashboard, Package, MapPin, History, Wallet, Power, User, Settings, LogOut, Check, Star, Clock,
} from "lucide-react";
import { useState } from "react";

const DRIVER_NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" />, href: "/driver-dashboard" },
  { label: "Mes livraisons", icon: <Package className="h-4 w-4" />, active: true, href: "/driver-delivery" },
  { label: "Carte", icon: <MapPin className="h-4 w-4" /> },
  { label: "Historique", icon: <History className="h-4 w-4" /> },
  { label: "Revenus", icon: <Wallet className="h-4 w-4" /> },
  { label: "Disponibilité", icon: <Power className="h-4 w-4" /> },
  { label: "Profil", icon: <User className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
  { label: "Déconnexion", icon: <LogOut className="h-4 w-4" />, href: "/login" },
];

function DeliveryConfirm() {
  const [rating, setRating] = useState(5);
  const labels = ["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent !"];

  return (
    <DashboardShell
      nav={DRIVER_NAV}
      title="Livraison confirmée"
      subtitle="Commande #CMD-1246"
      user={{ name: "Modou Ndiaye", role: "Livreur" }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success */}
        <div className="surface-card p-8 flex flex-col items-center text-center">
          <div className="relative">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-success/10">
              <Check className="h-14 w-14 text-success stroke-[3]" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-success/30 animate-ping" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-navy mt-6">Colis livré !</h1>
          <p className="text-sm text-muted-foreground mt-1">Commande #CMD-1246 remise à Fatou Ndiaye</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Cité Keur Gorgui, Villa N°23</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 25 juin 2026 — 15:47</span>
          </div>
          <div className="mt-4 rounded-lg bg-success/10 px-4 py-2 text-sm font-bold text-success">+ 2 500 FCFA ajoutés à vos gains</div>
        </div>

        {/* Rating */}
        <div className="surface-card p-6">
          <p className="text-sm font-medium text-navy">Comment s'est passée cette livraison ?</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} aria-label={`${n} étoile${n > 1 ? "s" : ""}`} onClick={() => setRating(n)}>
                <Star className={`h-9 w-9 ${n <= rating ? "fill-orange text-orange" : "text-muted"}`} />
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-semibold text-orange mt-2">{labels[rating]}</p>
          <textarea rows={3} placeholder="Un commentaire sur cette course (optionnel)..." className="mt-4 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-orange resize-none" />
        </div>

        <div className="flex gap-3">
          <Link href="/driver-dashboard" className="flex-1 rounded-xl border border-border bg-card py-3 text-center text-sm font-semibold text-navy hover:bg-muted">Retour au tableau de bord</Link>
          <Link href="/driver-delivery" className="btn-orange flex-1 rounded-xl py-3 text-center text-sm font-bold">Course suivante</Link>
        </div>
      </div>
    </DashboardShell>
  );
}

export default DeliveryConfirm;
