import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Users, Store, Package, CreditCard, Truck, ShoppingBag, Megaphone, BarChart3, Radio, Settings, LogOut, TrendingUp, TrendingDown } from "lucide-react";
import { fcfa } from "@/lib/mock-data";

export const Route = createFileRoute("/screens/admin")({ component: AdminDashboard });

const ADMIN_NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" />, active: true },
  { label: "Utilisateurs", icon: <Users className="h-4 w-4" /> },
  { label: "Boutiques", icon: <Store className="h-4 w-4" />, badge: "8" },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Paiements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Livraisons", icon: <Truck className="h-4 w-4" /> },
  { label: "Produits", icon: <Package className="h-4 w-4" /> },
  { label: "Promotions", icon: <Megaphone className="h-4 w-4" /> },
  { label: "Statistiques", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Live shopping", icon: <Radio className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
  { label: "Déconnexion", icon: <LogOut className="h-4 w-4" /> },
];

const STATS = [
  { label: "Utilisateurs", value: "12,458", delta: "+12%", up: true },
  { label: "Boutiques", value: "1,256", delta: "+8%", up: true },
  { label: "Commandes", value: "8,965", delta: "+15%", up: true },
  { label: "Ventes (30j)", value: "125 450 000 FCFA", delta: "+10%", up: true },
];

const RECENT_ORDERS = [
  { id: "#CMD-1248", total: 36000, date: "25/06" },
  { id: "#CMD-1247", total: 19500, date: "25/06" },
  { id: "#CMD-1246", total: 43000, date: "24/06" },
  { id: "#CMD-1245", total: 61500, date: "24/06" },
  { id: "#CMD-1244", total: 12000, date: "24/06" },
];

function AdminDashboard() {
  return (
    <DashboardShell nav={ADMIN_NAV} title="Tableau de bord" subtitle="Aperçu global de la marketplace" user={{ name: "Admin Sunu", role: "Super Admin" }}>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className="font-display text-2xl font-bold text-navy mt-2">{s.value}</p>
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${s.up ? "text-success" : "text-danger"}`}>
              {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {s.delta} vs mois dernier
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-navy">Ventes des 30 derniers jours</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Évolution du chiffre d'affaires</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button className="rounded-lg px-3 py-1.5 bg-orange/10 text-orange font-semibold">30j</button>
              <button className="rounded-lg px-3 py-1.5 text-muted-foreground">3m</button>
              <button className="rounded-lg px-3 py-1.5 text-muted-foreground">1a</button>
            </div>
          </div>
          <LineChart />
        </div>

        <div className="surface-card p-6">
          <h3 className="font-display font-bold text-navy mb-4">Commandes récentes</h3>
          <div className="space-y-3">
            {RECENT_ORDERS.map((o) => (
              <div key={o.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-semibold text-navy">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.date}/2026</p>
                </div>
                <span className="text-sm font-bold text-orange">{fcfa(o.total)}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-sm font-semibold text-orange hover:underline">Voir toutes</button>
        </div>
      </div>
    </DashboardShell>
  );
}

function LineChart() {
  const pts = [40, 55, 48, 70, 65, 82, 75, 95, 88, 105, 100, 120];
  const max = 130;
  const w = 700, h = 220;
  const step = w / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / max) * h}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full h-56">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF8C00" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad)" />
      <path d={path} fill="none" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />
      {pts.map((v, i) => (
        <circle key={i} cx={i * step} cy={h - (v / max) * h} r="4" fill="#fff" stroke="#FF8C00" strokeWidth="2" />
      ))}
      {["01/06", "10/06", "20/06", "30/06"].map((d, i) => (
        <text key={d} x={(i * w) / 3} y={h + 16} className="fill-muted-foreground" fontSize="10">{d}</text>
      ))}
    </svg>
  );
}
