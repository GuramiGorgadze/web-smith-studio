import { IconTile } from "@/components/common/IconTile";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useContent } from "@/i18n/I18nContext";
import styles from "./IncludedSection.module.scss";

/** The essentials that come with every project. Used on the Services and Pricing pages. */
export function IncludedSection({ tone = "muted", id = "included" }) {
  const { included, sections } = useContent();
  const text = sections.included;

  return (
    <Section id={id} tone={tone} aria-labelledby={`${id}-heading`}>
      <Reveal>
        <SectionHeading
          eyebrow={text.eyebrow}
          titleId={`${id}-heading`}
          title={text.title}
          description={text.description}
        />
      </Reveal>

      <ul className={styles.grid}>
        {included.map((item, index) => (
          <Reveal as="li" key={item.icon + item.title} delay={(index % 4) * 70} className={styles.item}>
            <IconTile name={item.icon} />
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.body}>{item.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
