import { safeFirstName } from "../lib/text.js";
import { button, detailTable, image, panel, paragraph, sectionTitle, spacer, stepList, title } from "./components.js";
import { check } from "./assets.js";
import { localizedUrl } from "./format.js";
import { html } from "./html.js";
import { footerBlock, renderLayout } from "./layout.js";
import { labelFor, messages } from "./messages.js";

/**
 * The confirmation the visitor receives, in the language they used on the site.
 *
 * Safety by design: it contains only our own wording, the visitor's own email address, and the first word of
 * their name when it looks like a plain name. Free text from the form is never echoed back, so the form
 * cannot be used to send arbitrary messages to somebody else's inbox.
 *
 * @param {{ inquiry: import("zod").infer<typeof import("../lib/inquirySchema.js").inquirySchema>, id: string, config: any }} input
 * @returns {{ subject: string, html: string, text: string }}
 */
export function renderAutoReply({ inquiry, id, config }) {
  const locale = inquiry.locale;
  const t = messages[locale].autoReply;
  const siteName = config.site.name;
  const responseTime = config.mail.responseTime[locale];
  const name = safeFirstName(inquiry.name);
  const ids = inquiry.ids ?? {};

  const recap = [
    [t.labels.projectType, labelFor("projectType", ids.projectType, locale)],
    [t.labels.budget, labelFor("budget", ids.budget, locale)],
    [t.labels.timeline, labelFor("timeline", ids.timeline, locale)],
  ].filter(([, value]) => value);

  const steps = t.steps({ responseTime });
  const workUrl = localizedUrl(config.site, locale, "/work");
  const subject = t.subject({ siteName });
  const lead = t.lead({ email: inquiry.email, responseTime });

  const content = html`${html`<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td>${image(check, "")}</td></tr></table>`}
${spacer(20)}
${title(t.title({ name }), locale)}
${paragraph(lead, { tone: "muted", size: 17, lineHeight: 27, margin: "0 0 30px" })}
${recap.length > 0 ? html`${panel({ heading: t.requestTitle, locale, children: detailTable(recap, { closed: false }) })}${spacer(34)}` : ""}
${sectionTitle(t.nextTitle, locale)}
${stepList(steps)}
${spacer(2)}
${button({ href: workUrl, label: t.cta, variant: "outline" })}
${spacer(34)}
${paragraph(t.signoff, { tone: "text", margin: "0 0 2px" })}
${paragraph(t.team({ siteName }), { tone: "muted", margin: "0" })}`;

  const document = renderLayout({
    lang: locale,
    locale,
    title: subject,
    preheader: t.preheader({ responseTime }),
    headerTag: t.tag,
    content,
    footer: footerBlock([t.footer({ host: config.site.host }), t.reference({ id })]),
    siteName,
  });

  const text = [
    t.title({ name }),
    "",
    lead,
    "",
    ...(recap.length > 0 ? [`${t.requestTitle}:`, ...recap.map(([label, value]) => `- ${label}: ${value}`), ""] : []),
    `${t.nextTitle}:`,
    ...steps.flatMap((step, index) => [`${index + 1}. ${step.title}`, `   ${step.body}`]),
    "",
    `${t.cta}: ${workUrl}`,
    "",
    t.signoff,
    t.team({ siteName }),
    "",
    "--",
    t.footer({ host: config.site.host }),
    t.reference({ id }),
  ].join("\n");

  return { subject, html: String(document), text };
}
