import { safeFirstName, singleLine, truncate } from "../lib/text.js";
import { button, detailTable, eyebrow, link, panel, paragraph, pill, pillRow, quote, sectionTitle, spacer, title } from "./components.js";
import { formatReceived } from "./format.js";
import { html, nl2br } from "./html.js";
import { footerBlock, renderLayout } from "./layout.js";
import { URGENT_TIMELINE, labelFor, messages } from "./messages.js";

/**
 * The email you receive for every inquiry: who wrote, what they want, their message, and a one-tap reply.
 * It is written in the studio's language (STUDIO_LOCALE), whatever language the visitor used on the site.
 *
 * @param {{ inquiry: import("zod").infer<typeof import("../lib/inquirySchema.js").inquirySchema>, id: string, receivedAt: Date, config: any }} input
 * @returns {{ subject: string, html: string, text: string, urgent: boolean }}
 */
export function renderNotification({ inquiry, id, receivedAt, config }) {
  const locale = config.mail.studioLocale;
  const t = messages[locale].notification;
  const ids = inquiry.ids ?? {};

  // Prefer our own wording for an id we know. Fall back to the label the website sent.
  const resolve = (kind, optionId, sentLabel, emptyLabel) => labelFor(kind, optionId, locale) ?? (sentLabel || emptyLabel);

  const projectType = resolve("projectType", ids.projectType, inquiry.projectType, labelFor("projectType", "unsure", locale));
  const budget = resolve("budget", ids.budget, inquiry.budget, labelFor("budget", "unsure", locale));
  const timeline = resolve("timeline", ids.timeline, inquiry.timeline, "—");
  const care =
    ids.care === true
      ? labelFor("care", "yes", locale)
      : ids.care === false
        ? labelFor("care", "no", locale)
        : inquiry.careInterest || labelFor("care", "no", locale);
  const urgent = ids.timeline ? ids.timeline === "asap" : URGENT_TIMELINE.test(inquiry.timeline);

  // The reply is prefilled in the visitor's language, so answering takes one tap.
  const visitorWords = messages[inquiry.locale].reply;
  const firstName = safeFirstName(inquiry.name);
  const replySubject = visitorWords.subject({ siteName: config.site.name });
  const replyBody = `${visitorWords.greeting({ name: firstName })}\n\n${visitorWords.body}\n\n`;
  const replyHref = `mailto:${inquiry.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;

  const received = formatReceived(receivedAt, locale, config.mail.timezone);
  const subject = truncate(singleLine(t.subject({ name: inquiry.name, projectType, urgent })), 140);
  const preheader = t.preheader({ budget, timeline, email: inquiry.email });

  const rows = [
    [t.labels.email, link(`mailto:${inquiry.email}`, inquiry.email)],
    inquiry.company ? [t.labels.company, inquiry.company] : null,
    [t.labels.projectType, projectType],
    [t.labels.budget, budget],
    [t.labels.timeline, timeline],
    [t.labels.care, care],
  ].filter(Boolean);

  const estimate = inquiry.estimate
    ? html`${spacer(24)}${panel({
        heading: t.estimateTitle,
        locale,
        children: paragraph(nl2br(inquiry.estimate), { tone: "text", size: 15, lineHeight: 24, margin: "0 0 14px" }),
      })}`
    : "";

  const content = html`${eyebrow(t.eyebrow, locale)}
${title(inquiry.name, locale)}
${paragraph(inquiry.company || inquiry.email, { tone: "muted", size: 17, lineHeight: 26, margin: "0 0 4px" })}
${pillRow([pill(projectType), pill(budget), pill(timeline, { tone: urgent ? "warn" : "brand" })])}
${spacer(14)}
${button({ href: replyHref, label: t.reply })}
${spacer(32)}
${sectionTitle(t.detailsTitle, locale)}
${detailTable(rows)}
${estimate}
${spacer(32)}
${sectionTitle(t.messageTitle, locale)}
${quote(nl2br(inquiry.message))}`;

  const document = renderLayout({
    lang: locale,
    locale,
    title: subject,
    preheader,
    headerTag: t.tag,
    content,
    footer: footerBlock([t.footerReply, t.footerMeta({ host: config.site.host, id, received })]),
    siteName: config.site.name,
  });

  const text = [
    locale === "ka" ? t.eyebrow : t.eyebrow.toUpperCase(),
    inquiry.company ? `${inquiry.name} (${inquiry.company})` : inquiry.name,
    "",
    `${t.labels.email}: ${inquiry.email}`,
    ...(inquiry.company ? [`${t.labels.company}: ${inquiry.company}`] : []),
    `${t.labels.projectType}: ${projectType}`,
    `${t.labels.budget}: ${budget}`,
    `${t.labels.timeline}: ${timeline}`,
    `${t.labels.care}: ${care}`,
    ...(inquiry.estimate ? ["", `${t.estimateTitle}:`, inquiry.estimate] : []),
    "",
    `${t.messageTitle}:`,
    inquiry.message,
    "",
    "--",
    t.footerReply,
    t.footerMeta({ host: config.site.host, id, received }),
  ].join("\n");

  return { subject, html: String(document), text, urgent };
}
