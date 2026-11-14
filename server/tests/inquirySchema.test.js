import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseInquiry } from "../src/lib/inquirySchema.js";
import { sampleInquiries } from "../src/mail/sampleInquiries.js";

describe("parseInquiry", () => {
  it("accepts what the website sends and normalizes it", () => {
    const result = parseInquiry({
      ...sampleInquiries.simpleEn,
      name: "  Daniel   Brooks ",
      email: "  Daniel@Example.COM ",
      website: "",
      somethingElse: "ignored",
    });

    assert.equal(result.success, true);
    assert.equal(result.data.name, "Daniel Brooks");
    assert.equal(result.data.email, "daniel@example.com");
    assert.equal(result.data.locale, "en");
    assert.deepEqual(result.data.ids, { projectType: "landing", budget: "under-500", timeline: "flexible", care: false });
    assert.equal("somethingElse" in result.data, false);
    assert.equal("website" in result.data, false);
  });

  it("fills in optional text with empty strings and accepts a null estimate", () => {
    const result = parseInquiry({ name: "Ana", email: "ana@example.com", message: "A message that is long enough to pass.", estimate: null });
    assert.equal(result.success, true);
    assert.equal(result.data.company, "");
    assert.equal(result.data.estimate, "");
    assert.equal(result.data.ids, undefined);
  });

  it("reports every problem field with a readable message", () => {
    const result = parseInquiry({ name: "", email: "not-an-email", message: "short" });
    assert.equal(result.success, false);
    assert.deepEqual(Object.keys(result.fields).sort(), ["email", "message", "name"]);
    assert.match(result.fields.email, /does not look right/);
    assert.match(result.fields.message, /at least 20 characters/);
  });

  it("reports missing fields", () => {
    const result = parseInquiry({});
    assert.equal(result.success, false);
    assert.match(result.fields.name, /tell us your name/i);
    assert.match(result.fields.email, /email address/i);
    assert.match(result.fields.message, /project/i);
  });

  it("rejects a message that is too long and a name that is too long", () => {
    const long = parseInquiry({ ...sampleInquiries.simpleEn, message: "x".repeat(4001), name: "N".repeat(81) });
    assert.equal(long.success, false);
    assert.ok(long.fields.message);
    assert.ok(long.fields.name);
  });

  it("strips line breaks and control characters from single-line fields", () => {
    const result = parseInquiry({ ...sampleInquiries.simpleEn, name: "Ana\r\nBcc: evil@example.com", company: "Acme\nCorp" });
    assert.equal(result.success, true);
    assert.equal(result.data.name, "Ana Bcc: evil@example.com");
    assert.equal(result.data.company, "Acme Corp");
  });

  it("falls back to English for an unknown language and ignores odd option ids", () => {
    const result = parseInquiry({
      ...sampleInquiries.simpleEn,
      locale: "fr",
      ids: { projectType: "<script>", budget: 12, timeline: "asap", care: "yes" },
    });
    assert.equal(result.success, true);
    assert.equal(result.data.locale, "en");
    assert.deepEqual(result.data.ids, { projectType: undefined, budget: undefined, timeline: "asap", care: undefined });
  });

  it("accepts Georgian text", () => {
    const result = parseInquiry(sampleInquiries.georgian);
    assert.equal(result.success, true);
    assert.equal(result.data.locale, "ka");
    assert.equal(result.data.name, "ნინო გელაშვილი");
  });

  it("rejects non-text values for required fields", () => {
    const result = parseInquiry({ name: { a: 1 }, email: ["x"], message: 42 });
    assert.equal(result.success, false);
    assert.deepEqual(Object.keys(result.fields).sort(), ["email", "message", "name"]);
  });
});
