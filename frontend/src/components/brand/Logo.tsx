import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Rendered height in px (width scales automatically — the original ratio is preserved). */
  size?: number;
  /** "white" tints the logo white for dark backgrounds (sidebars, navy panels). */
  variant?: "color" | "white" | "navy";
  /** Kept for API compatibility — the wordmark is already part of the original logo image. */
  showWordmark?: boolean;
  showSlogan?: boolean;
}

export const SUNU_MALL_SLOGAN = "Jënd ak jaay, bu yomb";

/**
 * SUNU MALL logo — the original transparent PNG is shown as-is, without
 * cropping, distortion or color change. On dark surfaces, `variant="white"`
 * tints it white so it stays visible.
 */
export function Logo({ className, size = 44, variant = "color" }: LogoProps) {
  const isWhite = variant === "white";
  return (
    <div className={cn("inline-flex items-center", className)} style={{ height: size }}>
      <img
        src="/logo.png"
        alt="SUNU MALL"
        style={{ height: size, width: "auto", filter: isWhite ? "brightness(0) invert(1)" : undefined }}
        className="object-contain select-none"
      />
    </div>
  );
}
