import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme adds text-xxs; without this it merges as a color and gets dropped.
const twMerge = extendTailwindMerge({ extend: { theme: { text: ["xxs"] } } });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
