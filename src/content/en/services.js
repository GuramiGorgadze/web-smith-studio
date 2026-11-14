// `slug`, `icon`, `from`, `recurring` and `contactType` are the same in every language; the rest is words.
// `recurring: "monthly"` means the price is per month.

export const services = [
  {
    slug: "business-websites",
    icon: "layout",
    eyebrow: "most popular",
    title: "Business websites",
    summary: "Fast, polished multi-page sites for local businesses and growing brands.",
    description:
      "Everything a business needs to look credible and get found: a custom design, clear messaging, mobile-first pages, local search set-up and a simple way to update your own content.",
    bullets: [
      "Custom design, never a template",
      "Up to 25 pages with clear navigation",
      "Editable content (optional CMS)",
      "Local SEO and Google Business set-up",
    ],
    idealFor: "Cafés, clinics, studios, agencies, consultants and trades.",
    from: 2800,
    contactType: "business",
  },
  {
    slug: "online-stores",
    icon: "store",
    eyebrow: "sell online",
    title: "Online stores",
    summary: "Storefronts that load quickly and convert on every screen size.",
    description:
      "Product pages, search and filters, secure checkout and order emails, all built around how your customers actually shop. We connect the payment, shipping and tax tools you already use.",
    bullets: [
      "Catalog with variants and stock",
      "Secure card and wallet payments",
      "Shipping, tax and discount rules",
      "Order notifications and receipts",
    ],
    idealFor: "Independent brands, boutiques, makers and wholesalers.",
    from: 6500,
    contactType: "store",
  },
  {
    slug: "web-apps",
    icon: "app",
    eyebrow: "custom software",
    title: "Web apps and portals",
    summary: "Client portals, booking systems and dashboards that fit your workflow.",
    description:
      "When off-the-shelf tools stop fitting, we build the missing piece: secure logins, role-based dashboards, online booking, document sharing and integrations with the systems you already use.",
    bullets: [
      "Secure sign-in and roles",
      "Dashboards and reporting",
      "Bookings, forms and approvals",
      "API and third-party integrations",
    ],
    idealFor: "Service firms, schools, logistics and growing teams.",
    from: 9000,
    contactType: "webapp",
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
    from: 2200,
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
    from: 900,
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
    from: 120,
    recurring: "monthly",
    contactType: "care",
  },
];
