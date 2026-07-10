"use client";

import Link from "next/link";
import { useState } from "react";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { Package, Megaphone, Truck, Bell, CheckCheck } from "lucide-react";

const ICON: Record<string, any> = { order: Package, promo: Megaphone, delivery: Truck, system: Bell };
const TABS: { label: string; type: string | null }[] = [
  { label: "Toutes", type: null },
  { label: "Commandes", type: "order" },
  { label: "Promos", type: "promo" },
  { label: "Livraisons", type: "delivery" },
];

function NotificationsScreen() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<string | null>(null);

  const shown = filter ? items.filter((n) => n.type === filter) : items;
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((list) => list.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <nav className="text-xs text-gray-400 mb-2">
        <Link href="/" className="hover:text-orange">Accueil</Link> <span className="mx-1">/</span> <span className="text-gray-700">Notifications</span>
      </nav>

      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Bell className="h-7 w-7 text-orange" /> Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">{unread} non lue{unread > 1 ? "s" : ""}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm font-semibold text-orange hover:underline flex items-center gap-1.5">
            <CheckCheck className="h-4 w-4" /> Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {TABS.map((t) => {
          const active = filter === t.type;
          return (
            <button
              key={t.label}
              onClick={() => setFilter(t.type)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${active ? "bg-orange text-white" : "border border-gray-200 bg-white text-gray-500 hover:text-orange"}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      {shown.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-14 text-center text-gray-500">
          <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          Aucune notification dans cette catégorie.
        </div>
      ) : (
        <div className="space-y-2">
          {shown.map((n) => {
            const Ic = ICON[n.type] ?? Bell;
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`w-full text-left rounded-xl p-4 flex gap-3 transition-colors ${!n.read ? "bg-orange/5 border border-orange/20" : "bg-white border border-gray-100 hover:bg-gray-50"}`}
              >
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                  n.type === "order" ? "bg-success/10 text-success" :
                  n.type === "promo" ? "bg-orange/10 text-orange" :
                  n.type === "delivery" ? "bg-navy/10 text-navy" : "bg-gray-100 text-gray-500"
                }`}>
                  <Ic className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-navy">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-orange shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">{n.text}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NotificationsScreen;
