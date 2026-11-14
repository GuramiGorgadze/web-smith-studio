/**
 * "Tuesday, November 10, 2026 at 7:06 PM GMT+4", in the studio's time zone and language.
 * @param {Date} date
 * @param {"en" | "ka"} locale
 * @param {string} timeZone  An IANA name such as "Asia/Tbilisi".
 */
export function formatReceived(date, locale, timeZone) {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(date);
}

/**
 * A full address on the website for a language. The default language lives at the root,
 * every other language under its own prefix (/ka/work).
 *
 * @param {{ url: string, defaultLocale: string }} site
 * @param {"en" | "ka"} locale
 * @param {string} [pathname]  Starts with a slash.
 */
export function localizedUrl(site, locale, pathname = "/") {
  const prefix = locale === site.defaultLocale ? "" : `/${locale}`;
  return `${site.url}${prefix}${pathname}`;
}
