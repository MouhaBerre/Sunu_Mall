import Link from "next/link";
import { DashboardShell } from "@/components/mock/DashboardShell";
import {
  LayoutDashboard, Users, Store, Package, CreditCard, Truck, ShoppingBag, Megaphone,
  BarChart3, Radio, Settings, LogOut, TrendingUp, TrendingDown, Check, X, ChevronRight,
} from "lucide-react";
import { fcfa, ORDERS_RECENT, SHOPS_PENDING, PRODUCTS, BOUTIQUES } from "@/lib/mock-data";

const ADMIN_NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" />, active: true, href: "/admin" },
  { label: "Utilisateurs", icon: <Users className="h-4 w-4" />, href: "/admin-managers" },
  { label: "Boutiques", icon: <Store className="h-4 w-4" />, badge: String(SHOPS_PENDING.length), href: "/admin-shops" },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Paiements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Livraisons", icon: <Truck className="h-4 w-4" /> },
  { label: "Produits", icon: <Package className="h-4 w-4" /> },
  { label: "Promotions", icon: <Megaphone className="h-4 w-4" /> },
  { label: "Statistiques", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Live shopping", icon: <Radio className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
  { label: "Déconnexion", icon: <LogOut className="h-4 w-4" />, href: "/login" },
];

const STATS = [
  { label: "Utilisateurs", value: "12 540", delta: "+8.2%", up: true },
  { label: "Commerçants", value: "2 350", delta: "+6.7%", up: true },
  { label: "Commandes", value: "8 756", delta: "+16.7%", up: true },
  { label: "CA Total", value: "125 450 000 FCFA", delta: "+10.9%", up: true },
];

const STATUS_STYLES: Record<string, string> = {
  "Livrée": "bg-success/10 text-success",
  "En cours": "bg-warning/10 text-warning",
  "Annulée": "bg-danger/10 text-danger",
};

const DONUT_COLORS = ["#FF7A00", "#1E3A8A", "#22C55E", "#DB2777", "#0EA5E9", "#F9A000", "#7C3AED"];

function AdminDashboard() {
  // Ventes par catégorie (dérivé des produits réels)
  const catMap = new Map<string, number>();
  for (const p of PRODUCTS) catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1);
  const total = PRODUCTS.length;
  const categories = [...catMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count], i) => ({ label, pct: Math.round((count / total) * 100), color: DONUT_COLORS[i % DONUT_COLORS.length] }));

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

      {/* Chart + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-navy">Commandes & chiffre d'affaires</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Évolution sur les 30 derniers jours</p>
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
          <h3 className="font-display font-bold text-navy mb-4">Ventes par catégorie</h3>
          <Donut segments={categories} />
          <ul className="mt-4 space-y-2">
            {categories.map((c) => (
              <li key={c.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="truncate">{c.label}</span>
                </span>
                <span className="font-semibold text-navy">{c.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent orders + Pending shops */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-navy">Commandes récentes</h3>
            <button className="text-sm font-semibold text-orange hover:underline flex items-center gap-1">Voir toutes <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-2 font-medium">Commande</th>
                  <th className="text-left py-2 font-medium">Client</th>
                  <th className="text-left py-2 font-medium">Livreur</th>
                  <th className="text-left py-2 font-medium">Statut</th>
                  <th className="text-right py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS_RECENT.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-semibold text-navy">{o.id}</td>
                    <td className="py-3 text-muted-foreground">{o.client}</td>
                    <td className="py-3 text-muted-foreground">{o.driver}</td>
                    <td className="py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status] ?? "bg-muted text-muted-foreground"}`}>{o.status}</span></td>
                    <td className="py-3 text-right font-bold text-orange">{fcfa(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-navy">Boutiques en attente</h3>
            <span className="rounded-full bg-warning/10 text-warning text-xs font-semibold px-2 py-0.5">{SHOPS_PENDING.length}</span>
          </div>
          <div className="space-y-3">
            {SHOPS_PENDING.map((s) => (
              <div key={s.name} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-navy to-navy-2 grid place-items-center text-white text-xs font-bold shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.category} · {s.owner}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button aria-label="Valider" className="h-7 w-7 grid place-items-center rounded-md bg-success/10 text-success hover:bg-success/20"><Check className="h-4 w-4" /></button>
                  <button aria-label="Refuser" className="h-7 w-7 grid place-items-center rounded-md bg-danger/10 text-danger hover:bg-danger/20"><X className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin-shops" className="mt-4 w-full inline-flex items-center justify-center gap-1 rounded-lg border border-border py-2 text-sm font-semibold text-navy hover:bg-muted">
            Gérer les boutiques <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Top boutiques */}
      <div className="surface-card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-navy">Meilleures boutiques</h3>
          <Link href="/admin-shops" className="text-sm font-semibold text-orange hover:underline flex items-center gap-1">Voir tout <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {[...BOUTIQUES].sort((a, b) => b.nbAvis - a.nbAvis).slice(0, 6).map((b, i) => (
            <div key={b.slug} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
              <span className="h-9 w-9 rounded-full grid place-items-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: b.logoColor }}>{b.logoInitials}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy truncate">{b.nom}</p>
                <p className="text-xs text-muted-foreground">{b.categorie}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-navy">★ {b.note}</p>
                <p className="text-[11px] text-muted-foreground">{b.nbAvis} avis</p>
              </div>
            </div>
          ))}
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

function Donut({ segments }: { segments: { label: string; pct: number; color: string }[] }) {
  const r = 60;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#F1F5F9" strokeWidth="20" />
        {segments.map((s) => {
          const len = (s.pct / 100) * c;
          const el = (
            <circle
              key={s.label}
              cx="80" cy="80" r={r} fill="none"
              stroke={s.color} strokeWidth="20"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="font-display text-xl font-extrabold text-navy">{PRODUCTS.length}</p>
          <p className="text-[10px] text-muted-foreground">produits</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
