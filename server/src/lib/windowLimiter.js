/**
 * A tiny in-memory sliding-window counter: "allow at most `max` hits per `windowMs` for each key".
 * It stops one address from triggering a stream of confirmation emails.
 * State lives in memory, so it resets when the server restarts. That is fine for this purpose.
 *
 * @param {{ windowMs: number, max: number, maxKeys?: number, now?: () => number }} options
 */
export function createWindowLimiter({ windowMs, max, maxKeys = 5000, now = () => Date.now() }) {
  /** @type {Map<string, number[]>} */
  const hits = new Map();

  function prune(current) {
    for (const [key, times] of hits) {
      const recent = times.filter((time) => current - time < windowMs);
      if (recent.length === 0) hits.delete(key);
      else hits.set(key, recent);
    }
  }

  return {
    /** Records a hit and tells you whether it is within the limit. */
    take(key) {
      const current = now();
      if (hits.size >= maxKeys) prune(current);
      // Memory guard: when the table is full of recent keys, refuse new ones instead of growing.
      if (!hits.has(key) && hits.size >= maxKeys) return false;

      const recent = (hits.get(key) ?? []).filter((time) => current - time < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(current);
      hits.set(key, recent);
      return true;
    },

    /** How many keys are tracked right now (used by tests). */
    size: () => hits.size,
  };
}
