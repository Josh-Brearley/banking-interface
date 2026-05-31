import { cn } from "@/lib/utils";

const SOURCES = {
  full: "/logos/logo-icon-text.png",
  icon: "/logos/logo-icon.png",
} as const;

interface BrandLogoProps {
  variant?: "full" | "icon";
  /** When true the image is presentational (use alongside visible brand text). */
  decorative?: boolean;
  className?: string;
}

/** Eagle Bank brand mark. Centralises logo usage so it's swapped in one place. */
export function BrandLogo({
  variant = "full",
  decorative = false,
  className,
}: BrandLogoProps) {
  return (
    <img
      src={SOURCES[variant]}
      alt={decorative ? "" : "Eagle Bank"}
      className={cn("object-contain", className)}
      loading="eager"
      decoding="async"
    />
  );
}
