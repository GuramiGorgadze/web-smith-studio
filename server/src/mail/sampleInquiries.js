// Realistic inquiries in the exact shape the website sends. They feed the email preview script,
// the "send me a test" script and the tests.

export const sampleInquiries = {
  /** A priority inquiry with a company, an estimate from the website and a multi-paragraph message. */
  estimateEn: {
    name: "Ana Smith",
    email: "ana@harborpine.example",
    company: "Harbor & Pine Café",
    projectType: "Business website",
    budget: "$2,000 to $5,000",
    timeline: "As soon as possible",
    careInterest: "Yes, please tell me about care plans",
    estimate: "Business website, 5 pages, content editor (CMS) and analytics, standard timeline. Indicative range $3,150 to $4,000, about 4 to 5 weeks.",
    message:
      "Hi! We run a small café in Batumi and our current site is a single outdated page. We would like a clean website with our menu, opening hours, a map and online table booking.\n\nWe plan to open a second location in January, so we would like to launch before the end of December if possible.\n\nCould we have a call this week?",
    ids: { projectType: "business", budget: "2k-5k", timeline: "asap", care: true },
    locale: "en",
  },

  /** A short, relaxed inquiry: no company, no estimate. */
  simpleEn: {
    name: "Daniel Brooks",
    email: "daniel@example.com",
    company: "",
    projectType: "Landing page",
    budget: "Under $2,000",
    timeline: "I am flexible",
    careInterest: "Not right now",
    estimate: "",
    message: "I need a one-page site to collect sign-ups for my online yoga classes. Not in a hurry, I would just like to see what is possible within a small budget.",
    ids: { projectType: "landing", budget: "under-2k", timeline: "flexible", care: false },
    locale: "en",
  },

  /** An inquiry written on the Georgian version of the site. */
  georgian: {
    name: "ნინო გელაშვილი",
    email: "nino@example.ge",
    company: "ლუმენ იოგა",
    projectType: "ლენდინგ გვერდი",
    budget: "$2,000-ზე ნაკლები",
    timeline: "1–2 თვეში",
    careInterest: "ახლა არა",
    estimate: "ლენდინგ გვერდი, 1 გვერდი. დამატებითი ფუნქციების გარეშე. სტანდარტული ვადები. საორიენტაციო დიაპაზონი: $1,200-დან $1,600-მდე, დაახლოებით 2–3 კვირა.",
    message:
      "გამარჯობა! თბილისში იოგას სტუდიას ვხსნი და მჭირდება მარტივი, ლამაზი ლენდინგი: ინფორმაცია გაკვეთილებზე, ფასები და ონლაინ ჩაწერა. მობილურზე კარგად უნდა მუშაობდეს.\n\nშეიძლება ვისაუბროთ ამ კვირაში?",
    ids: { projectType: "landing", budget: "under-2k", timeline: "1-2-months", care: false },
    locale: "ka",
  },

  /** Hostile-looking input, to show that everything is escaped and nothing leaks into the confirmation. */
  tricky: {
    name: "Zoë O'Brien <script>alert(1)</script>",
    email: "zoe+test@example.org",
    company: `Acme "Rockets" & <b>Sons</b>`,
    projectType: "Something <i>custom</i>",
    budget: "Not sure yet",
    timeline: "Whenever",
    careInterest: "Not right now",
    estimate: "",
    message:
      "Hello <img src=x onerror=alert(1)> & \"quotes\" and 'single quotes'.\n\nA very long link: https://example.com/a/really/long/path/that/keeps/going/and/going/and/going/and/going/and/going?with=query&and=more\n\n  Indented line and some Georgian: გამარჯობა",
    locale: "en",
  },
};
