import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame, StatusBar } from "@/components/mock/PhoneFrame";
import { ChevronLeft, MessageCircle, Phone, Star } from "lucide-react";

export const Route = createFileRoute("/screens/tracking")({ component: Tracking });

function Tracking() {
  return (
    <div className="flex justify-center py-6">
      <PhoneFrame label="24 — Suivi GPS en temps réel">
        <div className="relative h-full">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #E7EEF7 0%, #D5E1F0 100%)" }}>
            <svg viewBox="0 0 360 740" className="absolute inset-0 w-full h-full">
              <path d="M-20 200 C 100 180, 200 260, 380 220" stroke="#fff" strokeWidth="18" fill="none" />
              <path d="M40 -20 C 60 200, 180 400, 220 760" stroke="#fff" strokeWidth="14" fill="none" />
              <path d="M180 -20 C 200 200, 300 380, 340 760" stroke="#fff" strokeWidth="10" fill="none" />
              <path d="M-20 500 C 150 480, 250 540, 380 500" stroke="#fff" strokeWidth="12" fill="none" />
              <path d="M80 570 C 130 450, 100 360, 200 300 S 260 200, 280 140" stroke="#FF8C00" strokeWidth="4" fill="none" strokeDasharray="8 6" strokeLinecap="round" />
              <circle cx="80" cy="570" r="10" fill="#0A163A" />
              <circle cx="80" cy="570" r="4" fill="#fff" />
              <circle cx="280" cy="140" r="14" fill="#FF8C00" />
              <circle cx="280" cy="140" r="6" fill="#fff" />
              <g transform="translate(200 300)">
                <circle r="22" fill="#FF8C00" opacity="0.25" />
                <circle r="14" fill="#FF8C00" />
                <text y="4" textAnchor="middle" fontSize="12" fill="#fff">🛵</text>
              </g>
            </svg>
          </div>

          <div className="relative z-10">
            <StatusBar />
            <div className="flex items-center justify-between px-4 pt-2">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white shadow"><ChevronLeft className="h-5 w-5" /></button>
              <div className="bg-white shadow px-3 py-1.5 rounded-full text-center">
                <p className="text-[10px] text-muted-foreground">Livraison</p>
                <p className="text-xs font-bold text-navy">#CMD-1246</p>
              </div>
              <span className="h-10 w-10" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 bg-card rounded-t-3xl shadow-elevated p-5">
            <div className="mx-auto h-1 w-10 rounded-full bg-border mb-4" />
            <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-orange to-orange-light py-3 mb-4">
              <p className="font-display text-4xl font-extrabold text-white leading-none">15 min</p>
              <p className="text-xs text-white/80 mt-1">Temps estimé</p>
            </div>
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="h-12 w-12 rounded-full bg-navy grid place-items-center text-white font-display font-bold">M</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-navy truncate">Modou Ndiaye</p>
                  <span className="flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 fill-orange text-orange" />4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">Yamaha • DK-1234-A</p>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-orange/10 text-orange"><MessageCircle className="h-4 w-4" /></button>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-success/10 text-success"><Phone className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <Step done label="Commande confirmée" time="14:22" />
              <Step done label="Colis préparé" time="14:45" />
              <Step active label="Livreur en route" time="Maintenant" />
              <Step label="Livraison" time="~15 min" />
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

function Step({ done, active, label, time }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-6 w-6 grid place-items-center rounded-full ${done ? "bg-success" : active ? "bg-orange animate-pulse" : "bg-muted"}`}>
        {done && <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="4"><path d="m5 12 5 5L20 7" /></svg>}
      </div>
      <div className="flex-1"><p className={`text-sm ${active ? "font-semibold text-orange" : done ? "text-navy font-medium" : "text-muted-foreground"}`}>{label}</p></div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}
