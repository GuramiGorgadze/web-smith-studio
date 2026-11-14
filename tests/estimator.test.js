// The project estimator: its numbers (src/lib/estimator.js) and its words (src/content/<language>/estimator.js).

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createI18n } from "../src/i18n/createI18n.js";
import { LOCALES, createRouting } from "../src/i18n/locales.js";
import {
  DEFAULT_ESTIMATE_INPUT,
  FEATURES,
  SITE_TYPES,
  TIMELINES,
  describeEstimate,
  estimateProject,
  surchargePercent,
} from "../src/lib/estimator.js";
import { GEORGIAN, loadLocale } from "./helpers/content.js";

const content = Object.fromEntries(await Promise.all(LOCALES.map(async (code) => [code, await loadLocale(code)])));
const i18n = Object.fromEntries(LOCALES.map((code) => [code, createI18n(code, content[code], createRouting("en"))]));

/** Every combination of site type, a few page counts, every feature set of up to three features, every timeline. */
function* everyInput() {
  const featureSets = [[], ...FEATURES.map((feature) => [feature.id]), FEATURES.slice(0, 3).map((feature) => feature.id), FEATURES.map((feature) => feature.id)];
  for (const type of SITE_TYPES) {
    for (const pages of [type.minPages, type.pagesIncluded, type.maxPages]) {
      for (const features of featureSets) {
        for (const timeline of TIMELINES) yield { type: type.id, pages, features, timeline: timeline.id };
      }
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
    assert.ok(checked > 100);
  });

  it("never reads '2 to 2 weeks' for the smallest project", () => {
    const result = estimateProject({ type: "landing", pages: 1, features: [], timeline: "standard" });
    assert.deepEqual([result.weeksLow, result.weeksHigh], [2, 3]);
  });

  it("keeps the budget split in four parts that the content names", () => {
    const result = estimateProject(DEFAULT_ESTIMATE_INPUT);
    const ids = result.breakdown.map((part) => part.id);
    for (const code of LOCALES) {
      assert.deepEqual(Object.keys(content[code].estimator.breakdown), ids, code);
    }
  });

  it("states the surcharge of a faster timeline as a whole percentage", () => {
    assert.equal(surchargePercent(TIMELINES.find((timeline) => timeline.id === "priority")), 25);
    assert.equal(surchargePercent(TIMELINES.find((timeline) => timeline.id === "standard")), 0);
  });
});

describe("the words of the estimator", () => {
  for (const code of LOCALES) {
    it(`${code}: name every site type, feature and timeline of the numbers, and nothing else`, () => {
      const words = content[code].estimator;
      assert.deepEqual(Object.keys(words.types).sort(), SITE_TYPES.map((type) => type.id).sort());
      assert.deepEqual(Object.keys(words.features).sort(), FEATURES.map((feature) => feature.id).sort());
      assert.deepEqual(Object.keys(words.timelines).sort(), TIMELINES.map((timeline) => timeline.id).sort());
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
    assert.equal(summary.timeline, "Standard timeline");
    assert.match(summary.range, /^\$[\d,]+ to \$[\d,]+$/);
    assert.match(summary.weeks, /^\d+ to \d+ weeks$/);
    assert.equal(summary.text, `${summary.headline}. ${summary.features}. ${summary.timeline}. Indicative range ${summary.range}, about ${summary.weeks}.`);
  });

  it("writes the Georgian summary with the same prices and weeks", () => {
    const english = describeEstimate(input, result, i18n.en);
    const georgian = describeEstimate(input, result, i18n.ka);
    const prices = (text) => text.match(/\$[\d,]+/g);
    assert.deepEqual(prices(georgian.range), prices(english.range));
    assert.deepEqual(georgian.weeks.match(/\d+/g), english.weeks.match(/\d+/g));
    for (const key of ["headline", "features", "timeline", "range", "weeks", "text"]) {
      assert.match(georgian[key], GEORGIAN, key);
    }
    assert.equal(georgian.headline, "ბიზნეს ვებსაიტი, 6 გვერდი");
    assert.match(georgian.range, /^\$[\d,]+-დან \$[\d,]+-მდე$/);
    assert.match(georgian.weeks, /^\d+–\d+ კვირა$/);
  });

  it("leaves no {mark} unfilled, for any estimate, in any language", () => {
    for (const code of LOCALES) {
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
