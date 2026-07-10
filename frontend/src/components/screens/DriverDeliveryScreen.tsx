import Link from "next/link";
import { DashboardShell } from "@/components/mock/DashboardShell";
import {
  LayoutDashboard, Package, MapPin, History, Wallet, Power, User, Settings, LogOut,
  Phone, Navigation, Camera, Check, ArrowLeft,
} from "lucide-react";
import { fcfa } from "@/lib/mock-data";

const DRIVER_NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" />, href: "/driver-dashboard" },
  { label: "Mes livraisons", icon: <Package className="h-4 w-4" />, badge: "3", active: true, href: "/driver-delivery" },
  { label: "Carte", icon: <MapPin className="h-4 w-4" /> },
  { label: "Historique", icon: <History className="h-4 w-4" /> },
  { label: "Revenus", icon: <Wallet className="h-4 w-4" /> },
  { label: "Disponibilité", icon: <Power className="h-4 w-4" /> },
  { label: "Profil", icon: <User className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
  { label: "Déconnexion", icon: <LogOut className="h-4 w-4" />, href: "/login" },
];

const STEPS = ["Récupéré", "En route", "Arrivé", "Livré"];
const ITEMS = [
  { n: "Boubou brodé Grand Sereer", q: 1, p: 45000 },
  { n: "Tissu Wax — 6 yards", q: 2, p: 12000 },
];

function DriverDelivery() {
  const currentStep = 1;
  return (
    <DashboardShell
      nav={DRIVER_NAV}
      title="Course #CMD-1246"
      subtitle="Fatou Ndiaye · 3 articles · Sandaga Fashion"
      user={{ name: "Modou Ndiaye", role: "Livreur" }}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/driver-dashboard" className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-navy hover:bg-muted flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <span className="rounded-lg bg-orange/15 text-orange px-3 py-2 text-sm font-bold">EN COURS</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Left: map + steps + proof */}
        <div className="space-y-6">
          <div className="surface-card overflow-hidden">
            <div className="relative h-80 bg-gradient-to-br from-navy to-navy-2 overflow-hidden">
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }} />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 320" preserveAspectRatio="none">
                <path d="M-20 320 C 200 280, 400 380, 720 300" stroke="#fff" strokeWidth="16" fill="none" opacity="0.5" />
                <path d="M120 -20 C 160 200, 320 360, 380 720" stroke="#fff" strokeWidth="12" fill="none" opacity="0.5" />
                <path d="M120 250 C 220 200, 340 240, 560 90" stroke="#FF8C00" strokeWidth="5" fill="none" strokeDasharray="10 8" strokeLinecap="round" />
                <circle cx="120" cy="250" r="11" fill="#0A163A" stroke="#fff" strokeWidth="3" />
                <circle cx="560" cy="90" r="14" fill="#FF8C00" stroke="#fff" strokeWidth="3" />
              </svg>
              <div className="absolute left-6 bottom-10 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-white ring-4 ring-white/30" />
                <span className="text-[11px] font-semibold text-white bg-navy/70 px-2 py-0.5 rounded">Boutique</span>
              </div>
              <div className="absolute right-10 top-8 flex items-center gap-2">
                <span className="text-[11px] font-semibold text-white bg-orange px-2 py-0.5 rounded">Client</span>
                <span className="h-3 w-3 rounded-full bg-orange ring-4 ring-orange/30 pulse-dot" />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 shadow-elevated">
                <span className="text-sm font-bold text-navy flex items-center gap-1"><Navigation className="h-4 w-4 text-orange" /> ETA 12 min · 4,2 km</span>
              </div>
            </div>

            {/* Steps */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between max-w-xl mx-auto">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center relative">
                    <div className={`h-8 w-8 grid place-items-center rounded-full text-xs font-bold z-10 ${i <= currentStep ? "bg-orange text-white shadow-orange" : "bg-muted text-muted-foreground"}`}>
                      {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-[11px] font-semibold mt-1.5 ${i <= currentStep ? "text-navy" : "text-muted-foreground"}`}>{s}</span>
                    {i < STEPS.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-0.5 ${i < currentStep ? "bg-orange" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm font-semibold text-muted-foreground hover:border-orange hover:text-orange">
            <Camera className="h-5 w-5" /> Ajouter une photo de preuve de livraison
          </button>
        </div>

        {/* Right: client + items + actions */}
        <div className="space-y-6">
          <div className="surface-card p-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Client</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-navy grid place-items-center text-white font-bold">F</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy text-sm">Fatou Ndiaye</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Cité Keur Gorgui, Villa N°23</p>
              </div>
              <a href="tel:" className="rounded-full bg-orange/10 p-3 hover:bg-orange/20"><Phone className="h-4 w-4 text-orange" /></a>
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Articles à livrer · Sandaga Fashion</p>
            <div className="mt-3 space-y-3">
              {ITEMS.map((it, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange to-orange-light shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy truncate">{it.n}</p>
                    <p className="text-xs text-muted-foreground">Qté {it.q}</p>
                  </div>
                  <p className="font-bold text-navy">{fcfa(it.p * it.q)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">Frais de course</span>
              <span className="font-bold text-orange">{fcfa(2500)}</span>
            </div>
          </div>

          <div className="surface-card p-4 flex gap-2">
            <button className="rounded-xl border border-border p-3 hover:bg-muted"><Navigation className="h-5 w-5 text-navy" /></button>
            <Link href="/delivery-confirm" className="btn-orange flex-1 rounded-xl py-3 text-center text-sm font-bold flex items-center justify-center gap-2">
              <Package className="h-4 w-4" /> Marquer comme livré
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default DriverDelivery;
