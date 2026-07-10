import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { LiveSalesWidget } from "../components/LiveSalesWidget";
import { PeriodSelector } from "../components/PeriodSelector";
import { StatCard } from "../components/StatCard";
import { api } from "../lib/api";

interface TopStore {
  store_id: string;
  store_name: string;
  revenue: number;
  order_count: number;
}

interface AdminOverview {
  revenue: number;
  order_count: number;
  avg_order_value: number;
  total_products: number;
  total_users: number;
  total_stores: number;
  top_stores: TopStore[];
}

/** PB-042 — Tableau analytique admin (agrégats sur toutes les boutiques). */
export function AdminOverviewPage() {
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState<AdminOverview | null>(null);

  useEffect(() => {
    api.get<AdminOverview>("/analytics/admin/overview/", { params: { period } }).then((res) => setData(res.data));
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Tableau analytique</h1>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {data && (
        <>
          <LiveSalesWidget storeId={null} />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            <StatCard label="Chiffre d'affaires" value={`${data.revenue} FCFA`} />
            <StatCard label="Commandes" value={data.order_count} />
            <StatCard label="Panier moyen" value={`${data.avg_order_value} FCFA`} />
            <StatCard label="Produits actifs" value={data.total_products} />
            <StatCard label="Utilisateurs" value={data.total_users} />
            <StatCard label="Boutiques actives" value={data.total_stores} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Meilleures boutiques</h3>
            <DataTable
              rows={data.top_stores}
              keyField={(row) => row.store_id}
              columns={[
                { header: "Boutique", render: (row) => row.store_name },
                { header: "CA", render: (row) => `${row.revenue} FCFA` },
                { header: "Commandes", render: (row) => row.order_count },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
