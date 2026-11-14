import "@/lib/zodConfig";
import { z } from "zod";

const ids = (options) => options.map((option) => option.id);

// One schema per language, built once. react-hook-form gets the same resolver on every render.
const cache = new WeakMap();

/**
 * Validation rules for the contact form. Messages are written for visitors, not developers, and come
 * from the language's content (content.contact.validation), so every language reads naturally.
 * The limits match the mail server (server/src/lib/inquirySchema.js), so it never refuses what this form accepts.
 *
 * @param {object} contact  content.contact of the current language
 */
export function createContactSchema(contact) {
  const cached = cache.get(contact);
  if (cached) return cached;

  const message = contact.validation;
  const schema = z.object({
    name: z.string().trim().min(2, message.nameRequired).max(80, message.nameTooLong),
    email: z
      .string()
      .trim()
      .min(1, message.emailRequired)
      .max(254, message.emailTooLong)
      .pipe(z.email(message.emailInvalid)),
    company: z.string().trim().max(120, message.companyTooLong),
    projectType: z.enum(ids(contact.projectTypes), message.projectType),
    budget: z.enum(ids(contact.budgetOptions), message.budget),
    timeline: z.enum(ids(contact.timelineOptions), message.timeline),
    message: z.string().trim().min(20, message.messageTooShort).max(4000, message.messageTooLong),
    care: z.boolean(),
    consent: z.boolean().refine((value) => value === true, message.consent),
    // Honeypot: real visitors never see this field, so any value means a bot filled it in.
    website: z.string().max(200),
  });

  cache.set(contact, schema);
  return schema;
}
