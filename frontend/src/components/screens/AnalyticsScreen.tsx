import Link from "next/link";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Store, Package, ShoppingBag, Users, BarChart3, CreditCard, Settings, TrendingUp, Zap } from "lucide-react";

const NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Ma boutique", icon: <Store className="h-4 w-4" /> },
  { label: "Produits", icon: <Package className="h-4 w-4" /> },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Clients", icon: <Users className="h-4 w-4" /> },
  { label: "Statistiques", icon: <BarChart3 className="h-4 w-4" />, active: true, badge: "PRO" },
  { label: "Abonnements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
];

function Analytics() {
  return (
    <DashboardShell nav={NAV} title="Analytics Premium" subtitle="Insights avancés de votre boutique" user={{ name: "Ousmane Diop", role: "Premium+" }}
      actions={<span className="inline-flex items-center gap-1 rounded-full bg-orange/10 px-3 py-1.5 text-xs font-bold text-orange"><Zap className="h-3 w-3" /> Premium+</span>}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ["Revenus (30j)", "2 450 000 FCFA", "+18%"],
          ["Panier moyen", "24 500 FCFA", "+6%"],
          ["Taux conversion", "4.8%", "+0.9pt"],
          ["Clients récurrents", "38%", "+12%"],
        ].map(([l, v, d]) => (
          <div key={l} className="surface-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{l}</p>
            <p className="font-display text-2xl font-bold text-navy mt-2">{v}</p>
            <p className="flex items-center gap-1 text-xs text-success mt-1"><TrendingUp className="h-3 w-3" />{d}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-navy">Revenus vs commandes</h3>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange" />Revenus</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-navy" />Commandes</span>
            </div>
          </div>
          <DualLine />
        </div>
        <div className="surface-card p-6">
          <h3 className="font-display font-bold text-navy mb-4">Ventes par catégorie</h3>
          <Donut />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="surface-card p-6">
          <h3 className="font-display font-bold text-navy mb-4">Top produits</h3>
          <div className="space-y-3">
            {[
              ["Casque Bluetooth Pro", 42, 776000],
              ["Montre Connectée X1", 31, 775000],
              ["Sac à main cuir", 24, 456000],
              ["Chaussures Running", 18, 360000],
            ].map(([name, qty, rev]: any) => (
              <div key={name} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange to-orange-light" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">{name}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-orange" style={{ width: `${(qty / 42) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-navy">{qty} ventes</p>
                  <p className="text-[10px] text-muted-foreground">{rev.toLocaleString("fr-FR")} FCFA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="surface-card p-6">
          <h3 className="font-display font-bold text-navy mb-4">Provenance des visiteurs</h3>
          <div className="grid grid-cols-4 gap-3">
            {["Dakar", "Thiès", "St-Louis", "Autres"].map((city, i) => (
              <div key={city} className="rounded-xl border border-border p-3 text-center">
                <p className="font-display text-2xl font-bold text-orange">{[62, 18, 12, 8][i]}%</p>
                <p className="text-xs text-muted-foreground mt-1">{city}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-gradient-to-br from-navy to-navy-2 p-5 text-white">
            <p className="text-xs opacity-70">Recommandation IA</p>
            <p className="font-semibold mt-1">📈 Investissez en promotion à Thiès : +34% de croissance ce mois.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function DualLine() {
  const a = [30, 48, 40, 62, 55, 78, 68, 90, 82, 100, 95, 118];
  const b = [20, 35, 30, 48, 42, 60, 55, 72, 68, 80, 78, 92];
  const w = 620, h = 220, max = 130;
  const step = w / (a.length - 1);
  const mk = (pts: number[]) => pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#FF8C00" stopOpacity="0.3" /><stop offset="100%" stopColor="#FF8C00" stopOpacity="0" /></linearGradient>
      </defs>
      <path d={`${mk(a)} L ${w} ${h} L 0 ${h} Z`} fill="url(#g1)" />
      <path d={mk(a)} fill="none" stroke="#FF8C00" strokeWidth="3" />
      <path d={mk(b)} fill="none" stroke="#0A163A" strokeWidth="2.5" strokeDasharray="5 4" />
    </svg>
  );
}

function Donut() {
  const data = [{ v: 42, c: "#FF8C00", l: "Mode" }, { v: 28, c: "#0A163A", l: "Électro" }, { v: 18, c: "#FFA31A", l: "Maison" }, { v: 12, c: "#142A5E", l: "Sport" }];
  let acc = 0;
  const total = 100;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 42 42" className="w-32 h-32 -rotate-90">
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#F1F3F8" strokeWidth="6" />
        {data.map((d, i) => {
          const seg = <circle key={i} cx="21" cy="21" r="15.9" fill="none" stroke={d.c} strokeWidth="6" strokeDasharray={`${d.v} ${total - d.v}`} strokeDashoffset={-acc} />;
          acc += d.v;
          return seg;
        })}
      </svg>
      <div className="space-y-2 text-sm">
        {data.map((d) => (
          <div key={d.l} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ background: d.c }} />
            <span className="text-navy">{d.l}</span>
            <span className="text-muted-foreground text-xs ml-auto">{d.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Analytics;
