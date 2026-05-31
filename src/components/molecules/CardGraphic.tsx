import { cn } from "@/lib/utils";

type GraphicTone = "brand" | "secondary" | "success" | "danger";

const toneClass: Record<GraphicTone, string> = {
  brand: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  danger: "text-danger",
};

/**
 * Decorative flowing contour lines for the corner of a card. Purely cosmetic
 * (aria-hidden, pointer-events-none), the card's meaning never depends on it.
 * The parent must be `relative overflow-hidden`.
 */
export function CardGraphic({
  tone = "brand",
  className,
}: {
  tone?: GraphicTone;
  className?: string;
}) {
  // A handful of stacked, gently-waving lines fading as they descend.
  const lines = Array.from({ length: 7 }, (_, i) => {
    const y = 12 + i * 15;
    return {
      d: `M -8 ${y} C 48 ${y - 26}, 96 ${y + 24}, 150 ${y - 8} S 232 ${y + 16}, 248 ${y - 22}`,
      opacity: 0.55 - i * 0.06,
    };
  });

  return (
    <svg
      viewBox="0 0 240 140"
      fill="none"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-0 top-0 h-28 w-44 select-none",
        toneClass[tone],
        className,
      )}
    >
      {lines.map((line, i) => (
        <path
          key={i}
          d={line.d}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={line.opacity}
        />
      ))}
    </svg>
  );
}
