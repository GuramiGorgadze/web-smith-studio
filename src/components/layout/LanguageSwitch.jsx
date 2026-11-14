import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { storeLocale } from "@/i18n/preference";
import { cn } from "@/lib/cn";
import styles from "./LanguageSwitch.module.scss";

/**
 * Takes the visitor to the same page, same query and same #section in another language.
 *
 * - `variant="toggle"` (header): one button that shows the other language. Compact and always visible.
 * - `variant="segmented"` (menu, footer): every language side by side with the current one marked.
 *
 * Each language is written in its own language, so a visitor can always find theirs. The choice is
 * remembered (see src/i18n/preference.js) so the next visit to the home address opens in that language.
 */
export function LanguageSwitch({ variant = "toggle", className }) {
  const { locale, languages, pathIn, neutralPath, ui } = useI18n();
  const { pathname, search, hash } = useLocation();
  const here = neutralPath(pathname);

  const hrefFor = (code) => `${pathIn(here, code)}${search}${hash}`;

  if (variant === "toggle") {
    // With two languages the "other" one is exactly one choice. With more, use the segmented variant.
    const other = languages.find((language) => language.code !== locale);
    if (!other) return null;

    return (
      <Link
        to={hrefFor(other.code)}
        hrefLang={other.code}
        lang={other.code}
        aria-label={other.nativeName}
        title={other.nativeName}
        className={cn(styles.toggle, className)}
        onClick={() => storeLocale(other.code)}
      >
        {other.short}
      </Link>
    );
  }

  return (
    <div role="group" aria-label={ui.language.label} className={cn(styles.segmented, className)}>
      {languages.map((language) =>
        language.code === locale ? (
          <span key={language.code} lang={language.code} className={cn(styles.option, styles.current)} aria-current="true">
            {language.nativeName}
          </span>
        ) : (
          <Link
            key={language.code}
            to={hrefFor(language.code)}
            hrefLang={language.code}
            lang={language.code}
            className={styles.option}
            onClick={() => storeLocale(language.code)}
          >
            {language.nativeName}
          </Link>
        ),
      )}
    </div>
  );
}
