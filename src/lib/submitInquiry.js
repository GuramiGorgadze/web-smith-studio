import { site } from "@/data/site";
import { format } from "@/i18n/text";

/**
 * The mailto: link that carries a finished inquiry, used both to send it and as a fallback on the thank-you screen.
 * `mail` is content.contact.mail: the subject and the names of the lines, in the visitor's language.
 */
export function buildMailtoHref(inquiry, mail) {
  const subject = inquiry.company
    ? format(mail.subjectWithCompany, { name: inquiry.name, company: inquiry.company })
    : format(mail.subject, { name: inquiry.name });

  const lines = [
    `${mail.lines.name}: ${inquiry.name}`,
    `${mail.lines.email}: ${inquiry.email}`,
    inquiry.company ? `${mail.lines.company}: ${inquiry.company}` : null,
    `${mail.lines.projectType}: ${inquiry.projectType}`,
    `${mail.lines.budget}: ${inquiry.budget}`,
    `${mail.lines.timeline}: ${inquiry.timeline}`,
    `${mail.lines.care}: ${inquiry.careInterest}`,
    inquiry.estimate ? `${mail.lines.estimate}: ${inquiry.estimate}` : null,
    "",
    inquiry.message,
  ].filter((line) => line !== null);

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Thrown when the form endpoint could not take the message.
 * `status` is the HTTP status (absent when the server could not be reached at all), `code` and `fields`
 * come from our own server's JSON answer when there is one.
 */
export class SubmitError extends Error {
  constructor(message, { status, code, fields, cause } = {}) {
    super(message, { cause });
    this.name = "SubmitError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

// The languages our own server writes its validation messages in. For any other language the visitor sees
// the (translated) fallback sentence instead of an English one.
const SERVER_MESSAGE_LOCALES = ["en"];

/**
 * A visitor-friendly explanation for a failed submit, and a short line for the toast.
 * `i18n` is what useI18n() returns; the wording is content.contact.errors.
 */
export function describeSubmitError(error, i18n) {
  const text = i18n.content.contact.errors;

  if (error instanceof SubmitError && error.status === 429) {
    return { message: i18n.t(text.tooMany.message), toast: text.tooMany.toast };
  }

  if (error instanceof SubmitError && error.status === 422) {
    const serverProblem = SERVER_MESSAGE_LOCALES.includes(i18n.locale) ? Object.values(error.fields ?? {})[0] : undefined;
    return {
      message: i18n.t(text.invalid.message, { problem: serverProblem ?? text.invalid.fallbackProblem }),
      toast: text.invalid.toast,
    };
  }

  return { message: i18n.t(text.failed.message), toast: text.failed.toast };
}

/**
 * Sends a contact inquiry.
 *
 * - If VITE_FORM_ENDPOINT is set, the inquiry is POSTed as JSON: to our own server (`/api/contact`, see
 *   the server/ folder) or to a form service (Formspree, Getform ...).
 * - Otherwise the visitor's mail app opens with the message prefilled, so no inquiry is ever lost.
 *
 * @param {object} inquiry  from buildInquiry()
 * @param {object} mail     content.contact.mail, used for the mailto: fallback
 * @returns {Promise<{ mode: "endpoint" | "mailto", mailtoHref?: string }>}
 * @throws {SubmitError}
 */
export async function submitInquiry(inquiry, mail) {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;

  if (endpoint) {
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(inquiry),
      });
    } catch (cause) {
      throw new SubmitError("The form service could not be reached.", { cause });
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new SubmitError(body?.error?.message ?? `The form service answered with status ${response.status}.`, {
        status: response.status,
        code: body?.error?.code,
        fields: body?.error?.fields,
      });
    }
    return { mode: "endpoint" };
  }

  const mailtoHref = buildMailtoHref(inquiry, mail);
  window.location.href = mailtoHref;
  return { mode: "mailto", mailtoHref };
}
