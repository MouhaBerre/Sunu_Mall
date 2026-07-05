import { createFileRoute } from "@tanstack/react-router";
import { Check, Zap } from "lucide-react";

export const Route = createFileRoute("/screens/subscriptions")({ component: Subscriptions });

const PLANS = [
  { name: "Standard", price: "Gratuit", desc: "Pour démarrer votre boutique", features: ["50 produits", "Commission 8%", "Support email", "Analytics de base"], cta: "Plan actuel", muted: true },
  { name: "Premium", price: "15 000", desc: "Pour les commerçants sérieux", features: ["500 produits", "Commission 5%", "Support prioritaire", "Analytics avancés", "Promotions", "Badges vérifiés"], cta: "Passer à Premium", highlight: true },
  { name: "Premium+", price: "25 000", desc: "Pour les leaders de la marketplace", features: ["Produits illimités", "Commission 3%", "Support VIP 24/7", "Live shopping", "API complète", "Consultant dédié"], cta: "Passer à Premium+" },
];

function Subscriptions() {
  return (
    <div className="surface-card p-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
          <Zap className="h-3 w-3" /> Abonnements SUNU MALL
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-navy">Développez votre boutique.</h1>
        <p className="mt-2 text-muted-foreground">Choisissez le plan qui correspond à votre ambition. Sans engagement.</p>
        <div className="mt-6 inline-flex rounded-full border border-border bg-card p-1">
          <button className="rounded-full px-4 py-1.5 text-xs font-semibold bg-navy text-white">Mensuel</button>
          <button className="rounded-full px-4 py-1.5 text-xs font-semibold text-muted-foreground">Annuel <span className="text-orange">-20%</span></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-10">
        {PLANS.map((p) => (
          <div key={p.name} className={`rounded-2xl p-8 relative ${p.highlight ? "bg-gradient-to-br from-navy to-navy-2 text-white shadow-elevated scale-[1.03]" : "surface-card"}`}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wide">Le plus populaire</span>}
            <p className={`font-display text-lg font-bold ${p.highlight ? "text-orange-light" : "text-navy"}`}>{p.name}</p>
            <p className={`text-xs mt-1 ${p.highlight ? "text-white/60" : "text-muted-foreground"}`}>{p.desc}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className={`font-display text-4xl font-extrabold ${p.highlight ? "text-white" : "text-navy"}`}>{p.price}</span>
              {p.price !== "Gratuit" && <span className={`text-sm ${p.highlight ? "text-white/60" : "text-muted-foreground"}`}>FCFA/mois</span>}
            </div>
            <ul className={`mt-6 space-y-3 text-sm ${p.highlight ? "text-white/80" : "text-navy"}`}>
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className={`h-4 w-4 ${p.highlight ? "text-orange-light" : "text-success"}`} /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full rounded-xl py-3 text-sm font-bold mt-8 ${
              p.muted ? "border border-border text-muted-foreground cursor-not-allowed" :
              p.highlight ? "btn-orange" : "bg-navy text-white hover:opacity-90"
            }`}>{p.cta}</button>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-orange/5 border border-orange/20 p-6 text-center">
        <p className="font-display font-bold text-navy">💬 Une question sur les abonnements ?</p>
        <p className="text-sm text-muted-foreground mt-1">Notre équipe répond en Wolof et Français, 7j/7.</p>
      </div>
    </div>
  );
}
