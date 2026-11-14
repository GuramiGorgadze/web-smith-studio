// The language machinery: addresses (/ka/work), the text marks ({name}, <tag>), plurals, the i18n object
// and the fallback strings of the loading and error screens.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fallbackText } from "../src/i18n/fallback.js";
import { createI18n } from "../src/i18n/createI18n.js";
import { LOCALES, LOCALE_META, createRouting, normalizeDefaultLocale } from "../src/i18n/locales.js";
import { format, marksOf, parseRich, pluralize } from "../src/i18n/text.js";
import { GEORGIAN, loadLocale } from "./helpers/content.js";

const content = { en: await loadLocale("en"), ka: await loadLocale("ka") };

describe("locales", () => {
  it("publishes English and Georgian", () => {
    assert.deepEqual([...LOCALES], ["en", "ka"]);
  });

  it("describes every language the same way", () => {
    for (const code of LOCALES) {
      const meta = LOCALE_META[code];
      assert.equal(meta.code, code);
      for (const key of ["name", "nativeName", "short", "ogLocale"]) {
        assert.equal(typeof meta[key], "string", `${code}.${key}`);
        assert.ok(meta[key].length > 0, `${code}.${key} is empty`);
      }
      assert.match(meta.ogLocale, /^[a-z]{2}_[A-Z]{2}$/, `${code}.ogLocale looks like en_US`);
    }
    assert.match(LOCALE_META.ka.nativeName, GEORGIAN);
  });

  it("falls back to English for an unknown default language", () => {
    assert.equal(normalizeDefaultLocale("ka"), "ka");
    assert.equal(normalizeDefaultLocale("en"), "en");
    assert.equal(normalizeDefaultLocale("de"), "en");
    assert.equal(normalizeDefaultLocale(""), "en");
    assert.equal(normalizeDefaultLocale(undefined), "en");
  });
});

describe("createRouting with English as the default", () => {
  const routing = createRouting("en");

  it("keeps English at the plain addresses and puts Georgian under /ka", () => {
    assert.equal(routing.defaultLocale, "en");
    assert.equal(routing.prefix("en"), "");
    assert.equal(routing.prefix("ka"), "/ka");
  });

  it("strips the language from an address", () => {
    assert.deepEqual(routing.strip("/ka/work/harbor-and-pine-cafe"), { locale: "ka", path: "/work/harbor-and-pine-cafe" });
    assert.deepEqual(routing.strip("/ka/work"), { locale: "ka", path: "/work" });
    assert.deepEqual(routing.strip("/ka"), { locale: "ka", path: "/" });
    assert.deepEqual(routing.strip("/ka/"), { locale: "ka", path: "/" });
    assert.deepEqual(routing.strip("/KA/work"), { locale: "ka", path: "/work" });
    assert.deepEqual(routing.strip("/work"), { locale: "en", path: "/work" });
    assert.deepEqual(routing.strip("/"), { locale: "en", path: "/" });
  });

  it("does not mistake a page whose name starts with a language code for a language", () => {
    assert.deepEqual(routing.strip("/kaleidoscope"), { locale: "en", path: "/kaleidoscope" });
    assert.deepEqual(routing.strip("/work/ka"), { locale: "en", path: "/work/ka" });
  });

  it("puts a site path into a language", () => {
    assert.equal(routing.localize("/", "ka"), "/ka");
    assert.equal(routing.localize("/work", "ka"), "/ka/work");
    assert.equal(routing.localize("/work?type=local", "ka"), "/ka/work?type=local");
    assert.equal(routing.localize("/#process", "ka"), "/ka#process");
    assert.equal(routing.localize("/?a=1", "ka"), "/ka?a=1");
    assert.equal(routing.localize("/contact?estimate=1200-1600#form", "ka"), "/ka/contact?estimate=1200-1600#form");
    assert.equal(routing.localize("/work", "en"), "/work");
    assert.equal(routing.localize("/", "en"), "/");
  });

  it("leaves anything that is not a site path alone", () => {
    for (const other of ["#faq", "?x=1", "https://example.com/a", "http://example.com", "//cdn.example.com/a.js", "mailto:hi@example.com", "tel:+995000", ""]) {
      assert.equal(routing.localize(other, "ka"), other, other);
    }
    assert.equal(routing.localize(undefined, "ka"), undefined);
    assert.equal(routing.localize(null, "ka"), null);
  });

  it("round-trips: strip(localize(path)) gives the path back", () => {
    for (const path of ["/", "/work", "/work/lumen-yoga", "/pricing", "/contact", "/privacy"]) {
      for (const locale of LOCALES) {
        assert.deepEqual(routing.strip(routing.localize(path, locale)), { locale, path });
      }
    }
  });

  it("lists every language version of a page", () => {
    assert.deepEqual(routing.alternates("/work"), [
      { locale: "en", path: "/work" },
      { locale: "ka", path: "/ka/work" },
    ]);
    assert.deepEqual(routing.alternates("/"), [
      { locale: "en", path: "/" },
      { locale: "ka", path: "/ka" },
    ]);
  });

  it("picks the first browser language that the site is published in", () => {
    assert.equal(routing.pick(["ka-GE", "en"]), "ka");
    assert.equal(routing.pick(["de-DE", "ka", "en"]), "ka");
    assert.equal(routing.pick(["EN-us"]), "en");
    assert.equal(routing.pick(["fr", "de"]), "en");
    assert.equal(routing.pick([]), "en");
    assert.equal(routing.pick(), "en");
  });
});

describe("createRouting with Georgian as the default", () => {
  const routing = createRouting("ka");

  it("moves Georgian to the plain addresses and English under /en", () => {
    assert.equal(routing.defaultLocale, "ka");
    assert.equal(routing.prefix("ka"), "");
    assert.equal(routing.prefix("en"), "/en");
    assert.equal(routing.localize("/work", "en"), "/en/work");
    assert.equal(routing.localize("/work", "ka"), "/work");
    assert.deepEqual(routing.strip("/en/work"), { locale: "en", path: "/work" });
    assert.deepEqual(routing.strip("/ka/work"), { locale: "ka", path: "/ka/work" }, "/ka is an ordinary path now");
    assert.deepEqual(routing.strip("/work"), { locale: "ka", path: "/work" });
    assert.equal(routing.pick(["fr"]), "ka");
  });

  it("treats an unknown default language as English", () => {
    assert.equal(createRouting("xx").defaultLocale, "en");
    assert.equal(createRouting().defaultLocale, "en");
  });
});

describe("format", () => {
  it("fills {name} marks", () => {
    assert.equal(format("Hello {name}, we reply {when}.", { name: "Nino", when: "tomorrow" }), "Hello Nino, we reply tomorrow.");
  });

  it("leaves a mark without a value as written, so a typo is easy to spot", () => {
    assert.equal(format("Hello {name} {oops}", { name: "Nino" }), "Hello Nino {oops}");
    assert.equal(format("{a}", { a: null }), "{a}");
    assert.equal(format("{a}", { a: undefined }), "{a}");
  });

  it("keeps a zero and an empty string", () => {
    assert.equal(format("{count} pages", { count: 0 }), "0 pages");
    assert.equal(format("[{a}]", { a: "" }), "[]");
  });

  it("works on Georgian text and without values", () => {
    assert.equal(format("{price}-დან", { price: "$1,200" }), "$1,200-დან");
    assert.equal(format("plain"), "plain");
  });
});

describe("pluralize", () => {
  const english = { one: "{count} page", other: "{count} pages" };
  const georgian = { one: "{count} გვერდი", other: "{count} გვერდი" };

  it("chooses the English form", () => {
    assert.equal(pluralize("en", 1, english), "1 page");
    assert.equal(pluralize("en", 0, english), "0 pages");
    assert.equal(pluralize("en", 6, english), "6 pages");
  });

  it("uses the same word after any number in Georgian", () => {
    for (const count of [0, 1, 2, 5, 21, 100]) {
      assert.equal(pluralize("ka", count, georgian), `${count} გვერდი`);
    }
  });

  it("falls back to the 'other' form when a language needs a form the text does not have", () => {
    assert.equal(pluralize("en", 5, { other: "{count} things" }), "5 things");
  });

  it("passes extra values through", () => {
    assert.equal(pluralize("en", 2, { one: "{count} of {total}", other: "{count} of {total}" }, { total: 9 }), "2 of 9");
  });
});

describe("parseRich and marksOf", () => {
  it("splits text, values and tags", () => {
    assert.deepEqual(parseRich("Read the <privacy>Privacy Policy</privacy> or write to {email}."), [
      { type: "text", value: "Read the " },
      { type: "tag", name: "privacy", value: "Privacy Policy" },
      { type: "text", value: " or write to " },
      { type: "var", name: "email" },
      { type: "text", value: "." },
    ]);
  });

  it("keeps a {value} inside a tag for the renderer to parse again", () => {
    assert.deepEqual(parseRich("<to>{visitorEmail}</to>"), [{ type: "tag", name: "to", value: "{visitorEmail}" }]);
  });

  it("returns plain text as one part and nothing for an empty string", () => {
    assert.deepEqual(parseRich("Just words"), [{ type: "text", value: "Just words" }]);
    assert.deepEqual(parseRich(""), []);
  });

  it("works with Georgian words around the marks", () => {
    const parts = parseRich("ვეთანხმები <privacy>პოლიტიკას</privacy> და {name}-ს.");
    assert.deepEqual(
      parts.map((part) => part.type),
      ["text", "tag", "text", "var", "text"],
    );
  });

  it("lists the marks of a string, sorted and without repeats", () => {
    assert.deepEqual(marksOf("{b} and {a} and {b} <strong>x</strong> <mail>{email}</mail>"), ["<mail>", "<strong>", "{a}", "{b}", "{email}"]);
    assert.deepEqual(marksOf("no marks"), []);
  });
});

describe("createI18n", () => {
  const routing = createRouting("en");
  const i18n = { en: createI18n("en", content.en, routing), ka: createI18n("ka", content.ka, routing) };

  it("knows the language and its address rules", () => {
    assert.equal(i18n.ka.locale, "ka");
    assert.equal(i18n.ka.defaultLocale, "en");
    assert.equal(i18n.ka.meta.nativeName, "ქართული");
    assert.deepEqual(
      i18n.ka.languages.map((language) => language.code),
      ["en", "ka"],
    );
    assert.equal(i18n.ka.path("/work"), "/ka/work");
    assert.equal(i18n.en.path("/work"), "/work");
    assert.equal(i18n.ka.pathIn("/work", "en"), "/work");
    assert.equal(i18n.en.pathIn("/work", "ka"), "/ka/work");
    assert.equal(i18n.ka.neutralPath("/ka/work/lumen-yoga"), "/work/lumen-yoga");
    assert.deepEqual(i18n.ka.alternates("/pricing"), [
      { locale: "en", path: "/pricing" },
      { locale: "ka", path: "/ka/pricing" },
    ]);
  });

  it("fills the values every string may use without being told", () => {
    for (const code of LOCALES) {
      const text = i18n[code].t("{name}|{email}|{responseTime}|{founded}");
      const site = content[code].site;
      assert.equal(text, `${site.name}|${site.email}|${site.responseTime}|${site.founded}`);
    }
  });

  it("lets a call add values and override nothing it should not", () => {
    assert.equal(i18n.en.t("Hi {firstName}, from {name}", { firstName: "Nino" }), "Hi Nino, from Web Smith Studio");
  });

  it("counts in the language of the site", () => {
    assert.equal(i18n.en.count({ one: "{count} page", other: "{count} pages" }, 1), "1 page");
    assert.equal(i18n.en.count({ one: "{count} page", other: "{count} pages" }, 4), "4 pages");
    assert.equal(i18n.ka.count({ one: "{count} გვერდი", other: "{count} გვერდი" }, 4), "4 გვერდი");
  });

  it("has Georgian content in the Georgian object", () => {
    assert.match(i18n.ka.site.tagline, GEORGIAN);
    assert.doesNotMatch(i18n.en.site.tagline, GEORGIAN);
    assert.equal(i18n.ka.content.locale, "ka");
    assert.equal(i18n.en.content.locale, "en");
  });
});

describe("fallbackText (the loading and error screens)", () => {
  it("has the same strings in every language", () => {
    const keys = Object.keys(fallbackText.en).sort();
    for (const code of LOCALES) {
      assert.ok(fallbackText[code], `${code} is missing`);
      assert.deepEqual(Object.keys(fallbackText[code]).sort(), keys, code);
    }
  });

  it("is translated: Georgian has Georgian letters in every sentence, English has none", () => {
    for (const [key, value] of Object.entries(fallbackText.ka)) {
      assert.match(value, GEORGIAN, `ka.${key}`);
    }
    for (const [key, value] of Object.entries(fallbackText.en)) {
      assert.doesNotMatch(value, GEORGIAN, `en.${key}`);
    }
  });

  it("names the studio in the page title of the error screen", () => {
    for (const code of LOCALES) {
      assert.ok(fallbackText[code].errorHeadTitle.endsWith("| Web Smith Studio"), code);
    }
  });

  it("is frozen, so a screen cannot change it by accident", () => {
    assert.ok(Object.isFrozen(fallbackText));
    assert.ok(Object.isFrozen(fallbackText.ka));
  });
});
