import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame, StatusBar } from "@/components/mock/PhoneFrame";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { Package, Megaphone, Truck, Bell, ChevronLeft, MoreVertical } from "lucide-react";

export const Route = createFileRoute("/screens/notifications")({ component: NotificationsScreen });

const ICON: Record<string, any> = { order: Package, promo: Megaphone, delivery: Truck, system: Bell };

function NotificationsScreen() {
  return (
    <div className="flex justify-center py-6">
      <PhoneFrame label="23 — Notifications">
        <StatusBar />
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <button className="p-2 -ml-2"><ChevronLeft className="h-5 w-5" /></button>
          <div>
            <h1 className="font-display text-lg font-bold text-navy text-center">Notifications</h1>
            <p className="text-[11px] text-muted-foreground text-center">2 non lues</p>
          </div>
          <button className="p-2 -mr-2"><MoreVertical className="h-5 w-5" /></button>
        </div>

        <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
          {["Toutes", "Commandes", "Promos", "Livraisons"].map((t, i) => (
            <button key={t} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${i === 0 ? "bg-orange text-white" : "border border-border bg-card text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        <div className="px-4 space-y-2">
          {NOTIFICATIONS.map((n) => {
            const Ic = ICON[n.type];
            return (
              <div key={n.id} className={`rounded-xl p-3 flex gap-3 ${!n.read ? "bg-orange/5 border border-orange/20" : "bg-card border border-border"}`}>
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                  n.type === "order" ? "bg-success/10 text-success" :
                  n.type === "promo" ? "bg-orange/10 text-orange" :
                  n.type === "delivery" ? "bg-navy/10 text-navy" : "bg-muted text-muted-foreground"
                }`}>
                  <Ic className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-navy text-sm">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-orange shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
              </div>
            );
          })}

          <div className="pt-3 pb-2">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-1 mb-2">Plus tôt</p>
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl p-3 flex gap-3 bg-card border border-border mb-2">
                <div className="h-10 w-10 shrink-0 rounded-full bg-muted grid place-items-center text-muted-foreground">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm">Notification #{i}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Contenu de notification résumé sur une ou deux lignes...</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Il y a {i + 1} j</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}
