// Every language must say the same things in the same places. English is the reference: a language is
// complete when it has the same files, the same shape, the same data and the same marks ({name}, <tag>),
// and its sentences really are in that language.

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { marksOf } from "../src/i18n/text.js";
import { SITE_TYPES } from "../src/lib/estimator.js";
import { CONTENT_LOCALES, GEORGIAN, ROOT, getAt, kindOf, leaves, loadLocale, moduleNames, pathToString } from "./helpers/content.js";

// Every language with a content folder, including one that is switched off (Georgian, for now): its words must
// stay complete so it can be switched back on at any time.
const loaded = Object.fromEntries(await Promise.all(CONTENT_LOCALES.map(async (code) => [code, await loadLocale(code)])));
const en = loaded.en;
const OTHER = CONTENT_LOCALES.filter((code) => code !== "en");

/** Georgian letters next to Latin letters or digits with no hyphen between them: "SEOსა" instead of "SEO-სა". */
const GLUED = new RegExp(`[A-Za-z0-9]${GEORGIAN.source}|${GEORGIAN.source}[A-Za-z0-9]`, "u");

// Parts of the content that are words. Everything outside them is data (ids, prices, colors, links) that is
// the same in every language. Inside them only ids, icons and links are data.
const TEXT_AREAS = [
  /^sections\b/,
  /^pages\b/,
  /^ui\b/,
  /^estimator\b/,
  /^about\b/,
  /^legal\b/,
  /^faqs\b/,
  /^values\b/,
  /^disciplines\b/,
  /^contact\.(validation|form|errors|success|info|attachment|mail)\b/,
];
const DATA_KEYS_EVERYWHERE = new Set(["id", "icon", "to", "href"]);
const DATA_KEYS_OUTSIDE_TEXT = new Set([
  ...DATA_KEYS_EVERYWHERE,
  "slug",
  "from",
  "care",
  "type",
  "featured",
  "recurring",
  "contactType",
  "number",
  "screen",
  "url",
  "domain",
  "image",
  "typeName",
  "tabs",
  "category",
  "year",
  "isConcept",
  "layout",
  "stack",
  "palette",
  "prefix",
]);
// The studio's own facts (src/data/site.js) are the same in every language; the rest of `site` is words.
const SITE_FACTS = new Set(["name", "shortName", "url", "email", "founded", "socials"]);

/** "projects.items[2].name" -> "projects.items[].name": one pattern for every item of a list. */
const generic = (parts) => pathToString(parts).replace(/\[\d+\]/g, "[]");

function isData(parts) {
  const dotted = generic(parts);
  const keys = parts.filter((part) => typeof part === "string");
  // The facts and the studio's words are mixed in `site`.
  if (parts[0] === "site") return SITE_FACTS.has(parts[1]);
  const inText = TEXT_AREAS.some((area) => area.test(dotted));
  const allowed = inText ? DATA_KEYS_EVERYWHERE : DATA_KEYS_OUTSIDE_TEXT;
  return keys.some((key) => allowed.has(key));
}

// Strings that may be word for word the same as English, or have no Georgian letters, on purpose.
const SAME_AS_ENGLISH_OK = [
  /^projects\.items\[\]\.(name|services\[\])$/, // names of the concept businesses, and the word "SEO"
  /^process\.screens\.build\.scores\[\]$/, // Lighthouse labels, "SEO" among them
  /^contact\.form\.(company|email)\.placeholder$/,
  /^stats\[\]\.suffix$/, // "+" and "%"
];
// "site.ogImage" is a file name.
const NO_GEORGIAN_OK = [/^locale$/, /^site\.ogImage$/, /^contact\.form\.(company|email)\.placeholder$/, /^stats\[\]\.suffix$/, /^sections\.estimatorTool\.result\.rangeDash$/];
// Whitespace on purpose: the separator between the two ends of a price range.
const WHITESPACE_OK = [/^sections\.estimatorTool\.result\.rangeDash$/, /^ui\.newTab$/];
// A type specimen shows a Latin and a Georgian letter side by side on purpose.
const GLUED_OK = [/^process\.screens\.design\.typeSpecimen$/];

// Latin-letter phrases that belong in a Georgian sentence: names and technical terms.
const LATIN_PHRASES = [
  "Web Smith Studio",
  "Core Web Vitals",
  "Harbor & Pine Café",
  "Northlight Dental",
  "Atelier Voss",
  "Kestrel Logistics",
  "Lumen Yoga",
  "Meridian Capital",
  "Google Business",
  "Tailwind CSS",
  "Radix UI",
];

/** The words of a string: its {marks} and <tags> taken out, digits and punctuation ignored. */
const stripMarks = (text) => text.replace(/<\/?\w+>/g, " ").replace(/\{\w+\}/g, " ");
const hasWords = (text) => /\p{L}/u.test(stripMarks(text));

describe("content files", () => {
  it("has one folder per language with the same files as English", () => {
    const expected = moduleNames("en");
    assert.ok(expected.length >= 17, "English has its content files");
    for (const code of OTHER) {
      assert.deepEqual(moduleNames(code), expected, `${code} must have the same files as en`);
    }
  });

  for (const code of OTHER) {
    describe(`${code} compared with English`, () => {
      const other = loaded[code];

      it("has the same shape: same keys, same list lengths, same kinds of values", () => {
        const problems = [];
        const compare = (a, b, parts) => {
          const kind = kindOf(a);
          if (kind !== kindOf(b)) {
            problems.push(`${pathToString(parts)}: en is ${kind}, ${code} is ${kindOf(b)}`);
            return;
          }
          if (kind === "array") {
            if (a.length !== b.length) problems.push(`${pathToString(parts)}: en has ${a.length} items, ${code} has ${b.length}`);
            for (let index = 0; index < Math.min(a.length, b.length); index += 1) compare(a[index], b[index], [...parts, index]);
          } else if (kind === "object") {
            for (const key of Object.keys(a)) {
              if (!(key in b)) problems.push(`${pathToString([...parts, key])}: missing in ${code}`);
              else compare(a[key], b[key], [...parts, key]);
            }
            for (const key of Object.keys(b)) {
              if (!(key in a)) problems.push(`${pathToString([...parts, key])}: only in ${code}`);
            }
          }
        };
        compare(en, other, []);
        assert.deepEqual(problems, []);
      });

      it("has the same data as English: ids, links, prices, colors, years", () => {
        const problems = [];
        for (const { parts, value } of leaves(en)) {
          if (parts[0] === "locale") continue;
          const dataLeaf = typeof value !== "string" || isData(parts);
          if (!dataLeaf) continue;
          const mine = getAt(other, parts);
          if (mine !== value) problems.push(`${pathToString(parts)}: en ${JSON.stringify(value)}, ${code} ${JSON.stringify(mine)}`);
        }
        assert.deepEqual(problems, []);
      });

      it("carries the same {values} and <tags> as English in every sentence", () => {
        const problems = [];
        for (const { parts, value } of leaves(en)) {
          if (typeof value !== "string" || isData(parts)) continue;
          const mine = getAt(other, parts);
          if (typeof mine !== "string") continue; // the shape test reports it
          const a = marksOf(value);
          const b = marksOf(mine);
          if (a.join() !== b.join()) problems.push(`${pathToString(parts)}: en ${JSON.stringify(a)}, ${code} ${JSON.stringify(b)}`);
        }
        assert.deepEqual(problems, []);
      });

      it("has no sentence left in English", () => {
        const problems = [];
        for (const { parts, value } of leaves(en)) {
          if (typeof value !== "string" || isData(parts)) continue;
          const mine = getAt(other, parts);
          if (typeof mine !== "string") continue;
          const dotted = generic(parts);
          if (mine === value && hasWords(mine) && !SAME_AS_ENGLISH_OK.some((ok) => ok.test(dotted))) {
            problems.push(`${dotted}: same as English: ${JSON.stringify(mine).slice(0, 70)}`);
          }
        }
        assert.deepEqual(problems, []);
      });

      if (code === "ka") {
        it("is written in Georgian: every sentence has Georgian letters", () => {
          const problems = [];
          for (const { parts, value } of leaves(other)) {
            if (typeof value !== "string" || isData(parts)) continue;
            const dotted = generic(parts);
            if (NO_GEORGIAN_OK.some((ok) => ok.test(dotted)) || SAME_AS_ENGLISH_OK.some((ok) => ok.test(dotted))) continue;
            if (hasWords(value) && !GEORGIAN.test(value)) problems.push(`${dotted}: ${JSON.stringify(value).slice(0, 70)}`);
          }
          assert.deepEqual(problems, []);
        });

        it("never glues Latin letters or digits to Georgian letters without a hyphen", () => {
          const problems = [];
          for (const { parts, value } of leaves(other)) {
            if (typeof value !== "string" || isData(parts) || GLUED_OK.some((ok) => ok.test(generic(parts)))) continue;
            for (const token of stripMarks(value).split(/[\s,;:!?()„“«»"…]+/u)) {
              if (GLUED.test(token)) problems.push(`${pathToString(parts)}: ${token}`);
            }
          }
          assert.deepEqual(problems, []);
        });

        it("has no English sentence pasted into a Georgian one", () => {
          const problems = [];
          const threeLatinWords = /(?:\b[A-Za-z][A-Za-z.'’&-]*[ ,]+){2,}[A-Za-z]/;
          for (const { parts, value } of leaves(other)) {
            if (typeof value !== "string" || isData(parts)) continue;
            if (SAME_AS_ENGLISH_OK.some((ok) => ok.test(generic(parts)))) continue;
            let text = stripMarks(value);
            for (const phrase of LATIN_PHRASES) text = text.split(phrase).join(" ");
            if (threeLatinWords.test(text)) problems.push(`${pathToString(parts)}: ${JSON.stringify(value).slice(0, 80)}`);
          }
          assert.deepEqual(problems, []);
        });
      }

      it("labels each project with the name of its category", () => {
        for (const project of other.projects.items) {
          const category = other.projects.categories.find((item) => item.id === project.category);
          assert.ok(category, `${project.slug}: category ${project.category} exists`);
          assert.equal(project.categoryLabel, category.label, project.slug);
        }
      });
    });
  }
});

describe("the content of every language", () => {
  for (const code of CONTENT_LOCALES) {
    describe(code, () => {
      const content = loaded[code];

      it("has no stray whitespace at the ends of a sentence or doubled inside it", () => {
        const problems = [];
        for (const { parts, value } of leaves(content)) {
          if (typeof value !== "string" || WHITESPACE_OK.some((ok) => ok.test(generic(parts)))) continue;
          if (value !== value.trim()) problems.push(`${pathToString(parts)}: space at an end`);
          if (/ {2,}|\t|\n/.test(value)) problems.push(`${pathToString(parts)}: doubled space or line break`);
        }
        assert.deepEqual(problems, []);
      });

      it("keeps titles and descriptions a sensible length for search results", () => {
        for (const [name, page] of Object.entries(content.pages)) {
          if (page.seoTitle) assert.ok(page.seoTitle.length <= 60, `${name}.seoTitle is ${page.seoTitle.length} characters`);
          if (page.seoDescription) {
            assert.ok(page.seoDescription.length >= 60, `${name}.seoDescription is too short`);
            assert.ok(page.seoDescription.length <= 320, `${name}.seoDescription is ${page.seoDescription.length} characters`);
          }
        }
        assert.ok(content.site.description.length <= 320, "site.description");
        assert.ok(content.site.tagline.length <= 90, "site.tagline");
      });

      it("points the share image at a file that exists in public/", () => {
        const file = path.join(ROOT, "public", content.site.ogImage.replace(/^\//, ""));
        assert.ok(existsSync(file), `${content.site.ogImage} is missing from public/`);
      });

      it("gives every plural form a {count} and an 'other' form", () => {
        let found = 0;
        for (const { parts } of leaves(content)) {
          const node = getAt(content, parts.slice(0, -1));
          if (node && !Array.isArray(node) && typeof node === "object" && "other" in node && "one" in node && Object.keys(node).every((key) => ["zero", "one", "two", "few", "many", "other"].includes(key))) {
            found += 1;
            for (const [category, form] of Object.entries(node)) {
              assert.match(form, /\{count\}/, `${pathToString(parts.slice(0, -1))}.${category}`);
            }
          }
        }
        assert.ok(found > 0, "the plural forms were found");
      });

      it("has a policy page with a title, a date, an intro and sections", () => {
        for (const [key, document] of Object.entries(content.legal)) {
          for (const field of ["title", "updated", "intro"]) assert.ok(document[field]?.trim(), `${key}.${field}`);
          assert.ok(document.sections.length >= 3, `${key} has sections`);
          const ids = new Set();
          for (const section of document.sections) {
            assert.match(section.id, /^[a-z0-9-]+$/, `${key}: section ids are plain ASCII, they are web addresses`);
            assert.ok(!ids.has(section.id), `${key}: ${section.id} is used twice`);
            ids.add(section.id);
            assert.ok(section.heading.trim(), `${key}.${section.id}.heading`);
            assert.ok(section.body.length >= 1 && section.body.every((paragraph) => paragraph.trim()), `${key}.${section.id}.body`);
          }
        }
      });

      it("has every option the contact form offers, each with a label", () => {
        for (const key of ["projectTypes", "budgetOptions", "timelineOptions"]) {
          const options = content.contact[key];
          assert.ok(options.length >= 4, key);
          assert.equal(new Set(options.map((option) => option.id)).size, options.length, `${key} ids are unique`);
          for (const option of options) assert.ok(option.label.trim(), `${key}.${option.id}`);
        }
      });

      it("has FAQ answers that name a price only when the pricing page does", () => {
        const prices = new Set(content.pricing.tiers.map((tier) => tier.from));
        const cost = content.faqs.items.find((item) => item.id === "cost");
        assert.ok(cost, "the cost question exists");
        const named = [...cost.answer.matchAll(/\$([\d,]+)/g)].map((match) => Number(match[1].replace(/,/g, "")));
        for (const price of prices) assert.ok(named.includes(price), `the cost answer names $${price}`);
      });

      it("sets its starting prices from the estimator's numbers", () => {
        for (const tier of content.pricing.tiers) {
          const type = SITE_TYPES.find((item) => item.id === tier.type);
          assert.ok(type, `${tier.id}: the estimator has a ${tier.type} type`);
          assert.equal(tier.from, type.base, `${tier.id}: starting price matches the estimator`);
        }
      });
    });
  }
});
