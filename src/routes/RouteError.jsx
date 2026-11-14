import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui";
import { routing } from "@/i18n/config";
import { fallbackText } from "@/i18n/fallback";
import { upsertMeta } from "@/lib/head";
import styles from "./RouteError.module.scss";

/**
 * Last-resort screen if a route fails to load (for example, a chunk that could not be fetched offline).
 * It must work without the language content (that may be what failed), so it uses plain links and the
 * built-in words in src/i18n/fallback.js, in the language of the address.
 */
export function RouteError() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : null;
  const { locale } = routing.strip(window.location.pathname);
  const text = fallbackText[locale];
  const home = routing.localize("/", locale);

  useEffect(() => {
    document.title = text.errorHeadTitle;
    document.documentElement.lang = locale;
    upsertMeta("name", "robots", "noindex, nofollow");
  }, [text, locale]);

  return (
    <div className={styles.wrap} role="alert" lang={locale}>
      <a href={home} className={styles.brand}>
        <Logo size={36} asLink={false} />
      </a>
      <h1 className={styles.title}>{status === 404 ? text.notFoundTitle : text.errorTitle}</h1>
      <p className={styles.text}>{text.errorText}</p>
      <div className={styles.actions}>
        <ButtonLink href={home} size="lg">
          {text.home}
        </ButtonLink>
        <button type="button" className={styles.retry} onClick={() => window.location.reload()}>
          {text.reload}
        </button>
      </div>
      <a href={routing.localize("/contact", locale)} className={styles.help}>
        {text.help}
      </a>
    </div>
  );
}
