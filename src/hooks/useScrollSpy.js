import { useEffect, useState } from "react";

/**
 * Tracks which of several elements currently crosses the middle of the viewport.
 *
 * @param {React.RefObject<(HTMLElement | null)[]>} itemsRef  ref holding the observed elements
 * @param {number} count  how many items there are
 * @param {{ enabled?: boolean, onChange?: (index: number) => void, initial?: number }} options
 *   `initial` is the active index before anything has been scrolled into view (-1 for none).
 * @returns {[number, (index: number) => void]}  active index and a setter for manual selection
 */
export function useScrollSpy(itemsRef, count, { enabled = true, onChange, initial = 0 } = {}) {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return undefined;

    const nodes = itemsRef.current.slice(0, count).filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = nodes.indexOf(entry.target);
          if (index >= 0) {
            setActive(index);
            onChange?.(index);
          }
        });
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [itemsRef, count, enabled, onChange]);

  return [active, setActive];
}
