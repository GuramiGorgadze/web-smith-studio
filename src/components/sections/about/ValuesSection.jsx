import { IconTile } from "@/components/common/IconTile";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { useContent } from "@/i18n/I18nContext";
import styles from "./ValuesSection.module.scss";

/** Six principles that guide every project. */
export function ValuesSection({ tone = "muted" }) {
  const { values, sections } = useContent();
  const text = sections.values;

  return (
    <Section id="values" tone={tone} aria-labelledby="values-heading">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow={text.eyebrow}
          titleId="values-heading"
          title={text.title}
          description={text.description}
        />
      </Reveal>

      <ul className={styles.grid}>
        {values.map((value, index) => (
          <Reveal as="li" key={value.icon} delay={(index % 3) * 80} className={styles.cell}>
            <SpotlightCard className={styles.card}>
              <IconTile name={value.icon} />
              <h3 className={styles.title}>{value.title}</h3>
              <p className={styles.body}>{value.body}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
