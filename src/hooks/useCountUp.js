import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Animates a number from 0 to `target` once `active` becomes true.
 * With reduced motion the final value is shown immediately.
 */
export function useCountUp(target, { active = true, duration = 1400, decimals = 0 } = {}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    if (reduced) {
      setValue(target);
      return undefined;
    }

    let frame = 0;
    const start = performance.now();
    const factor = 10 ** decimals;

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 4;
      setValue(Math.round(target * eased * factor) / factor);
      if (progress < 1) frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [active, target, duration, decimals, reduced]);

  return value;
}
