import compression from "compression";
import express from "express";
import { createCors } from "./middleware/cors.js";
import { apiNotFound, errorHandler, notFound } from "./middleware/errors.js";
import { createLimiters } from "./middleware/rateLimit.js";
import { createSecurity } from "./middleware/security.js";
import { createStaticSite } from "./middleware/staticSite.js";
import { createContactRouter } from "./routes/contact.js";
import { createHealthRouter } from "./routes/health.js";

const noStore = (request, response, next) => {
  response.set("Cache-Control", "no-store");
  next();
};

/**
 * Builds the Express app. Everything it needs is passed in, so tests can hand it a fake mailer.
 *
 * @param {{ config: any, mailer: any, logger: any, service: { deliver: Function } }} dependencies
 */
export function createApp({ config, mailer, logger, service }) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);

  const site = config.static.enabled ? createStaticSite({ dir: config.static.dir }) : null;
  const limiters = createLimiters(config);

  app.use(createSecurity({ config, scriptHashes: site?.scriptHashes ?? [] }));
  app.use(compression());

  // The API: JSON in, JSON out, never cached.
  app.use("/api", noStore, limiters.api, createCors(config), express.json({ limit: "32kb" }));
  app.use("/api", createHealthRouter({ mailer }));
  app.use("/api", createContactRouter({ config, service, logger, limiter: limiters.contact }));
  app.use("/api", apiNotFound);

  // The website, when a build exists next to the server.
  if (site) app.use(site.router);

  app.use(notFound);
  app.use(errorHandler(logger));

  return app;
}
