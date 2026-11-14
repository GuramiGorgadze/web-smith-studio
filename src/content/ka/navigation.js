import { services } from "./services.js";

// მენიუები. `to` არის საიტის გზა ენის გარეშე ("/work"); ბმულს ენას საიტი თავად უმატებს.
// ქვედა ნაწილში {email} სტუდიის მისამართს ნიშნავს src/data/site.js-დან.

export const primaryNav = [
  { label: "სერვისები", to: "/services", children: services },
  { label: "ნამუშევრები", to: "/work" },
  { label: "პროცესი", to: "/#process" },
  // ფასების გვერდი დროებით გამორთულია (იხ. src/routes/router.jsx).
  // { label: "ფასები", to: "/pricing" },
  { label: "ჩვენ შესახებ", to: "/about" },
];

export const navCta = { label: "პროექტის დაწყება", to: "/contact" };

export const footerColumns = [
  {
    title: "ნავიგაცია",
    links: [
      { label: "მთავარი", to: "/" },
      { label: "როგორ ვმუშაობთ", to: "/#process" },
      { label: "შერჩეული ნამუშევრები", to: "/work" },
      // { label: "ფასები", to: "/pricing" },
      { label: "პროექტის კალკულატორი", to: "/#estimator" },
    ],
  },
  {
    title: "სერვისები",
    links: services.slice(0, 6).map((service) => ({ label: service.title, to: `/services#${service.slug}` })),
  },
  {
    title: "სტუდია",
    links: [
      { label: "ჩვენ შესახებ", to: "/about" },
      { label: "კონტაქტი", to: "/contact" },
      { label: "პროექტის დაწყება", to: "/contact" },
      { label: "{email}", href: "mailto:{email}" },
    ],
  },
  {
    title: "გვიპოვეთ აქ",
    // თავად ბმულები (GitHub, LinkedIn ...) არის src/data/site.js-ში და ისე ჩანს, როგორც არის.
    socials: true,
  },
];

export const legalLinks = [
  { label: "კონფიდენციალურობის პოლიტიკა", to: "/privacy" },
  { label: "მომსახურების პირობები", to: "/terms" },
];
