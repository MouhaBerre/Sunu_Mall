import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PeriodSelector } from "../components/PeriodSelector";
import { api } from "../lib/api";

interface TrendRow {
  id: number | string;
  label: string;
  quantity: number;
  previous_quantity: number;
  growth_pct: number;
}

const DIMENSIONS = [
  { value: "category", label: "Catégories" },
  { value: "product", label: "Produits" },
  { value: "store", label: "Boutiques" },
];

/** PB-045 — Tendances : compare la période choisie à la période précédente. */
export function TrendsPage() {
  const [dimension, setDimension] = useState("category");
  const [period, setPeriod] = useState("30d");
  const [results, setResults] = useState<TrendRow[]>([]);

  useEffect(() => {
    api
      .get<{ results: TrendRow[] }>("/analytics/trends/", { params: { dimension, period } })
      .then((res) => setResults(res.data.results));
  }, [dimension, period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Tendances</h1>
        <div className="flex gap-2">
          <select
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm"
          >
            {DIMENSIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
      </div>
      <DataTable
        rows={results}
        keyField={(row) => row.id}
        columns={[
          { header: "Nom", render: (row) => row.label ?? "—" },
          { header: "Quantité (période)", render: (row) => row.quantity },
          { header: "Quantité (précédente)", render: (row) => row.previous_quantity },
          {
            header: "Croissance",
            render: (row) => (
              <span className={row.growth_pct >= 0 ? "text-emerald-600" : "text-red-600"}>
                {row.growth_pct >= 0 ? "+" : ""}
                {row.growth_pct}%
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
