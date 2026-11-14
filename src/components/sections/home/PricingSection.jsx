import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PricingTable } from "@/components/sections/pricing/PricingTable";
import { useContent } from "@/i18n/I18nContext";
import styles from "./PricingSection.module.scss";

/** Home page pricing: the packages with a care-plan switch. */
export function PricingSection() {
  const { sections } = useContent();
  const text = sections.pricing;

  return (
    <Section id="pricing" tone="muted" aria-labelledby="pricing-heading">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow={text.eyebrow}
          titleId="pricing-heading"
          title={text.title}
          description={text.description}
        />
      </Reveal>
      <div className={styles.table}>
        <PricingTable />
      </div>
    </Section>
  );
}
