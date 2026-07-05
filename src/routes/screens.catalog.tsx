import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Store, Package, ShoppingBag, Users, BarChart3, CreditCard, Settings, Plus, Pencil, Trash2 } from "lucide-react";
import { PRODUCTS, fcfa } from "@/lib/mock-data";

export const Route = createFileRoute("/screens/catalog")({ component: Catalog });

const NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Ma boutique", icon: <Store className="h-4 w-4" /> },
  { label: "Produits", icon: <Package className="h-4 w-4" />, active: true },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Clients", icon: <Users className="h-4 w-4" /> },
  { label: "Statistiques", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Abonnements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
];

function Catalog() {
  return (
    <DashboardShell
      nav={NAV}
      title="Gestion du catalogue"
      subtitle="58 produits dans votre boutique"
      user={{ name: "Ousmane Diop", role: "Commerçant" }}
      actions={
        <button className="btn-orange rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un produit
        </button>
      }
    >
      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-3 flex-wrap">
          <input placeholder="Rechercher un produit..." className="flex-1 min-w-40 rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none" />
          <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>Toutes catégories</option></select>
          <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>Tout statut</option><option>Publié</option><option>Rupture</option></select>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left">Produit</th>
              <th className="px-6 py-3 text-left">Prix</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p, i) => {
              const isOut = p.stock === 0;
              const status = isOut ? "Rupture" : "Publié";
              return (
                <tr key={p.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br ${["from-navy to-navy-2","from-orange to-orange-light","from-navy-2 to-orange","from-orange-dark to-navy"][i % 4]}`} />
                      <span className="font-semibold text-navy line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-orange">{fcfa(p.price)}</td>
                  <td className="px-6 py-4">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${isOut ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>{status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-1">
                      <button className="rounded-md p-1.5 hover:bg-muted"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                      <button className="rounded-md p-1.5 hover:bg-danger/10"><Trash2 className="h-4 w-4 text-danger" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
