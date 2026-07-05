import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Store, Package, ShoppingBag, Users, BarChart3, CreditCard, Settings, Radio } from "lucide-react";
import { fcfa } from "@/lib/mock-data";

export const Route = createFileRoute("/screens/live-sales")({ component: LiveSales });

const NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Ma boutique", icon: <Store className="h-4 w-4" /> },
  { label: "Produits", icon: <Package className="h-4 w-4" /> },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Clients", icon: <Users className="h-4 w-4" /> },
  { label: "Ventes en direct", icon: <Radio className="h-4 w-4" />, active: true, badge: "LIVE" },
  { label: "Statistiques", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Abonnements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
];

const LIVE_ORDERS = [
  { id: "#CMD-1252", buyer: "Aminata Fall", city: "Dakar", total: 45000, time: "il y a 5s" },
  { id: "#CMD-1251", buyer: "Moussa Gueye", city: "Thiès", total: 18500, time: "il y a 20s" },
  { id: "#CMD-1250", buyer: "Fatou Ndiaye", city: "Dakar", total: 32000, time: "il y a 42s" },
  { id: "#CMD-1249", buyer: "Ousmane Sarr", city: "Saint-Louis", total: 12500, time: "il y a 1 min" },
  { id: "#CMD-1248", buyer: "Awa Diop", city: "Dakar", total: 68000, time: "il y a 2 min" },
];

function LiveSales() {
  return (
    <DashboardShell nav={NAV} title="Ventes en Temps Réel" subtitle="Suivez votre activité seconde par seconde" user={{ name: "Ousmane Diop", role: "Premium+" }}
      actions={<span className="inline-flex items-center gap-2 rounded-full bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger"><span className="h-2 w-2 rounded-full bg-danger animate-pulse" />EN DIRECT</span>}>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ["Ventes aujourd'hui", "5 450 000 FCFA"],
          ["Commandes du jour", "245"],
          ["Visiteurs actifs", "3,245"],
          ["Taux conversion", "6.8%"],
        ].map(([l, v]) => (
          <div key={l} className="surface-card p-5 relative overflow-hidden">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{l}</p>
            <p className="font-display text-2xl font-bold text-navy mt-2">{v}</p>
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-navy">Ventes en direct (dernière heure)</h3>
            <span className="text-xs text-muted-foreground">Mise à jour toutes les 5s</span>
          </div>
          <RealtimeChart />
        </div>

        <div className="surface-card p-6">
          <h3 className="font-display font-bold text-navy mb-4">Flux de commandes</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
            {LIVE_ORDERS.map((o, i) => (
              <div key={o.id} className={`rounded-xl border p-3 ${i === 0 ? "border-orange bg-orange/5" : "border-border"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-navy">{o.id}</p>
                  <span className="text-[10px] text-muted-foreground">{o.time}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-navy grid place-items-center text-white text-[10px] font-bold">
                    {o.buyer.charAt(0)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{o.buyer} · {o.city}</p>
                </div>
                <p className="mt-1 text-sm font-bold text-orange">{fcfa(o.total)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="surface-card p-6">
          <h3 className="font-display font-bold text-navy mb-4">Carte du Sénégal — Achats en direct</h3>
          <div className="relative h-56 rounded-xl bg-gradient-to-br from-navy to-navy-2 overflow-hidden">
            <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full">
              <path d="M50 60 Q 80 40 130 55 T 250 70 Q 320 80 360 130 Q 300 170 200 165 Q 100 170 60 130 Z" fill="rgba(255,140,0,0.15)" stroke="#FF8C00" strokeWidth="1.5" />
              {[[120, 100, "Dakar", 12], [200, 80, "Thiès", 6], [280, 60, "St-Louis", 3], [180, 140, "Kaolack", 4]].map(([x, y, label, n]: any, i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={n * 2 + 4} fill="#FF8C00" opacity="0.25" className="animate-pulse" />
                  <circle cx={x} cy={y} r="4" fill="#FFA31A" />
                  <text x={x + 8} y={y + 3} fontSize="10" fill="#fff">{label} · {n}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        <div className="surface-card p-6">
          <h3 className="font-display font-bold text-navy mb-4">Top produits — Aujourd'hui</h3>
          <div className="space-y-3">
            {[["Casque Bluetooth Pro", 24], ["Montre X1", 18], ["Sac cuir", 14], ["Chaussures Sport", 9]].map(([n, q]: any) => (
              <div key={n} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange to-orange-light" />
                <p className="flex-1 text-sm font-medium text-navy truncate">{n}</p>
                <span className="rounded-full bg-orange/10 px-2 py-0.5 text-xs font-bold text-orange">{q} ventes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function RealtimeChart() {
  const pts = [12, 18, 15, 22, 28, 25, 32, 40, 35, 42, 48, 55, 50, 58, 65, 60, 72, 68, 75, 82];
  const w = 620, h = 220, max = 90;
  const step = w / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
      <defs>
        <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#FF8C00" stopOpacity="0.4" /><stop offset="100%" stopColor="#FF8C00" stopOpacity="0" /></linearGradient>
      </defs>
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#lg)" />
      <path d={path} fill="none" stroke="#FF8C00" strokeWidth="3" />
      <circle cx={(pts.length - 1) * step} cy={h - (pts[pts.length - 1] / max) * h} r="6" fill="#FF8C00">
        <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
