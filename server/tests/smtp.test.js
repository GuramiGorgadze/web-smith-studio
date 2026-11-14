import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { parseInquiry } from "../src/lib/inquirySchema.js";
import { createLogger } from "../src/lib/logger.js";
import { createInquiryService } from "../src/mail/inquiryService.js";
import { createMailer, isTransient } from "../src/mail/mailer.js";
import { sampleInquiries } from "../src/mail/sampleInquiries.js";
import { testConfig } from "./helpers/config.js";
import { postContact, startApp } from "./helpers/server.js";
import { startSmtpSink } from "./helpers/smtpSink.js";

// These tests talk to a real SMTP server (a small one that runs inside the test), so they prove what
// Nodemailer really puts on the wire: headers, encodings, attachments, logins, retries and refusals.

const silent = createLogger({ level: "silent" });
const sinks = [];
const mailers = [];
const apps = [];

async function startSink(options) {
  const sink = await startSmtpSink(options);
  sinks.push(sink);
  return sink;
}

/** A mailer pointed at a sink. `delays` records every pause between attempts instead of waiting for it. */
function connect(port, env = {}) {
  const delays = [];
  const config = testConfig({
    MAIL_MODE: "smtp",
    SMTP_HOST: "127.0.0.1",
    SMTP_PORT: String(port),
    SMTP_USER: "mailer",
    SMTP_PASS: "secret",
    ...env,
  });
  const mailer = createMailer({ config, logger: silent, sleep: async (milliseconds) => void delays.push(milliseconds) });
  mailers.push(mailer);
  return { config, mailer, delays };
}

const plainMessage = {
  from: { name: "Web Smith Studio", address: "no-reply@studio.example.test" },
  to: "inbox@studio.example.test",
  subject: "Hello",
  text: "Hello there",
};

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
  for (const mailer of mailers.splice(0)) mailer.close();
  await Promise.all(sinks.splice(0).map((sink) => sink.close()));
});

describe("delivery over SMTP", () => {
  it("sends the notification and then the confirmation, with the right headers, parts and images", async () => {
    const sink = await startSink({ requireAuth: true });
    const { config, mailer } = connect(sink.port);
    const service = createInquiryService({ config, mailer, logger: silent });

    const { id } = await service.deliver(parseInquiry(sampleInquiries.estimateEn).data);
    await service.idle();
    assert.equal(sink.received.length, 2);

    const [first, second] = sink.received;

    // The envelope is what mail servers use for routing, whatever the headers say.
    assert.equal(first.envelope.mailFrom.address, "no-reply@studio.example.test");
    assert.deepEqual(
      first.envelope.rcptTo.map((recipient) => recipient.address),
      ["inbox@studio.example.test"],
    );

    // 1. The notification for the studio.
    const notification = first.mail;
    assert.equal(notification.subject, "[ASAP] New inquiry from Ana Smith: Business website");
    assert.equal(notification.from.value[0].address, "no-reply@studio.example.test");
    assert.equal(notification.from.value[0].name, "Ana Smith via Web Smith Studio");
    assert.equal(notification.to.value[0].address, "inbox@studio.example.test");
    assert.equal(notification.replyTo.value[0].address, "ana@harborpine.example");
    assert.equal(notification.replyTo.value[0].name, "Ana Smith");
    assert.equal(notification.headers.get("priority"), "high", "an ASAP inquiry is marked important (X-Priority and Importance)");
    assert.equal(notification.headers.get("x-inquiry-id"), id);
    assert.ok(notification.text.includes("Could we have a call this week?"), "a plain-text part is included");
    assert.ok(notification.html.includes("Harbor &amp; Pine Café"), "an HTML part is included");
    assert.ok(notification.html.includes("cid:wss-logo"));
    assert.equal(notification.attachments.length, 1);
    assert.equal(notification.attachments[0].cid, "wss-logo");
    assert.equal(notification.attachments[0].contentType, "image/png");
    assert.equal(notification.attachments[0].contentDisposition, "inline");
    assert.equal(notification.attachments[0].related, true);

    // 2. The confirmation for the visitor.
    const confirmation = second.mail;
    assert.deepEqual(
      second.envelope.rcptTo.map((recipient) => recipient.address),
      ["ana@harborpine.example"],
    );
    assert.equal(confirmation.subject, "We got your message | Web Smith Studio");
    assert.equal(confirmation.to.value[0].address, "ana@harborpine.example");
    assert.equal(confirmation.replyTo.value[0].address, "inbox@studio.example.test");
    assert.equal(confirmation.headers.has("priority"), false, "a confirmation is never marked important");
    assert.equal(confirmation.headers.get("auto-submitted"), "auto-replied");
    assert.equal(confirmation.headers.get("x-auto-response-suppress"), "All");
    assert.ok(confirmation.html.includes("cid:wss-check"));
    assert.deepEqual(confirmation.attachments.map((attachment) => attachment.cid).sort(), ["wss-check", "wss-logo"]);
    assert.equal(confirmation.text.includes("Harbor"), false, "the confirmation repeats nothing the visitor typed");
  });

  it("keeps Georgian text intact on the wire, in subjects, names and bodies", async () => {
    const sink = await startSink();
    const { config, mailer } = connect(sink.port, { STUDIO_LOCALE: "ka" });
    const service = createInquiryService({ config, mailer, logger: silent });

    await service.deliver(parseInquiry(sampleInquiries.georgian).data);
    await service.idle();

    const [notification, confirmation] = sink.received.map((entry) => entry.mail);
    assert.equal(notification.subject, "ახალი მოთხოვნა: ნინო გელაშვილი · ლენდინგ გვერდი");
    assert.equal(notification.from.value[0].name, "ნინო გელაშვილი via Web Smith Studio");
    assert.equal(notification.replyTo.value[0].name, "ნინო გელაშვილი");
    assert.ok(notification.text.includes("გამარჯობა! თბილისში იოგას სტუდიას ვხსნი"));
    assert.ok(notification.html.includes('lang="ka"'));
    assert.equal(confirmation.subject, "თქვენი შეტყობინება მივიღეთ | Web Smith Studio");
    assert.ok(confirmation.html.includes("გმადლობთ, ნინო."));
  });

  it("sends to several studio addresses at once", async () => {
    const sink = await startSink();
    const { config, mailer } = connect(sink.port, { MAIL_TO: "one@studio.example.test, two@studio.example.test" });
    const service = createInquiryService({ config, mailer, logger: silent });

    await service.deliver(parseInquiry(sampleInquiries.simpleEn).data);
    await service.idle();

    assert.deepEqual(
      sink.received[0].envelope.rcptTo.map((recipient) => recipient.address).sort(),
      ["one@studio.example.test", "two@studio.example.test"],
    );
    assert.equal(sink.received[1].mail.replyTo.value[0].address, "one@studio.example.test", "visitors reply to the first address");
  });

  it("shows a hostile name as plain text and never as a second address", async () => {
    const sink = await startSink();
    const { config, mailer } = connect(sink.port);
    const service = createInquiryService({ config, mailer, logger: silent });

    await service.deliver(parseInquiry({ ...sampleInquiries.simpleEn, name: "Boss <ceo@bank.example> Brooks" }).data);
    await service.idle();

    const { from, replyTo } = sink.received[0].mail;
    assert.equal(from.value.length, 1, "exactly one sender address");
    assert.equal(from.value[0].address, "no-reply@studio.example.test");
    assert.equal(replyTo.value.length, 1, "exactly one reply address");
    assert.equal(replyTo.value[0].address, "daniel@example.com");
    assert.equal(from.value[0].name.includes("<"), false);
    assert.equal(from.value[0].name.includes("@"), false);
  });

  it("refuses header injection attempts in names and subjects", async () => {
    const sink = await startSink();
    const { config, mailer } = connect(sink.port);
    const service = createInquiryService({ config, mailer, logger: silent });

    await service.deliver(parseInquiry({ ...sampleInquiries.simpleEn, name: "Daniel\r\nBcc: evil@example.com", projectType: "x\r\nBcc: evil@example.com", ids: undefined }).data);
    await service.idle();

    const { mail, envelope } = sink.received[0];
    assert.equal(mail.headers.has("bcc"), false);
    assert.deepEqual(
      envelope.rcptTo.map((recipient) => recipient.address),
      ["inbox@studio.example.test"],
    );
    assert.doesNotMatch(mail.subject, /[\r\n]/);
  });
});

describe("SMTP login", () => {
  it("accepts the right password", async () => {
    const sink = await startSink({ requireAuth: true });
    const { mailer } = connect(sink.port);
    assert.equal(mailer.status().verified, null, "unknown until checked");
    assert.equal(await mailer.verify(), true);
    assert.equal(mailer.status().verified, true);
  });

  it("fails with EAUTH for a wrong password, and does not try again", async () => {
    const sink = await startSink({ requireAuth: true });
    const { mailer, delays } = connect(sink.port, { SMTP_PASS: "wrong" });

    await assert.rejects(mailer.verify(), (error) => error.code === "EAUTH");
    assert.equal(mailer.status().verified, false);

    await assert.rejects(mailer.send(plainMessage), (error) => error.code === "EAUTH" && !isTransient(error));
    assert.equal(sink.authAttempts(), 2, "one login for verify, one for send, no retry");
    assert.deepEqual(delays, []);
    assert.equal(sink.received.length, 0);
  });
});

describe("retries and refusals", () => {
  it("tries once more after a 'try again later' answer and then succeeds", async () => {
    const sink = await startSink();
    const { mailer, delays } = connect(sink.port);
    sink.rejectNext(451);

    const info = await mailer.send(plainMessage, { kind: "notification" });
    assert.ok(info.messageId);
    assert.equal(sink.attempts(), 2);
    assert.equal(sink.received.length, 1);
    assert.deepEqual(delays, [800]);
  });

  it("gives up after the second temporary failure", async () => {
    const sink = await startSink();
    const { mailer, delays } = connect(sink.port);
    sink.rejectNext(451, 451);

    await assert.rejects(mailer.send(plainMessage), (error) => error.responseCode === 451);
    assert.equal(sink.attempts(), 2);
    assert.equal(sink.received.length, 0);
    assert.deepEqual(delays, [800]);
  });

  it("does not retry a permanent refusal", async () => {
    const sink = await startSink();
    const { mailer, delays } = connect(sink.port);
    sink.rejectNext(550);

    await assert.rejects(mailer.send(plainMessage), (error) => error.responseCode === 550);
    assert.equal(sink.attempts(), 1);
    assert.deepEqual(delays, []);
  });

  it("retries once when the connection is refused, then reports the failure", async () => {
    const sink = await startSink();
    const { port } = sink;
    await sink.close();
    sinks.splice(sinks.indexOf(sink), 1);

    const { mailer, delays } = connect(port);
    await assert.rejects(mailer.send(plainMessage), (error) => isTransient(error));
    assert.deepEqual(delays, [800]);
  });

  it("never sends a password or a message in the clear when TLS is required but not offered", async () => {
    const sink = await startSink({ requireAuth: true });
    const { mailer } = connect(sink.port, { SMTP_REQUIRE_TLS: "true" });

    await assert.rejects(mailer.send(plainMessage));
    assert.equal(sink.authAttempts(), 0, "no login was attempted");
    assert.equal(sink.received.length, 0);
  });
});

describe("the whole path: website request, API, SMTP", () => {
  it("turns a POST from the website into two real emails", async () => {
    const sink = await startSink({ requireAuth: true });
    const { config, mailer } = connect(sink.port);
    const app = await startApp({ config, mailer });
    apps.push(app);

    const { status, json } = await postContact(app.baseUrl, sampleInquiries.estimateEn, { Origin: "https://studio.example.test" });
    assert.equal(status, 200);
    assert.match(json.id, /^[0-9a-f]{8}$/);

    await app.service.idle();
    assert.equal(sink.received.length, 2);
    assert.equal(sink.received[0].mail.headers.get("x-inquiry-id"), json.id);
    assert.equal(sink.received[1].mail.headers.get("x-inquiry-id"), json.id);
  });

  it("answers 502 when the mail server refuses the notification", async () => {
    const sink = await startSink();
    const { config, mailer } = connect(sink.port);
    const app = await startApp({ config, mailer });
    apps.push(app);
    sink.rejectNext(550);

    const { status, json } = await postContact(app.baseUrl, sampleInquiries.simpleEn);
    assert.equal(status, 502);
    assert.equal(json.error.code, "delivery_failed");
    await app.service.idle();
    assert.equal(sink.received.length, 0);
  });

  it("answers 502 when nothing is listening at the mail server", async () => {
    const sink = await startSink();
    const { port } = sink;
    await sink.close();
    sinks.splice(sinks.indexOf(sink), 1);

    const { config, mailer } = connect(port);
    const app = await startApp({ config, mailer });
    apps.push(app);

    const { status, json } = await postContact(app.baseUrl, sampleInquiries.simpleEn);
    assert.equal(status, 502);
    assert.equal(json.error.code, "delivery_failed");
  });
});
