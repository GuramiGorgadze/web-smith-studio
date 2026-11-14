import helmet from "helmet";

/**
 * Security headers. The website's HTML contains one small inline script (it applies the saved theme and the page
 * language before the page paints), so the Content-Security-Policy allows exactly that script by its hash, and nothing else inline.
 *
 * @param {{ config: any, scriptHashes?: string[] }} options
 */
export function createSecurity({ config, scriptHashes = [] }) {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", ...scriptHashes],
        "frame-ancestors": ["'none'"],
        // Only force https when the site really runs on https. On http://localhost it would break loading.
        "upgrade-insecure-requests": config.isProduction ? [] : null,
      },
    },
    strictTransportSecurity: { maxAge: 15_552_000, includeSubDomains: false },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });
}
