// `slug`, `icon`, `from`, `recurring` and `contactType` are the same in every language; the rest is words.
// `recurring: "monthly"` means the price is per month. Keep the `from` prices in step with src/lib/estimator.js.

export const services = [
  {
    slug: "business-websites",
    icon: "layout",
    eyebrow: "most popular",
    title: "Business and organization websites",
    summary: "Fast, polished multi-page sites for businesses, organizations and growing brands.",
    description:
      "Everything a business or organization needs to look credible and get found: a custom design, clear messaging, mobile-first pages, local search set-up and a simple way to update your own content. Add a blog or news section, more languages and copywriting whenever you need them.",
    bullets: [
      "Custom design, never a template",
      "Up to 25 pages with clear navigation",
      "Content editor, blog and news on request",
      "Local SEO and Google Business set-up",
    ],
    idealFor: "Cafés, clinics, studios, consultants, trades, schools and non-profits.",
    from: 700,
    contactType: "business",
  },
  {
    slug: "landing-pages",
    icon: "rocket",
    eyebrow: "one page, one goal",
    title: "Landing pages",
    summary: "One focused page that turns visitors into calls, sign-ups and inquiries.",
    description:
      "For a launch, a campaign, an event or a new business that needs to be online fast: one carefully structured page with a single clear call to action, a contact form and everything set up so people can find and share it.",
    bullets: [
      "Custom design built around one goal",
      "Contact form with email alerts",
      "On-page SEO and social sharing cards",
      "Live in about 1 to 2 weeks",
    ],
    idealFor: "Launches, campaigns, events, single products and new businesses.",
    from: 300,
    contactType: "landing",
  },
  {
    slug: "redesigns",
    icon: "brush",
    eyebrow: "fresh start",
    title: "Redesigns and migrations",
    summary: "Modernize an aging site without losing the rankings you earned.",
    description:
      "We audit what works, rebuild what does not and handle the move carefully: redirects, content migration and search-ranking protection so launch day is a non-event.",
    bullets: [
      "Free review of your current site",
      "Content and URL migration plan",
      "301 redirects and ranking checks",
      "New design, faster platform",
    ],
    idealFor: "Businesses with a dated, slow or hard-to-edit website.",
    from: 550,
    contactType: "redesign",
  },
  {
    slug: "seo-performance",
    icon: "gauge",
    eyebrow: "be found, be fast",
    title: "SEO and performance",
    summary: "Technical SEO and Core Web Vitals tuning that you can measure.",
    description:
      "Speed, structure and search visibility built in from day one or tuned onto an existing site: image and font optimization, schema markup, sitemaps and monthly reporting in plain language.",
    bullets: [
      "Core Web Vitals tuning",
      "Structured data and sitemaps",
      "Keyword and content planning",
      "Monthly plain-English reports",
    ],
    idealFor: "Sites that look good but are slow or hard to find.",
    from: 200,
    contactType: "seo",
  },
  {
    slug: "care-plans",
    icon: "lifebuoy",
    eyebrow: "after launch",
    title: "Care and growth plans",
    summary: "Hosting, updates, backups and monthly improvements, handled for you.",
    description:
      "A small monthly plan that keeps your site secure, fast and current: uptime monitoring, software updates, backups, content changes and a monthly improvement based on real analytics.",
    bullets: [
      "Uptime and security monitoring",
      "Updates and daily backups",
      "Small content changes included",
      "Quarterly growth review",
    ],
    idealFor: "Anyone who would rather run their business than their website.",
    from: 25,
    recurring: "monthly",
    contactType: "care",
  },
];
