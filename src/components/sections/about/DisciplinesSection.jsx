import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ButtonLink } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import styles from "./DisciplinesSection.module.scss";

/** The four disciplines that make up a project, shown as a numbered row. */
export function DisciplinesSection({ tone = "default" }) {
  const { disciplines, sections } = useContent();
  const text = sections.disciplines;

  return (
    <Section id="disciplines" tone={tone} aria-labelledby="disciplines-heading">
      <Reveal>
        <SectionHeading
          eyebrow={text.eyebrow}
          titleId="disciplines-heading"
          title={text.title}
          description={text.description}
          actions={
            <ButtonLink to="/services" variant="outline" iconRight={<ArrowRight size={16} />}>
              {text.cta}
            </ButtonLink>
          }
        />
      </Reveal>

      <ol className={styles.grid}>
        {disciplines.map((item, index) => (
          <Reveal as="li" key={item.title} delay={index * 80} className={styles.item}>
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.body}>{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
