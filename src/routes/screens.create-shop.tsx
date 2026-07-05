import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/mock/DashboardShell";
import { LayoutDashboard, Store, Package, ShoppingBag, Users, BarChart3, CreditCard, Settings, Upload } from "lucide-react";

export const Route = createFileRoute("/screens/create-shop")({ component: CreateShop });

const NAV = [
  { label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Ma boutique", icon: <Store className="h-4 w-4" />, active: true },
  { label: "Produits", icon: <Package className="h-4 w-4" /> },
  { label: "Commandes", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Clients", icon: <Users className="h-4 w-4" /> },
  { label: "Statistiques", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Abonnements", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Paramètres", icon: <Settings className="h-4 w-4" /> },
];

function CreateShop() {
  return (
    <DashboardShell nav={NAV} title="Créer votre boutique" subtitle="Configurez votre vitrine en quelques étapes" user={{ name: "Ousmane Diop", role: "Commerçant" }}>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="surface-card p-8">
          <div className="mb-6 flex items-center gap-3">
            {["Infos", "Assets", "Publier"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`h-7 w-7 grid place-items-center rounded-full text-xs font-bold ${i === 0 ? "bg-orange text-white" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </span>
                <span className={`text-sm ${i === 0 ? "text-navy font-semibold" : "text-muted-foreground"}`}>{s}</span>
                {i < 2 && <span className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium text-navy mb-1.5 block">Nom de la boutique</label>
              <input className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-orange" placeholder="Ex : Boutique Fashion Dakar" />
            </div>
            <div>
              <label className="text-xs font-medium text-navy mb-1.5 block">Description</label>
              <textarea rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-orange resize-none" placeholder="Décrivez votre boutique en quelques lignes..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-navy mb-1.5 block">Catégorie</label>
                <select className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm">
                  <option>Sélectionnez une catégorie</option><option>Mode</option><option>Électronique</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-navy mb-1.5 block">Localisation</label>
                <select className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm">
                  <option>Dakar</option><option>Thiès</option><option>Saint-Louis</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["Logo de la boutique", "Bannière de la boutique"].map((label) => (
                <div key={label}>
                  <label className="text-xs font-medium text-navy mb-1.5 block">{label}</label>
                  <div className="rounded-xl border-2 border-dashed border-border bg-background p-6 grid place-items-center text-center">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-xs font-medium text-navy">Glisser-déposer</p>
                    <p className="text-[10px] text-muted-foreground">PNG, JPG (max 2 Mo)</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-orange w-full rounded-xl py-3 text-sm font-semibold">Créer ma boutique</button>
          </div>
        </div>

        <div className="surface-card p-6 h-fit sticky top-24">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aperçu</p>
          <div className="mt-4 rounded-xl overflow-hidden border border-border">
            <div className="h-24 bg-gradient-to-br from-orange to-orange-light" />
            <div className="p-4 -mt-8">
              <div className="h-16 w-16 rounded-xl bg-navy border-4 border-card grid place-items-center text-white font-display font-extrabold text-xl">
                B
              </div>
              <h3 className="font-display font-bold text-navy mt-3">Boutique Fashion Dakar</h3>
              <p className="text-xs text-muted-foreground">Mode · Dakar</p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                Votre description apparaîtra ici pour donner envie aux acheteurs de découvrir votre univers.
              </p>
              <button className="btn-orange w-full rounded-lg py-2 text-xs font-semibold mt-4">Visiter la boutique</button>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-orange/5 border border-orange/20 p-3 text-xs text-navy">
            💡 <b>Astuce :</b> Un logo carré et une bannière 1200×400 rendent votre boutique plus pro.
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
