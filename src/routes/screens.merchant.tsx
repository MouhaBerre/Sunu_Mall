import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Store, Package, ShoppingBag, Users, BarChart3, CreditCard, Settings, TrendingUp } from "lucide-react";
import { fcfa, ORDERS_RECENT } from "@/lib/mock-data";

export const Route = createFileRoute("/screens/merchant")({ component: MerchantDashboard });

const NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" />, active: true },
  { label: "Ma boutique", icon: <Store className="h-4 w-4" /> },
  { label: "Produits", icon: <Package className="h-4 w-4" /> },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" />, badge: "4" },
  { label: "Clients", icon: <Users className="h-4 w-4" /> },
  { label: "Statistiques", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Abonnements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
];

const STATS = [
  { label: "Ventes totales", value: "2 450 000 FCFA", delta: "+12%" },
  { label: "Commandes", value: "126", delta: "+8%" },
  { label: "Produits", value: "58", delta: "-2%", down: true },
  { label: "Visiteurs", value: "1,245", delta: "+18%" },
];

function MerchantDashboard() {
  return (
    <DashboardShell nav={NAV} title="Bonjour, Ousmane !" subtitle="Voici un aperçu de votre activité" user={{ name: "Ousmane Diop", role: "Commerçant" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className="font-display text-2xl font-bold text-navy mt-2">{s.value}</p>
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${s.down ? "text-danger" : "text-success"}`}>
              <TrendingUp className={`h-3 w-3 ${s.down ? "rotate-180" : ""}`} />
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-navy">Ventes (7 derniers jours)</h3>
            <span className="text-xs text-muted-foreground">Total : 485 000 FCFA</span>
          </div>
          <BarChart />
        </div>
        <div className="surface-card p-6">
          <h3 className="font-display font-bold text-navy mb-4">Commandes récentes</h3>
          <div className="space-y-3">
            {ORDERS_RECENT.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-semibold text-navy">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange">{fcfa(o.total)}</p>
                  <p className="text-xs text-muted-foreground">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-sm font-semibold text-orange hover:underline">Voir toutes</button>
        </div>
      </div>
    </DashboardShell>
  );
}

function BarChart() {
  const bars = [65, 45, 80, 55, 90, 70, 100];
  const labels = ["24/06", "25/06", "26/06", "27/06", "28/06", "29/06", "30/06"];
  return (
    <div className="flex items-end justify-between gap-3 h-56 px-2">
      {bars.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full rounded-t-lg bg-gradient-to-t from-orange-dark to-orange-light" style={{ height: `${v}%` }} />
          <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
