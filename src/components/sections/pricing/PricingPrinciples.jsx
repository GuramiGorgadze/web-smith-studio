import { IconTile } from "@/components/common/IconTile";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useContent } from "@/i18n/I18nContext";
import styles from "./PricingPrinciples.module.scss";

/** Three promises that explain how quotes and payments work. */
export function PricingPrinciples({ tone = "muted" }) {
  const { pricing, sections } = useContent();
  const text = sections.pricingPrinciples;

  return (
    <Section id="how-pricing-works" tone={tone} aria-labelledby="how-pricing-works-heading">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow={text.eyebrow}
          titleId="how-pricing-works-heading"
          title={text.title}
          description={text.description}
        />
      </Reveal>

      <ol className={styles.grid}>
        {pricing.principles.map((item, index) => (
          <Reveal as="li" key={item.icon} delay={index * 90} className={styles.item}>
            <div className={styles.top}>
              <IconTile name={item.icon} />
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.body}>{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
