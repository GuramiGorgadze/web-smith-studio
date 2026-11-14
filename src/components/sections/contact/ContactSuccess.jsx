import { CircleCheck, Mail, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { Rich } from "@/i18n/Rich";
import styles from "./ContactSuccess.module.scss";

/**
 * Replaces the form after a successful submit. Focus moves to the heading so screen reader users
 * hear the result, and the panel explains what happens next.
 *
 * `mode` is "endpoint" when a form service received the message, or "mailto" when the visitor's
 * email app was opened and still needs a press on Send.
 */
export function ContactSuccess({ name, email, mode, mailtoHref, onReset }) {
  const { t, site, content } = useI18n();
  const text = content.contact.success;
  const headingRef = useRef(null);
  const firstName = name.trim().split(/\s+/)[0];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className={styles.panel} role="status">
      <span className={styles.badge} aria-hidden="true">
        <CircleCheck size={28} strokeWidth={1.75} />
      </span>

      <h2 ref={headingRef} tabIndex={-1} className={styles.title}>
        {t(mode === "mailto" ? text.titleMailto : text.titleSent, { firstName })}
      </h2>

      {mode === "mailto" ? (
        <>
          <p className={styles.body}>
            <Rich text={text.mailtoPress} />
          </p>
          <p className={styles.body}>
            <Rich
              text={text.mailtoFallback}
              tags={{
                mail: (children) => (
                  <a href={`mailto:${site.email}`} className={styles.link}>
                    {children}
                  </a>
                ),
              }}
            />
          </p>
        </>
      ) : (
        <p className={styles.body}>
          <Rich
            text={text.bodySent}
            vars={{ visitorEmail: email }}
            tags={{ to: (children) => <strong className={styles.email}>{children}</strong> }}
          />
        </p>
      )}

      <div className={styles.actions}>
        {mode === "mailto" ? (
          <Button asChild>
            <a href={mailtoHref}>
              <Mail size={16} aria-hidden="true" />
              {text.openMail}
            </a>
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw size={16} aria-hidden="true" />
          {text.again}
        </Button>
      </div>
    </div>
  );
}
