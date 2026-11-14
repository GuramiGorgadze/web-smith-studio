// The words of the project estimator. The numbers (prices, pages, weeks) are in src/lib/estimator.js; these
// entries are matched to them by id. Marks inside strings: {name} is a value filled in by the code.

export const estimatorText = {
  types: {
    landing: { label: "Landing page", blurb: "One focused page that turns visitors into inquiries." },
    business: { label: "Business website", blurb: "A complete multi-page site for a local or growing brand." },
    store: { label: "Online store", blurb: "Catalog, secure checkout and order management." },
    webapp: { label: "Web app or portal", blurb: "Logins, dashboards, bookings or custom workflows." },
  },

  features: {
    cms: { label: "Content editor (CMS)", hint: "Update text and images yourself" },
    booking: { label: "Online booking", hint: "Calendar, reminders and payments" },
    blog: { label: "Blog and news", hint: "Articles, categories and RSS" },
    multilingual: { label: "Multiple languages", hint: "Translated pages and language switcher" },
    branding: { label: "Logo and brand refresh", hint: "Colors, type and a simple brand guide" },
    copywriting: { label: "Copywriting", hint: "We write the words for your pages" },
    analytics: { label: "Analytics and tracking", hint: "Privacy-friendly stats and goals" },
  },

  timelines: {
    standard: "Standard",
    priority: "Priority",
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
  timelineName: "{label} timeline",
  summary: "{headline}. {features}. {timeline}. Indicative range {range}, about {weeks}.",
};
