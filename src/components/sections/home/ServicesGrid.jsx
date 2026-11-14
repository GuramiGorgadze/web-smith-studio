import { ArrowRight } from "lucide-react";
import { IconTile } from "@/components/common/IconTile";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { ButtonLink } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { formatUSD } from "@/lib/format";
import styles from "./ServicesGrid.module.scss";

/** Six service cards with a pointer-following spotlight. */
export function ServicesGrid() {
  const { content, ui, t } = useI18n();
  const text = content.sections.servicesGrid;

  return (
    <Section id="services" aria-labelledby="services-title">
      <Reveal>
        <SectionHeading
          eyebrow={text.eyebrow}
          titleId="services-title"
          title={text.title}
          description={text.description}
          actions={
            <ButtonLink to="/services" variant="outline" iconRight={<ArrowRight size={16} />}>
              {text.cta}
            </ButtonLink>
          }
        />
      </Reveal>

      <ul className={styles.grid}>
        {content.services.map((service, index) => (
          <Reveal as="li" key={service.slug} delay={(index % 3) * 90} className={styles.cell}>
            <SpotlightCard className={styles.card}>
              <IconTile name={service.icon} />
              <div className={styles.body}>
                <span className={styles.eyebrow}>{service.eyebrow}</span>
                <h3 className={styles.title}>
                  <Link to={`/services#${service.slug}`} className={styles.link}>
                    {service.title}
                  </Link>
                </h3>
                <p className={styles.summary}>{service.summary}</p>
              </div>
              <div className={styles.foot}>
                <span className={styles.price}>
                  {t(service.recurring === "monthly" ? ui.prices.fromMonthly : ui.prices.from, {
                    price: formatUSD(service.from),
                  })}
                </span>
                <ArrowRight size={18} className={styles.arrow} aria-hidden="true" />
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
