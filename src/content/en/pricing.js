// Starting prices in USD. Keep these in step with src/lib/estimator.js.
// `id`, `from`, `care`, `type` and `featured` are the same in every language; the rest is words.

export const pricingTiers = [
  {
    id: "launch",
    name: "Launch",
    tagline: "One focused page that turns visitors into inquiries.",
    from: 1200,
    care: 120,
    cta: "Start with Launch",
    type: "landing",
    featured: false,
    features: [
      "Single custom-designed landing page",
      "Mobile-first and fully responsive",
      "Contact or booking form with email alerts",
      "On-page SEO and social sharing cards",
      "Delivered in about 1 to 2 weeks",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "A complete website for a local or growing brand.",
    from: 2800,
    care: 180,
    cta: "Start with Business",
    type: "business",
    featured: true,
    badge: "Most popular",
    features: [
      "Up to 5 custom pages (more can be added)",
      "Content editor so you can update text and images",
      "Local SEO and Google Business set-up",
      "Analytics, forms and newsletter hook-up",
      "Delivered in about 3 to 5 weeks",
    ],
  },
  {
    id: "commerce",
    name: "Store and apps",
    tagline: "Online stores, portals and custom web software.",
    from: 6500,
    care: 300,
    cta: "Plan my project",
    type: "store",
    featured: false,
    features: [
      "Storefront or app built around your workflow",
      "Secure payments, accounts and dashboards",
      "Integrations with your existing tools",
      "Performance and security hardening",
      "Delivered in about 6 to 10 weeks",
    ],
  },
];

export const carePlanNote =
  "Care plans cover hosting, security updates, daily backups, uptime monitoring and small content changes.";

// Shown on the pricing page under "How pricing works". These are sample terms: edit them to match how you really work.
export const pricingPrinciples = [
  {
    icon: "shield",
    title: "A fixed price, in writing",
    body: "After your free call you receive a scope and a price you can hold us to. If you want something added later, we agree the cost before any work happens.",
  },
  {
    icon: "gauge",
    title: "Pay as the work progresses",
    body: "A deposit starts the project and the balance follows milestones you can see, so you never pay far ahead of the work.",
  },
  {
    icon: "key",
    title: "No lock-in, ever",
    body: "Everything is in your name and care plans run month to month. You stay because the service is good, not because you are stuck.",
  },
];
