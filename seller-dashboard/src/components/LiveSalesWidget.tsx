import { useSalesSocket } from "../hooks/useSalesSocket";
import { StatCard } from "./StatCard";

/** PB-047 — se met à jour sans rechargement dès qu'un paiement est validé. */
export function LiveSalesWidget({ storeId }: { storeId: string | null }) {
  const { lastUpdate, connected } = useSalesSocket(storeId);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Ventes en direct</h3>
        <span className={`text-xs ${connected ? "text-emerald-600" : "text-slate-400"}`}>
          {connected ? "● connecté" : "○ connexion…"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="CA aujourd'hui" value={lastUpdate ? `${lastUpdate.today.revenue} FCFA` : "—"} />
        <StatCard label="Commandes" value={lastUpdate?.today.order_count ?? "—"} />
        <StatCard label="Panier moyen" value={lastUpdate ? `${lastUpdate.today.avg_order_value} FCFA` : "—"} />
        <StatCard label="Conversion" value={lastUpdate ? `${lastUpdate.today.conversion_rate}%` : "—"} />
      </div>
    </div>
  );
}
