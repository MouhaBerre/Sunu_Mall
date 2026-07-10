import Link from "next/link";
import { fcfa } from "@/lib/mock-data";
import { Check, MapPin, Home, Building } from "lucide-react";

export function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = ["Adresse", "Livraison", "Paiement", "Confirmation"];
  return (
    <div className="surface-card p-4 flex items-center justify-between gap-2 overflow-x-auto">
      {steps.map((s, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={s} className="flex items-center gap-3 flex-1 min-w-fit">
            <div className={`h-8 w-8 grid place-items-center rounded-full text-xs font-bold shrink-0
              ${done ? "bg-success text-white" : active ? "bg-orange text-white shadow-orange" : "bg-muted text-muted-foreground"}`}>
              {done ? <Check className="h-4 w-4" /> : n}
            </div>
            <span className={`text-sm ${active ? "font-semibold text-navy" : done ? "text-navy" : "text-muted-foreground"}`}>{s}</span>
            {n < 4 && <span className="flex-1 h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

function CheckoutAddress() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-navy mb-6">Finaliser ma commande</h1>
        <Stepper step={1} />

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mt-6">
          <div className="surface-card p-6">
            <h2 className="font-display font-bold text-navy">Adresse de livraison</h2>
            <div className="mt-4 grid gap-3">
              <label className="rounded-xl border-2 border-orange bg-orange/5 p-4 flex items-start gap-3 cursor-pointer">
                <input type="radio" name="addr" defaultChecked className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-orange" />
                    <p className="font-semibold text-navy">Maison</p>
                    <span className="text-[10px] rounded-full bg-orange text-white px-2 py-0.5 font-bold">Par défaut</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Cité Keur Gorgui, Villa N°23 — Dakar</p>
                  <p className="text-sm text-muted-foreground">+221 77 123 45 67</p>
                </div>
              </label>
              <label className="rounded-xl border border-border p-4 flex items-start gap-3 cursor-pointer">
                <input type="radio" name="addr" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2"><Building className="h-4 w-4 text-navy" /><p className="font-semibold text-navy">Bureau</p></div>
                  <p className="text-sm text-muted-foreground mt-1">Immeuble Sonatel, Almadies — Dakar</p>
                </div>
              </label>
            </div>

            <button className="mt-4 w-full rounded-xl border-2 border-dashed border-border py-3 text-sm font-semibold text-orange hover:bg-orange/5 flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" /> Ajouter une nouvelle adresse
            </button>

            <div className="mt-6 border-t border-border pt-6">
              <h3 className="font-display font-bold text-navy mb-3">Nouvelle adresse</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nom complet" placeholder="Aminata Fall" full />
                <Field label="Téléphone" placeholder="+221 77 123 45 67" />
                <Field label="Ville" placeholder="Dakar" />
                <Field label="Quartier" placeholder="Almadies" full />
                <Field label="Adresse détaillée" placeholder="Immeuble, N°, étage..." full />
              </div>
            </div>
          </div>

          <Summary step={1} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, full }: any) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-xs font-medium text-navy mb-1.5 block">{label}</label>
      <input placeholder={placeholder} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-orange" />
    </div>
  );
}

export function Summary({ step }: { step: number }) {
  const nextLabels = ["Continuer", "Continuer", "Payer 36 000 FCFA", "Terminer"];
  const nextTargets = ["/checkout-delivery", "/checkout-payment", "/order-confirmed", "/order-confirmed"];
  return (
    <aside className="surface-card p-6 h-fit sticky top-6">
      <h3 className="font-display font-bold text-navy">Récapitulatif</h3>
      <div className="mt-4 space-y-2 text-sm">
        <Row label="Sous-total" value={fcfa(34000)} />
        <Row label="Livraison" value={fcfa(2000)} />
        <div className="my-3 border-t border-border" />
        <div className="flex items-baseline justify-between">
          <span className="font-display font-bold text-navy">Total</span>
          <span className="font-display text-2xl font-extrabold text-orange">{fcfa(36000)}</span>
        </div>
      </div>
      <Link href={nextTargets[step - 1]} className="btn-orange w-full rounded-xl py-3 text-sm font-bold mt-4 block text-center">
        {nextLabels[step - 1]}
      </Link>
    </aside>
  );
}
function Row({ label, value }: any) { return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-semibold text-navy">{value}</span></div>; }

export default CheckoutAddress;
