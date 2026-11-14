import { siteText } from "./site.js";

// Options and copy for the contact page. Ids are what the form stores and the mail server understands
// (server/src/mail/messages.js); labels are what visitors read. The ids must be the same in every language.

export const projectTypes = [
  { id: "landing", label: "Landing page" },
  { id: "business", label: "Business website" },
  { id: "store", label: "Online store" },
  { id: "webapp", label: "Web app or portal" },
  { id: "redesign", label: "Redesign or migration" },
  { id: "seo", label: "SEO and speed" },
  { id: "care", label: "Care plan" },
  { id: "unsure", label: "Not sure yet" },
];

export const budgetOptions = [
  { id: "under-2k", label: "Under $2,000" },
  { id: "2k-5k", label: "$2,000 to $5,000" },
  { id: "5k-10k", label: "$5,000 to $10,000" },
  { id: "10k-plus", label: "$10,000 or more" },
  { id: "unsure", label: "Not sure yet" },
];

export const timelineOptions = [
  { id: "asap", label: "As soon as possible" },
  { id: "1-2-months", label: "Within 1 to 2 months" },
  { id: "3-plus-months", label: "In 3 months or more" },
  { id: "flexible", label: "I am flexible" },
];

// What happens after the form is sent. The response time comes from site.js.
export const nextSteps = [
  {
    title: "We read every message",
    body: "A real person reads your details and writes back. No sales script, just a straight answer.",
  },
  {
    title: `We reply ${siteText.responseTime}`,
    body: "You get a short answer with next steps and a few times for your free 30-minute call.",
  },
  {
    title: "We talk it through",
    body: "On the call we cover goals, scope and budget, then send a fixed, written quote.",
  },
];

/**
 * Everything the contact page says apart from the options above.
 * Marks inside the strings: {name} is a value, <tag>words</tag> is wrapped by the code (a link, bold).
 */
export const contactText = {
  // Messages under a field that is not valid. The limits (80, 120, 4,000 ...) match the mail server.
  validation: {
    nameRequired: "Please tell us your name.",
    nameTooLong: "Please keep your name under 80 characters.",
    emailRequired: "Please enter your email address.",
    emailTooLong: "That email address is too long.",
    emailInvalid: "That email address does not look right.",
    companyTooLong: "Please keep this under 120 characters.",
    projectType: "Please choose the closest match.",
    budget: "Please choose a range, or pick not sure yet.",
    timeline: "Please choose a timeline.",
    messageTooShort: "Please share a few details about your business and goals (at least 20 characters).",
    messageTooLong: "Please keep your message under 4,000 characters.",
    consent: "Please confirm so we are allowed to reply to you.",
  },

  form: {
    aria: "Project inquiry",
    aboutYou: "About you",
    yourProject: "Your project",
    name: { label: "Your name", placeholder: "Jane Doe" },
    email: { label: "Email", placeholder: "jane@yourcompany.com" },
    company: { label: "Business or project name", hint: "Optional", placeholder: "Harbor & Pine Café" },
    projectType: { label: "What do you need?" },
    budget: { label: "Budget", hint: "A rough range is fine.", placeholder: "Choose a range" },
    timeline: { label: "When would you like to launch?" },
    message: {
      label: "How can we help?",
      hint: "A few sentences about your business and what you want the website to achieve is perfect.",
      placeholder: "We run a small café and want a website with our menu, opening hours and online ordering.",
    },
    care: {
      label: "Tell me about a monthly care plan",
      hint: "Hosting, updates, backups and small changes after launch.",
    },
    honeypot: "Leave this field empty",
    consent: "I agree that {name} may use these details to reply to my inquiry, as described in the <privacy>Privacy Policy</privacy>.",
    sending: "Sending…",
    send: "Send message",
    note: "We reply {responseTime}. No spam, and we never share your details.",
  },

  // Shown when sending fails. {email} is the studio's address.
  errors: {
    tooMany: {
      message:
        "You have sent several messages in a short time. Please wait a few minutes and try again, or email us at {email}.",
      toast: "Too many messages in a short time",
    },
    invalid: {
      // {problem} is the first field message from the server, or `fallbackProblem`.
      message: "{problem} Please check the form and try again, or email us at {email}.",
      fallbackProblem: "Some details need another look.",
      toast: "Some details need another look",
    },
    failed: {
      message: "Something went wrong and your message was not sent. Please try again, or email us at {email}.",
      toast: "We could not send your message",
    },
    kept: "Your message is still here. Nothing was lost.",
  },

  success: {
    titleSent: "Thank you, {firstName}.",
    titleMailto: "One more step, {firstName}.",
    bodySent:
      "Your message is in. We will reply to <to>{visitorEmail}</to> {responseTime} with next steps and a few times for your free 30-minute call.",
    mailtoPress:
      "Your email app should have opened with your message ready to go. Press <strong>Send</strong> there and we will reply {responseTime}.",
    mailtoFallback: "Nothing opened? Use the button below, or write to us at <mail>{email}</mail>.",
    openMail: "Open my email app",
    again: "Send another message",
  },

  info: {
    aria: "Other ways to reach us",
    directTitle: "Prefer email?",
    directText: "Write to us directly. We read every message ourselves.",
    copy: "Copy address",
    copied: "Email address copied",
    copyFailed: "Could not copy automatically",
    copyFailedHint: "Please select the address: {email}",
    nextTitle: "What happens next",
    findTitle: "Find us online",
  },

  attachment: {
    aria: "Your estimate",
    included: "Your estimate will be included",
    removed: "Estimate removed",
    removedHint: "We will not attach it to your message. You can add it back any time.",
    about: "about {weeks}",
    remove: "Remove",
    addBack: "Add back",
    // Full sentences for screen readers; they must contain the visible words above.
    removeLabel: "Remove the estimate from my message",
    addBackLabel: "Add back the estimate to my message",
  },

  // The email that opens when no mail server is set up (and the fallback button on the thank-you screen).
  mail: {
    subject: "New project inquiry from {name}",
    subjectWithCompany: "New project inquiry from {name} ({company})",
    lines: {
      name: "Name",
      email: "Email",
      company: "Company",
      projectType: "Project type",
      budget: "Budget",
      timeline: "Timeline",
      care: "Care plan",
      estimate: "Estimate from the website",
    },
    careYes: "Yes, please tell me about care plans",
    careNo: "Not right now",
  },
};
