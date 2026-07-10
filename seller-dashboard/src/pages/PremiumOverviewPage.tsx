import { useEffect, useState } from "react";
import { LiveSalesWidget } from "../components/LiveSalesWidget";
import { PeriodSelector } from "../components/PeriodSelector";
import { StatCard } from "../components/StatCard";
import { BarChart, LineChart } from "../components/charts";
import { api } from "../lib/api";

interface SellerOverview {
  store_id: string;
  revenue: number;
  order_count: number;
  avg_order_value: number;
  conversion_rate: number;
  monthly_revenue: { month: string; revenue: number }[];
  sales_by_category: { category_name: string | null; revenue: number }[];
}

/** PB-041 — réservé aux boutiques avec un abonnement Premium/Premium+ actif. */
export function PremiumOverviewPage() {
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState<SellerOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    api
      .get<SellerOverview>("/analytics/seller/overview/", { params: { period } })
      .then((res) => setData(res.data))
      .catch(() => setError("Cette fonctionnalité est réservée aux boutiques Premium."));
  }, [period]);

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <h2 className="font-semibold">Passez à Premium</h2>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Statistiques Premium</h1>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {data && (
        <>
          <LiveSalesWidget storeId={data.store_id} />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Chiffre d'affaires" value={`${data.revenue} FCFA`} />
            <StatCard label="Commandes" value={data.order_count} />
            <StatCard label="Panier moyen" value={`${data.avg_order_value} FCFA`} />
            <StatCard label="Taux de conversion" value={`${data.conversion_rate}%`} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Revenus mensuels</h3>
              <LineChart
                label="CA"
                labels={data.monthly_revenue.map((m) => m.month)}
                data={data.monthly_revenue.map((m) => m.revenue)}
              />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Ventes par catégorie</h3>
              <BarChart
                label="CA"
                labels={data.sales_by_category.map((c) => c.category_name ?? "Sans catégorie")}
                data={data.sales_by_category.map((c) => c.revenue)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
