import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PeriodSelector } from "../components/PeriodSelector";
import { StatCard } from "../components/StatCard";
import { BarChart } from "../components/charts";
import { api } from "../lib/api";

interface TrafficSummary {
  visits: number;
  unique_visitors: number;
  sessions: number;
  device_breakdown: Record<string, number>;
  traffic_sources: Record<string, number>;
  top_pages: { path: string; views: number }[];
}

/** PB-046 — Fréquentation. */
export function TrafficPage() {
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState<TrafficSummary | null>(null);

  useEffect(() => {
    api.get<TrafficSummary>("/analytics/traffic/", { params: { period } }).then((res) => setData(res.data));
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Fréquentation</h1>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {data && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Visites" value={data.visits} />
            <StatCard label="Visiteurs uniques" value={data.unique_visitors} />
            <StatCard label="Sessions" value={data.sessions} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Appareils</h3>
              <BarChart
                label="Visites"
                labels={Object.keys(data.device_breakdown)}
                data={Object.values(data.device_breakdown)}
              />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Sources de trafic</h3>
              <BarChart
                label="Visites"
                labels={Object.keys(data.traffic_sources)}
                data={Object.values(data.traffic_sources)}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Pages les plus vues</h3>
            <DataTable
              rows={data.top_pages}
              keyField={(row) => row.path}
              columns={[
                { header: "Page", render: (row) => row.path },
                { header: "Vues", render: (row) => row.views },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
