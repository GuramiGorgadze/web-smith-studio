import { clsx } from "clsx";

/** Join conditional class names (shadcn-style helper, CSS Modules friendly). */
export function cn(...inputs) {
  return clsx(inputs);
}
