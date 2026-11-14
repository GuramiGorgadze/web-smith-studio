// Projects shown on the work pages. FITOFARM-2024 is a real client project; the six concept projects below it
// (fictional businesses that showed our approach before we had client work) are switched off for now.
// Uncomment one to show it again: it is labelled "Concept" everywhere.
// `slug`, `category`, `year`, `isConcept`, `domain`, `image`, `stack`, `layout` and `palette` are the same in
// every language; the rest is words. This file has no imports on purpose: vite.config.js reads the slugs from it.
// `image` is a screenshot in public/projects/; `srcSet` lists every size of it so each screen gets a sharp one.
// Without `image`, the project shows the illustration picked by `layout`, in the colors of `palette`.

export const projectCategories = [
  { id: "all", label: "All work" },
  { id: "local", label: "Local business" },
  // We do not build online stores, so this filter is switched off.
  // { id: "ecommerce", label: "E-commerce" },
  { id: "international", label: "International" },
];

export const projects = [
  {
    slug: "fitofarm-2024",
    name: "FITOFARM-2024",
    category: "local",
    categoryLabel: "Local business",
    year: 2026,
    isConcept: false,
    domain: "fitofarm2024.ge",
    image: {
      src: "/projects/fitofarm-2024-1920.webp",
      srcSet: "/projects/fitofarm-2024-960.webp 960w, /projects/fitofarm-2024-1920.webp 1920w",
      width: 1920,
      height: 1260,
    },
    tagline: "A four-language website for a Georgian maker of natural remedies.",
    summary:
      "Product pages with full leaflets and where-to-buy links, customer ratings, and the whole site in Georgian, English, Russian and German.",
    services: ["Website design", "Development", "Multilingual"],
    stack: ["React", "Vite", "Node.js", "Render"],
    layout: "clinic",
    palette: { bg: "#cfe8d6", surface: "#ffffff", text: "#131418", accent: "#188038", accent2: "#f2c230" },
    brief:
      "FITOFARM-2024 makes plant-based dietary supplements in Tkibuli, in the mountains of western Georgia. They needed a credible home for their products: one place where patients, pharmacists and partners abroad can read the full product information, see where to buy and get in touch.",
    approach: [
      "A page for every product with its key facts at a glance, the full leaflet one tap away and links to the pharmacy chains that stock it.",
      "The whole site in Georgian, English, Russian and German, so visitors and partners abroad read it in their own language.",
      "Customer ratings for each product, a contact form and click-to-call buttons, so people are always one step away from the team.",
    ],
    highlights: ["Four languages", "Product pages with full leaflets", "Where-to-buy links and maps", "Customer ratings and reviews"],
  },

  // The concept projects, switched off for now.
  /*
  {
    slug: "harbor-and-pine-cafe",
    name: "Harbor & Pine Café",
    category: "local",
    categoryLabel: "Local business",
    year: 2026,
    isConcept: true,
    tagline: "A neighborhood café with online ordering.",
    summary: "Menu, opening hours, table booking and click-and-collect for a busy waterfront café.",
    services: ["Business website", "Online ordering", "Local SEO"],
    stack: ["React", "Vite", "Stripe", "Sanity"],
    layout: "cafe",
    palette: { bg: "#1b1410", surface: "#2a1f18", text: "#f6ead8", accent: "#e9a15b", accent2: "#7aa874" },
    brief:
      "A café with loyal regulars wanted to stop losing orders to phone calls and third-party apps, and to look as warm online as it feels in person.",
    approach: [
      "A menu that is easy to scan on a phone while standing in the queue, with allergens and dietary tags.",
      "Click-and-collect ordering with pickup slots so the kitchen is never overwhelmed.",
      "Google Business and local schema set up so the café appears in 'near me' searches.",
    ],
    highlights: ["Mobile-first menu", "Pickup time slots", "Opening-hours automation", "Editable specials board"],
  },
  {
    slug: "northlight-dental",
    name: "Northlight Dental",
    category: "local",
    categoryLabel: "Local business",
    year: 2026,
    isConcept: true,
    tagline: "A calm, trustworthy clinic site with instant booking.",
    summary: "Treatments, team profiles, transparent pricing and a three-tap appointment flow.",
    services: ["Business website", "Online booking", "Accessibility"],
    stack: ["React", "Vite", "Radix UI", "Node.js"],
    layout: "clinic",
    palette: { bg: "#f3f8fb", surface: "#ffffff", text: "#0f2433", accent: "#1f8fc7", accent2: "#5ec5b0" },
    brief:
      "A new clinic needed to feel reassuring to nervous first-time patients while making it effortless to book, reschedule and find prices.",
    approach: [
      "Clear, jargon-free treatment pages with honest price ranges.",
      "A three-step booking flow with reminders to reduce missed appointments.",
      "WCAG-minded design: generous type, strong contrast and full keyboard support.",
    ],
    highlights: ["Three-tap booking", "Team profiles", "Treatment price guide", "High-contrast, large-type mode"],
  },
  {
    slug: "atelier-voss",
    name: "Atelier Voss",
    category: "ecommerce",
    categoryLabel: "E-commerce",
    year: 2026,
    isConcept: true,
    tagline: "An editorial storefront for a small fashion label.",
    summary: "Lookbook storytelling, fast product browsing and a one-page checkout.",
    services: ["Online store", "Brand refresh", "Performance"],
    stack: ["Next.js", "Stripe", "Sanity", "Vercel"],
    layout: "store",
    palette: { bg: "#f6f1ea", surface: "#ffffff", text: "#1d1a17", accent: "#b5532c", accent2: "#3d4a3a" },
    brief:
      "A small label wanted a store that feels like a magazine but checks out like a modern shop, without the weight of a heavy platform theme.",
    approach: [
      "Large editorial imagery loaded progressively so the first view appears instantly.",
      "Product pages built around size guidance and clear shipping and returns information.",
      "A one-page checkout with wallet payments to cut abandoned carts.",
    ],
    highlights: ["Lookbook pages", "Size and fit guide", "Wallet payments", "Lightning-fast image delivery"],
  },
  {
    slug: "kestrel-logistics",
    name: "Kestrel Logistics",
    category: "international",
    categoryLabel: "International",
    year: 2026,
    isConcept: true,
    tagline: "A multilingual corporate site for a freight company.",
    summary: "Service pages in three languages, a quote request flow and a shipment tracking entry point.",
    services: ["Corporate website", "Multilingual", "Web app"],
    stack: ["React", "TypeScript", "Node.js", "Postgres"],
    layout: "corporate",
    palette: { bg: "#0c1722", surface: "#13263a", text: "#e8f0f7", accent: "#3fb6ff", accent2: "#ffb547" },
    brief:
      "A growing freight company needed one consistent, credible website for customers in several countries, with a quote request that sales could act on quickly.",
    approach: [
      "A language-aware structure so every market gets native-feeling pages and correct search tags.",
      "A guided quote form that captures the details sales needs the first time.",
      "A lightweight tracking page that plugs into the company's existing systems.",
    ],
    highlights: ["Three languages", "Guided quote request", "Tracking entry point", "Regional contact routing"],
  },
  {
    slug: "lumen-yoga",
    name: "Lumen Yoga",
    category: "local",
    categoryLabel: "Local business",
    year: 2026,
    isConcept: true,
    tagline: "Class schedules and memberships that sell themselves.",
    summary: "A live class timetable, instructor pages and simple membership sign-up.",
    services: ["Business website", "Booking", "Memberships"],
    stack: ["React", "Vite", "Radix UI", "Stripe"],
    layout: "studio",
    palette: { bg: "#f4efff", surface: "#ffffff", text: "#241b3a", accent: "#7c5cff", accent2: "#ff8fa3" },
    brief:
      "A boutique studio wanted the website to feel like stepping into a class, with a timetable people could actually use on the way to work.",
    approach: [
      "A filterable weekly timetable that works one-handed on a phone.",
      "Instructor and class pages that make first-timers feel welcome.",
      "Membership plans with clear comparison and instant sign-up.",
    ],
    highlights: ["Filterable timetable", "Instructor profiles", "Intro-offer sign-up", "Waitlist notifications"],
  },
  {
    slug: "meridian-capital",
    name: "Meridian Capital",
    category: "international",
    categoryLabel: "International",
    year: 2026,
    isConcept: true,
    tagline: "A precise, high-trust marketing site for a fintech.",
    summary: "Product storytelling, interactive pricing and a documentation-style resources hub.",
    services: ["Marketing website", "Design system", "SEO"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare"],
    layout: "fintech",
    palette: { bg: "#0b0b14", surface: "#15152a", text: "#eceaff", accent: "#7c7afb", accent2: "#4ade80" },
    brief:
      "A fintech wanted a site that explained a complex product simply, earned trust quickly and could be updated by the marketing team without engineers.",
    approach: [
      "A component-based design system so new pages ship in hours, not weeks.",
      "Interactive pricing and ROI explainers that make the product tangible.",
      "Technical SEO foundations: schema, clean URLs and measured Core Web Vitals.",
    ],
    highlights: ["Reusable design system", "Interactive explainers", "Resource library", "Marketing-owned content"],
  },
  */
];
