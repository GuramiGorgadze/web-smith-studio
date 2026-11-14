// Facts about the studio that are the same in every language. Edit here and the whole site follows.
// The words (tagline, description, promises, availability ...) live in src/content/<language>/site.js.

export const site = {
  name: "Web Smith Studio",
  shortName: "Web Smith",
  url: import.meta.env.VITE_SITE_URL || "https://your-domain.com",
  email: import.meta.env.VITE_CONTACT_EMAIL || "hello@your-domain.com",
  founded: 2026,

  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "Instagram", href: "https://www.instagram.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
  ],
};
