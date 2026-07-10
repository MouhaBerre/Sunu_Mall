import Link from "next/link";
import { Truck, Zap, Calendar } from "lucide-react";
import { Stepper, Summary } from "@/components/screens/CheckoutAddressScreen";

const OPTIONS = [
  { icon: Truck, name: "Livraison Standard", desc: "2-3 jours ouvrés", price: "Gratuit", check: true },
  { icon: Zap, name: "Livraison Express", desc: "24h ouvrées à Dakar", price: "2 000 FCFA" },
  { icon: Calendar, name: "Livraison Programmée", desc: "Choisissez la date et l'heure", price: "1 000 FCFA" },
];

function CheckoutDelivery() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-navy mb-6">Finaliser ma commande</h1>
        <Stepper step={2} />

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mt-6">
          <div className="surface-card p-6">
            <h2 className="font-display font-bold text-navy">Choisissez votre mode de livraison</h2>
            <div className="mt-4 grid gap-3">
              {OPTIONS.map((o) => (
                <label key={o.name} className={`rounded-xl border-2 p-4 flex items-center gap-4 cursor-pointer ${o.check ? "border-orange bg-orange/5" : "border-border"}`}>
                  <input type="radio" name="delivery" defaultChecked={o.check} />
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-orange/10">
                    <o.icon className="h-5 w-5 text-orange" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-navy">{o.name}</p>
                    <p className="text-sm text-muted-foreground">{o.desc}</p>
                  </div>
                  <span className="font-display font-bold text-orange">{o.price}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <h3 className="font-display font-bold text-navy mb-2">Notes de livraison (optionnel)</h3>
              <textarea rows={3} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-orange resize-none" placeholder="Instructions pour le livreur, code d'accès..." />
            </div>
          </div>

          <Summary step={2} />
        </div>
      </div>
    </div>
  );
}

export default CheckoutDelivery;
