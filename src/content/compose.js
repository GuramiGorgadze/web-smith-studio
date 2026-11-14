/**
 * Puts the files of one language together into the single object the site reads with useContent().
 * Every language goes through this one function, so they all have exactly the same shape.
 *
 * `m` holds the modules of the language folder (see src/content/en/index.js); `facts` is the language-free
 * studio data from src/data/site.js (name, address, email, social links).
 * Plain JavaScript with no imports, so the tests can use it.
 */
export function composeContent(locale, m, facts) {
  return {
    locale,
    site: { ...facts, ...m.site.siteText },
    ui: m.ui.ui,
    sections: m.sections.sections,
    pages: m.pages.pages,
    navigation: {
      primary: m.navigation.primaryNav,
      cta: m.navigation.navCta,
      footerColumns: m.navigation.footerColumns,
      legalLinks: m.navigation.legalLinks,
    },
    services: m.services.services,
    included: m.included.included,
    process: { steps: m.process.processSteps, screens: m.process.tourScreens },
    projects: { categories: m.projects.projectCategories, items: m.projects.projects },
    pricing: {
      tiers: m.pricing.pricingTiers,
      carePlanNote: m.pricing.carePlanNote,
      principles: m.pricing.pricingPrinciples,
    },
    faqs: { items: m.faqs.faqs, aside: m.faqs.faqAside },
    about: { story: m.about.aboutStory, facts: m.about.aboutFacts },
    values: m.values.values,
    disciplines: m.values.disciplines,
    stats: m.stats.stats,
    contact: {
      projectTypes: m.contact.projectTypes,
      budgetOptions: m.contact.budgetOptions,
      timelineOptions: m.contact.timelineOptions,
      nextSteps: m.contact.nextSteps,
      ...m.contact.contactText,
    },
    legal: m.legal.legalDocuments,
    estimator: m.estimator.estimatorText,
  };
}
