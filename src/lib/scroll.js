/**
 * Scrolls to the element with the given id. The target may mount a moment after navigation
 * (lazy routes), so we retry for roughly one second before giving up.
 */
export function scrollToId(id, { behavior = "smooth", attempts = 40 } = {}) {
  let remaining = attempts;

  const tick = () => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior, block: "start" });
      return;
    }
    remaining -= 1;
    if (remaining > 0) window.setTimeout(tick, 25);
  };

  tick();
}

export function scrollToTop(behavior = "auto") {
  window.scrollTo({ top: 0, left: 0, behavior });
}
