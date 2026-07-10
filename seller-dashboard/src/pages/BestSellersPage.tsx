import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PeriodSelector } from "../components/PeriodSelector";
import { api } from "../lib/api";

interface BestSeller {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

/** PB-043 — Produits les plus vendus, filtrable par période. */
export function BestSellersPage() {
  const [period, setPeriod] = useState("30d");
  const [results, setResults] = useState<BestSeller[]>([]);

  useEffect(() => {
    api
      .get<{ results: BestSeller[] }>("/analytics/products/best-sellers/", { params: { period } })
      .then((res) => setResults(res.data.results));
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Produits les plus vendus</h1>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>
      <DataTable
        rows={results}
        keyField={(row) => row.product_id}
        columns={[
          { header: "Produit", render: (row) => row.product_name },
          { header: "Quantité vendue", render: (row) => row.total_quantity },
          { header: "CA généré", render: (row) => `${row.total_revenue} FCFA` },
        ]}
      />
    </div>
  );
}
