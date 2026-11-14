/**
 * Languages and address rules for the site. This file is plain JavaScript with no browser or Vite
 * features, so the build script (vite.config.js) and the tests can import it too.
 *
 * To add a language: add its code to LOCALES, describe it in LOCALE_META, then create src/content/<code>/
 * with the same files as src/content/en/ (the tests in tests/ tell you what is missing).
 */

/**
 * The languages the site is published in. The routes (/ka/...), the sitemap, the hreflang tags and the
 * first-visit language redirect all follow this list.
 *
 * Georgian is switched off for now: there is no /ka address and no language button. Its words in
 * src/content/ka/ are kept up to date and still checked by the tests. To switch it back on, uncomment "ka"
 * below and the <LanguageSwitch /> lines in Navbar.jsx, MobileNav.jsx and Footer.jsx (src/components/layout/).
 */
export const LOCALES = Object.freeze([
  "en",
  // "ka",
]);

export const LOCALE_META = Object.freeze({
  en: Object.freeze({
    code: "en",
    name: "English",
    nativeName: "English",
    // Short label for the language switch.
    short: "EN",
    ogLocale: "en_US",
  }),
  ka: Object.freeze({
    code: "ka",
    name: "Georgian",
    nativeName: "ქართული",
    short: "ქარ",
    ogLocale: "ka_GE",
  }),
});

/** Anything that is not a published language code falls back to English. */
export function normalizeDefaultLocale(value, locales = LOCALES) {
  return locales.includes(value) ? value : "en";
}

/**
 * Address helpers for one choice of default language.
 *
 * The default language lives at the plain addresses (`/work`), every other language under its code
 * (`/ka/work`). Content paths are always written without a language ("/work"); `localize` adds it.
 * `locales` is the list of published languages; the tests pass their own list to check two languages.
 */
export function createRouting(defaultLocale = "en", locales = LOCALES) {
  const fallback = normalizeDefaultLocale(defaultLocale, locales);

  /** "" for the default language, "/ka" for the others. */
  const prefix = (locale) => (locale === fallback ? "" : `/${locale}`);

  /** "/ka/work/x" -> { locale: "ka", path: "/work/x" }; "/work" -> { locale: default, path: "/work" }. */
  function strip(pathname = "/") {
    const [, first = "", ...rest] = String(pathname).split("/");
    const code = first.toLowerCase();

    for (const locale of locales) {
      if (locale !== fallback && code === locale) return { locale, path: `/${rest.join("/")}` };
    }
    return { locale: fallback, path: pathname || "/" };
  }

  /**
   * Puts a site path into a language: "/work" -> "/ka/work", "/" -> "/ka", "/#process" -> "/ka#process".
   * Anything that is not a site path (a "#hash", "?query", full URL or mailto) comes back unchanged.
   */
  function localize(to, locale) {
    if (typeof to !== "string" || !to.startsWith("/") || to.startsWith("//")) return to;

    const lead = prefix(locale);
    if (!lead) return to;
    if (to === "/") return lead;
    if (to.startsWith("/#") || to.startsWith("/?")) return lead + to.slice(1);
    return lead + to;
  }

  /** Every language version of one site path, for hreflang tags and the sitemap. */
  function alternates(path) {
    return locales.map((locale) => ({ locale, path: localize(path, locale) }));
  }

  /** The first browser language we publish in, or the default. `preferences` is like navigator.languages. */
  function pick(preferences = []) {
    for (const tag of preferences) {
      const primary = String(tag).toLowerCase().split("-")[0];
      if (locales.includes(primary)) return primary;
    }
    return fallback;
  }

  return { defaultLocale: fallback, locales, prefix, strip, localize, alternates, pick };
}
