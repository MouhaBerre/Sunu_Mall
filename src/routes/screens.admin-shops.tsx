import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Users, Store, ShoppingBag, CreditCard, Truck, Package, Settings, Check, X, Eye } from "lucide-react";
import { SHOPS_PENDING } from "@/lib/mock-data";

export const Route = createFileRoute("/screens/admin-shops")({ component: AdminShops });

const NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Utilisateurs", icon: <Users className="h-4 w-4" /> },
  { label: "Boutiques", icon: <Store className="h-4 w-4" />, active: true, badge: "8" },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Paiements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Livraisons", icon: <Truck className="h-4 w-4" /> },
  { label: "Produits", icon: <Package className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
];

function AdminShops() {
  return (
    <DashboardShell nav={NAV} title="Validation des Boutiques" subtitle="Vérifiez et approuvez les nouvelles boutiques">
      <div className="flex gap-2 mb-6">
        {[
          { label: "En attente", count: 8, active: true },
          { label: "Approuvées", count: 45 },
          { label: "Rejetées", count: 3 },
        ].map((t) => (
          <button key={t.label} className={`rounded-lg px-4 py-2 text-sm font-semibold ${t.active ? "bg-orange text-white shadow-orange" : "border border-border bg-card text-muted-foreground hover:bg-muted"}`}>
            {t.label} <span className="ml-1 opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SHOPS_PENDING.map((s) => (
          <div key={s.name} className="surface-card p-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-orange to-orange-light grid place-items-center text-white font-display font-extrabold">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-navy truncate">{s.name}</h3>
                  <span className="rounded-full bg-warning/10 text-warning px-2 py-0.5 text-[10px] font-semibold">En attente</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Catégorie · {s.category}</p>
                <p className="text-xs text-muted-foreground">Propriétaire · {s.owner}</p>
                <p className="text-xs text-muted-foreground">Demandé le {s.date}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button className="flex-1 rounded-lg bg-success text-white py-2 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-success/90">
                <Check className="h-4 w-4" /> Approuver
              </button>
              <button className="flex-1 rounded-lg border border-danger text-danger py-2 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-danger/5">
                <X className="h-4 w-4" /> Rejeter
              </button>
              <button className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
