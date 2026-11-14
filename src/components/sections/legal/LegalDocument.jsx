import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { Rich } from "@/i18n/Rich";
import styles from "./LegalDocument.module.scss";

/**
 * A long-form policy: a "on this page" list beside numbered sections of plain text.
 * Each section has an `id` in the content file; it is the address of the section and never changes with the language.
 */
export function LegalDocument({ doc }) {
  const { t, site, content } = useI18n();
  const text = content.pages.legal;

  return (
    <Section spacing="tight" aria-label={doc.title}>
      <div className={styles.layout}>
        <nav className={styles.toc} aria-label={text.onThisPage}>
          <p className={styles.tocTitle}>{text.onThisPage}</p>
          <ol className={styles.tocList}>
            {doc.sections.map((section) => (
              <li key={section.id}>
                <Link to={{ hash: `#${section.id}` }} className={styles.tocLink}>
                  {section.heading}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <Reveal as="article" className={styles.article}>
          <p className={styles.updated}>{t(text.updated, { date: doc.updated })}</p>

          {doc.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
              aria-labelledby={`${section.id}-title`}
            >
              <h2 id={`${section.id}-title`} className={styles.heading}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className={styles.text}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <p className={styles.contact}>
            <Rich
              text={text.contact}
              tags={{
                mail: (children) => (
                  <a href={`mailto:${site.email}`} className={styles.link}>
                    {children}
                  </a>
                ),
              }}
            />
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
