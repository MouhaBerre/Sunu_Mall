import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame, StatusBar } from "@/components/mock/PhoneFrame";
import { Package, MapPin, Clock, TrendingUp, Bike, Home, User, Bell } from "lucide-react";
import { fcfa } from "@/lib/mock-data";

export const Route = createFileRoute("/screens/driver-dashboard")({ component: DriverDashboard });

const COURSES = [
  { id: "CMD-1246", client: "Fatou Ndiaye", zone: "Sacré-Cœur 3", shop: "Sandaga Fashion", price: 1500, status: "en cours", eta: "12 min", items: 3 },
  { id: "CMD-1249", client: "Mamadou Diop", zone: "Almadies", shop: "Sen'Tech Almadies", price: 2000, status: "à récupérer", eta: "—", items: 1 },
  { id: "CMD-1251", client: "Aïssatou Ba", zone: "Yoff-Layène", shop: "Casamance Bio", price: 1200, status: "à récupérer", eta: "—", items: 5 },
];

const HISTORY = [
  { id: "CMD-1245", client: "Ousmane Sall", price: 1500, when: "Hier · 18:42" },
  { id: "CMD-1240", client: "Aminata Fall", price: 2000, when: "Hier · 15:10" },
];

function DriverDashboard() {
  return (
    <div className="flex justify-center py-6">
      <PhoneFrame label="14 — Courses du Livreur">
        <StatusBar />
        <div className="navy-panel px-5 pt-4 pb-16 rounded-b-[32px] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange/25 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs">Bonjour</p>
              <p className="text-white font-display font-extrabold text-lg">Modou Ndiaye</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full bg-white/10 p-2 border border-white/15"><Bell className="h-4 w-4 text-white" /></button>
              <div className="flex items-center gap-1.5 rounded-full bg-success/20 border border-success/40 px-2.5 py-1">
                <span className="h-2 w-2 rounded-full bg-success pulse-dot" />
                <span className="text-[11px] font-semibold text-white">En ligne</span>
              </div>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2">
            <Stat n="3" l="Courses" />
            <Stat n={fcfa(4700)} l="Gains" />
            <Stat n="4.9★" l="Note" />
          </div>
        </div>

        <div className="-mt-10 mx-4 relative">
          <div className="surface-card p-4 fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-navy text-sm">Courses actives</p>
              <span className="text-[10px] font-semibold text-orange">{COURSES.length} à traiter</span>
            </div>
            <div className="space-y-2.5">
              {COURSES.map((c, i) => (
                <Link
                  key={c.id}
                  to="/screens/driver-delivery"
                  className="block rounded-xl border border-border bg-card p-3 hover-lift"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-mono text-muted-foreground">#{c.id}</p>
                      <p className="font-semibold text-navy text-sm mt-0.5">{c.client}</p>
                    </div>
                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${c.status === "en cours" ? "bg-orange/15 text-orange" : "bg-navy/10 text-navy"}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1 text-muted-foreground"><Package className="h-3 w-3" /> {c.shop}</div>
                    <div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> {c.zone}</div>
                    <div className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> ETA {c.eta}</div>
                    <div className="flex items-center gap-1 font-semibold text-orange"><TrendingUp className="h-3 w-3" /> {fcfa(c.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card p-4 mt-4">
            <p className="font-display font-bold text-navy text-sm mb-3">Boutiques affiliées</p>
            <div className="flex gap-2 flex-wrap">
              {["Sandaga Fashion", "Sen'Tech Almadies", "Casamance Bio"].map((s) => (
                <span key={s} className="rounded-full bg-navy/5 px-3 py-1 text-[11px] font-semibold text-navy">{s}</span>
              ))}
            </div>
          </div>

          <div className="surface-card p-4 mt-4 mb-4">
            <p className="font-display font-bold text-navy text-sm mb-2">Historique récent</p>
            {HISTORY.map((h) => (
              <div key={h.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-xs font-semibold text-navy">{h.client}</p>
                  <p className="text-[10px] text-muted-foreground">#{h.id} · {h.when}</p>
                </div>
                <span className="text-xs font-bold text-success">+ {fcfa(h.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <nav className="sticky bottom-0 bg-card border-t border-border grid grid-cols-3">
          {[
            { i: <Home className="h-4 w-4" />, l: "Courses", a: true },
            { i: <Bike className="h-4 w-4" />, l: "Historique" },
            { i: <User className="h-4 w-4" />, l: "Profil" },
          ].map((t, i) => (
            <button key={i} className={`flex flex-col items-center gap-1 py-2.5 ${t.a ? "text-orange" : "text-muted-foreground"}`}>
              {t.i}<span className="text-[10px] font-semibold">{t.l}</span>
            </button>
          ))}
        </nav>
      </PhoneFrame>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 px-2 py-2 text-center">
      <p className="text-white font-display font-extrabold text-sm">{n}</p>
      <p className="text-[10px] text-white/70">{l}</p>
    </div>
  );
}
