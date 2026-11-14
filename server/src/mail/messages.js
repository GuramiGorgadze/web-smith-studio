// All wording used in the emails, in English (en) and Georgian (ka).
//
// The website sends stable option ids (for example "business" or "500-1k") next to its labels. The emails are
// written from the tables below, never from text typed or posted by the visitor, so a confirmation email can
// only ever contain our own words (plus the visitor's own first name and email address).

export const optionLabels = {
  projectType: {
    landing: { en: "Landing page", ka: "ლენდინგ გვერდი" },
    business: { en: "Business website", ka: "ბიზნეს ვებსაიტი" },
    redesign: { en: "Redesign or migration", ka: "რედიზაინი ან მიგრაცია" },
    seo: { en: "SEO and speed", ka: "SEO და სიჩქარე" },
    care: { en: "Care plan", ka: "მხარდაჭერის გეგმა" },
    unsure: { en: "Not sure yet", ka: "ჯერ არ ვიცი" },
  },
  budget: {
    "under-500": { en: "Under $500", ka: "$500-ზე ნაკლები" },
    "500-1k": { en: "$500 to $1,000", ka: "$500-დან $1,000-მდე" },
    "1k-2k": { en: "$1,000 to $2,000", ka: "$1,000-დან $2,000-მდე" },
    "2k-plus": { en: "$2,000 or more", ka: "$2,000 ან მეტი" },
    unsure: { en: "Not sure yet", ka: "ჯერ არ ვიცი" },
  },
  timeline: {
    asap: { en: "As soon as possible", ka: "რაც შეიძლება მალე" },
    "1-2-months": { en: "Within 1 to 2 months", ka: "1–2 თვეში" },
    "3-plus-months": { en: "In 3 months or more", ka: "3 თვეში ან უფრო გვიან" },
    flexible: { en: "I am flexible", ka: "ვადებში მოქნილი ვარ" },
  },
  care: {
    yes: { en: "Yes, please tell me about care plans", ka: "დიახ, მაინტერესებს მხარდაჭერის გეგმები" },
    no: { en: "Not right now", ka: "ახლა არა" },
  },
};

/** The label for an option id in a language, or undefined when the id is not one we know. */
export function labelFor(kind, id, locale) {
  if (typeof id !== "string") return undefined;
  const entry = Object.hasOwn(optionLabels[kind] ?? {}, id) ? optionLabels[kind][id] : undefined;
  return entry?.[locale];
}

/** Matches an urgent timeline when only a label (no id) was sent. */
export const URGENT_TIMELINE = /asap|as soon as possible|urgent|რაც შეიძლება მალე|სასწრაფო/iu;

export const messages = {
  en: {
    notification: {
      tag: "New inquiry",
      eyebrow: "New project inquiry",
      subject: ({ name, projectType, urgent }) => `${urgent ? "[ASAP] " : ""}New inquiry from ${name}: ${projectType}`,
      preheader: ({ budget, timeline, email }) => `${budget} · ${timeline} · ${email}`,
      reply: "Reply by email",
      detailsTitle: "Details",
      labels: {
        email: "Email",
        company: "Company",
        projectType: "Project type",
        budget: "Budget",
        timeline: "Timeline",
        care: "Care plan",
      },
      estimateTitle: "Estimate from the website",
      messageTitle: "Message",
      footerReply: "Replying to this email goes straight to the sender.",
      footerMeta: ({ host, id, received }) => `Sent from the contact form at ${host}. Reference ${id}. Received ${received}.`,
    },
    reply: {
      subject: ({ siteName }) => `Re: your project inquiry to ${siteName}`,
      greeting: ({ name }) => (name ? `Hi ${name},` : "Hi,"),
      body: "Thank you for getting in touch about your project.",
    },
    autoReply: {
      tag: "Message received",
      subject: ({ siteName }) => `We got your message | ${siteName}`,
      preheader: ({ responseTime }) => `We will reply ${responseTime}. Here is what happens next.`,
      title: ({ name }) => (name ? `Thanks, ${name}. Your message is in.` : "Thanks. Your message is in."),
      lead: ({ email, responseTime }) =>
        `We will reply to ${email} ${responseTime} with next steps and a few times for your free 30-minute call.`,
      requestTitle: "Your request",
      labels: { projectType: "Project type", budget: "Budget", timeline: "Timeline" },
      nextTitle: "What happens next",
      steps: ({ responseTime }) => [
        {
          title: "We read every message",
          body: "A real person reads your details and writes back. No sales script, just a straight answer.",
        },
        {
          title: `We reply ${responseTime}`,
          body: "You get a short answer with next steps and a few times for your free 30-minute call.",
        },
        {
          title: "We talk it through",
          body: "On the call we cover goals, scope and budget, then send a fixed, written quote.",
        },
      ],
      cta: "See our work",
      signoff: "Talk soon,",
      team: ({ siteName }) => `The ${siteName} team`,
      footer: ({ host }) =>
        `You are getting this one-time confirmation because this address was entered in the contact form at ${host}. If that was not you, simply ignore this email. We will not contact you again.`,
      reference: ({ id }) => `Reference ${id}`,
    },
  },

  ka: {
    notification: {
      tag: "ახალი მოთხოვნა",
      eyebrow: "ახალი პროექტის მოთხოვნა",
      subject: ({ name, projectType, urgent }) => `${urgent ? "[სასწრაფო] " : ""}ახალი მოთხოვნა: ${name} · ${projectType}`,
      preheader: ({ budget, timeline, email }) => `${budget} · ${timeline} · ${email}`,
      reply: "პასუხის გაგზავნა",
      detailsTitle: "დეტალები",
      labels: {
        email: "ელფოსტა",
        company: "კომპანია",
        projectType: "პროექტის ტიპი",
        budget: "ბიუჯეტი",
        timeline: "ვადა",
        care: "მხარდაჭერის გეგმა",
      },
      estimateTitle: "შეფასება საიტიდან",
      messageTitle: "შეტყობინება",
      footerReply: "ამ წერილზე პასუხი პირდაპირ გამომგზავნს მიუვა.",
      footerMeta: ({ host, id, received }) => `გამოგზავნილია საკონტაქტო ფორმიდან (${host}). ნომერი: ${id}. მიღებულია: ${received}.`,
    },
    reply: {
      subject: ({ siteName }) => `პასუხი თქვენს მოთხოვნაზე | ${siteName}`,
      greeting: ({ name }) => (name ? `გამარჯობა, ${name}!` : "გამარჯობა!"),
      body: "გმადლობთ, რომ დაგვიკავშირდით თქვენი პროექტის შესახებ.",
    },
    autoReply: {
      tag: "შეტყობინება მიღებულია",
      subject: ({ siteName }) => `თქვენი შეტყობინება მივიღეთ | ${siteName}`,
      preheader: ({ responseTime }) => `პასუხს ${responseTime} გამოგიგზავნით. აი, რა მოხდება შემდეგ.`,
      title: ({ name }) => (name ? `გმადლობთ, ${name}. შეტყობინება მივიღეთ.` : "გმადლობთ. შეტყობინება მივიღეთ."),
      lead: ({ email, responseTime }) =>
        `პასუხს ${responseTime} გამოგიგზავნით ელფოსტაზე: ${email}. მასში იქნება შემდეგი ნაბიჯები და უფასო 30-წუთიანი ზარისთვის რამდენიმე შესაძლო დრო.`,
      requestTitle: "თქვენი მოთხოვნა",
      labels: { projectType: "პროექტის ტიპი", budget: "ბიუჯეტი", timeline: "ვადა" },
      nextTitle: "რა მოხდება შემდეგ",
      steps: ({ responseTime }) => [
        {
          title: "ყველა შეტყობინებას ვკითხულობთ",
          body: "თქვენს მონაცემებს ცოცხალი ადამიანი გაეცნობა და გიპასუხებთ. გაყიდვების სკრიპტის გარეშე, პირდაპირ და გასაგებად.",
        },
        {
          title: `გიპასუხებთ ${responseTime}`,
          body: "მიიღებთ მოკლე პასუხს შემდეგი ნაბიჯებით და უფასო 30-წუთიანი ზარისთვის რამდენიმე შესაძლო დროით.",
        },
        {
          title: "დეტალებს განვიხილავთ",
          body: "ზარზე გავარკვევთ მიზნებს, მოცულობასა და ბიუჯეტს, შემდეგ კი გამოგიგზავნით ფიქსირებულ, წერილობით შეთავაზებას.",
        },
      ],
      cta: "ჩვენი ნამუშევრები",
      signoff: "მალე გისაუბრებთ,",
      team: ({ siteName }) => `გუნდი: ${siteName}`,
      footer: ({ host }) =>
        `ეს ერთჯერადი დადასტურებაა: თქვენი ელფოსტა მიეთითა საკონტაქტო ფორმაში (${host}). თუ ეს თქვენ არ გაგიკეთებიათ, უბრალოდ უგულებელყავით ეს წერილი. თქვენ აღარ დაგიკავშირდებით.`,
      reference: ({ id }) => `ნომერი: ${id}`,
    },
  },
};
