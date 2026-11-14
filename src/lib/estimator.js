// Relative import with the extension on purpose: the tests load this file in Node, which has no "@" alias.
import { formatUSD, roundTo } from "./format.js";

/**
 * Indicative project estimator used by the "Try it live" section on the home page.
 * All numbers are USD and intentionally easy to edit: change a value, the UI follows.
 *
 * Only numbers live here. The words (names, blurbs, hints) are in src/content/<language>/estimator.js
 * and are matched to these entries by `id`, so adding a type or a feature means adding it in both places.
 * The package prices in src/content/<language>/pricing.js must match the `base` prices below (the tests check).
 */

export const SITE_TYPES = [
  {
    id: "landing",
    base: 300,
    pagesIncluded: 1,
    perExtraPage: 0,
    minPages: 1,
    maxPages: 1,
    baseWeeks: 1.5,
  },
  {
    id: "business",
    base: 700,
    pagesIncluded: 5,
    perExtraPage: 40,
    minPages: 3,
    maxPages: 25,
    baseWeeks: 3,
  },
];

export const FEATURES = [
  { id: "cms", price: 150, weeks: 0.5 },
  { id: "blog", price: 120, weeks: 0.5 },
  { id: "multilingual", price: 150, weeks: 1 },
  { id: "copywriting", price: 150, weeks: 1 },
  { id: "analytics", price: 50, weeks: 0.25 },
];

export const DEFAULT_ESTIMATE_INPUT = {
  type: "business",
  pages: 6,
  features: ["cms", "analytics"],
};

export function getSiteType(id) {
  return (
    SITE_TYPES.find((type) => type.id === id) ?? SITE_TYPES.find((type) => type.id === DEFAULT_ESTIMATE_INPUT.type)
  );
}

/** Keep the page count inside the range allowed by the chosen site type. */
export function clampPages(typeId, pages) {
  const type = getSiteType(typeId);
  return Math.min(type.maxPages, Math.max(type.minPages, Math.round(pages)));
}

/**
 * @param {{ type: string, pages: number, features: string[] }} input
 * @returns {{ low: number, high: number, weeksLow: number, weeksHigh: number, breakdown: {id: string, value: number}[], pages: number }}
 */
export function estimateProject(input) {
  const type = getSiteType(input.type);
  const pages = clampPages(type.id, input.pages);
  const extraPages = Math.max(0, pages - type.pagesIncluded);
  const chosen = FEATURES.filter((feature) => input.features.includes(feature.id));

  const foundation = type.base;
  const pageCost = extraPages * type.perExtraPage;
  const featureCost = chosen.reduce((sum, feature) => sum + feature.price, 0);
  const total = foundation + pageCost + featureCost;

  const weeks = type.baseWeeks + extraPages * 0.15 + chosen.reduce((sum, feature) => sum + feature.weeks, 0);

  const design = foundation * 0.38 + pageCost * 0.3;
  const build = foundation * 0.52 + pageCost * 0.7;
  const launch = foundation * 0.1;

  // The names of these four parts are in the content files (estimator.breakdown), by id.
  const breakdown = [
    { id: "design", value: design },
    { id: "build", value: build },
    { id: "extras", value: featureCost },
    { id: "launch", value: launch },
  ];

  // The range always spans at least one week, so it never reads "2 to 2 weeks".
  const weeksLow = Math.max(1, Math.round(weeks));
  const weeksHigh = Math.max(weeksLow + 1, Math.round(weeks * 1.3));

  return {
    low: roundTo(total * 0.92),
    high: roundTo(total * 1.18),
    weeksLow,
    weeksHigh,
    breakdown,
    pages,
  };
}

/** Query-string payload used to prefill the contact form from the estimator. */
export function estimateToSearchParams(input, result) {
  const params = new URLSearchParams();
  params.set("type", input.type);
  params.set("pages", String(result.pages));
  if (input.features.length) params.set("features", input.features.join(","));
  params.set("estimate", `${result.low}-${result.high}`);
  return params;
}

/**
 * The reverse of `estimateToSearchParams`. Anything unknown in the URL is ignored and the numbers are
 * recalculated rather than trusted, so an edited or outdated link can never show a made-up price.
 * Returns null when the URL does not describe an estimate (for example `/contact?type=landing`).
 *
 * @param {URLSearchParams} params
 * @returns {{ input: { type: string, pages: number, features: string[] }, result: ReturnType<typeof estimateProject> } | null}
 */
export function searchParamsToEstimate(params) {
  const typeId = params.get("type");
  const pages = Number(params.get("pages"));
  if (!SITE_TYPES.some((type) => type.id === typeId) || !params.get("pages") || !Number.isFinite(pages)) {
    return null;
  }

  const features = (params.get("features") ?? "")
    .split(",")
    .filter((id, index, all) => FEATURES.some((feature) => feature.id === id) && all.indexOf(id) === index);

  const input = { type: typeId, pages: clampPages(typeId, pages), features };
  return { input, result: estimateProject(input) };
}

/**
 * Human-readable summary of an estimate, for the contact form and for the message we receive.
 * It is written in the visitor's language: `i18n` is what useI18n() returns, and the wording comes
 * from content.estimator, so every language controls its own word order.
 */
export function describeEstimate(input, result, i18n) {
  const words = i18n.content.estimator;
  const type = getSiteType(input.type);
  const featureLabels = FEATURES.filter((feature) => input.features.includes(feature.id)).map(
    (feature) => words.features[feature.id].label,
  );

  const headline = i18n.t(words.headline, {
    type: words.types[type.id].label,
    pages: i18n.count(words.pages, result.pages),
  });
  const range = i18n.t(words.priceRange, { low: formatUSD(result.low), high: formatUSD(result.high) });
  const weeks = i18n.t(words.weeksRange, { low: result.weeksLow, high: result.weeksHigh });
  const features = featureLabels.length ? featureLabels.join(", ") : words.noFeatures;

  return {
    headline,
    range,
    weeks,
    features,
    // One line per fact: used in the email body and in the payload sent to a form service.
    text: i18n.t(words.summary, { headline, features, range, weeks }),
  };
}
