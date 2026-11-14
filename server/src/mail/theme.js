// Design tokens for the emails. They come from the website (src/styles/_theme.scss), so an email
// and the site feel like one brand: deep near-black base, electric blue to lavender accents.
//
// Emails cannot use CSS variables, so every role is a plain hex value. Each role has a light and a dark
// value, and the dark values are written out by emailStyles() as a prefers-color-scheme block. Clients
// that ignore it (or invert colors themselves) still get a readable light design.

export const fontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans Georgian', Sylfaen, Arial, sans-serif";

export const brand = {
  deep: "#02011d",
  blue: "#3a3dfb",
  sky: "#4a7efd",
  indigo: "#4f53fc",
  periwinkle: "#7c7afb",
  lavender: "#b8b4f9",
  ink: "#0d0c10",
};

/** The brand gradient as a CSS background-image, with a solid fallback for clients that ignore gradients. */
export const gradientBar = `linear-gradient(90deg, ${brand.sky} 0%, ${brand.blue} 48%, ${brand.periwinkle} 100%)`;

export const palette = {
  light: {
    page: "#f1f0fa",
    card: "#ffffff",
    soft: "#f6f6fd",
    border: "#e1dff0",
    text: "#0d0c10",
    muted: "#4f4e66",
    subtle: "#65647c",
    accent: "#3a3dfb",
    accentBar: "#7c7afb",
    pillBg: "#eceaff",
    pillText: "#2a2cc4",
    pillBorder: "#d9d6fb",
    warnBg: "#fff4d9",
    warnText: "#7a4600",
    warnBorder: "#f0cf85",
    button: "#3a3dfb",
    buttonText: "#ffffff",
    outlineBorder: "#b9b7e6",
  },
  dark: {
    page: "#0d0c10",
    card: "#17161f",
    soft: "#1e1d29",
    border: "#2d2c3f",
    text: "#f5f5fa",
    muted: "#b9b8cd",
    subtle: "#9d9cb6",
    accent: "#b8b4f9",
    accentBar: "#7c7afb",
    pillBg: "#2a2954",
    pillText: "#dcd9ff",
    pillBorder: "#3b3a70",
    warnBg: "#3a2b08",
    warnText: "#fdd887",
    warnBorder: "#6a5014",
    button: "#4f53fc",
    buttonText: "#ffffff",
    outlineBorder: "#4a4968",
  },
  // The header band is dark in both modes, like the site's navigation bar.
  header: {
    background: "#0d0c10",
    text: "#ffffff",
    muted: "#b8b4f9",
    tagBorder: "rgba(255,255,255,0.22)",
    tagText: "#e4e2ff",
  },
};

/**
 * Which CSS class carries which role in dark mode. Elements get these classes next to their
 * inline light-mode styles, and the block below overrides them with `!important`.
 */
export const darkTargets = [
  { selector: ".bg-page", property: "background-color", role: "page" },
  { selector: ".bg-card", property: "background-color", role: "card" },
  { selector: ".bg-soft", property: "background-color", role: "soft" },
  { selector: ".bg-pill", property: "background-color", role: "pillBg" },
  { selector: ".bg-warn", property: "background-color", role: "warnBg" },
  { selector: ".bg-btn", property: "background-color", role: "button" },
  { selector: ".bd", property: "border-color", role: "border" },
  { selector: ".bd-pill", property: "border-color", role: "pillBorder" },
  { selector: ".bd-warn", property: "border-color", role: "warnBorder" },
  { selector: ".bd-bar", property: "border-color", role: "accentBar" },
  { selector: ".bd-outline", property: "border-color", role: "outlineBorder" },
  { selector: ".t-text", property: "color", role: "text" },
  { selector: ".t-muted", property: "color", role: "muted" },
  { selector: ".t-subtle", property: "color", role: "subtle" },
  { selector: ".t-accent", property: "color", role: "accent" },
  { selector: ".t-pill", property: "color", role: "pillText" },
  { selector: ".t-warn", property: "color", role: "warnText" },
  { selector: ".t-btn", property: "color", role: "buttonText" },
];

/** The <style> block: resets, the phone layout and the dark-mode overrides. */
export function emailStyles() {
  const rules = darkTargets.map(({ selector, property, role }) => `${selector}{${property}:${palette.dark[role]} !important}`);

  // Outlook.com and the Outlook apps recolor with attributes instead of the media query.
  const outlook = darkTargets.map(({ selector, property, role }) => {
    const attribute = property === "background-color" ? "data-ogsb" : "data-ogsc";
    return `[${attribute}] ${selector}{${property}:${palette.dark[role]} !important}`;
  });

  return [
    "body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}",
    "table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}",
    "img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}",
    "a{text-decoration:none}",
    "a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}",
    "@media only screen and (max-width:640px){",
    ".outer{padding:16px 10px 28px !important}",
    ".px{padding-left:22px !important;padding-right:22px !important}",
    ".h1{font-size:27px !important;line-height:35px !important}",
    ".btn-wrap,.btn-wrap table{width:100% !important}",
    ".btn{display:block !important;text-align:center !important}",
    ".hide-sm{display:none !important}",
    "}",
    `@media (prefers-color-scheme:dark){${rules.join("")}}`,
    outlook.join(""),
  ].join("\n");
}
