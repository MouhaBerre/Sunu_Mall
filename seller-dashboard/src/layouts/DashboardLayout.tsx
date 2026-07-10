import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";

const NAV_ITEMS = [
  { to: "/", label: "Statistiques Premium" },
  { to: "/best-sellers", label: "Meilleures ventes" },
  { to: "/top-rated", label: "Mieux notés" },
  { to: "/trends", label: "Tendances" },
  { to: "/traffic", label: "Fréquentation" },
];

export function DashboardLayout() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white p-4">
        <h1 className="mb-6 text-lg font-bold text-slate-900">SUNU MALL</h1>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`
              }
            >
              Tableau admin
            </NavLink>
          )}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <span className="text-sm text-slate-600">{user?.email}</span>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-800">
            Déconnexion
          </button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
