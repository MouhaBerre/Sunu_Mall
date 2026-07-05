import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/screens/verify-email")({ component: VerifyEmail });

function VerifyEmail() {
  return (
    <div className="flex justify-center py-8">
      <div className="surface-card p-12 max-w-md w-full text-center">
        <Logo size={40} className="justify-center" />
        <div className="mt-8 mx-auto grid h-24 w-24 place-items-center rounded-full bg-orange/10">
          <MailCheck className="h-12 w-12 text-orange" />
          <span className="absolute grid h-8 w-8 place-items-center rounded-full bg-success text-white translate-x-8 translate-y-8">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 5 5L20 7" /></svg>
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-navy mt-8">Vérifiez votre email</h1>
        <p className="text-sm text-muted-foreground mt-3">
          Nous venons d'envoyer un lien de confirmation à <br />
          <span className="font-semibold text-navy">exemple@email.com</span>
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Cliquez sur le lien pour activer votre compte.<br />Le lien expire dans 24h.
        </p>

        <button className="btn-orange w-full rounded-xl py-3 text-sm font-semibold mt-8">Renvoyer l'email</button>

        <div className="flex items-center justify-between text-xs mt-6">
          <a className="text-muted-foreground hover:text-navy">Changer d'adresse</a>
          <Link to="/screens/login" className="text-orange font-semibold">J'ai vérifié →</Link>
        </div>
      </div>
    </div>
  );
}
