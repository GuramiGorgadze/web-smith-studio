// The words of each section of the site, grouped by the component that shows them.
// Marks inside strings: {name} is a value filled in by the code, <tag>words</tag> is wrapped by the code
// (a link, bold). `titleLead` and `titleHighlight` are the plain and the gradient part of a heading.

export const sections = {
  hero: {
    eyebrow: "web design and development studio",
    titleLead: "Websites that work as",
    titleHighlight: "hard as you do.",
    lead: "{name} designs and builds fast, beautiful, conversion-focused websites for local shops and international brands, from the first sketch to launch day and long after.",
    primary: "Start your project",
    secondary: "See our work",
    legal: "By continuing, you agree to our <terms>Terms</terms> and <privacy>Privacy Policy</privacy>.",
  },

  stats: {
    label: "Studio commitments",
  },

  techMarquee: {
    eyebrow: "the tools we build with",
    label: "Technologies we use",
  },

  servicesGrid: {
    eyebrow: "what we build",
    title: "Everything a modern business site needs.",
    description:
      "From a single landing page to a full business or organization website, every project is designed around one question: how will this help your business grow?",
    cta: "All services",
  },

  serviceDetail: {
    idealFor: "Ideal for",
    startingAt: "Starting at",
    cta: "Start with this",
  },

  processTour: {
    eyebrow: "how we work",
    title: "Discover, design, deliver.",
    description:
      "A clear, six-step path from your first idea to a live website, with a real preview to react to long before launch day.",
    cta: "Start with a free call",
    illustration: "Illustration for step {number}: {title}",
  },

  workShowcase: {
    eyebrow: "selected work",
    title: "Real sites, live for real businesses.",
    description:
      "Designed, built and launched by us, from the first sketch to launch day. Open a project to see the brief, our approach and what the site does. More case studies are on the way.",
    cta: "View all work",
  },

  estimator: {
    eyebrow: "try it, no account needed",
    title: "Estimate your project in a minute.",
    description:
      "Pick what you are building and see a realistic price range and timeline instantly. It is the same method we use when we write a fixed quote.",
  },

  estimatorTool: {
    typeLegend: "What are you building?",
    typeAria: "Type of website",
    sizeLegend: "How big is it?",
    pagesLabel: "Number of pages",
    singlePage: "A landing page is a single, focused page.",
    pagesIncluded: "{included} pages are included. Each extra page adds {price}.",
    extrasLegend: "Anything extra?",
    result: {
      title: "your indicative estimate",
      rangeDash: " to ",
      announce: "Estimated price {low} to {high}, delivered in {weeksLow} to {weeksHigh} weeks.",
      typical: "Typical delivery:",
      weeks: "{low} to {high} weeks",
      split: "where the budget goes",
      cta: "Get a fixed quote",
      how: "How is this calculated?",
      note: "An indicative range, not a quote. We confirm a fixed price in writing after a free call. See also our <packages>packages</packages>.",
    },
    info: {
      title: "How the estimate works",
      description:
        "We start with a base price for the type of site, add any pages beyond the included ones, then your add-ons. The range allows for content and complexity that only a conversation can settle.",
      startingPrices: "Starting prices",
      included: { one: "{count} page included", other: "{count} pages included" },
      addOns: "Add-ons",
    },
  },

  pricing: {
    eyebrow: "simple, honest pricing",
    title: "Clear packages. No surprise invoices.",
    description:
      "Start from a package, then shape it around your business. Every project ends with a fixed, written quote you approve before any work begins.",
  },

  pricingTable: {
    careTitle: "Add a monthly care plan",
    footnote:
      "Prices are starting points in US dollars. Your fixed quote depends on pages, features and timing. Want to see a range first? <estimator>Try the live estimator</estimator>.",
  },

  // Words around the price on a package card. `fromBefore` and `fromAfter` are two halves of "from $300":
  // some languages put the word after the number.
  pricingCard: {
    fromBefore: "from",
    fromAfter: "",
    oneTime: "one-time",
    careIncluded: "Care plan included",
    careOptional: "Optional care plan",
    carePerMonth: "{price} per month after launch",
  },

  pricingPrinciples: {
    eyebrow: "how pricing works",
    title: "You know the number before we start.",
    description:
      "No hourly meters, no vague retainers. Just a clear scope, a fixed price and payments tied to progress you can see.",
  },

  faq: {
    eyebrow: "questions, answered",
    title: "Everything you want to know before we start.",
    description: "Straight answers about price, timing and ownership. Something missing? Ask us and we will reply in plain English.",
    ask: "Ask us anything",
  },

  // The closing call to action. `work`, `project` and `about` change only the parts they list.
  finalCta: {
    eyebrow: "ready when you are",
    titleLead: "The brief is yours.",
    titleHighlight: "The build is ours.",
    description:
      "Tell us about your business and what you want your website to do. We will talk it through on a free call and follow up with a fixed, written quote.",
    primary: { label: "Start your project", to: "/contact" },
    // The pricing page is switched off for now (see src/routes/router.jsx), so this points at the estimator.
    secondary: { label: "Estimate your project", to: "/#estimator" },
    steps: [
      { title: "Tell us about your business", text: "A short form: what you do, who you serve and what you need the site to achieve." },
      { title: "We talk it through", text: "A free 30-minute call to shape the plan together. No pressure, no jargon." },
      { title: "You get a fixed quote", text: "Scope, price and timeline in writing, before any work begins." },
    ],
    variants: {
      about: { eyebrow: "work with us" },
      work: {
        eyebrow: "your project could be next",
        titleLead: "Your business could be",
        titleHighlight: "on this page.",
        description:
          "Tell us what you are building. We will talk it through on a free call and follow up with a fixed, written quote.",
        secondary: { label: "See services", to: "/services" },
      },
      project: {
        eyebrow: "like what you see?",
        titleLead: "Let's plan",
        titleHighlight: "your project.",
        description:
          "Tell us about your business and we will talk it through on a free call, then follow up with a fixed, written quote.",
        secondary: { label: "See services", to: "/services" },
      },
    },
  },

  included: {
    eyebrow: "included in every project",
    title: "The essentials are never an upsell.",
    description:
      "Whatever the package, these come standard, because a website that is slow, hard to read or hard to find is not finished.",
  },

  values: {
    eyebrow: "what we stand for",
    title: "Six principles behind every project.",
    description: "They are not slogans for a wall. They decide how we scope, design, build and talk to you.",
  },

  disciplines: {
    eyebrow: "what we bring",
    title: "Strategy, design, engineering and care. Under one roof.",
    description:
      "One small team means no hand-offs, no finger-pointing and one person who always knows the full picture of your project.",
    cta: "Explore our services",
  },

  aboutStory: {
    glance: "The studio at a glance",
    cta: "Say hello",
  },

  // Project cards and case-study pages. {project} is the project's name.
  work: {
    concept: "Concept",
    conceptProject: "Concept project",
    clientProject: "Client project",
    projectsHeading: "Projects",
    filterLabel: "Filter projects by type",
    allWork: "All work",
    year: "Year",
    services: "Services",
    type: "Type",
    windowLabel: "{project} website concept",
    thumbLabel: "Illustration of the {project} website concept",
    // For client projects, which show a real screenshot and a link to the live site.
    liveWindowLabel: "The {project} website",
    screenshotLabel: "Screenshot of the {project} home page",
    visit: "Visit the live site",
    detailsLabel: "Project details",
    brief: "The brief",
    approach: "Our approach",
    summaryLabel: "Project summary",
    highlights: "Highlights",
    builtWith: "Built with",
    conceptNote:
      "<strong>A concept, not a client.</strong> {project} is a fictional business. It shows how we would approach a project like this; it does not describe a real client or real results.",
    conceptNoticeLabel: "About concept projects",
    next: "next project",
    seeAll: "See all projects",
  },
};
