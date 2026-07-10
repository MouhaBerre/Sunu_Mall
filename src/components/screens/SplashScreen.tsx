import Link from "next/link";
import { PhoneFrame } from "@/components/mock/PhoneFrame";
import { Logo } from "@/components/brand/Logo";

function Splash() {
  return (
    <div className="flex justify-center py-6">
      <PhoneFrame label="01 — Splash Screen">
        <div className="relative h-full navy-panel flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(circle at 30% 20%, rgba(255,140,0,0.35) 0%, transparent 55%), radial-gradient(circle at 70% 80%, rgba(255,163,26,0.25) 0%, transparent 55%)",
          }} />
          <div className="relative flex flex-col items-center gap-4">
            <div className="animate-pulse">
              <Logo variant="color" size={200} />
            </div>
            <p className="text-orange-light text-base italic font-medium">Jënd ak jaay, bu yomb</p>
            <p className="text-white/70 text-xs">La marketplace du Sénégal 🇸🇳</p>
          </div>
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="h-1 w-40 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-2/3 rounded-full btn-orange" />
            </div>
            <span className="text-xs text-white/50">Chargement...</span>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

export default Splash;
