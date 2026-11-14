// The words of the project estimator. The numbers (prices, pages, weeks) are in src/lib/estimator.js; these
// entries are matched to them by id. Marks inside strings: {name} is a value filled in by the code.

export const estimatorText = {
  types: {
    landing: { label: "Landing page", blurb: "One focused page that turns visitors into inquiries." },
    business: { label: "Business website", blurb: "A complete multi-page site for a business or organization." },
  },

  features: {
    cms: { label: "Content editor (CMS)", hint: "Update text and images yourself" },
    blog: { label: "Blog and news", hint: "Articles, categories and RSS" },
    multilingual: { label: "Multiple languages", hint: "Translated pages and language switcher" },
    copywriting: { label: "Copywriting", hint: "We write the words for your pages" },
    analytics: { label: "Analytics and tracking", hint: "Privacy-friendly stats and goals" },
  },

  // Where the budget goes (the bars under the price).
  breakdown: {
    design: "Design",
    build: "Build",
    extras: "Features",
    launch: "Launch and QA",
  },

  // Pieces of the one-line summary that travels with the visitor's message.
  headline: "{type}, {pages}",
  pages: { one: "{count} page", other: "{count} pages" },
  priceRange: "{low} to {high}",
  weeksRange: "{low} to {high} weeks",
  noFeatures: "No extra features",
  summary: "{headline}. {features}. Indicative range {range}, about {weeks}.",
};
