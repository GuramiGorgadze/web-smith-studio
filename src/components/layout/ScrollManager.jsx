import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { scrollToId, scrollToTop } from "@/lib/scroll";

/**
 * Handles scrolling and focus on navigation:
 * - `/#section` links scroll to the section (waiting for lazy routes to mount),
 * - new pages start at the top,
 * - keyboard and screen-reader users get focus moved to <main> after a route change.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(pathname);
  const firstRender = useRef(true);

  useEffect(() => {
    const pathChanged = previousPath.current !== pathname;
    previousPath.current = pathname;

    if (hash) {
      scrollToId(decodeURIComponent(hash.slice(1)), { behavior: pathChanged || firstRender.current ? "auto" : "smooth" });
    } else if (navigationType !== "POP" || pathChanged) {
      scrollToTop();
    }

    if (!firstRender.current && pathChanged && !hash) {
      document.getElementById("main")?.focus({ preventScroll: true });
    }

    firstRender.current = false;
  }, [pathname, hash, key, navigationType]);

  return null;
}
