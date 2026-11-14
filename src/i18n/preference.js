const KEY = "wss-locale";

/** The language the visitor picked with the language switch on an earlier visit, if any. */
export function readStoredLocale(locales) {
  try {
    const value = window.localStorage.getItem(KEY);
    return locales.includes(value) ? value : null;
  } catch {
    // Private windows and blocked storage throw. Not remembering the choice is harmless.
    return null;
  }
}

export function storeLocale(locale) {
  try {
    window.localStorage.setItem(KEY, locale);
  } catch {
    // See above.
  }
}
