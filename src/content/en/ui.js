// Small pieces of interface text that several components share: menus, labels for screen readers, prices.
// Marks inside strings: {name} is a value filled in by the code, <tag>words</tag> is wrapped by the code.
// {name}, {email}, {responseTime} and {founded} always work; they come from the site facts.

export const ui = {
  skipLink: "Skip to content",
  logoHome: "{name}, home",
  newTab: " (opens in a new tab)",
  close: "Close",
  closeMenu: "Close menu",
  openMenu: "Open menu",

  nav: {
    primary: "Primary",
    mobile: "Mobile",
    footer: "Footer",
    popular: "Popular pages",
    siteNavigation: "Site navigation",
  },

  servicesMenu: {
    prompt: "Not sure what you need?",
    link: "Talk to us, it is free",
  },

  // Read out by screen readers for the pop-up messages (toasts).
  toast: {
    region: "Notifications",
    close: "Close notification",
  },

  theme: {
    change: "Change color theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },

  // The language switch. Each language is written in its own language (see src/i18n/locales.js).
  language: {
    label: "Language",
  },

  footer: {
    copyright: "© {year} {name}. All rights reserved.",
  },

  // {price} is a formatted amount such as $2,800.
  prices: {
    from: "from {price}",
    fromMonthly: "from {price}/mo",
    perMonth: "/mo",
  },

  notFound: {
    seoTitle: "Page not found",
    title: "This page does not exist.",
    text: "The link may be old or mistyped. Head back to the home page, or jump straight to one of the pages below.",
    home: "Back to home",
    contact: "Contact us",
    popular: "Popular pages",
    projectTitle: "We could not find that project.",
    projectText: "It may have been renamed or removed. You can browse every project on the work page.",
  },

  // Used in search results and structured data.
  seo: {
    home: "Home",
    areaServed: "Worldwide",
    serviceTypes: ["Website design", "Web development", "E-commerce development", "Web app development"],
  },
};
