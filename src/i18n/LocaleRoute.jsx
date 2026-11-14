import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { I18nProvider } from "@/i18n/I18nContext";

/**
 * The route element of one language: gives the page tree that language's content (loaded by the route's
 * loader), keeps <html lang> in step so browsers and screen readers pick the right voice and font, and
 * renders the shared site layout.
 */
export function LocaleRoute({ locale }) {
  const content = useLoaderData();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nProvider locale={locale} content={content}>
      <SiteLayout />
    </I18nProvider>
  );
}
