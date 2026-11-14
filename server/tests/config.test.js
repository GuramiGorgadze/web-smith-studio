import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { parseEnv } from "node:util";
import { ConfigError, ENV_KEYS, loadConfig } from "../src/config.js";

const smtpEnv = {
  SMTP_HOST: "smtp.example.test",
  SMTP_USER: "user",
  SMTP_PASS: "pass",
  MAIL_TO: "inbox@studio.example.test",
  MAIL_FROM: "Studio <no-reply@studio.example.test>",
  SERVE_STATIC: "false",
};

function problemsFor(env) {
  try {
    loadConfig(env);
  } catch (error) {
    assert.ok(error instanceof ConfigError, `expected a ConfigError, got ${error}`);
    return error.problems;
  }
  assert.fail("expected loadConfig to throw");
}

describe("loadConfig defaults", () => {
  it("works with an empty environment and previews mail instead of sending it", () => {
    const config = loadConfig({ SERVE_STATIC: "false" });
    assert.equal(config.env, "development");
    assert.equal(config.port, 8787);
    assert.equal(config.mail.mode, "preview");
    assert.equal(config.mail.smtp, null);
    assert.deepEqual(config.mail.to, ["hello@your-domain.com"]);
    assert.equal(config.site.url, "https://your-domain.com");
    assert.equal(config.site.defaultLocale, "en");
    assert.equal(config.trustProxy, false);
    assert.equal(config.rateLimit.max, 5);
    assert.equal(config.rateLimit.windowMs, 15 * 60_000);
    assert.equal(config.mail.autoReply.enabled, true);
    assert.equal(config.mail.responseTime.en, "within one business day");
  });

  it("allows the local development origins as well as the site", () => {
    const { origins } = loadConfig({ SERVE_STATIC: "false" }).cors;
    assert.ok(origins.includes("https://your-domain.com"));
    assert.ok(origins.includes("http://localhost:5173"));
  });

  it("treats empty values as not set", () => {
    const config = loadConfig({ PORT: "", MAIL_TO: "  ", SERVE_STATIC: "false" });
    assert.equal(config.port, 8787);
  });

  it("normalizes the site address to its origin", () => {
    const config = loadConfig({ SITE_URL: "https://studio.example.test/some/path/", SERVE_STATIC: "false" });
    assert.equal(config.site.url, "https://studio.example.test");
    assert.equal(config.site.host, "studio.example.test");
  });

  it("reads rate limits, proxy trust and the response time", () => {
    const config = loadConfig({
      SERVE_STATIC: "false",
      RATE_LIMIT_MAX: "9",
      RATE_LIMIT_WINDOW_MINUTES: "30",
      TRUST_PROXY: "1",
      RESPONSE_TIME: "within 24 hours",
    });
    assert.equal(config.rateLimit.max, 9);
    assert.equal(config.rateLimit.windowMs, 30 * 60_000);
    assert.equal(config.trustProxy, 1);
    assert.equal(config.mail.responseTime.en, "within 24 hours");
  });

  it("parses the different shapes of TRUST_PROXY", () => {
    assert.equal(loadConfig({ SERVE_STATIC: "false", TRUST_PROXY: "true" }).trustProxy, true);
    assert.equal(loadConfig({ SERVE_STATIC: "false", TRUST_PROXY: "false" }).trustProxy, false);
    assert.equal(loadConfig({ SERVE_STATIC: "false", TRUST_PROXY: "loopback, 10.0.0.0/8" }).trustProxy, "loopback, 10.0.0.0/8");
  });
});

describe("loadConfig with SMTP", () => {
  it("switches to smtp mode when SMTP_HOST is set and derives sensible defaults", () => {
    const config = loadConfig(smtpEnv);
    assert.equal(config.mail.mode, "smtp");
    assert.deepEqual(config.mail.smtp, { host: "smtp.example.test", port: 587, secure: false, requireTLS: true, user: "user", pass: "pass" });
    assert.deepEqual(config.mail.from, { name: "Studio", address: "no-reply@studio.example.test" });
  });

  it("uses a secure connection on port 465", () => {
    const { smtp } = loadConfig({ ...smtpEnv, SMTP_PORT: "465" }).mail;
    assert.equal(smtp.secure, true);
    assert.equal(smtp.requireTLS, false);
  });

  it("does not insist on TLS when talking to this very machine", () => {
    assert.equal(loadConfig({ ...smtpEnv, SMTP_HOST: "127.0.0.1" }).mail.smtp.requireTLS, false);
  });

  it("accepts several recipients", () => {
    const config = loadConfig({ ...smtpEnv, MAIL_TO: "a@studio.example.test, b@studio.example.test" });
    assert.deepEqual(config.mail.to, ["a@studio.example.test", "b@studio.example.test"]);
  });

  it("fills in the studio name when MAIL_FROM is a bare address", () => {
    const config = loadConfig({ ...smtpEnv, MAIL_FROM: "no-reply@studio.example.test" });
    assert.deepEqual(config.mail.from, { name: "Web Smith Studio", address: "no-reply@studio.example.test" });
  });

  it("lists every missing setting at once", () => {
    const problems = problemsFor({ SMTP_HOST: "smtp.example.test", SERVE_STATIC: "false" });
    assert.ok(problems.some((problem) => problem.startsWith("MAIL_TO")));
    assert.ok(problems.some((problem) => problem.startsWith("MAIL_FROM")));
  });

  it("refuses the example addresses so mail never goes to a stranger", () => {
    const problems = problemsFor({ ...smtpEnv, MAIL_TO: "hello@your-domain.com", MAIL_FROM: "no-reply@your-domain.com" });
    assert.equal(problems.filter((problem) => problem.includes("your-domain.com")).length, 2);
  });

  it("wants SMTP_USER and SMTP_PASS together", () => {
    const problems = problemsFor({ ...smtpEnv, SMTP_PASS: undefined });
    assert.ok(problems.some((problem) => problem.includes("SMTP_USER and SMTP_PASS")));
  });

  it("rejects MAIL_MODE=smtp without a host", () => {
    const problems = problemsFor({ MAIL_MODE: "smtp", MAIL_TO: "a@studio.example.test", MAIL_FROM: "b@studio.example.test", SERVE_STATIC: "false" });
    assert.ok(problems.some((problem) => problem.startsWith("SMTP_HOST")));
  });
});

describe("loadConfig in production", () => {
  it("refuses preview mode, which would silently drop every inquiry", () => {
    const problems = problemsFor({ NODE_ENV: "production", SERVE_STATIC: "false" });
    assert.ok(problems.some((problem) => problem.includes("preview mode")));
  });

  it("only allows the site's own origin by default", () => {
    const config = loadConfig({ ...smtpEnv, NODE_ENV: "production", SITE_URL: "https://studio.example.test" });
    assert.deepEqual(config.cors.origins, ["https://studio.example.test"]);
  });

  it("uses the explicit CORS_ORIGIN list", () => {
    const config = loadConfig({ ...smtpEnv, CORS_ORIGIN: "https://a.example.test, https://www.a.example.test/" });
    assert.deepEqual(config.cors.origins, ["https://a.example.test", "https://www.a.example.test"]);
  });
});

describe(".env.example", () => {
  const text = readFileSync(new URL("../.env.example", import.meta.url), "utf8");

  it("works as it is: copied to .env it starts in preview mode", () => {
    const config = loadConfig({ ...parseEnv(text), SERVE_STATIC: "false" });
    assert.equal(config.mail.mode, "preview");
    assert.equal(config.mail.timezone, "Asia/Tbilisi");
    assert.equal(config.mail.responseTime.ka, "ერთი სამუშაო დღის განმავლობაში");
    assert.equal(config.site.defaultLocale, "en");
  });

  it("is stopped from sending real mail until the example addresses are replaced", () => {
    const problems = problemsFor({ ...parseEnv(text), SMTP_HOST: "smtp.example.test", SERVE_STATIC: "false" });
    assert.ok(problems.some((problem) => problem.startsWith("MAIL_TO")));
    assert.ok(problems.some((problem) => problem.startsWith("MAIL_FROM")));
  });

  it("documents every setting the server understands", () => {
    for (const key of ENV_KEYS) {
      assert.match(text, new RegExp(`^#?\\s*${key}=`, "m"), `${key} is missing from .env.example`);
    }
  });
});

describe("loadConfig validation", () => {
  it("rejects a bad time zone, a bad address and a bad origin", () => {
    const problems = problemsFor({ SERVE_STATIC: "false", TIMEZONE: "Mars/Olympus", MAIL_TO: "not an email", CORS_ORIGIN: "ftp://x.test" });
    assert.ok(problems.some((problem) => problem.startsWith("TIMEZONE")));
    assert.ok(problems.some((problem) => problem.startsWith("MAIL_TO")));
    assert.ok(problems.some((problem) => problem.startsWith("CORS_ORIGIN")));
  });

  it("rejects values of the wrong kind", () => {
    const problems = problemsFor({ SERVE_STATIC: "false", PORT: "abc", SITE_URL: "not a url" });
    assert.ok(problems.some((problem) => problem.startsWith("PORT")));
    assert.ok(problems.some((problem) => problem.startsWith("SITE_URL")));
  });

  it("asks for a build when static serving is forced without one", () => {
    const problems = problemsFor({ SERVE_STATIC: "true", STATIC_DIR: "/definitely/not/here" });
    assert.ok(problems.some((problem) => problem.startsWith("SERVE_STATIC")));
  });
});
