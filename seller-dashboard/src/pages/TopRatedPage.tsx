import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { api } from "../lib/api";

interface TopRated {
  product_id: string;
  product_name: string;
  avg_rating: number;
  review_count: number;
}

/** PB-044 — Produits les mieux notés. */
export function TopRatedPage() {
  const [results, setResults] = useState<TopRated[]>([]);

  useEffect(() => {
    api.get<{ results: TopRated[] }>("/analytics/products/top-rated/").then((res) => setResults(res.data.results));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Produits les mieux notés</h1>
      <DataTable
        rows={results}
        keyField={(row) => row.product_id}
        columns={[
          { header: "Produit", render: (row) => row.product_name },
          { header: "Note moyenne", render: (row) => `${row.avg_rating} / 5` },
          { header: "Nombre d'avis", render: (row) => row.review_count },
        ]}
      />
    </div>
  );
}
