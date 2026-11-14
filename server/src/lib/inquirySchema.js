import { z } from "zod";
import { multiLine, singleLine } from "./text.js";

export const LOCALES = ["en", "ka"];

/** Optional single-line text: cleaned, never undefined. */
const optionalLine = (max) =>
  z
    .string()
    .nullish()
    .transform((value) => singleLine(value ?? ""))
    .pipe(z.string().max(max, `Please keep this under ${max} characters.`));

/** A short machine id such as "business" or "2k-5k". Anything else is ignored rather than rejected. */
const optionId = z
  .string()
  .regex(/^[a-z0-9-]{1,40}$/)
  .optional()
  .catch(undefined);

/**
 * What the contact form sends. The limits mirror the form on the website (src/lib/contactSchema.js),
 * and everything is cleaned again here because the browser is never trusted.
 *
 * `ids` and `locale` are optional extras from the website: stable option ids let us write the emails in
 * our own wording and language, and `locale` picks the language of the visitor's confirmation.
 */
export const inquirySchema = z.object({
  name: z
    .string({ error: "Please tell us your name." })
    .transform(singleLine)
    .pipe(z.string().min(2, "Please tell us your name.").max(80, "Please keep your name under 80 characters.")),

  email: z
    .string({ error: "Please enter your email address." })
    .transform((value) => singleLine(value).toLowerCase())
    .pipe(
      z
        .string()
        .min(1, "Please enter your email address.")
        .max(254, "That email address is too long.")
        .pipe(z.email("That email address does not look right.")),
    ),

  company: optionalLine(120),
  projectType: optionalLine(80),
  budget: optionalLine(80),
  timeline: optionalLine(80),
  careInterest: optionalLine(120),

  estimate: z
    .string()
    .nullish()
    .transform((value) => multiLine(value ?? ""))
    .pipe(z.string().max(700, "The estimate text is too long.")),

  message: z
    .string({ error: "Please tell us a little about your project." })
    .transform(multiLine)
    .pipe(
      z
        .string()
        .min(20, "Please share a few details about your business and goals (at least 20 characters).")
        .max(4000, "Please keep your message under 4,000 characters."),
    ),

  ids: z
    .object({
      projectType: optionId,
      budget: optionId,
      timeline: optionId,
      care: z.boolean().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),

  locale: z.enum(LOCALES).catch("en").default("en"),
});

/**
 * Checks a request body.
 * Returns `{ success: true, data }` or `{ success: false, fields }`, where `fields` maps a field name to one message.
 *
 * @param {unknown} input
 */
export function parseInquiry(input) {
  const result = inquirySchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  /** @type {Record<string, string>} */
  const fields = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    fields[key] ??= issue.message;
  }
  return { success: false, fields };
}
