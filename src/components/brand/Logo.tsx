import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: "color" | "white" | "navy";
  showWordmark?: boolean;
}

/**
 * SUNU MALL logo — a stylised "S" formed as a shopping bag on wheels,
 * with the outline of Africa nested inside and speed lines trailing behind.
 */
export function Logo({ className, size = 40, variant = "color", showWordmark = true }: LogoProps) {
  const navy = variant === "white" ? "#FFFFFF" : "#0A163A";
  const orange = variant === "white" ? "#FFFFFF" : "#FF8C00";
  const orangeDark = variant === "white" ? "#FFFFFF" : "#F26A00";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SUNU MALL"
      >
        {/* Speed lines */}
        <path d="M4 22h10" stroke={orange} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M2 30h8" stroke={orange} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <path d="M4 38h10" stroke={orange} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

        {/* Shopping-bag S body */}
        <path
          d="M46 14H24c-3 0-5 2-5 5v3h30c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5H19c-1.7 0-3 1.3-3 3v9c0 4 3 7 7 7h20c4 0 7-3 7-7V21c0-4-3-7-7-7Z"
          fill={navy}
        />
        {/* Bag handle */}
        <path
          d="M28 14v-2a6 6 0 0 1 12 0v2"
          stroke={orange}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Africa silhouette inside */}
        <path
          d="M31 26c-1.5 1-2.5 2.5-2.5 4.5 0 1.8 1 3 1.5 4.2.6 1.3.4 2.6-.2 3.5-.5.8-.3 2 .8 2.4 1.2.4 2.3-.3 3.2-1 .9-.6 1.6-.4 2.4 0 .9.5 2 .2 2.5-.7.4-.8-.1-1.7.2-2.6.4-1.1 1.6-1.6 2-2.7.5-1.4-.2-2.6-.8-3.6-.5-.9-1.2-1.8-2.4-2.4-1.6-.8-3.6-1.3-4.5-1.5-.8-.2-1.4 0-2.2-.1Z"
          fill={orange}
        />
        {/* Wheels */}
        <circle cx="26" cy="52" r="4.5" fill={navy} />
        <circle cx="26" cy="52" r="1.7" fill={orangeDark} />
        <circle cx="44" cy="52" r="4.5" fill={navy} />
        <circle cx="44" cy="52" r="1.7" fill={orangeDark} />
      </svg>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className="font-display font-extrabold tracking-tight text-[0.95rem]"
            style={{ color: variant === "white" ? "#FFFFFF" : "#0A163A" }}
          >
            SUNU
          </span>
          <span
            className="font-display font-extrabold tracking-tight text-[0.95rem]"
            style={{ color: variant === "white" ? "#FFA31A" : "#FF8C00" }}
          >
            MALL
          </span>
        </div>
      )}
    </div>
  );
}
