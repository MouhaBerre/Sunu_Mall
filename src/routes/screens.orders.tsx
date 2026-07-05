import { createFileRoute } from "@tanstack/react-router";
import { MarketHeader } from "@/components/mock/MarketHeader";
import { fcfa } from "@/lib/mock-data";
import { Package, Eye, Download } from "lucide-react";

export const Route = createFileRoute("/screens/orders")({ component: Orders });

const ORDERS = [
  { id: "#CMD-1248", date: "25/06/2026", total: 36000, status: "Livrée", items: 3 },
  { id: "#CMD-1247", date: "24/06/2026", total: 19500, status: "Livrée", items: 1 },
  { id: "#CMD-1246", date: "23/06/2026", total: 43000, status: "En cours", items: 4 },
  { id: "#CMD-1245", date: "22/06/2026", total: 12500, status: "En cours", items: 2 },
  { id: "#CMD-1244", date: "20/06/2026", total: 28000, status: "Annulée", items: 2 },
  { id: "#CMD-1243", date: "18/06/2026", total: 61500, status: "Livrée", items: 5 },
];

const STATUS_STYLES: Record<string, string> = {
  "Livrée": "bg-success/10 text-success",
  "En cours": "bg-warning/10 text-warning",
  "Annulée": "bg-danger/10 text-danger",
};

function Orders() {
  return (
    <div className="surface-card overflow-hidden">
      <MarketHeader />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-navy mb-6">Historique des commandes</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {["Toutes", "En cours", "Livrées", "Annulées"].map((t, i) => (
            <button key={t} className={`rounded-lg px-4 py-2 text-sm font-semibold ${i === 0 ? "bg-navy text-white" : "border border-border bg-card text-muted-foreground hover:bg-muted"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {ORDERS.map((o) => (
            <div key={o.id} className="surface-card p-5 flex items-center gap-5 flex-wrap md:flex-nowrap">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-orange/10">
                <Package className="h-6 w-6 text-orange" />
              </div>
              <div className="flex-1 min-w-40">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-bold text-navy">{o.id}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Commandée le {o.date} • {o.items} article{o.items > 1 ? "s" : ""}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold text-orange">{fcfa(o.total)}</p>
                <p className="text-xs text-muted-foreground">Payé via Wave</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="rounded-lg border border-border p-2 hover:bg-muted"><Eye className="h-4 w-4" /></button>
                <button className="rounded-lg border border-border p-2 hover:bg-muted"><Download className="h-4 w-4" /></button>
                <button className="btn-orange rounded-lg px-4 py-2 text-xs font-semibold">Suivre</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
