import Link from "next/link";
import { DashboardShell } from "@/components/mock/DashboardShell";
import {
  LayoutDashboard, Package, MapPin, Clock, TrendingUp, Bike, History, Wallet,
  Power, User, Settings, LogOut, Star, ChevronRight, CheckCircle2, Navigation,
} from "lucide-react";
import { fcfa } from "@/lib/mock-data";

const DRIVER_NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" />, active: true, href: "/driver-dashboard" },
  { label: "Mes livraisons", icon: <Package className="h-4 w-4" />, badge: "3", href: "/driver-delivery" },
  { label: "Carte", icon: <MapPin className="h-4 w-4" /> },
  { label: "Historique", icon: <History className="h-4 w-4" /> },
  { label: "Revenus", icon: <Wallet className="h-4 w-4" /> },
  { label: "Disponibilité", icon: <Power className="h-4 w-4" /> },
  { label: "Profil", icon: <User className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
  { label: "Déconnexion", icon: <LogOut className="h-4 w-4" />, href: "/login" },
];

const STATS = [
  { label: "Revenu du jour", value: "12 500 FCFA", delta: "+15%", icon: Wallet },
  { label: "Livraisons", value: "8", sub: "5 terminées · 3 en cours", icon: Package },
  { label: "Distance", value: "42 km", sub: "aujourd'hui", icon: Navigation },
  { label: "Note client", value: "4.9 ★", sub: "sur 342 courses", icon: Star },
];

const COURSES = [
  { id: "CMD-1246", client: "Fatou Ndiaye", zone: "Sacré-Cœur 3, Dakar", shop: "Sandaga Fashion", price: 2500, status: "en cours", eta: "12 min", items: 3 },
  { id: "CMD-1249", client: "Mamadou Diop", zone: "Almadies, Dakar", shop: "Sen'Tech Almadies", price: 2000, status: "à récupérer", eta: "—", items: 1 },
  { id: "CMD-1251", client: "Aïssatou Ba", zone: "Parcelles, Dakar", shop: "Casamance Bio", price: 2000, status: "à récupérer", eta: "—", items: 5 },
];

const HISTORY = [
  { id: "CMD-1245", client: "Ousmane Sall", price: 1500, when: "Hier · 18:42" },
  { id: "CMD-1240", client: "Aminata Fall", price: 2000, when: "Hier · 15:10" },
  { id: "CMD-1238", client: "Cheikh Diallo", price: 1800, when: "Hier · 11:05" },
];

const STATUS_STYLES: Record<string, string> = {
  "en cours": "bg-orange/15 text-orange",
  "à récupérer": "bg-navy/10 text-navy",
};

function DriverDashboard() {
  return (
    <DashboardShell
      nav={DRIVER_NAV}
      title="Mes livraisons"
      subtitle="Bonjour Modou, voici vos courses du jour"
      user={{ name: "Modou Ndiaye", role: "Livreur" }}
      actions={
        <div className="flex items-center gap-1.5 rounded-lg bg-success/10 border border-success/30 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-success pulse-dot" />
          <span className="text-sm font-semibold text-success">En ligne</span>
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
              <span className="h-8 w-8 rounded-lg bg-orange/10 text-orange grid place-items-center"><s.icon className="h-4 w-4" /></span>
            </div>
            <p className="font-display text-2xl font-bold text-navy mt-2">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.delta ? <span className="text-success font-medium">{s.delta} vs hier</span> : s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Courses actives */}
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-navy">Courses actives</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{COURSES.length} livraisons à traiter</p>
            </div>
            <Link href="/driver-delivery" className="text-sm font-semibold text-orange hover:underline flex items-center gap-1">Voir tout <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="space-y-3">
            {COURSES.map((c) => (
              <Link key={c.id} href="/driver-delivery" className="block rounded-xl border border-border p-4 hover:border-orange/40 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="h-10 w-10 rounded-lg bg-navy/5 text-navy grid place-items-center shrink-0"><Package className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-mono text-muted-foreground">#{c.id}</p>
                      <p className="font-semibold text-navy text-sm">{c.client}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {c.zone}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 shrink-0 ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs border-t border-border pt-3">
                  <span className="text-muted-foreground flex items-center gap-1"><Package className="h-3 w-3" /> {c.shop}</span>
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> ETA {c.eta}</span>
                  <span className="font-semibold text-orange flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {fcfa(c.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Carte + résumé */}
        <div className="space-y-6">
          <div className="surface-card p-6">
            <h3 className="font-display font-bold text-navy mb-3">Itinéraire</h3>
            <div className="relative rounded-xl overflow-hidden h-44 bg-gradient-to-br from-navy to-navy-2">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #fff2 0 2px, transparent 2px), radial-gradient(circle at 70% 60%, #fff2 0 2px, transparent 2px)" }} />
              <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full">
                <path d="M 30 90 Q 80 40 120 70 T 175 35" fill="none" stroke="#FF8C00" strokeWidth="3" strokeDasharray="6 5" strokeLinecap="round" />
                <circle cx="30" cy="90" r="5" fill="#fff" stroke="#FF8C00" strokeWidth="2" />
                <circle cx="175" cy="35" r="6" fill="#FF8C00" />
              </svg>
              <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy flex items-center gap-1"><Navigation className="h-3 w-3 text-orange" /> 12 min · 3,2 km</span>
            </div>
            <Link href="/driver-delivery" className="btn-orange mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold">
              <Navigation className="h-4 w-4" /> Démarrer la navigation
            </Link>
          </div>

          <div className="surface-card p-6">
            <h3 className="font-display font-bold text-navy mb-3">Boutiques affiliées</h3>
            <div className="flex flex-wrap gap-2">
              {["Sandaga Fashion", "Sen'Tech Almadies", "Casamance Bio"].map((s) => (
                <span key={s} className="rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="surface-card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-navy">Historique récent</h3>
          <button className="text-sm font-semibold text-orange hover:underline flex items-center gap-1">Tout l'historique <ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="divide-y divide-border">
          {HISTORY.map((h) => (
            <div key={h.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-success/10 text-success grid place-items-center"><CheckCircle2 className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-navy">{h.client}</p>
                  <p className="text-xs text-muted-foreground">#{h.id} · {h.when}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-success">+ {fcfa(h.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

export default DriverDashboard;
