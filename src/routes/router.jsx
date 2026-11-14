import { createBrowserRouter, redirect } from "react-router-dom";
import { AppLoading } from "@/routes/AppLoading";
import { RouteError } from "@/routes/RouteError";
import { DEFAULT_LOCALE, routing } from "@/i18n/config";
import { loadContent } from "@/i18n/loadContent";
import { LocaleRoute } from "@/i18n/LocaleRoute";
import { LOCALES } from "@/i18n/locales";
import { readStoredLocale } from "@/i18n/preference";

// Each page is its own lazy chunk, so visitors only download what they open.
const page = (loader) => async () => ({ Component: (await loader()).default });

// Every language has the same pages. Keep in step with `pageRoutes` in vite.config.js (the sitemap).
const pages = () => [
  { index: true, lazy: page(() => import("@/pages/Home/HomePage")) },
  { path: "services", lazy: page(() => import("@/pages/Services/ServicesPage")) },
  { path: "work", lazy: page(() => import("@/pages/Work/WorkPage")) },
  { path: "work/:slug", lazy: page(() => import("@/pages/WorkDetail/WorkDetailPage")) },
  { path: "pricing", lazy: page(() => import("@/pages/Pricing/PricingPage")) },
  { path: "about", lazy: page(() => import("@/pages/About/AboutPage")) },
  { path: "contact", lazy: page(() => import("@/pages/Contact/ContactPage")) },
  { path: "privacy", lazy: page(() => import("@/pages/Privacy/PrivacyPage")) },
  { path: "terms", lazy: page(() => import("@/pages/Terms/TermsPage")) },
  { path: "*", lazy: page(() => import("@/pages/NotFound/NotFoundPage")) },
];

let firstLoad = true;

/**
 * Loads a language's content before its pages render. On the very first load of the plain home address
 * ("/") a visitor whose browser (or earlier choice with the language switch) prefers another language we
 * publish in is sent to that version once. Deep links, in-app navigation and crawlers are never redirected.
 */
function contentLoader(locale) {
  return async ({ request }) => {
    const isFirstLoad = firstLoad;
    firstLoad = false;

    if (isFirstLoad && locale === DEFAULT_LOCALE) {
      const url = new URL(request.url);
      if (url.pathname === "/") {
        const wanted = readStoredLocale(LOCALES) ?? routing.pick(window.navigator.languages);
        if (wanted !== DEFAULT_LOCALE) throw redirect(`${routing.localize("/", wanted)}${url.search}`);
      }
    }

    return loadContent(locale);
  };
}

function localeRoute(locale) {
  return {
    id: `site-${locale}`,
    path: routing.prefix(locale) || "/",
    element: <LocaleRoute locale={locale} />,
    loader: contentLoader(locale),
    // A language's content never changes while the site is open, so moving between pages or changing
    // the query string must not load it again.
    shouldRevalidate: () => false,
    hydrateFallbackElement: <AppLoading />,
    errorElement: <RouteError />,
    children: pages(),
  };
}

export const router = createBrowserRouter([
  // "/en/work" (the default language with its code in front) goes to "/work".
  {
    id: "default-language-prefix",
    path: `/${DEFAULT_LOCALE}/*`,
    loader: ({ params, request }) => redirect(`/${params["*"] ?? ""}${new URL(request.url).search}`),
    errorElement: <RouteError />,
  },
  ...LOCALES.map(localeRoute),
]);
