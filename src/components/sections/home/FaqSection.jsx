import { ArrowRight } from "lucide-react";
import { CheckList } from "@/components/common/CheckList";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FaqList } from "@/components/sections/faq/FaqList";
import { ButtonLink } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import styles from "./FaqSection.module.scss";

/** Two columns on desktop: a sticky intro with reassurance on the left, the accordion on the right. */
export function FaqSection({ tone = "default" }) {
  const { faqs, sections } = useContent();
  const text = sections.faq;

  return (
    <Section id="faq" tone={tone} aria-labelledby="faq-heading">
      <div className={styles.layout}>
        <Reveal className={styles.intro}>
          <SectionHeading
            eyebrow={text.eyebrow}
            titleId="faq-heading"
            title={text.title}
            description={text.description}
          />

          <div className={styles.aside} role="group" aria-labelledby="faq-aside-title">
            <h3 id="faq-aside-title" className={styles.asideTitle}>
              {faqs.aside.title}
            </h3>
            <CheckList items={faqs.aside.points} tone="muted" />
            <ButtonLink to="/contact" variant="outline" iconRight={<ArrowRight size={16} />}>
              {text.ask}
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={100} className={styles.list}>
          <FaqList />
        </Reveal>
      </div>
    </Section>
  );
}
