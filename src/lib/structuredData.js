import { absoluteUrl } from "@/lib/url";

const CONTEXT = "https://schema.org";

/**
 * schema.org data for search engines. The functions that depend on the language take `i18n`, which is
 * what useI18n() returns, so the names, descriptions and addresses are those of the page being viewed.
 */

/** The studio itself. Deliberately limited to facts that are already public on the page. */
export function organizationJsonLd(i18n) {
  const { site, ui, languages, path } = i18n;

  return {
    "@context": CONTEXT,
    "@type": "ProfessionalService",
    name: site.name,
    url: absoluteUrl(path("/")),
    description: site.description,
    logo: absoluteUrl("/brand/logo-mark.svg"),
    image: absoluteUrl(site.ogImage),
    areaServed: ui.seo.areaServed,
    knowsLanguage: languages.map((language) => language.code),
    serviceType: ui.seo.serviceTypes,
  };
}

/** Question and answer pairs, for example `content.faqs.items`. */
export function faqJsonLd(items) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Breadcrumb trail, for example `breadcrumbJsonLd(i18n, [{ name: "Work", path: "/work" }])`.
 * Paths are written without a language; the current language is added here.
 */
export function breadcrumbJsonLd(i18n, trail) {
  const items = [{ name: i18n.ui.seo.home, path: "/" }, ...trail];

  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(i18n.path(item.path)),
    })),
  };
}
