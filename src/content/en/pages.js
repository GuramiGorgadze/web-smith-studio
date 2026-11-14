// Titles, descriptions and hero text of each page. `seoTitle` and `seoDescription` are what search results
// and link previews show. Marks inside strings: {name} is a value filled in by the code, <tag>words</tag> is
// wrapped by the code. `titleLead` and `titleHighlight` are the plain and the gradient part of the heading.

export const pages = {
  services: {
    seoTitle: "Services",
    seoDescription:
      "Landing pages, business and organization websites, redesigns, SEO and care plans from Web Smith Studio. Custom design, fixed quotes and full ownership.",
    eyebrow: "what we build",
    titleLead: "Landing pages and websites",
    titleHighlight: "built to earn their keep.",
    description:
      "From a single landing page to a multilingual organization website, every project starts with your goals and ends with a site you own, understand and can grow.",
    primary: "Start a project",
    // Goes to the estimator on the home page while the pricing page is switched off.
    secondary: "Estimate your project",
    sectionLabel: "Our services",
    jump: "Jump to a service",
  },

  work: {
    seoTitle: "Work",
    seoDescription:
      "Websites designed and built by Web Smith Studio, including FITOFARM-2024: a four-language site for a Georgian maker of natural dietary supplements.",
    eyebrow: "selected work",
    titleLead: "Real websites for",
    titleHighlight: "real businesses.",
    description:
      "Open a project to see the brief, our approach and what the finished site does for the business behind it.",
    sectionLabel: "Projects",
    // Shown above the projects only while some of them are concepts (`isConcept` in projects.js).
    notice:
      "<strong>These are concept projects.</strong> We are a new studio, so each one is a fictional business that we designed and planned exactly as we would for a client. Real case studies will replace them as we launch.",
  },

  project: {
    // {project} is the project's name.
    conceptTitle: "{project} (concept)",
  },

  // The pricing page is switched off for now (see src/routes/router.jsx); its words are kept for when it returns.
  pricing: {
    seoTitle: "Pricing",
    seoDescription:
      "Clear website packages from Web Smith Studio: landing pages from $300 and business and organization websites from $700. Fixed, written quotes.",
    eyebrow: "pricing",
    titleLead: "Fair prices.",
    titleHighlight: "No surprise invoices.",
    description:
      "Start from a package, shape it around your business and approve a fixed, written quote before any work begins.",
    primary: "Estimate my project",
    secondary: "Talk to us",
    packagesHeading: "Packages",
  },

  about: {
    seoTitle: "About",
    seoDescription:
      "Web Smith Studio is a new, remote-first web design studio. Meet the principles behind our work: craft over templates, plain language, speed, accessibility and honest pricing.",
    eyebrow: "about us",
    titleLead: "We build websites the way",
    titleHighlight: "we would want ours built.",
    description:
      "Web Smith Studio is a new, remote-first web design studio. We pair careful design with clean engineering, for businesses that want a site they can be proud of.",
    primary: "Start a project",
    secondary: "See our work",
  },

  contact: {
    seoTitle: "Contact",
    seoDescription:
      "Tell Web Smith Studio about your project. We reply {responseTime} with next steps and a time for a free 30-minute call.",
    eyebrow: "contact",
    titleLead: "Tell us about",
    titleHighlight: "your project.",
    description:
      "A few details are enough to get started. We reply {responseTime} with next steps and a time for your free 30-minute call.",
    sectionLabel: "Contact us",
  },

  legal: {
    eyebrow: "legal",
    onThisPage: "On this page",
    updated: "Last updated {date}",
    contact: "Questions about this page? Email us at <mail>{email}</mail>.",
  },
};
