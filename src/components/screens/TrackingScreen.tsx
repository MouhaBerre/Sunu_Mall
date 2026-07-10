import Link from "next/link";
import { MessageCircle, Phone, Star, MapPin, Package, Navigation, Clock } from "lucide-react";
import { fcfa } from "@/lib/mock-data";

const ITEMS = [
  { n: "Sac à main Luxe — Cuir", q: 1, p: 25000, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop" },
  { n: "Huile de karité pure", q: 2, p: 4500, img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=200&auto=format&fit=crop" },
];

function Tracking() {
  const total = ITEMS.reduce((a, i) => a + i.p * i.q, 0) + 2000;
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="text-xs text-gray-400 mb-2">
        <Link href="/" className="hover:text-orange">Accueil</Link> <span className="mx-1">/</span>
        <Link href="/orders" className="hover:text-orange">Mes commandes</Link> <span className="mx-1">/</span>
        <span className="text-gray-700">Suivi</span>
      </nav>

      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">Suivi de commande</h1>
          <p className="text-sm text-gray-500 mt-1">Commande <b className="text-navy">#CMD-1248</b> · en cours de livraison</p>
        </div>
        <span className="rounded-full bg-orange/10 text-orange text-sm font-semibold px-3 py-1.5 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-orange animate-pulse" /> Livreur en route
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Map */}
        <div className="surface-card overflow-hidden">
          <div className="relative h-[480px]" style={{ background: "linear-gradient(180deg, #E7EEF7 0%, #D5E1F0 100%)" }}>
            <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
              <path d="M-20 160 C 200 140, 400 220, 820 180" stroke="#fff" strokeWidth="22" fill="none" />
              <path d="M120 -20 C 160 200, 360 360, 420 520" stroke="#fff" strokeWidth="18" fill="none" />
              <path d="M480 -20 C 520 180, 640 340, 700 520" stroke="#fff" strokeWidth="14" fill="none" />
              <path d="M-20 360 C 250 340, 450 400, 820 360" stroke="#fff" strokeWidth="16" fill="none" />
              <path d="M200 430 C 280 320, 340 300, 440 260 S 600 160, 640 110" stroke="#FF8C00" strokeWidth="5" fill="none" strokeDasharray="10 8" strokeLinecap="round" />
              <circle cx="200" cy="430" r="12" fill="#0A163A" stroke="#fff" strokeWidth="3" />
              <circle cx="640" cy="110" r="16" fill="#FF8C00" stroke="#fff" strokeWidth="3" />
              <g transform="translate(440 260)">
                <circle r="26" fill="#FF8C00" opacity="0.25" />
                <circle r="16" fill="#FF8C00" />
                <text y="5" textAnchor="middle" fontSize="14" fill="#fff">🛵</text>
              </g>
            </svg>
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white shadow px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-navy" />
              <span className="text-xs font-semibold text-navy">Sandaga Fashion (départ)</span>
            </div>
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white shadow px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-orange" />
              <span className="text-xs font-semibold text-navy">Vous (destination)</span>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 shadow-elevated">
              <span className="text-sm font-bold text-navy flex items-center gap-1"><Navigation className="h-4 w-4 text-orange" /> 4,2 km restants</span>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* ETA */}
          <div className="rounded-2xl bg-gradient-to-br from-orange to-orange-light p-5 text-white text-center">
            <p className="font-display text-4xl font-extrabold leading-none">15 min</p>
            <p className="text-xs text-white/90 mt-1 flex items-center justify-center gap-1"><Clock className="h-3.5 w-3.5" /> Temps estimé d'arrivée</p>
          </div>

          {/* Driver */}
          <div className="surface-card p-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Votre livreur</p>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-navy grid place-items-center text-white font-display font-bold">M</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-navy truncate">Modou Ndiaye</p>
                  <span className="flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 fill-orange text-orange" />4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">Yamaha · DK-1234-A</p>
              </div>
              <button aria-label="Message" className="grid h-10 w-10 place-items-center rounded-full bg-orange/10 text-orange hover:bg-orange/20"><MessageCircle className="h-4 w-4" /></button>
              <a href="tel:" aria-label="Appeler" className="grid h-10 w-10 place-items-center rounded-full bg-success/10 text-success hover:bg-success/20"><Phone className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Timeline */}
          <div className="surface-card p-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Progression</p>
            <div className="space-y-3">
              <Step done label="Commande confirmée" time="14:22" />
              <Step done label="Colis préparé" time="14:45" />
              <Step active label="Livreur en route" time="Maintenant" />
              <Step label="Livraison" time="~15 min" />
            </div>
          </div>

          {/* Delivery address */}
          <div className="surface-card p-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Adresse de livraison</p>
            <p className="text-sm text-navy font-medium flex items-start gap-2"><MapPin className="h-4 w-4 text-orange shrink-0 mt-0.5" /> Cité Keur Gorgui, Villa N°23 — Dakar</p>
          </div>

          {/* Order items */}
          <div className="surface-card p-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Contenu de la commande</p>
            <div className="space-y-3">
              {ITEMS.map((it, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={it.img} alt={it.n} className="h-11 w-11 rounded-lg object-cover bg-gray-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{it.n}</p>
                    <p className="text-xs text-muted-foreground">Qté {it.q}</p>
                  </div>
                  <span className="text-sm font-bold text-navy">{fcfa(it.p * it.q)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-border pt-3 flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total (livraison incl.)</span>
              <span className="font-display font-extrabold text-orange">{fcfa(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ done, active, label, time }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-6 w-6 grid place-items-center rounded-full shrink-0 ${done ? "bg-success" : active ? "bg-orange animate-pulse" : "bg-muted"}`}>
        {done && <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="4"><path d="m5 12 5 5L20 7" /></svg>}
      </div>
      <div className="flex-1"><p className={`text-sm ${active ? "font-semibold text-orange" : done ? "text-navy font-medium" : "text-muted-foreground"}`}>{label}</p></div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}

export default Tracking;
