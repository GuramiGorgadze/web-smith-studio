import { rateLimit } from "express-rate-limit";

function tooMany(message) {
  return (request, response) => {
    response.status(429).json({ ok: false, error: { code: "rate_limited", message } });
  };
}

/**
 * Two limits per visitor address: a generous one for every API call, and a strict one for sending a message
 * (RATE_LIMIT_MAX per RATE_LIMIT_WINDOW_MINUTES). Behind a proxy or CDN, set TRUST_PROXY so the real visitor
 * address is used, otherwise everybody shares one counter.
 */
export function createLimiters(config) {
  return {
    api: rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      handler: tooMany("Too many requests. Please slow down."),
    }),
    contact: rateLimit({
      windowMs: config.rateLimit.windowMs,
      limit: config.rateLimit.max,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      handler: tooMany("Too many messages from your network. Please wait a little and try again."),
    }),
  };
}
