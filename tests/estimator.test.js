// The project estimator: its numbers (src/lib/estimator.js) and its words (src/content/<language>/estimator.js).

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createI18n } from "../src/i18n/createI18n.js";
import { createRouting } from "../src/i18n/locales.js";
import {
  DEFAULT_ESTIMATE_INPUT,
  FEATURES,
  SITE_TYPES,
  describeEstimate,
  estimateProject,
  estimateToSearchParams,
  searchParamsToEstimate,
} from "../src/lib/estimator.js";
import { CONTENT_LOCALES, GEORGIAN, loadLocale } from "./helpers/content.js";

// Every language with words, published or not, so a language that is switched off stays ready.
const content = Object.fromEntries(await Promise.all(CONTENT_LOCALES.map(async (code) => [code, await loadLocale(code)])));
const routing = createRouting("en", CONTENT_LOCALES);
const i18n = Object.fromEntries(CONTENT_LOCALES.map((code) => [code, createI18n(code, content[code], routing)]));

/** Every combination of site type, a few page counts and every feature set of up to three features, plus all of them. */
function* everyInput() {
  const featureSets = [[], ...FEATURES.map((feature) => [feature.id]), FEATURES.slice(0, 3).map((feature) => feature.id), FEATURES.map((feature) => feature.id)];
  for (const type of SITE_TYPES) {
    for (const pages of [type.minPages, type.pagesIncluded, type.maxPages]) {
      for (const features of featureSets) yield { type: type.id, pages, features };
    }
  }
}

describe("estimateProject", () => {
  it("always gives a price range and a week range that really are ranges", () => {
    let checked = 0;
    for (const input of everyInput()) {
      const result = estimateProject(input);
      assert.ok(result.low > 0 && result.low < result.high, `prices ${JSON.stringify(input)}`);
      assert.ok(result.weeksLow >= 1 && result.weeksLow < result.weeksHigh, `weeks ${JSON.stringify(input)}: ${result.weeksLow} to ${result.weeksHigh}`);
      checked += 1;
    }
    assert.ok(checked > 40);
  });

  it("never reads '2 to 2 weeks' for the smallest project", () => {
    const result = estimateProject({ type: "landing", pages: 1, features: [] });
    assert.deepEqual([result.weeksLow, result.weeksHigh], [2, 3]);
  });

  it("prices the smallest and the default project from the base prices", () => {
    const landing = estimateProject({ type: "landing", pages: 1, features: [] });
    assert.deepEqual([landing.low, landing.high], [300, 350]);
    const business = estimateProject(DEFAULT_ESTIMATE_INPUT);
    assert.deepEqual([business.low, business.high], [850, 1100]);
  });

  it("offers only landing pages and business websites, and no online booking", () => {
    assert.deepEqual(SITE_TYPES.map((type) => type.id), ["landing", "business"]);
    assert.deepEqual(FEATURES.map((feature) => feature.id), ["cms", "blog", "multilingual", "copywriting", "analytics"]);
  });

  it("keeps the budget split in four parts that the content names", () => {
    const result = estimateProject(DEFAULT_ESTIMATE_INPUT);
    const ids = result.breakdown.map((part) => part.id);
    for (const code of CONTENT_LOCALES) {
      assert.deepEqual(Object.keys(content[code].estimator.breakdown), ids, code);
    }
  });

  it("splits exactly the base, page and feature prices, with nothing added on top", () => {
    for (const input of everyInput()) {
      const type = SITE_TYPES.find((item) => item.id === input.type);
      const extraPages = Math.max(0, input.pages - type.pagesIncluded);
      const features = FEATURES.filter((feature) => input.features.includes(feature.id));
      const expected = type.base + extraPages * type.perExtraPage + features.reduce((sum, feature) => sum + feature.price, 0);
      const total = estimateProject(input).breakdown.reduce((sum, part) => sum + part.value, 0);
      assert.ok(Math.abs(total - expected) < 0.001, `${JSON.stringify(input)}: ${total} instead of ${expected}`);
    }
  });
});

describe("the link from the estimator to the contact form", () => {
  it("carries the estimate there and back, recalculating the price", () => {
    const input = { type: "business", pages: 8, features: ["blog", "multilingual"] };
    const params = estimateToSearchParams(input, estimateProject(input));
    assert.equal(params.has("timeline"), false, "there is no timeline choice any more");
    const back = searchParamsToEstimate(params);
    assert.deepEqual(back.input, input);
    assert.deepEqual(back.result, estimateProject(input));
  });

  it("ignores site types and features that are not offered", () => {
    assert.equal(searchParamsToEstimate(new URLSearchParams("type=store&pages=8")), null);
    assert.equal(searchParamsToEstimate(new URLSearchParams("type=webapp&pages=8")), null);
    const old = searchParamsToEstimate(new URLSearchParams("type=business&pages=6&features=cms,booking,branding&timeline=priority"));
    assert.deepEqual(old.input, { type: "business", pages: 6, features: ["cms"] });
  });
});

describe("the words of the estimator", () => {
  for (const code of CONTENT_LOCALES) {
    it(`${code}: name every site type and feature of the numbers, and nothing else`, () => {
      const words = content[code].estimator;
      assert.deepEqual(Object.keys(words.types).sort(), SITE_TYPES.map((type) => type.id).sort());
      assert.deepEqual(Object.keys(words.features).sort(), FEATURES.map((feature) => feature.id).sort());
      for (const [id, type] of Object.entries(words.types)) assert.ok(type.label.trim() && type.blurb.trim(), `type ${id}`);
      for (const [id, feature] of Object.entries(words.features)) assert.ok(feature.label.trim() && feature.hint.trim(), `feature ${id}`);
    });
  }
});

describe("describeEstimate", () => {
  const input = DEFAULT_ESTIMATE_INPUT;
  const result = estimateProject(input);

  it("writes the English summary", () => {
    const summary = describeEstimate(input, result, i18n.en);
    assert.equal(summary.headline, "Business website, 6 pages");
    assert.equal(summary.features, "Content editor (CMS), Analytics and tracking");
    assert.equal(summary.range, "$850 to $1,100");
    assert.match(summary.weeks, /^\d+ to \d+ weeks$/);
    assert.equal(summary.text, `${summary.headline}. ${summary.features}. Indicative range ${summary.range}, about ${summary.weeks}.`);
  });

  it("writes the Georgian summary with the same prices and weeks", () => {
    const english = describeEstimate(input, result, i18n.en);
    const georgian = describeEstimate(input, result, i18n.ka);
    const prices = (text) => text.match(/\$[\d,]+/g);
    assert.deepEqual(prices(georgian.range), prices(english.range));
    assert.deepEqual(georgian.weeks.match(/\d+/g), english.weeks.match(/\d+/g));
    for (const key of ["headline", "features", "range", "weeks", "text"]) {
      assert.match(georgian[key], GEORGIAN, key);
    }
    assert.equal(georgian.headline, "ბიზნეს ვებსაიტი, 6 გვერდი");
    assert.match(georgian.range, /^\$[\d,]+-დან \$[\d,]+-მდე$/);
    assert.match(georgian.weeks, /^\d+–\d+ კვირა$/);
  });

  it("leaves no {mark} unfilled, for any estimate, in any language", () => {
    for (const code of CONTENT_LOCALES) {
      for (const each of everyInput()) {
        const summary = describeEstimate(each, estimateProject(each), i18n[code]);
        for (const [key, text] of Object.entries(summary)) {
          assert.doesNotMatch(text, /[{}]|undefined|NaN/, `${code} ${key}: ${text}`);
        }
      }
    }
  });

  it("says so when no extra feature is chosen", () => {
    const none = { ...input, features: [] };
    assert.equal(describeEstimate(none, estimateProject(none), i18n.en).features, "No extra features");
    assert.equal(describeEstimate(none, estimateProject(none), i18n.ka).features, content.ka.estimator.noFeatures);
  });
});
