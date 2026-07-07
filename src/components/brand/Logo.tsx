import { cn } from "@/lib/utils";
import logoAsset from "@/assets/sunumall-logo-clean.png";

interface LogoProps {
  className?: string;
  size?: number;
  /** "color" & "navy" render the full raster logo; "white" renders a white-tinted version for dark backgrounds. */
  variant?: "color" | "white" | "navy";
  /** Show "SUNU MALL" wordmark next to the icon. The uploaded logo already includes the wordmark, so this is off by default. */
  showWordmark?: boolean;
  /** Show the wolof tagline under the logo. */
  showSlogan?: boolean;
}

export const SUNU_MALL_SLOGAN = "Jënd ak jaay, bu yomb";

/**
 * SUNU MALL logo — uses the official uploaded mark.
 * Slogan (wolof): "Jënd ak jaay, bu yomb" → "Acheter et vendre, en toute simplicité".
 */
export function Logo({
  className,
  size = 40,
  variant = "color",
  showWordmark = false,
  showSlogan = false,
}: LogoProps) {
  const isWhite = variant === "white";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src={logoAsset}
        alt="SUNU MALL"
        width={size}
        height={size}
        className={cn(
          "object-contain shrink-0",
          isWhite && "brightness-0 invert",
        )}
        style={{ width: size, height: size }}
      />
      {(showWordmark || showSlogan) && (
        <div className="flex flex-col leading-tight">
          {showWordmark && (
            <div className="flex items-baseline gap-1">
              <span
                className="font-display font-extrabold tracking-tight text-[1rem]"
                style={{ color: isWhite ? "#FFFFFF" : "#0A163A" }}
              >
                SUNU
              </span>
              <span
                className="font-display font-extrabold tracking-tight text-[1rem]"
                style={{ color: isWhite ? "#FFA31A" : "#FF8C00" }}
              >
                MALL
              </span>
            </div>
          )}
          {showSlogan && (
            <span
              className="font-medium italic text-[10px] tracking-wide"
              style={{ color: isWhite ? "rgba(255,255,255,0.75)" : "#FF8C00" }}
            >
              {SUNU_MALL_SLOGAN}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
