import { services } from "./services.js";

// Menus. `to` is a site path without a language ("/work"); the site adds the language when it draws the link.
// In the footer, {email} stands for the studio's address from src/data/site.js.

export const primaryNav = [
  { label: "Services", to: "/services", children: services },
  { label: "Work", to: "/work" },
  { label: "Process", to: "/#process" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
];

export const navCta = { label: "Start a project", to: "/contact" };

export const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "How we work", to: "/#process" },
      { label: "Selected work", to: "/work" },
      { label: "Pricing", to: "/pricing" },
      { label: "Project estimator", to: "/#estimator" },
    ],
  },
  {
    title: "Services",
    links: services.slice(0, 6).map((service) => ({ label: service.title, to: `/services#${service.slug}` })),
  },
  {
    title: "Studio",
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Start a project", to: "/contact" },
      { label: "{email}", href: "mailto:{email}" },
    ],
  },
  {
    title: "Find us",
    // The links themselves (GitHub, LinkedIn ...) are in src/data/site.js and are shown as they are.
    socials: true,
  },
];

export const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];
