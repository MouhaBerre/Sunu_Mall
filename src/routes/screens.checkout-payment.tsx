import { createFileRoute } from "@tanstack/react-router";
import { MarketHeader } from "@/components/mock/MarketHeader";
import { Lock } from "lucide-react";
import { Stepper, Summary } from "./screens.checkout-address";

export const Route = createFileRoute("/screens/checkout-payment")({ component: CheckoutPayment });

const METHODS = [
  { id: "wave", name: "Wave", desc: "Payer avec Wave", color: "from-[#1DC8E9] to-[#0EA5E9]", check: true },
  { id: "om", name: "Orange Money", desc: "Payer avec Orange Money", color: "from-[#FF7900] to-[#F26A00]" },
  { id: "cb", name: "Carte bancaire", desc: "Visa, Mastercard", color: "from-[#0A163A] to-[#142A5E]" },
];

function CheckoutPayment() {
  return (
    <div className="surface-card overflow-hidden">
      <MarketHeader />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-navy mb-6">Finaliser ma commande</h1>
        <Stepper step={3} />

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mt-6">
          <div className="surface-card p-6">
            <h2 className="font-display font-bold text-navy">Choisissez votre moyen de paiement</h2>
            <div className="mt-4 grid gap-3">
              {METHODS.map((m) => (
                <label key={m.id} className={`rounded-xl border-2 p-4 flex items-center gap-4 cursor-pointer ${m.check ? "border-orange bg-orange/5" : "border-border"}`}>
                  <input type="radio" name="pay" defaultChecked={m.check} />
                  <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${m.color} grid place-items-center text-white font-display font-extrabold text-xs`}>
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-navy">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background p-5">
              <p className="text-xs font-semibold text-navy mb-3">Détails du paiement Wave</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-navy mb-1.5 block">Numéro Wave</label>
                  <input placeholder="+221 77 123 45 67" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-orange" />
                </div>
                <div className="col-span-2 rounded-lg bg-orange/5 border border-orange/20 p-3 text-xs text-navy">
                  🔒 Vous recevrez une notification Wave pour valider le paiement de <b>36 000 FCFA</b>.
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3 text-success" />
              Paiement 100% sécurisé — vos informations sont chiffrées.
            </div>
          </div>

          <Summary step={3} />
        </div>
      </div>
    </div>
  );
}
