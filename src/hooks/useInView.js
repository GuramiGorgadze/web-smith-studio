import { useEffect, useRef, useState } from "react";

/**
 * Reports when an element enters the viewport.
 *
 * @param {{ once?: boolean, rootMargin?: string, threshold?: number }} options
 * @returns {[React.RefObject<HTMLElement | null>, boolean]}
 */
export function useInView({ once = true, rootMargin = "0px 0px -12% 0px", threshold = 0.1 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView];
}
