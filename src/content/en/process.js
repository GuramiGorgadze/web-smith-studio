// The six steps shown in the guided "How we work" tour on the home page.
// `screen` picks which illustrated browser window is displayed for each step; `number`, `id`, `screen`
// and `url` are the same in every language.

export const processSteps = [
  {
    id: "discover",
    number: "01",
    screen: "discovery",
    title: "Tell us about your business",
    description:
      "A free 30-minute call. We learn who your customers are, what you want the site to achieve and what a great result looks like. No jargon, no pressure.",
    url: "yourbusiness.com/brief",
    chips: ["free first call", "goals, captured", "a plan in 48 hours"],
  },
  {
    id: "strategy",
    number: "02",
    screen: "strategy",
    title: "Map the whole site before drawing a pixel",
    description:
      "We agree the pages, the message and the journey first. A clear sitemap and content plan means fewer surprises, faster approvals and a site that guides people to act.",
    url: "yourbusiness.com/sitemap",
    chips: ["sitemap, signed off", "content mapped", "no surprises"],
  },
  {
    id: "design",
    number: "03",
    screen: "design",
    title: "Design in the browser, not in a PDF",
    description:
      "You review a real, clickable preview on a private link: your brand, your words, on phone and desktop. Feedback is applied in days, not weeks.",
    url: "preview.yourbusiness.com",
    chips: ["live preview link", "mobile-first", "your feedback, applied"],
  },
  {
    id: "build",
    number: "04",
    screen: "build",
    title: "Build for speed and for search",
    description:
      "Hand-coded with modern tools, not stitched from heavy templates. Every page is responsive, accessible and tuned for Core Web Vitals so it loads fast and ranks well.",
    url: "yourbusiness.com/audit",
    chips: ["95+ Lighthouse target", "accessible by default", "SEO built in"],
  },
  {
    id: "launch",
    number: "05",
    screen: "launch",
    title: "Launch day, handled",
    description:
      "Domain, hosting, redirects, forms and analytics are connected and tested end to end. Then we flip the switch together and watch the first visits roll in.",
    url: "yourbusiness.com",
    chips: ["domain connected", "forms tested", "analytics on"],
  },
  {
    id: "grow",
    number: "06",
    screen: "growth",
    title: "Keep improving after launch",
    description:
      "An optional care plan covers security, updates, backups and monthly improvements, guided by what your analytics say real visitors do.",
    url: "yourbusiness.com/insights",
    chips: ["uptime watched", "monthly updates", "reports in plain English"],
  },
];

// The words inside the illustrated browser windows of the tour. They are decorative (hidden from screen
// readers) but sighted visitors read them, so they are translated too.
export const tourScreens = {
  discovery: {
    formLabel: "your project brief",
    goalQuestion: "What should the website do?",
    goals: ["More inquiries", "Sell online", "Look professional"],
    customerQuestion: "Who are your customers?",
    customerAnswer: "Local families and weekend visitors",
    launchQuestion: "When would you like to launch?",
    launchOptions: ["Within a month", "This quarter", "Flexible"],
    summaryLabel: "what we heard",
    summary: ["Goal: more inquiries", "Audience: local families", "Launch: this quarter", "Budget range: agreed"],
    done: "Brief complete. Plan and quote follow within 48 hours.",
  },
  strategy: {
    mapLabel: "sitemap",
    home: "Home",
    pages: [
      { name: "Services", children: ["Web design", "Online stores", "Web apps"] },
      { name: "Work" },
      { name: "About" },
      { name: "Contact" },
    ],
    jobsLabel: "every page has one job",
    jobs: [
      { page: "Home", job: "Explain what you do in five seconds." },
      { page: "Services", job: 'Help the right customer say "that is me".' },
      { page: "Contact", job: "Make the next step effortless." },
    ],
  },
  design: {
    typeSpecimen: "Aa",
    typeName: "Geist, 600",
  },
  build: {
    tabs: ["Page.jsx", "styles.scss"],
    auditLabel: "page audit",
    scores: ["Performance", "Accessibility", "Best practices", "SEO"],
  },
  launch: {
    checklistLabel: "launch checklist",
    checklist: ["Domain connected", "SSL certificate active", "Contact form tested", "Analytics switched on", "Redirects verified"],
    live: "Live",
    domain: "yourbusiness.com",
    events: [
      { label: "First visit from search", time: "just now" },
      { label: "Page shared by a customer", time: "1 min ago" },
      { label: "Inquiry received", time: "3 min ago" },
    ],
  },
  growth: {
    tiles: [
      { label: "Visitors", value: "2,481", delta: "+18%" },
      { label: "Inquiries", value: "36", delta: "+9%" },
      { label: "Uptime", value: "99.98%", delta: "30 days" },
    ],
    chartLabel: "visitors, last 30 days",
    trend: "Growing",
    tipBadge: "Next up",
    tip: "Add a booking button to the mobile header to lift inquiries.",
  },
};
