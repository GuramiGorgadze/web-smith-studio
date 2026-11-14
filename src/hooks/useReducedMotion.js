import { useMediaQuery } from "@/hooks/useMediaQuery";

/** True when the visitor asked their system for less motion. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
