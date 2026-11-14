import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { simpleParser } from "mailparser";
import { parseInquiry } from "../src/lib/inquirySchema.js";
import { createLogger } from "../src/lib/logger.js";
import { logo } from "../src/mail/assets.js";
import { createInquiryService } from "../src/mail/inquiryService.js";
import { createMailer, isTransient } from "../src/mail/mailer.js";
import { sampleInquiries } from "../src/mail/sampleInquiries.js";
import { testConfig } from "./helpers/config.js";

describe("isTransient", () => {
  it("retries network trouble and SMTP answers that mean 'try again later'", () => {
    for (const code of ["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "ECONNECTION", "ESOCKET", "EDNS", "EAI_AGAIN"]) {
      assert.equal(isTransient({ code }), true, code);
    }
    for (const responseCode of [421, 450, 451, 452]) assert.equal(isTransient({ responseCode }), true, String(responseCode));
  });

  it("does not retry permanent answers", () => {
    const permanent = [
      { code: "EAUTH", responseCode: 535 },
      { code: "EENVELOPE", responseCode: 550 },
      { responseCode: 554 },
      { code: "EMESSAGE" },
      new Error("something else"),
      null,
      undefined,
    ];
    for (const error of permanent) assert.equal(isTransient(error), false, JSON.stringify(error));
  });
});

describe("preview mailer", () => {
  const folders = [];
  after(async () => {
    await Promise.all(folders.map((folder) => rm(folder, { recursive: true, force: true })));
  });

  it("builds the real messages and saves them as files instead of sending them", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "wss-preview-"));
    folders.push(directory);

    const logger = createLogger({ level: "silent" });
    const config = testConfig({ PREVIEW_DIR: directory });
    const mailer = createMailer({ config, logger });

    assert.equal(mailer.mode, "preview");
    assert.deepEqual(mailer.status(), { mode: "preview", verified: true });
    assert.equal(await mailer.verify(), true);

    const service = createInquiryService({ config, mailer, logger });
    const { id } = await service.deliver(parseInquiry(sampleInquiries.estimateEn).data);
    await service.idle();

    const files = (await readdir(directory)).sort();
    assert.equal(files.length, 4, files.join(", "));
    const named = (kind, extension) => files.find((name) => name.includes(`-${kind}-${id}`) && name.endsWith(extension));
    for (const kind of ["notification", "auto-reply"]) {
      assert.ok(named(kind, ".eml"), `an .eml for the ${kind}`);
      assert.ok(named(kind, ".html"), `an .html for the ${kind}`);
    }

    // The .eml is the complete message, exactly what SMTP would have carried.
    const notification = await simpleParser(await readFile(path.join(directory, named("notification", ".eml"))));
    assert.equal(notification.subject, "[ASAP] New inquiry from Ana Smith: Business website");
    assert.equal(notification.replyTo.value[0].address, "ana@harborpine.example");
    assert.deepEqual(notification.attachments.map((attachment) => attachment.cid), ["wss-logo"]);

    // The .html opens straight in a browser: the embedded images became relative file paths.
    const page = await readFile(path.join(directory, named("notification", ".html")), "utf8");
    assert.equal(page.includes("cid:"), false);
    const relative = path.relative(directory, logo.file).split(path.sep).join("/");
    assert.ok(page.includes(`src="${relative}"`));
    assert.ok(existsSync(path.resolve(directory, relative)), "the logo path in the preview points at a real file");
  });
});
