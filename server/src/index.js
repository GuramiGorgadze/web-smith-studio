import { existsSync } from "node:fs";
import path from "node:path";
import { createApp } from "./app.js";
import { ConfigError, loadConfig } from "./config.js";
import { createLogger } from "./lib/logger.js";
import { serverRoot } from "./lib/paths.js";
import { maskEmailsIn } from "./lib/text.js";
import { createInquiryService } from "./mail/inquiryService.js";
import { createMailer } from "./mail/mailer.js";

// Settings come from the real environment first, then from server/.env when that file exists.
// Under NODE_ENV=test the file is never read, so running the tests can never send mail with your real account.
const envFile = path.join(serverRoot, ".env");
if (process.env.NODE_ENV !== "test" && existsSync(envFile)) process.loadEnvFile(envFile);

let config;
try {
  config = loadConfig();
} catch (error) {
  if (error instanceof ConfigError) {
    console.error(`\n${error.message}\n\nEvery setting is explained in server/.env.example.\n`);
    process.exit(1);
  }
  throw error;
}

const logger = createLogger({ level: config.logLevel, json: config.isProduction });
const mailer = createMailer({ config, logger });
const service = createInquiryService({ config, mailer, logger });
const app = createApp({ config, mailer, logger, service });

const server = app.listen(config.port, config.host, () => {
  const where = config.host === "0.0.0.0" || config.host === "::" ? "localhost" : config.host;
  logger.info(`${config.site.name} server is running on http://${where}:${config.port}`);

  if (config.mail.mode === "smtp") {
    const { smtp } = config.mail;
    logger.info(`Mail: sending through ${smtp.host}:${smtp.port}. Inquiries go to ${config.mail.to.join(", ")}.`);
  } else {
    logger.warn(`Mail: PREVIEW mode. Nothing is sent; emails are saved to ${config.mail.previewDir}. Set SMTP_HOST to send real mail.`);
  }

  logger.info(
    config.static.enabled
      ? `Website: serving ${config.static.dir}`
      : "Website: not served from here (run `npm run build` in the project root to serve it, or use the Vite dev server).",
  );

  mailer.verify().then(
    () => {
      if (config.mail.mode === "smtp") logger.info("Mail: the SMTP login works.");
    },
    (error) => logger.warn("Mail: could not log in to the SMTP server. Check SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER and SMTP_PASS.", { code: error?.code, reason: maskEmailsIn(error?.message) }),
  );
});

let closing = false;

function shutdown(signal) {
  if (closing) return;
  closing = true;
  logger.info(`${signal} received, finishing open requests`);

  server.close(async () => {
    await service.idle();
    mailer.close();
    process.exit(0);
  });
  server.closeIdleConnections?.();

  // Do not hang forever if a connection refuses to close.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason: reason instanceof Error ? reason.message : String(reason) });
});
