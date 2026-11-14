// The website and the mail server (server/) must agree: the same languages, the same option ids, and the same
// wording for those options, so a visitor sees in the confirmation email the words they chose in the form.
//
// The server is its own package. When its dependencies are not installed (run `npm run server:install`),
// the tests that need it are skipped instead of failing.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LOCALES } from "../src/i18n/locales.js";
import { loadLocale } from "./helpers/content.js";

let messages = null;
let schema = null;
try {
  messages = await import("../server/src/mail/messages.js");
} catch {
  messages = null;
}
try {
  schema = await import("../server/src/lib/inquirySchema.js");
} catch {
  schema = null;
}

const content = Object.fromEntries(await Promise.all(LOCALES.map(async (code) => [code, await loadLocale(code)])));
const missing = (name) => ({ skip: `${name} is not available (run: npm run server:install)` });

describe("website and mail server", () => {
  it("publish in the same languages", schema ? {} : missing("the server schema"), () => {
    assert.deepEqual([...schema.LOCALES], [...LOCALES]);
  });

  it("have email wording for every language of the site", messages ? {} : missing("the server messages"), () => {
    for (const code of LOCALES) {
      assert.ok(messages.messages[code], `${code}: messages`);
      assert.ok(messages.messages[code].notification, `${code}: notification`);
      assert.ok(messages.messages[code].autoReply, `${code}: autoReply`);
    }
  });

  const kinds = [
    ["projectTypes", "projectType"],
    ["budgetOptions", "budget"],
    ["timelineOptions", "timeline"],
  ];

  for (const [formKey, serverKey] of kinds) {
    it(`offer the same ${serverKey} options, with the same words in every language`, messages ? {} : missing("the server messages"), () => {
      const table = messages.optionLabels[serverKey];
      for (const code of LOCALES) {
        const options = content[code].contact[formKey];
        assert.deepEqual([...options.map((option) => option.id)].sort(), Object.keys(table).sort(), `${code}: ids`);
        for (const option of options) {
          assert.equal(option.label, table[option.id][code], `${code}: label of ${serverKey} "${option.id}"`);
        }
      }
    });
  }

  it("word the care-plan answer the same way", messages ? {} : missing("the server messages"), () => {
    for (const code of LOCALES) {
      const { careYes, careNo } = content[code].contact.mail;
      assert.equal(careYes, messages.optionLabels.care.yes[code], `${code}: yes`);
      assert.equal(careNo, messages.optionLabels.care.no[code], `${code}: no`);
    }
  });

  it("spot an urgent request from the label of the 'as soon as possible' option", messages ? {} : missing("the server messages"), () => {
    for (const code of LOCALES) {
      const asap = content[code].contact.timelineOptions.find((option) => option.id === "asap");
      assert.ok(asap, `${code}: the asap option exists`);
      assert.match(asap.label, messages.URGENT_TIMELINE, `${code}: ${asap.label}`);
    }
  });

  it("have a label for every option id the server knows, in every language", messages ? {} : missing("the server messages"), () => {
    for (const [kind, table] of Object.entries(messages.optionLabels)) {
      for (const [id, words] of Object.entries(table)) {
        for (const code of LOCALES) assert.ok(words[code]?.trim(), `${kind}.${id}.${code}`);
      }
    }
  });
});
