import { image } from "./components.js";
import { logo } from "./assets.js";
import { css, html, raw } from "./html.js";
import { brand, emailStyles, fontStack, gradientBar, palette } from "./theme.js";

const L = palette.light;
const H = palette.header;

/** "Web Smith Studio" becomes ["Web Smith", "Studio"] for the two-tone wordmark. */
function splitName(siteName) {
  const words = siteName.trim().split(/\s+/);
  if (words.length < 2) return [siteName, ""];
  return [words.slice(0, -1).join(" "), words.at(-1)];
}

/** Small centered text under the card: why this email exists, reference numbers and so on. */
export function footerBlock(lines) {
  return html`${lines.map(
    (line) => html`<p class="t-subtle" style="${css({ "font-family": fontStack, margin: "0 0 8px", "font-size": "13px", "line-height": "20px", color: L.subtle, "text-align": "center", "word-break": "break-word" })}">${line}</p>`,
  )}`;
}

/**
 * The shared frame of every email: hidden preview text, a dark brand header with the logo and a small tag,
 * a gradient line, the white card holding `content`, and a quiet footer.
 *
 * @param {{ lang: string, locale: string, title: string, preheader: string, headerTag: string, content: unknown, footer: unknown, siteName: string }} options
 */
export function renderLayout({ lang, locale, title, preheader, headerTag, content, footer, siteName }) {
  const [primaryName, secondaryName] = splitName(siteName);
  const tagText = locale === "ka" ? headerTag : headerTag.toUpperCase();
  const padding = raw("&#847;&zwnj;&nbsp;".repeat(32));

  return html`<!doctype html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${title}</title>
${raw("<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->")}
<style>
${raw(emailStyles())}
</style>
</head>
<body id="body" class="bg-page" style="${css({ margin: "0", padding: "0", width: "100%", "background-color": L.page, "-webkit-text-size-adjust": "100%" })}">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader}${padding}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" bgcolor="${L.page}" style="${css({ "background-color": L.page })}">
<tr>
<td align="center" class="outer" style="padding:32px 16px 44px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tr>
<td>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-card bd" bgcolor="${L.card}" style="${css({ "background-color": L.card, border: `1px solid ${L.border}`, "border-radius": "20px", "border-collapse": "separate", overflow: "hidden" })}">
<tr>
<td class="px" bgcolor="${H.background}" style="${css({ padding: "22px 32px", "background-color": H.background, "background-image": "radial-gradient(ellipse 70% 150% at 100% 0%, rgba(79,83,252,0.5) 0%, rgba(13,12,16,0) 70%)" })}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="27" valign="middle">${image(logo, "")}</td>
<td valign="middle" style="${css({ "padding-left": "12px", "font-family": fontStack, "font-size": "17px", "line-height": "22px", color: H.text })}"><span style="font-weight:700;color:${H.text};">${primaryName}</span>${secondaryName ? html` <span style="font-weight:500;color:${H.muted};">${secondaryName}</span>` : ""}</td>
<td align="right" valign="middle"><span style="${css({ display: "inline-block", padding: "5px 12px", border: `1px solid ${H.tagBorder}`, "border-radius": "999px", "font-family": fontStack, "font-size": "12px", "line-height": "16px", "font-weight": "600", "letter-spacing": locale === "ka" ? "0" : "0.06em", color: H.tagText })}">${tagText}</span></td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="4" bgcolor="${brand.blue}" style="${css({ height: "4px", "font-size": "0", "line-height": "0", "background-color": brand.blue, "background-image": gradientBar })}">&nbsp;</td>
</tr>
<tr>
<td class="px" style="padding:36px 32px 36px;">
${content}
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td class="px" style="padding:24px 24px 0;">
${footer}
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}
