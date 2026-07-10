import Link from "next/link";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Store, Package, ShoppingBag, Users, BarChart3, CreditCard, Settings, Upload, Bold, Italic, Underline, List } from "lucide-react";

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

function AddProduct() {
  return (
    <DashboardShell nav={NAV} title="Ajouter un produit" subtitle="Nouveau produit dans votre catalogue" user={{ name: "Ousmane Diop", role: "Commerçant" }}>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="surface-card p-6">
            <h3 className="font-display font-bold text-navy mb-4">Images du produit</h3>
            <div className="rounded-xl border-2 border-dashed border-border bg-background p-10 grid place-items-center text-center">
              <div className="h-14 w-14 rounded-full bg-orange/10 grid place-items-center mb-3">
                <Upload className="h-6 w-6 text-orange" />
              </div>
              <p className="font-semibold text-navy">Ajouter des images</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG (max 5 Mo) · Jusqu'à 8 images</p>
              <button className="mt-3 rounded-lg border border-border bg-card px-4 py-1.5 text-xs font-semibold">Parcourir</button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-navy to-navy-2 border border-border" />
              ))}
              <div className="aspect-square rounded-xl border-2 border-dashed border-border grid place-items-center text-muted-foreground text-xs">+</div>
            </div>
          </div>

          <div className="surface-card p-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-navy mb-1.5 block">Nom du produit</label>
              <input className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-orange" placeholder="Ex : Casque Bluetooth Sans Fil Pro" />
            </div>
            <div>
              <label className="text-xs font-medium text-navy mb-1.5 block">Catégorie</label>
              <select className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm">
                <option>Sélectionnez une catégorie</option><option>Électronique</option><option>Mode</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-navy mb-1.5 block">Prix (FCFA)</label>
                <input className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" placeholder="18 500" />
              </div>
              <div>
                <label className="text-xs font-medium text-navy mb-1.5 block">Stock</label>
                <input className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" placeholder="15" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-navy mb-1.5 block">Description</label>
              <div className="rounded-xl border border-border bg-background overflow-hidden">
                <div className="flex items-center gap-1 border-b border-border bg-muted/40 p-2">
                  {[Bold, Italic, Underline, List].map((I, i) => (
                    <button key={i} className="p-1.5 rounded hover:bg-card"><I className="h-3.5 w-3.5" /></button>
                  ))}
                </div>
                <textarea rows={5} className="w-full bg-transparent p-4 text-sm outline-none resize-none" placeholder="Décrivez votre produit..." />
              </div>
            </div>
            <button className="btn-orange w-full rounded-xl py-3 text-sm font-semibold">Publier le produit</button>
          </div>
        </div>

        <div className="space-y-4 h-fit sticky top-24">
          <div className="surface-card p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Statut</p>
            <div className="mt-3 space-y-2">
              {["Brouillon", "Publié", "Épuisé"].map((s, i) => (
                <label key={s} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm cursor-pointer">
                  <input type="radio" name="status" defaultChecked={i === 1} className="text-orange" />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="surface-card p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Livraison</p>
            <div className="mt-3 space-y-3 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Standard (2-3j)</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Express (24h)</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Retrait boutique</label>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default AddProduct;
