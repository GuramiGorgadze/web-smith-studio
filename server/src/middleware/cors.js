import cors from "cors";

/**
 * Lets the website call the API from the addresses listed in CORS_ORIGIN.
 * Requests without an Origin header (same-site pages, curl, server to server) are always fine.
 * Other websites get no CORS headers, so browsers refuse to hand them a response.
 */
export function createCors(config) {
  const allowed = new Set(config.cors.origins);

  return cors({
    origin: (origin, callback) => callback(null, !origin || allowed.has(origin)),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    maxAge: 600,
  });
}
