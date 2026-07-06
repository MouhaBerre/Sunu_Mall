import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame, StatusBar } from "@/components/mock/PhoneFrame";
import { ArrowLeft, Phone, MapPin, Navigation, Camera, Check, Package } from "lucide-react";
import { fcfa } from "@/lib/mock-data";

export const Route = createFileRoute("/screens/driver-delivery")({ component: DriverDelivery });

const STEPS = ["Récupéré", "En route", "Arrivé", "Livré"];

function DriverDelivery() {
  const currentStep = 1;
  return (
    <div className="flex justify-center py-6">
      <PhoneFrame label="15 — Détail d'une Course">
        <StatusBar />
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
          <Link to="/screens/driver-dashboard" className="p-1"><ArrowLeft className="h-5 w-5 text-navy" /></Link>
          <div>
            <p className="font-display font-bold text-navy text-sm">Course #CMD-1246</p>
            <p className="text-[10px] text-muted-foreground">Fatou Ndiaye · 3 articles</p>
          </div>
          <span className="ml-auto badge-sponsored">EN COURS</span>
        </div>

        {/* Map preview */}
        <div className="relative h-52 bg-gradient-to-br from-navy to-navy-2 overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 200" preserveAspectRatio="none">
            <path d="M 40 160 Q 120 100, 200 120 T 320 40" stroke="#FF8C00" strokeWidth="3" fill="none" strokeDasharray="6 4" />
          </svg>
          <div className="absolute left-6 bottom-14 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-white ring-4 ring-white/30" />
            <span className="text-[10px] font-semibold text-white bg-navy/70 px-2 py-0.5 rounded">Boutique</span>
          </div>
          <div className="absolute right-6 top-8 flex items-center gap-2">
            <span className="text-[10px] font-semibold text-white bg-orange px-2 py-0.5 rounded">Client</span>
            <span className="h-3 w-3 rounded-full bg-orange ring-4 ring-orange/30 pulse-dot" />
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-1.5 shadow-elevated">
            <span className="text-xs font-bold text-navy">🚴 ETA 12 min · 4.2 km</span>
          </div>
        </div>

        {/* Steps */}
        <div className="px-5 py-4 bg-card border-b border-border">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                <div className={`h-7 w-7 rounded-full grid place-items-center text-[11px] font-bold z-10 ${i <= currentStep ? "bg-orange text-white shadow-orange" : "bg-muted text-muted-foreground"}`}>
                  {i < currentStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] font-semibold mt-1 ${i <= currentStep ? "text-navy" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${i < currentStep ? "bg-orange" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 space-y-3">
          {/* Client */}
          <div className="surface-card p-4 fade-in-up">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Client</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-navy grid place-items-center text-white font-bold">F</div>
              <div className="flex-1">
                <p className="font-semibold text-navy text-sm">Fatou Ndiaye</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Cité Keur Gorgui, Villa N°23</p>
              </div>
              <a href="tel:" className="rounded-full bg-orange/10 p-2.5"><Phone className="h-4 w-4 text-orange" /></a>
            </div>
          </div>

          {/* Items */}
          <div className="surface-card p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Articles à livrer · Sandaga Fashion</p>
            <div className="mt-2 space-y-2">
              {[
                { n: "Boubou brodé Grand Sereer", q: 1, p: 45000 },
                { n: "Tissu Wax — 6 yards", q: 2, p: 12000 },
              ].map((it, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <div className="h-9 w-9 rounded bg-gradient-to-br from-orange to-orange-light" />
                  <div className="flex-1">
                    <p className="font-semibold text-navy">{it.n}</p>
                    <p className="text-[10px] text-muted-foreground">Qté {it.q}</p>
                  </div>
                  <p className="font-bold text-navy">{fcfa(it.p * it.q)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs">
              <span className="text-muted-foreground">Frais de course</span>
              <span className="font-bold text-orange">{fcfa(1500)}</span>
            </div>
          </div>

          {/* Proof */}
          <button className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-xs font-semibold text-muted-foreground hover:border-orange hover:text-orange">
            <Camera className="h-4 w-4" /> Photo de preuve de livraison
          </button>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-3 flex gap-2">
          <button className="rounded-xl border border-border p-3">
            <Navigation className="h-4 w-4 text-navy" />
          </button>
          <Link to="/screens/delivery-confirm" className="btn-orange flex-1 rounded-xl py-3 text-center text-sm font-bold flex items-center justify-center gap-2">
            <Package className="h-4 w-4" /> Marquer comme livré
          </Link>
        </div>
      </PhoneFrame>
    </div>
  );
}
