import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { createLogger } from "../src/lib/logger.js";
import { sampleInquiries } from "../src/mail/sampleInquiries.js";
import { testConfig } from "./helpers/config.js";
import { createFakeMailer } from "./helpers/fakeMailer.js";
import { postContact, startApp } from "./helpers/server.js";

const running = [];

/** Starts the real app with a fake mailer. Everything it starts is stopped after each test. */
async function launch(env = {}, { logger } = {}) {
  const mailer = createFakeMailer();
  const config = testConfig({ RATE_LIMIT_MAX: "100", ...env });
  const app = await startApp({ config, mailer, logger });
  running.push(app);
  return { mailer, config, ...app };
}

/** A logger that keeps every line it is given. */
function capturingLogger() {
  const lines = [];
  return { lines, logger: createLogger({ level: "debug", json: true, write: (line) => lines.push(line) }) };
}

afterEach(async () => {
  await Promise.all(running.splice(0).map((app) => app.close()));
});

describe("GET /api/health", () => {
  it("reports that the server is up and how mail is set up", async () => {
    const { baseUrl } = await launch();
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, mail: { mode: "smtp", verified: true } });
    assert.equal(response.headers.get("cache-control"), "no-store");
  });
});

describe("POST /api/contact", () => {
  it("delivers a valid inquiry to the studio and confirms to the visitor", async () => {
    const { baseUrl, mailer, service } = await launch();
    const { status, json } = await postContact(baseUrl, sampleInquiries.estimateEn);

    assert.equal(status, 200);
    assert.equal(json.ok, true);
    assert.match(json.id, /^[0-9a-f]{8}$/);

    await service.idle();
    assert.equal(mailer.sent.length, 2);

    const [notification, confirmation] = mailer.sent;
    assert.equal(notification.meta.kind, "notification");
    assert.deepEqual(notification.message.to, ["inbox@studio.example.test"]);
    assert.deepEqual(notification.message.from, { name: "Ana Smith via Web Smith Studio", address: "no-reply@studio.example.test" });
    assert.deepEqual(notification.message.replyTo, { name: "Ana Smith", address: "ana@harborpine.example" });
    assert.equal(notification.message.subject, "[ASAP] New inquiry from Ana Smith: Business website");
    assert.equal(notification.message.priority, "high");
    assert.equal(notification.message.headers["X-Inquiry-Id"], json.id);
    assert.deepEqual(notification.message.attachments.map((attachment) => attachment.cid), ["wss-logo"]);

    assert.equal(confirmation.meta.kind, "auto-reply");
    assert.equal(confirmation.message.to, "ana@harborpine.example");
    assert.equal(confirmation.message.replyTo, "inbox@studio.example.test");
    assert.deepEqual(confirmation.message.from, { name: "Web Smith Studio", address: "no-reply@studio.example.test" });
    assert.equal(confirmation.message.subject, "We got your message | Web Smith Studio");
    assert.equal(confirmation.message.headers["Auto-Submitted"], "auto-replied");
    assert.equal(confirmation.message.headers["X-Auto-Response-Suppress"], "All");
    assert.equal(confirmation.message.headers["X-Inquiry-Id"], json.id);
    assert.deepEqual(confirmation.message.attachments.map((attachment) => attachment.cid), ["wss-logo", "wss-check"]);
  });

  it("uses normal priority for a relaxed inquiry", async () => {
    const { baseUrl, mailer } = await launch();
    await postContact(baseUrl, sampleInquiries.simpleEn);
    assert.equal(mailer.sent[0].message.priority, "normal");
    assert.equal(mailer.sent[0].message.subject, "New inquiry from Daniel Brooks: Landing page");
  });

  it("answers a Georgian visitor in Georgian", async () => {
    const { baseUrl, mailer, service } = await launch();
    const { status } = await postContact(baseUrl, sampleInquiries.georgian);
    assert.equal(status, 200);
    await service.idle();
    assert.equal(mailer.sent[1].message.subject, "თქვენი შეტყობინება მივიღეთ | Web Smith Studio");
    assert.ok(mailer.sent[1].message.html.includes("https://studio.example.test/ka/work"));
  });

  it("answers 422 with the fields to fix, and sends nothing", async () => {
    const { baseUrl, mailer, service } = await launch();
    const { status, json } = await postContact(baseUrl, { name: "", email: "nope", message: "short" });

    assert.equal(status, 422);
    assert.equal(json.ok, false);
    assert.equal(json.error.code, "validation_failed");
    assert.deepEqual(Object.keys(json.error.fields).sort(), ["email", "message", "name"]);

    await service.idle();
    assert.equal(mailer.sent.length, 0);
  });

  it("answers 422 for an empty request, an array and a missing Content-Type", async () => {
    const { baseUrl } = await launch();
    assert.equal((await postContact(baseUrl, {})).status, 422);
    assert.equal((await postContact(baseUrl, [])).status, 422);
    assert.equal((await fetch(`${baseUrl}/api/contact`, { method: "POST" })).status, 422);
  });

  it("drops a filled honeypot quietly and tells the bot it worked", async () => {
    const { baseUrl, mailer, service } = await launch();
    const { status, json } = await postContact(baseUrl, { ...sampleInquiries.simpleEn, website: "http://spam.example" });

    assert.equal(status, 200);
    assert.deepEqual(json, { ok: true });
    await service.idle();
    assert.equal(mailer.sent.length, 0);
  });

  it("treats a honeypot that only holds spaces as empty", async () => {
    const { baseUrl, mailer, service } = await launch();
    const { status, json } = await postContact(baseUrl, { ...sampleInquiries.simpleEn, website: "   " });
    assert.equal(status, 200);
    assert.ok(json.id);
    await service.idle();
    assert.equal(mailer.sent.length, 2);
  });

  it("answers 502 when the notification cannot be sent, without leaking the reason", async () => {
    const { logger, lines } = capturingLogger();
    const { baseUrl, mailer, service } = await launch({}, { logger });
    mailer.failNext(Object.assign(new Error("connect ECONNREFUSED 10.0.0.5:587"), { code: "ECONNECTION" }));

    const { status, json } = await postContact(baseUrl, sampleInquiries.simpleEn);
    assert.equal(status, 502);
    assert.equal(json.error.code, "delivery_failed");
    assert.ok(json.error.message.includes("inbox@studio.example.test"), "visitors are pointed to the studio address");
    assert.equal(JSON.stringify(json).includes("ECONNREFUSED"), false);
    assert.equal(JSON.stringify(json).includes("10.0.0.5"), false);

    await service.idle();
    assert.equal(mailer.sent.length, 0, "no confirmation for a message that was not delivered");
    assert.ok(lines.some((line) => JSON.parse(line).level === "error"), "the failure is logged for the owner");
  });

  it("still answers 200 when only the confirmation fails", async () => {
    const { logger, lines } = capturingLogger();
    const { baseUrl, mailer, service } = await launch({}, { logger });
    mailer.failKind("auto-reply", new Error("550 5.1.1 <daniel@example.com> mailbox unavailable"));

    const { status, json } = await postContact(baseUrl, sampleInquiries.simpleEn);
    assert.equal(status, 200);
    assert.ok(json.id);

    await service.idle();
    assert.equal(mailer.sent.length, 1);
    const warning = lines.map((line) => JSON.parse(line)).find((entry) => entry.message === "Confirmation could not be sent");
    assert.ok(warning, "the failed confirmation is logged");
    assert.equal(warning.reason.includes("daniel@example.com"), false, "the address in the error is masked");
    assert.ok(warning.reason.includes("d***@example.com"));
  });

  it("sends no confirmation when AUTO_REPLY is off", async () => {
    const { baseUrl, mailer, service } = await launch({ AUTO_REPLY: "false" });
    await postContact(baseUrl, sampleInquiries.simpleEn);
    await service.idle();
    assert.equal(mailer.sent.length, 1);
    assert.equal(mailer.sent[0].meta.kind, "notification");
  });

  it("limits confirmations per address, but still delivers every inquiry", async () => {
    const { baseUrl, mailer, service } = await launch({ AUTO_REPLY_MAX_PER_EMAIL: "2" });
    for (let index = 0; index < 3; index += 1) {
      const { status } = await postContact(baseUrl, sampleInquiries.simpleEn);
      assert.equal(status, 200);
    }
    await service.idle();

    const kinds = mailer.sent.map((entry) => entry.meta.kind);
    assert.equal(kinds.filter((kind) => kind === "notification").length, 3);
    assert.equal(kinds.filter((kind) => kind === "auto-reply").length, 2);
  });

  it("gives every inquiry its own reference", async () => {
    const { baseUrl, service } = await launch();
    const answers = await Promise.all(
      ["a", "b", "c", "d", "e"].map((letter) => postContact(baseUrl, { ...sampleInquiries.simpleEn, email: `${letter}@example.com` })),
    );
    await service.idle();
    assert.equal(new Set(answers.map((answer) => answer.json.id)).size, 5);
  });

  it("keeps visitor details out of the logs", async () => {
    const { logger, lines } = capturingLogger();
    const { baseUrl, service } = await launch({}, { logger });
    await postContact(baseUrl, sampleInquiries.estimateEn);
    await service.idle();

    const everything = lines.join("\n");
    assert.ok(everything.includes("Inquiry delivered"));
    assert.ok(everything.includes("a***@harborpine.example"));
    for (const secret of ["ana@harborpine.example", "Ana Smith", "Harbor", "Batumi", "Indicative range"]) {
      assert.equal(everything.includes(secret), false, `the logs must not contain "${secret}"`);
    }
  });

  it("limits how often one address can send, and says so in JSON", async () => {
    const { baseUrl, mailer } = await launch({ RATE_LIMIT_MAX: "2" });
    assert.equal((await postContact(baseUrl, sampleInquiries.simpleEn)).status, 200);
    assert.equal((await postContact(baseUrl, { name: "" })).status, 422, "failed attempts count too");

    const third = await postContact(baseUrl, sampleInquiries.simpleEn);
    assert.equal(third.status, 429);
    assert.equal(third.json.error.code, "rate_limited");
    assert.ok(third.headers.get("ratelimit-policy"));
    assert.equal(mailer.sent.filter((entry) => entry.meta.kind === "notification").length, 1);
  });

  it("uses the forwarded address for limits only when TRUST_PROXY is set", async () => {
    const send = (baseUrl, address) => postContact(baseUrl, sampleInquiries.simpleEn, { "X-Forwarded-For": address });

    const trusting = await launch({ RATE_LIMIT_MAX: "1", TRUST_PROXY: "1" });
    assert.equal((await send(trusting.baseUrl, "203.0.113.1")).status, 200);
    assert.equal((await send(trusting.baseUrl, "203.0.113.1")).status, 429);
    assert.equal((await send(trusting.baseUrl, "203.0.113.2")).status, 200, "another visitor has their own allowance");

    // Without TRUST_PROXY the header is ignored, so a visitor cannot dodge the limit by faking it.
    const quiet = mock.method(console, "error", () => {});
    try {
      const suspicious = await launch({ RATE_LIMIT_MAX: "1" });
      assert.equal((await send(suspicious.baseUrl, "203.0.113.1")).status, 200);
      assert.equal((await send(suspicious.baseUrl, "203.0.113.2")).status, 429);
    } finally {
      quiet.mock.restore();
    }
  });

  it("answers 400 for invalid JSON", async () => {
    const { baseUrl } = await launch();
    for (const body of ["{not json", "null", '"just a string"']) {
      const { status, json } = await postContact(baseUrl, body);
      assert.equal(status, 400, body);
      assert.equal(json.error.code, "invalid_json", body);
    }
  });

  it("answers 413 for a body over 32 KB", async () => {
    const { baseUrl } = await launch();
    const { status, json } = await postContact(baseUrl, JSON.stringify({ ...sampleInquiries.simpleEn, message: "x".repeat(40_000) }));
    assert.equal(status, 413);
    assert.equal(json.error.code, "payload_too_large");
  });

  it("answers 405 with an Allow header for other methods", async () => {
    const { baseUrl } = await launch();
    for (const method of ["GET", "PUT", "DELETE"]) {
      const response = await fetch(`${baseUrl}/api/contact`, { method });
      assert.equal(response.status, 405, method);
      assert.equal(response.headers.get("allow"), "POST, OPTIONS", method);
      assert.equal((await response.json()).error.code, "method_not_allowed", method);
    }
  });
});

describe("unknown addresses", () => {
  it("answers unknown API paths with JSON", async () => {
    const { baseUrl } = await launch();
    for (const method of ["GET", "POST"]) {
      const response = await fetch(`${baseUrl}/api/nothing-here`, { method });
      assert.equal(response.status, 404);
      assert.equal((await response.json()).error.code, "not_found");
    }
  });

  it("answers everything else with a plain 404 when the website is not served from here", async () => {
    const { baseUrl } = await launch();
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 404);
    assert.match(response.headers.get("content-type"), /text\/plain/);
    assert.equal(await response.text(), "Not found");
  });
});

describe("CORS", () => {
  const preflight = (baseUrl, origin) =>
    fetch(`${baseUrl}/api/contact`, {
      method: "OPTIONS",
      headers: { Origin: origin, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" },
    });

  it("lets the website's own origin call the API", async () => {
    const { baseUrl } = await launch();
    const response = await preflight(baseUrl, "https://studio.example.test");
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), "https://studio.example.test");
    assert.equal(response.headers.get("access-control-allow-methods"), "GET,POST,OPTIONS");
    assert.equal(response.headers.get("access-control-max-age"), "600");

    const real = await postContact(baseUrl, sampleInquiries.simpleEn, { Origin: "https://studio.example.test" });
    assert.equal(real.headers.get("access-control-allow-origin"), "https://studio.example.test");
  });

  it("allows the local development servers outside production", async () => {
    const { baseUrl } = await launch();
    assert.equal((await preflight(baseUrl, "http://localhost:5173")).headers.get("access-control-allow-origin"), "http://localhost:5173");
  });

  it("gives other websites no CORS headers, so browsers refuse to hand them the answer", async () => {
    const { baseUrl } = await launch();
    const response = await preflight(baseUrl, "https://evil.example");
    assert.equal(response.headers.get("access-control-allow-origin"), null);

    const real = await postContact(baseUrl, sampleInquiries.simpleEn, { Origin: "https://evil.example" });
    assert.equal(real.headers.get("access-control-allow-origin"), null);
  });

  it("only allows the site itself in production", async () => {
    const { baseUrl } = await launch({
      NODE_ENV: "production",
      MAIL_MODE: "smtp",
      SMTP_HOST: "smtp.example.test",
      SMTP_USER: "user",
      SMTP_PASS: "pass",
    });
    assert.equal((await preflight(baseUrl, "http://localhost:5173")).headers.get("access-control-allow-origin"), null);
    assert.equal((await preflight(baseUrl, "https://studio.example.test")).headers.get("access-control-allow-origin"), "https://studio.example.test");
  });
});

describe("security headers", () => {
  it("sets the usual protections and hides the framework", async () => {
    const { baseUrl } = await launch();
    const response = await fetch(`${baseUrl}/api/health`);
    const policy = response.headers.get("content-security-policy");

    assert.ok(policy.includes("frame-ancestors 'none'"));
    assert.ok(policy.includes("script-src 'self'"));
    assert.ok(policy.includes("object-src 'none'"));
    assert.equal(policy.includes("upgrade-insecure-requests"), false, "plain http must keep working in development");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    assert.ok(response.headers.get("strict-transport-security"));
    assert.equal(response.headers.get("x-powered-by"), null);
  });

  it("forces https in production", async () => {
    const { baseUrl } = await launch({
      NODE_ENV: "production",
      MAIL_MODE: "smtp",
      SMTP_HOST: "smtp.example.test",
      SMTP_USER: "user",
      SMTP_PASS: "pass",
    });
    const response = await fetch(`${baseUrl}/api/health`);
    assert.ok(response.headers.get("content-security-policy").includes("upgrade-insecure-requests"));
  });
});
