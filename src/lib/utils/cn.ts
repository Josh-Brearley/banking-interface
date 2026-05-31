import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge doesn't know our custom type ramp (`text-display`, `text-h1`,
 * `text-body`, …). Without this, it treats those names as text *colours* and
 * drops a real colour class that appears alongside them, e.g. a primary
 * Button's `text-primary-foreground` would be stripped by its `text-body`
 * size class, leaving dark text on a navy fill. Registering them as font-sizes
 * keeps size and colour in separate conflict groups.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["display", "h1", "h2", "h3", "body", "body-sm", "caption"],
        },
      ],
    },
  },
});

/** Compose conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
