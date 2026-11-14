import { describeEstimate, searchParamsToEstimate } from "@/lib/estimator";

export const EMPTY_CONTACT_VALUES = {
  name: "",
  email: "",
  company: "",
  projectType: "unsure",
  budget: "unsure",
  timeline: "flexible",
  message: "",
  care: false,
  consent: false,
  website: "",
};

/** Pick the budget bracket that contains the middle of an estimated range. Ids as in contact.budgetOptions. */
function budgetForEstimate(result) {
  const middle = (result.low + result.high) / 2;
  if (middle < 500) return "under-500";
  if (middle < 1000) return "500-1k";
  if (middle < 2000) return "1k-2k";
  return "2k-plus";
}

/**
 * Starting values for the form, taken from the page address.
 *
 * - `/contact?type=landing&care=yes`    (services and package buttons)
 * - `/contact?type=business&pages=6...` (the "Try it live" estimator)
 *
 * Unknown values are ignored, so a hand-edited link can never put the form in a broken state.
 * `i18n` is what useI18n() returns: the estimate summary is written in the visitor's language.
 */
export function getInitialContactState(params, i18n) {
  const estimate = searchParamsToEstimate(params);
  const requestedType = params.get("type");
  const projectType = i18n.content.contact.projectTypes.some((option) => option.id === requestedType)
    ? requestedType
    : "unsure";

  return {
    values: {
      ...EMPTY_CONTACT_VALUES,
      projectType,
      budget: estimate ? budgetForEstimate(estimate.result) : "unsure",
      care: params.get("care") === "yes",
    },
    estimate: estimate ? describeEstimate(estimate.input, estimate.result, i18n) : null,
  };
}

const labelOf = (options, id) => options.find((option) => option.id === id)?.label ?? id;

/**
 * Turns validated form values into the message we receive. Ids become readable labels (in the visitor's
 * language), so the email or form-service notification reads like a note from a person, not a database row.
 * The honeypot field is dropped on purpose.
 *
 * `ids` and `locale` are extras for our own server (server/): the stable option ids let it write its
 * emails in the studio's wording, and `locale` is the language of the visitor's confirmation email.
 * Other form services simply ignore them.
 */
export function buildInquiry(values, estimate, i18n) {
  const { projectTypes, budgetOptions, timelineOptions, mail } = i18n.content.contact;

  return {
    name: values.name,
    email: values.email,
    company: values.company,
    projectType: labelOf(projectTypes, values.projectType),
    budget: labelOf(budgetOptions, values.budget),
    timeline: labelOf(timelineOptions, values.timeline),
    careInterest: values.care ? mail.careYes : mail.careNo,
    estimate: estimate?.text ?? "",
    message: values.message,
    ids: {
      projectType: values.projectType,
      budget: values.budget,
      timeline: values.timeline,
      care: values.care,
    },
    locale: i18n.locale,
  };
}
