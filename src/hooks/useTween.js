import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Smoothly animates a number toward `target` (starting from wherever it currently is).
 * With reduced motion the value follows the target immediately.
 */
export function useTween(target, { duration = 520 } = {}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (reduced || current.current === target) {
      current.current = target;
      setValue(target);
      return undefined;
    }

    const from = current.current;
    const start = performance.now();
    let frame = 0;

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      current.current = from + (target - from) * eased;
      setValue(current.current);
      if (progress < 1) frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [target, duration, reduced]);

  return value;
}
