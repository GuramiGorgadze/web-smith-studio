// Sends one real test inquiry through your SMTP account, so you can confirm the settings in server/.env work.
//
//   npm run send:test                      the notification goes to MAIL_TO, the confirmation to the first MAIL_TO address
//   npm run send:test -- you@example.com   the confirmation goes to you@example.com
//   npm run send:test -- --ka              use the Georgian sample (Georgian confirmation)

import { existsSync } from "node:fs";
import path from "node:path";
import { ConfigError, loadConfig } from "../src/config.js";
import { parseInquiry } from "../src/lib/inquirySchema.js";
import { createLogger } from "../src/lib/logger.js";
import { serverRoot } from "../src/lib/paths.js";
import { createInquiryService } from "../src/mail/inquiryService.js";
import { createMailer } from "../src/mail/mailer.js";
import { sampleInquiries } from "../src/mail/sampleInquiries.js";

const envFile = path.join(serverRoot, ".env");
if (existsSync(envFile)) process.loadEnvFile(envFile);

let config;
try {
  config = loadConfig({ ...process.env, SERVE_STATIC: "false", AUTO_REPLY: "true", AUTO_REPLY_MAX_PER_EMAIL: "50" });
} catch (error) {
  if (error instanceof ConfigError) {
    console.error(`\n${error.message}\n`);
    process.exit(1);
  }
  throw error;
}

if (config.mail.mode !== "smtp") {
  console.error("Mail is in preview mode, so nothing can be sent. Fill in SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO and MAIL_FROM in server/.env first.");
  process.exit(1);
}

const args = process.argv.slice(2);
const georgian = args.includes("--ka");
const target = args.find((arg) => !arg.startsWith("--")) ?? config.mail.to[0];
const sample = { ...(georgian ? sampleInquiries.georgian : sampleInquiries.estimateEn), email: target };

const parsed = parseInquiry(sample);
if (!parsed.success) {
  console.error(`"${target}" is not a valid email address.`);
  process.exit(1);
}

const logger = createLogger({ level: "warn" });
const mailer = createMailer({ config, logger });

try {
  console.log(`Logging in to ${config.mail.smtp.host}:${config.mail.smtp.port} ...`);
  await mailer.verify();
  console.log("The SMTP login works.");

  const service = createInquiryService({ config, mailer, logger });
  const { id } = await service.deliver(parsed.data);
  await service.idle();

  console.log(`Sent. Notification to ${config.mail.to.join(", ")}, confirmation to ${target}. Reference ${id}.`);
  console.log("Check the inboxes (and the spam folders the first time).");
} catch (error) {
  console.error(`\nCould not send: ${error?.message ?? error}`);
  if (error?.code === "EAUTH") console.error("The server refused the login. Check SMTP_USER and SMTP_PASS (Gmail needs an app password, not your normal password).");
  process.exitCode = 1;
} finally {
  mailer.close();
}
