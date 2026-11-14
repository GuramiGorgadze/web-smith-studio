import { css, html, raw } from "./html.js";
import { fontStack, palette } from "./theme.js";

// Building blocks for the emails. Every one is a table with inline styles, because that is what
// Gmail, Outlook and Apple Mail all render the same way. Each block also carries the classes that
// emailStyles() recolors in dark mode.

const L = palette.light;
const isLatin = (locale) => locale !== "ka";

const base = { "font-family": fontStack };

/** Empty vertical space. */
export function spacer(height) {
  return html`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="${height}" style="${css({ height: `${height}px`, "font-size": "0", "line-height": "0" })}">&nbsp;</td></tr></table>`;
}

/** Small colored label above a heading or section. Capitals and spacing only for Latin text. */
export function eyebrow(text, locale, { margin = "0 0 10px" } = {}) {
  const latin = isLatin(locale);
  // Georgian letters have a smaller x-height than Latin ones, so the small labels get a pixel more.
  return html`<p class="t-accent" style="${css({ ...base, margin, "font-size": latin ? "13px" : "14px", "line-height": "18px", "font-weight": "700", color: L.accent, "letter-spacing": latin ? "0.08em" : "0.01em" })}">${latin ? text.toUpperCase() : text}</p>`;
}

/** Heading for one section of the email. */
export function sectionTitle(text, locale) {
  return eyebrow(text, locale, { margin: "0 0 12px" });
}

/** The big heading at the top of the email. */
export function title(text, locale) {
  return html`<h1 class="h1 t-text" style="${css({ ...base, margin: "0 0 8px", "font-size": "32px", "line-height": "40px", "font-weight": "700", color: L.text, "letter-spacing": isLatin(locale) ? "-0.02em" : "0", "word-break": "break-word" })}">${text}</h1>`;
}

/** A paragraph. `tone` picks the text color role. */
export function paragraph(content, { tone = "muted", size = 16, lineHeight = 26, margin = "0 0 16px" } = {}) {
  const role = tone === "text" ? "text" : tone === "subtle" ? "subtle" : "muted";
  return html`<p class="${`t-${role}`}" style="${css({ ...base, margin, "font-size": `${size}px`, "line-height": `${lineHeight}px`, color: L[role], "word-break": "break-word" })}">${content}</p>`;
}

/** A text link with an underline, so it does not rely on color alone. */
export function link(href, text) {
  return html`<a href="${href}" class="t-accent" style="${css({ color: L.accent, "text-decoration": "underline", "word-break": "break-all" })}">${text}</a>`;
}

/** A rounded tag such as a project type or a budget. `warn` is for anything urgent. */
export function pill(text, { tone = "brand" } = {}) {
  const warn = tone === "warn";
  const colors = warn
    ? { background: L.warnBg, color: L.warnText, border: L.warnBorder }
    : { background: L.pillBg, color: L.pillText, border: L.pillBorder };
  const classes = warn ? "bg-warn t-warn bd-warn" : "bg-pill t-pill bd-pill";

  return html`<span class="${classes}" style="${css({ ...base, display: "inline-block", margin: "0 8px 8px 0", padding: "6px 14px", "border-radius": "999px", border: `1px solid ${colors.border}`, "background-color": colors.background, color: colors.color, "font-size": "14px", "line-height": "20px", "font-weight": "600" })}">${text}</span>`;
}

/** A row of pills that wraps on narrow screens. */
export function pillRow(items) {
  return html`<div style="margin:20px 0 6px;font-size:0;line-height:0;">${items}</div>`;
}

/**
 * A button that stays a button everywhere: a colored table cell with a padded link inside.
 * It is at least 48px tall and fills the width on phones.
 */
export function button({ href, label, variant = "solid" }) {
  const solid = variant === "solid";
  const cellStyle = solid
    ? { "background-color": L.button, "border-radius": "12px", "mso-padding-alt": "14px 28px" }
    : { border: `1.5px solid ${L.outlineBorder}`, "border-radius": "12px", "mso-padding-alt": "13px 28px" };
  const linkStyle = {
    ...base,
    display: "inline-block",
    padding: solid ? "14px 28px" : "12.5px 28px",
    "font-size": "16px",
    "line-height": "20px",
    "font-weight": "700",
    color: solid ? L.buttonText : L.accent,
    "text-decoration": "none",
    "border-radius": "12px",
  };

  return html`<table role="presentation" class="btn-wrap" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" class="${solid ? "bg-btn" : "bd-outline"}" ${solid ? raw(`bgcolor="${L.button}"`) : ""} style="${css(cellStyle)}"><a href="${href}" class="${solid ? "btn t-btn" : "btn t-accent"}" style="${css(linkStyle)}">${label}</a></td></tr></table>`;
}

/**
 * Label and value rows separated by thin lines. `rows` is a list of [label, value].
 * Pass `closed: false` inside a box that already has its own bottom edge.
 */
export function detailTable(rows, { closed = true } = {}) {
  const last = rows.length - 1;
  const line = `1px solid ${L.border}`;

  return html`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows.map(
    ([label, value], index) => html`<tr><td class="bd t-subtle" valign="top" width="34%" style="${css({ ...base, padding: "14px 16px 14px 0", "border-top": line, "border-bottom": closed && index === last ? line : undefined, "font-size": "14px", "line-height": "22px", "font-weight": "600", color: L.subtle })}">${label}</td><td class="bd t-text" valign="top" style="${css({ ...base, padding: "13px 0", "border-top": line, "border-bottom": closed && index === last ? line : undefined, "font-size": "16px", "line-height": "24px", color: L.text, "word-break": "break-word" })}">${value}</td></tr>`,
  )}</table>`;
}

/** A softly tinted box with a small title, for things like the estimate. */
export function panel({ heading, children, locale }) {
  return html`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-soft bd" bgcolor="${L.soft}" style="${css({ "background-color": L.soft, border: `1px solid ${L.border}`, "border-radius": "14px", "border-collapse": "separate" })}"><tr><td style="padding:18px 20px 6px;">${eyebrow(heading, locale, { margin: "0 0 8px" })}${children}</td></tr></table>`;
}

/** A message block with an accent bar on the left. */
export function quote(content) {
  return html`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="bd-bar" style="${css({ "border-left": `3px solid ${L.accentBar}`, padding: "2px 0 2px 18px" })}"><p class="t-text" style="${css({ ...base, margin: "0", "font-size": "16px", "line-height": "26px", color: L.text, "word-break": "break-word" })}">${content}</p></td></tr></table>`;
}

/** Numbered steps: 01, 02, 03 in the accent color, a bold title and one line of detail. */
export function stepList(steps) {
  return html`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps.map(
    (step, index) => html`<tr><td valign="top" width="44" class="t-accent" style="${css({ ...base, padding: "0 0 22px", "font-size": "15px", "line-height": "24px", "font-weight": "700", color: L.accent })}">${String(index + 1).padStart(2, "0")}</td><td valign="top" style="padding:0 0 22px;"><p class="t-text" style="${css({ ...base, margin: "0 0 4px", "font-size": "16px", "line-height": "24px", "font-weight": "700", color: L.text })}">${step.title}</p><p class="t-muted" style="${css({ ...base, margin: "0", "font-size": "15px", "line-height": "24px", color: L.muted })}">${step.body}</p></td></tr>`,
  )}</table>`;
}

/** An embedded image (`cid:`), with explicit size so nothing jumps when it loads. */
export function image(asset, alt = "") {
  return html`<img src="cid:${asset.cid}" width="${asset.width}" height="${asset.height}" alt="${alt}" style="display:block;border:0;outline:none;text-decoration:none;">`;
}
