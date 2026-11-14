// Relative imports with extensions on purpose: this file is also loaded by Node (the tests), which has no "@" alias.
import { LOCALES, LOCALE_META } from "./locales.js";
import { format, pluralize } from "./text.js";

/**
 * Everything a component needs to know about the current language, in one object.
 *
 * `routing` comes from createRouting() (src/i18n/locales.js). It is passed in, not imported, so this
 * file does not depend on the build environment.
 */
export function createI18n(locale, content, routing) {
  const { site, ui } = content;

  // Values every string may use without being told: {name}, {email}, {responseTime} and {founded}.
  const baseVars = { name: site.name, email: site.email, responseTime: site.responseTime, founded: site.founded };

  return {
    locale,
    defaultLocale: routing.defaultLocale,
    meta: LOCALE_META[locale],
    languages: LOCALES.map((code) => LOCALE_META[code]),
    content,
    site,
    ui,
    baseVars,

    /** Puts a site path into this language: "/work" -> "/ka/work". Other kinds of addresses pass through. */
    path: (to) => routing.localize(to, locale),
    /** The same, for a language of your choice. */
    pathIn: (to, targetLocale) => routing.localize(to, targetLocale),
    /** "/ka/work" -> "/work": the path as written in the content files. */
    neutralPath: (pathname) => routing.strip(pathname).path,
    /** Every language version of one site path, for hreflang tags. */
    alternates: (to) => routing.alternates(to),

    /** Fills {name} marks in a translated string. */
    t: (template, vars) => format(template, { ...baseVars, ...vars }),
    /** Chooses singular or plural: count({ one: "{count} page", other: "{count} pages" }, 3). */
    count: (forms, number, vars) => pluralize(locale, number, forms, { ...baseVars, ...vars }),
  };
}
