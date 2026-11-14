import { createContext, useContext, useMemo } from "react";
import { routing } from "@/i18n/config";
import { createI18n } from "@/i18n/createI18n";

const I18nContext = createContext(null);

/** Makes one language's content available to everything below it. Mounted by the language route. */
export function I18nProvider({ locale, content, children }) {
  const value = useMemo(() => createI18n(locale, content, routing), [locale, content]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** The current language, its content, and the helpers for addresses and translated strings. */
export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside the language route (see src/routes/router.jsx).");
  return value;
}

/** Just the content of the current language: `const { services, ui } = useContent();` */
export function useContent() {
  return useI18n().content;
}
