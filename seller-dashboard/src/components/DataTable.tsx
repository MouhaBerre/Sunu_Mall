import type { ReactNode } from "react";

interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({ columns, rows, keyField }: { columns: Column<T>[]; rows: T[]; keyField: (row: T) => string | number }) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">Aucune donnée pour cette période.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-2 text-left font-medium text-slate-600">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row) => (
            <tr key={keyField(row)}>
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-2 text-slate-800">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
