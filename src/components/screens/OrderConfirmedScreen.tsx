import Link from "next/link";
import { Check, Download, Package } from "lucide-react";
import { fcfa } from "@/lib/mock-data";

function OrderConfirmed() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-success/10 relative">
          <Check className="h-14 w-14 text-success stroke-[3]" />
          <div className="absolute inset-0 rounded-full border-4 border-success/30 animate-ping" />
        </div>
        <h1 className="font-display text-4xl font-extrabold text-navy mt-6">Commande confirmée 🎉</h1>
        <p className="text-muted-foreground mt-2">Merci Aminata ! Votre paiement a bien été reçu.</p>

        <div className="surface-card p-6 mt-8 text-left">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Numéro de commande</p>
              <p className="font-display text-xl font-bold text-navy">#CMD-1248</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total payé</p>
              <p className="font-display text-xl font-bold text-orange">{fcfa(36000)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Livraison estimée</p>
              <p className="font-semibold text-navy">27 juin 2026</p>
            </div>
          </div>
          <div className="my-5 border-t border-border" />
          <div className="grid grid-cols-3 gap-2 text-xs">
            {["Confirmé", "Préparation", "Livraison"].map((s, i) => (
              <div key={s} className="text-center">
                <div className={`mx-auto grid h-8 w-8 place-items-center rounded-full ${i === 0 ? "bg-orange text-white" : "bg-muted text-muted-foreground"}`}>
                  {i === 0 ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <p className={`mt-1 font-medium ${i === 0 ? "text-navy" : "text-muted-foreground"}`}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center flex-wrap">
          <Link href="/tracking" className="btn-orange rounded-xl px-6 py-3 text-sm font-bold flex items-center gap-2">
            <Package className="h-4 w-4" /> Suivre ma commande
          </Link>
          <button className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold flex items-center gap-2">
            <Download className="h-4 w-4" /> Télécharger la facture
          </button>
        </div>
        <Link href="/" className="mt-4 inline-block text-sm text-muted-foreground hover:text-navy underline">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmed;
