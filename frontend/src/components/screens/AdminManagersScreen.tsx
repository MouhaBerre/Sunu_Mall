import Link from "next/link";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Users, Store, ShoppingBag, CreditCard, Truck, Package, Settings, Plus, Pencil, Trash2 } from "lucide-react";
import { ADMINS } from "@/lib/mock-data";

const NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Utilisateurs", icon: <Users className="h-4 w-4" />, active: true },
  { label: "Boutiques", icon: <Store className="h-4 w-4" /> },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Paiements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Livraisons", icon: <Truck className="h-4 w-4" /> },
  { label: "Produits", icon: <Package className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
];

function AdminManagers() {
  return (
    <DashboardShell
      nav={NAV}
      title="Gestion des Administrateurs"
      subtitle="12 administrateurs actifs sur la plateforme"
      actions={
        <button className="btn-orange rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un admin
        </button>
      }
    >
      <div className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-3">
          <h3 className="font-display font-bold text-navy">Gestion des Comptes Admin</h3>
          <div className="flex gap-2">
            <input placeholder="Rechercher..." className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs outline-none" />
            <select className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
              <option>Tous les rôles</option>
              <option>Super Admin</option>
              <option>Modérateur</option>
            </select>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Rôle</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ADMINS.concat(ADMINS).map((a, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-navy to-navy-2 grid place-items-center text-white text-xs font-bold">
                      {a.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-semibold text-navy">{a.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{a.email}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${a.role === "Super Admin" ? "bg-orange/10 text-orange" : "bg-navy/5 text-navy"}`}>
                    {a.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${a.status === "Actif" ? "text-success" : "text-muted-foreground"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${a.status === "Actif" ? "bg-success" : "bg-muted-foreground"}`} />
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-1">
                    <button className="rounded-md p-1.5 hover:bg-muted"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                    <button className="rounded-md p-1.5 hover:bg-danger/10"><Trash2 className="h-4 w-4 text-danger" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border px-6 py-3 text-xs text-muted-foreground">
          <span>1-8 sur 12 admins</span>
          <div className="flex gap-1">
            <button className="rounded-lg border border-border px-3 py-1">Précédent</button>
            <button className="rounded-lg bg-navy px-3 py-1 text-white">1</button>
            <button className="rounded-lg border border-border px-3 py-1">2</button>
            <button className="rounded-lg border border-border px-3 py-1">Suivant</button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default AdminManagers;
