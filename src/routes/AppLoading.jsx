import { LogoMark } from "@/components/brand/LogoMark";
import { routing } from "@/i18n/config";
import { fallbackText } from "@/i18n/fallback";
import styles from "./AppLoading.module.scss";

/** Shown for a moment while the first page chunk and the language's content download. */
export function AppLoading() {
  // The language's content is exactly what is still loading, so the word comes from the address.
  const { locale } = routing.strip(window.location.pathname);

  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <LogoMark size={48} className={styles.mark} />
      <span className="srOnly" lang={locale}>
        {fallbackText[locale].loading}
      </span>
    </div>
  );
}
