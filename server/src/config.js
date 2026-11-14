import { existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { parseMailbox } from "./lib/mailbox.js";
import { serverRoot } from "./lib/paths.js";

export { serverRoot };

/** The placeholder domain used in the example files. Mail must never be sent to it. */
export const PLACEHOLDER_DOMAIN = "your-domain.com";

const DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173"];

/** Thrown when the environment is not usable. `problems` lists every issue so they can be fixed in one go. */
export class ConfigError extends Error {
  /** @param {string[]} problems */
  constructor(problems) {
    super(`Invalid server configuration:\n${problems.map((problem) => `  - ${problem}`).join("\n")}`);
    this.name = "ConfigError";
    this.problems = problems;
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().min(0).max(65535).default(8787),
  HOST: z.string().default("0.0.0.0"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "silent"]).optional(),
  TRUST_PROXY: z.string().default("false"),

  SITE_NAME: z.string().default("Web Smith Studio"),
  SITE_URL: z.url({ protocol: /^https?$/ }).default(`https://${PLACEHOLDER_DOMAIN}`),
  DEFAULT_LOCALE: z.enum(["en", "ka"]).default("en"),
  CORS_ORIGIN: z.string().optional(),

  MAIL_MODE: z.enum(["smtp", "preview"]).optional(),
  MAIL_TO: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  STUDIO_LOCALE: z.enum(["en", "ka"]).default("en"),
  TIMEZONE: z.string().default("UTC"),
  RESPONSE_TIME: z.string().optional(),
  RESPONSE_TIME_KA: z.string().optional(),
  AUTO_REPLY: z.stringbool().default(true),
  AUTO_REPLY_MAX_PER_EMAIL: z.coerce.number().int().min(1).max(50).default(3),
  AUTO_REPLY_WINDOW_HOURS: z.coerce.number().min(0.01).max(168).default(24),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  SMTP_SECURE: z.stringbool().optional(),
  SMTP_REQUIRE_TLS: z.stringbool().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(1000).default(5),
  RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().min(0.01).max(1440).default(15),

  SERVE_STATIC: z.enum(["auto", "true", "false"]).default("auto"),
  STATIC_DIR: z.string().default("../dist"),
  PREVIEW_DIR: z.string().default(".previews"),
});

/** Every setting the server understands. A test checks that .env.example documents each one. */
export const ENV_KEYS = Object.freeze(Object.keys(envSchema.shape));

function parseTrustProxy(value) {
  const text = value.trim();
  const lower = text.toLowerCase();
  if (lower === "" || lower === "false") return false;
  if (lower === "true") return true;
  if (/^\d+$/.test(text)) return Number(text);
  return text; // for example "loopback, 10.0.0.0/8"
}

function parseList(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isLoopback(host) {
  return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(host.toLowerCase());
}

function isValidTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads and checks the environment. Throws a ConfigError that lists everything that is wrong.
 * Pass a plain object instead of process.env to test it.
 *
 * @param {Record<string, string | undefined>} [env]
 */
export function loadConfig(env = process.env) {
  // A variable that is present but empty (`PORT=`) counts as not set.
  const cleaned = {};
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string" && value.trim() !== "") cleaned[key] = value;
  }

  const parsed = envSchema.safeParse(cleaned);
  if (!parsed.success) {
    throw new ConfigError(parsed.error.issues.map((issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`));
  }

  const e = parsed.data;
  const problems = [];
  const isProduction = e.NODE_ENV === "production";
  const siteOrigin = new URL(e.SITE_URL).origin;
  const siteName = e.SITE_NAME.trim();

  if (!isValidTimeZone(e.TIMEZONE)) {
    problems.push(`TIMEZONE: "${e.TIMEZONE}" is not a time zone name. Use a name such as "Asia/Tbilisi" or "UTC".`);
  }

  // ── Mail ────────────────────────────────────────────────────────────────────
  const smtpHost = e.SMTP_HOST?.trim();
  const mode = e.MAIL_MODE ?? (smtpHost ? "smtp" : "preview");

  if (mode === "smtp" && !smtpHost) {
    problems.push("SMTP_HOST: required when MAIL_MODE is smtp.");
  }
  if (mode === "preview" && isProduction) {
    problems.push(
      "MAIL_MODE: preview mode only writes files and never sends mail, so it cannot run in production. Set SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO and MAIL_FROM.",
    );
  }
  if (Boolean(e.SMTP_USER) !== Boolean(e.SMTP_PASS)) {
    problems.push("SMTP_USER and SMTP_PASS: set both or neither.");
  }

  const toEntries = parseList(e.MAIL_TO);
  const to = [];
  for (const entry of toEntries) {
    const mailbox = parseMailbox(entry);
    if (mailbox && !mailbox.name) to.push(mailbox.address);
    else problems.push(`MAIL_TO: "${entry}" is not a plain email address. Separate several addresses with commas.`);
  }
  if (toEntries.length === 0) {
    if (mode === "smtp") problems.push("MAIL_TO: required. This is the inbox that receives inquiries.");
    else to.push(`hello@${PLACEHOLDER_DOMAIN}`);
  }

  let from = { name: siteName, address: `no-reply@${PLACEHOLDER_DOMAIN}` };
  if (e.MAIL_FROM) {
    const mailbox = parseMailbox(e.MAIL_FROM);
    if (mailbox) from = { name: mailbox.name ?? siteName, address: mailbox.address };
    else problems.push(`MAIL_FROM: "${e.MAIL_FROM}" is not valid. Use an address like no-reply@example.com or "Studio <no-reply@example.com>".`);
  } else if (mode === "smtp") {
    problems.push("MAIL_FROM: required. Use an address your SMTP account is allowed to send from.");
  }

  if (mode === "smtp") {
    const placeholder = (address) => address.toLowerCase().endsWith(`@${PLACEHOLDER_DOMAIN}`);
    if (to.some(placeholder)) {
      problems.push(`MAIL_TO: still the example address on ${PLACEHOLDER_DOMAIN}. Put your real inbox here, or inquiries would go to a stranger.`);
    }
    if (placeholder(from.address)) {
      problems.push(`MAIL_FROM: still the example address on ${PLACEHOLDER_DOMAIN}. Use an address your SMTP account may send from.`);
    }
  }

  let smtp = null;
  if (mode === "smtp" && smtpHost) {
    const secure = e.SMTP_SECURE ?? e.SMTP_PORT === 465;
    smtp = {
      host: smtpHost,
      port: e.SMTP_PORT ?? (secure ? 465 : 587),
      secure,
      // On a plain connection, insist on the STARTTLS upgrade unless we are talking to this very machine.
      requireTLS: e.SMTP_REQUIRE_TLS ?? (!secure && !isLoopback(smtpHost)),
      user: e.SMTP_USER ?? null,
      pass: e.SMTP_PASS ?? null,
    };
  }

  // ── CORS ────────────────────────────────────────────────────────────────────
  const origins = new Set();
  const corsEntries = e.CORS_ORIGIN ? parseList(e.CORS_ORIGIN) : [siteOrigin, ...(isProduction ? [] : DEV_ORIGINS)];
  for (const entry of corsEntries) {
    try {
      const url = new URL(entry);
      if (!/^https?:$/.test(url.protocol)) throw new Error("not http");
      origins.add(url.origin);
    } catch {
      problems.push(`CORS_ORIGIN: "${entry}" is not a web address like https://example.com.`);
    }
  }

  // ── Static site ─────────────────────────────────────────────────────────────
  const staticDir = path.resolve(serverRoot, e.STATIC_DIR);
  const hasBuild = existsSync(path.join(staticDir, "index.html"));
  if (e.SERVE_STATIC === "true" && !hasBuild) {
    problems.push(`SERVE_STATIC: there is no build in ${staticDir}. Run "npm run build" in the project root first.`);
  }
  const staticEnabled = e.SERVE_STATIC === "true" ? true : e.SERVE_STATIC === "false" ? false : hasBuild;

  if (problems.length > 0) throw new ConfigError(problems);

  return Object.freeze({
    env: e.NODE_ENV,
    isProduction,
    port: e.PORT,
    host: e.HOST,
    logLevel: e.LOG_LEVEL ?? (e.NODE_ENV === "test" ? "silent" : "info"),
    trustProxy: parseTrustProxy(e.TRUST_PROXY),
    site: Object.freeze({
      name: siteName,
      url: siteOrigin,
      host: new URL(siteOrigin).host,
      defaultLocale: e.DEFAULT_LOCALE,
    }),
    cors: Object.freeze({ origins: [...origins] }),
    rateLimit: Object.freeze({
      windowMs: Math.round(e.RATE_LIMIT_WINDOW_MINUTES * 60_000),
      max: e.RATE_LIMIT_MAX,
    }),
    mail: Object.freeze({
      mode,
      to,
      from,
      studioLocale: e.STUDIO_LOCALE,
      timezone: e.TIMEZONE,
      responseTime: Object.freeze({
        en: e.RESPONSE_TIME?.trim() || "within one business day",
        ka: e.RESPONSE_TIME_KA?.trim() || "ერთი სამუშაო დღის განმავლობაში",
      }),
      autoReply: Object.freeze({
        enabled: e.AUTO_REPLY,
        maxPerEmail: e.AUTO_REPLY_MAX_PER_EMAIL,
        windowMs: Math.round(e.AUTO_REPLY_WINDOW_HOURS * 3_600_000),
      }),
      smtp: smtp ? Object.freeze(smtp) : null,
      previewDir: path.resolve(serverRoot, e.PREVIEW_DIR),
    }),
    static: Object.freeze({ enabled: staticEnabled, dir: staticDir }),
  });
}
